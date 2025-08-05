


// import { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   GoogleAuthProvider, 
//   signInWithPopup,
//   onAuthStateChanged,
// } from 'firebase/auth';
// import { auth } from '../firebase'; // Verify path
// import { ArrowRight } from 'lucide-react';

// console.log('Auth.jsx: auth imported:', auth); // Debug

// const AuthContext = createContext();

// const errorMessages = {
//   'getaddrinfo failed': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'NameResolutionError': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'Failed to resolve': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'auth/network-request-failed': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
// };

// const getFriendlyErrorMessage = (error) => {
//   for (const [key, message] of Object.entries(errorMessages)) {
//     if (error.message?.includes(key) || error.code?.includes(key)) return message;
//   }
//   return error.message || 'Authentication failed. Please try again.';
// };

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       setError(null);
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       setError('Network error: Unable to connect to authentication server. Please check your internet connection.');
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   useEffect(() => {
//     console.log('AuthProvider: auth in useEffect:', auth);
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       try {
//         if (!navigator.onLine) {
//           throw new Error('auth/network-request-failed');
//         }
//         if (user) {
//           const token = await user.getIdToken(true);
//           localStorage.setItem('authToken', token);
          
//           setCurrentUser({
//             ...user,
//             token,
//             is_admin: localStorage.getItem('is_admin') === 'true',
//             is_manager: localStorage.getItem('is_manager') === 'true'
//           });
//           setError(null);
//         } else {
//           setCurrentUser(null);
//           localStorage.removeItem('authToken');
//           localStorage.removeItem('is_admin');
//           localStorage.removeItem('is_manager');
//           localStorage.removeItem('refreshToken');
//           setError(null);
//         }
//       } catch (error) {
//         console.error('AuthProvider error:', error);
//         setError(getFriendlyErrorMessage(error));
//         setCurrentUser(null);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('is_admin');
//         localStorage.removeItem('is_manager');
//         localStorage.removeItem('refreshToken');
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const value = {
//     currentUser,
//     setCurrentUser,
//     error,
//     isOnline
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function Auth() {
//   const authContext = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   if (!authContext) {
//     console.error('AuthContext is undefined. Ensure Auth component is wrapped in AuthContext.Provider');
//     return (
//       <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-8">
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
//           Error: Authentication context not available
//         </div>
//       </div>
//     );
//   }

//   const { setCurrentUser, isOnline } = authContext;
//   const API_BASE_URL = 'http://localhost:5000';


//   const handleGoogleLogin = async () => {
//     setErrorMsg('');
//     setLoading(true);
  
//     const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           return await fn();
//         } catch (error) {
//           if (error.code !== 'auth/network-request-failed' || attempt === maxRetries) {
//             throw error;
//           }
//           await new Promise((resolve) => setTimeout(resolve, delay * attempt));
//         }
//       }
//     };
  
//     try {
//       if (!isOnline) {
//         throw new Error('auth/network-request-failed');
//       }
  
//       const provider = new GoogleAuthProvider();
//       const result = await withRetry(() => signInWithPopup(auth, provider));
//       const user = result.user;
  
//       console.log('Firebase user:', {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL
//       });
  
//       const idToken = await withRetry(() => user.getIdToken(true));
//       const refreshToken = user.refreshToken;
  
//       console.log('Sending to /google-signin:', {
//         idToken: idToken.substring(0, 10) + '...',
//         refreshToken: refreshToken ? refreshToken.substring(0, 10) + '...' : null,
//         displayName: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL
//       });
  
//       const response = await fetch(`${API_BASE_URL}/google-signin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           idToken,
//           refreshToken,
//           displayName: user.displayName,
//           email: user.email,
//           photoURL: user.photoURL
//         }),
//       });
  
//       const data = await response.json();
//       console.log('Google sign-in response:', JSON.stringify(data, null, 2));
  
//       if (!response.ok) {
//         throw new Error(data.message || 'Google authentication failed');
//       }
  
//       localStorage.setItem('authToken', data.token);
//       if (data.refresh_token) {
//         localStorage.setItem('refreshToken', data.refresh_token);
//       } else {
//         console.warn('No refresh token in response');
//       }
  
//       localStorage.setItem('is_admin', data.user?.is_admin ? 'true' : 'false');
//       localStorage.setItem('is_manager', data.user?.is_manager ? 'true' : 'false');
  
//       setCurrentUser({
//         ...user,
//         token: data.token,
//         ...data.user
//       });
//     } catch (error) {
//       console.error('Google auth error:', error);
//       const errorMessage = getFriendlyErrorMessage(error);
//       setErrorMsg(errorMessage);
//       window.dispatchEvent(new CustomEvent('show-snackbar', { detail: { message: errorMessage, severity: 'error' } }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-8">
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
//             Welcome
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Sign in to access your account
//           </p>
//         </div>
        
//         {!isOnline && (
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
//             <div className="flex justify-between items-start">
//               <span className="text-sm">You are offline. Please reconnect to sign in.</span>
//             </div>
//           </div>
//         )}
        
//         {errorMsg && (
//           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
//             <div className="flex justify-between items-start">
//               <span className="text-sm">{errorMsg}</span>
//               <button 
//                 onClick={() => setErrorMsg('')}
//                 className="ml-2 text-red-500 hover:text-red-700 font-bold"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
        
//         <button
//           onClick={handleGoogleLogin}
//           disabled={loading || !isOnline}
//           className={`w-full flex items-center justify-center gap-3 border rounded-lg py-3 px-4 font-medium transition-all duration-200 ${
//             loading || !isOnline
//               ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
//               : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md'
//           }`}
//         >
//           {loading ? (
//             <>
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
//               Signing in...
//             </>
//           ) : (
//             <>
//               <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
//               Continue with Google
//               <ArrowRight size={18} />
//             </>
//           )}
//         </button>
        
//         <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
//           By continuing, you agree to our{' '}
//           <a href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }




import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase'; // Verify path
import { ArrowRight } from 'lucide-react';

console.log('Auth.jsx: auth imported:', auth); // Debug

const AuthContext = createContext();

const errorMessages = {
  'getaddrinfo failed': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
  'NameResolutionError': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
  'Failed to resolve': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
  'auth/network-request-failed': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/internal-error': 'An unexpected error occurred during authentication. Please try again or contact support.', // Added for auth/internal-error
};

const getFriendlyErrorMessage = (error) => {
  console.error('Raw error:', error); // Log raw error for debugging
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message?.includes(key) || error.code?.includes(key)) return message;
  }
  return error.message || 'Authentication failed. Please try again.';
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError('Network error: Unable to connect to authentication server. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    console.log('AuthProvider: auth in useEffect:', auth);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!navigator.onLine) {
          throw new Error('auth/network-request-failed');
        }
        if (user) {
          const token = await user.getIdToken(true);
          localStorage.setItem('authToken', token);
          
          setCurrentUser({
            ...user,
            token,
            is_admin: localStorage.getItem('is_admin') === 'true',
            is_manager: localStorage.getItem('is_manager') === 'true'
          });
          setError(null);
        } else {
          setCurrentUser(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('is_admin');
          localStorage.removeItem('is_manager');
          localStorage.removeItem('refreshToken');
          setError(null);
        }
      } catch (error) {
        console.error('AuthProvider error:', error);
        setError(getFriendlyErrorMessage(error));
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('is_manager');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    error,
    isOnline
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function Auth() {
  const authContext = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authContext) {
    console.error('AuthContext is undefined. Ensure Auth component is wrapped in AuthContext.Provider');
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: Authentication context not available
        </div>
      </div>
    );
  }

  const { setCurrentUser, isOnline } = authContext;
  const API_BASE_URL = 'http://localhost:5000';

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
  
    const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          if (error.code !== 'auth/network-request-failed' || attempt === maxRetries) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    };
  
    try {
      if (!isOnline) {
        throw new Error('auth/network-request-failed');
      }
  
      const provider = new GoogleAuthProvider();
      const result = await withRetry(() => signInWithPopup(auth, provider));
      const user = result.user;
  
      console.log('Firebase user:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
  
      const idToken = await withRetry(() => user.getIdToken(true));
      const refreshToken = user.refreshToken;
  
      console.log('Sending to /google-signin:', {
        idToken: idToken.substring(0, 10) + '...',
        refreshToken: refreshToken ? refreshToken.substring(0, 10) + '...' : null,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });
  
      const response = await fetch(`${API_BASE_URL}/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          refreshToken,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }),
      });
  
      const data = await response.json();
      console.log('Google sign-in response:', JSON.stringify(data, null, 2));
  
      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }
  
      localStorage.setItem('authToken', data.token);
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      } else {
        console.warn('No refresh token in response');
      }
  
      localStorage.setItem('is_admin', data.user?.is_admin ? 'true' : 'false');
      localStorage.setItem('is_manager', data.user?.is_manager ? 'true' : 'false');
  
      setCurrentUser({
        ...user,
        token: data.token,
        ...data.user
      });
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = getFriendlyErrorMessage(error);
      setErrorMsg(errorMessage);
      window.dispatchEvent(new CustomEvent('show-snackbar', { detail: { message: errorMessage, severity: 'error' } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>
        <div>
          <p>
          Seize Your Next Trading Opportunity With gimafund
          </p>
        </div>
        
        {!isOnline && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-sm">You are offline. Please reconnect to sign in.</span>
            </div>
          </div>
        )}
        
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-sm">{errorMsg}</span>
              <button 
                onClick={() => setErrorMsg('')}
                className="ml-2 text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading || !isOnline}
          className={`w-full flex items-center justify-center gap-3 border rounded-lg py-3 px-4 font-medium transition-all duration-200 ${
            loading || !isOnline
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              Signing in...
            </>
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
              <ArrowRight size={18} />
            </>
          )}
        </button>
        
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}