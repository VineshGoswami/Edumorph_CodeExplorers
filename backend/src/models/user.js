import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferredLanguage: { type: String, default: 'en' },
  region: { type: String, default: 'Punjab' },
  grade: { type: Number, default: 5 },
  learningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic'],
    default: 'auditory'
  },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for students
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // for teachers
}, { timestamps: true });

export default mongoose.model('User', userSchema);
