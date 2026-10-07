import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'], required: true },
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String },
    organizer: { type: String },
    maxParticipants: { type: Number },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String },
    status: { type: String, enum: ['Upcoming', 'Live', 'Completed'], default: 'Upcoming' }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
