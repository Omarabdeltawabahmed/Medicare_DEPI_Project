using System.Linq.Expressions;

namespace MediCare.Data.Repositories;

public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);

    Task<List<T>> GetAllAsync();

    Task<List<T>> FindAsync(
        Expression<Func<T, bool>> predicate);

    Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    void Update(T entity);

    void Delete(T entity);
}
