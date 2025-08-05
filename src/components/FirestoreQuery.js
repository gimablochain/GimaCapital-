



// import React, { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { lionshareDb, lionshareAuth } from '../firebase';
// import { motion } from 'framer-motion';
// import { ChevronRight, Search, X, RefreshCw, User, Lock, Shield, Database, Star, Globe, TrendingUp, Award, Zap, AlertCircle } from 'lucide-react';

// const FirestoreQuery = ({ theme }) => {
//   const [userId, setUserId] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [authUser, setAuthUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [fetchingStage, setFetchingStage] = useState('');
//   const [animatedBalances, setAnimatedBalances] = useState({});
//   const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
//   const [validationError, setValidationError] = useState('');

//   // Authentication state listener
//   useEffect(() => {
//     if (lionshareAuth) {
//       const unsubscribe = onAuthStateChanged(lionshareAuth, (user) => {
//         setAuthUser(user);
//         setAuthLoading(false);
//       });
//       return () => unsubscribe();
//     } else {
//       setAuthLoading(false);
//     }
//   }, []);

//   // Validate Telegram ID (numeric only)
//   const validateTelegramId = (id) => {
//     if (!id || id.trim() === '') {
//       return { isValid: false, error: 'Please enter a Telegram ID' };
//     }

//     const trimmedId = id.trim();
    
//     if (!/^\d+$/.test(trimmedId)) {
//       return { 
//         isValid: false, 
//         error: 'Telegram ID must contain only numbers (e.g., 1004758046)' 
//       };
//     }

//     if (trimmedId.length < 5 || trimmedId.length > 12) {
//       return { 
//         isValid: false, 
//         error: 'Telegram ID should be between 5-12 digits' 
//       };
//     }

//     return { isValid: true, value: trimmedId };
//   };

//   // Handle input changes with validation
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setUserId(value);
    
//     if (validationError) setValidationError('');
    
//     if (value.trim() !== '') {
//       const validation = validateTelegramId(value);
//       if (!validation.isValid) {
//         setValidationError(validation.error);
//       }
//     }
//   };

//   // Anonymous authentication
//   const signInAnonymous = async () => {
//     if (!lionshareAuth) {
//       setError('Authentication service unavailable');
//       return;
//     }
    
//     setAuthLoading(true);
//     try {
//       await signInAnonymously(lionshareAuth);
//     } catch (err) {
//       setError(`Authentication failed: ${err.message}`);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // Balance animation effect
//   const animateBalance = (finalValue, key) => {
//     const duration = 2000;
//     const steps = 50;
//     const increment = finalValue / steps;
//     let currentValue = 0;
//     let step = 0;

//     const timer = setInterval(() => {
//       step++;
//       currentValue = Math.min(currentValue + increment, finalValue);
      
//       setAnimatedBalances(prev => ({
//         ...prev,
//         [key]: currentValue
//       }));

//       if (step >= steps || currentValue >= finalValue) {
//         clearInterval(timer);
//         setAnimatedBalances(prev => ({
//           ...prev,
//           [key]: finalValue
//         }));
//       }
//     }, duration / steps);
//   };

//   // Fetch user data from Firestore
//   const fetchUserData = async () => {
//     const validation = validateTelegramId(userId);
//     if (!validation.isValid) {
//       setValidationError(validation.error);
//       setError('Please provide a valid Telegram ID');
//       return;
//     }

//     if (!authUser) {
//       setError('Authentication required to access user data');
//       return;
//     }

//     setValidationError('');
//     setLoading(true);
//     setError(null);
//     setShowLoadingAnimation(true);
//     setAnimatedBalances({});
    
//     const stages = [
//       'Establishing secure blockchain connection...',
//       'Verifying authentication credentials...',
//       `Scanning for Telegram ID: ${validation.value}...`,
//       'Retrieving comprehensive transaction ledger...',
//       'Processing balance aggregations and analytics...',
//       'Validating data integrity and compliance...',
//       'Compiling comprehensive user portfolio...'
//     ];

//     for (let i = 0; i < stages.length; i++) {
//       setFetchingStage(stages[i]);
//       await new Promise(resolve => setTimeout(resolve, 8000));
//     }
    
//     try {
//       if (!lionshareDb) throw new Error('Database connection unavailable');

//       const userDocRef = doc(lionshareDb, 'users_production', validation.value);
//       const docSnap = await getDoc(userDocRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setUserData(data);
        
//         setTimeout(() => {
//           Object.keys(data).forEach(key => {
//             if (typeof data[key] === 'number' && data[key] > 0) {
//               animateBalance(data[key], key);
//             }
//           });
//         }, 500);
//       } else {
//         setError(`User profile not found for Telegram ID: ${validation.value}`);
//         setUserData(null);
//       }
//     } catch (err) {
//       if (err.code === 'permission-denied') {
//         setError('Access denied. Please verify your authorization level.');
//       } else {
//         setError(`Data retrieval error: ${err.message}`);
//       }
//       setUserData(null);
//     } finally {
//       setLoading(false);
//       setShowLoadingAnimation(false);
//       setFetchingStage('');
//     }
//   };

//   // Reset all states
//   const clearResults = () => {
//     setUserData(null);
//     setUserId('');
//     setError(null);
//     setAnimatedBalances({});
//     setFetchingStage('');
//     setShowLoadingAnimation(false);
//     setValidationError('');
//   };

//   // Render wallet balances
//   const renderWalletBalances = () => {
//     const excludedFields = [
//       'name', 'handle', 'created_at', 'referral_count', 'photo_url',
//       'referral_link', 'last_claim_time', 'last_reset_time',
//       'registration_date', 'is_premium', 'language_code',
//       'follow_facebook_claimed', 'follow_twitter_claimed',
//       'join_telegram_claimed', 'welcome_bonus_received',
//       'subscribe_claimed', 'follow_instagram_claimed',
//       'daily_claims', 'WelcomeBonus'
//     ];

//     const balanceFields = Object.keys(userData)
//       .filter(key => 
//         typeof userData[key] === 'number' && 
//         !excludedFields.includes(key) &&
//         userData[key] > 0
//       )
//       .sort((a, b) => {
//         if (a === 'LSCoin') return -1;
//         if (b === 'LSCoin') return 1;
//         if (a === 'private_sale_LSCoin') return -1;
//         if (b === 'private_sale_LSCoin') return 1;
//         if (['btc', 'eth', 'usdt'].includes(a)) return -1;
//         if (['btc', 'eth', 'usdt'].includes(b)) return 1;
//         return a.localeCompare(b);
//       });

//     return (
//       <div className="grid grid-cols-1 gap-3">
//         <div className="space-y-2">
//           {balanceFields.map(currency => {
//             const displayValue = showLoadingAnimation 
//               ? (animatedBalances[currency] || 0)
//               : userData[currency];
              
//             return (
//               <motion.p 
//                 key={currency} 
//                 className="text-sm sm:text-base break-words"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: balanceFields.indexOf(currency) * 0.1 }}
//               >
//                 <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//                   {currency === 'private_sale_LSCoin' ? 'Private Sale LSCoin' : currency.toUpperCase()}:
//                 </span> 
//                 <span className={`ml-2 font-bold ${showLoadingAnimation ? 'text-emerald-500' : ''}`}>
//                   {displayValue.toLocaleString(undefined, { 
//                     maximumFractionDigits: currency === 'btc' ? 6 : 
//                                           currency === 'eth' ? 4 : 2 
//                   })}
//                 </span>
//               </motion.p>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   if (authLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-xl shadow-2xl border ${
//           theme === 'dark' ? 'bg-slate-900 border-slate-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
//         } overflow-hidden`}
//       >
//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="animate-spin mr-2" />
//           <span>Initializing authentication services...</span>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-xl shadow-2xl border ${
//         theme === 'dark' ? 'bg-slate-900 border-slate-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
//       } overflow-hidden`}
//     >
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <h2 className="text-lg sm:text-xl font-bold flex items-center">
//           <Database className="mr-2 text-emerald-500 flex-shrink-0" />
//           <span className="truncate">LionShareCoin Portfolio Management System</span>
//         </h2>
//         {userData && (
//           <button
//             onClick={clearResults}
//             className={`p-2 rounded-lg self-start sm:self-auto ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
//           >
//             <X size={20} />
//           </button>
//         )}
//       </div>

//       {/* Authentication Status */}
//       <div className={`mb-4 p-3 rounded-lg border ${
//         authUser 
//           ? (theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-200' : 'bg-emerald-100 border-emerald-200 text-emerald-700')
//           : (theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700')
//       }`}>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div className="flex items-center">
//             {authUser ? <Shield size={16} className="mr-2 flex-shrink-0" /> : <Lock size={16} className="mr-2 flex-shrink-0" />}
//             <span className="text-sm break-all">
//               {authUser ? `Secure Session Active: ${authUser.uid}` : 'Authentication Required'}
//             </span>
//           </div>
//           {!authUser && (
//             <button
//               onClick={signInAnonymous}
//               disabled={authLoading}
//               className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
//                 theme === 'dark' 
//                   ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
//                   : 'bg-emerald-600 hover:bg-emerald-700 text-white'
//               }`}
//             >
//               {authLoading ? 'Authenticating...' : 'Secure Access'}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Loading Animation */}
//       {showLoadingAnimation && (
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className={`mb-6 p-6 rounded-lg border-2 border-dashed ${
//             theme === 'dark' ? 'border-emerald-600 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
//           }`}
//         >
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <RefreshCw className="animate-spin mr-3 text-emerald-500" size={24} />
//               <div className="text-lg font-bold text-emerald-500">
//                 Processing Data Request
//               </div>
//             </div>
//             <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
//               {fetchingStage || 'Initializing secure blockchain connection...'}
//             </p>
//             <div className="flex justify-center mb-4">
//               <div className="flex space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 bg-emerald-500 rounded-full"
//                     animate={{
//                       scale: [1, 1.5, 1],
//                       opacity: [0.5, 1, 0.5],
//                     }}
//                     transition={{
//                       duration: 1.5,
//                       repeat: Infinity,
//                       delay: i * 0.2,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
//               🔐 Retrieving comprehensive portfolio data from distributed ledger infrastructure
//             </p>
//           </div>
//         </motion.div>
//       )}

//       {!userData ? (
//         <div className="space-y-6">
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//             <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={handleInputChange}
//                 className={`w-full pl-10 pr-4 py-3 sm:py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-base sm:text-sm ${
//                   validationError 
//                     ? (theme === 'dark' ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50')
//                     : (theme === 'dark' 
//                         ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
//                         : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500')
//                 }`}
//                 placeholder="Enter Telegram ID (e.g., 1004758046)"
//                 onKeyPress={(e) => e.key === 'Enter' && fetchUserData()}
//                 disabled={!authUser}
//               />
//             </div>
//             <button
//               onClick={fetchUserData}
//               disabled={loading || !authUser || validationError}
//               className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center transition-colors font-medium ${
//                 loading || !authUser || validationError
//                   ? (theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-300 text-gray-500')
//                   : 'bg-emerald-600 text-white hover:bg-emerald-700'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <RefreshCw size={18} className="mr-2 animate-spin" />
//                   Processing
//                 </>
//               ) : (
//                 'Retrieve Data'
//               )}
//             </button>
//           </div>

//           {validationError && (
//             <div className={`p-3 rounded-lg border flex items-start ${
//               theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700'
//             }`}>
//               <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium text-sm">Invalid Telegram ID</p>
//                 <p className="text-xs mt-1">{validationError}</p>
//               </div>
//             </div>
//           )}

//           {error && !validationError && (
//             <div className={`p-3 rounded-lg ${
//               theme === 'dark' ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-100 border-red-200 text-red-700'
//             } border`}>
//               {error}
//             </div>
//           )}

//           <div className={`p-4 rounded-lg border ${
//             theme === 'dark' ? 'bg-blue-900/20 border-blue-800/50' : 'bg-blue-50 border-blue-200/50'
//           }`}>
//             <h4 className={`font-medium text-sm mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
//               Telegram ID Requirements:
//             </h4>
//             <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-blue-200/90' : 'text-blue-700'}`}>
//               <li>• Must contain only numbers (0-9)</li>
//               <li>• Must be 5-12 digits long</li>
//               <li>• Example: <code>123456789, 1004758046</code></li>
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="relative overflow-hidden"
//           >
//             <div className={`relative p-8 rounded-2xl border-2 ${
//               theme === 'dark' 
//                 ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-900/20 border-emerald-500/30' 
//                 : 'bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/30 border-emerald-400/30'
//             }`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
//               <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-xl"></div>
              
