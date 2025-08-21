import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import requestLogger from './src/middleware/requestLogger.js';
import { contextEnricher } from './src/middleware/contextEnricher.js';


import authRoutes from './src/routes/auth.js';
import lessonRoutes from './src/routes/lessons.js';
import progressRoutes from './src/routes/progress.js';
import contextRoutes from './src/routes/context.js';
import mlRoutes from './src/routes/ml.js';
import speechRoutes from './src/routes/speech.js';
import accessibilityRoutes from './src/routes/accessibility.js';
import teacherRoutes from './src/routes/teacher.js';
dotenv.config();

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'https://edumorph-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.LOG_LEVEL || 'dev'));
app.use(requestLogger);
app.use(contextEnricher);

mongoose.connect(process.env.MONGO_URI, { dbName: 'edumorph' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

app.get('/', (_req, res) => res.json({ ok: true, service: 'edumorph-api' }));


app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/context', contextRoutes);
app.use('/api', mlRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/accessibility', accessibilityRoutes);
app.use('/api/teacher', teacherRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` API running at http://localhost:${PORT}`));

export default app;
