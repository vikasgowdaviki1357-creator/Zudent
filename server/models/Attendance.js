import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    records: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        present: { type: Boolean }
      }
    ],
    totalPresent: { type: Number },
    totalAbsent: { type: Number }
  },
  { timestamps: true }
);

attendanceSchema.index({ course: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
