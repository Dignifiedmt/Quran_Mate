// JWT Authentication Middleware
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'quran-mate-hackathon-secure-jwt-key-2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or has expired' });
    }
    req.user = user;
    next();
  });
}
