using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace maritz_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployees() 
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeModel>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            else 
            {
                return Ok(employee);
            } 
        }

        [HttpPost("{id}/award")]
        public async Task<ActionResult<EmployeeModel>> AwardPoints(int id, AwardPointsRequest request)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.Points += request.Amount;
            await _context.SaveChangesAsync();

            return Ok(employee);
        }
    }
}
