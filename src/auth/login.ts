import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

/** Complete redirect-based login if we just returned from Google */
export async function finalizeRedirectIfNeeded(): Promise<void> {
  try {
    await getRedirectResult(auth);
  } catch (e) {
    // no pending redirect — ignore
    console.warn('[auth] getRedirectResult:', e);
  }
}

/** Ensure session persistence; degrade gracefully on restrictive browsers */
export async function ensureAuthPersistence(): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    await setPersistence(auth, inMemoryPersistence);
  }
}

/** Utility for debugging env mistakes early */
export function assertEnv(): void {
  const missing: string[] = [];
  if (!import.meta.env.VITE_FIREBASE_API_KEY) missing.push('VITE_FIREBASE_API_KEY');
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!import.meta.env.VITE_FIREBASE_APP_ID) missing.push('VITE_FIREBASE_APP_ID');
  if (missing.length) {
    throw new Error('Missing Firebase env vars: ' + missing.join(', '));
  }
}

/** Heuristic: prefer redirect on Safari/ITP or if embedded in iframe */
function shouldPreferRedirect(): boolean {
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const inIframe = window.self !== window.top;
  return isSafari || inIframe;
}

/** Main entry: try POPUP, then fallback to REDIRECT */
export async function loginWithGoogle(): Promise<void> {
  assertEnv();
  await ensureAuthPersistence();
  
  if (shouldPreferRedirect()) {
    await signInWithRedirect(auth, googleProvider);
    return;
  }
  
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err: any) {
    const code = String(err?.code || '');
    const popupIssues = new Set([
      'auth/popup-blocked',
      'auth/popup-closed-by-user',
      'auth/cancelled-popup-request',
      'auth/operation-not-supported-in-this-environment'
    ]);
    if (popupIssues.has(code)) {
      await signInWithRedirect(auth, googleProvider);
      return;
    }
    throw err; // bubble other errors for visibility
  }
}

export async function logoutToLogin(): Promise<void> {
  await auth.signOut();
  location.assign('/login.html');
}
