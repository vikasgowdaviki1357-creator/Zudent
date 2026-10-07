import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentType: { type: String, enum: ['IA-1', 'IA-2', 'IA-3', 'SEE'], required: true },
    maxMarks: { type: Number, required: true },
    entries: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        marks: { type: Number },
        grade: { type: String }
      }
    ]
  },
  { timestamps: true }
);

marksSchema.index({ course: 1, assessmentType: 1 }, { unique: true });

export default mongoose.model('Marks', marksSchema);
