using MediCare.Data.Context;
using MediCare.Data.Models;
using MediCare.Data.Repositories;

namespace MediCare.Data.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IGenericRepository<DoctorProfile> Doctors { get; }

    public IGenericRepository<Appointment> Appointments { get; }

    public IGenericRepository<Specialization> Specializations { get; }

    public IGenericRepository<MedicalRecord> MedicalRecords { get; }

    public IGenericRepository<Prescription> Prescriptions { get; }

    public IGenericRepository<PrescriptionItem> PrescriptionItems { get; }

    public IGenericRepository<ErrorLog> ErrorLogs { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;

        Doctors = new GenericRepository<DoctorProfile>(_context);

        Appointments = new GenericRepository<Appointment>(_context);

        Specializations = new GenericRepository<Specialization>(_context);

        MedicalRecords = new GenericRepository<MedicalRecord>(_context);

        Prescriptions = new GenericRepository<Prescription>(_context);

        PrescriptionItems = new GenericRepository<PrescriptionItem>(_context);

        ErrorLogs = new GenericRepository<ErrorLog>(_context);
    }

    public async Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
