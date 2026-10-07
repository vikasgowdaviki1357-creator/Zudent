import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Academics', 'Infrastructure', 'Transport', 'Hostel', 'Library', 'Canteen'], required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    response: { type: String },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

complaintSchema.pre('save', function (next) {
  if (this.isNew) {
    this.ticketId = 'CMP-' + Math.floor(10000 + Math.random() * 90000);
  }
  next();
});

export default mongoose.model('Complaint', complaintSchema);
