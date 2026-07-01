# Maritz Full-Stack Application: Rewards Dashboard

Description: 
A rewards program application that awards employees points based on tasks they may have completed in the workplace. The end users would be the managers and other leadership positions that facilitates employees and their productivity. For their points, the end user may select items to redeem certain employee rewards with their points

Tools:
- React
- Vite
- Node.js
- ASP.NET Web API
- SQL Server 
- AWS

Database Creation:
Using the installed NuGet packages (Entity Framework SQL Sever and Tools), the database was created from entity models to define the tables and context to initialize the schema ofthe database and implement the seed data. From the models, EF Core migrations are generated using the Add-Migration command which creates a migration file that contains the necessary SQL statements to create or modify the database schema. The Update-Database command is then used to apply the migration to the database, creating the tables and seeding the data as defined in the models. Through the migrations, the AWS RDS (Relational Database Service) hosts an instantiated version of the migrated database.

Deployment to AWS:
The backend and frontend of the application are packaged for deployment and deployed as an instance on Elastic Beanstalk on AWS. That was chosen because of the ease of use in CLI commands and doesn't require the extensive set up for EC2.

How to deploy onto AWS:
command: dotnet aws deploy