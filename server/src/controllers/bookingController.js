import { Booking } from '../models/Booking.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { createBookingRecord } from '../services/bookingService.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingRecord({
    ...req.body,
    userId: req.user?._id,
  });

  const populated = await booking.populate('roomType', 'name slug images');
  res.status(201).json({ booking: populated });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('roomType', 'name slug images')
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { bookingStatus: status } : {};

  const bookings = await Booking.find(filter)
    .populate('roomType', 'name')
    .populate('user', 'name email phone role')
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  const { bookingStatus, paymentStatus } = req.body;

  if (bookingStatus) {
    booking.bookingStatus = bookingStatus;
  }

  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }

  await booking.save();
  res.json({ booking });
});