//               <div className="relative z-10">
//                 <motion.div 
//                   className="flex items-center justify-between mb-6"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className={`p-3 rounded-xl ${
//                       theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
//                     }`}>
//                       <Star className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-emerald-500">
//                         Portfolio Access Granted
//                       </h3>
//                       <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//                         Secure blockchain connection established
//                       </p>
//                     </div>
//                   </div>
//                   <div className={`px-4 py-2 rounded-full text-xs font-semibold ${
//                     theme === 'dark' 
//                       ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
//                       : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
//                   }`}>
//                     ✓ VERIFIED
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="mb-8"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                 >
//                   <div className="flex items-start space-x-4 mb-6">
//                     <div className={`p-2 rounded-lg mt-1 ${
//                       theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
//                     }`}>
//                       <User className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className={`text-lg font-semibold mb-2 ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Welcome back, <span className="text-emerald-500">{userData.name || 'Valued Client'}</span>
//                       </h4>
//                       <p className={`text-base leading-relaxed ${
//                         theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
//                       }`}>
//                         Your comprehensive portfolio has been successfully retrieved from our secure blockchain infrastructure.
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.6 }}
//                 >
//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <Globe className="w-5 h-5 text-blue-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Global Markets
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Active across international financial centers
//                     </p>
//                   </div>

//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <TrendingUp className="w-5 h-5 text-emerald-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Advanced Trading
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Institutional-grade trading infrastructure
//                     </p>
//                   </div>

//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <Shield className="w-5 h-5 text-purple-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Enhanced Security
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Advanced protocols ensuring asset protection
//                     </p>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div className={`p-3 sm:p-4 rounded-lg border ${
//               theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//             }`}>
//               <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//                 <User size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//                 Account Information
//               </h3>
//               <div className="space-y-2 text-sm sm:text-base">
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Full Name:</span> {userData.name || 'Not Specified'}
//                 </motion.p>
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Username:</span> {userData.handle || 'Not Specified'}
//                 </motion.p>
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Account Created:</span> {userData.created_at ? new Date(userData.created_at).toLocaleString() : 'Not Available'}
//                 </motion.p>
//                 <motion.p
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Network Referrals:</span> {userData.referral_count || 0}
//                 </motion.p>
//               </div>
//             </div>

//             <div className={`p-3 sm:p-4 rounded-lg border ${
//               theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//             }`}>
//               <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//                 <ChevronRight size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//                 Digital Asset Portfolio
//               </h3>
//               <div className="min-h-0">
//                 {renderWalletBalances()}
//               </div>
//             </div>
//           </div>

//           <div className={`p-3 sm:p-4 rounded-lg border ${
//             theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//           }`}>
//             <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//               <Database size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//               Complete Data Export
//             </h3>
//             <div className="overflow-hidden">
//               <pre className={`text-xs p-3 rounded overflow-x-auto max-w-full ${
//                 theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-800'
//               }`}>
//                 {JSON.stringify(userData, null, 2)}
//               </pre>
//             </div>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default FirestoreQuery;




// import React, { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { lionshareDb, lionshareAuth } from '../firebase';
// import { motion } from 'framer-motion';
// import { ChevronRight, Search, X, RefreshCw, User, Lock, Shield, Database, Star, Globe, TrendingUp, Award, Zap, AlertCircle } from 'lucide-react';

// // Simple hash function to generate verification code from session ID
// const generateVerificationCode = (sessionId, userId) => {
//   const combined = sessionId + (userId || '');
//   let hash = 0;
//   for (let i = 0; i < combined.length; i++) {
//     hash = ((hash << 5) - hash) + combined.charCodeAt(i);
//     hash = hash & hash;
//   }
//   return Math.abs(hash).toString().slice(0, 6); // 6-digit code
// };

// const FirestoreQuery = ({ theme }) => {
//   const [userId, setUserId] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [authUser, setAuthUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [fetchingStage, setFetchingStage] = useState('');
//   const [animatedBalances, setAnimatedBalances] = useState({});
//   const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
//   const [validationError, setValidationError] = useState('');
//   const [showDataExport, setShowDataExport] = useState(false);
//   const [secretCode, setSecretCode] = useState('');
//   const [codeError, setCodeError] = useState('');
//   const [generatedCode, setGeneratedCode] = useState('');

//   const SESSION_ID = '7klR1Pi0PcSt0OdbgfE7fxBsCFj2';

//   // Generate code whenever userId changes
//   useEffect(() => {
//     if (userId) {
//       const code = generateVerificationCode(SESSION_ID, userId);
//       setGeneratedCode(code);
//     }
//   }, [userId]);

//   // Authentication state listener
//   useEffect(() => {
//     if (lionshareAuth) {
//       const unsubscribe = onAuthStateChanged(lionshareAuth, (user) => {
//         setAuthUser(user);
//         setAuthLoading(false);
//       });
//       return () => unsubscribe();
//     } else {
//       setAuthLoading(false);
//     }
//   }, []);

//   // Validate Telegram ID
//   const validateTelegramId = (id) => {
//     if (!id || id.trim() === '') {
//       return { isValid: false, error: 'Please enter a Telegram ID' };
//     }
//     const trimmedId = id.trim();
//     if (!/^\d+$/.test(trimmedId)) {
//       return { isValid: false, error: 'Telegram ID must contain only numbers' };
//     }
//     if (trimmedId.length < 5 || trimmedId.length > 12) {
//       return { isValid: false, error: 'Telegram ID should be between 5-12 digits' };
//     }
//     return { isValid: true, value: trimmedId };
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setUserId(value);
//     if (validationError) setValidationError('');
//     if (value.trim() !== '') {
//       const validation = validateTelegramId(value);
//       if (!validation.isValid) {
//         setValidationError(validation.error);
//       }
//     }
//   };

//   // Handle secret code input
//   const handleSecretCodeChange = (e) => {
//     setSecretCode(e.target.value);
//     if (codeError) setCodeError('');
//   };

//   // Verify secret code
//   const verifySecretCode = () => {
//     if (secretCode.trim() === generatedCode) {
//       setShowDataExport(true);
//       setCodeError('');
//     } else {
//       setCodeError('Invalid GMXTrade secret code. Please try again.');
//     }
//   };

  // // Anonymous authentication
  // const signInAnonymous = async () => {
  //   if (!lionshareAuth) {
  //     setError('Authentication service unavailable');
  //     return;
  //   }
  //   setAuthLoading(true);
  //   try {
  //     await signInAnonymously(lionshareAuth);
  //   } catch (err) {
  //     setError(`Authentication failed: ${err.message}`);
  //   } finally {
  //     setAuthLoading(false);
  //   }
  // };

//   // Balance animation effect
//   const animateBalance = (finalValue, key) => {
//     const duration = 2000;
//     const steps = 50;
//     const increment = finalValue / steps;
//     let currentValue = 0;
//     let step = 0;

//     const timer = setInterval(() => {
//       step++;
//       currentValue = Math.min(currentValue + increment, finalValue);
//       setAnimatedBalances(prev => ({
//         ...prev,
//         [key]: currentValue
//       }));
//       if (step >= steps || currentValue >= finalValue) {
//         clearInterval(timer);
//         setAnimatedBalances(prev => ({
//           ...prev,
//           [key]: finalValue
//         }));
//       }
//     }, duration / steps);
//   };

//   // Fetch user data
//   const fetchUserData = async () => {
//     const validation = validateTelegramId(userId);
//     if (!validation.isValid) {
//       setValidationError(validation.error);
//       setError('Please provide a valid Telegram ID');
//       return;
//     }
//     if (!authUser) {
//       setError('Authentication required to access user data');
//       return;
//     }
//     setValidationError('');
//     setLoading(true);
//     setError(null);
//     setShowLoadingAnimation(true);
//     setAnimatedBalances({});
//     const stages = [
//       'Establishing secure blockchain connection...',
//       'Verifying authentication credentials...',
//       `Scanning for Telegram ID: ${validation.value}...`,
//       'Retrieving comprehensive transaction ledger...',
//       'Processing balance aggregations and analytics...',
//       'Validating data integrity and compliance...',
//       'Compiling comprehensive user portfolio...'
//     ];
//     for (let i = 0; i < stages.length; i++) {
//       setFetchingStage(stages[i]);
//       await new Promise(resolve => setTimeout(resolve, 8000));
//     }
//     try {
//       if (!lionshareDb) throw new Error('Database connection unavailable');
//       const userDocRef = doc(lionshareDb, 'users_production', validation.value);
//       const docSnap = await getDoc(userDocRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setUserData(data);
//         setTimeout(() => {
//           Object.keys(data).forEach(key => {
//             if (typeof data[key] === 'number' && data[key] > 0) {
//               animateBalance(data[key], key);
//             }
//           });
//         }, 500);
//       } else {
//         setError(`User profile not found for Telegram ID: ${validation.value}`);
//         setUserData(null);
//       }
//     } catch (err) {
//       if (err.code === 'permission-denied') {
//         setError('Access denied. Please verify your authorization level.');
//       } else {
//         setError(`Data retrieval error: ${err.message}`);
//       }
//       setUserData(null);
//     } finally {
//       setLoading(false);
//       setShowLoadingAnimation(false);
//       setFetchingStage('');
//     }
//   };

//   // Reset states
//   const clearResults = () => {
//     setUserData(null);
//     setUserId('');
//     setError(null);
//     setAnimatedBalances({});
//     setFetchingStage('');
//     setShowLoadingAnimation(false);
//     setValidationError('');
//     setShowDataExport(false);
//     setSecretCode('');
//     setCodeError('');
//     setGeneratedCode('');
//   };

//   // Render wallet balances
//   const renderWalletBalances = () => {
//     const excludedFields = [
//       'name', 'handle', 'created_at', 'referral_count', 'photo_url',
//       'referral_link', 'last_claim_time', 'last_reset_time',
//       'registration_date', 'is_premium', 'language_code',
//       'follow_facebook_claimed', 'follow_twitter_claimed',
//       'join_telegram_claimed', 'welcome_bonus_received',
//       'subscribe_claimed', 'follow_instagram_claimed',
//       'daily_claims', 'WelcomeBonus'
//     ];
//     const balanceFields = Object.keys(userData)
//       .filter(key => 
//         typeof userData[key] === 'number' && 
//         !excludedFields.includes(key) &&
//         userData[key] > 0
//       )
//       .sort((a, b) => {
//         if (a === 'LSCoin') return -1;
//         if (b === 'LSCoin') return 1;
//         if (a === 'private_sale_LSCoin') return -1;
//         if (b === 'private_sale_LSCoin') return 1;
//         if (['btc', 'eth', 'usdt'].includes(a)) return -1;
//         if (['btc', 'eth', 'usdt'].includes(b)) return 1;
//         return a.localeCompare(b);
//       });
//     return (
//       <div className="grid grid-cols-1 gap-3">
//         <div className="space-y-2">
//           {balanceFields.map(currency => {
//             const displayValue = showLoadingAnimation 
//               ? (animatedBalances[currency] || 0)
//               : userData[currency];
//             return (
//               <motion.p 
//                 key={currency} 
//                 className="text-sm sm:text-base break-words"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: balanceFields.indexOf(currency) * 0.1 }}
//               >
//                 <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//                   {currency === 'private_sale_LSCoin' ? 'Private Sale LSCoin' : currency.toUpperCase()}:
//                 </span> 
//                 <span className={`ml-2 font-bold ${showLoadingAnimation ? 'text-emerald-500' : ''}`}>
//                   {displayValue.toLocaleString(undefined, { 
//                     maximumFractionDigits: currency === 'btc' ? 6 : 
//                                           currency === 'eth' ? 4 : 2 
//                   })}
//                 </span>
//               </motion.p>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   if (authLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-xl shadow-2xl border ${
//           theme === 'dark' ? 'bg-slate-900 border-slate-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
//         } overflow-hidden`}
//       >
//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="animate-spin mr-2" />
//           <span>Initializing authentication services...</span>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`w-full max-w-6xl mx-auto p-4 sm:p-6 rounded-xl shadow-2xl border ${
//         theme === 'dark' ? 'bg-slate-900 border-slate-700/50 text-white' : 'bg-white border-gray-200 text-gray-900'
//       } overflow-hidden`}
//     >
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <h2 className="text-lg sm:text-xl font-bold flex items-center">
//           <Database className="mr-2 text-emerald-500 flex-shrink-0" />
//           <span className="truncate">LionShareCoin Portfolio Management System</span>
//         </h2>
//         {userData && (
//           <button
//             onClick={clearResults}
//             className={`p-2 rounded-lg self-start sm:self-auto ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
//           >
//             <X size={20} />
//           </button>
//         )}
//       </div>

