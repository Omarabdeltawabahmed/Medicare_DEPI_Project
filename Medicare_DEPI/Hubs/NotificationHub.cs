using Microsoft.AspNetCore.SignalR;

namespace Medicare_DEPI.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinDoctorGroup(string doctorId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Doctor_{doctorId}");
        }

        public async Task JoinPatientGroup(string patientId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Patient_{patientId}");
        }

        public async Task SendNewAppointmentNotification(string doctorId, object appointmentData)
        {
            await Clients.Group($"Doctor_{doctorId}").SendAsync("ReceiveNewAppointment", appointmentData);
        }

        public async Task SendPrescriptionReadyNotification(string patientId, object prescriptionData)
        {
            await Clients.Group($"Patient_{patientId}").SendAsync("PrescriptionReady", prescriptionData);
        }
    }
}