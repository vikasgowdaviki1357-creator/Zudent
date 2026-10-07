import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['Books', 'Notes', 'Calculators', 'Lab Items', 'Tools', 'Question Papers', 'Electronics'], required: true },
    type: { type: String, enum: ['sell', 'donate'], required: true },
    price: { type: Number, default: 0 },
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'] },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Available', 'Sold', 'Reserved'], default: 'Available' },
    wishlistedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);
