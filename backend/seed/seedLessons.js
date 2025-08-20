import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../src/models/Lesson.js';

dotenv.config();

async function run() {
  console.log('Connecting to:', process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'edumorph' });

  await Lesson.deleteMany({});
  await Lesson.insertMany([
    {
      title: 'Fractions Basics',
      subject: 'Math',
      gradeLevel: 5,
      originalContent:
        'Understanding fractions as parts of a whole. Example: 1/2, 1/4. Compare and add simple fractions with same denominators.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Water Cycle',
      subject: 'Science',
      gradeLevel: 5,
      originalContent:
        'The water cycle includes evaporation, condensation, precipitation, and collection. Explain with day-to-day examples.',
      difficultyLevel: 'medium'
    },
    {
      title: 'Reading Comprehension',
      subject: 'English',
      gradeLevel: 5,
      originalContent:
        'Short passage followed by 3 questions testing main idea, details, and inference.',
      difficultyLevel: 'easy'
    }
  ]);

  console.log('✅ Seeded lessons');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error('❌ Seed failed', err); process.exit(1); });
