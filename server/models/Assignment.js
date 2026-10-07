import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        submittedAt: { type: Date },
        fileUrl: { type: String },
        grade: { type: Number },
        feedback: { type: String },
        status: { type: String, enum: ['Submitted', 'Late', 'Graded'] }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
