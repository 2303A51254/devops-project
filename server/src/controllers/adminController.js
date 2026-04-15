import { Booking } from '../models/Booking.js';
import { HotelContent } from '../models/HotelContent.js';
import { AvailabilityOverride } from '../models/AvailabilityOverride.js';
import { RoomType } from '../models/RoomType.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalBookings, pendingBookings, totalCustomers, totalRooms, revenueResult, recentBookings] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      User.countDocuments({ role: 'customer' }),
      RoomType.countDocuments(),
      Booking.aggregate([
        { $match: { bookingStatus: { $in: ['confirmed', 'completed', 'pending'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),
      Booking.find().populate('roomType', 'name').sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    metrics: {
      totalBookings,
      pendingBookings,
      totalCustomers,
      totalRooms,
      revenue: revenueResult[0]?.revenue || 0,
    },
    recentBookings,
  });
});

export const listCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  res.json({ customers });
});

export const listAvailabilityOverrides = asyncHandler(async (req, res) => {
  const overrides = await AvailabilityOverride.find()
    .populate('roomType', 'name slug')
    .sort({ date: 1 });
  res.json({ overrides });
});

export const upsertAvailabilityOverride = asyncHandler(async (req, res) => {
  const { roomType, date, availableQuantity, priceOverride } = req.body;

  const override = await AvailabilityOverride.findOneAndUpdate(
    { roomType, date },
    { roomType, date, availableQuantity, priceOverride },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ override });
});

export const deleteAvailabilityOverride = asyncHandler(async (req, res) => {
  await AvailabilityOverride.findByIdAndDelete(req.params.id);
  res.json({ message: 'Availability override removed' });
});

export const getContent = asyncHandler(async (req, res) => {
  const content = await HotelContent.findOne();
  res.json({ content });
});

export const getPublicContent = asyncHandler(async (req, res) => {
  const content = await HotelContent.findOne();
  res.json({ content });
});

export const updateContent = asyncHandler(async (req, res) => {
  const current = await HotelContent.findOne();
  const content = current
    ? await HotelContent.findByIdAndUpdate(current._id, req.body, { new: true, runValidators: true })
    : await HotelContent.create(req.body);

  res.json({ content });
});
