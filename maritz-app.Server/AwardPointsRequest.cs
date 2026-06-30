namespace maritz_app.Server
{
    public class AwardPointsRequest
    {
        public int Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
