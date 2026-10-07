import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['Medical', 'Personal', 'Academic', 'Other'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('LeaveRequest', leaveRequestSchema);
