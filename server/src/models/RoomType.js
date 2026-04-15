import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    images: [{ type: String }],
    amenities: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    totalQuantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RoomType = mongoose.model('RoomType', roomTypeSchema);
