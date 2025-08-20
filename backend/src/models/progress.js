import mongoose from 'mongoose';


const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  status: { type: String, enum: ['started', 'completed'], default: 'started' },
  score: { type: Number, default: 0 },
  lastSynced: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
