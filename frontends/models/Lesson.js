const mongoose = require('mongoose');

const LessonResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'article', 'exercise', 'document', 'link', 'other']
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
});

const LessonQuizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctOption: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    trim: true
  }
});

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  tags: [{
    type: String,
    trim: true
  }],
  estimatedTime: {
    type: Number,
    required: true,
    min: 1
  },
  resources: [LessonResourceSchema],
  quizzes: [LessonQuizSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Lesson', LessonSchema);