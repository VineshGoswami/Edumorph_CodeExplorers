const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');

// @route   GET /api/lessons
// @desc    Get all lessons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().select('-content -quizzes');
    res.json(lessons);
  } catch (err) {
    console.error('Error fetching lessons:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update last accessed timestamp for this lesson if user is authenticated
    if (req.user) {
      await UserProgress.findOneAndUpdate(
        { userId: req.user.id, lessonId: req.params.id },
        { lastAccessed: Date.now() },
        { upsert: true, new: true }
      );
    }
    
    res.json(lesson);
  } catch (err) {
    console.error('Error fetching lesson:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/lessons/:id/progress
// @desc    Update user progress for a lesson
// @access  Private
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    
    // Validate progress value
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }
    
    // Check if lesson exists
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update or create progress record
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: req.user.id, lessonId: req.params.id },
      { 
        progress,
        completed: progress === 100,
        lastAccessed: Date.now()
      },
      { upsert: true, new: true }
    );
    
    res.json(userProgress);
  } catch (err) {
    console.error('Error updating progress:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/lessons/:id/quiz
// @desc    Submit quiz answers and update score
// @access  Private
router.post('/:id/quiz', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Check if lesson exists
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    
    answers.forEach((answer, index) => {
      if (index < lesson.quizzes.length && 
          answer === lesson.quizzes[index].correctOption) {
        correctAnswers++;
      }
    });
    
    const score = lesson.quizzes.length > 0 
      ? Math.round((correctAnswers / lesson.quizzes.length) * 100) 
      : 0;
    
    // Update progress record with score
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: req.user.id, lessonId: req.params.id },
      { 
        score,
        lastAccessed: Date.now()
      },
      { upsert: true, new: true }
    );
    
    res.json({
      score,
      correctAnswers,
      totalQuestions: lesson.quizzes.length,
      progress: userProgress
    });
  } catch (err) {
    console.error('Error submitting quiz:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/lessons/progress/all
// @desc    Get progress for all lessons for current user
// @access  Private
router.get('/progress/all', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.id })
      .populate('lessonId', 'title');
    
    res.json(progress);
  } catch (err) {
    console.error('Error fetching progress:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;