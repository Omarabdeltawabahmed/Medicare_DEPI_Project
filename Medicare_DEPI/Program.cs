using Medicare_DEPI.Data;
using Medicare_DEPI.Filters;
using Medicare_DEPI.IRepositories;
using Medicare_DEPI.Repositories;
using Medicare_DEPI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddSignalR();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyCon")));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<CheckDoctorApprovalFilter>();

builder.Services.AddHttpClient<IGeminiService, GeminiService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Medicare API v1");
    });

    // Automatically redirect root URL to Swagger UI
    app.MapGet("/", () => Results.Redirect("/swagger"));
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<Medicare_DEPI.Hubs.NotificationHub>("/hubs/notifications");

app.Run();
