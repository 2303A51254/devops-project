import mongoose from 'mongoose';

const hotelContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    aboutText: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String, required: true },
    highlights: [{ type: String }],
    gallery: [{ type: String }],
  },
  { timestamps: true }
);

export const HotelContent = mongoose.model('HotelContent', hotelContentSchema);
