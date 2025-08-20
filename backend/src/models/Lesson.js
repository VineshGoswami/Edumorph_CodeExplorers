import mongoose from 'mongoose';

const adaptedEntry = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  title: String,
  subject: String,
  gradeLevel: Number,
  originalContent: String,
  difficultyLevel: { type: String, default: 'medium' },
  adaptedCache: {
    type: Map,
    of: adaptedEntry
  }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
