import { Booking } from '../models/Booking.js';
import { AppError } from '../utils/appError.js';
import { nightsBetween } from '../utils/date.js';
import { ensureAvailability } from './availabilityService.js';

const buildReference = () =>
  `AUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-4)}`;

export const createBookingRecord = async ({
  roomTypeId,
  checkIn,
  checkOut,
  roomsReserved,
  guestCount,
  paymentChoice,
  guestName,
  guestEmail,
  guestPhone,
  specialRequests,
  userId,
}) => {
  const availability = await ensureAvailability({
    roomTypeId,
    checkIn,
    checkOut,
    roomsReserved,
  });

  const roomType = availability.roomType;

  if (guestCount > roomType.capacity * roomsReserved) {
    throw new AppError('Guest count exceeds the selected room capacity');
  }

  const nights = nightsBetween(checkIn, checkOut);
  const nightlyRate = Math.round(availability.averageRate);
  const subtotal = nightlyRate * nights * roomsReserved;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const booking = await Booking.create({
    bookingReference: buildReference(),
    user: userId || null,
    roomType: roomType._id,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    checkIn,
    checkOut,
    roomsReserved,
    guestCount,
    paymentChoice,
    paymentStatus: paymentChoice === 'online' ? 'mock_paid' : 'pay_at_hotel',
    bookingStatus: paymentChoice === 'online' ? 'confirmed' : 'pending',
    nightlyRate,
    nights,
    subtotal,
    taxes,
    total,
  });

  return booking;
};
