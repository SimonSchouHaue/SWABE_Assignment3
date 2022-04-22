import { Reservation, ReservationSchema } from "./models/reservation-schema";
import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { Confirm } from "./models/confirm";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment3"
);

let confirmqueue = "confirmQueue";
let Reservationqueue = "reservationQueue";

const ReservationModel = dbConnection.model("Reservation", ReservationSchema);

const consumer =
  (channel: Channel) =>
  async (msg: ConsumeMessage | null): Promise<void> => {
    if (msg) {
      let reservation: Reservation = JSON.parse(msg.content.toString());

      let reservationModel = new ReservationModel(reservation);

      let filter = {
        checkIn: { $gte: reservation.checkIn },
        checkOut: { $lte: reservation.checkOut },
      };

      let result = await ReservationModel.findOne(filter).lean().exec();
      if (result) {
        msg.content = Buffer.from("Error reservation already exist");
        channel.nack(msg);
      } else {
        let status = await reservationModel.save();
        console.log("orderNumber: " + status._id.toString());

        let confirmMsg: Confirm = {
          roomNo: reservation.roomNo,
          customerEmail: reservation.customerEmail,
          customerName: reservation.customerName,
          orderNumber: status._id.toString(),
        };

        channel.sendToQueue(
          confirmqueue,
          Buffer.from(JSON.stringify(confirmMsg))
        );
        // Acknowledge the message
        channel.ack(msg);
      }
    }
  };
async function getConnection(): Promise<Connection> {
  // Create connnection
  return await client.connect("amqp://localhost");
}

async function startReservationServer() {
  const connection: Connection = await getConnection();
  // Create a channel
  const channel: Channel = await connection.createChannel();

  // Makes the queue available to the client
  await channel.assertQueue(Reservationqueue, { durable: false });
  await channel.prefetch(1);
  // Start the consumer
  await channel.consume(Reservationqueue, consumer(channel), { noAck: true });
}

async function startConfirmsServer() {
  const connection: Connection = await getConnection();
  // Create a channel
  const channel: Channel = await connection.createChannel();

  // Makes the queue available to the client
  await channel.assertQueue(confirmqueue, { durable: false });
}

getConnection();
startReservationServer();
startConfirmsServer();
console.log("Server started");
