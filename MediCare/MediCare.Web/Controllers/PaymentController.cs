
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Stripe;
using Stripe.Checkout;

using MediCare.Data.UnitOfWork;
using MediCare.Services.DTOs.Payments;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<PaymentController> logger)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
    }

    // POST: api/payment/create-checkout-session
    [HttpPost("create-checkout-session")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> CreateCheckoutSession(
        [FromBody] CreateCheckoutSessionDto dto)
    {
        var patientId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(patientId))
            return Unauthorized();

        var appointment = await _unitOfWork.Appointments
            .GetByIdAsync(dto.AppointmentId);

        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Appointment not found."
            });
        }

        if (appointment.PatientId != patientId)
        {
            return Forbid();
        }

        if (appointment.Status != "PendingPayment" ||
            appointment.PaymentStatus != "Pending")
        {
            return BadRequest(new
            {
                message = "This appointment is not awaiting payment."
            });
        }

        if (appointment.ExpiresAtUtc.HasValue &&
            appointment.ExpiresAtUtc.Value <= DateTime.UtcNow)
        {
            appointment.Status = "Cancelled";

            _unitOfWork.Appointments.Update(appointment);

            await _unitOfWork.SaveAsync();

            return BadRequest(new
            {
                message = "Booking has expired. Please book again."
            });
        }

        var secretKey = _configuration["Stripe:SecretKey"];

        var successUrl = _configuration["Stripe:SuccessUrl"];

        var cancelUrl = _configuration["Stripe:CancelUrl"];

        var currency = _configuration["Stripe:Currency"] ?? "egp";

        if (string.IsNullOrWhiteSpace(secretKey) ||
            string.IsNullOrWhiteSpace(successUrl) ||
            string.IsNullOrWhiteSpace(cancelUrl))
        {
            return StatusCode(500, new
            {
                message = "Stripe configuration is missing."
            });
        }

        StripeConfiguration.ApiKey = secretKey;

        var expiresAt = DateTime.UtcNow.AddMinutes(31);

        var options = new SessionCreateOptions
        {
            Mode = "payment",

            SuccessUrl = successUrl,

            CancelUrl = cancelUrl,

            ClientReferenceId = appointment.Id.ToString(),

            ExpiresAt = expiresAt,

            Metadata = new Dictionary<string, string>
            {
                {
                    "AppointmentId",
                    appointment.Id.ToString()
                }
            },

            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Quantity = 1,

                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = currency,

                        UnitAmount = (long)(
                            appointment.DepositAmount * 100m),

                        ProductData =
                            new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "MediCare Appointment Deposit"
                            }
                    }
                }
            }
        };

        try
        {
            var service = new SessionService();

            var session = await service.CreateAsync(options);

            // Extend the reservation to match the checkout session.
            appointment.ExpiresAtUtc = expiresAt;

            _unitOfWork.Appointments.Update(appointment);

            await _unitOfWork.SaveAsync();

            return Ok(new
            {
                message = "Checkout session created successfully.",

                checkoutUrl = session.Url,

                sessionId = session.Id,

                appointmentId = appointment.Id
            });
        }
        catch (StripeException ex)
        {
            _logger.LogError(
                ex,
                "Stripe checkout session creation failed.");

            return BadRequest(new
            {
                message = "Unable to create payment session."
            });
        }
    }

    // POST: api/payment/webhook
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(
            HttpContext.Request.Body).ReadToEndAsync();

        var signature = Request.Headers["Stripe-Signature"];

        var webhookSecret =
            _configuration["Stripe:WebhookSecret"];

        if (string.IsNullOrWhiteSpace(webhookSecret))
        {
            _logger.LogError("Stripe webhook secret is missing.");

            return StatusCode(500);
        }

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                signature,
                webhookSecret);
        }
        catch (StripeException ex)
        {
            _logger.LogWarning(
                ex,
                "Invalid Stripe webhook signature.");

            return BadRequest();
        }

        if (stripeEvent.Type != "checkout.session.completed")
        {
            return Ok();
        }

        var session = stripeEvent.Data.Object as Session;

        if (session == null)
            return BadRequest();

        if (session.PaymentStatus != "paid")
            return Ok();

        if (session.Metadata == null ||
            !session.Metadata.TryGetValue(
                "AppointmentId",
                out var appointmentIdValue) ||
            !int.TryParse(
                appointmentIdValue,
                out var appointmentId))
        {
            _logger.LogWarning(
                "Stripe session does not contain a valid appointment ID.");

            return BadRequest();
        }

        var appointment = await _unitOfWork.Appointments
            .GetByIdAsync(appointmentId);

        if (appointment == null)
        {
            _logger.LogWarning(
                "Appointment {AppointmentId} was not found.",
                appointmentId);

            return Ok();
        }

        var expectedAmount = (long)(
            appointment.DepositAmount * 100m);

        if (session.AmountTotal != expectedAmount ||
            !string.Equals(
                session.Currency,
                _configuration["Stripe:Currency"] ?? "egp",
                StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning(
                "Payment amount or currency mismatch for appointment {AppointmentId}.",
                appointmentId);

            return BadRequest();
        }

        // Handle duplicate webhook delivery.
        if (appointment.PaymentStatus == "Paid")
            return Ok();

        appointment.PaymentStatus = "Paid";

        // Never confirm a booking whose reservation has expired.
        if (appointment.Status == "PendingPayment" &&
            (!appointment.ExpiresAtUtc.HasValue ||
             appointment.ExpiresAtUtc.Value > DateTime.UtcNow))
        {
            appointment.Status = "Confirmed";
        }
        else
        {
            _logger.LogWarning(
                "Payment for expired or cancelled appointment {AppointmentId} was received. Manual refund/review may be required.",
                appointmentId);
        }

        _unitOfWork.Appointments.Update(appointment);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Webhook processed successfully."
        });
    }
}
