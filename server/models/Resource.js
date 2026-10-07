import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['Notes', 'Question Papers', 'Lab Manuals', 'Important Questions'], required: true },
    subject: { type: String, required: true },
    branch: { type: String },
    semester: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String },
    fileSize: { type: Number },
    downloadCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);
