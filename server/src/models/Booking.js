import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true, lowercase: true, trim: true },
    guestPhone: { type: String, required: true },
    specialRequests: { type: String, default: '' },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomsReserved: { type: Number, required: true, min: 1 },
    guestCount: { type: Number, required: true, min: 1 },
    paymentChoice: { type: String, enum: ['pay_at_hotel', 'online'], required: true },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pay_at_hotel', 'mock_paid'],
      default: 'unpaid',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    nightlyRate: { type: Number, required: true },
    nights: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
