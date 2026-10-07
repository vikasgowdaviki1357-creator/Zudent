import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    credits: { type: Number },
    type: { type: String, enum: ['Theory', 'Lab', 'Elective'] },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    section: { type: String },
    maxStudents: { type: Number },
    schedule: [
      {
        day: String,
        time: String,
        room: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
