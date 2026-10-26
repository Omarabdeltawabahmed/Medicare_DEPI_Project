using Medicare_DEPI.Data;
using Medicare_DEPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medicare_DEPI.Controllers
{
    [ApiController]
    [Route("api/specializations")]
    public class SpecializationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecializationsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/specializations 
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var specializations = await _context.Specializations.AsNoTracking().ToListAsync();
            return Ok(specializations);
        }

        // 2. GET: api/specializations/5 
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var spec = await _context.Specializations.FindAsync(id);
            if (spec == null)
            {
                return NotFound(new { message = "Specialization not found." });
            }

            return Ok(spec);
        }

        // 3. POST: api/specializations 
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Specialization model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool exists = await _context.Specializations.AnyAsync(s => s.Name.ToLower() == model.Name.ToLower() || s.NameAr == model.NameAr);

            if (exists)
            {
                return Conflict(new { message = "Specialization already exists in English or Arabic." });
            }

            _context.Specializations.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        // 4. PUT: api/specializations/5 
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Specialization model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSpec = await _context.Specializations.FindAsync(id);
            if (existingSpec == null)
            {
                return NotFound(new { message = "Specialization not found." });
            }

            bool duplicate = await _context.Specializations.AnyAsync(s => s.Id != id && (s.Name.ToLower() == model.Name.ToLower() || s.NameAr == model.NameAr));

            if (duplicate)
            {
                return Conflict(new { message = "Another specialization with this name already exists." });
            }

            existingSpec.Name = model.Name;
            existingSpec.NameAr = model.NameAr;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Specialization updated successfully.", data = existingSpec });
        }

        // 5. DELETE: api/specializations/5 
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var spec = await _context.Specializations.FindAsync(id);
            if (spec == null)
            {
                return NotFound(new { message = "Specialization not found." });
            }

            _context.Specializations.Remove(spec);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Specialization deleted successfully." });
        }
    }
}