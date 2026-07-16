import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function parseEnv(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
];

const envPath = resolve(root, '.env');
let env;
try {
  env = parseEnv(readFileSync(envPath, 'utf-8'));
} catch {
  console.error('Error: .env file not found. Copy .env.example to .env and fill in your Firebase values.');
  process.exit(1);
}

const missing = requiredKeys.filter((key) => !env[key]);
if (missing.length > 0) {
  console.error(`Error: Missing required environment variables in .env:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const output = `/**
 * Firebase Config - AUTO-GENERATED from .env
 * Do not edit manually. Run: npm run generate:firebase-config
 */
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

window.firebaseConfig = firebaseConfig;
`;

writeFileSync(resolve(root, 'firebase_config.js'), output, 'utf-8');
console.log('Generated firebase_config.js from .env');
