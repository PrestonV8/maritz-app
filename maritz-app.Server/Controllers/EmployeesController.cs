using Microsoft.AspNetCore.Mvc;

namespace maritz_app.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private static readonly List<EmployeeModel> _employees = new()
        {
            new EmployeeModel {Id = 1, Name = "Alice", Department = "Sales", Points = 100 },
            new EmployeeModel { Id = 2, Name = "Bob", Department = "Marketing", Points = 150 },
            new EmployeeModel { Id = 3, Name = "Charlie", Department = "Engineering", Points = 200 }
        };

        [HttpGet]
        public ActionResult<IEnumerable<EmployeeModel>> GetEmployees() 
        {
            return Ok(_employees);
        }

        [HttpGet("{id}")]
        public ActionResult<EmployeeModel> GetEmployee(int id) 
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
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
        public ActionResult<EmployeeModel> AwardPoints(int id, AwardPointsRequest request) 
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.Points += request.Amount;
            return Ok(employee);
        }
    }
}