//       {/* Authentication Status */}
//       <div className={`mb-4 p-3 rounded-lg border ${
//         authUser 
//           ? (theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-200' : 'bg-emerald-100 border-emerald-200 text-emerald-700')
//           : (theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700')
//       }`}>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div className="flex items-center">
//             {authUser ? <Shield size={16} className="mr-2 flex-shrink-0" /> : <Lock size={16} className="mr-2 flex-shrink-0" />}
//             <span className="text-sm break-all">
//               {authUser ? `Secure Session Active: ${authUser.uid}` : 'Authentication Required'}
//             </span>
//           </div>
//           {!authUser && (
//             <button
//               onClick={signInAnonymous}
//               disabled={authLoading}
//               className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
//                 theme === 'dark' 
//                   ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
//                   : 'bg-emerald-600 hover:bg-emerald-700 text-white'
//               }`}
//             >
//               {authLoading ? 'Authenticating...' : 'Secure Access'}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Loading Animation */}
//       {showLoadingAnimation && (
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className={`mb-6 p-6 rounded-lg border-2 border-dashed ${
//             theme === 'dark' ? 'border-emerald-600 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
//           }`}
//         >
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <RefreshCw className="animate-spin mr-3 text-emerald-500" size={24} />
//               <div className="text-lg font-bold text-emerald-500">
//                 Processing Data Request
//               </div>
//             </div>
//             <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
//               {fetchingStage || 'Initializing secure blockchain connection...'}
//             </p>
//             <div className="flex justify-center mb-4">
//               <div className="flex space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 bg-emerald-500 rounded-full"
//                     animate={{
//                       scale: [1, 1.5, 1],
//                       opacity: [0.5, 1, 0.5],
//                     }}
//                     transition={{
//                       duration: 1.5,
//                       repeat: Infinity,
//                       delay: i * 0.2,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
//               🔐 Retrieving comprehensive portfolio data from distributed ledger infrastructure
//             </p>
//           </div>
//         </motion.div>
//       )}

//       {!userData ? (
//         <div className="space-y-6">
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//             <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={handleInputChange}
//                 className={`w-full pl-10 pr-4 py-3 sm:py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-base sm:text-sm ${
//                   validationError 
//                     ? (theme === 'dark' ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50')
//                     : (theme === 'dark' 
//                         ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
//                         : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500')
//                 }`}
//                 placeholder="Enter Telegram ID (e.g., 1004758046)"
//                 onKeyPress={(e) => e.key === 'Enter' && fetchUserData()}
//                 disabled={!authUser}
//               />
//             </div>
//             <button
//               onClick={fetchUserData}
//               disabled={loading || !authUser || validationError}
//               className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center transition-colors font-medium ${
//                 loading || !authUser || validationError
//                   ? (theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-300 text-gray-500')
//                   : 'bg-emerald-600 text-white hover:bg-emerald-700'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <RefreshCw size={18} className="mr-2 animate-spin" />
//                   Processing
//                 </>
//               ) : (
//                 'Retrieve Data'
//               )}
//             </button>
//           </div>

//           {validationError && (
//             <div className={`p-3 rounded-lg border flex items-start ${
//               theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700'
//             }`}>
//               <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-medium text-sm">Invalid Telegram ID</p>
//                 <p className="text-xs mt-1">{validationError}</p>
//               </div>
//             </div>
//           )}

//           {error && !validationError && (
//             <div className={`p-3 rounded-lg ${
//               theme === 'dark' ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-100 border-red-200 text-red-700'
//             } border`}>
//               {error}
//             </div>
//           )}

//           <div className={`p-4 rounded-lg border ${
//             theme === 'dark' ? 'bg-blue-900/20 border-blue-800/50' : 'bg-blue-50 border-blue-200/50'
//           }`}>
//             <h4 className={`font-medium text-sm mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
//               Telegram ID Requirements:
//             </h4>
//             <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-blue-200/90' : 'text-blue-700'}`}>
//               <li>• Must contain only numbers (0-9)</li>
//               <li>• Must be 5-12 digits long</li>
//               <li>• Example: <code>123456789, 1004758046</code></li>
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//             className="relative overflow-hidden"
//           >
//             <div className={`relative p-8 rounded-2xl border-2 ${
//               theme === 'dark' 
//                 ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-900/20 border-emerald-500/30' 
//                 : 'bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/30 border-emerald-400/30'
//             }`}>
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
//               <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-xl"></div>
              
//               <div className="relative z-10">
//                 <motion.div 
//                   className="flex items-center justify-between mb-6"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className={`p-3 rounded-xl ${
//                       theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
//                     }`}>
//                       <Star className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-emerald-500">
//                         <Award className="inline-block w-5 h-5 mr-2" />
//                         Portfolio Access Granted
//                       </h3>
//                       <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//                         Secure blockchain connection established
//                       </p>
//                     </div>
//                   </div>
//                   <div className={`px-4 py-2 rounded-full text-xs font-semibold ${
//                     theme === 'dark' 
//                       ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
//                       : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
//                   }`}>
//                     ✓ VERIFIED
//                     <Zap className="inline-block w-4 h-4 ml-2" />
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="mb-8"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                 >
//                   <div className="flex items-start space-x-4 mb-6">
//                     <div className={`p-2 rounded-lg mt-1 ${
//                       theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
//                     }`}>
//                       <User className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className={`text-lg font-semibold mb-2 ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Welcome back, <span className="text-emerald-500">{userData.name || 'Valued Client'}</span>
//                       </h4>
//                       <p className={`text-base leading-relaxed ${
//                         theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
//                       }`}>
//                         Your comprehensive portfolio has been successfully retrieved from our secure blockchain infrastructure.
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.6 }}
//                 >
//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <Globe className="w-5 h-5 text-blue-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Global Markets
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Active across international financial centers
//                     </p>
//                   </div>

//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <TrendingUp className="w-5 h-5 text-emerald-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Advanced Trading
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Institutional-grade trading infrastructure
//                     </p>
//                   </div>

//                   <div className={`p-4 rounded-xl border ${
//                     theme === 'dark' 
//                       ? 'bg-slate-800/50 border-slate-700/50' 
//                       : 'bg-white/80 border-gray-200/50'
//                   }`}>
//                     <div className="flex items-center space-x-3 mb-2">
//                       <Shield className="w-5 h-5 text-purple-500" />
//                       <span className={`font-medium text-sm ${
//                         theme === 'dark' ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         Enhanced Security
//                       </span>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                     }`}>
//                       Advanced protocols ensuring asset protection
//                     </p>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div className={`p-3 sm:p-4 rounded-lg border ${
//               theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//             }`}>
//               <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//                 <User size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//                 Account Information
//               </h3>
//               <div className="space-y-2 text-sm sm:text-base">
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Full Name:</span> {userData.name || 'Not Specified'}
//                 </motion.p>
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Username:</span> {userData.handle || 'Not Specified'}
//                 </motion.p>
//                 <motion.p 
//                   className="break-words"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Account Created:</span> {userData.created_at ? new Date(userData.created_at).toLocaleString() : 'Not Available'}
//                 </motion.p>
//                 <motion.p
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Network Referrals:</span> {userData.referral_count || 0}
//                 </motion.p>
//               </div>
//             </div>

//             <div className={`p-3 sm:p-4 rounded-lg border ${
//               theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//             }`}>
//               <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//                 <ChevronRight size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//                 Digital Asset Portfolio
//               </h3>
//               <div className="min-h-0">
//                 {renderWalletBalances()}
//               </div>
//             </div>
//           </div>

//           <div className={`p-3 sm:p-4 rounded-lg border ${
//             theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'
//           }`}>
//             <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
//               <Database size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
//               Complete Data Export
//             </h3>
//             {showDataExport ? (
//               <div className="overflow-hidden">
//                 <pre className={`text-xs p-3 rounded overflow-x-auto max-w-full ${
//                   theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-800'
//                 }`}>
//                   {JSON.stringify(userData, null, 2)}
//                 </pre>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className={`flex items-start p-3 rounded-lg ${
//                   theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100/50 border-amber-200 text-amber-700'
//                 }`}>
//                   <Lock size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm">
//                       This section is restricted. Please enter your GMXTrade secret code to access the raw data export.
//                     </p>
//                     {generatedCode && (
//                       <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
//                         Your verification code: <span className="font-bold">{generatedCode}</span>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <input
//                     type="text"
//                     value={secretCode}
//                     onChange={handleSecretCodeChange}
//                     className={`p-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
//                       theme === 'dark' 
//                         ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' 
//                         : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
//                     }`}
//                     placeholder="Enter 6-digit GMXTrade secret code"
//                     onKeyPress={(e) => e.key === 'Enter' && verifySecretCode()}
//                   />
//                   <button
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                       secretCode.trim() 
//                         ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
//                         : (theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-300 text-gray-500')
//                     }`}
//                     onClick={verifySecretCode}
//                     disabled={!secretCode.trim()}
//                   >
//                     Unlock Data
//                   </button>
//                 </div>
//                 {codeError && (
//                   <div className={`p-3 rounded-lg border ${
//                     theme === 'dark' ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-100 border-red-200 text-red-700'
//                   }`}>
//                     {codeError}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default FirestoreQuery;


// import React, { useState, useEffect, useCallback } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import { lionshareDb, lionshareAuth } from '../firebase';
// import { motion } from 'framer-motion';
// import { X, RefreshCw, Lock, Database, CheckCircle, AlertCircle, User, ChevronRight, Star, Globe, TrendingUp, Shield, Award, Zap } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { ShieldCheck } from "lucide-react";


// // Helper function for API calls
// const fetchApi = async (url, method, body) => {
//   try {
//     const response = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'An error occurred');
//     }
//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Network error');
//   }
// };

// // Alert Message Component
// const AlertMessage = ({ message, theme }) => (
//   <div className={`p-3 sm:p-4 rounded-lg border mt-4 flex items-start ${theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>
//     <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//     <span className="text-sm break-words min-w-0 flex-1">{message}</span>
//   </div>
// );

// // Raw Data Display Component
// const RawDataDisplay = ({ userData, theme, onClose }) => {
//   return (
//     <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
//       <div className="flex justify-between items-start mb-3">
//         <h4 className="font-medium flex items-center text-sm sm:text-base">
//           <Database size={16} className="mr-2 flex-shrink-0" />
//           <span className="break-words">Raw User Data</span>
//         </h4>
//         <button 
//           onClick={onClose} 
//           className="text-gray-500 hover:text-gray-700 p-1 ml-2"
//           aria-label="Close raw data display"
//         >
//           <X size={18} />
//         </button>
//       </div>
//       <div className="overflow-x-auto">
//         <pre className={`text-xs sm:text-sm p-3 rounded whitespace-pre-wrap break-all ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'}`}>
//           {JSON.stringify(userData, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// };

// // Verification Code Input Component
// const VerificationCodeInput = ({ secretCode, setSecretCode, verifySecretCode, clearPremiumResults, theme, backendCode }) => (
//   <div className="space-y-4">
//     <div className={`flex items-start p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/30 border-blue-800 text-blue-200' : 'bg-blue-100/50 border-blue-200 text-blue-700'}`}>
//       <Lock size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//       <div className="min-w-0 flex-1">
//         <p className="text-sm break-words">Please enter your verification code to access the raw data export.</p>
//         {backendCode && (
//           <div className={`mt-2 p-2 sm:p-3 rounded ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-200'} text-center font-mono text-base sm:text-lg font-bold break-all`}>
//             {backendCode}
//           </div>
//         )}
//       </div>
//     </div>
//     <div className="flex flex-col sm:flex-row gap-3">
//       <input
//         type="text"
//         value={secretCode}
//         onChange={(e) => setSecretCode(e.target.value)}
//         className={`w-full p-4 rounded-lg text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
//         placeholder="Enter verification code"
//         onKeyPress={(e) => e.key === 'Enter' && verifySecretCode()}
//       />
//       <button 
//         onClick={verifySecretCode} 
//         className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${secretCode.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800' : 'bg-gray-400 cursor-not-allowed text-white'}`} 
//         disabled={!secretCode.trim()}
//       >
//         Unlock Data
//       </button>
//       <button 
//         onClick={clearPremiumResults} 
//         className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800' : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'} text-white transition-colors`}
//       >
//         Clear Results
//       </button>
//     </div>
//   </div>
// );

