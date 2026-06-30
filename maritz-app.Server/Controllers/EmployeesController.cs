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

        /*
         * Task to retrieve all the employees from the database
         */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployees() 
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        /*
         * Task to retrieve a specific employee by their ID from the database
         */
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

        /*
         * Task to add award points to a specific employee by their ID in the database
         */
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

        /*
         * Task to redeem award points for a specific employee by their ID in the database
         */
        [HttpPut("{id}/award")]
        public async Task<ActionResult<EmployeeModel>> RedeemPoints(int id, RedeemPointsRequest request) 
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) 
            {
                return NotFound();
            }

            employee.Points -= request.Amount;
            await _context.SaveChangesAsync();

            return Ok(employee);
        }
    }
}
