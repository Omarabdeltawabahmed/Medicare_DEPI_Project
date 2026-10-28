using Medicare_DEPI.Data;
using Medicare_DEPI.IRepositories;
using Medicare_DEPI.Models;

namespace Medicare_DEPI.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IGenericRepository<Specialization> Specializations { get; }
        public IGenericRepository<MedicalRecord> MedicalRecords { get; }
        public IGenericRepository<Prescription> Prescriptions { get; }
        public IGenericRepository<PrescriptionItem> PrescriptionItems { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Specializations = new GenericRepository<Specialization>(_context);
            MedicalRecords = new GenericRepository<MedicalRecord>(_context);
            Prescriptions = new GenericRepository<Prescription>(_context);
            PrescriptionItems = new GenericRepository<PrescriptionItem>(_context);
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
}