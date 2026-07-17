import { auth } from '../config/firebase.js';

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Se requiere autenticación.' });
  try { req.user = await auth.verifyIdToken(token); next(); }
  catch { res.status(401).json({ error: 'Sesión inválida o vencida.' }); }
}