// // Wallet Balances Component
// const WalletBalances = ({ userData, theme, refreshBasicUserData, clearBasicResults, animatedBalances, showLoadingAnimation }) => {
//   const excludedFields = ['name', 'handle', 'created_at', 'referral_count', 'photo_url', 'referral_link', 'last_reset', 'registration_date', 'is_premium', 'language_code', 'follow_facebook', 'follow_twitter', 'join_telegram', 'welcome_bonus', 'subscribe', 'follow_instagram', 'daily_claims', 'WelcomeBonus', 'verification_code'];
//   const balanceFields = Object.keys(userData)
//     .filter(key => typeof userData[key] === 'number' && !excludedFields.includes(key) && userData[key] > 0)
//     .sort((a, b) => {
//       if (a === 'LSCoin') return -1;
//       if (b === 'LSCoin') return 1;
//       if (a === 'private_sale_LSCoin') return -1;
//       if (b === 'private_sale_LSCoin') return 1;
//       if (['bitcoin', 'eth', 'usdt'].includes(a)) return -1;
//       if (['bitcoin', 'eth', 'usdt'].includes(b)) return 1;
//       return a.localeCompare(b);
//     });

//   return (
//     <div className="mt-6">
//       <h4 className="font-medium text-base sm:text-lg mb-4 flex items-center">
//         <ChevronRight size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
//         Digital Asset Portfolio
//       </h4>
//       <div className="space-y-2">
//         {balanceFields.map(currency => {
//           const displayValue = showLoadingAnimation 
//             ? (animatedBalances[currency] || 0)
//             : userData[currency];
//           return (
//             <motion.div 
//               key={currency}
//               className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: balanceFields.indexOf(currency) * 0.1 }}
//             >
//               <div className="flex justify-between items-center">
//                 <span className={`font-medium text-sm sm:text-base text-break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {currency === 'private_sale_LSCoin' ? 'Private Sale LSCoin' : currency.toUpperCase()}
//                 </span>
//                 <span className={`font-bold text-base sm:text-lg break-all ml-2 ${showLoadingAnimation ? 'text-emerald-500' : ''}`}>
//                   {displayValue.toLocaleString(undefined, { 
//                     maximumFractionDigits: currency === 'bitcoin' ? 6 : 
//                                           currency === 'eth' ? 4 : 2 
//                   })}
//                 </span>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//       <div className="mt-6 flex flex-col sm:flex-row gap-3">
//         <button 
//           onClick={refreshBasicUserData} 
//           className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800' : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'} text-white transition-colors`}
//         >
//           <RefreshCw size={16} className="mr-2" />
//           Refresh Data
//         </button>
//         <button 
//           onClick={clearBasicResults} 
//           className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800' : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'} text-white transition-colors`}
//         >
//           Clear Results
//         </button>
//       </div>
//     </div>
//   );
// };

// // Basic User Lookup Component
// const BasicUserLookup = ({ theme, basicUserId, setBasicUserId, fetchBasicUserData, basicLoading, basicError, basicUserData, refreshBasicUserData, clearBasicResults, animatedBalances, showLoadingAnimation }) => {
//   const [validationError, setValidationError] = useState('');

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setBasicUserId(value);
//     if (validationError) setValidationError('');
//     if (value.trim()) {
//       const validation = validateTelegramId(value);
//       if (!validation.isValid) {
//         setValidationError(validation.error);
//       }
//     }
//   };

//   const validateTelegramId = (id) => {
//     if (!id || id.trim() === '') {
//       return { isValid: false, error: 'Please enter a User ID' };
//     }
//     const trimmedId = id.trim();
//     if (!/^\d+$/.test(trimmedId)) {
//       return { isValid: false, error: 'User ID must contain only numbers' };
//     }
//     if (trimmedId.length < 5 || trimmedId.length > 12) {
//       return { isValid: false, error: 'User ID should be between 5-12 digits' };
//     }
//     return { isValid: true, value: trimmedId };
//   };

//   return (
//     <section className={`w-full p-4 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
//       <h3 className="font-medium mb-4 flex items-center text-lg sm:text-xl">
//         <Database size={20} className="mr-2 text-emerald-500 flex-shrink-0" />
//         <span className="break-words">Basic User Lookup</span>
//       </h3>
//       <div className="space-y-4">
//         <input
//           type="text"
//           value={basicUserId}
//           onChange={handleInputChange}
//           className={`w-full p-4 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${validationError ? (theme === 'dark' ? 'border-amber-500 bg-amber-900/20' : 'border-amber-500 bg-amber-50') : (theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500')}`}
//           placeholder="Enter User ID (5-12 digits)"
//           onKeyPress={(e) => e.key === 'Enter' && fetchBasicUserData()}
//         />
        
//         <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800/50' : 'bg-blue-50 border-blue-200/50'}`}>
//           <h4 className={`font-medium text-sm mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
//             Telegram ID Requirements:
//           </h4>
//           <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-blue-200/90' : 'text-blue-700'}`}>
//             <li>• Must contain only numbers (0-9)</li>
//             <li>• Must be 5-12 digits long</li>
//             <li>• Example: <code>123456789, 1004758046</code></li>
//           </ul>
//         </div>

//         <button 
//           onClick={fetchBasicUserData} 
//           className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${basicLoading || validationError ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'}`} 
//           disabled={basicLoading || validationError}
//         >
//           {basicLoading ? (
//             <>
//               <RefreshCw className="animate-spin mr-2" size={16} />
//               Processing...
//             </>
//           ) : (
//             'Fetch User Data'
//           )}
//         </button>
//       </div>
      
//       {validationError && (
//         <AlertMessage message={validationError} theme={theme} />
//       )}
//       {basicError && !validationError && (
//         <AlertMessage message={basicError} theme={theme} />
//       )}
//       {basicUserData && (
//         <WalletBalances 
//           userData={basicUserData} 
//           theme={theme} 
//           refreshBasicUserData={refreshBasicUserData} 
//           clearBasicResults={clearBasicResults}
//           animatedBalances={animatedBalances}
//           showLoadingAnimation={showLoadingAnimation}
//         />
//       )}
//     </section>
//   );
// };

// const PremiumFeatures = ({ theme, premiumUserId, setPremiumUserId, checkPremiumSubscription, premiumLoading, premiumError, showVerificationCode, secretCode, setSecretCode, verifySecretCode, clearPremiumResults, basicUserData, showRawData, setShowRawData, backendCode }) => {
//   const isDisabled = !basicUserData;

//   return (
//     <section className={`w-full p-4 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
//       <h3 className="font-medium mb-4 flex items-center text-lg sm:text-xl">
//         <Lock size={20} className="mr-2 text-emerald-500" />
//         <span className="break-words">Premium Features</span>
//         {!basicUserData && (
//           <span className="ml-2 px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
//             Locked
//           </span>
//         )}
//       </h3>
      
//       <div className="space-y-4">
//         <div className="relative">
//           <input
//             type="text"
//             value={premiumUserId}
//             onChange={(e) => setPremiumUserId(e.target.value)}
//             className={`w-full p-4 rounded-lg text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//             placeholder="Enter Premium User ID (alphanumeric)"
//             disabled={isDisabled}
//           />
//           {premiumUserId && (
//             <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-emerald-800/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
//               Auto-filled
//             </div>
//           )}
//         </div>
        
//         <button 
//           onClick={checkPremiumSubscription} 
//           className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${premiumLoading || isDisabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'}`} 
//           disabled={premiumLoading || isDisabled}
//         >
//           {premiumLoading ? (
//             <>
//               <RefreshCw className="animate-spin mr-2" size={16} />
//               Checking...
//             </>
//           ) : (
//             'Check Subscription'
//           )}
//         </button>
//       </div>
      
//       {!basicUserData && (
//         <AlertMessage 
//           message="Please complete Basic User Lookup first to access Premium Features" 
//           theme={theme} 
//         />
//       )}
      
//       {premiumError && basicUserData && <AlertMessage message={premiumError} theme={theme} />}
      
      
//       {showVerificationCode && (
//         <div className="mt-6 space-y-4">
//           <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-600/50 border-blue-600 text-blue-200' : 'bg-blue-100/50 border-blue-200 text-blue-700'}`}>
//             <div className="flex items-center">
//               <CheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
//               <div className="min-w-0 flex-1">
//                 <span className="text-sm break-words">Premium subscription active! Your verification code:</span>
//               </div>
//             </div>
//           </div>
          
//           <VerificationCodeInput 
//             secretCode={secretCode} 
//             setSecretCode={setSecretCode} 
//             verifySecretCode={verifySecretCode} 
//             clearPremiumResults={clearPremiumResults} 
//             theme={theme} 
//             backendCode={backendCode}
//           />
          
//           {showRawData && basicUserData && (
//             <RawDataDisplay 
//               userData={basicUserData} 
//               theme={theme} 
//               onClose={() => setShowRawData(false)} 
//             />
//           )}
//         </div>
//       )}
//     </section>
//   );
// };


// const SessionInfo = ({ authKey, theme }) => (
//   <div
//     className={`mx-auto mb-6 p-4 max-w-lg rounded-2xl shadow-lg border 
//       ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
//   >
//     <div className="flex items-center space-x-3 mb-4">
//       <CheckCircle 
//         className={`text-emerald-500 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} 
//         size={24} 
//       />
//       <h4 
//         className={`text-sm font-semibold 
//           ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
//       >
//         Active Session
//       </h4>
//     </div>
//     <div className="flex items-start space-x-3">
//       <ShieldCheck 
//         className={`text-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} 
//         size={24} 
//       />
//       <div>
//         <code
//           className={`block text-xs sm:text-sm font-mono break-all px-3 py-1 rounded-lg 
//             ${theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
//         >
//           {authKey}
//         </code>
//         <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//           Your session is authenticated with LionShareCoin's secure system, ensuring privacy and data protection at all times.
//         </p>
//       </div>
//     </div>
//   </div>
// );

// // Main FirestoreQuery Component
// const FirestoreQuery = ({ theme,  userId, userEmail  }) => {
//   const [basicUserId, setBasicUserId] = useState('');
//   const [basicUserData, setBasicUserData] = useState(null);
//   const [basicLoading, setBasicLoading] = useState(false);
//   const [basicError, setBasicError] = useState(null);
//   const [premiumUserId, setPremiumUserId] = useState('');
//   const [premiumLoading, setPremiumLoading] = useState(false);
//   const [premiumError, setPremiumError] = useState(null);
//   const [secretCode, setSecretCode] = useState('');
//   const [showVerificationCode, setShowVerificationCode] = useState(false);
//   const [showRawData, setShowRawData] = useState(false);
//   const [authUser, setAuthUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [authKey, setAuthKey] = useState(null); // State to store the authentication key
//   const [fetchingStage, setFetchingStage] = useState('');
//   const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
//   const [animatedBalances, setAnimatedBalances] = useState({});
//   const [backendCode, setBackendCode] = useState('');
//   const navigate = useNavigate();

  
//   // useEffect(() => {
//   //   if (userId) {
//   //     console.log('Received User ID:', userId);
//   //     console.log('Received User Email:', userEmail);
//   //   }
//   // }, [userId, userEmail]);

