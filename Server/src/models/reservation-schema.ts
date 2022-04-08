import { Schema } from "mongoose";

export interface Reservation {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  roomNo: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

export const ReservationSchema = new Schema<Reservation>({
  hotelId: { type: Number, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  roomNo: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: { type: String, required: true },
});
