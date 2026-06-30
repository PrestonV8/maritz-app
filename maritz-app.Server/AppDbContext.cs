using maritz_app.Server;
using maritz_app.Server.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<EmployeeModel> Employees => Set<EmployeeModel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Carry over your three seed employees so a fresh DB isn't empty
        modelBuilder.Entity<EmployeeModel>().HasData(
            new EmployeeModel { Id = 1, Name = "Ana Reyes", Department = "Sales", Points = 120 },
            new EmployeeModel { Id = 2, Name = "Marcus Lee", Department = "Service", Points = 80 },
            new EmployeeModel { Id = 3, Name = "Priya Shah", Department = "Marketing", Points = 200 },
            new EmployeeModel { Id = 4, Name = "Kevin Dizon", Department = "Engineering", Points = 150 },
            new EmployeeModel { Id = 5, Name = "Matthew Garcia", Department = "Human Resources", Points = 90 }
        );
    }
}