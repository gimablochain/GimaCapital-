


// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   DollarSign, Wallet, CheckCircle, AlertCircle, Loader2, 
//   ArrowRight, Shield, Zap, Copy, ExternalLink, Plus, Home
// } from 'lucide-react';

// const Deposit = ({ userId, onDeposit }) => {
//   const [amount, setAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [depositInstructions, setDepositInstructions] = useState(null);
//   const [cryptoStatus, setCryptoStatus] = useState('pending');
//   const [lastChecked, setLastChecked] = useState(null);
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [showConsentDialog, setShowConsentDialog] = useState(false);
//   const [searchParams] = useSearchParams();


//   // const userId = searchParams.get('userId') || propUserId;
//   const purpose = searchParams.get('purpose');
//    // Identify deposit type
//    const isSubscriptionDeposit = purpose === 'subscription' || purpose === 'premium';
  

//   const monitoringInterval = useRef(null);
//   const monitoringTimeout = useRef(null);
//   const navigate = useNavigate();

//   // const isSubscriptionDeposit = searchParams.get('purpose') === 'subscription';

//   useEffect(() => {
//     if (isSubscriptionDeposit) {
//       setAmount('10');
//     }
//   }, [isSubscriptionDeposit]);
  

//   const fetchBalance = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(result.message || 'Failed to fetch user data');
//       }
//       return result.user.balance;
//     } catch (error) {
//       console.error('Failed to fetch balance:', error);
//       setErrorMessage('Failed to update balance. Please refresh the page.');
//       setStatus('error');
//       return null;
//     }
//   }, [userId]);

//   const fetchUserData = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(result.message || 'Failed to fetch user data');
//       }
//       return result.user;
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       return null;
//     }
//   }, [userId]);

//   const resetCryptoForm = useCallback(() => {
//     setAmount(isSubscriptionDeposit ? '10' : '');
//     setShowInstructions(false);
//     setDepositInstructions(null);
//     setCryptoStatus('pending');
//     setStatus(null);
//     setErrorMessage('');
//     setLastChecked(null);
//     setRetryCount(0);
//     setShowConsentDialog(false);
//   }, [isSubscriptionDeposit]);

//   const cleanupMonitoring = useCallback(() => {
//     if (monitoringInterval.current) {
//       clearInterval(monitoringInterval.current);
//       monitoringInterval.current = null;
//     }
//     if (monitoringTimeout.current) {
//       clearTimeout(monitoringTimeout.current);
//       monitoringTimeout.current = null;
//     }
//     setIsMonitoring(false);
//   }, []);

