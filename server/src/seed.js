import bcrypt from 'bcryptjs';
import { Booking } from './models/Booking.js';
import { HotelContent } from './models/HotelContent.js';
import { RoomType } from './models/RoomType.js';
import { User } from './models/User.js';
import { contentSeed, roomSeeds } from './data/seedData.js';

export const seedIfEmpty = async () => {
  const roomCount = await RoomType.countDocuments();

  if (roomCount > 0) {
    return;
  }

  await RoomType.insertMany(roomSeeds);
  await HotelContent.create(contentSeed);

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Guest@123', 10);

  const [admin, customer] = await User.insertMany([
    {
      name: 'Aurora Admin',
      email: 'admin@aurorastay.com',
      password: adminPassword,
      phone: '+91 99887 76655',
      role: 'admin',
    },
    {
      name: 'Demo Guest',
      email: 'guest@aurorastay.com',
      password: customerPassword,
      phone: '+91 91234 56789',
      role: 'customer',
    },
  ]);

  const deluxeRoom = await RoomType.findOne({ slug: 'deluxe-horizon-room' });

  await Booking.create({
    bookingReference: 'AUR-DEMO1001',
    user: customer._id,
    roomType: deluxeRoom._id,
    guestName: customer.name,
    guestEmail: customer.email,
    guestPhone: customer.phone,
    specialRequests: 'High-floor room if available',
    checkIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    roomsReserved: 1,
    guestCount: 2,
    paymentChoice: 'pay_at_hotel',
    paymentStatus: 'pay_at_hotel',
    bookingStatus: 'pending',
    nightlyRate: 9800,
    nights: 2,
    subtotal: 19600,
    taxes: 2352,
    total: 21952,
  });
};
