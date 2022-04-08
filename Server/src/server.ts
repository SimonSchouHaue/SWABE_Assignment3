import { Reservation, ReservationSchema } from "./models/reservation-schema";
import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment3"
);

const ReservationModel = dbConnection.model("Reservation", ReservationSchema);

const consumer =
  (channel: Channel) =>
  async (msg: ConsumeMessage | null): Promise<void> => {
    if (msg) {
      let reservation: Reservation = JSON.parse(msg.content.toString());
      console.log(reservation.customerEmail);

      let reservationModel = new ReservationModel(reservation);
      await reservationModel.save();

      // Acknowledge the message
      //channel.ack(msg);
    }
  };

async function startServer() {
  const connection: Connection = await client.connect("amqp://localhost");
  // Create a channel
  const channel: Channel = await connection.createChannel();

  let queue = "reservationQueue";
  // Makes the queue available to the client
  await channel.assertQueue(queue, { durable: false });
  // Start the consumer
  await channel.consume(queue, consumer(channel), { noAck: true });
}

startServer();
console.log("Server started");
