using System;
using RabbitMQ.Client;
using System.Text;
using SendReservation.Models;
using Newtonsoft.Json;

namespace Send
{
    class Program
    {
        static void Main(string[] args)
        {
            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    channel.QueueDeclare(queue: "reservationQueue",
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

                    Reservation reservation = new Reservation { hotelId = 124, checkIn = "2024-0-07T12:00:17+01:00", checkOut = "2024-07-07T12:00:17+01:00", roomNo = 5, customerAddress = "Skjern", customerEmail = "lala@hej.dk", customerName = "Simon" };

                    string message = JsonConvert.SerializeObject(reservation);
                    var body = Encoding.UTF8.GetBytes(message);

                    while(true){ 
                    channel.BasicPublish(exchange: "",
                                 routingKey: "reservationQueue",
                                 basicProperties: null,
                                 body: body);
                    Console.WriteLine(" [x] Sent {0}", message);

                    Console.WriteLine(" Press [enter] to Send again. CTRL+C to close");
                    Console.ReadLine();
                    }
                }
            }

        
        }
    }
}
