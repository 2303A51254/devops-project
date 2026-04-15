import mongoose from 'mongoose';

const availabilityOverrideSchema = new mongoose.Schema(
  {
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true },
    date: { type: Date, required: true },
    availableQuantity: { type: Number, min: 0 },
    priceOverride: { type: Number, min: 0 },
  },
  { timestamps: true }
);

availabilityOverrideSchema.index({ roomType: 1, date: 1 }, { unique: true });

export const AvailabilityOverride = mongoose.model(
  'AvailabilityOverride',
  availabilityOverrideSchema
);
