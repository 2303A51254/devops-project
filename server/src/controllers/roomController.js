import { RoomType } from '../models/RoomType.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { getRoomAvailability } from '../services/availabilityService.js';

export const listRooms = asyncHandler(async (req, res) => {
  const { guests, minPrice, maxPrice, featured, checkIn, checkOut } = req.query;
  const filters = {};

  if (guests) {
    filters.capacity = { $gte: Number(guests) };
  }

  if (featured === 'true') {
    filters.featured = true;
  }

  if (minPrice || maxPrice) {
    filters.basePrice = {};
    if (minPrice) filters.basePrice.$gte = Number(minPrice);
    if (maxPrice) filters.basePrice.$lte = Number(maxPrice);
  }

  const rooms = await RoomType.find(filters).sort({ featured: -1, basePrice: 1 });
  let responseRooms = rooms;

  if (checkIn && checkOut) {
    const availability = await Promise.all(
      rooms.map(async (room) => {
        try {
          const data = await getRoomAvailability({
            roomTypeId: room._id,
            checkIn,
            checkOut,
          });

          return {
            ...room.toObject(),
            availability: data.minRemaining,
            nightlyRate: Math.round(data.averageRate),
          };
        } catch {
          return {
            ...room.toObject(),
            availability: 0,
            nightlyRate: room.basePrice,
          };
        }
      })
    );

    responseRooms = availability.filter((room) => room.availability > 0);
  }

  res.json({ rooms: responseRooms });
});

export const getRoomBySlug = asyncHandler(async (req, res) => {
  const room = await RoomType.findOne({
    $or: [{ slug: req.params.slug }, { _id: req.params.slug }],
  });

  if (!room) {
    throw new AppError('Room not found', 404);
  }

  res.json({ room });
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.create(req.body);
  res.status(201).json({ room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    throw new AppError('Room not found', 404);
  }

  res.json({ room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndDelete(req.params.id);

  if (!room) {
    throw new AppError('Room not found', 404);
  }

  res.json({ message: 'Room deleted successfully' });
});

export const checkAvailability = asyncHandler(async (req, res) => {
  const { roomTypeId, checkIn, checkOut } = req.query;

  const availability = await getRoomAvailability({ roomTypeId, checkIn, checkOut });
  res.json(availability);
});
