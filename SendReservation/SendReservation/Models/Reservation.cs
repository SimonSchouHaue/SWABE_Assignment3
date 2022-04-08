namespace SendReservation.Models
{
    public class Reservation
    {
        public int hotelId { get; set; }
        public string checkIn { get; set; } // ISO 8601 date
        public string checkOut { get; set; } // ISO 8601 date 
        public int roomNo { get; set; }
        public string customerName { get; set; }
        public string customerEmail { get; set; }
        public string customerAddress { get; set;}
    }
}
