import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
const credentialFile = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const credentialPath = credentialFile && path.resolve(process.cwd(), credentialFile);
const fileCredentials = credentialPath && fs.existsSync(credentialPath)
  ? JSON.parse(fs.readFileSync(credentialPath, 'utf8'))
  : null;

if (!fileCredentials && required.some((key) => !process.env[key])) {
  throw new Error(`Faltan credenciales Firebase: ${required.filter((key) => !process.env[key]).join(', ')}`);
}

const credentials = fileCredentials || {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};
admin.initializeApp({ credential: admin.credential.cert(credentials) });

export const auth = admin.auth();
export const db = admin.firestore();
export const timestamp = admin.firestore.FieldValue.serverTimestamp;
