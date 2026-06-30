import "server-only";
import admin from "firebase-admin";
let app = null;

function getServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) return JSON.parse(json);
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Missing Firebase Admin credentials.");
  return { projectId, clientEmail, privateKey };
}
export function hasAdminConfig() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY));
}
export function getAdminApp() {
  if (app) return app;
  if (!admin.apps.length) {
    app = admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
  } else {
    app = admin.app();
  }
  return app;
}
export function db() { return getAdminApp().firestore(); }
export function authAdmin() { return getAdminApp().auth(); }
export function serverTimestamp() { return admin.firestore.FieldValue.serverTimestamp(); }
