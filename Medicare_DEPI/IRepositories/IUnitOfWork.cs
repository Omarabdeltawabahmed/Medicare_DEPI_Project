using Medicare_DEPI.Models;

namespace Medicare_DEPI.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Specialization> Specializations { get; }
        IGenericRepository<MedicalRecord> MedicalRecords { get; }
        IGenericRepository<Prescription> Prescriptions { get; }
        IGenericRepository<PrescriptionItem> PrescriptionItems { get; }
        Task<int> SaveAsync();
    }
}