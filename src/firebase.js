// // // src/firebase.js



// // Import required functions from Firebase SDKs
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';
// import { getAnalytics } from 'firebase/analytics';

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBVg14ysyZilsoiIinNJJ_H0vIDOEleK54",
//   authDomain: "gmxtrade-538a2.firebaseapp.com",
//   databaseURL: "https://gmxtrade-538a2.firebaseio.com",
//   projectId: "gmxtrade-538a2",
//   storageBucket: "gmxtrade-538a2.appspot.com",
//   messagingSenderId: "311377138278",
//   appId: "1:311377138278:web:66dd77f21583e0a1efd3a7",
//   measurementId: "G-RP32M8VF81",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional: Include only if you need analytics
// const auth = getAuth(app);
// const database = getDatabase(app);

// // Export Firebase services for use in other parts of your app
// export { app, analytics, auth, database };



  //  // Import required functions from Firebase SDKs
  //  import { initializeApp } from 'firebase/app';
  //  import { getAuth } from 'firebase/auth';
  //  import { getDatabase } from 'firebase/database';
  //  import { getFirestore } from 'firebase/firestore';
  //  import { getAnalytics } from 'firebase/analytics';
  //  import { getFunctions } from 'firebase/functions'; // Import Cloud Functions

  //  // Your Firebase configuration
  //  const firebaseConfig = {
  //    apiKey: "AIzaSyBVg14ysyZilsoiIinNJJ_H0vIDOEleK54",
  //    authDomain: "gmxtrade-538a2.firebaseapp.com",
  //    databaseURL: "https://gmxtrade-538a2.firebaseio.com",
  //    projectId: "gmxtrade-538a2",
  //    storageBucket: "gmxtrade-538a2.appspot.com",
  //    messagingSenderId: "311377138278",
  //    appId: "1:311377138278:web:66dd77f21583e0a1efd3a7",
  //    measurementId: "G-RP32M8VF81",
  //  };

  //  // Initialize Firebase
  //  const app = initializeApp(firebaseConfig);
  //  const db = getFirestore(app);
  //  const analytics = getAnalytics(app); // Optional: Include only if you need analytics
  //  const auth = getAuth(app);
  //  const database = getDatabase(app);
  //  const functions = getFunctions(app); // Initialize Cloud Functions

  //  // Export Firebase services for use in other parts of your app
  //  export { app, analytics, auth, database, functions, db }; // Include functions in the export
   
// Load environment variables from custom file
// Import required functions from Firebase SDKs


// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';
// import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';
// import { getFunctions } from 'firebase/functions';


// // Validate required environment variables
// const requiredEnvVars = [
//   'REACT_APP_FIREBASE_API_KEY',
//   'REACT_APP_FIREBASE_AUTH_DOMAIN',
//   'REACT_APP_FIREBASE_DATABASE_URL',
//   'REACT_APP_FIREBASE_PROJECT_ID',
//   'REACT_APP_FIREBASE_STORAGE_BUCKET',
//   'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
//   'REACT_APP_FIREBASE_APP_ID',
//   'REACT_APP_FIREBASE_MEASUREMENT_ID',
//   'REACT_APP_BACKEND_URL',
// ];

// requiredEnvVars.forEach(varName => {
//   if (!process.env[varName]) {
//     throw new Error(`Missing environment variable: ${varName}`);
//   }
// });

// // Firebase configuration using environment variables
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// const lionshareConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const analytics = getAnalytics(app); // Optional: Remove if not using analytics
// const auth = getAuth(app);
// const database = getDatabase(app);
// const functions = getFunctions(app);

// // Export Firebase services
// export { app, analytics, auth, database, functions, db };

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';
// import { getFirestore } from 'firebase/firestore';
// import { getAnalytics, isSupported } from 'firebase/analytics';
// import { getFunctions } from 'firebase/functions';

// // Validate required environment variables for primary app
// const requiredEnvVars = [
//   'REACT_APP_FIREBASE_API_KEY',
//   'REACT_APP_FIREBASE_AUTH_DOMAIN',
//   'REACT_APP_FIREBASE_DATABASE_URL',
//   'REACT_APP_FIREBASE_PROJECT_ID',
//   'REACT_APP_FIREBASE_STORAGE_BUCKET',
//   'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
//   'REACT_APP_FIREBASE_APP_ID',
//   'REACT_APP_FIREBASE_MEASUREMENT_ID',
//   'REACT_APP_BACKEND_URL',
// ];

