import { Reservation } from "./models/reservation";
import client, { Connection, Channel } from "amqplib";

const startSender = async (): Promise<void> => {
  const connection: Connection = await client.connect("amqp://localhost");

  const channel: Channel = await connection.createChannel();

  let queue = "reservationQueue";
  // Makes the queue available to the client
  await channel.assertQueue(queue, { durable: false });

  let reservation: Reservation = {
    hotelId: 10,
    checkIn: "2022-04-07T12:00:17+01:00",
    checkOut: "2022-04-08T10:00:17+01:00",
    customerName: "Lars Jensen",
    roomNo: 69,
    customerEmail: "lars.jensen@gmail.com",
    customerAddress: "Bakkevej 10",
  };

  let message = JSON.stringify(reservation);
  //Send a message to the queue
  channel.sendToQueue(queue, Buffer.from(message));

  console.log("send message: " + message);
};

startSender();
