namespace maritz_app.Server
{
    public class EmployeeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int Points { get; set; }
    }

    public class AwardPointsRequest 
    {
        public int Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class RedeemPointsRequest 
    {
        public int Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
