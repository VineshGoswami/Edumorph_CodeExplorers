import mongoose from 'mongoose';

const ctxSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  device: String,            // ua summary
  locale: String,            // 'pa-IN'
  region: String,
  grade: Number,
  learningStyle: String,
  lastAction: String,        // 'view_lesson', 'complete_lesson'
  contentTags: [String]
}, { timestamps: true });

export default mongoose.model('ContextEvent', ctxSchema);
