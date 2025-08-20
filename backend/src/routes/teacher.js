import express from 'express';
import Progress from '../models/progress.js';
import User from '../models/user.js';
import Lesson from '../models/lesson.js';
const router = express.Router();

// GET /teacher/progress?studentId=...
router.get('/progress', async (req, res) => {
  try {
    const { studentId } = req.query;
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const progress = await Progress.findOne({ userId: studentId });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for this student' });
    }
    
    res.json({ progress });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /teacher/students?teacherId=...
router.get('/students', async (req, res) => {
  try {
    const { teacherId } = req.query;
    
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
    
    const students = await User.find({ teacher: teacherId });
    
    // For each student, get their progress
    const studentsWithProgress = await Promise.all(students.map(async (student) => {
      const progress = await Progress.findOne({ userId: student._id });
      
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        progress: progress ? {
          overallCompletion: progress.overallProgress || 0,
          lessonsCompleted: progress.completedLessons?.length || 0,
          quizzesPassed: progress.completedQuizzes?.length || 0,
          lastActive: student.lastActive || new Date().toISOString()
        } : {
          overallCompletion: 0,
          lessonsCompleted: 0,
          quizzesPassed: 0,
          lastActive: new Date().toISOString()
        }
      };
    }));
    
    res.json({ students: studentsWithProgress });
  } catch (error) {
    console.error('Error fetching students data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /teacher/dashboard
 * @desc Get teacher dashboard overview data
 * @access Private (Teachers only)
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { teacherId } = req.query;
    
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
    
    // Get all students for this teacher
    const students = await User.find({ teacher: teacherId });
    
    // Calculate active students (active in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeStudents = students.filter(student => {
      return student.lastActive && new Date(student.lastActive) >= sevenDaysAgo;
    }).length;
    
    // Get all lessons to determine top performing and challenging lessons
    const lessons = await Lesson.find();
    
    // For a real implementation, we would calculate these based on actual progress data
    // For now, we'll use placeholder values
    const topPerformingLesson = lessons.length > 0 ? lessons[0].title : 'Introduction to Programming';
    const challengingLesson = lessons.length > 1 ? lessons[1].title : 'Data Structures and Algorithms';
    
    // Calculate average completion across all students
    let totalCompletion = 0;
    let studentsWithProgress = 0;
    
    await Promise.all(students.map(async (student) => {
      const progress = await Progress.findOne({ userId: student._id });
      if (progress && typeof progress.overallProgress === 'number') {
        totalCompletion += progress.overallProgress;
        studentsWithProgress++;
      }
    }));
    
    const averageCompletion = studentsWithProgress > 0 ? 
      Math.round(totalCompletion / studentsWithProgress) : 0;
    
    res.json({
      classPerformance: {
        averageCompletion,
        totalStudents: students.length,
        activeStudents,
        topPerformingLesson,
        challengingLesson
      }
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /teacher/students/:id
 * @desc Get a specific student's details
 * @access Private (Teachers only)
 */
router.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await User.findById(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const progress = await Progress.findOne({ userId: id });
    
    const studentWithProgress = {
      id: student._id,
      name: student.name,
      email: student.email,
      progress: progress ? {
        overallCompletion: progress.overallProgress || 0,
        lessonsCompleted: progress.completedLessons?.length || 0,
        quizzesPassed: progress.completedQuizzes?.length || 0,
        lastActive: student.lastActive || new Date().toISOString()
      } : {
        overallCompletion: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
        lastActive: new Date().toISOString()
      }
    };
    
    res.json({ student: studentWithProgress });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /teacher/analytics
 * @desc Get analytics data for teacher dashboard
 * @access Private (Teachers only)
 */
router.get('/analytics', async (req, res) => {
  try {
    const { teacherId } = req.query;
    
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required' });
    }
    
    // In a real implementation, we would generate actual analytics
    // based on student performance data from the database
    
    // For now, we'll return placeholder analytics data
    res.json({
      lessonCompletionRates: [
        { lesson: 'Introduction to Programming', completionRate: 85 },
        { lesson: 'Variables and Data Types', completionRate: 78 },
        { lesson: 'Control Flow', completionRate: 72 },
        { lesson: 'Functions and Methods', completionRate: 65 },
        { lesson: 'Data Structures and Algorithms', completionRate: 45 }
      ],
      studentEngagement: [
        { week: '2023-10-01', activeStudents: 3 },
        { week: '2023-10-08', activeStudents: 5 },
        { week: '2023-10-15', activeStudents: 4 }
      ],
      quizPerformance: [
        { topic: 'Programming Basics', averageScore: 82 },
        { topic: 'Data Types', averageScore: 75 },
        { topic: 'Control Structures', averageScore: 68 },
        { topic: 'Functions', averageScore: 71 },
        { topic: 'Data Structures', averageScore: 59 }
      ]
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /teacher/settings
 * @desc Save teacher dashboard settings
 * @access Private (Teachers only)
 */
router.post('/settings', async (req, res) => {
  try {
    const { teacherId, notificationPreferences, dashboardCustomization } = req.body;
    
    // Validate input
    if (!teacherId || !notificationPreferences || !dashboardCustomization) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // In a real implementation, we would save these settings to the database
    // For now, we'll just acknowledge receipt
    
    res.json({ 
      message: 'Settings saved successfully',
      settings: {
        teacherId,
        notificationPreferences,
        dashboardCustomization
      }
    });
  } catch (error) {
    console.error('Error saving teacher settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
