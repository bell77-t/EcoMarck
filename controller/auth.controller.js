import { createAccount, signIn } from '../services/auth.service.js';

const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email || '');
export async function register(req, res, next) {
  const { nombre, correo, contrasena } = req.body;
  if (!nombre?.trim() || !validEmail(correo) || !contrasena || contrasena.length < 6) return res.status(400).json({ error: 'Nombre, correo válido y contraseña de al menos 6 caracteres son obligatorios.' });
  try { const user = await createAccount({ nombre: nombre.trim(), correo: correo.trim().toLowerCase(), contrasena }); res.status(201).json({ message: 'Cuenta creada.', uid: user.uid }); }
  catch (error) { if (error.code === 'auth/email-already-exists') return res.status(409).json({ error: 'Este correo ya está registrado.' }); next(error); }
}
export async function login(req, res, next) {
  const { correo, contrasena } = req.body;
  if (!validEmail(correo) || !contrasena) return res.status(400).json({ error: 'Ingresa correo y contraseña.' });
  try { res.json(await signIn(correo, contrasena)); } catch (error) { next(error); }
}
