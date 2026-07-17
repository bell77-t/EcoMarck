import { auth, db, timestamp } from '../config/firebase.js';

export async function createAccount({ nombre, correo, contrasena }) {
  const user = await auth.createUser({ email: correo, password: contrasena, displayName: nombre });
  await db.collection('Users').doc(user.uid).set({ id: user.uid, nombre, correo, foto: '', fechaRegistro: timestamp() });
  return user;
}

export async function signIn(correo, contrasena) {
  if (!process.env.FIREBASE_WEB_API_KEY) throw new Error('Falta FIREBASE_WEB_API_KEY en el servidor.');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: correo, password: contrasena, returnSecureToken: true })
  });
  const data = await response.json();
  if (!response.ok) {
    const code = data.error?.message || '';
    if (['INVALID_LOGIN_CREDENTIALS', 'EMAIL_NOT_FOUND', 'INVALID_PASSWORD'].includes(code)) throw new Error('Correo o contraseña incorrectos.');
    if (code === 'OPERATION_NOT_ALLOWED') throw new Error('El acceso con correo y contraseña no está habilitado en Firebase Authentication.');
    if (code.includes('API_KEY')) throw new Error('La FIREBASE_WEB_API_KEY es inválida o pertenece a otro proyecto.');
    throw new Error(`Firebase no pudo iniciar sesión: ${code || 'configuración no válida'}.`);
  }
  return { token: data.idToken, uid: data.localId, expiresIn: data.expiresIn };
}
