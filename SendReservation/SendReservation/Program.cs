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
                    channel.QueueDeclare(queue: "hello",
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

                    Reservation reservation = new Reservation { hotelId = 123, checkIn = "1", checkOut = "2", roomNo = 5, customerAddress = "Skjern", customerEmail = "lala@hej.dk", customerName = "Simon"};
                     
                    string message = JsonConvert.SerializeObject(reservation);
                    var body = Encoding.UTF8.GetBytes(message);

                    channel.BasicPublish(exchange: "",
                                 routingKey: "hello",
                                 basicProperties: null,
                                 body: body);
                    Console.WriteLine(" [x] Sent {0}", message);
                }
            }
            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();
        }
    }
}
