import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/user.js';
import Progress from '../src/models/progress.js';

dotenv.config();

async function run() {

  console.log('Connecting to:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'edumorph' });

  // Clear existing data to avoid duplicates
  await User.deleteMany({});
  await Lesson.deleteMany({});
  await Progress.deleteMany({});
  console.log('✅ Cleared users, lessons, and progress collections');

  // Add more lessons with enhanced content
  const enhancedLessons = [
    {
      title: 'Introduction to Coding',
      subject: 'Computer Science',
      gradeLevel: 6,
      originalContent: 'Learn the basics of coding including variables, loops, and functions. Create your first program with step-by-step guidance.',
      difficultyLevel: 'easy'
    },
    {
      title: 'Advanced Fractions',
      subject: 'Math',
      gradeLevel: 6,
      originalContent: 'Master complex fraction operations including addition, subtraction, multiplication, and division with different denominators.',
      difficultyLevel: 'hard'
    },
    {
      title: 'Solar System Exploration',
      subject: 'Science',
      gradeLevel: 5,
      originalContent: 'Discover the planets, moons, and other objects in our solar system. Learn about space missions and recent discoveries.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Creative Writing Workshop',
      subject: 'English',
      gradeLevel: 7,
      originalContent: 'Develop your storytelling skills through character development, plot structure, and descriptive language exercises.',
      difficultyLevel: 'medium'
    },
    {
      title: 'World Geography',
      subject: 'Social Studies',
      gradeLevel: 6,
      originalContent: 'Explore continents, countries, and cultures around the world. Learn about major landmarks, capitals, and geographical features.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Introduction to Robotics',
      subject: 'Technology',
      gradeLevel: 8,
      originalContent: 'Learn about robot components, sensors, and basic programming. Understand how robots are used in various industries.',
      difficultyLevel: 'hard'
    },
    {
      title: 'Environmental Science',
      subject: 'Science',
      gradeLevel: 7,
      originalContent: 'Study ecosystems, climate change, and conservation efforts. Explore how human activities impact the environment.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Digital Art Fundamentals',
      subject: 'Art',
      gradeLevel: 6,
      originalContent: 'Learn digital drawing techniques, color theory, and composition. Create your own digital artwork using various tools.',
      difficultyLevel: 'easy'
    },
    {
      title: 'Financial Literacy',
      subject: 'Life Skills',
      gradeLevel: 8,
      originalContent: 'Understand budgeting, saving, and basic investment concepts. Learn how to make informed financial decisions.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Music Theory Basics',
      subject: 'Music',
      gradeLevel: 5,
      originalContent: 'Learn about notes, scales, chords, and rhythm. Develop skills to read and write basic musical notation.',
      difficultyLevel: 'easy'
    }
  ];

  // Insert new lessons
  await Lesson.insertMany(enhancedLessons);
  console.log('✅ Added enhanced lessons');

  // Add more user roles and types
  const enhancedUsers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
  passwordHash: '$2a$10$t5WbwKAoROAgJNnvK.SrZefgi8XisLnBQZubaH3zqkU36OVgMy8yG', // 'password123'
      preferredLanguage: 'en',
      region: 'California',
      grade: 6,
      learningStyle: 'visual',
      role: 'student'
    },
    {
      name: 'Michael Chen',
      email: 'michael@example.com',
  passwordHash: '$2a$10$t5WbwKAoROAgJNnvK.SrZefgi8XisLnBQZubaH3zqkU36OVgMy8yG',
      preferredLanguage: 'en',
      region: 'New York',
      grade: 7,
      learningStyle: 'kinesthetic',
      role: 'student'
    },
    {
      name: 'Dr. Emily Rodriguez',
      email: 'emily@example.com',
  passwordHash: '$2a$10$t5WbwKAoROAgJNnvK.SrZefgi8XisLnBQZubaH3zqkU36OVgMy8yG',
      preferredLanguage: 'es',
      region: 'Texas',
      learningStyle: 'auditory',
      role: 'teacher'
    },
    {
      name: 'Admin User',
      email: 'admin@edumorph.com',
  passwordHash: '$2a$10$t5WbwKAoROAgJNnvK.SrZefgi8XisLnBQZubaH3zqkU36OVgMy8yG',
      preferredLanguage: 'en',
      region: 'Global',
      role: 'teacher'
    }
  ];

  // Insert new users
  await User.insertMany(enhancedUsers);
  console.log('✅ Added enhanced users');

  // Get all lessons and users for creating progress records
  const allLessons = await Lesson.find();
  const allStudents = await User.find({ role: 'student' });

  // Create progress records
  const progressRecords = [];

  for (const student of allStudents) {
    // Assign random progress to some lessons for each student
    const lessonSubset = allLessons
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 3); // 3-7 lessons per student

    for (const lesson of lessonSubset) {
      progressRecords.push({
        userId: student._id,
        lessonId: lesson._id,
        status: Math.random() > 0.3 ? 'completed' : 'started',
        score: Math.floor(Math.random() * 100),
        lastSynced: new Date()
      });
    }
  }

  // Insert progress records
  await Progress.insertMany(progressRecords);
  console.log('✅ Added progress records');

  console.log('✅ Seed completed successfully');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { 
  console.error('❌ Seed failed', err); 
  process.exit(1); 
});