//   const handleNetworkError = useCallback((error) => {
//     console.error('Network error:', error);
//     let userFriendlyError = 'Something went wrong. Please try again later.';
//     if (error.message.includes('Server error')) {
//       userFriendlyError = 'Server error occurred. Please try again.';
//     } else if (error.message.includes('Failed to fetch')) {
//       userFriendlyError = 'Network error. Please check your connection.';
//     }
//     setErrorMessage(userFriendlyError);
//     setStatus('error');
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   const activateSubscription = useCallback(async (retries = 3) => {
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch('http://localhost:5000/activate-subscription', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId })
//         });
        
//         const result = await response.json();
//         if (!response.ok) {
//           throw new Error(result.message || `Subscription activation failed: ${response.status}`);
//         }
        
//         console.log('Subscription activation response:', result);
//         return result.status === 'success';
//       } catch (error) {
//         console.error(`Subscription activation attempt ${attempt} failed:`, error);
//         if (attempt < retries) {
//           await new Promise(resolve => setTimeout(resolve, 2000));
//           continue;
//         }
//         return false;
//       }
//     }
//   }, [userId]);


//   const handleDepositSuccess = useCallback(async (newBalance) => {
//     if (onDeposit) {
//       onDeposit(newBalance);
//     }

//     if (isSubscriptionDeposit) {
//       let success = await activateSubscription();
//       if (!success) {
//         const userData = await fetchUserData();
//         if (userData && userData.is_premium) {
//           console.log('Subscription already active in Firestore:', userData);
//           success = true;
//         }
//       }

//       if (!success) {
//         setErrorMessage('Subscription activation failed. Please try again or contact support.');
//         setStatus('error');
//         return;
//       }
//     }

//     setStatus('success');
//     setShowInstructions(false);
//     setTimeout(() => {
//       setShowConsentDialog(true);
//     }, 1000);
//   }, [isSubscriptionDeposit, onDeposit, activateSubscription, fetchUserData]);


//   const checkDepositStatus = useCallback(async (manualCheck = false) => {
//     if (!depositInstructions?.depositId) return;

//     try {
//       setIsProcessing(true);
//       const response = await fetch(`http://localhost:5000/check-deposit-status/${depositInstructions.depositId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }

//       const result = await response.json();
//       if (result.status === 'success') {
//         setCryptoStatus(result.depositStatus);
//         if (result.depositStatus === 'completed') {
//           cleanupMonitoring();
//           const latestBalance = await fetchBalance();
//           if (latestBalance !== null) {
//             await handleDepositSuccess(latestBalance);
//           }
//         } else if (result.depositStatus === 'failed' || result.depositStatus === 'timeout') {
//           cleanupMonitoring();
//           setErrorMessage(result.message || 'Deposit failed or timed out. Please contact support.');
//           setStatus('error');
//         }
//         setLastChecked(new Date());
//         setRetryCount(0);
//       } else {
//         if (retryCount < 3) {
//           setRetryCount(prev => prev + 1);
//           if (!manualCheck) {
//             setTimeout(() => checkDepositStatus(false), 5000);
//           }
//         } else {
//           throw new Error(result.message || 'Failed to verify deposit status after multiple attempts.');
//         }
//       }
//     } catch (error) {
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [
//     depositInstructions,
//     cleanupMonitoring,
//     handleNetworkError,
//     retryCount,
//     fetchBalance,
//     handleDepositSuccess
//   ]);

//   const startMonitoring = useCallback(() => {
//     if (!depositInstructions?.depositId) return;
//     cleanupMonitoring();
//     setIsMonitoring(true);
//     checkDepositStatus(false);
//     monitoringInterval.current = setInterval(() => checkDepositStatus(false), 5000);
//     monitoringTimeout.current = setTimeout(() => {
//       if (cryptoStatus !== 'completed') {
//         cleanupMonitoring();
//         setErrorMessage('Deposit verification timed out. Please check transaction status or contact support.');
//         setStatus('error');
//         setCryptoStatus('timeout');
//       }
//     }, 30 * 60 * 1000);
//   }, [depositInstructions, checkDepositStatus, cleanupMonitoring, cryptoStatus]);

//   useEffect(() => {
//     if (depositInstructions?.depositId && status === 'pending' && !isMonitoring) {
//       startMonitoring();
//     }
//   }, [depositInstructions, status, isMonitoring, startMonitoring]);

//   const validateAmount = useCallback(() => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setErrorMessage('Please enter a valid amount greater than 0.');
//       setStatus('error');
//       return false;
//     }
//     if (isSubscriptionDeposit && parseFloat(amount) !== 10) {
//       setErrorMessage('Subscription activation requires exactly 10 XLM.');
//       setStatus('error');
//       return false;
//     }
//     if (!isSubscriptionDeposit && parseFloat(amount) < 10) {
//       setErrorMessage('Minimum deposit amount is 10 XLM.');
//       setStatus('error');
//       return false;
//     }
//     return true;
//   }, [amount, isSubscriptionDeposit]);

//   const copyToClipboard = (text, type) => {
//     navigator.clipboard.writeText(text);
//     setStatus('copied');
//     setErrorMessage(`${type} copied to clipboard!`);
//     setTimeout(() => {
//       if (cryptoStatus === 'completed') {
//         resetCryptoForm();
//       } else {
//         setStatus('pending');
//         setErrorMessage('');
//       }
//     }, 2000);
//   };

//   const handleCryptoDeposit = async () => {
//     if (!validateAmount()) return;

//     setIsProcessing(true);
//     setErrorMessage('');
//     setStatus(null);

//     try {
//       const response = await fetch('http://localhost:5000/crypto-deposit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, amount: parseFloat(amount) }),
//       });
//       const result = await response.json();

//       if (result.status === 'success') {
//         setDepositInstructions({
//           depositAddress: result.depositAddress,
//           memo: result.memo,
//           amount: parseFloat(amount),
//           depositId: result.depositId,
//         });
//         setShowInstructions(true);
//         setStatus('pending');
//         setErrorMessage('');
//       } else {
//         throw new Error(result.message || 'Failed to get deposit address.');
//       }
//     } catch (error) {
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleAnotherDeposit = () => {
//     resetCryptoForm();
//   };

//   const getStatusMessage = () => {
//     if (status === 'success') {
//       return isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!';
//     }
//     if (status === 'error') {
//       return errorMessage || 'Something went wrong. Please try again.';
//     }
//     if (status === 'copied') {
//       return errorMessage;
//     }
//     return null;
//   };

//   const getStatusIcon = () => {
//     if (status === 'success') {
//       return <CheckCircle size={20} className="text-green-400" />;
//     }
//     if (status === 'error') {
//       return <AlertCircle size={20} className="text-red-400" />;
//     }
//     if (status === 'copied') {
//       return <CheckCircle size={20} className="text-blue-400" />;
//     }
//     return null;
//   };

//   const getCryptoStatusIcon = () => {
//     if (cryptoStatus === 'completed') {
//       return <CheckCircle size={20} className="text-green-400" />;
//     }
//     if (cryptoStatus === 'failed' || cryptoStatus === 'timeout') {
//       return <AlertCircle size={20} className="text-red-400" />;
//     }
//     return <Loader2 size={20} className="text-yellow-400 animate-spin" />;
//   };



// const ConsentDialog = () => {
//   const handleGoBack = () => {
//     const returnPath = isSubscriptionDeposit 
//       ? `/dashboard/firestore-query?subscribed=true&userId=${userId}`
//       : '/dashboard';
//     navigate(returnPath);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 p-8 max-w-md w-full space-y-6">
//         <div className="text-center space-y-3">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 border border-green-500/30">
//             <CheckCircle size={32} className="text-green-400" />
//           </div>
//           <h3 className="text-2xl font-bold text-white">
//             {isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!'}
//           </h3>
//           <p className="text-gray-300 text-sm">
//             {isSubscriptionDeposit 
//               ? 'Your subscription is now active and you can access verification codes.'
//               : `Your deposit of ${depositInstructions?.amount} XLM has been processed.`}
//           </p>
//           {isSubscriptionDeposit && (
//             <p className="text-emerald-400 text-sm mt-2">
//               You can now check your verification code in the Firestore Query section.
//             </p>
//           )}
//         </div>

//         <div className="flex flex-col space-y-3">
//           {!isSubscriptionDeposit && (
//             <button
//               onClick={handleAnotherDeposit}
//               className="w-full px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               <div className="flex items-center justify-center space-x-2">
//                 <Plus size={20} />
//                 <span>Make Another Deposit</span>
//               </div>
//             </button>
//           )}

//           <button
//             onClick={handleGoBack}
//             className={`w-full px-6 py-3 rounded-md font-semibold text-white ${
//               isSubscriptionDeposit 
//                 ? 'bg-emerald-600 hover:bg-emerald-700' 
//                 : 'bg-gray-600 hover:bg-gray-700'
//             } transition-all duration-300 shadow-lg hover:shadow-xl`}
//           >
//             <div className="flex items-center justify-center space-x-2">
//               <Home size={20} />
//               <span>{isSubscriptionDeposit ? 'Go to Verification' : 'Go to Dashboard'}</span>
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center py-12 px-4">
//         <div className="w-full max-w-lg">
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 p-8 space-y-8">
//             <div className="text-center space-y-2">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30">
//                 <Wallet size={32} className="text-blue-400" />
//               </div>
//               <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
//                 {isSubscriptionDeposit ? 'Subscribe Now' : 'Deposit Funds'}
//               </h2>
//               <p className="text-gray-400 text-sm">
//                 {isSubscriptionDeposit
//                   ? 'Deposit exactly 10 XLM to activate your subscription'
//                   : 'Deposit Stellar Lumens (XLM) to your account securely.'}
//               </p>
//             </div>

//             <div className="space-y-6">
//               {getStatusMessage() && (
//                 <div
//                   className={`flex items-start space-x-3 p-4 rounded-xl border ${
//                     status === 'success'
//                       ? 'bg-green-500/10 border-green-500/20 text-green-400'
//                       : status === 'copied'
//                       ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
//                       : 'bg-red-500/10 border-red-500/20 text-red-400'
//                   }`}
//                 >
//                   {getStatusIcon()}
//                   <div>
//                     <p className="font-medium">{getStatusMessage()}</p>
//                     {status === 'error' && errorMessage.includes('contact support') && (
//                       <p className="text-xs text-gray-400 mt-1">
//                         Reach out to our team for assistance.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {status === 'pending' && cryptoStatus === 'pending' && isMonitoring && (
//                 <div className="flex items-start space-x-3 text-yellow-400 text-sm bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 mb-6">
//                   <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
//                   <div>
//                     <p className="font-medium">Monitoring Deposit</p>
//                     <p>Transaction status will update automatically when confirmed.</p>
//                   </div>
//                 </div>
//               )}

//               {!showInstructions ? (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <label
//                       htmlFor="amount"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Deposit Amount (XLM)
//                     </label>
//                     <div className="relative">
//                       <DollarSign
//                         size={20}
//                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                       />
//                       <input
//                         type="number"
//                         id="amount"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder={isSubscriptionDeposit ? '10' : 'Enter amount (min 10 XLM)'}
//                         className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                         disabled={isProcessing || isSubscriptionDeposit}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-start space-x-2 text-gray-400 text-xs">
//                     <Shield size={16} className="flex-shrink-0 mt-0.5" />
//                     <p>
//                       Deposits are processed on the Stellar network. Ensure you send
//                       the exact amount and include the memo provided.
//                     </p>
//                   </div>

//                   <button
//                     onClick={handleCryptoDeposit}
//                     className={`w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl ${
//                       isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                     disabled={isProcessing}
//                   >
//                     <div className="flex items-center justify-center space-x-2">
//                       {isProcessing ? (
//                         <Loader2 size={20} className="animate-spin" />
//                       ) : (
//                         <Zap size={20} />
//                       )}
//                       <span>
//                         {isProcessing ? 'Processing...' : 'Get Deposit Address'}
//                       </span>
//                     </div>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         {getCryptoStatusIcon()}
//                         <div>
//                           <span className="font-medium capitalize text-base">
//                             {cryptoStatus === 'pending' ? 'Waiting for payment' : cryptoStatus}
//                           </span>
//                           {lastChecked && (
//                             <p className="text-xs text-gray-400">
//                               Last checked:{' '}
//                               {lastChecked.toLocaleTimeString([], {
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                                 second: '2-digit',
//                               })}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="w-full h-px bg-gray-700/50" />

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">
//                           Deposit Address
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <p className="text-sm text-gray-400 break-all flex-1">
//                             {depositInstructions.depositAddress}
//                           </p>
//                           <button
//                             onClick={() =>
//                               copyToClipboard(
//                                 depositInstructions.depositAddress,
//                                 'Address'
//                               )
//                             }
//                             className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
//                           >
//                             <Copy size={16} className="text-white" />
//                           </button>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">
//                           Memo (Required)
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <p className="text-sm text-gray-400 break-all flex-1">
//                             {depositInstructions.memo}
//                           </p>
//                           <button
//                             onClick={() =>
//                               copyToClipboard(depositInstructions.memo, 'Memo')
//                             }
//                             className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
//                           >
//                             <Copy size={16} className="text-white" />
//                           </button>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">
//                           Amount
//                         </label>
//                         <p className="text-sm text-gray-400">
//                           {depositInstructions.amount} XLM
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-start space-x-2 text-yellow-400 text-xs bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
//                       <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
//                       <p>
//                         Send <span className="font-semibold">{depositInstructions.amount} XLM</span> to the address above
//                         with the exact memo. Incorrect memo or amount may result in
//                         loss of funds.
//                       </p>
//                     </div>

//                     <div className="flex items-center space-x-2 text-gray-400 text-xs">
//                       <ExternalLink size={16} className="flex-shrink-0" />
//                       <p>
//                         Need help?{' '}
//                         <a
//                           href="https://www.stellar.org/learn/basics-stellar-deposits"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-400 hover:underline"
//                         >
//                           Learn about Stellar deposits
//                         </a>
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col space-y-3">
//                     <button
//                       onClick={resetCryptoForm}
//                       className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     >
//                       <div className="flex items-center justify-center space-x-2">
//                         <ArrowRight size={20} />
//                         <span>Start New Deposit</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {showConsentDialog && <ConsentDialog />}
//     </>
//   );
// };

// export default Deposit;



// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   DollarSign, Wallet, CheckCircle, AlertCircle, Loader2, 
//   ArrowRight, Shield, Zap, Copy, ExternalLink, Plus, Home
// } from 'lucide-react';

// const Deposit = ({ userId, onDeposit, isDarkMode = true }) => {
//   const [amount, setAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [depositInstructions, setDepositInstructions] = useState(null);
//   const [cryptoStatus, setCryptoStatus] = useState('pending');
//   const [lastChecked, setLastChecked] = useState(null);
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [showConsentDialog, setShowConsentDialog] = useState(false);
//   const [searchParams] = useSearchParams();
//   const purpose = searchParams.get('purpose');
//   const isSubscriptionDeposit = purpose === 'subscription' || purpose === 'premium';
//   const monitoringInterval = useRef(null);
//   const monitoringTimeout = useRef(null);
//   const navigate = useNavigate();

//   const themeStyles = {
//     dark: {
//       background: 'bg-gradient-to-b from-gray-900 to-black',
//       container: 'bg-gray-800/50 backdrop-blur-lg',
//       containerBorder: 'border-gray-700/50',
//       textPrimary: 'text-white',
//       textSecondary: 'text-gray-400',
//       textMuted: 'text-gray-500',
//       textAccent: 'text-blue-400',
//       cardBg: 'bg-gray-900/30',
//       cardBorder: 'border-gray-700/50',
//       inputBg: 'bg-gray-900/50',
//       inputBorder: 'border-gray-700',
//       inputPlaceholder: 'placeholder-gray-500',
//       buttonBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
//       buttonHover: 'hover:from-blue-500 hover:to-purple-500',
//       secondaryButtonBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
//       secondaryButtonHover: 'hover:from-gray-500 hover:to-gray-600',
//       successBg: 'bg-green-500/10 border-green-500/20',
//       successText: 'text-green-400',
//       errorBg: 'bg-red-500/10 border-red-500/20',
//       errorText: 'text-red-400',
//       copiedBg: 'bg-blue-500/10 border-blue-500/20',
//       copiedText: 'text-blue-400',
//       warningBg: 'bg-yellow-500/10 border-yellow-500/20',
//       warningText: 'text-yellow-400',
//       shadow: 'shadow-2xl',
//     },
//     light: {
//       background: 'bg-gradient-to-b from-gray-50 to-white',
//       container: 'bg-white/80 backdrop-blur-lg',
//       containerBorder: 'border-gray-200/50',
//       textPrimary: 'text-gray-900',
//       textSecondary: 'text-gray-600',
//       textMuted: 'text-gray-500',
//       textAccent: 'text-blue-600',
//       cardBg: 'bg-gray-50/50',
//       cardBorder: 'border-gray-200/50',
//       inputBg: 'bg-white/50',
//       inputBorder: 'border-gray-300',
//       inputPlaceholder: 'placeholder-gray-500',
//       buttonBg: 'bg-gradient-to-r from-blue-500 to-purple-500',
//       buttonHover: 'hover:from-blue-400 hover:to-purple-400',
//       secondaryButtonBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
//       secondaryButtonHover: 'hover:from-gray-400 hover:to-gray-500',
//       successBg: 'bg-green-100/50 border-green-200/50',
//       successText: 'text-green-600',
//       errorBg: 'bg-red-100/50 border-red-200/50',
//       errorText: 'text-red-600',
//       copiedBg: 'bg-blue-100/50 border-blue-200/50',
//       copiedText: 'text-blue-600',
//       warningBg: 'bg-yellow-100/50 border-yellow-200/50',
//       warningText: 'text-yellow-600',
//       shadow: 'shadow-xl',
//     }
//   };

//   const themeKey = isDarkMode ? 'dark' : 'light';
//   const currentTheme = themeStyles[themeKey] || themeStyles.dark;

//   useEffect(() => {
//     if (isSubscriptionDeposit) {
//       setAmount('10');
//     }
//   }, [isSubscriptionDeposit]);

//   const fetchBalance = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(result.message || 'Failed to fetch user data');
//       }
//       return result.user.balance;
//     } catch (error) {
//       console.error('Failed to fetch balance:', error);
//       setErrorMessage('Failed to update balance. Please refresh the page.');
//       setStatus('error');
//       return null;
//     }
//   }, [userId]);

//   const fetchUserData = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(result.message || 'Failed to fetch user data');
//       }
//       return result.user;
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       return null;
//     }
//   }, [userId]);

//   const resetCryptoForm = useCallback(() => {
//     setAmount(isSubscriptionDeposit ? '10' : '');
//     setShowInstructions(false);
//     setDepositInstructions(null);
//     setCryptoStatus('pending');
//     setStatus(null);
//     setErrorMessage('');
//     setLastChecked(null);
//     setRetryCount(0);
//     setShowConsentDialog(false);
//   }, [isSubscriptionDeposit]);

//   const cleanupMonitoring = useCallback(() => {
//     if (monitoringInterval.current) {
//       clearInterval(monitoringInterval.current);
//       monitoringInterval.current = null;
//     }
//     if (monitoringTimeout.current) {
//       clearTimeout(monitoringTimeout.current);
//       monitoringTimeout.current = null;
//     }
//     setIsMonitoring(false);
//   }, []);

//   const handleNetworkError = useCallback((error) => {
//     console.error('Network error:', error);
//     let userFriendlyError = 'Something went wrong. Please try again later.';
//     if (error.message.includes('Server error')) {
//       userFriendlyError = 'Server error occurred. Please try again.';
//     } else if (error.message.includes('Failed to fetch')) {
//       userFriendlyError = 'Network error. Please check your connection.';
//     }
//     setErrorMessage(userFriendlyError);
//     setStatus('error');
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   const activateSubscription = useCallback(async (retries = 3) => {
//     for (let attempt = 1; attempt <= retries; attempt++) {
//       try {
//         const response = await fetch('http://localhost:5000/activate-subscription', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId })
//         });
//         const result = await response.json();
//         if (!response.ok) {
//           throw new Error(result.message || `Subscription activation failed: ${response.status}`);
//         }
//         console.log('Subscription activation response:', result);
//         return result.status === 'success';
//       } catch (error) {
//         console.error(`Subscription activation attempt ${attempt} failed:`, error);
//         if (attempt < retries) {
//           await new Promise(resolve => setTimeout(resolve, 2000));
//           continue;
//         }
//         return false;
//       }
//     }
//   }, [userId]);

//   const handleDepositSuccess = useCallback(async (newBalance) => {
//     if (onDeposit) {
//       onDeposit(newBalance);
//     }
//     if (isSubscriptionDeposit) {
//       let success = await activateSubscription();
//       if (!success) {
//         const userData = await fetchUserData();
//         if (userData && userData.is_premium) {
//           console.log('Subscription already active in Firestore:', userData);
//           success = true;
//         }
//       }
//       if (!success) {
//         setErrorMessage('Subscription activation failed. Please try again or contact support.');
//         setStatus('error');
//         return;
//       }
//     }
//     setStatus('success');
//     setShowInstructions(false);
//     setTimeout(() => {
//       setShowConsentDialog(true);
//     }, 1000);
//   }, [isSubscriptionDeposit, onDeposit, activateSubscription, fetchUserData]);

//   const checkDepositStatus = useCallback(async (manualCheck = false) => {
//     if (!depositInstructions?.depositId) return;
//     try {
//       setIsProcessing(true);
//       const response = await fetch(`http://localhost:5000/check-deposit-status/${depositInstructions.depositId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }
//       const result = await response.json();
//       if (result.status === 'success') {
//         setCryptoStatus(result.depositStatus);
//         if (result.depositStatus === 'completed') {
//           cleanupMonitoring();
//           const latestBalance = await fetchBalance();
//           if (latestBalance !== null) {
//             await handleDepositSuccess(latestBalance);
//           }
//         } else if (result.depositStatus === 'failed' || result.depositStatus === 'timeout') {
//           cleanupMonitoring();
//           setErrorMessage(result.message || 'Deposit failed or timed out. Please contact support.');
//           setStatus('error');
//         }
//         setLastChecked(new Date());
//         setRetryCount(0);
//       } else {
//         if (retryCount < 3) {
//           setRetryCount(prev => prev + 1);
//           if (!manualCheck) {
//             setTimeout(() => checkDepositStatus(false), 5000);
//           }
//         } else {
//           throw new Error(result.message || 'Failed to verify deposit status after multiple attempts.');
//         }
//       }
//     } catch (error) {
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [
//     depositInstructions,
//     cleanupMonitoring,
//     handleNetworkError,
//     retryCount,
//     fetchBalance,
//     handleDepositSuccess
//   ]);

//   const startMonitoring = useCallback(() => {
//     if (!depositInstructions?.depositId) return;
//     cleanupMonitoring();
//     setIsMonitoring(true);
//     checkDepositStatus(false);
//     monitoringInterval.current = setInterval(() => checkDepositStatus(false), 5000);
//     monitoringTimeout.current = setTimeout(() => {
//       if (cryptoStatus !== 'completed') {
//         cleanupMonitoring();
//         setErrorMessage('Deposit verification timed out. Please check transaction status or contact support.');
//         setStatus('error');
//         setCryptoStatus('timeout');
//       }
//     }, 30 * 60 * 1000);
//   }, [depositInstructions, checkDepositStatus, cleanupMonitoring, cryptoStatus]);

//   useEffect(() => {
//     if (depositInstructions?.depositId && status === 'pending' && !isMonitoring) {
//       startMonitoring();
//     }
//   }, [depositInstructions, status, isMonitoring, startMonitoring]);

//   const validateAmount = useCallback(() => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setErrorMessage('Please enter a valid amount greater than 0.');
//       setStatus('error');
//       return false;
//     }
//     if (isSubscriptionDeposit && parseFloat(amount) !== 10) {
//       setErrorMessage('Subscription activation requires exactly 10 XLM.');
//       setStatus('error');
//       return false;
//     }
//     if (!isSubscriptionDeposit && parseFloat(amount) < 10) {
//       setErrorMessage('Minimum deposit amount is 10 XLM.');
//       setStatus('error');
//       return false;
//     }
//     return true;
//   }, [amount, isSubscriptionDeposit]);

//   const copyToClipboard = (text, type) => {
//     navigator.clipboard.writeText(text);
//     setStatus('copied');
//     setErrorMessage(`${type} copied to clipboard!`);
//     setTimeout(() => {
//       if (cryptoStatus === 'completed') {
//         resetCryptoForm();
//       } else {
//         setStatus('pending');
//         setErrorMessage('');
//       }
//     }, 2000);
//   };

//   const handleCryptoDeposit = async () => {
//     if (!validateAmount()) return;
//     setIsProcessing(true);
//     setErrorMessage('');
//     setStatus(null);
//     try {
//       const response = await fetch('http://localhost:5000/crypto-deposit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, amount: parseFloat(amount) }),
//       });
//       const result = await response.json();
//       if (result.status === 'success') {
//         setDepositInstructions({
//           depositAddress: result.depositAddress,
//           memo: result.memo,
//           amount: parseFloat(amount),
//           depositId: result.depositId,
//         });
//         setShowInstructions(true);
//         setStatus('pending');
//         setErrorMessage('');
//       } else {
//         throw new Error(result.message || 'Failed to get deposit address.');
//       }
//     } catch (error) {
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleAnotherDeposit = () => {
//     resetCryptoForm();
//   };

//   const getStatusMessage = () => {
//     if (status === 'success') {
//       return isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!';
//     }
//     if (status === 'error') {
//       return errorMessage || 'Something went wrong. Please try again.';
//     }
//     if (status === 'copied') {
//       return errorMessage;
//     }
//     return null;
//   };

//   const getStatusIcon = () => {
//     if (status === 'success') {
//       return <CheckCircle size={20} className={currentTheme.successText} />;
//     }
//     if (status === 'error') {
//       return <AlertCircle size={20} className={currentTheme.errorText} />;
//     }
//     if (status === 'copied') {
//       return <CheckCircle size={20} className={currentTheme.copiedText} />;
//     }
//     return null;
//   };

//   const getCryptoStatusIcon = () => {
//     if (cryptoStatus === 'completed') {
//       return <CheckCircle size={20} className={currentTheme.successText} />;
//     }
//     if (cryptoStatus === 'failed' || cryptoStatus === 'timeout') {
//       return <AlertCircle size={20} className={currentTheme.errorText} />;
//     }
//     return <Loader2 size={20} className={currentTheme.warningText + ' animate-spin'} />;
//   };

//   const ConsentDialog = () => {
//     const handleGoBack = () => {
//       const returnPath = isSubscriptionDeposit 
//         ? `/dashboard/firestore-query?subscribed=true&userId=${userId}`
//         : '/dashboard';
//       navigate(returnPath);
//     };

//     return (
//       <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/75' : 'bg-gray-500/75'} backdrop-blur-sm flex items-center justify-center p-4 z-50`}>
//         <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow} p-8 max-w-md w-full space-y-6`}>
//           <div className="text-center space-y-3">
//             <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentTheme.successBg}`}>
//               <CheckCircle size={32} className={currentTheme.successText} />
//             </div>
//             <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
//               {isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!'}
//             </h3>
//             <p className={`${currentTheme.textSecondary} text-sm`}>
//               {isSubscriptionDeposit 
//                 ? 'Your subscription is now active and you can access verification codes.'
//                 : `Your deposit of ${depositInstructions?.amount} XLM has been processed.`}
//             </p>
//             {isSubscriptionDeposit && (
//               <p className={`${currentTheme.textAccent} text-sm mt-2`}>
//                 You can now check your verification code in the Firestore Query section.
//               </p>
//             )}
//           </div>
//           <div className="flex flex-col space-y-3">
//             {!isSubscriptionDeposit && (
//               <button
//                 onClick={handleAnotherDeposit}
//                 className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${currentTheme.buttonBg} ${currentTheme.buttonHover} transition-all duration-300 ${currentTheme.shadow}`}
//               >
//                 <div className="flex items-center justify-center space-x-2">
//                   <Plus size={20} />
//                   <span>Make Another Deposit</span>
//                 </div>
//               </button>
//             )}
//             <button
//               onClick={handleGoBack}
//               className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${
//                 isSubscriptionDeposit 
//                   ? 'bg-emerald-600 hover:bg-emerald-700' 
//                   : currentTheme.secondaryButtonBg + ' ' + currentTheme.secondaryButtonHover
//               } transition-all duration-300 ${currentTheme.shadow}`}
//             >
//               <div className="flex items-center justify-center space-x-2">
//                 <Home size={20} />
//                 <span>{isSubscriptionDeposit ? 'Go to Verification' : 'Go to Dashboard'}</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className={`min-h-screen ${currentTheme.background} ${currentTheme.textPrimary} flex items-center justify-center py-12 px-4`}>
//         <div className="w-full max-w-lg">
//           <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow} p-8 space-y-8`}>
//             <div className="text-center space-y-2">
//               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentTheme.successBg}`}>
//                 <Wallet size={32} className={currentTheme.textAccent} />
//               </div>
//               <h2 className={`text-3xl font-bold bg-clip-text text-transparent ${currentTheme.buttonBg}`}>
//                 {isSubscriptionDeposit ? 'Subscribe Now' : 'Deposit Funds'}
//               </h2>
//               <p className={`${currentTheme.textSecondary} text-sm`}>
//                 {isSubscriptionDeposit
//                   ? 'Deposit exactly 10 XLM to activate your subscription'
//                   : 'Deposit Stellar Lumens (XLM) to your account securely.'}
//               </p>
//             </div>
//             <div className="space-y-6">
//               {getStatusMessage() && (
//                 <div
//                   className={`flex items-start space-x-3 p-4 rounded-xl border ${
//                     status === 'success' ? currentTheme.successBg + ' ' + currentTheme.successText :
//                     status === 'copied' ? currentTheme.copiedBg + ' ' + currentTheme.copiedText :
//                     currentTheme.errorBg + ' ' + currentTheme.errorText
//                   }`}
//                 >
//                   {getStatusIcon()}
//                   <div>
//                     <p className="font-medium">{getStatusMessage()}</p>
//                     {status === 'error' && errorMessage.includes('contact support') && (
//                       <p className={`${currentTheme.textMuted} text-xs mt-1`}>
//                         Reach out to our team for assistance.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {status === 'pending' && cryptoStatus === 'pending' && isMonitoring && (
//                 <div className={`flex items-start space-x-3 ${currentTheme.warningText} text-sm ${currentTheme.warningBg} rounded-xl p-4 mb-6`}>
//                   <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
//                   <div>
//                     <p className="font-medium">Monitoring Deposit</p>
//                     <p>Transaction status will update automatically when confirmed.</p>
//                   </div>
//                 </div>
//               )}
//               {!showInstructions ? (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <label
//                       htmlFor="amount"
//                       className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}
//                     >
//                       Deposit Amount (XLM)
//                     </label>
//                     <div className="relative">
//                       <DollarSign
//                         size={20}
//                         className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted}`}
//                       />
//                       <input
//                         type="number"
//                         id="amount"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder={isSubscriptionDeposit ? '10' : 'Enter amount (min 10 XLM)'}
//                         className={`w-full pl-10 pr-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} rounded-xl ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
//                         disabled={isProcessing || isSubscriptionDeposit}
//                       />
//                     </div>
//                   </div>
//                   <div className={`flex items-start space-x-2 ${currentTheme.textSecondary} text-xs`}>
//                     <Shield size={16} className="flex-shrink-0 mt-0.5" />
//                     <p>
//                       Deposits are processed on the Stellar network. Ensure you send
//                       the exact amount and include the memo provided.
//                     </p>
//                   </div>
//                   <button
//                     onClick={handleCryptoDeposit}
//                     className={`w-full px-6 py-3 rounded-xl font-semibold ${currentTheme.textPrimary} ${currentTheme.buttonBg} ${currentTheme.buttonHover} transition-all duration-300 ${currentTheme.shadow} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={isProcessing}
//                   >
//                     <div className="flex items-center justify-center space-x-2">
//                       {isProcessing ? (
//                         <Loader2 size={20} className="animate-spin" />
//                       ) : (
//                         <Zap size={20} />
//                       )}
//                       <span>
//                         {isProcessing ? 'Processing...' : 'Get Deposit Address'}
//                       </span>
//                     </div>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-xl p-6 space-y-4`}>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         {getCryptoStatusIcon()}
//                         <div>
//                           <span className={`font-medium capitalize text-base ${currentTheme.textPrimary}`}>
//                             {cryptoStatus === 'pending' ? 'Waiting for payment' : cryptoStatus}
//                           </span>
//                           {lastChecked && (
//                             <p className={`${currentTheme.textMuted} text-xs`}>
//                               Last checked:{' '}
//                               {lastChecked.toLocaleTimeString([], {
//                                 hour: '2-digit',
//                                 minute: '2-digit',
//                                 second: '2-digit',
//                               })}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`w-full h-px ${currentTheme.cardBorder}`} />
//                     <div className="space-y-4">
//                       <div>
//                         <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
//                           Deposit Address
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <p className={`text-sm ${currentTheme.textSecondary} break-all flex-1`}>
//                             {depositInstructions.depositAddress}
//                           </p>
//                           <button
//                             onClick={() =>
//                               copyToClipboard(
//                                 depositInstructions.depositAddress,
//                                 'Address'
//                               )
//                             }
//                             className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-colors`}
//                           >
//                             <Copy size={16} className={currentTheme.textPrimary} />
//                           </button>
//                         </div>
//                       </div>
//                       <div>
//                         <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
//                           Memo (Required)
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <p className={`text-sm ${currentTheme.textSecondary} break-all flex-1`}>
//                             {depositInstructions.memo}
//                           </p>
//                           <button
//                             onClick={() =>
//                               copyToClipboard(depositInstructions.memo, 'Memo')
//                             }
//                             className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-colors`}
//                           >
//                             <Copy size={16} className={currentTheme.textPrimary} />
//                           </button>
//                         </div>
//                       </div>
//                       <div>
//                         <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
//                           Amount
//                         </label>
//                         <p className={`text-sm ${currentTheme.textSecondary}`}>
//                           {depositInstructions.amount} XLM
//                         </p>
//                       </div>
//                     </div>
//                     <div className={`flex items-start space-x-2 ${currentTheme.warningText} text-xs ${currentTheme.warningBg} rounded-xl p-4`}>
//                       <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
//                       <p>
//                         Send <span className="font-semibold">{depositInstructions.amount} XLM</span> to the address above
//                         with the exact memo. Incorrect memo or amount may result in
//                         loss of funds.
//                       </p>
//                     </div>
//                     <div className={`flex items-center space-x-2 ${currentTheme.textSecondary} text-xs`}>
//                       <ExternalLink size={16} className="flex-shrink-0" />
//                       <p>
//                         Need help?{' '}
//                         <a
//                           href="https://www.stellar.org/learn/basics-stellar-deposits"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`${currentTheme.textAccent} hover:underline`}
//                         >
//                           Learn about Stellar deposits
//                         </a>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col space-y-3">
//                     <button
//                       onClick={resetCryptoForm}
//                       className={`w-full px-6 py-3 rounded-xl font-semibold ${currentTheme.textPrimary} ${currentTheme.secondaryButtonBg} ${currentTheme.secondaryButtonHover} transition-all duration-300 ${currentTheme.shadow}`}
//                     >
//                       <div className="flex items-center justify-center space-x-2">
//                         <ArrowRight size={20} />
//                         <span>Start New Deposit</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {showConsentDialog && <ConsentDialog />}
//     </>
//   );
// };

// export default Deposit;





import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  DollarSign, Wallet, CheckCircle, AlertCircle, Loader2, 
  ArrowRight, Shield, Zap, Copy, ExternalLink, Plus, Home, TrendingUp, Lock 
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Deposit = ({ userId, onDeposit, isDarkMode = true }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [depositInstructions, setDepositInstructions] = useState(null);
  const [cryptoStatus, setCryptoStatus] = useState('pending');
  const [lastChecked, setLastChecked] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const purpose = searchParams.get('purpose');
  const isSubscriptionDeposit = purpose === 'subscription' || purpose === 'premium';
  const monitoringInterval = useRef(null);
  const monitoringTimeout = useRef(null);
  const navigate = useNavigate();

  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-b from-gray-900 to-black',
      container: 'bg-gray-800/50 backdrop-blur-lg',
      containerBorder: 'border-gray-700/50',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      textAccent: 'text-blue-400',
      cardBg: 'bg-gray-900/30',
      cardBorder: 'border-gray-700/50',
      inputBg: 'bg-gray-900/50',
      inputBorder: 'border-gray-700',
      inputPlaceholder: 'placeholder-gray-500',
      buttonBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
      buttonHover: 'hover:from-blue-500 hover:to-purple-500',
      secondaryButtonBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
      secondaryButtonHover: 'hover:from-gray-500 hover:to-gray-600',
      successBg: 'bg-green-500/10 border-green-500/20',
      successText: 'text-green-400',
      errorBg: 'bg-red-500/10 border-red-500/20',
      errorText: 'text-red-400',
      copiedBg: 'bg-blue-500/10 border-blue-500/20',
      copiedText: 'text-blue-400',
      warningBg: 'bg-yellow-500/10 border-yellow-500/20',
      warningText: 'text-yellow-400',
      shadow: 'shadow-2xl',
    },
    light: {
      background: 'bg-gradient-to-b from-gray-50 to-white',
      container: 'bg-white/80 backdrop-blur-lg',
      containerBorder: 'border-gray-200/50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      textAccent: 'text-blue-600',
      cardBg: 'bg-gray-50/50',
      cardBorder: 'border-gray-200/50',
      inputBg: 'bg-white/50',
      inputBorder: 'border-gray-300',
      inputPlaceholder: 'placeholder-gray-500',
      buttonBg: 'bg-gradient-to-r from-blue-500 to-purple-500',
      buttonHover: 'hover:from-blue-400 hover:to-purple-400',
      secondaryButtonBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      secondaryButtonHover: 'hover:from-gray-400 hover:to-gray-500',
      successBg: 'bg-green-100/50 border-green-200/50',
      successText: 'text-green-600',
      errorBg: 'bg-red-100/50 border-red-200/50',
      errorText: 'text-red-600',
      copiedBg: 'bg-blue-100/50 border-blue-200/50',
      copiedText: 'text-blue-600',
      warningBg: 'bg-yellow-100/50 border-yellow-200/50',
      warningText: 'text-yellow-600',
      shadow: 'shadow-xl',
    }
  };

  const themeKey = isDarkMode ? 'dark' : 'light';
  const currentTheme = themeStyles[themeKey] || themeStyles.dark;

  useEffect(() => {
    if (isSubscriptionDeposit) {
      setAmount('10');
    }
  }, [isSubscriptionDeposit]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch user data');
      }
      return result.user.balance;
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setErrorMessage('Failed to update balance. Please refresh the page.');
      setStatus('error');
      return null;
    }
  }, [userId]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch user data');
      }
      return result.user;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  }, [userId]);

  const resetCryptoForm = useCallback(() => {
    setAmount(isSubscriptionDeposit ? '10' : '');
    setShowInstructions(false);
    setDepositInstructions(null);
    setCryptoStatus('pending');
    setStatus(null);
    setErrorMessage('');
    setLastChecked(null);
    setRetryCount(0);
    setShowConsentDialog(false);
  }, [isSubscriptionDeposit]);

  const cleanupMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    if (monitoringTimeout.current) {
      clearTimeout(monitoringTimeout.current);
      monitoringTimeout.current = null;
    }
    setIsMonitoring(false);
  }, []);

  const handleNetworkError = useCallback((error) => {
    console.error('Network error:', error);
    let userFriendlyError = 'Something went wrong. Please try again later.';
    if (error.message.includes('Server error')) {
      userFriendlyError = 'Server error occurred. Please try again.';
    } else if (error.message.includes('Failed to fetch')) {
      userFriendlyError = 'Network error. Please check your connection.';
    }
    setErrorMessage(userFriendlyError);
    setStatus('error');
    cleanupMonitoring();
  }, [cleanupMonitoring]);

  const activateSubscription = useCallback(async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('http://localhost:5000/activate-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || `Subscription activation failed: ${response.status}`);
        }
        console.log('Subscription activation response:', result);
        return result.status === 'success';
      } catch (error) {
        console.error(`Subscription activation attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        return false;
      }
    }
  }, [userId]);

  const handleDepositSuccess = useCallback(async (newBalance) => {
    if (onDeposit) {
      onDeposit(newBalance);
    }
    if (isSubscriptionDeposit) {
      let success = await activateSubscription();
      if (!success) {
        const userData = await fetchUserData();
        if (userData && userData.is_premium) {
          console.log('Subscription already active in Firestore:', userData);
          success = true;
        }
      }
      if (!success) {
        setErrorMessage('Subscription activation failed. Please try again or contact support.');
        setStatus('error');
        return;
      }
    }
    setStatus('success');
    setShowInstructions(false);
    setTimeout(() => {
      setShowConsentDialog(true);
    }, 1000);
  }, [isSubscriptionDeposit, onDeposit, activateSubscription, fetchUserData]);

  const checkDepositStatus = useCallback(async (manualCheck = false) => {
    if (!depositInstructions?.depositId) return;
    try {
      setIsProcessing(true);
      const response = await fetch(`http://localhost:5000/check-deposit-status/${depositInstructions.depositId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${await response.text()}`);
      }
      const result = await response.json();
      if (result.status === 'success') {
        setCryptoStatus(result.depositStatus);
        if (result.depositStatus === 'completed') {
          cleanupMonitoring();
          const latestBalance = await fetchBalance();
          if (latestBalance !== null) {
            await handleDepositSuccess(latestBalance);
          }
        } else if (result.depositStatus === 'failed' || result.depositStatus === 'timeout') {
          cleanupMonitoring();
          setErrorMessage(result.message || 'Deposit failed or timed out. Please contact support.');
          setStatus('error');
        }
        setLastChecked(new Date());
        setRetryCount(0);
      } else {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          if (!manualCheck) {
            setTimeout(() => checkDepositStatus(false), 5000);
          }
        } else {
          throw new Error(result.message || 'Failed to verify deposit status after multiple attempts.');
        }
      }
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    depositInstructions,
    cleanupMonitoring,
    handleNetworkError,
    retryCount,
    fetchBalance,
    handleDepositSuccess
  ]);

  const startMonitoring = useCallback(() => {
    if (!depositInstructions?.depositId) return;
    cleanupMonitoring();
    setIsMonitoring(true);
    checkDepositStatus(false);
    monitoringInterval.current = setInterval(() => checkDepositStatus(false), 5000);
    monitoringTimeout.current = setTimeout(() => {
      if (cryptoStatus !== 'completed') {
        cleanupMonitoring();
        setErrorMessage('Deposit verification timed out. Please check transaction status or contact support.');
        setStatus('error');
        setCryptoStatus('timeout');
      }
    }, 30 * 60 * 1000);
  }, [depositInstructions, checkDepositStatus, cleanupMonitoring, cryptoStatus]);

  useEffect(() => {
    if (depositInstructions?.depositId && status === 'pending' && !isMonitoring) {
      startMonitoring();
    }
  }, [depositInstructions, status, isMonitoring, startMonitoring]);

  const validateAmount = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      setStatus('error');
      return false;
    }
    if (isSubscriptionDeposit && parseFloat(amount) !== 10) {
      setErrorMessage('Subscription activation requires exactly 10 XLM.');
      setStatus('error');
      return false;
    }
    if (!isSubscriptionDeposit && parseFloat(amount) < 10) {
      setErrorMessage('Minimum deposit amount is 10 XLM.');
      setStatus('error');
      return false;
    }
    return true;
  }, [amount, isSubscriptionDeposit]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setStatus('copied');
    setErrorMessage(`${type} copied to clipboard!`);
    setTimeout(() => {
      if (cryptoStatus === 'completed') {
        resetCryptoForm();
      } else {
        setStatus('pending');
        setErrorMessage('');
      }
    }, 2000);
  };

  const handleCryptoDeposit = async () => {
    if (!validateAmount()) return;
    setIsProcessing(true);
    setErrorMessage('');
    setStatus(null);
    try {
      const response = await fetch('http://localhost:5000/crypto-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: parseFloat(amount) }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setDepositInstructions({
          depositAddress: result.depositAddress,
          memo: result.memo,
          amount: parseFloat(amount),
          depositId: result.depositId,
        });
        setShowInstructions(true);
        setStatus('pending');
        setErrorMessage('');
      } else {
        throw new Error(result.message || 'Failed to get deposit address.');
      }
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnotherDeposit = () => {
    resetCryptoForm();
  };

  const getStatusMessage = () => {
    if (status === 'success') {
      return isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!';
    }
    if (status === 'error') {
      return errorMessage || 'Something went wrong. Please try again.';
    }
    if (status === 'copied') {
      return errorMessage;
    }
    return null;
  };

  const getStatusIcon = () => {
    if (status === 'success') {
      return <CheckCircle size={20} className={currentTheme.successText} />;
    }
    if (status === 'error') {
      return <AlertCircle size={20} className={currentTheme.errorText} />;
    }
    if (status === 'copied') {
      return <CheckCircle size={20} className={currentTheme.copiedText} />;
    }
    return null;
  };

  const getCryptoStatusIcon = () => {
    if (cryptoStatus === 'completed') {
      return <CheckCircle size={20} className={currentTheme.successText} />;
    }
    if (cryptoStatus === 'failed' || cryptoStatus === 'timeout') {
      return <AlertCircle size={20} className={currentTheme.errorText} />;
    }
    return <Loader2 size={20} className={currentTheme.warningText + ' animate-spin'} />;
  };

  const ConsentDialog = () => {
    const handleGoBack = () => {
      const returnPath = isSubscriptionDeposit 
        ? `/dashboard/firestore-query?subscribed=true&userId=${userId}`
        : '/dashboard';
      navigate(returnPath);
    };

    return (
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/75' : 'bg-gray-500/75'} backdrop-blur-sm flex items-center justify-center p-4 z-50`}>
        <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow} p-8 max-w-md w-full space-y-6`}>
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentTheme.successBg}`}>
              <CheckCircle size={32} className={currentTheme.successText} />
            </div>
            <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
              {isSubscriptionDeposit ? 'Subscription Activated!' : 'Deposit Successful!'}
            </h3>
            <p className={`${currentTheme.textSecondary} text-sm`}>
              {isSubscriptionDeposit 
                ? 'Your subscription is now active and you can access verification codes.'
                : `Your deposit of ${depositInstructions?.amount} XLM has been processed.`}
            </p>
            {isSubscriptionDeposit && (
              <p className={`${currentTheme.textAccent} text-sm mt-2`}>
                You can now check your verification code in the Firestore Query section.
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-3">
            {!isSubscriptionDeposit && (
              <button
                onClick={handleAnotherDeposit}
                className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${currentTheme.buttonBg} ${currentTheme.buttonHover} transition-all duration-300 ${currentTheme.shadow}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus size={20} />
                  <span>Make Another Deposit</span>
                </div>
              </button>
            )}
            <button
              onClick={handleGoBack}
              className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${
                isSubscriptionDeposit 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : currentTheme.secondaryButtonBg + ' ' + currentTheme.secondaryButtonHover
              } transition-all duration-300 ${currentTheme.shadow}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Home size={20} />
                <span>{isSubscriptionDeposit ? 'Go to Verification' : 'Go to Dashboard'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} p-4 lg:p-8 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen lg:min-h-0">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${currentTheme.buttonBg} mb-6 ${currentTheme.shadow}`}>
                <Wallet size={36} className={currentTheme.textPrimary} />
              </div>
              <h1 className={`text-4xl lg:text-5xl font-bold ${currentTheme.textPrimary} mb-4 leading-tight`}>
                Crypto Deposit
              </h1>
              <p className={`text-xl ${currentTheme.textSecondary} mb-8 leading-relaxed`}>
                Add funds securely to your XLM wallet
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${currentTheme.successBg} rounded-xl flex items-center justify-center`}>
                    <Zap size={24} className={currentTheme.successText} />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Fast Processing</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>Confirmation in seconds</p>
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center`}>
                    <Lock size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Secure</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>256-bit SSL encryption</p>
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center`}>
                    <TrendingUp size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Zero Fees</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>No hidden charges</p>
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center`}>
                    <Shield size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Protected</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>Fraud protection included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow} p-8 space-y-8`}>
                <div className={`absolute -top-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/20 to-transparent'}`} />
                <div className={`absolute -bottom-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/10 to-transparent'}`} />
                <div className="text-center space-y-2">
                  <h2 className={`text-3xl font-bold bg-clip-text text-transparent ${currentTheme.buttonBg}`}>
                    {isSubscriptionDeposit ? 'Subscribe Now' : 'Deposit Funds'}
                  </h2>
                  <p className={`${currentTheme.textSecondary} text-sm`}>
                    {isSubscriptionDeposit
                      ? 'Deposit exactly 10 XLM to activate your subscription'
                      : 'Deposit Stellar Lumens (XLM) to your account securely.'}
                  </p>
                </div>
                <div className="space-y-6">
                  {getStatusMessage() && (
                    <div
                      className={`flex items-start space-x-3 p-4 rounded-xl border ${
                        status === 'success' ? currentTheme.successBg + ' ' + currentTheme.successText :
                        status === 'copied' ? currentTheme.copiedBg + ' ' + currentTheme.copiedText :
                        currentTheme.errorBg + ' ' + currentTheme.errorText
                      }`}
                    >
                      {getStatusIcon()}
                      <div>
                        <p className="font-medium">{getStatusMessage()}</p>
                        {status === 'error' && errorMessage.includes('contact support') && (
                          <p className={`${currentTheme.textMuted} text-xs mt-1`}>
                            Reach out to our team for assistance.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {status === 'pending' && cryptoStatus === 'pending' && isMonitoring && (
                    <div className={`flex items-start space-x-3 ${currentTheme.warningText} text-sm ${currentTheme.warningBg} rounded-xl p-4 mb-6`}>
                      <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <p className="font-medium">Monitoring Deposit</p>
                        <p>Transaction status will update automatically when confirmed.</p>
                      </div>
                    </div>
                  )}
                  {!showInstructions ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <label
                          htmlFor="amount"
                          className={`block text-sm font-medium ${currentTheme.textSecondary} mb-2`}
                        >
                          Deposit Amount (XLM)
                        </label>
                        <div className="relative">
                          <DollarSign
                            size={20}
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted}`}
                          />
                          <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={isSubscriptionDeposit ? '10' : 'Enter amount (min 10 XLM)'}
                            className={`w-full pl-10 pr-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} rounded-xl ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            disabled={isProcessing || isSubscriptionDeposit}
                          />
                        </div>
                      </div>
                      <div className={`flex items-start space-x-2 ${currentTheme.textSecondary} text-xs`}>
                        <Shield size={16} className="flex-shrink-0 mt-0.5" />
                        <p>
                          Deposits are processed on the Stellar network. Ensure you send
                          the exact amount and include the memo provided.
                        </p>
                      </div>
                      <button
                        onClick={handleCryptoDeposit}
                        className={`w-full px-6 py-3 rounded-xl font-semibold ${currentTheme.textPrimary} ${currentTheme.buttonBg} ${currentTheme.buttonHover} transition-all duration-300 ${currentTheme.shadow} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isProcessing}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {isProcessing ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <Zap size={20} />
                          )}
                          <span>
                            {isProcessing ? 'Processing...' : 'Get Deposit Address'}
                          </span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-xl p-6 space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getCryptoStatusIcon()}
                            <div>
                              <span className={`font-medium capitalize text-base ${currentTheme.textPrimary}`}>
                                {cryptoStatus === 'pending' ? 'Waiting for payment' : cryptoStatus}
                              </span>
                              {lastChecked && (
                                <p className={`${currentTheme.textMuted} text-xs`}>
                                  Last checked:{' '}
                                  {lastChecked.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`w-full h-px ${currentTheme.cardBorder}`} />
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                              Deposit Address
                            </label>
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm ${currentTheme.textSecondary} break-all flex-1`}>
                                {depositInstructions.depositAddress}
                              </p>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    depositInstructions.depositAddress,
                                    'Address'
                                  )
                                }
                                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-colors`}
                              >
                                <Copy size={16} className={currentTheme.textPrimary} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                              Memo (Required)
                            </label>
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm ${currentTheme.textSecondary} break-all flex-1`}>
                                {depositInstructions.memo}
                              </p>
                              <button
                                onClick={() =>
                                  copyToClipboard(depositInstructions.memo, 'Memo')
                                }
                                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-colors`}
                              >
                                <Copy size={16} className={currentTheme.textPrimary} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                              Amount
                            </label>
                            <p className={`text-sm ${currentTheme.textSecondary}`}>
                              {depositInstructions.amount} XLM
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-2 ${currentTheme.warningText} text-xs ${currentTheme.warningBg} rounded-xl p-4`}>
                          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                          <p>
                            Send <span className="font-semibold">{depositInstructions.amount} XLM</span> to the address above
                            with the exact memo. Incorrect memo or amount may result in
                            loss of funds.
                          </p>
                        </div>
                        <div className={`flex items-center space-x-2 ${currentTheme.textSecondary} text-xs`}>
                          <ExternalLink size={16} className="flex-shrink-0" />
                          <p>
                            Need help?{' '}
                            <a
                              href="https://www.stellar.org/learn/basics-stellar-deposits"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${currentTheme.textAccent} hover:underline`}
                            >
                              Learn about Stellar deposits
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <button
                          onClick={resetCryptoForm}
                          className={`w-full px-6 py-3 rounded-xl font-semibold ${currentTheme.textPrimary} ${currentTheme.secondaryButtonBg} ${currentTheme.secondaryButtonHover} transition-all duration-300 ${currentTheme.shadow}`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <ArrowRight size={20} />
                            <span>Start New Deposit</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConsentDialog && <ConsentDialog />}
    </div>
  );
};

export default Deposit;