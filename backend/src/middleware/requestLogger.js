import { randomUUID } from 'crypto';

export default function requestLogger(req, res, next) {
  const id = randomUUID();
  const start = Date.now();
  req.id = id;
  res.on('finish', () => {
    const ms = Date.now() - start;
    // Minimal log (morgan handles most logs)
    // console.log(`[${id}] ${req.method} ${req.originalUrl} -> ${res.statusCode} in ${ms}ms`);
  });
  next();
}
