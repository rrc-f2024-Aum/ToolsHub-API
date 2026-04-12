import {
    initializeApp,
    cert,
    getApps,
    App,
    AppOptions,
    ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

const getFirebaseConfig = (): AppOptions => {
    // Extract Firebase credentials from environment variables
    const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
    } = process.env;

    // Validate that all required configuration values are present
    if (
        !FIREBASE_PROJECT_ID ||
        !FIREBASE_CLIENT_EMAIL ||
        !FIREBASE_PRIVATE_KEY
    ) {
        // You could definitely create a custom error to use here
        throw new Error(
            "Missing Firebase configuration. Please check your environment variables."
        );
    }

    let privateKey = FIREBASE_PRIVATE_KEY;
    privateKey = privateKey.replace(/^"|"$/g, '');
    
    // Replace escaped newlines with actual newlines
    // The key might have either \\n or \n in the string
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Ensure the key has proper formatting
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('Invalid private key format. Key should start with -----BEGIN PRIVATE KEY-----');
        throw new Error('Invalid Firebase private key format');
    }
    
    // Create a service account object with the provided credentials
    const serviceAccount: ServiceAccount = {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in the private key string with actual newlines
        privateKey: privateKey,
    };

    // Return the app configuration with credentials
    return {
        credential: cert(serviceAccount),
    };
};

const initializeFirebaseAdmin = (): App => {
    // Check if an app is already initialized
    const existingApp: App = getApps()[0];
    if (existingApp) {
        // Return existing app if found
        return existingApp;
    }
    // Otherwise create and return a new app
    return initializeApp(getFirebaseConfig());
};

// Initialize the Firebase Admin app
const app: App = initializeFirebaseAdmin();

const db: Firestore = getFirestore(app);

const auth: Auth = getAuth(app);

export { db, auth };