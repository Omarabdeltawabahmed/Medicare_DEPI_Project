using MediCare.Data.Models;
using MediCare.Data.Repositories;

namespace MediCare.Data.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<DoctorProfile> Doctors { get; }

    IGenericRepository<Appointment> Appointments { get; }

    IGenericRepository<Specialization> Specializations { get; }

    IGenericRepository<MedicalRecord> MedicalRecords { get; }

    IGenericRepository<Prescription> Prescriptions { get; }

    IGenericRepository<PrescriptionItem> PrescriptionItems { get; }

    IGenericRepository<ErrorLog> ErrorLogs { get; }

    Task<int> SaveAsync();
}