// // Validate required environment variables for LionShare app
// const lionshareRequiredEnvVars = [
//   'REACT_APP_LIONSHARE_API_KEY',
//   'REACT_APP_LIONSHARE_AUTH_DOMAIN',
//   'REACT_APP_LIONSHARE_DATABASE_URL',
//   'REACT_APP_LIONSHARE_PROJECT_ID',
//   'REACT_APP_LIONSHARE_STORAGE_BUCKET',
//   'REACT_APP_LIONSHARE_SENDER_ID',
//   'REACT_APP_LIONSHARE_APP_ID',
//   'REACT_APP_LIONSHARE_MEASUREMENT_ID',
//   // Removed REACT_APP_BACKEND_URL as it might not be needed for LionShare
// ];

// // Check primary app environment variables
// requiredEnvVars.forEach(varName => {
//   if (!process.env[varName]) {
//     console.warn(`Missing environment variable: ${varName}`);
//   }
// });

// // Check LionShare app environment variables (optional)
// const lionshareEnvMissing = lionshareRequiredEnvVars.some(varName => {
//   const missing = !process.env[varName];
//   if (missing) {
//     console.warn(`Missing LionShare environment variable: ${varName}`);
//   }
//   return missing;
// });

// console.log('LionShare env missing:', lionshareEnvMissing);
// console.log('LionShare API Key exists:', !!process.env.REACT_APP_LIONSHARE_API_KEY);

// // Primary Firebase configuration (GMXTrade)
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// // LionShare Firebase configuration
// const lionshareConfig = {
//   apiKey: process.env.REACT_APP_LIONSHARE_API_KEY,
//   authDomain: process.env.REACT_APP_LIONSHARE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_LIONSHARE_DATABASE_URL,
//   projectId: process.env.REACT_APP_LIONSHARE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_LIONSHARE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_LIONSHARE_SENDER_ID,
//   appId: process.env.REACT_APP_LIONSHARE_APP_ID,
//   measurementId: process.env.REACT_APP_LIONSHARE_MEASUREMENT_ID,
// };

// // Initialize primary Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize LionShare Firebase app (secondary)
// let lionshareApp = null;
// if (!lionshareEnvMissing) {
//   try {
//     console.log('Initializing LionShare Firebase with config:', {
//       ...lionshareConfig,
//       apiKey: lionshareConfig.apiKey ? '[HIDDEN]' : 'MISSING'
//     });
//     lionshareApp = initializeApp(lionshareConfig, 'lionshare');
//     console.log('LionShare Firebase app initialized successfully');
//   } catch (error) {
//     console.error('Failed to initialize LionShare Firebase app:', error);
//   }
// } else {
//   console.warn('LionShare Firebase not initialized due to missing environment variables');
// }

// // Primary app services
// const db = getFirestore(app);
// const auth = getAuth(app);
// const database = getDatabase(app);
// const functions = getFunctions(app);

// // Initialize analytics only if supported (avoids issues in SSR/Node environments)
// let analytics = null;
// if (typeof window !== 'undefined') {
//   isSupported().then(supported => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   }).catch(error => {
//     console.warn('Analytics not supported:', error);
//   });
// }

// // LionShare app services (if available)
// let lionshareDb = null;
// let lionshareAuth = null;
// let lionshareDatabase = null;
// let lionshareFunctions = null;
// let lionshareAnalytics = null;

// if (lionshareApp) {
//   try {
//     lionshareDb = getFirestore(lionshareApp);
//     lionshareAuth = getAuth(lionshareApp);
//     lionshareDatabase = getDatabase(lionshareApp);
//     lionshareFunctions = getFunctions(lionshareApp);
    
//     console.log('LionShare services initialized successfully');
    
//     if (typeof window !== 'undefined') {
//       isSupported().then(supported => {
//         if (supported) {
//           lionshareAnalytics = getAnalytics(lionshareApp);
//         }
//       }).catch(error => {
//         console.warn('LionShare analytics not supported:', error);
//       });
//     }
//   } catch (error) {
//     console.error('Failed to initialize LionShare services:', error);
//   }
// } else {
//   console.warn('LionShare services not initialized because lionshareApp is null');
// }

// // Export primary Firebase services
// export { 
//   app, 
//   analytics, 
//   auth, 
//   database, 
//   functions, 
//   db 
// };

