// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { cfg } from '../config/index.js';

export function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
  const payload = jwt.verify(token, cfg.jwtSecret);
    // attach minimal user info (extend as needed)
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