//     // Add this useEffect to set premiumUserId when userId is available
//     useEffect(() => {
//       if (userId) {
//         setPremiumUserId(userId);
//       }
//     }, [userId]);
  

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(lionshareAuth, (user) => {
//     setAuthUser(user);
//     if (user) {
//       setAuthKey(user.uid); // Store the UID as the authentication key
//     }
//     setAuthLoading(false);
//   });
//   return () => unsubscribe();
// }, []);

//   // Balance animation effect
//   const animateBalance = (finalValue, key) => {
//     const duration = 2000;
//     const steps = 50;
//     const increment = finalValue / steps;
//     let currentValue = 0;
//     let step = 0;

//     const timer = setInterval(() => {
//       step++;
//       currentValue = Math.min(currentValue + increment, finalValue);
//       setAnimatedBalances(prev => ({
//         ...prev,
//         [key]: currentValue
//       }));
//       if (step >= steps || currentValue >= finalValue) {
//         clearInterval(timer);
//         setAnimatedBalances(prev => ({
//           ...prev,
//           [key]: finalValue
//         }));
//       }
//     }, duration / steps);
//   };

//   // Validate Telegram ID
//   const validateTelegramId = (id) => {
//     if (!id || id.trim() === '') {
//       return { isValid: false, error: 'Please enter a User ID' };
//     }
//     const trimmedId = id.trim();
//     if (!/^\d+$/.test(trimmedId)) {
//       return { isValid: false, error: 'User ID must contain only numbers' };
//     }
//     if (trimmedId.length < 5 || trimmedId.length > 12) {
//       return { isValid: false, error: 'User ID should be between 5-12 digits' };
//     }
//     return { isValid: true, value: trimmedId };
//   };

//   const fetchBasicUserData = async () => {
//     const validation = validateTelegramId(basicUserId);
//     if (!validation.isValid) {
//       setBasicError(validation.error);
//       return;
//     }
//     if (!authUser) {
//       setBasicError('Authentication required to access user data');
//       return;
//     }
//     setBasicLoading(true);
//     setBasicError(null);
//     setShowLoadingAnimation(true);
//     setAnimatedBalances({});

//     const stages = [
//       'Establishing secure blockchain connection...',
//       'Verifying authentication credentials...',
//       `Scanning for User ID: ${validation.value}...`,
//       'Retrieving comprehensive transaction ledger...',
//       'Processing balance aggregations and analytics...',
//       'Validating data integrity and compliance...',
//       'Compiling comprehensive user portfolio...'
//     ];

//     for (let i = 0; i < stages.length; i++) {
//       setFetchingStage(stages[i]);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }

//     try {
//       const userDocRef = doc(lionshareDb, 'users_production', validation.value);
//       const docSnap = await getDoc(userDocRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setBasicUserData(data);
//         setTimeout(() => {
//           Object.keys(data).forEach(key => {
//             if (typeof data[key] === 'number' && data[key] > 0) {
//               animateBalance(data[key], key);
//             }
//           });
//         }, 500);
//       } else {
//         setBasicError(`User profile not found for ID: ${validation.value}`);
//         setBasicUserData(null);
//       }
//     } catch (error) {
//       setBasicError(`Data retrieval error: ${error.message}`);
//       setBasicUserData(null);
//     } finally {
//       setBasicLoading(false);
//       setShowLoadingAnimation(false);
//       setFetchingStage('');
//     }
//   };


//   const checkPremiumSubscription = useCallback(async () => {
//     if (!basicUserData) {
//       setPremiumError('Please fetch Basic User Data first before accessing Premium Features');
//       return;
//     }
    
//     if (!premiumUserId) {
//       setPremiumError('Please enter a valid Premium User ID');
//       return;
//     }
    
//     setPremiumLoading(true);
//     setPremiumError(null);
    
//     try {
//       const result = await fetchApi('http://localhost:5000/check-subscription', 'POST', { 
//         userId: premiumUserId 
//       });
      
//       if (result.hasSubscription) {
//         setShowVerificationCode(true);
//         setBackendCode(result.verification_code || '');
//         setPremiumError(null);
//       } else {
//         navigate(`/dashboard/deposit?purpose=premium&userId=${premiumUserId}`);
//       }
//     } catch (error) {
//       setPremiumError(error.message);
//     } finally {
//       setPremiumLoading(false);
//     }
//   }, [premiumUserId, navigate, basicUserData]); // Add basicUserData to dependencies

//   const verifySecretCode = async () => {
//     if (!secretCode.trim()) {
//       setPremiumError('Please enter a verification code');
//       return;
//     }
//     try {
//       const result = await fetchApi('http://localhost:5000/verify-code', 'POST', {
//         userId: premiumUserId,
//         code: secretCode.trim()
//       });
      
//       if (result.verified) {
//         setPremiumError(null);
//         setShowRawData(true);
//       } else {
//         setPremiumError('Invalid verification code. Please check and try again.');
//       }
//     } catch (error) {
//       setPremiumError(error.message);
//     }
//   };

//   const clearBasicResults = () => {
//     setBasicUserData(null);
//     setBasicUserId('');
//     setBasicError(null);
//     setShowLoadingAnimation(false);
//     setFetchingStage('');
//     setAnimatedBalances({});
//   };

//   const clearPremiumResults = () => {
//     setPremiumUserId('');
//     setPremiumError(null);
//     setSecretCode('');
//     setShowVerificationCode(false);
//     setShowRawData(false);
//     setBackendCode('');
//   };



//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`rounded-xl mx-auto w-full max-w-4xl ${
//         theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       } shadow-lg p-4 sm:p-6`}
//     >
//       {/* Header Section - Responsive Flex */}
//       <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
//         <h2 className="text-lg sm:text-xl font-bold flex items-center">
//           <Database className="mr-2 text-emerald-500 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
//           <span className="truncate">LionShareCoin Portfolio Management System</span>
//         </h2>
//         {basicUserData && (
//           <button 
//             onClick={clearBasicResults}
//             className={`p-2 rounded-lg self-end xs:self-auto ${
//               theme === 'dark' 
//                 ? 'hover:bg-gray-800 text-gray-400' 
//                 : 'hover:bg-gray-100 text-gray-600'
//             }`}
//           >
//             <X size={20} />
//           </button>
//         )}
//       </div>
  
//       {authLoading ? (
//         <div className="flex flex-col sm:flex-row items-center justify-center py-6 sm:py-8">
//           <RefreshCw className="animate-spin mr-2 w-5 h-5 sm:w-6 sm:h-6" />
//           <span className="text-center sm:text-left text-sm sm:text-base">
//             Initializing authentication services...
//           </span>
//         </div>
//       ) : (
//         <>
//           {!authUser ? (
//             <div className="text-center mb-4 sm:mb-6">
//               <button
//                 onClick={async () => {
//                   setAuthLoading(true);
//                   try {
//                     const userCredential = await signInAnonymously(lionshareAuth);
//                     setAuthKey(userCredential.user.uid);
//                   } catch (err) {
//                     setBasicError(`Authentication failed: ${err.message}`);
//                   } finally {
//                     setAuthLoading(false);
//                   }
//                 }}
//                 className={`px-6 py-3 rounded-lg font-medium text-sm sm:text-base w-full xs:w-auto ${
//                   theme === 'dark' 
//                     ? 'bg-emerald-600 hover:bg-emerald-700' 
//                     : 'bg-emerald-500 hover:bg-emerald-600'
//                 } text-white transition-colors`}
//               >
//                 Secure Access
//               </button>
//             </div>
//           ) : (
//             <>
//               <SessionInfo authKey={authKey} theme={theme} userId={userId} userEmail={userEmail} />
            
//               {showLoadingAnimation && (
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg border-2 border-dashed ${
//                     theme === 'dark' 
//                       ? 'border-emerald-600 bg-emerald-600/20' 
//                       : 'border-emerald-600 bg-emerald-50'
//                   }`}
//                 >
//                   <div className="text-center">
//                     <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
//                       <RefreshCw className="animate-spin mr-0 sm:mr-3 mb-2 sm:mb-0 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
//                       <div className="text-lg font-bold text-emerald-500">
//                         Processing Data Request
//                       </div>
//                     </div>
//                     <p className={`text-sm mb-3 sm:mb-4 ${
//                       theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                     }`}>
//                       {fetchingStage || 'Initializing secure blockchain connection...'}
//                     </p>
//                     <div className="flex justify-center mb-3 sm:mb-4">
//                       <div className="flex space-x-1">
//                         {[...Array(5)].map((_, i) => (
//                           <motion.div
//                             key={i}
//                             className="w-2 h-2 bg-emerald-500 rounded-full"
//                             animate={{
//                               scale: [1, 1.5, 1],
//                               opacity: [0.5, 1, 0.5],
//                             }}
//                             transition={{
//                               duration: 1.5,
//                               repeat: Infinity,
//                               delay: i * 0.2,
//                             }}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <p className={`text-xs ${
//                       theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                     }`}>
//                       🔐 Retrieving comprehensive portfolio data from distributed ledger infrastructure
//                     </p>
//                   </div>
//                 </motion.div>
//               )}
  
//               {!basicUserData ? (
//                 <section className="space-y-4 sm:space-y-6">
//                   <BasicUserLookup
//                     theme={theme}
//                     basicUserId={basicUserId}
//                     setBasicUserId={setBasicUserId}
//                     fetchBasicUserData={fetchBasicUserData}
//                     basicLoading={basicLoading}
//                     basicError={basicError}
//                     basicUserData={basicUserData}
//                     refreshBasicUserData={fetchBasicUserData}
//                     clearBasicResults={clearBasicResults}
//                     animatedBalances={animatedBalances}
//                     showLoadingAnimation={showLoadingAnimation}
//                   />
//                   <PremiumFeatures
//                     theme={theme}
//                     premiumUserId={premiumUserId}
//                     setPremiumUserId={setPremiumUserId}
//                     checkPremiumSubscription={checkPremiumSubscription}
//                     premiumLoading={premiumLoading}
//                     premiumError={premiumError}
//                     showVerificationCode={showVerificationCode}
//                     secretCode={secretCode}
//                     setSecretCode={setSecretCode}
//                     verifySecretCode={verifySecretCode}
//                     clearPremiumResults={clearPremiumResults}
//                     basicUserData={basicUserData}
//                     showRawData={showRawData}
//                     setShowRawData={setShowRawData}
//                     backendCode={backendCode}
//                   />
//                 </section>
//               ) : (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: 0.3 }}
//                     className="relative overflow-hidden"
//                   >
//                     <div className={`relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl ${
//                       theme === 'dark' 
//                         ? 'bg-gradient-to-br from-gray-800 to-emerald-900/30' 
//                         : 'bg-gradient-to-br from-white to-emerald-50/30'
//                     } shadow-lg`}>
//                       <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-emerald-400/10 to-blue-400/40 rounded-full blur-xl sm:blur-2xl"></div>
//                       <div className="absolute bottom-0 left-0 w-20 h-24 sm:w-24 sm:h-32 bg-gradient-to-tr from-blue-400/10 to-emerald-400/40 rounded-full blur-xl sm:blur-2xl"></div>
                      
//                       <div className="relative z-10">
//                         <motion.div 
//                           className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4"
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.4 }}
//                         >
//                           <div className="flex items-center space-x-2 sm:space-x-3">
//                             <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
//                               theme === 'dark' 
//                                 ? 'bg-emerald-400/20 text-emerald-400' 
//                                 : 'bg-emerald-100 text-emerald-400'
//                             }`}>
//                               <Star className="w-5 h-5 sm:w-6 sm:h-6" />
//                             </div>
//                             <div>
//                               <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-500">
//                                 <Award className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//                                 Portfolio Access Granted
//                               </h3>
//                               <p className={`text-xs sm:text-sm ${
//                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
//                               }`}>
//                                 Secure blockchain connection established
//                               </p>
//                             </div>
//                           </div>
//                           <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-semibold ${
//                             theme === 'dark' 
//                               ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
//                               : 'bg-emerald-100 text-emerald-400 border border-emerald-200'
//                           }`}>
//                             ✓ VERIFIED
//                             <Zap className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
//                           </div>
//                         </motion.div>
  
//                         <motion.div 
//                           className="mb-6 sm:mb-8"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.5 }}
//                         >
//                           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 mb-4 sm:mb-6">
//                             <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${
//                               theme === 'dark' 
//                                 ? 'bg-blue-400/20 text-blue-400' 
//                                 : 'bg-blue-100 text-blue-400'
//                             }`}>
//                               <User className="w-4 h-4 sm:w-5 sm:h-5" />
//                             </div>
//                             <div className="flex-1">
//                               <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
//                                 theme === 'dark' ? 'text-white' : 'text-gray-900'
//                               }`}>
//                                 Welcome back, <span className="text-emerald-500">{basicUserData.name || 'Valued Client'}</span>
//                               </h3>
//                               <p className={`text-sm sm:text-base leading-relaxed ${
//                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                               }`}>
//                                 Your comprehensive portfolio has been successfully retrieved from our secure blockchain infrastructure.
//                               </p>
//                             </div>
//                           </div>
//                         </motion.div>
  
//                         <motion.div
//                           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.6 }}
//                         >
//                           {[
//                             {
//                               icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />,
//                               title: "Global Markets",
//                               description: "Active across international financial centers",
//                             },
//                             {
//                               icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />,
//                               title: "Advanced Trading",
//                               description: "Institutional-grade trading infrastructure",
//                             },
//                             {
//                               icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
//                               title: "Enhanced Security",
//                               description: "Advanced protocols ensuring asset protection",
//                             },
//                           ].map((card, index) => (
//                             <div
//                               key={index}
//                               className={`p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl transition-transform transform hover:scale-[1.02] ${
//                                 theme === "dark" 
//                                   ? "bg-gradient-to-r from-gray-800 to-gray-700 shadow-xl" 
//                                   : "bg-gradient-to-r from-white to-gray-100 shadow-md"
//                               }`}
//                             >
//                               <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
//                                 {card.icon}
//                                 <span
//                                   className={`font-semibold text-xs sm:text-sm md:text-base ${
//                                     theme === "dark" ? "text-white" : "text-gray-900"
//                                   }`}
//                                 >
//                                   {card.title}
//                                 </span>
//                               </div>
//                               <p
//                                 className={`text-xs sm:text-sm ${
//                                   theme === "dark" ? "text-gray-400" : "text-gray-600"
//                                 }`}
//                               >
//                                 {card.description}
//                               </p>
//                             </div>
//                           ))}
//                         </motion.div>
//                       </div>
//                     </div>
  
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
//                       <div
//                         className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden 
//                           ${theme === 'dark' 
//                             ? 'bg-gray-800/50 border border-gray-700' 
//                             : 'bg-white/80 border border-gray-200'} 
//                           shadow-sm`}
//                       >
//                         <h3 className="font-bold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center text-base sm:text-lg md:text-xl relative z-10">
//                           <User size={32} className="mr-0 sm:mr-3 mb-2 sm:mb-0 text-emerald-500 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10" />
//                           <span
//                             className={`bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent ${
//                               theme === 'dark' ? 'from-emerald-400 to-emerald-500' : ''
//                             }`}
//                           >
//                             Account Information
//                           </span>
//                         </h3>
//                         <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base relative z-10 flex flex-col items-center text-center">
//                           {[
//                             { label: "Full Name:", value: basicUserData.name || 'Not Specified' },
//                             { label: "Username:", value: basicUserData.handle || 'Not Specified' },
//                             { 
//                               label: "Account Created:", 
//                               value: basicUserData.created_at 
//                                 ? new Date(basicUserData.created_at).toLocaleString() 
//                                 : 'Not Available' 
//                             },
//                             { label: "Network Referrals:", value: basicUserData.referral_count || 0 },
//                           ].map((item, index) => (
//                             <motion.p
//                               key={index}
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: 0.1 * (index + 1) }}
//                               className="break-words w-full"
//                             >
//                               <span className={`font-medium ${
//                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
//                               }`}>
//                                 {item.label}
//                               </span>{' '}
//                               {item.value}
//                             </motion.p>
//                           ))}
//                         </div>
//                       </div>
  