// // Export LionShare Firebase services
// export { 
//   lionshareApp,
//   lionshareAnalytics,
//   lionshareAuth,
//   lionshareDatabase,
//   lionshareFunctions,
//   lionshareDb
// };





import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

// Validate required environment variables for primary app (GMXTrade)
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_DATABASE_URL',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID'
];

// Validate required environment variables for LionShare app
const lionshareRequiredEnvVars = [
  'REACT_APP_LIONSHARE_API_KEY',
  'REACT_APP_LIONSHARE_AUTH_DOMAIN',
  'REACT_APP_LIONSHARE_DATABASE_URL',
  'REACT_APP_LIONSHARE_PROJECT_ID',
  'REACT_APP_LIONSHARE_STORAGE_BUCKET',
  'REACT_APP_LIONSHARE_SENDER_ID',
  'REACT_APP_LIONSHARE_APP_ID',
  'REACT_APP_LIONSHARE_MEASUREMENT_ID'
];

// Check primary app environment variables
const missingPrimaryEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingPrimaryEnvVars.length > 0) {
  console.error('Missing primary Firebase environment variables:', missingPrimaryEnvVars);
  throw new Error('Primary Firebase initialization failed: Missing environment variables');
}

// Check LionShare app environment variables
const lionshareEnvMissing = lionshareRequiredEnvVars.some(varName => !process.env[varName]);
if (lionshareEnvMissing) {
  console.warn('Some LionShare environment variables are missing. LionShare app may not initialize.');
}

// Primary Firebase configuration (GMXTrade)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// LionShare Firebase configuration
const lionshareConfig = {
  apiKey: process.env.REACT_APP_LIONSHARE_API_KEY,
  authDomain: process.env.REACT_APP_LIONSHARE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_LIONSHARE_DATABASE_URL,
  projectId: process.env.REACT_APP_LIONSHARE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_LIONSHARE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_LIONSHARE_SENDER_ID,
  appId: process.env.REACT_APP_LIONSHARE_APP_ID,
  measurementId: process.env.REACT_APP_LIONSHARE_MEASUREMENT_ID
};

// Debug configurations
console.log('Primary Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : 'MISSING'
});
console.log('LionShare Firebase config:', {
  ...lionshareConfig,
  apiKey: lionshareConfig.apiKey ? '[HIDDEN]' : 'MISSING'
});

// Initialize primary Firebase app
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Primary Firebase app initialized successfully');
} catch (error) {
  console.error('Primary Firebase initialization failed:', error);
  throw error;
}

// Initialize LionShare Firebase app (secondary)
let lionshareApp = null;
if (!lionshareEnvMissing) {
  try {
    lionshareApp = initializeApp(lionshareConfig, 'lionshare');
    console.log('LionShare Firebase app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize LionShare Firebase app:', error);
  }
} else {
  console.warn('LionShare Firebase not initialized due to missing environment variables');
}

// Primary app services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const functions = getFunctions(app);
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('Primary analytics initialized');
      } else {
        console.warn('Primary analytics not supported');
      }
    })
    .catch(error => {
      console.warn('Failed to initialize primary analytics:', error);
    });
}

// LionShare app services
let lionshareDb = null;
let lionshareAuth = null;
let lionshareDatabase = null;
let lionshareFunctions = null;
let lionshareAnalytics = null;
if (lionshareApp) {
  try {
    lionshareDb = getFirestore(lionshareApp);
    lionshareAuth = getAuth(lionshareApp);
    lionshareDatabase = getDatabase(lionshareApp);
    lionshareFunctions = getFunctions(lionshareApp);
    if (typeof window !== 'undefined') {
      isSupported()
        .then(supported => {
          if (supported) {
            lionshareAnalytics = getAnalytics(lionshareApp);
            console.log('LionShare analytics initialized');
          } else {
            console.warn('LionShare analytics not supported');
          }
        })
        .catch(error => {
          console.warn('Failed to initialize LionShare analytics:', error);
        });
    }
    console.log('LionShare services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize LionShare services:', error);
  }
}

// Export primary Firebase services
export { app, auth, db, database, functions, analytics };

// Export LionShare Firebase services
export { lionshareApp, lionshareAuth, lionshareDb, lionshareDatabase, lionshareFunctions, lionshareAnalytics };

