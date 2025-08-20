// Advanced MCP-style context. Includes user context and content context placeholders.
export function contextEnricher(req, res, next) {
  req.ctx = req.ctx || {};
  req.ctx.sessionId = req.headers['x-session-id'] || null;
  req.ctx.device = {
    userAgent: req.headers['user-agent'] || '',
    localeHint: req.headers['accept-language'] || 'en'
  };
  // User context (expand as needed)
  req.ctx.user = req.user || null;
  // Content context placeholder
  req.ctx.content = req.body?.content || null;
  next();
}