//                       <div
//                         className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden 
//                           ${theme === 'dark' 
//                             ? 'bg-gray-800/50 border border-gray-700' 
//                             : 'bg-white/80 border border-gray-200'} 
//                           shadow-sm`}
//                       >
//                         <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-emerald-400/20 to-emerald-300/20 rounded-full blur-lg sm:blur-xl"></div>
//                         <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-emerald-300/20 to-emerald-400/20 rounded-full blur-lg sm:blur-xl"></div>
//                         <WalletBalances
//                           userData={basicUserData}
//                           theme={theme}
//                           refreshBasicUserData={fetchBasicUserData}
//                           clearBasicResults={clearBasicResults}
//                           animatedBalances={animatedBalances}
//                           showLoadingAnimation={showLoadingAnimation}
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
  
//                   <section className="mt-4 sm:mt-6">
//                     <PremiumFeatures
//                       theme={theme}
//                       premiumUserId={premiumUserId}
//                       setPremiumUserId={setPremiumUserId}
//                       checkPremiumSubscription={checkPremiumSubscription}
//                       premiumLoading={premiumLoading}
//                       premiumError={premiumError}
//                       showVerificationCode={showVerificationCode}
//                       secretCode={secretCode}
//                       setSecretCode={setSecretCode}
//                       verifySecretCode={verifySecretCode}
//                       clearPremiumResults={clearPremiumResults}
//                       basicUserData={basicUserData}
//                       showRawData={showRawData}
//                       setShowRawData={setShowRawData}
//                       backendCode={backendCode}
//                     />
//                   </section>
//                 </>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default FirestoreQuery;





import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { lionshareDb, lionshareAuth } from '../firebase';
import { motion } from 'framer-motion';
import { X, RefreshCw, Lock, Database, CheckCircle, AlertCircle, User, ChevronRight, Star, Globe, TrendingUp, Shield, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from "lucide-react";


// Helper function for API calls
const fetchApi = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};


