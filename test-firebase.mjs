import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

try {
  const app = initializeApp({
    apiKey: 'dummy-api-key-for-build-that-is-long-enough',
    projectId: 'dummy-project'
  });
  const auth = getAuth(app);
  console.log("Success! No error thrown at getAuth.");
} catch (e) {
  console.error("Error thrown:", e);
}
