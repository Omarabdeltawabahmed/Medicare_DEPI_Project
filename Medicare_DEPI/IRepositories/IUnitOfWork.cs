using Medicare_DEPI.Models;

namespace Medicare_DEPI.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Specialization> Specializations { get; }
        IGenericRepository<MedicalRecord> MedicalRecords { get; }
        Task<int> SaveAsync();
    }
}