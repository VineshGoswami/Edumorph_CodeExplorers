// Mock implementation for recommendations
export async function getRecommendations(userId) {
  // In a real app, call ML service or DB. Here, return static data for demo.
  return [
    { lessonId: '1', score: 0.95 },
    { lessonId: '2', score: 0.87 },
    { lessonId: '3', score: 0.78 }
  ];
}
import axios from 'axios';
import { cfg } from '../config/index.js';

export async function personalizeScore({ grade, subject, difficulty }) {
  try {
    const { data } = await axios.post(`${cfg.mlUrl}/infer`, {
      grade, subject, difficulty
    }, { timeout: 3000 });
    // expected: { score: number, label: 'low'|'neutral'|'high' }
    return data || { score: 0.5, label: 'neutral' };
  } catch {
    return { score: 0.5, label: 'neutral' };
  }
}
