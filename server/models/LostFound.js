import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    category: { type: String },
    location: { type: String },
    date: { type: Date },
    image: { type: String },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactInfo: { type: String },
    isResolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('LostFound', lostFoundSchema);