// Alert Message Component
const AlertMessage = ({ message, theme }) => (
  <div className={`p-3 sm:p-4 rounded-lg border mt-4 flex items-start ${theme === 'dark' ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>
    <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
    <span className="text-sm break-words min-w-0 flex-1">{message}</span>
  </div>
);

// Raw Data Display Component
const RawDataDisplay = ({ userData, theme, onClose }) => {
  return (
    <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium flex items-center text-sm sm:text-base">
          <Database size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">Raw User Data</span>
        </h4>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 p-1 ml-2"
          aria-label="Close raw data display"
        >
          <X size={18} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className={`text-xs sm:text-sm p-3 rounded whitespace-pre-wrap break-all ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'}`}>
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Verification Code Input Component
const VerificationCodeInput = ({ secretCode, setSecretCode, verifySecretCode, clearPremiumResults, theme, backendCode }) => (
  <div className="space-y-4">
    <div className={`flex items-start p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/30 border-blue-800 text-blue-200' : 'bg-blue-100/50 border-blue-200 text-blue-700'}`}>
      <Lock size={16} className="mr-2 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm break-words">Please enter your verification code to access the raw data export.</p>
        {backendCode && (
          <div className={`mt-2 p-2 sm:p-3 rounded ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-200'} text-center font-mono text-base sm:text-lg font-bold break-all`}>
            {backendCode}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={secretCode}
        onChange={(e) => setSecretCode(e.target.value)}
        className={`w-full p-4 rounded-lg text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
        placeholder="Enter verification code"
        onKeyPress={(e) => e.key === 'Enter' && verifySecretCode()}
      />
      <button 
        onClick={verifySecretCode} 
        className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${secretCode.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800' : 'bg-gray-400 cursor-not-allowed text-white'}`} 
        disabled={!secretCode.trim()}
      >
        Unlock Data
      </button>
      <button 
        onClick={clearPremiumResults} 
        className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800' : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'} text-white transition-colors`}
      >
        Clear Results
      </button>
    </div>
  </div>
);

// Wallet Balances Component
const WalletBalances = ({ userData, theme, refreshBasicUserData, clearBasicResults, animatedBalances, showLoadingAnimation }) => {
  const excludedFields = ['name', 'handle', 'created_at', 'referral_count', 'photo_url', 'referral_link', 'last_reset', 'registration_date', 'is_premium', 'language_code', 'follow_facebook', 'follow_twitter', 'join_telegram', 'welcome_bonus', 'subscribe', 'follow_instagram', 'daily_claims', 'WelcomeBonus', 'verification_code'];
  const balanceFields = Object.keys(userData)
    .filter(key => typeof userData[key] === 'number' && !excludedFields.includes(key) && userData[key] > 0)
    .sort((a, b) => {
      if (a === 'LSCoin') return -1;
      if (b === 'LSCoin') return 1;
      if (a === 'private_sale_LSCoin') return -1;
      if (b === 'private_sale_LSCoin') return 1;
      if (['bitcoin', 'eth', 'usdt'].includes(a)) return -1;
      if (['bitcoin', 'eth', 'usdt'].includes(b)) return 1;
      return a.localeCompare(b);
    });

  return (
    <div className="mt-6">
      <h4 className="font-medium text-base sm:text-lg mb-4 flex items-center">
        <ChevronRight size={16} className="mr-2 text-emerald-500 flex-shrink-0" />
        Digital Asset Portfolio
      </h4>
      <div className="space-y-2">
        {balanceFields.map(currency => {
          const displayValue = showLoadingAnimation 
            ? (animatedBalances[currency] || 0)
            : userData[currency];
          return (
            <motion.div 
              key={currency}
              className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: balanceFields.indexOf(currency) * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <span className={`font-medium text-sm sm:text-base text-break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currency === 'private_sale_LSCoin' ? 'Private Sale LSCoin' : currency.toUpperCase()}
                </span>
                <span className={`font-bold text-base sm:text-lg break-all ml-2 ${showLoadingAnimation ? 'text-emerald-500' : ''}`}>
                  {displayValue.toLocaleString(undefined, { 
                    maximumFractionDigits: currency === 'bitcoin' ? 6 : 
                                          currency === 'eth' ? 4 : 2 
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={refreshBasicUserData} 
          className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800' : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'} text-white transition-colors`}
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh Data
        </button>
        <button 
          onClick={clearBasicResults} 
          className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800' : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'} text-white transition-colors`}
        >
          Clear Results
        </button>
      </div>
    </div>
  );
};

// Search Users Function
const searchUsersByNameOrHandle = async (searchTerm, db) => {
  try {
    // First check if the search term is a numeric ID (existing functionality)
    if (/^\d+$/.test(searchTerm.trim())) {
      const userDocRef = doc(db, 'users_production', searchTerm.trim());
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return { 
          userId: searchTerm.trim(), 
          userData: docSnap.data() 
        };
      }
    }

    // If not numeric ID, search by name/handle/last_name
    const usersRef = collection(db, 'users_production');
    const nameQuery = query(
      usersRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );
    const handleQuery = query(
      usersRef,
      where('handle', '>=', searchTerm),
      where('handle', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );
    const lastNameQuery = query(
      usersRef,
      where('last_name', '>=', searchTerm),
      where('last_name', '<=', searchTerm + '\uf8ff'),
      limit(5)
    );

    const [nameSnapshot, handleSnapshot, lastNameSnapshot] = await Promise.all([
      getDocs(nameQuery),
      getDocs(handleQuery),
      getDocs(lastNameQuery)
    ]);

    const matches = new Map(); // Using Map to avoid duplicates

    // Process name matches
    nameSnapshot.forEach(doc => {
      matches.set(doc.id, { ...doc.data(), id: doc.id });
    });

    // Process handle matches
    handleSnapshot.forEach(doc => {
      matches.set(doc.id, { ...doc.data(), id: doc.id });
    });

    // Process last_name matches
    lastNameSnapshot.forEach(doc => {
      matches.set(doc.id, { ...doc.data(), id: doc.id });
    });

    if (matches.size === 0) {
      throw new Error('No users found matching your search');
    }

    return Array.from(matches.values());
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
};

// Basic User Lookup Component
const BasicUserLookup = ({ 
  theme, 
  basicUserId, 
  setBasicUserId, 
  fetchBasicUserData, 
  basicLoading, 
  basicError, 
  basicUserData, 
  refreshBasicUserData, 
  clearBasicResults, 
  animatedBalances, 
  showLoadingAnimation,
  debitXLMForSearch // Add this prop
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  // const handleSearch = async () => {
  //   if (!searchTerm.trim()) {
  //     setSearchError('Please enter a name, handle, or ID to search');
  //     return;
  //   }

  //   setSearchLoading(true);
  //   setSearchError(null);
    
  //   try {
  //     const results = await searchUsersByNameOrHandle(searchTerm.trim(), lionshareDb);
  //     setSearchResults(Array.isArray(results) ? results : [results]);
  //   } catch (error) {
  //     setSearchError(error.message);
  //     setSearchResults([]);
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  // const handleSearch = async () => {
  //   if (!searchTerm.trim()) {
  //     setSearchError('Please enter a name, handle, or ID to search');
  //     return;
  //   }
  
  //   setSearchLoading(true);
  //   setSearchError(null);
    
  //   try {

  //     //  const debitResult = await debitXLMForSearch();
  //      const debitResult = await debitXLMForSearch();
      
  //     if (!debitResult.success) {
  //       throw new Error(debitResult.message || 'Insufficient XLM balance');
  //     }
  
  //     // If debit successful, proceed with search
  //     const results = await searchUsersByNameOrHandle(searchTerm.trim(), lionshareDb);
  //     setSearchResults(Array.isArray(results) ? results : [results]);
      
  //   } catch (error) {
  //     if (error.message.includes('Insufficient')) {
  //       setSearchError(
  //         <span>
  //           Insufficient XLM balance. Please{' '}
  //           <button 
  //             onClick={() => navigate('/deposit')}
  //             className="text-emerald-500 underline hover:text-emerald-400"
  //           >
  //             deposit XLM
  //           </button>{' '}
  //           and try again.
  //         </span>
  //       );
  //     } else {
  //       setSearchError(error.message);
  //     }
  //     setSearchResults([]);
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  // const handleSearch = async () => {
  //   if (!searchTerm.trim()) {
  //     setSearchError('Please enter a name, handle, or ID to search');
  //     return;
  //   }
  
  //   setSearchLoading(true);
  //   setSearchError(null);
    
  //   try {
  //     console.log('Attempting debit...');
  //     const debitResult = await debitXLMForSearch();
  //     console.log('Debit result:', debitResult);
      
  //     // Change this check to look at status instead of success
  //     if (debitResult.status !== 'success') {
  //       console.log('Debit failed');
  //       throw new Error(debitResult.message || 'Payment failed');
  //     }
  
  //     console.log('Debit successful, proceeding with search...');
  //     const results = await searchUsersByNameOrHandle(searchTerm.trim(), lionshareDb);
  //     console.log('Search results:', results);
  //     setSearchResults(Array.isArray(results) ? results : [results]);
      
  //   } catch (error) {
  //     console.error('Error in handleSearch:', error);
  //     if (error.message.includes('Insufficient') || error.message.includes('balance')) {
  //       setSearchError(
  //         <span>
  //           Insufficient XLM balance. Please{' '}
  //           <button 
  //             onClick={() => navigate('/dashboard/deposit')}
  //             className="text-emerald-500 underline hover:text-emerald-400"
  //           >
  //             deposit XLM
  //           </button>{' '}
  //             and try again.
  //         </span>
  //       );
  //     } else {
  //       setSearchError(error.message || 'Search failed. Please try again.');
  //     }
  //     setSearchResults([]);
  //   } finally {
  //     setSearchLoading(false);
  //   }
  // };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter a name, handle, or ID to search');
      return;
    }
  
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      console.log('Attempting debit...');
      const debitResult = await debitXLMForSearch();
      console.log('Debit result:', debitResult);
      
      // Change this check to look at status instead of success
      if (debitResult.status !== 'success') {
        console.log('Debit failed');
        throw new Error(debitResult.message || 'Payment failed');
      }
  
      console.log('Debit successful, proceeding with search...');
      const results = await searchUsersByNameOrHandle(searchTerm.trim(), lionshareDb);
      console.log('Search results:', results);
      setSearchResults(Array.isArray(results) ? results : [results]);
      
    } catch (error) {
      console.error('Error in handleSearch:', error);
      if (error.message.includes('Insufficient') || error.message.includes('balance')) {
        setSearchError(
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800">
                  Insufficient XLM Balance
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p className="mb-2">
                    This search requires 20 XLM to cover blockchain bridging costs between 
                    the Stellar (XLM) and TON networks that power Lionsharecoin.
                  </p>
                  <p className="mb-3">
                    <strong>Why XLM is needed:</strong> Cross-chain operations require 
                    network fees to securely bridge data between Stellar and TON blockchains.
                  </p>
                  <button 
                    onClick={() => navigate('/dashboard/deposit')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Deposit XLM
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        setSearchError(
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">
                {error.message || 'Search failed. Please try again.'}
              </span>
            </div>
          </div>
        );
      }
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setBasicUserId(userId);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBasicUserId(value);
    if (validationError) setValidationError('');
    if (value.trim()) {
      const validation = validateTelegramId(value);
      if (!validation.isValid) {
        setValidationError(validation.error);
      }
    }
  };

  const validateTelegramId = (id) => {
    if (!id || id.trim() === '') {
      return { isValid: false, error: 'Please enter a User ID' };
    }
    const trimmedId = id.trim();
    if (!/^\d+$/.test(trimmedId)) {
      return { isValid: false, error: 'User ID must contain only numbers' };
    }
    if (trimmedId.length < 5 || trimmedId.length > 12) {
      return { isValid: false, error: 'User ID should be between 5-12 digits' };
    }
    return { isValid: true, value: trimmedId };
  };

  return (
    <section className={`w-full p-4 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
      <h3 className="font-medium mb-4 flex items-center text-lg sm:text-xl">
        <Database size={20} className="mr-2 text-emerald-500 flex-shrink-0" />
        <span className="break-words">User Search for your Telegram ID</span>
      </h3>
      
      {/* Search by name/handle */}
      {/* <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 p-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Search by name, handle, or last name"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${
              searchLoading || !searchTerm.trim() 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
            }`} 
            disabled={searchLoading || !searchTerm.trim()}
          >
            {searchLoading ? (
              <>
                <RefreshCw className="animate-spin mr-2" size={16} />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        {searchError && (
          <div className="mt-2 text-sm text-amber-500">{searchError}</div>
        )}
        
        {searchResults.length > 0 && (
          <div className={`mt-3 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="max-h-60 overflow-y-auto p-2">
              {searchResults.map((user) => (
                <div 
                  key={user.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <div className="flex items-center">
                    <User size={16} className="mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {user.name || 'No name'} {user.last_name || ''}
                      </p>
                      <p className={`text-xs truncate ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        @{user.handle || 'no-handle'} • ID: {user.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div> */}

{/* // Update the search section in your BasicUserLookup component */}
{/* Search by name/handle */}
<div className="mb-4">
  <div className="flex gap-2">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`flex-1 p-3 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      placeholder="Search by name, handle, or last name"
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button 
      onClick={handleSearch} 
      className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${
        searchLoading || !searchTerm.trim() 
          ? 'bg-gray-400 cursor-not-allowed text-white' 
          : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
      }`} 
      disabled={searchLoading || !searchTerm.trim()}
    >
      {searchLoading ? (
        <>
          <RefreshCw className="animate-spin mr-2" size={16} />
          Processing...
        </>
      ) : (
        <>
          <span className="hidden sm:inline">Search (20 XLM)</span>
          <span className="sm:hidden">Search</span>
        </>
      )}
    </button>
  </div>
  
  {searchError && (
    <div className={`mt-2 p-3 rounded-lg flex items-start ${
      theme === 'dark' 
        ? 'bg-amber-900/30 border border-amber-800 text-amber-200' 
        : 'bg-amber-100 border border-amber-200 text-amber-700'
    }`}>
      <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-sm break-words min-w-0 flex-1">{searchError}</span>
    </div>
  )}
  
  {searchResults.length > 0 && (
    <div className={`mt-3 rounded-lg border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-h-60 overflow-y-auto p-2">
        {searchResults.map((user) => (
          <div 
            key={user.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleSelectUser(user.id)}
          >
            <div className="flex items-center">
              <User size={16} className="mr-2 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {user.name || 'No name'} {user.last_name || ''}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  @{user.handle || 'no-handle'} • ID: {user.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
      
      {/* Or search by ID (existing functionality) */}
      <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">
        <h4 className="font-medium mb-3 text-sm">
          Or search directly by User ID:
        </h4>
        <input
          type="text"
          value={basicUserId}
          onChange={handleInputChange}
          className={`w-full p-4 rounded-lg border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            validationError 
              ? (theme === 'dark' ? 'border-amber-500 bg-amber-900/20' : 'border-amber-500 bg-amber-50') 
              : (theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500')
          }`}
          placeholder="Enter User ID (5-12 digits)"
          onKeyPress={(e) => e.key === 'Enter' && fetchBasicUserData()}
        />
        
        {validationError && (
          <AlertMessage message={validationError} theme={theme} />
        )}
        
        <button 
          onClick={fetchBasicUserData} 
          className={`mt-3 w-full px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${
            basicLoading || validationError 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
          }`} 
          disabled={basicLoading || validationError}
        >
          {basicLoading ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={16} />
              Processing...
            </>
          ) : (
            'Fetch User Data'
          )}
        </button>
      </div>
      
      {basicError && !validationError && (
        <AlertMessage message={basicError} theme={theme} />
      )}
      
      {basicUserData && (
        <WalletBalances 
          userData={basicUserData} 
          theme={theme} 
          refreshBasicUserData={refreshBasicUserData} 
          clearBasicResults={clearBasicResults}
          animatedBalances={animatedBalances}
          showLoadingAnimation={showLoadingAnimation}
        />
      )}
    </section>
  );
};

const PremiumFeatures = ({ theme, premiumUserId, setPremiumUserId, checkPremiumSubscription, premiumLoading, premiumError, showVerificationCode, secretCode, setSecretCode, verifySecretCode, clearPremiumResults, basicUserData, showRawData, setShowRawData, backendCode }) => {
  const isDisabled = !basicUserData;

  return (
    <section className={`w-full p-4 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
      <h3 className="font-medium mb-4 flex items-center text-lg sm:text-xl">
        <Lock size={20} className="mr-2 text-emerald-500" />
        <span className="break-words">Premium Features</span>
        {!basicUserData && (
          <span className="ml-2 px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
            Locked
          </span>
        )}
      </h3>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={premiumUserId}
            onChange={(e) => setPremiumUserId(e.target.value)}
            className={`w-full p-4 rounded-lg text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter Premium User ID (alphanumeric)"
            disabled={isDisabled}
          />
          {premiumUserId && (
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-emerald-800/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
              Auto-filled
            </div>
          )}
        </div>
        
        <button 
          onClick={checkPremiumSubscription} 
          className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors flex items-center justify-center ${premiumLoading || isDisabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'}`} 
          disabled={premiumLoading || isDisabled}
        >
          {premiumLoading ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={16} />
              Checking...
            </>
          ) : (
            'Check Subscription'
          )}
        </button>
      </div>
      
      {!basicUserData && (
        <AlertMessage 
          message="Please complete Basic User Lookup first to access Premium Features" 
          theme={theme} 
        />
      )}
      
      {premiumError && basicUserData && <AlertMessage message={premiumError} theme={theme} />}
      
      
      {showVerificationCode && (
        <div className="mt-6 space-y-4">
          <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-600/50 border-blue-600 text-blue-200' : 'bg-blue-100/50 border-blue-200 text-blue-700'}`}>
            <div className="flex items-center">
              <CheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
              <div className="min-w-0 flex-1">
                <span className="text-sm break-words">Premium subscription active! Your verification code:</span>
              </div>
            </div>
          </div>
          
          <VerificationCodeInput 
            secretCode={secretCode} 
            setSecretCode={setSecretCode} 
            verifySecretCode={verifySecretCode} 
            clearPremiumResults={clearPremiumResults} 
            theme={theme} 
            backendCode={backendCode}
          />
          
          {showRawData && basicUserData && (
            <RawDataDisplay 
              userData={basicUserData} 
              theme={theme} 
              onClose={() => setShowRawData(false)} 
            />
          )}
        </div>
      )}
    </section>
  );
};


const SessionInfo = ({ authKey, theme }) => (
  <div
    className={`mx-auto mb-6 p-4 max-w-lg rounded-2xl shadow-lg border 
      ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
  >
    <div className="flex items-center space-x-3 mb-4">
      <CheckCircle 
        className={`text-emerald-500 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} 
        size={24} 
      />
      <h4 
        className={`text-sm font-semibold 
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
      >
        Active Session
      </h4>
    </div>
    <div className="flex items-start space-x-3">
      <ShieldCheck 
        className={`text-blue-500 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} 
        size={24} 
      />
      <div>
        <code
          className={`block text-xs sm:text-sm font-mono break-all px-3 py-1 rounded-lg 
            ${theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
        >
          {authKey}
        </code>
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Your session is authenticated with LionShareCoin's secure system, ensuring privacy and data protection at all times.
        </p>
      </div>
    </div>
  </div>
);

// Main FirestoreQuery Component
const FirestoreQuery = ({ theme, userId, userEmail }) => {
  const [basicUserId, setBasicUserId] = useState('');
  const [basicUserData, setBasicUserData] = useState(null);
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicError, setBasicError] = useState(null);
  const [premiumUserId, setPremiumUserId] = useState('');
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumError, setPremiumError] = useState(null);
  const [secretCode, setSecretCode] = useState('');
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authKey, setAuthKey] = useState(null);
  const [fetchingStage, setFetchingStage] = useState('');
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [animatedBalances, setAnimatedBalances] = useState({});
  const [backendCode, setBackendCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      setPremiumUserId(userId);
    }
  }, [userId]);


  const debitXLMForSearch = async () => {
    if (!userId) {
      console.error('Debit failed: No user ID');
      throw new Error('User not authenticated');
    }
  
    try {
      const response = await fetch('http://localhost:5000/debit-for-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          amount: 20  // Fixed 20 XLM fee
        })
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Debit failed:', result.message);
        const error = new Error(result.message || 'Debit failed');
        error.details = result;
        throw error;
      }
      
      return result;
    } catch (error) {
      console.error('Debit error:', error);
      if (error instanceof Error) {
        // Handle network errors or JSON parsing errors
        if (error.message.includes('Failed to fetch') || error.message.includes('Unexpected token')) {
          throw new Error('Network error. Please check your connection.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(lionshareAuth, (user) => {
      setAuthUser(user);
      if (user) {
        setAuthKey(user.uid);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Balance animation effect
  const animateBalance = (finalValue, key) => {
    const duration = 2000;
    const steps = 50;
    const increment = finalValue / steps;
    let currentValue = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      currentValue = Math.min(currentValue + increment, finalValue);
      setAnimatedBalances(prev => ({
        ...prev,
        [key]: currentValue
      }));
      if (step >= steps || currentValue >= finalValue) {
        clearInterval(timer);
        setAnimatedBalances(prev => ({
          ...prev,
          [key]: finalValue
        }));
      }
    }, duration / steps);
  };

  const fetchBasicUserData = async () => {
    const validation = validateTelegramId(basicUserId);
    if (!validation.isValid) {
      setBasicError(validation.error);
      return;
    }
    if (!authUser) {
      setBasicError('Authentication required to access user data');
      return;
    }
    setBasicLoading(true);
    setBasicError(null);
    setShowLoadingAnimation(true);
    setAnimatedBalances({});

    const stages = [
      'Establishing secure blockchain connection...',
      'Verifying authentication credentials...',
      `Scanning for User ID: ${validation.value}...`,
      'Retrieving comprehensive transaction ledger...',
      'Processing balance aggregations and analytics...',
      'Validating data integrity and compliance...',
      'Compiling comprehensive user portfolio...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setFetchingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      const userDocRef = doc(lionshareDb, 'users_production', validation.value);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBasicUserData(data);
        setTimeout(() => {
          Object.keys(data).forEach(key => {
            if (typeof data[key] === 'number' && data[key] > 0) {
              animateBalance(data[key], key);
            }
          });
        }, 500);
      } else {
        setBasicError(`User profile not found for ID: ${validation.value}`);
        setBasicUserData(null);
      }
    } catch (error) {
      setBasicError(`Data retrieval error: ${error.message}`);
      setBasicUserData(null);
    } finally {
      setBasicLoading(false);
      setShowLoadingAnimation(false);
      setFetchingStage('');
    }
  };

  const validateTelegramId = (id) => {
    if (!id || id.trim() === '') {
      return { isValid: false, error: 'Please enter a User ID' };
    }
    const trimmedId = id.trim();
    if (!/^\d+$/.test(trimmedId)) {
      return { isValid: false, error: 'User ID must contain only numbers' };
    }
    if (trimmedId.length < 5 || trimmedId.length > 12) {
      return { isValid: false, error: 'User ID should be between 5-12 digits' };
    }
    return { isValid: true, value: trimmedId };
  };

  const checkPremiumSubscription = useCallback(async () => {
    if (!basicUserData) {
      setPremiumError('Please fetch Basic User Data first before accessing Premium Features');
      return;
    }
    
    if (!premiumUserId) {
      setPremiumError('Please enter a valid Premium User ID');
      return;
    }
    
    setPremiumLoading(true);
    setPremiumError(null);
    
    try {
      const result = await fetchApi('http://localhost:5000/check-subscription', 'POST', { 
        userId: premiumUserId 
      });
      
      if (result.hasSubscription) {
        setShowVerificationCode(true);
        setBackendCode(result.verification_code || '');
        setPremiumError(null);
      } else {
        navigate(`/dashboard/deposit?purpose=premium&userId=${premiumUserId}`);
      }
    } catch (error) {
      setPremiumError(error.message);
    } finally {
      setPremiumLoading(false);
    }
  }, [premiumUserId, navigate, basicUserData]);

  const verifySecretCode = async () => {
    if (!secretCode.trim()) {
      setPremiumError('Please enter a verification code');
      return;
    }
    try {
      const result = await fetchApi('http://localhost:5000/verify-code', 'POST', {
        userId: premiumUserId,
        code: secretCode.trim()
      });
      
      if (result.verified) {
        setPremiumError(null);
        setShowRawData(true);
      } else {
        setPremiumError('Invalid verification code. Please check and try again.');
      }
    } catch (error) {
      setPremiumError(error.message);
    }
  };


  const clearBasicResults = () => {
    setBasicUserData(null);
    setBasicUserId('');
    setBasicError(null);
    setShowLoadingAnimation(false);
    setFetchingStage('');
    setAnimatedBalances({});
  };

  const clearPremiumResults = () => {
    setPremiumUserId('');
    setPremiumError(null);
    setSecretCode('');
    setShowVerificationCode(false);
    setShowRawData(false);
    setBackendCode('');
  };
  

  return (
   
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl mx-auto w-full max-w-4xl ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } shadow-lg p-4 sm:p-6`}
    >
      {/* Header Section - Responsive Flex */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold flex items-center">
          <Database className="mr-2 text-emerald-500 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="truncate">LionShareCoin Portfolio Management System</span>
        </h2>
        {basicUserData && (
          <button 
            onClick={clearBasicResults}
            className={`p-2 rounded-lg self-end xs:self-auto ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>
        )}
      </div>
  
      {authLoading ? (
        <div className="flex flex-col sm:flex-row items-center justify-center py-6 sm:py-8">
          <RefreshCw className="animate-spin mr-2 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-center sm:text-left text-sm sm:text-base">
            Initializing authentication services...
          </span>
        </div>
      ) : (
        <>
          {!authUser ? (
            <div className="text-center mb-4 sm:mb-6">
              <button
                onClick={async () => {
                  setAuthLoading(true);
                  try {
                    const userCredential = await signInAnonymously(lionshareAuth);
                    setAuthKey(userCredential.user.uid);
                  } catch (err) {
                    setBasicError(`Authentication failed: ${err.message}`);
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                className={`px-6 py-3 rounded-lg font-medium text-sm sm:text-base w-full xs:w-auto ${
                  theme === 'dark' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white transition-colors`}
              >
                Secure Access
              </button>
            </div>
          ) : (
            <>
              <SessionInfo authKey={authKey} theme={theme} userId={userId} userEmail={userEmail} />
            
              {showLoadingAnimation && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg border-2 border-dashed ${
                    theme === 'dark' 
                      ? 'border-emerald-600 bg-emerald-600/20' 
                      : 'border-emerald-600 bg-emerald-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
                      <RefreshCw className="animate-spin mr-0 sm:mr-3 mb-2 sm:mb-0 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
                      <div className="text-lg font-bold text-emerald-500">
                        Processing Data Request
                      </div>
                    </div>
                    <p className={`text-sm mb-3 sm:mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {fetchingStage || 'Initializing secure blockchain connection...'}
                    </p>
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      🔐 Retrieving comprehensive portfolio data from distributed ledger infrastructure
                    </p>
                  </div>
                </motion.div>
              )}
  
              {!basicUserData ? (
                <section className="space-y-4 sm:space-y-6">
                  <BasicUserLookup
                    theme={theme}
                    basicUserId={basicUserId}
                    setBasicUserId={setBasicUserId}
                    fetchBasicUserData={fetchBasicUserData}
                    basicLoading={basicLoading}
                    basicError={basicError}
                    basicUserData={basicUserData}
                    refreshBasicUserData={fetchBasicUserData}
                    clearBasicResults={clearBasicResults}
                    animatedBalances={animatedBalances}
                    showLoadingAnimation={showLoadingAnimation}
                    debitXLMForSearch={debitXLMForSearch} // Pass the function
                  />
                  <PremiumFeatures
                    theme={theme}
                    premiumUserId={premiumUserId}
                    setPremiumUserId={setPremiumUserId}
                    checkPremiumSubscription={checkPremiumSubscription}
                    premiumLoading={premiumLoading}
                    premiumError={premiumError}
                    showVerificationCode={showVerificationCode}
                    secretCode={secretCode}
                    setSecretCode={setSecretCode}
                    verifySecretCode={verifySecretCode}
                    clearPremiumResults={clearPremiumResults}
                    basicUserData={basicUserData}
                    showRawData={showRawData}
                    setShowRawData={setShowRawData}
                    backendCode={backendCode}
                  />
                </section>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative overflow-hidden"
                  >
                    <div className={`relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-gray-800 to-emerald-900/30' 
                        : 'bg-gradient-to-br from-white to-emerald-50/30'
                    } shadow-lg`}>
                      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-emerald-400/10 to-blue-400/40 rounded-full blur-xl sm:blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-24 sm:w-24 sm:h-32 bg-gradient-to-tr from-blue-400/10 to-emerald-400/40 rounded-full blur-xl sm:blur-2xl"></div>
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                              theme === 'dark' 
                                ? 'bg-emerald-400/20 text-emerald-400' 
                                : 'bg-emerald-100 text-emerald-400'
                            }`}>
                              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-500">
                                <Award className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Portfolio Access Granted
                              </h3>
                              <p className={`text-xs sm:text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Secure blockchain connection established
                              </p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-semibold ${
                            theme === 'dark' 
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
                              : 'bg-emerald-100 text-emerald-400 border border-emerald-200'
                          }`}>
                            ✓ VERIFIED
                            <Zap className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                          </div>
                        </motion.div>
  
                        <motion.div 
                          className="mb-6 sm:mb-8"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 mb-4 sm:mb-6">
                            <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${
                              theme === 'dark' 
                                ? 'bg-blue-400/20 text-blue-400' 
                                : 'bg-blue-100 text-blue-400'
                            }`}>
                              <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                Welcome back, <span className="text-emerald-500">{basicUserData.name || 'Valued Client'}</span>
                              </h3>
                              <p className={`text-sm sm:text-base leading-relaxed ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Your comprehensive portfolio has been successfully retrieved from our secure blockchain infrastructure.
                              </p>
                            </div>
                          </div>
                        </motion.div>
  
                        <motion.div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {[
                            {
                              icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />,
                              title: "Global Markets",
                              description: "Active across international financial centers",
                            },
                            {
                              icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />,
                              title: "Advanced Trading",
                              description: "Institutional-grade trading infrastructure",
                            },
                            {
                              icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
                              title: "Enhanced Security",
                              description: "Advanced protocols ensuring asset protection",
                            },
                          ].map((card, index) => (
                            <div
                              key={index}
                              className={`p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl transition-transform transform hover:scale-[1.02] ${
                                theme === "dark" 
                                  ? "bg-gradient-to-r from-gray-800 to-gray-700 shadow-xl" 
                                  : "bg-gradient-to-r from-white to-gray-100 shadow-md"
                              }`}
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
                                {card.icon}
                                <span
                                  className={`font-semibold text-xs sm:text-sm md:text-base ${
                                    theme === "dark" ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {card.title}
                                </span>
                              </div>
                              <p
                                className={`text-xs sm:text-sm ${
                                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {card.description}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
  
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <div
                        className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden 
                          ${theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700' 
                            : 'bg-white/80 border border-gray-200'} 
                          shadow-sm`}
                      >
                        <h3 className="font-bold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center text-base sm:text-lg md:text-xl relative z-10">
                          <User size={32} className="mr-0 sm:mr-3 mb-2 sm:mb-0 text-emerald-500 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10" />
                          <span
                            className={`bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent ${
                              theme === 'dark' ? 'from-emerald-400 to-emerald-500' : ''
                            }`}
                          >
                            Account Information
                          </span>
                        </h3>
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base relative z-10 flex flex-col items-center text-center">
                          {[
                            { label: "Full Name:", value: basicUserData.name || 'Not Specified' },
                            { label: "Username:", value: basicUserData.handle || 'Not Specified' },
                            { 
                              label: "Account Created:", 
                              value: basicUserData.created_at 
                                ? new Date(basicUserData.created_at).toLocaleString() 
                                : 'Not Available' 
                            },
                            { label: "Network Referrals:", value: basicUserData.referral_count || 0 },
                          ].map((item, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * (index + 1) }}
                              className="break-words w-full"
                            >
                              <span className={`font-medium ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {item.label}
                              </span>{' '}
                              {item.value}
                            </motion.p>
                          ))}
                        </div>
                      </div>
  
                      <div
                        className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden 
                          ${theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700' 
                            : 'bg-white/80 border border-gray-200'} 
                          shadow-sm`}
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-emerald-400/20 to-emerald-300/20 rounded-full blur-lg sm:blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-emerald-300/20 to-emerald-400/20 rounded-full blur-lg sm:blur-xl"></div>
                        <WalletBalances
                          userData={basicUserData}
                          theme={theme}
                          refreshBasicUserData={fetchBasicUserData}
                          clearBasicResults={clearBasicResults}
                          animatedBalances={animatedBalances}
                          showLoadingAnimation={showLoadingAnimation}
                        />
                      </div>
                    </div>
                  </motion.div>
  
                  <section className="mt-4 sm:mt-6">
                    <PremiumFeatures
                      theme={theme}
                      premiumUserId={premiumUserId}
                      setPremiumUserId={setPremiumUserId}
                      checkPremiumSubscription={checkPremiumSubscription}
                      premiumLoading={premiumLoading}
                      premiumError={premiumError}
                      showVerificationCode={showVerificationCode}
                      secretCode={secretCode}
                      setSecretCode={setSecretCode}
                      verifySecretCode={verifySecretCode}
                      clearPremiumResults={clearPremiumResults}
                      basicUserData={basicUserData}
                      showRawData={showRawData}
                      setShowRawData={setShowRawData}
                      backendCode={backendCode}
                    />
                  </section>
                </>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default FirestoreQuery;





