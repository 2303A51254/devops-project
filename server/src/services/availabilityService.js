import { AvailabilityOverride } from '../models/AvailabilityOverride.js';
import { Booking } from '../models/Booking.js';
import { RoomType } from '../models/RoomType.js';
import { AppError } from '../utils/appError.js';
import { eachStayDate, normalizeDate } from '../utils/date.js';

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'completed'];

const mapOverridesByDate = (overrides) =>
  overrides.reduce((acc, item) => {
    acc[normalizeDate(item.date).toISOString()] = item;
    return acc;
  }, {});

const mapBookingsByDate = (bookings) => {
  const usage = {};

  bookings.forEach((booking) => {
    eachStayDate(booking.checkIn, booking.checkOut).forEach((date) => {
      const key = normalizeDate(date).toISOString();
      usage[key] = (usage[key] || 0) + booking.roomsReserved;
    });
  });

  return usage;
};

export const getRoomAvailability = async ({ roomTypeId, checkIn, checkOut }) => {
  const roomType = await RoomType.findById(roomTypeId);

  if (!roomType) {
    throw new AppError('Room type not found', 404);
  }

  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);

  if (start >= end) {
    throw new AppError('Check-out must be after check-in');
  }

  const [overrides, bookings] = await Promise.all([
    AvailabilityOverride.find({
      roomType: roomTypeId,
      date: { $gte: start, $lt: end },
    }),
    Booking.find({
      roomType: roomTypeId,
      bookingStatus: { $in: ACTIVE_BOOKING_STATUSES },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    }),
  ]);

  const overrideMap = mapOverridesByDate(overrides);
  const usageMap = mapBookingsByDate(bookings);

  const dates = eachStayDate(start, end).map((date) => {
    const key = normalizeDate(date).toISOString();
    const override = overrideMap[key];
    const capacity = override?.availableQuantity ?? roomType.totalQuantity;
    const booked = usageMap[key] || 0;
    const remaining = Math.max(0, capacity - booked);
    const rate = override?.priceOverride ?? roomType.basePrice;

    return {
      date: key,
      capacity,
      booked,
      remaining,
      nightlyRate: rate,
    };
  });

  return {
    roomType,
    dates,
    minRemaining: Math.min(...dates.map((entry) => entry.remaining)),
    averageRate:
      dates.reduce((sum, entry) => sum + entry.nightlyRate, 0) / Math.max(dates.length, 1),
  };
};

export const ensureAvailability = async ({ roomTypeId, checkIn, checkOut, roomsReserved }) => {
  const availability = await getRoomAvailability({ roomTypeId, checkIn, checkOut });

  if (availability.minRemaining < roomsReserved) {
    throw new AppError('Selected room type is not available for these dates', 409);
  }

  return availability;
};
