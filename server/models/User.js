import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'faculty', 'hod', 'admin'], required: true },
    usn: { type: String, unique: true, sparse: true },
    phone: { type: String },
    branch: { type: String, enum: ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MBA', 'MCA'] },
    semester: { type: Number, min: 1, max: 8 },
    admissionYear: { type: Number },
    designation: { type: String },
    department: { type: String },
    skills: [{ type: String }],
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('initials').get(function () {
  if (!this.name) return '';
  return this.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');
});

export default mongoose.model('User', userSchema);
