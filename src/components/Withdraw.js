

// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { 
//   MinusCircle, Wallet, AlertCircle, CheckCircle, Loader2, ArrowRight, 
//   Shield, DollarSign, Lock, TrendingUp, Zap, Copy, ExternalLink, RefreshCw 
// } from 'lucide-react';

// const Withdraw = ({ onWithdraw, balance, userId }) => {
//   const [amount, setAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
//   const [destination, setDestination] = useState('');
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [withdrawInstructions, setWithdrawInstructions] = useState(null);
//   const [cryptoStatus, setCryptoStatus] = useState('pending');
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);
//   const [lastChecked, setLastChecked] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   const inputRef = useRef(null);
//   const monitoringInterval = useRef(null);
//   const monitoringTimeout = useRef(null);

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

//   const resetCryptoForm = useCallback(() => {
//     setAmount('');
//     setDestination('');
//     setShowInstructions(false);
//     setWithdrawInstructions(null);
//     setCryptoStatus('pending');
//     setIsMonitoring(false);
//     setStatus(null);
//     setErrorMessage('');
//     setCopiedField(null);
//     setLastChecked(null);
//     setRetryCount(0);
//     setSelectedQuickAmount(null);
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   useEffect(() => {
//     resetCryptoForm();
//     return () => cleanupMonitoring();
//   }, [resetCryptoForm, cleanupMonitoring]);


//   const handleNetworkError = useCallback((error) => {
//     console.error('Transaction error:', error);
//     let userFriendlyError = 'Withdrawal failed. Please try again.';
//     if (error.message.includes('Failed to resolve') || error.message.includes('NameResolutionError')) {
//       userFriendlyError = 'Network connection failed. Please check your internet and try again.';
//     } else if (error.message.includes('Max retries exceeded')) {
//       userFriendlyError = 'Server is not responding. Please try again later.';
//     } else if (error.message.includes('timed out')) {
//       userFriendlyError = 'Request timed out. Please check your connection.';
//     }
//     setErrorMessage(userFriendlyError);
//     setStatus('error');
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   const checkWithdrawStatus = useCallback(async () => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('No withdrawId available for status check');
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setLastChecked(new Date());
//       console.log(`Checking status for withdrawId: ${withdrawInstructions.withdrawId}, attempt ${retryCount + 1}`);
//       const response = await fetch(`http://localhost:5000/check-withdraw-status/${withdrawInstructions.withdrawId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }

//       const result = await response.json();
//       console.log('Status response:', result);
//       if (result.status === 'success' || result.message === 'Crypto withdrawal initiated') {
//         setCryptoStatus(result.withdrawStatus || 'pending');
//         if (result.withdrawStatus === 'completed') {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} completed, new balance: ${result.newBalance}`);
//           cleanupMonitoring();
//           setStatus('success');
//           setShowInstructions(false);
//           onWithdraw(result.newBalance || balance);
//           setTimeout(() => {
//             resetCryptoForm();
//           }, 2000);
//         } else if (result.withdrawStatus === 'failed') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} failed`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal failed. Please verify the transaction details or contact support.');
//           setStatus('error');
//         } else if (result.withdrawStatus === 'timeout') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} timed out`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal timed out. Please initiate a new withdrawal.');
//           setStatus('error');
//         } else {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} still pending`);
//           setStatus('pending');
//         }
//       } else {
//         if (retryCount < 10) {
//           const delay = 5000 * Math.pow(2, retryCount);
//           console.log(`Retrying status check for ${withdrawInstructions.withdrawId} in ${delay}ms`);
//           setRetryCount(prev => prev + 1);
//           setTimeout(checkWithdrawStatus, delay);
//         } else {
//           throw new Error(result.message || 'Failed to verify withdrawal status after multiple attempts.');
//         }
//       }
//     } catch (error) {
//       console.error(`Status check failed for ${withdrawInstructions.withdrawId}:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [withdrawInstructions, cleanupMonitoring, handleNetworkError, resetCryptoForm, retryCount, onWithdraw, balance]);

//   const startMonitoring = useCallback(() => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('Cannot start monitoring: no withdrawId');
//       return;
//     }
//     cleanupMonitoring();
//     setIsMonitoring(true);
//     setCryptoStatus('pending');
//     setStatus('pending');
//     setRetryCount(0);
//     checkWithdrawStatus();
//     monitoringInterval.current = setInterval(checkWithdrawStatus, 5000);
//     monitoringTimeout.current = setTimeout(() => {
//       if (cryptoStatus !== 'completed') {
//         console.error(`Monitoring timed out for ${withdrawInstructions.withdrawId}`);
//         cleanupMonitoring();
//         setErrorMessage('Withdrawal verification timed out. Please check transaction status or contact support.');
//         setStatus('error');
//       }
//     }, 30 * 60 * 1000);
//   }, [withdrawInstructions, checkWithdrawStatus, cleanupMonitoring, cryptoStatus]);

 
//   useEffect(() => {
//     if (withdrawInstructions?.withdrawId && status === 'pending' && !isMonitoring) {
//       console.log(`Starting monitoring for withdrawId: ${withdrawInstructions.withdrawId}`);
//       startMonitoring();
//     }
//   }, [withdrawInstructions, status, isMonitoring, startMonitoring]);

//   const validateInputs = useCallback(() => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid amount greater than 0');
//       return false;
//     }
//     if (parseFloat(amount) > balance) {
//       setStatus('error');
//       setErrorMessage('Insufficient balance');
//       return false;
//     }
//     if (!userId) {
//       setStatus('error');
//       setErrorMessage('User authentication required');
//       return false;
//     }
//     if (!destination.trim()) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid wallet address');
//       return false;
//     }
//     if (!destination.startsWith('G') || destination.length !== 56) {
//       setStatus('error');
//       setErrorMessage('Invalid Stellar address');
//       return false;
//     }
//     return true;
//   }, [amount, balance, userId, destination]);

//   const handleAmountChange = useCallback((e) => {
//     setAmount(e.target.value);
//     setSelectedQuickAmount(null);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//   }, []);

//   const handleQuickAmount = useCallback((quickAmount) => {
//     setAmount(quickAmount.toString());
//     setSelectedQuickAmount(quickAmount);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//     inputRef.current?.focus();
//   }, []);

//   const copyToClipboard = useCallback(async (text, field) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       setErrorMessage('Failed to copy to clipboard');
//       setStatus('error');
//     }
//   }, []);

//   const handleCryptoWithdraw = useCallback(async () => {
//     if (!validateInputs()) return;
//     setIsProcessing(true);
//     setStatus(null);
//     setErrorMessage('');
//     try {
//       console.log('Initiating withdrawal:', { userId, amount, destination });
//       const response = await fetch('http://localhost:5000/withdraw-crypto', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, amount: parseFloat(amount), destination }),
//       });
//       const result = await response.json();
//       console.log('Full withdraw response:', result);
//       if (response.ok) {
//         if (!result.withdrawId && !result.withdraw_id) {
//           throw new Error('Missing withdrawId in response');
//         }
//         const newInstructions = {
//           amount: result.amount,
//           currency: result.currency || 'XLM',
//           network: result.network || 'Stellar',
//           destination: result.destination,
//           withdrawId: result.withdrawId || result.withdraw_id,
//           transactionId: result.transactionId || result.tx_hash,
//           instructions: result.instructions || {
//             step1: `Sending ${parseFloat(result.amount || 0).toFixed(2)} XLM to ${result.destination}`,
//             step2: 'Transaction will be processed on the Stellar network',
//             step3: 'Wait for confirmation (usually 5-10 seconds)',
//             step4: 'Funds will be credited to your wallet automatically'
//           },
//           timeoutMinutes: result.timeoutMinutes || 30,
//         };
//         console.log('Setting withdrawInstructions:', newInstructions);
//         setWithdrawInstructions(newInstructions);
//         setShowInstructions(true);
//         setStatus('pending');
//       } else {
//         throw new Error(result.message || 'Invalid withdrawal response');
//       }
//     } catch (error) {
//       console.error(`Withdrawal failed:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [userId, amount, destination, validateInputs, handleNetworkError]);

//   const getButtonStyle = useCallback(() => {
//     if (isProcessing) return 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed';
//     if (status === 'error') return 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600';
//     return 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98]';
//   }, [isProcessing, status]);

//   const getButtonContent = useCallback(() => {
//     if (isProcessing) {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <Loader2 size={20} className="animate-spin text-white/80" />
//           <span>Processing...</span>
//         </div>
//       );
//     }
//     if (status === 'error') {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <AlertCircle size={20} className="text-rose-200" />
//           <span>Try Again</span>
//         </div>
//       );
//     }
//     return (
//       <div className="flex items-center justify-center space-x-3">
//         <MinusCircle size={20} className="text-white/90" />
//         <span className="text-white font-medium">Initiate Withdrawal</span>
//         <ArrowRight size={16} className="text-white/80" />
//       </div>
//     );
//   }, [isProcessing, status]);

//   const getCryptoStatusColor = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
//       case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
//       case 'failed': case 'timeout': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
//       default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
//     }
//   }, [cryptoStatus]);

//   const getCryptoStatusIcon = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return <CheckCircle size={16} />;
//       case 'pending': return <Loader2 size={16} className="animate-spin" />;
//       case 'failed': case 'timeout': return <AlertCircle size={16} />;
//       default: return <Loader2 size={16} className="animate-spin" />;
//     }
//   }, [cryptoStatus]);

//   const quickAmounts = [25, 50, 100, 250, 500, 1000];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 lg:p-8 relative overflow-hidden">
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
//       </div>

//       <div className="relative max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen lg:min-h-0">
//           <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-2xl">
//                 <Wallet size={36} className="text-white" />
//               </div>
//               <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
//                 Crypto Withdrawal
//               </h1>
//               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
//                 Withdraw funds securely to your XLM wallet
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
//                     <Zap size={24} className="text-emerald-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Fast Processing</h3>
//                     <p className="text-gray-400 text-sm">Confirmation in seconds</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                     <Lock size={24} className="text-blue-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Secure</h3>
//                     <p className="text-gray-400 text-sm">256-bit SSL encryption</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <TrendingUp size={24} className="text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Zero Fees</h3>
//                     <p className="text-gray-400 text-sm">No hidden charges</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
//                     <Shield size={24} className="text-indigo-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Protected</h3>
//                     <p className="text-gray-400 text-sm">Fraud protection included</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7 flex items-center justify-center">
//             <div className="w-full max-w-lg">
//               <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
//                 <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
//                 <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

//                 <div className="text-center mb-8">
//                   <h2 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h2>
//                   <p className="text-gray-400 text-sm">
//                     Current Balance: <span className="text-white font-semibold">{balance?.toFixed(2) || '0.00'} XLM</span>
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-300">
//                       Withdrawal Amount
//                     </label>
//                     <div className="relative group">
//                       <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
//                         isFocused ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-sm' : 'bg-white/5'
//                       }`} />
//                       <div className="relative">
//                         <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                           <DollarSign size={20} />
//                         </div>
//                         <input
//                           ref={inputRef}
//                           id="withdrawAmount"
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           className={`w-full pl-12 pr-20 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 text-white text-lg placeholder:text-gray-500 hover:border-white/20 rounded-2xl outline-none ${
//                             status === 'error'
//                               ? 'border-rose-400/60 ring-2 ring-rose-500/30 bg-rose-500/5'
//                               : isFocused
//                                 ? 'border-orange-400/50 ring-2 ring-orange-500/50'
//                                 : 'border-white/10'
//                           }`}
//                           placeholder="0.00"
//                           value={amount}
//                           onChange={handleAmountChange}
//                           onFocus={() => setIsFocused(true)}
//                           onBlur={() => setIsFocused(false)}
//                           disabled={isProcessing || balance <= 0}
//                         />
//                         {amount && (
//                           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
//                             XLM
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     {amount && parseFloat(amount) > 0 && (
//                       <div className="text-center py-2">
//                         <span className="text-2xl font-bold text-white">
//                           {parseFloat(amount).toFixed(2)} XLM
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <label htmlFor="destination" className="block text-sm font-medium text-gray-300">
//                       Recipient Wallet Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="destination"
//                         type="text"
//                         className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 text-white placeholder:text-gray-500 hover:border-white/20 rounded-2xl outline-none ${
//                           status === 'error' && !destination.trim()
//                             ? 'border-rose-400/60 ring-2 ring-rose-500/30 bg-rose-500/5'
//                             : 'border-white/10 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/50'
//                         }`}
//                         placeholder="G1234...ABCD"
//                         value={destination}
//                         onChange={(e) => setDestination(e.target.value)}
//                         disabled={isProcessing}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <h3 className="text-sm font-medium text-gray-300">Quick amounts</h3>
//                     <div className="grid grid-cols-3 gap-3">
//                       {quickAmounts.map((quickAmount) => (
//                         <button
//                           key={quickAmount}
//                           type="button"
//                           onClick={() => handleQuickAmount(quickAmount)}
//                           className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
//                             selectedQuickAmount === quickAmount
//                               ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
//                               : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
//                           }`}
//                           disabled={isProcessing || balance <= 0 || quickAmount > balance}
//                         >
//                           {quickAmount.toLocaleString()} XLM
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {status === 'error' && errorMessage && (
//                     <div className="flex items-start space-x-3 text-rose-400 text-sm bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
//                       <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Transaction Error</p>
//                         <p>{errorMessage}</p>
//                         <button
//                           onClick={() => {
//                             setStatus(null);
//                             setErrorMessage('');
//                           }}
//                           className="mt-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 rounded-lg text-rose-100 transition-colors"
//                         >
//                           Try Again
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'success' && (
//                     <div className="flex items-start space-x-3 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
//                       <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Withdrawal Successful</p>
//                         <p>
//                           {withdrawInstructions?.amount
//                             ? `${parseFloat(withdrawInstructions.amount).toFixed(2)} XLM successfully withdrawn!`
//                             : 'Funds sent to your wallet.'}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'pending' && cryptoStatus === 'pending' && (
//                     <div className="flex items-start space-x-3 text-yellow-400 text-sm bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
//                       <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
//                       <div>
//                         <p className="font-medium">Withdrawal Pending</p>
//                         <p>Waiting for XLM transaction confirmation...</p>
//                       </div>
//                     </div>
//                   )}

//                   {!showInstructions ? (
//                     <button
//                       onClick={handleCryptoWithdraw}
//                       className={`w-full px-6 py-4 rounded-2xl font-semibold text-white relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${getButtonStyle()} shadow-lg hover:shadow-xl ${
//                         !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim() || isProcessing
//                           ? 'opacity-60 cursor-not-allowed'
//                           : ''
//                       }`}
//                       disabled={isProcessing || !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim()}
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
//                       <div className="relative">{getButtonContent()}</div>
//                     </button>
//                   ) : withdrawInstructions && (
//                     <div className="space-y-6 animate-fade-in">
//                       <div className={`flex items-center justify-between p-4 rounded-xl border ${getCryptoStatusColor()}`}>
//                         <div className="flex items-center space-x-3">
//                           {getCryptoStatusIcon()}
//                           <div>
//                             <span className="font-medium capitalize">
//                               {cryptoStatus === 'pending' ? 'Processing withdrawal' : cryptoStatus}
//                             </span>
//                             {lastChecked && (
//                               <div className="text-xs text-gray-400">
//                                 Last checked: {new Date(lastChecked).toLocaleTimeString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           {isMonitoring && (
//                             <button
//                               onClick={checkWithdrawStatus}
//                               className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
//                               title="Check status now"
//                             >
//                               <RefreshCw size={16} className="text-white" />
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
//                         <div className="text-center mb-4">
//                           <Wallet size={24} className="text-orange-400 mx-auto mb-2" />
//                           <h3 className="text-white font-semibold">Withdrawal in Progress</h3>
//                           <p className="text-gray-400 text-sm mt-1">
//                             Sending {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM to your wallet
//                           </p>
//                         </div>

//                         <div className="space-y-4">
//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Amount</p>
//                               <button
//                                 onClick={() => copyToClipboard(
//                                   parseFloat(withdrawInstructions.amount).toFixed(2),
//                                   'amount'
//                                 )}
//                                 className="flex items-center space-x-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
//                               >
//                                 {copiedField === 'amount' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'amount' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg">
//                               <code className="text-orange-400 font-mono text-lg font-bold">
//                                 {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Destination Address</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.destination, 'address')}
//                                 className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
//                               >
//                                 {copiedField === 'address' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'address' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg break-all">
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.destination}
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Transaction ID</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.transactionId, 'txId')}
//                                 className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
//                               >
//                                 {copiedField === 'txId' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'txId' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg break-all">
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.transactionId}
//                               </code>
//                             </div>
//                           </div>

//                           <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
//                             <p className="text-orange-300 text-xs">
//                               ⚠️ Important: Ensure the destination address is correct. Transactions on the Stellar network are irreversible.
//                             </p>
//                           </div>

//                           <div className="space-y-2">
//                             <p className="text-gray-300 text-sm font-medium">Steps</p>
//                             <ol className="list-decimal list-inside text-gray-400 text-sm space-y-1">
//                               {withdrawInstructions.instructions &&
//                                 Object.values(withdrawInstructions.instructions).map((step, index) => (
//                                   <li key={index}>{step}</li>
//                                 ))}
//                             </ol>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-300">Network</span>
//                             <span className="text-white font-medium">{withdrawInstructions.network}</span>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-300">Expires in</span>
//                             <span className="text-white font-medium">{withdrawInstructions.timeoutMinutes} minutes</span>
//                           </div>

//                           <div className="text-center">
//                             <a
//                               href={`https://stellar.expert/explorer/testnet/tx/${withdrawInstructions.transactionId}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
//                             >
//                               <ExternalLink size={16} />
//                               <span>View on Stellar Explorer</span>
//                             </a>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col space-y-3">
//                         <button
//                           onClick={() => {
//                             if (!isProcessing) {
//                               checkWithdrawStatus();
//                             }
//                           }}
//                           className={`w-full px-6 py-3 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                           }`}
//                           disabled={isProcessing}
//                         >
//                           <div className="flex items-center justify-center space-x-2">
//                             <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
//                             <span>Check Status Now</span>
//                           </div>
//                         </button>
//                         <button
//                           onClick={resetCryptoForm}
//                           className="w-full px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//                         >
//                           Cancel and Back to Withdraw
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Withdraw;



// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { 
//   MinusCircle, Wallet, AlertCircle, CheckCircle, Loader2, ArrowRight, 
//   Shield, DollarSign, Lock, TrendingUp, Zap, Copy, ExternalLink, RefreshCw 
// } from 'lucide-react';

// const Withdraw = ({ onWithdraw, balance, userId }) => {
//   const [amount, setAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
//   const [destination, setDestination] = useState('');
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [withdrawInstructions, setWithdrawInstructions] = useState(null);
//   const [cryptoStatus, setCryptoStatus] = useState('pending');
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);
//   const [lastChecked, setLastChecked] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   const inputRef = useRef(null);
//   const monitoringInterval = useRef(null);
//   const monitoringTimeout = useRef(null);

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

//   const resetCryptoForm = useCallback(() => {
//     setAmount('');
//     setDestination('');
//     setShowInstructions(false);
//     setWithdrawInstructions(null);
//     setCryptoStatus('pending');
//     setIsMonitoring(false);
//     setStatus(null);
//     setErrorMessage('');
//     setCopiedField(null);
//     setLastChecked(null);
//     setRetryCount(0);
//     setSelectedQuickAmount(null);
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   useEffect(() => {
//     resetCryptoForm();
//     return () => cleanupMonitoring();
//   }, [resetCryptoForm, cleanupMonitoring]);

//   const handleNetworkError = useCallback((error) => {
//     console.error('Transaction error:', error);
//     let userFriendlyError = 'Withdrawal failed. Please try again.';
//     if (error.message.includes('Failed to resolve') || error.message.includes('NameResolutionError')) {
//       userFriendlyError = 'Network connection failed. Please check your internet and try again.';
//     } else if (error.message.includes('Max retries exceeded')) {
//       userFriendlyError = 'Server is not responding. Please try again later.';
//     } else if (error.message.includes('timed out')) {
//       userFriendlyError = 'Request timed out. Please check your connection.';
//     }
//     setErrorMessage(userFriendlyError);
//     setStatus('error');
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   // Updated function to fetch balance from database using /users/<user_id> endpoint
//   const fetchBalance = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(`API error: ${result.message}`);
//       }
//       console.log('Fetched balance:', result.user.balance);
//       return result.user.balance; // Extract balance from { status: "success", user: { balance: 699.87, ... } }
//     } catch (error) {
//       console.error('Failed to fetch balance:', error);
//       handleNetworkError(error);
//       return null;
//     }
//   }, [userId, handleNetworkError]);

//   const checkWithdrawStatus = useCallback(async () => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('No withdrawId available for status check');
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setLastChecked(new Date());
//       console.log(`Checking status for withdrawId: ${withdrawInstructions.withdrawId}, attempt ${retryCount + 1}`);
//       const response = await fetch(`http://localhost:5000/check-withdraw-status/${withdrawInstructions.withdrawId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }

//       const result = await response.json();
//       console.log('Status response:', result);
//       if (result.status === 'success' || result.message === 'Crypto withdrawal initiated') {
//         setCryptoStatus(result.withdrawStatus || 'pending');
//         if (result.withdrawStatus === 'completed') {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} completed`);
//           // Fetch latest balance from database
//           const latestBalance = await fetchBalance();
//           if (latestBalance !== null) {
//             console.log(`Updating balance to: ${latestBalance}`);
//             onWithdraw(latestBalance);
//           } else {
//             console.warn('Falling back to local balance due to fetch failure');
//             onWithdraw(result.newBalance || balance); // Fallback if fetch fails
//           }
//           cleanupMonitoring();
//           setStatus('success');
//           setShowInstructions(false);
//           setTimeout(() => {
//             resetCryptoForm();
//           }, 2000);
//         } else if (result.withdrawStatus === 'failed') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} failed`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal failed. Please verify the transaction details or contact support.');
//           setStatus('error');
//         } else if (result.withdrawStatus === 'timeout') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} timed out`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal timed out. Please initiate a new withdrawal.');
//           setStatus('error');
//         } else {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} still pending`);
//           setStatus('pending');
//         }
//       } else {
//         if (retryCount < 10) {
//           const delay = 5000 * Math.pow(2, retryCount);
//           console.log(`Retrying status check for ${withdrawInstructions.withdrawId} in ${delay}ms`);
//           setRetryCount(prev => prev + 1);
//           setTimeout(checkWithdrawStatus, delay);
//         } else {
//           throw new Error(result.message || 'Failed to verify withdrawal status after multiple attempts.');
//         }
//       }
//     } catch (error) {
//       console.error(`Status check failed for ${withdrawInstructions.withdrawId}:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [withdrawInstructions, cleanupMonitoring, handleNetworkError, resetCryptoForm, retryCount, onWithdraw, balance, fetchBalance]);

//   const startMonitoring = useCallback(() => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('Cannot start monitoring: no withdrawId');
//       return;
//     }
//     cleanupMonitoring();
//     setIsMonitoring(true);
//     setCryptoStatus('pending');
//     setStatus('pending');
//     setRetryCount(0);
//     checkWithdrawStatus();
//     monitoringInterval.current = setInterval(checkWithdrawStatus, 5000);
//     monitoringTimeout.current = setTimeout(() => {
//       if (cryptoStatus !== 'completed') {
//         console.error(`Monitoring timed out for ${withdrawInstructions.withdrawId}`);
//         cleanupMonitoring();
//         setErrorMessage('Withdrawal verification timed out. Please check transaction status or contact support.');
//         setStatus('error');
//       }
//     }, 30 * 60 * 1000);
//   }, [withdrawInstructions, checkWithdrawStatus, cleanupMonitoring, cryptoStatus]);

//   useEffect(() => {
//     if (withdrawInstructions?.withdrawId && status === 'pending' && !isMonitoring) {
//       console.log(`Starting monitoring for withdrawId: ${withdrawInstructions.withdrawId}`);
//       startMonitoring();
//     }
//   }, [withdrawInstructions, status, isMonitoring, startMonitoring]);

//   const validateInputs = useCallback(() => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid amount greater than 0');
//       return false;
//     }
//     if (parseFloat(amount) > balance) {
//       setStatus('error');
//       setErrorMessage('Insufficient balance');
//       return false;
//     }
//     if (!userId) {
//       setStatus('error');
//       setErrorMessage('User authentication required');
//       return false;
//     }
//     if (!destination.trim()) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid wallet address');
//       return false;
//     }
//     if (!destination.startsWith('G') || destination.length !== 56) {
//       setStatus('error');
//       setErrorMessage('Invalid Stellar address');
//       return false;
//     }
//     return true;
//   }, [amount, balance, userId, destination]);

//   const handleAmountChange = useCallback((e) => {
//     setAmount(e.target.value);
//     setSelectedQuickAmount(null);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//   }, []);

//   const handleQuickAmount = useCallback((quickAmount) => {
//     setAmount(quickAmount.toString());
//     setSelectedQuickAmount(quickAmount);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//     inputRef.current?.focus();
//   }, []);

//   const copyToClipboard = useCallback(async (text, field) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       setErrorMessage('Failed to copy to clipboard');
//       setStatus('error');
//     }
//   }, []);

//   const handleCryptoWithdraw = useCallback(async () => {
//     if (!validateInputs()) return;
//     setIsProcessing(true);
//     setStatus(null);
//     setErrorMessage('');
//     try {
//       console.log('Initiating withdrawal:', { userId, amount, destination });
//       const response = await fetch('http://localhost:5000/withdraw-crypto', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, amount: parseFloat(amount), destination }),
//       });
//       const result = await response.json();
//       console.log('Full withdraw response:', result);
//       if (response.ok) {
//         if (!result.withdrawId && !result.withdraw_id) {
//           throw new Error('Missing withdrawId in response');
//         }
//         const newInstructions = {
//           amount: result.amount,
//           currency: result.currency || 'XLM',
//           network: result.network || 'Stellar',
//           destination: result.destination,
//           withdrawId: result.withdrawId || result.withdraw_id,
//           transactionId: result.transactionId || result.tx_hash,
//           instructions: result.instructions || {
//             step1: `Sending ${parseFloat(result.amount || 0).toFixed(2)} XLM to ${result.destination}`,
//             step2: 'Transaction will be processed on the Stellar network',
//             step3: 'Wait for confirmation (usually 5-10 seconds)',
//             step4: 'Funds will be credited to your wallet automatically'
//           },
//           timeoutMinutes: result.timeoutMinutes || 30,
//         };
//         console.log('Setting withdrawInstructions:', newInstructions);
//         setWithdrawInstructions(newInstructions);
//         setShowInstructions(true);
//         setStatus('pending');
//       } else {
//         throw new Error(result.message || 'Invalid withdrawal response');
//       }
//     } catch (error) {
//       console.error(`Withdrawal failed:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [userId, amount, destination, validateInputs, handleNetworkError]);

//   const getButtonStyle = useCallback(() => {
//     if (isProcessing) return 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed';
//     if (status === 'error') return 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600';
//     return 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98]';
//   }, [isProcessing, status]);

//   const getButtonContent = useCallback(() => {
//     if (isProcessing) {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <Loader2 size={20} className="animate-spin text-white/80" />
//           <span>Processing...</span>
//         </div>
//       );
//     }
//     if (status === 'error') {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <AlertCircle size={20} className="text-rose-200" />
//           <span>Try Again</span>
//         </div>
//       );
//     }
//     return (
//       <div className="flex items-center justify-center space-x-3">
//         <MinusCircle size={20} className="text-white/90" />
//         <span className="text-white font-medium">Initiate Withdrawal</span>
//         <ArrowRight size={16} className="text-white/80" />
//       </div>
//     );
//   }, [isProcessing, status]);

//   const getCryptoStatusColor = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
//       case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
//       case 'failed': case 'timeout': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
//       default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
//     }
//   }, [cryptoStatus]);

//   const getCryptoStatusIcon = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return <CheckCircle size={16} />;
//       case 'pending': return <Loader2 size={16} className="animate-spin" />;
//       case 'failed': case 'timeout': return <AlertCircle size={16} />;
//       default: return <Loader2 size={16} className="animate-spin" />;
//     }
//   }, [cryptoStatus]);

//   const quickAmounts = [25, 50, 100, 250, 500, 1000];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 lg:p-8 relative overflow-hidden">
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
//       </div>

//       <div className="relative max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen lg:min-h-0">
//           <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-2xl">
//                 <Wallet size={36} className="text-white" />
//               </div>
//               <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
//                 Crypto Withdrawal
//               </h1>
//               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
//                 Withdraw funds securely to your XLM wallet
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
//                     <Zap size={24} className="text-emerald-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Fast Processing</h3>
//                     <p className="text-gray-400 text-sm">Confirmation in seconds</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                     <Lock size={24} className="text-blue-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Secure</h3>
//                     <p className="text-gray-400 text-sm">256-bit SSL encryption</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <TrendingUp size={24} className="text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Zero Fees</h3>
//                     <p className="text-gray-400 text-sm">No hidden charges</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
//                     <Shield size={24} className="text-indigo-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-semibold text-lg">Protected</h3>
//                     <p className="text-gray-400 text-sm">Fraud protection included</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7 flex items-center justify-center">
//             <div className="w-full max-w-lg">
//               <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
//                 <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
//                 <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

//                 <div className="text-center mb-8">
//                   <h2 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h2>
//                   <p className="text-gray-400 text-sm">
//                     Current Balance: <span className="text-white font-semibold">{balance?.toFixed(2) || '0.00'} XLM</span>
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-300">
//                       Withdrawal Amount
//                     </label>
//                     <div className="relative group">
//                       <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
//                         isFocused ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-sm' : 'bg-white/5'
//                       }`} />
//                       <div className="relative">
//                         <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                           <DollarSign size={20} />
//                         </div>
//                         <input
//                           ref={inputRef}
//                           id="withdrawAmount"
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           className={`w-full pl-12 pr-20 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 text-white text-lg placeholder:text-gray-500 hover:border-white/20 rounded-2xl outline-none ${
//                             status === 'error'
//                               ? 'border-rose-400/60 ring-2 ring-rose-500/30 bg-rose-500/5'
//                               : isFocused
//                                 ? 'border-orange-400/50 ring-2 ring-orange-500/50'
//                                 : 'border-white/10'
//                           }`}
//                           placeholder="0.00"
//                           value={amount}
//                           onChange={handleAmountChange}
//                           onFocus={() => setIsFocused(true)}
//                           onBlur={() => setIsFocused(false)}
//                           disabled={isProcessing || balance <= 0}
//                         />
//                         {amount && (
//                           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
//                             XLM
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     {amount && parseFloat(amount) > 0 && (
//                       <div className="text-center py-2">
//                         <span className="text-2xl font-bold text-white">
//                           {parseFloat(amount).toFixed(2)} XLM
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <label htmlFor="destination" className="block text-sm font-medium text-gray-300">
//                       Recipient Wallet Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="destination"
//                         type="text"
//                         className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 text-white placeholder:text-gray-500 hover:border-white/20 rounded-2xl outline-none ${
//                           status === 'error' && !destination.trim()
//                             ? 'border-rose-400/60 ring-2 ring-rose-500/30 bg-rose-500/5'
//                             : 'border-white/10 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/50'
//                         }`}
//                         placeholder="G1234...ABCD"
//                         value={destination}
//                         onChange={(e) => setDestination(e.target.value)}
//                         disabled={isProcessing}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <h3 className="text-sm font-medium text-gray-300">Quick amounts</h3>
//                     <div className="grid grid-cols-3 gap-3">
//                       {quickAmounts.map((quickAmount) => (
//                         <button
//                           key={quickAmount}
//                           type="button"
//                           onClick={() => handleQuickAmount(quickAmount)}
//                           className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
//                             selectedQuickAmount === quickAmount
//                               ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
//                               : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
//                           }`}
//                           disabled={isProcessing || balance <= 0 || quickAmount > balance}
//                         >
//                           {quickAmount.toLocaleString()} XLM
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {status === 'error' && errorMessage && (
//                     <div className="flex items-start space-x-3 text-rose-400 text-sm bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
//                       <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Transaction Error</p>
//                         <p>{errorMessage}</p>
//                         <button
//                           onClick={() => {
//                             setStatus(null);
//                             setErrorMessage('');
//                           }}
//                           className="mt-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 rounded-lg text-rose-100 transition-colors"
//                         >
//                           Try Again
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'success' && (
//                     <div className="flex items-start space-x-3 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
//                       <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Withdrawal Successful</p>
//                         <p>
//                           {withdrawInstructions?.amount
//                             ? `${parseFloat(withdrawInstructions.amount).toFixed(2)} XLM successfully withdrawn!`
//                             : 'Funds sent to your wallet.'}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'pending' && cryptoStatus === 'pending' && (
//                     <div className="flex items-start space-x-3 text-yellow-400 text-sm bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
//                       <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
//                       <div>
//                         <p className="font-medium">Withdrawal Pending</p>
//                         <p>Waiting for XLM transaction confirmation...</p>
//                       </div>
//                     </div>
//                   )}

//                   {!showInstructions ? (
//                     <button
//                       onClick={handleCryptoWithdraw}
//                       className={`w-full px-6 py-4 rounded-2xl font-semibold text-white relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${getButtonStyle()} shadow-lg hover:shadow-xl ${
//                         !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim() || isProcessing
//                           ? 'opacity-60 cursor-not-allowed'
//                           : ''
//                       }`}
//                       disabled={isProcessing || !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim()}
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
//                       <div className="relative">{getButtonContent()}</div>
//                     </button>
//                   ) : withdrawInstructions && (
//                     <div className="space-y-6 animate-fade-in">
//                       <div className={`flex items-center justify-between p-4 rounded-xl border ${getCryptoStatusColor()}`}>
//                         <div className="flex items-center space-x-3">
//                           {getCryptoStatusIcon()}
//                           <div>
//                             <span className="font-medium capitalize">
//                               {cryptoStatus === 'pending' ? 'Processing withdrawal' : cryptoStatus}
//                             </span>
//                             {lastChecked && (
//                               <div className="text-xs text-gray-400">
//                                 Last checked: {new Date(lastChecked).toLocaleTimeString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           {isMonitoring && (
//                             <button
//                               onClick={checkWithdrawStatus}
//                               className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
//                               title="Check status now"
//                             >
//                               <RefreshCw size={16} className="text-white" />
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
//                         <div className="text-center mb-4">
//                           <Wallet size={24} className="text-orange-400 mx-auto mb-2" />
//                           <h3 className="text-white font-semibold">Withdrawal in Progress</h3>
//                           <p className="text-gray-400 text-sm mt-1">
//                             Sending {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM to your wallet
//                           </p>
//                         </div>

//                         <div className="space-y-4">
//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Amount</p>
//                               <button
//                                 onClick={() => copyToClipboard(
//                                   parseFloat(withdrawInstructions.amount).toFixed(2),
//                                   'amount'
//                                 )}
//                                 className="flex items-center space-x-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
//                               >
//                                 {copiedField === 'amount' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'amount' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg">
//                               <code className="text-orange-400 font-mono text-lg font-bold">
//                                 {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Destination Address</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.destination, 'address')}
//                                 className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
//                               >
//                                 {copiedField === 'address' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'address' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg break-all">
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.destination}
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className="text-gray-300 text-sm">Transaction ID</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.transactionId, 'txId')}
//                                 className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
//                               >
//                                 {copiedField === 'txId' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'txId' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className="bg-black/30 px-4 py-3 rounded-lg break-all">
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.transactionId}
//                               </code>
//                             </div>
//                           </div>

//                           <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
//                             <p className="text-orange-300 text-xs">
//                               ⚠️ Important: Ensure the destination address is correct. Transactions on the Stellar network are irreversible.
//                             </p>
//                           </div>

//                           <div className="space-y-2">
//                             <p className="text-gray-300 text-sm font-medium">Steps</p>
//                             <ol className="list-decimal list-inside text-gray-400 text-sm space-y-1">
//                               {withdrawInstructions.instructions &&
//                                 Object.values(withdrawInstructions.instructions).map((step, index) => (
//                                   <li key={index}>{step}</li>
//                                 ))}
//                             </ol>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-300">Network</span>
//                             <span className="text-white font-medium">{withdrawInstructions.network}</span>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-gray-300">Expires in</span>
//                             <span className="text-white font-medium">{withdrawInstructions.timeoutMinutes} minutes</span>
//                           </div>

//                           <div className="text-center">
//                             <a
//                               href={`https://stellar.expert/explorer/testnet/tx/${withdrawInstructions.transactionId}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
//                             >
//                               <ExternalLink size={16} />
//                               <span>View on Stellar Explorer</span>
//                             </a>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col space-y-3">
//                         <button
//                           onClick={() => {
//                             if (!isProcessing) {
//                               checkWithdrawStatus();
//                             }
//                           }}
//                           className={`w-full px-6 py-3 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                           }`}
//                           disabled={isProcessing}
//                         >
//                           <div className="flex items-center justify-center space-x-2">
//                             <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
//                             <span>Check Status Now</span>
//                           </div>
//                         </button>
//                         <button
//                           onClick={resetCryptoForm}
//                           className="w-full px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//                         >
//                           Cancel and Back to Withdraw
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Withdraw;





// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { 
//   MinusCircle, Wallet, AlertCircle, CheckCircle, Loader2, ArrowRight, 
//   Shield, DollarSign, Lock, TrendingUp, Zap, Copy, ExternalLink, RefreshCw 
// } from 'lucide-react';

// const Withdraw = ({ onWithdraw, balance, userId, isDarkMode = true }) => {
//   const [amount, setAmount] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
//   const [destination, setDestination] = useState('');
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [withdrawInstructions, setWithdrawInstructions] = useState(null);
//   const [cryptoStatus, setCryptoStatus] = useState('pending');
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [copiedField, setCopiedField] = useState(null);
//   const [lastChecked, setLastChecked] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   const inputRef = useRef(null);
//   const monitoringInterval = useRef(null);
//   const monitoringTimeout = useRef(null);

//   const themeStyles = {
//     dark: {
//       background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
//       container: 'bg-white/5 backdrop-blur-xl',
//       containerBorder: 'border-white/10',
//       textPrimary: 'text-white',
//       textSecondary: 'text-gray-300',
//       textMuted: 'text-gray-400',
//       textAccent: 'text-orange-400',
//       cardBg: 'bg-white/5 backdrop-blur-sm',
//       cardBorder: 'border-white/10',
//       inputBg: 'bg-white/5 backdrop-blur-sm',
//       inputBorder: 'border-white/10',
//       inputPlaceholder: 'placeholder-gray-500',
//       buttonBg: 'bg-gradient-to-r from-orange-600 to-red-600',
//       buttonHover: 'hover:from-orange-500 hover:to-red-500',
//       secondaryButtonBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
//       secondaryButtonHover: 'hover:from-gray-500 hover:to-gray-600',
//       successBg: 'bg-emerald-500/10 border-emerald-500/20',
//       successText: 'text-emerald-400',
//       errorBg: 'bg-rose-500/10 border-rose-500/20',
//       errorText: 'text-rose-400',
//       warningBg: 'bg-yellow-500/10 border-yellow-500/20',
//       warningText: 'text-yellow-400',
//       copyButtonBg: 'bg-white/5 hover:bg-white/10',
//       quickAmountBg: 'bg-white/5',
//       quickAmountHover: 'hover:bg-white/10 hover:border-white/20',
//       quickAmountSelected: 'bg-gradient-to-r from-orange-500 to-red-500',
//       shadow: 'shadow-2xl',
//     },
//     light: {
//       background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
//       container: 'bg-white/80 backdrop-blur-lg',
//       containerBorder: 'border-gray-200/50',
//       textPrimary: 'text-gray-900',
//       textSecondary: 'text-gray-600',
//       textMuted: 'text-gray-500',
//       textAccent: 'text-orange-600',
//       cardBg: 'bg-gray-50/50',
//       cardBorder: 'border-gray-200/50',
//       inputBg: 'bg-white/50',
//       inputBorder: 'border-gray-300',
//       inputPlaceholder: 'placeholder-gray-500',
//       buttonBg: 'bg-gradient-to-r from-orange-500 to-red-500',
//       buttonHover: 'hover:from-orange-400 hover:to-red-400',
//       secondaryButtonBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
//       secondaryButtonHover: 'hover:from-gray-400 hover:to-gray-500',
//       successBg: 'bg-emerald-100/50 border-emerald-200/50',
//       successText: 'text-emerald-600',
//       errorBg: 'bg-rose-100/50 border-rose-200/50',
//       errorText: 'text-rose-600',
//       warningBg: 'bg-yellow-100/50 border-yellow-200/50',
//       warningText: 'text-yellow-600',
//       copyButtonBg: 'bg-gray-100/50 hover:bg-gray-200/50',
//       quickAmountBg: 'bg-gray-50',
//       quickAmountHover: 'hover:bg-gray-100 hover:border-gray-300',
//       quickAmountSelected: 'bg-gradient-to-r from-orange-400 to-red-400',
//       shadow: 'shadow-xl',
//     }
//   };

//   const themeKey = isDarkMode ? 'dark' : 'light';
//   const currentTheme = themeStyles[themeKey] || themeStyles.dark;

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

//   const resetCryptoForm = useCallback(() => {
//     setAmount('');
//     setDestination('');
//     setShowInstructions(false);
//     setWithdrawInstructions(null);
//     setCryptoStatus('pending');
//     setIsMonitoring(false);
//     setStatus(null);
//     setErrorMessage('');
//     setCopiedField(null);
//     setLastChecked(null);
//     setRetryCount(0);
//     setSelectedQuickAmount(null);
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   useEffect(() => {
//     resetCryptoForm();
//     return () => cleanupMonitoring();
//   }, [resetCryptoForm, cleanupMonitoring]);

//   const handleNetworkError = useCallback((error) => {
//     console.error('Transaction error:', error);
//     let userFriendlyError = 'Withdrawal failed. Please try again.';
//     if (error.message.includes('Failed to resolve') || error.message.includes('NameResolutionError')) {
//       userFriendlyError = 'Network connection failed. Please check your internet and try again.';
//     } else if (error.message.includes('Max retries exceeded')) {
//       userFriendlyError = 'Server is not responding. Please try again later.';
//     } else if (error.message.includes('timed out')) {
//       userFriendlyError = 'Request timed out. Please check your connection.';
//     }
//     setErrorMessage(userFriendlyError);
//     setStatus('error');
//     cleanupMonitoring();
//   }, [cleanupMonitoring]);

//   const fetchBalance = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }
//       const result = await response.json();
//       if (result.status !== 'success') {
//         throw new Error(`API error: ${result.message}`);
//       }
//       console.log('Fetched balance:', result.user.balance);
//       return result.user.balance;
//     } catch (error) {
//       console.error('Failed to fetch balance:', error);
//       handleNetworkError(error);
//       return null;
//     }
//   }, [userId, handleNetworkError]);

//   const checkWithdrawStatus = useCallback(async () => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('No withdrawId available for status check');
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setLastChecked(new Date());
//       console.log(`Checking status for withdrawId: ${withdrawInstructions.withdrawId}, attempt ${retryCount + 1}`);
//       const response = await fetch(`http://localhost:5000/check-withdraw-status/${withdrawInstructions.withdrawId}`);
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status} - ${await response.text()}`);
//       }

//       const result = await response.json();
//       console.log('Status response:', result);
//       if (result.status === 'success' || result.message === 'Crypto withdrawal initiated') {
//         setCryptoStatus(result.withdrawStatus || 'pending');
//         if (result.withdrawStatus === 'completed') {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} completed`);
//           const latestBalance = await fetchBalance();
//           if (latestBalance !== null) {
//             console.log(`Updating balance to: ${latestBalance}`);
//             onWithdraw(latestBalance);
//           } else {
//             console.warn('Falling back to local balance due to fetch failure');
//             onWithdraw(result.newBalance || balance);
//           }
//           cleanupMonitoring();
//           setStatus('success');
//           setShowInstructions(false);
//           setTimeout(() => {
//             resetCryptoForm();
//           }, 2000);
//         } else if (result.withdrawStatus === 'failed') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} failed`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal failed. Please verify the transaction details or contact support.');
//           setStatus('error');
//         } else if (result.withdrawStatus === 'timeout') {
//           console.error(`Withdrawal ${withdrawInstructions.withdrawId} timed out`);
//           cleanupMonitoring();
//           setErrorMessage('Withdrawal timed out. Please initiate a new withdrawal.');
//           setStatus('error');
//         } else {
//           console.log(`Withdrawal ${withdrawInstructions.withdrawId} still pending`);
//           setStatus('pending');
//         }
//       } else {
//         if (retryCount < 10) {
//           const delay = 5000 * Math.pow(2, retryCount);
//           console.log(`Retrying status check for ${withdrawInstructions.withdrawId} in ${delay}ms`);
//           setRetryCount(prev => prev + 1);
//           setTimeout(checkWithdrawStatus, delay);
//         } else {
//           throw new Error(result.message || 'Failed to verify withdrawal status after multiple attempts.');
//         }
//       }
//     } catch (error) {
//       console.error(`Status check failed for ${withdrawInstructions.withdrawId}:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [withdrawInstructions, cleanupMonitoring, handleNetworkError, resetCryptoForm, retryCount, onWithdraw, balance, fetchBalance]);

//   const startMonitoring = useCallback(() => {
//     if (!withdrawInstructions?.withdrawId) {
//       console.warn('Cannot start monitoring: no withdrawId');
//       return;
//     }
//     cleanupMonitoring();
//     setIsMonitoring(true);
//     setCryptoStatus('pending');
//     setStatus('pending');
//     setRetryCount(0);
//     checkWithdrawStatus();
//     monitoringInterval.current = setInterval(checkWithdrawStatus, 5000);
//     monitoringTimeout.current = setTimeout(() => {
//       if (cryptoStatus !== 'completed') {
//         console.error(`Monitoring timed out for ${withdrawInstructions.withdrawId}`);
//         cleanupMonitoring();
//         setErrorMessage('Withdrawal verification timed out. Please check transaction status or contact support.');
//         setStatus('error');
//       }
//     }, 30 * 60 * 1000);
//   }, [withdrawInstructions, checkWithdrawStatus, cleanupMonitoring, cryptoStatus]);

//   useEffect(() => {
//     if (withdrawInstructions?.withdrawId && status === 'pending' && !isMonitoring) {
//       console.log(`Starting monitoring for withdrawId: ${withdrawInstructions.withrowId}`);
//       startMonitoring();
//     }
//   }, [withdrawInstructions, status, isMonitoring, startMonitoring]);

//   const validateInputs = useCallback(() => {
//     if (!amount || parseFloat(amount) <= 0) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid amount greater than 0');
//       return false;
//     }
//     if (parseFloat(amount) > balance) {
//       setStatus('error');
//       setErrorMessage('Insufficient balance');
//       return false;
//     }
//     if (!userId) {
//       setStatus('error');
//       setErrorMessage('User authentication required');
//       return false;
//     }
//     if (!destination.trim()) {
//       setStatus('error');
//       setErrorMessage('Please enter a valid wallet address');
//       return false;
//     }
//     if (!destination.startsWith('G') || destination.length !== 56) {
//       setStatus('error');
//       setErrorMessage('Invalid Stellar address');
//       return false;
//     }
//     return true;
//   }, [amount, balance, userId, destination]);

//   const handleAmountChange = useCallback((e) => {
//     setAmount(e.target.value);
//     setSelectedQuickAmount(null);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//   }, []);

//   const handleQuickAmount = useCallback((quickAmount) => {
//     setAmount(quickAmount.toString());
//     setSelectedQuickAmount(quickAmount);
//     setErrorMessage('');
//     setStatus(null);
//     setShowInstructions(false);
//     inputRef.current?.focus();
//   }, []);

//   const copyToClipboard = useCallback(async (text, field) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(field);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       setErrorMessage('Failed to copy to clipboard');
//       setStatus('error');
//     }
//   }, []);

//   const handleCryptoWithdraw = useCallback(async () => {
//     if (!validateInputs()) return;
//     setIsProcessing(true);
//     setStatus(null);
//     setErrorMessage('');
//     try {
//       console.log('Initiating withdrawal:', { userId, amount, destination });
//       const response = await fetch('http://localhost:5000/withdraw-crypto', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, amount: parseFloat(amount), destination }),
//       });
//       const result = await response.json();
//       console.log('Full withdraw response:', result);
//       if (response.ok) {
//         if (!result.withdrawId && !result.withdraw_id) {
//           throw new Error('Missing withdrawId in response');
//         }
//         const newInstructions = {
//           amount: result.amount,
//           currency: result.currency || 'XLM',
//           network: result.network || 'Stellar',
//           destination: result.destination,
//           withdrawId: result.withdrawId || result.withdraw_id,
//           transactionId: result.transactionId || result.tx_hash,
//           instructions: result.instructions || {
//             step1: `Sending ${parseFloat(result.amount || 0).toFixed(2)} XLM to ${result.destination}`,
//             step2: 'Transaction will be processed on the Stellar network',
//             step3: 'Wait for confirmation (usually 5-10 seconds)',
//             step4: 'Funds will be credited to your wallet automatically'
//           },
//           timeoutMinutes: result.timeoutMinutes || 30,
//         };
//         console.log('Setting withdrawInstructions:', newInstructions);
//         setWithdrawInstructions(newInstructions);
//         setShowInstructions(true);
//         setStatus('pending');
//       } else {
//         throw new Error(result.message || 'Invalid withdrawal response');
//       }
//     } catch (error) {
//       console.error(`Withdrawal failed:`, error);
//       handleNetworkError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [userId, amount, destination, validateInputs, handleNetworkError]);

//   const getButtonStyle = useCallback(() => {
//     if (isProcessing) return 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed';
//     if (status === 'error') return currentTheme.buttonBg + ' ' + currentTheme.buttonHover;
//     return currentTheme.buttonBg + ' ' + currentTheme.buttonHover + ' active:scale-[0.98]';
//   }, [isProcessing, status, currentTheme]);

//   const getButtonContent = useCallback(() => {
//     if (isProcessing) {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <Loader2 size={20} className="animate-spin" />
//           <span>Processing...</span>
//         </div>
//       );
//     }
//     if (status === 'error') {
//       return (
//         <div className="flex items-center justify-center space-x-3">
//           <AlertCircle size={20} className={currentTheme.errorText} />
//           <span>Try Again</span>
//         </div>
//       );
//     }
//     return (
//       <div className="flex items-center justify-center space-x-3">
//         <MinusCircle size={20} />
//         <span className="font-medium">Initiate Withdrawal</span>
//         <ArrowRight size={16} />
//       </div>
//     );
//   }, [isProcessing, status, currentTheme]);

//   const getCryptoStatusColor = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return currentTheme.successBg + ' ' + currentTheme.successText;
//       case 'pending': return currentTheme.warningBg + ' ' + currentTheme.warningText;
//       case 'failed': case 'timeout': return currentTheme.errorBg + ' ' + currentTheme.errorText;
//       default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
//     }
//   }, [cryptoStatus, currentTheme]);

//   const getCryptoStatusIcon = useCallback(() => {
//     switch (cryptoStatus) {
//       case 'completed': return <CheckCircle size={16} />;
//       case 'pending': return <Loader2 size={16} className="animate-spin" />;
//       case 'failed': case 'timeout': return <AlertCircle size={16} />;
//       default: return <Loader2 size={16} className="animate-spin" />;
//     }
//   }, [cryptoStatus]);

//   const quickAmounts = [25, 50, 100, 250, 500, 1000];

//   return (
//     <div className={`min-h-screen ${currentTheme.background} p-4 lg:p-8 relative overflow-hidden`}>
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
//       </div>

//       <div className="relative max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen lg:min-h-0">
//           <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
//             <div className="text-center lg:text-left">
//               <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${currentTheme.buttonBg} mb-6 ${currentTheme.shadow}`}>
//                 <Wallet size={36} className={currentTheme.textPrimary} />
//               </div>
//               <h1 className={`text-4xl lg:text-5xl font-bold ${currentTheme.textPrimary} mb-4 leading-tight`}>
//                 Crypto Withdrawal
//               </h1>
//               <p className={`text-xl ${currentTheme.textSecondary} mb-8 leading-relaxed`}>
//                 Withdraw funds securely to your XLM wallet
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
//               <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-12 h-12 ${currentTheme.successBg} rounded-xl flex items-center justify-center`}>
//                     <Zap size={24} className={currentTheme.successText} />
//                   </div>
//                   <div>
//                     <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Fast Processing</h3>
//                     <p className={`${currentTheme.textMuted} text-sm`}>Confirmation in seconds</p>
//                   </div>
//                 </div>
//               </div>
//               <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center`}>
//                     <Lock size={24} className="text-blue-400" />
//                   </div>
//                   <div>
//                     <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Secure</h3>
//                     <p className={`${currentTheme.textMuted} text-sm`}>256-bit SSL encryption</p>
//                   </div>
//                 </div>
//               </div>
//               <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center`}>
//                     <TrendingUp size={24} className="text-purple-400" />
//                   </div>
//                   <div>
//                     <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Zero Fees</h3>
//                     <p className={`${currentTheme.textMuted} text-sm`}>No hidden charges</p>
//                   </div>
//                 </div>
//               </div>
//               <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
//                 <div className="flex items-center space-x-4">
//                   <div className={`w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center`}>
//                     <Shield size={24} className="text-indigo-400" />
//                   </div>
//                   <div>
//                     <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Protected</h3>
//                     <p className={`${currentTheme.textMuted} text-sm`}>Fraud protection included</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-7 flex items-center justify-center">
//             <div className="w-full max-w-lg">
//               <div className={`relative ${currentTheme.container} ${currentTheme.containerBorder} rounded-3xl p-8 ${currentTheme.shadow}`}>
//                 <div className={`absolute -top-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/20 to-transparent'}`} />
//                 <div className={`absolute -bottom-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/10 to-transparent'}`} />

//                 <div className="text-center mb-8">
//                   <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-2`}>Withdraw Funds</h2>
//                   <p className={`${currentTheme.textMuted} text-sm`}>
//                     Current Balance: <span className={`${currentTheme.textPrimary} font-semibold`}>{balance?.toFixed(2) || '0.00'} XLM</span>
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <label htmlFor="withdrawAmount" className={`block text-sm font-medium ${currentTheme.textSecondary}`}>
//                       Withdrawal Amount
//                     </label>
//                     <div className="relative group">
//                       <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
//                         isFocused ? currentTheme.buttonBg + '/20 blur-sm' : currentTheme.inputBg
//                       }`} />
//                       <div className="relative">
//                         <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted}`}>
//                           <DollarSign size={20} />
//                         </div>
//                         <input
//                           ref={inputRef}
//                           id="withdrawAmount"
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           className={`w-full pl-12 pr-20 py-4 ${currentTheme.inputBg} ${currentTheme.inputBorder} transition-all duration-300 ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} text-lg rounded-2xl outline-none ${
//                             status === 'error'
//                               ? currentTheme.errorBg + ' ring-2 ring-rose-500/30'
//                               : isFocused
//                                 ? currentTheme.inputBorder + '/50 ring-2 ring-orange-500/50'
//                                 : currentTheme.inputBorder
//                           }`}
//                           placeholder="0.00"
//                           value={amount}
//                           onChange={handleAmountChange}
//                           onFocus={() => setIsFocused(true)}
//                           onBlur={() => setIsFocused(false)}
//                           disabled={isProcessing || balance <= 0}
//                         />
//                         {amount && (
//                           <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted} text-sm font-medium`}>
//                             XLM
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     {amount && parseFloat(amount) > 0 && (
//                       <div className="text-center py-2">
//                         <span className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
//                           {parseFloat(amount).toFixed(2)} XLM
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     <label htmlFor="destination" className={`block text-sm font-medium ${currentTheme.textSecondary}`}>
//                       Recipient Wallet Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="destination"
//                         type="text"
//                         className={`w-full px-4 py-4 ${currentTheme.inputBg} ${currentTheme.inputBorder} transition-all duration-300 ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} rounded-2xl outline-none ${
//                           status === 'error' && !destination.trim()
//                             ? currentTheme.errorBg + ' ring-2 ring-rose-500/30'
//                             : currentTheme.inputBorder + ' focus:ring-2 focus:ring-emerald-500/50'
//                         }`}
//                         placeholder="G1234...ABCD"
//                         value={destination}
//                         onChange={(e) => setDestination(e.target.value)}
//                         disabled={isProcessing}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Quick amounts</h3>
//                     <div className="grid grid-cols-3 gap-3">
//                       {quickAmounts.map((quickAmount) => (
//                         <button
//                           key={quickAmount}
//                           type="button"
//                           onClick={() => handleQuickAmount(quickAmount)}
//                           className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
//                             selectedQuickAmount === quickAmount
//                               ? currentTheme.quickAmountSelected + ' ' + currentTheme.textPrimary + ' shadow-lg'
//                               : currentTheme.quickAmountBg + ' ' + currentTheme.textSecondary + ' ' + currentTheme.cardBorder + ' ' + currentTheme.quickAmountHover
//                           } ${isProcessing || balance <= 0 || quickAmount > balance ? 'opacity-50 cursor-not-allowed' : ''}`}
//                           disabled={isProcessing || balance <= 0 || quickAmount > balance}
//                         >
//                           {quickAmount.toLocaleString()} XLM
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {status === 'error' && errorMessage && (
//                     <div className={`flex items-start space-x-3 ${currentTheme.errorText} text-sm ${currentTheme.errorBg} rounded-xl p-4`}>
//                       <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Transaction Error</p>
//                         <p>{errorMessage}</p>
//                         <button
//                           onClick={() => {
//                             setStatus(null);
//                             setErrorMessage('');
//                           }}
//                           className="mt-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 rounded-lg text-rose-100 transition-colors"
//                         >
//                           Try Again
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'success' && (
//                     <div className={`flex items-start space-x-3 ${currentTheme.successText} text-sm ${currentTheme.successBg} rounded-xl p-4`}>
//                       <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Withdrawal Successful</p>
//                         <p>
//                           {withdrawInstructions?.amount
//                             ? `${parseFloat(withdrawInstructions.amount).toFixed(2)} XLM successfully withdrawn!`
//                             : 'Funds sent to your wallet.'}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {status === 'pending' && cryptoStatus === 'pending' && (
//                     <div className={`flex items-start space-x-3 ${currentTheme.warningText} text-sm ${currentTheme.warningBg} rounded-xl p-4`}>
//                       <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
//                       <div>
//                         <p className="font-medium">Withdrawal Pending</p>
//                         <p>Waiting for XLM transaction confirmation...</p>
//                       </div>
//                     </div>
//                   )}

//                   {!showInstructions ? (
//                     <button
//                       onClick={handleCryptoWithdraw}
//                       className={`w-full px-6 py-4 rounded-2xl font-semibold ${currentTheme.textPrimary} relative overflow-hidden transition-all duration-300 ${currentTheme.shadow} transform hover:scale-[1.02] ${getButtonStyle()} ${
//                         !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim() || isProcessing
//                           ? 'opacity-60 cursor-not-allowed'
//                           : ''
//                       }`}
//                       disabled={isProcessing || !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim()}
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
//                       <div className="relative">{getButtonContent()}</div>
//                     </button>
//                   ) : withdrawInstructions && (
//                     <div className="space-y-6 animate-fade-in">
//                       <div className={`flex items-center justify-between p-4 rounded-xl border ${getCryptoStatusColor()}`}>
//                         <div className="flex items-center space-x-3">
//                           {getCryptoStatusIcon()}
//                           <div>
//                             <span className={`font-medium capitalize ${currentTheme.textPrimary}`}>
//                               {cryptoStatus === 'pending' ? 'Processing withdrawal' : cryptoStatus}
//                             </span>
//                             {lastChecked && (
//                               <div className={`${currentTheme.textMuted} text-xs`}>
//                                 Last checked: {new Date(lastChecked).toLocaleTimeString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           {isMonitoring && (
//                             <button
//                               onClick={checkWithdrawStatus}
//                               className={`p-2 rounded-lg ${currentTheme.copyButtonBg} transition-colors`}
//                               title="Check status now"
//                             >
//                               <RefreshCw size={16} className={currentTheme.textPrimary} />
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-2xl`}>
//                         <div className="text-center mb-4">
//                           <Wallet size={24} className={currentTheme.textAccent + ' mx-auto mb-2'} />
//                           <h3 className={`${currentTheme.textPrimary} font-semibold`}>Withdrawal in Progress</h3>
//                           <p className={`${currentTheme.textMuted} text-sm mt-1`}>
//                             Sending {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM to your wallet
//                           </p>
//                         </div>

//                         <div className="space-y-4">
//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className={`${currentTheme.textSecondary} text-sm`}>Amount</p>
//                               <button
//                                 onClick={() => copyToClipboard(
//                                   parseFloat(withdrawInstructions.amount).toFixed(2),
//                                   'amount'
//                                 )}
//                                 className={`flex items-center space-x-1 text-xs ${currentTheme.textAccent} hover:text-opacity-80 transition-colors`}
//                               >
//                                 {copiedField === 'amount' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'amount' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg`}>
//                               <code className={`${currentTheme.textAccent} font-mono text-lg font-bold`}>
//                                 {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className={`${currentTheme.textSecondary} text-sm`}>Destination Address</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.destination, 'address')}
//                                 className={`flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors`}
//                               >
//                                 {copiedField === 'address' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'address' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg break-all`}>
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.destination}
//                               </code>
//                             </div>
//                           </div>

//                           <div>
//                             <div className="flex items-center justify-between mb-2">
//                               <p className={`${currentTheme.textSecondary} text-sm`}>Transaction ID</p>
//                               <button
//                                 onClick={() => copyToClipboard(withdrawInstructions.transactionId, 'txId')}
//                                 className={`flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors`}
//                               >
//                                 {copiedField === 'txId' ? <CheckCircle size={12} /> : <Copy size={12} />}
//                                 <span>{copiedField === 'txId' ? 'Copied!' : 'Copy'}</span>
//                               </button>
//                             </div>
//                             <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg break-all`}>
//                               <code className="text-blue-400 font-mono text-sm">
//                                 {withdrawInstructions.transactionId}
//                               </code>
//                             </div>
//                           </div>

//                           <div className={`${currentTheme.warningBg} ${currentTheme.warningText} rounded-lg p-3`}>
//                             <p className="text-xs">
//                               ⚠️ Important: Ensure the destination address is correct. Transactions on the Stellar network are irreversible.
//                             </p>
//                           </div>

//                           <div className="space-y-2">
//                             <p className={`${currentTheme.textSecondary} text-sm font-medium`}>Steps</p>
//                             <ol className={`list-decimal list-inside ${currentTheme.textMuted} text-sm space-y-1`}>
//                               {withdrawInstructions.instructions &&
//                                 Object.values(withdrawInstructions.instructions).map((step, index) => (
//                                   <li key={index}>{step}</li>
//                                 ))}
//                             </ol>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className={currentTheme.textSecondary}>Network</span>
//                             <span className={`${currentTheme.textPrimary} font-medium`}>{withdrawInstructions.network}</span>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className={currentTheme.textSecondary}>Expires in</span>
//                             <span className={`${currentTheme.textPrimary} font-medium`}>{withdrawInstructions.timeoutMinutes} minutes</span>
//                           </div>

//                           <div className="text-center">
//                             <a
//                               href={`https://stellar.expert/explorer/testnet/tx/${withdrawInstructions.transactionId}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className={`inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors`}
//                             >
//                               <ExternalLink size={16} />
//                               <span>View on Stellar Explorer</span>
//                             </a>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col space-y-3">
//                         <button
//                           onClick={() => {
//                             if (!isProcessing) {
//                               checkWithdrawStatus();
//                             }
//                           }}
//                           className={`w-full px-6 py-3 rounded-2xl font-semibold ${currentTheme.textPrimary} bg-blue-600 hover:bg-blue-500 transition-colors ${currentTheme.shadow} ${
//                             isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                           }`}
//                           disabled={isProcessing}
//                         >
//                           <div className="flex items-center justify-center space-x-2">
//                             <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
//                             <span>Check Status Now</span>
//                           </div>
//                         </button>
//                         <button
//                           onClick={resetCryptoForm}
//                           className={`w-full px-6 py-3 rounded-2xl font-semibold ${currentTheme.textPrimary} ${currentTheme.secondaryButtonBg} ${currentTheme.secondaryButtonHover} transition-all duration-300 ${currentTheme.shadow} transform hover:scale-[1.02]`}
//                         >
//                           Cancel and Back to Withdraw
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Withdraw;










import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  MinusCircle, Wallet, AlertCircle, CheckCircle, Loader2, ArrowRight, 
  Shield, DollarSign, Lock, TrendingUp, Zap, Copy, ExternalLink, RefreshCw, Home 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Withdraw = ({ onWithdraw, balance, userId, isDarkMode = true }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [destination, setDestination] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [withdrawInstructions, setWithdrawInstructions] = useState(null);
  const [cryptoStatus, setCryptoStatus] = useState('pending');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const inputRef = useRef(null);
  const monitoringInterval = useRef(null);
  const monitoringTimeout = useRef(null);
  const navigate = useNavigate();

  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
      container: 'bg-white/5 backdrop-blur-xl',
      containerBorder: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      textAccent: 'text-orange-400',
      cardBg: 'bg-white/5 backdrop-blur-sm',
      cardBorder: 'border-white/10',
      inputBg: 'bg-white/5 backdrop-blur-sm',
      inputBorder: 'border-white/10',
      inputPlaceholder: 'placeholder-gray-500',
      buttonBg: 'bg-gradient-to-r from-orange-600 to-red-600',
      buttonHover: 'hover:from-orange-500 hover:to-red-500',
      secondaryButtonBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
      secondaryButtonHover: 'hover:from-gray-500 hover:to-gray-600',
      successBg: 'bg-emerald-500/10 border-emerald-500/20',
      successText: 'text-emerald-400',
      errorBg: 'bg-rose-500/10 border-rose-500/20',
      errorText: 'text-rose-400',
      warningBg: 'bg-yellow-500/10 border-yellow-500/20',
      warningText: 'text-yellow-400',
      copyButtonBg: 'bg-white/5 hover:bg-white/10',
      quickAmountBg: 'bg-white/5',
      quickAmountHover: 'hover:bg-white/10 hover:border-white/20',
      quickAmountSelected: 'bg-gradient-to-r from-orange-500 to-red-500',
      shadow: 'shadow-2xl',
    },
    light: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      container: 'bg-white/80 backdrop-blur-lg',
      containerBorder: 'border-gray-200/50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      textAccent: 'text-orange-600',
      cardBg: 'bg-gray-50/50',
      cardBorder: 'border-gray-200/50',
      inputBg: 'bg-white/50',
      inputBorder: 'border-gray-300',
      inputPlaceholder: 'placeholder-gray-500',
      buttonBg: 'bg-gradient-to-r from-orange-500 to-red-500',
      buttonHover: 'hover:from-orange-400 hover:to-red-400',
      secondaryButtonBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      secondaryButtonHover: 'hover:from-gray-400 hover:to-gray-500',
      successBg: 'bg-emerald-100/50 border-emerald-200/50',
      successText: 'text-emerald-600',
      errorBg: 'bg-rose-100/50 border-rose-200/50',
      errorText: 'text-rose-600',
      warningBg: 'bg-yellow-100/50 border-yellow-200/50',
      warningText: 'text-yellow-600',
      copyButtonBg: 'bg-gray-100/50 hover:bg-gray-200/50',
      quickAmountBg: 'bg-gray-50',
      quickAmountHover: 'hover:bg-gray-100 hover:border-gray-300',
      quickAmountSelected: 'bg-gradient-to-r from-orange-400 to-red-400',
      shadow: 'shadow-xl',
    }
  };

  const themeKey = isDarkMode ? 'dark' : 'light';
  const currentTheme = themeStyles[themeKey] || themeStyles.dark;

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

  const resetCryptoForm = useCallback(() => {
    setAmount('');
    setDestination('');
    setShowInstructions(false);
    setWithdrawInstructions(null);
    setCryptoStatus('pending');
    setIsMonitoring(false);
    setStatus(null);
    setErrorMessage('');
    setCopiedField(null);
    setLastChecked(null);
    setRetryCount(0);
    setSelectedQuickAmount(null);
    setShowConfirmationDialog(false);
    cleanupMonitoring();
  }, [cleanupMonitoring]);

  useEffect(() => {
    resetCryptoForm();
    return () => cleanupMonitoring();
  }, [resetCryptoForm, cleanupMonitoring]);

  const handleNetworkError = useCallback((error) => {
    console.error('Transaction error:', error);
    let userFriendlyError = 'Withdrawal failed. Please try again.';
    if (error.message.includes('Failed to resolve') || error.message.includes('NameResolutionError')) {
      userFriendlyError = 'Network connection failed. Please check your internet and try again.';
    } else if (error.message.includes('Max retries exceeded')) {
      userFriendlyError = 'Server is not responding. Please try again later.';
    } else if (error.message.includes('timed out')) {
      userFriendlyError = 'Request timed out. Please check your connection.';
    }
    setErrorMessage(userFriendlyError);
    setStatus('error');
    cleanupMonitoring();
  }, [cleanupMonitoring]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${await response.text()}`);
      }
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(`API error: ${result.message}`);
      }
      console.log('Fetched balance:', result.user.balance);
      return result.user.balance;
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      handleNetworkError(error);
      return null;
    }
  }, [userId, handleNetworkError]);

  const checkWithdrawStatus = useCallback(async (manualCheck = false) => {
    if (!withdrawInstructions?.withdrawId) {
      console.warn('No withdrawId available for status check');
      return;
    }

    try {
      setIsProcessing(true);
      setLastChecked(new Date());
      console.log(`Checking status for withdrawId: ${withdrawInstructions.withdrawId}, attempt ${retryCount + 1}`);
      const response = await fetch(`http://localhost:5000/check-withdraw-status/${withdrawInstructions.withdrawId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${await response.text()}`);
      }

      const result = await response.json();
      console.log('Status response:', result);
      if (result.status === 'success') {
        setCryptoStatus(result.withdrawStatus || 'pending');
        if (result.withdrawStatus === 'completed') {
          console.log(`Withdrawal ${withdrawInstructions.withdrawId} completed`);
          const latestBalance = await fetchBalance();
          if (latestBalance !== null) {
            console.log(`Updating balance to: ${latestBalance}`);
            onWithdraw(latestBalance);
          } else {
            console.warn('Falling back to local balance due to fetch failure');
            onWithdraw(result.newBalance || balance);
          }
          cleanupMonitoring();
          setStatus('success');
          setShowInstructions(false);
          setShowConfirmationDialog(true);
        } else if (result.withdrawStatus === 'failed') {
          console.error(`Withdrawal ${withdrawInstructions.withdrawId} failed`);
          cleanupMonitoring();
          setErrorMessage('Withdrawal failed. Please verify the transaction details or contact support.');
          setStatus('error');
        } else if (result.withdrawStatus === 'timeout') {
          console.error(`Withdrawal ${withdrawInstructions.withdrawId} timed out`);
          cleanupMonitoring();
          setErrorMessage('Withdrawal timed out. Please initiate a new withdrawal.');
          setStatus('error');
        } else {
          console.log(`Withdrawal ${withdrawInstructions.withdrawId} still pending`);
          setStatus('pending');
          if (!manualCheck && retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => checkWithdrawStatus(false), 5000);
          }
        }
      } else {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          if (!manualCheck) {
            setTimeout(() => checkWithdrawStatus(false), 5000);
          }
        } else {
          throw new Error(result.message || 'Failed to verify withdrawal status after multiple attempts.');
        }
      }
    } catch (error) {
      console.error(`Status check failed for ${withdrawInstructions.withdrawId}:`, error);
      handleNetworkError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [withdrawInstructions, cleanupMonitoring, handleNetworkError, retryCount, onWithdraw, balance, fetchBalance]);

  const startMonitoring = useCallback(() => {
    if (!withdrawInstructions?.withdrawId) {
      console.warn('Cannot start monitoring: no withdrawId');
      return;
    }
    cleanupMonitoring();
    setIsMonitoring(true);
    setCryptoStatus('pending');
    setStatus('pending');
    setRetryCount(0);
    checkWithdrawStatus();
    monitoringInterval.current = setInterval(() => checkWithdrawStatus(false), 5000);
    monitoringTimeout.current = setTimeout(() => {
      if (cryptoStatus !== 'completed') {
        console.error(`Monitoring timed out for ${withdrawInstructions.withdrawId}`);
        cleanupMonitoring();
        setErrorMessage('Withdrawal verification timed out. Please check transaction status or contact support.');
        setStatus('error');
        setCryptoStatus('timeout');
      }
    }, 30 * 60 * 1000);
  }, [withdrawInstructions, checkWithdrawStatus, cleanupMonitoring, cryptoStatus]);

  useEffect(() => {
    if (withdrawInstructions?.withdrawId && status === 'pending' && !isMonitoring) {
      console.log(`Starting monitoring for withdrawId: ${withdrawInstructions.withdrawId}`);
      startMonitoring();
    }
  }, [withdrawInstructions, status, isMonitoring, startMonitoring]);

  const validateInputs = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('error');
      setErrorMessage('Please enter a valid amount greater than 0.');
      return false;
    }
    if (parseFloat(amount) > balance) {
      setStatus('error');
      setErrorMessage('Insufficient balance for this withdrawal.');
      return false;
    }
    if (!userId) {
      setStatus('error');
      setErrorMessage('User authentication required. Please log in.');
      return false;
    }
    if (!destination.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a valid Stellar wallet address.');
      return false;
    }
    if (!destination.startsWith('G') || destination.length !== 56) {
      setStatus('error');
      setErrorMessage('Invalid Stellar address. It must start with "G" and be 56 characters long.');
      return false;
    }
    return true;
  }, [amount, balance, userId, destination]);

  const handleAmountChange = useCallback((e) => {
    setAmount(e.target.value);
    setSelectedQuickAmount(null);
    setErrorMessage('');
    setStatus(null);
    setShowInstructions(false);
  }, []);

  const handleQuickAmount = useCallback((quickAmount) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
    setErrorMessage('');
    setStatus(null);
    setShowInstructions(false);
    inputRef.current?.focus();
  }, []);

  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setStatus('copied');
      setErrorMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} copied to clipboard!`);
      setTimeout(() => {
        if (cryptoStatus === 'completed') {
          resetCryptoForm();
        } else {
          setStatus('pending');
          setErrorMessage('');
        }
      }, 2000);
    } catch (err) {
      setErrorMessage('Failed to copy to clipboard. Please try again.');
      setStatus('error');
    }
  }, [cryptoStatus, resetCryptoForm]);

  const handleCryptoWithdraw = useCallback(async () => {
    if (!validateInputs()) return;
    setIsProcessing(true);
    setStatus(null);
    setErrorMessage('');
    try {
      console.log('Initiating withdrawal:', { userId, amount, destination });
      const response = await fetch('http://localhost:5000/withdraw-crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: parseFloat(amount), destination }),
      });
      const result = await response.json();
      console.log('Full withdraw response:', result);
      if (response.ok) {
        if (!result.withdrawId && !result.withdraw_id) {
          throw new Error('Missing withdrawId in response');
        }
        const newInstructions = {
          amount: result.amount,
          currency: result.currency || 'XLM',
          network: result.network || 'Stellar',
          destination: result.destination,
          withdrawId: result.withdrawId || result.withdraw_id,
          transactionId: result.transactionId || result.tx_hash,
          instructions: result.instructions || {
            step1: `Sending ${parseFloat(result.amount || 0).toFixed(2)} XLM to ${result.destination}`,
            step2: 'Transaction will be processed on the Stellar network',
            step3: 'Wait for confirmation (usually 5-10 seconds)',
            step4: 'Funds will be credited to your wallet automatically'
          },
          timeoutMinutes: result.timeoutMinutes || 30,
        };
        console.log('Setting withdrawInstructions:', newInstructions);
        setWithdrawInstructions(newInstructions);
        setShowInstructions(true);
        setStatus('pending');
      } else {
        throw new Error(result.message || 'Invalid withdrawal response');
      }
    } catch (error) {
      console.error(`Withdrawal failed:`, error);
      handleNetworkError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [userId, amount, destination, validateInputs, handleNetworkError]);

  const getButtonStyle = useCallback(() => {
    if (isProcessing) return 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed';
    if (status === 'error') return currentTheme.buttonBg + ' ' + currentTheme.buttonHover;
    return currentTheme.buttonBg + ' ' + currentTheme.buttonHover + ' active:scale-[0.98]';
  }, [isProcessing, status, currentTheme]);

  const getButtonContent = useCallback(() => {
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <Loader2 size={20} className="animate-spin" />
          <span>Processing...</span>
        </div>
      );
    }
    if (status === 'error') {
      return (
        <div className="flex items-center justify-center space-x-3">
          <AlertCircle size={20} className={currentTheme.errorText} />
          <span>Try Again</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center space-x-3">
        <MinusCircle size={20} />
        <span className="font-medium">Initiate Withdrawal</span>
        <ArrowRight size={16} />
      </div>
    );
  }, [isProcessing, status, currentTheme]);

  const getCryptoStatusColor = useCallback(() => {
    switch (cryptoStatus) {
      case 'completed': return currentTheme.successBg + ' ' + currentTheme.successText;
      case 'pending': return currentTheme.warningBg + ' ' + currentTheme.warningText;
      case 'failed': case 'timeout': return currentTheme.errorBg + ' ' + currentTheme.errorText;
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  }, [cryptoStatus, currentTheme]);

  const getCryptoStatusIcon = useCallback(() => {
    switch (cryptoStatus) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Loader2 size={16} className="animate-spin" />;
      case 'failed': case 'timeout': return <AlertCircle size={16} />;
      default: return <Loader2 size={16} className="animate-spin" />;
    }
  }, [cryptoStatus]);

  const ConfirmationDialog = () => {
    const handleGoBack = () => {
      resetCryptoForm();
      navigate('/dashboard');
    };

    return (
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/75' : 'bg-gray-500/75'} backdrop-blur-sm flex items-center justify-center p-4 z-50`}>
        <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow} p-8 max-w-md w-full space-y-6`}>
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentTheme.successBg}`}>
              <CheckCircle size={32} className={currentTheme.successText} />
            </div>
            <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
              Withdrawal Successful!
            </h3>
            <p className={`${currentTheme.textSecondary} text-sm`}>
              Your withdrawal of {withdrawInstructions?.amount} XLM has been processed successfully.
            </p>
            <p className={`${currentTheme.textMuted} text-xs`}>
              Transaction ID: {withdrawInstructions?.transactionId}
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={resetCryptoForm}
              className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${currentTheme.buttonBg} ${currentTheme.buttonHover} transition-all duration-300 ${currentTheme.shadow}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MinusCircle size={20} />
                <span>Make Another Withdrawal</span>
              </div>
            </button>
            <button
              onClick={handleGoBack}
              className={`w-full px-6 py-3 rounded-md font-semibold ${currentTheme.textPrimary} ${currentTheme.secondaryButtonBg} ${currentTheme.secondaryButtonHover} transition-all duration-300 ${currentTheme.shadow}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Home size={20} />
                <span>Go to Dashboard</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

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
                Withdraw Your Funds
              </h1>
              <p className={`text-xl ${currentTheme.textSecondary} mb-8 leading-relaxed`}>
                Securely transfer your XLM to an external Stellar wallet
              </p>
              <p className={`${currentTheme.textMuted} text-sm`}>
                Withdrawals are processed instantly on the Stellar network. Ensure your destination address is correct, as transactions are irreversible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${currentTheme.successBg} rounded-xl flex items-center justify-center`}>
                    <Zap size={24} className={currentTheme.successText} />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Instant Transfers</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>Processed in seconds on Stellar</p>
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center`}>
                    <Lock size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Bank-Grade Security</h3>
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
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>No Hidden Fees</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>Transparent withdrawal process</p>
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} rounded-2xl p-6 hover:border-opacity-20 transition-colors`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center`}>
                    <Shield size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-semibold text-lg`}>Fraud Protection</h3>
                    <p className={`${currentTheme.textMuted} text-sm`}>Advanced security measures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className={`relative ${currentTheme.container} ${currentTheme.containerBorder} rounded-3xl p-8 ${currentTheme.shadow}`}>
                <div className={`absolute -top-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/20 to-transparent'}`} />
                <div className={`absolute -bottom-px left-4 right-4 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-200/10 to-transparent'}`} />

                <div className="text-center mb-8">
                  <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-2`}>Withdraw XLM</h2>
                  <p className={`${currentTheme.textMuted} text-sm`}>
                    Current Balance: <span className={`${currentTheme.textPrimary} font-semibold`}>{balance?.toFixed(2) || '0.00'} XLM</span>
                  </p>
                  <p className={`${currentTheme.textMuted} text-xs mt-1`}>
                    Enter the amount and destination address to withdraw your funds.
                  </p>
                </div>

                <div className="space-y-6">
                  {status === 'copied' && errorMessage && (
                    <div className={`flex items-start space-x-3 ${currentTheme.successText} text-sm ${currentTheme.successBg} rounded-xl p-4`}>
                      <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  {status === 'error' && errorMessage && (
                    <div className={`flex items-start space-x-3 ${currentTheme.errorText} text-sm ${currentTheme.errorBg} rounded-xl p-4`}>
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Transaction Error</p>
                        <p>{errorMessage}</p>
                        {errorMessage.includes('contact support') && (
                          <p className={`${currentTheme.textMuted} text-xs mt-1`}>
                            Reach out to our support team at support@example.com for assistance.
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setStatus(null);
                            setErrorMessage('');
                          }}
                          className="mt-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 rounded-lg text-rose-100 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'pending' && cryptoStatus === 'pending' && isMonitoring && (
                    <div className={`flex items-start space-x-3 ${currentTheme.warningText} text-sm ${currentTheme.warningBg} rounded-xl p-4`}>
                      <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <p className="font-medium">Withdrawal Pending</p>
                        <p>Monitoring transaction status. This may take a few seconds.</p>
                      </div>
                    </div>
                  )}

                  {!showInstructions ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label htmlFor="withdrawAmount" className={`block text-sm font-medium ${currentTheme.textSecondary}`}>
                          Withdrawal Amount (XLM)
                        </label>
                        <div className="relative group">
                          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                            isFocused ? currentTheme.buttonBg + '/20 blur-sm' : currentTheme.inputBg
                          }`} />
                          <div className="relative">
                            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted}`}>
                              <DollarSign size={20} />
                            </div>
                            <input
                              ref={inputRef}
                              id="withdrawAmount"
                              type="number"
                              min="0"
                              step="0.01"
                              className={`w-full pl-12 pr-20 py-4 ${currentTheme.inputBg} ${currentTheme.inputBorder} transition-all duration-300 ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} text-lg rounded-2xl outline-none ${
                                status === 'error'
                                  ? currentTheme.errorBg + ' ring-2 ring-rose-500/30'
                                  : isFocused
                                    ? currentTheme.inputBorder + '/50 ring-2 ring-orange-500/50'
                                    : currentTheme.inputBorder
                              }`}
                              placeholder="0.00"
                              value={amount}
                              onChange={handleAmountChange}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              disabled={isProcessing || balance <= 0}
                            />
                            {amount && (
                              <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${currentTheme.textMuted} text-sm font-medium`}>
                                XLM
                              </div>
                            )}
                          </div>
                        </div>
                        {amount && parseFloat(amount) > 0 && (
                          <div className="text-center py-2">
                            <span className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                              {parseFloat(amount).toFixed(2)} XLM
                            </span>
                            <p className={`${currentTheme.textMuted} text-xs mt-1`}>
                              Approx. ${(parseFloat(amount) * 0.44).toFixed(2)} USD (based on current rates)
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label htmlFor="destination" className={`block text-sm font-medium ${currentTheme.textSecondary}`}>
                          Recipient Stellar Wallet Address
                        </label>
                        <div className="relative">
                          <input
                            id="destination"
                            type="text"
                            className={`w-full px-4 py-4 ${currentTheme.inputBg} ${currentTheme.inputBorder} transition-all duration-300 ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder} rounded-2xl outline-none ${
                              status === 'error' && !destination.trim()
                                ? currentTheme.errorBg + ' ring-2 ring-rose-500/30'
                                : currentTheme.inputBorder + ' focus:ring-2 focus:ring-emerald-500/50'
                            }`}
                            placeholder="G1234...ABCD (56 characters)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={isProcessing}
                          />
                        </div>
                        <div className={`flex items-start space-x-2 ${currentTheme.textSecondary} text-xs`}>
                          <Shield size={16} className="flex-shrink-0 mt-0.5" />
                          <p>
                            Double-check the address. Incorrect addresses may result in permanent loss of funds.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Quick Amounts</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {quickAmounts.map((quickAmount) => (
                            <button
                              key={quickAmount}
                              type="button"
                              onClick={() => handleQuickAmount(quickAmount)}
                              className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                                selectedQuickAmount === quickAmount
                                  ? currentTheme.quickAmountSelected + ' ' + currentTheme.textPrimary + ' shadow-lg'
                                  : currentTheme.quickAmountBg + ' ' + currentTheme.textSecondary + ' ' + currentTheme.cardBorder + ' ' + currentTheme.quickAmountHover
                              } ${isProcessing || balance <= 0 || quickAmount > balance ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isProcessing || balance <= 0 || quickAmount > balance}
                            >
                              {quickAmount.toLocaleString()} XLM
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleCryptoWithdraw}
                        className={`w-full px-6 py-4 rounded-2xl font-semibold ${currentTheme.textPrimary} relative overflow-hidden transition-all duration-300 ${currentTheme.shadow} transform hover:scale-[1.02] ${getButtonStyle()} ${
                          !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim() || isProcessing
                            ? 'opacity-60 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={isProcessing || !amount || parseFloat(amount) <= 0 || balance <= 0 || !destination.trim()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                        <div className="relative">{getButtonContent()}</div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      <div className={`flex items-center justify-between p-4 rounded-xl border ${getCryptoStatusColor()}`}>
                        <div className="flex items-center space-x-3">
                          {getCryptoStatusIcon()}
                          <div>
                            <span className={`font-medium capitalize ${currentTheme.textPrimary}`}>
                              {cryptoStatus === 'pending' ? 'Processing Withdrawal' : cryptoStatus}
                            </span>
                            {lastChecked && (
                              <div className={`${currentTheme.textMuted} text-xs`}>
                                Last checked: {lastChecked.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isMonitoring && (
                            <button
                              onClick={() => checkWithdrawStatus(true)}
                              className={`p-2 rounded-lg ${currentTheme.copyButtonBg} transition-colors`}
                              title="Check status now"
                            >
                              <RefreshCw size={16} className={currentTheme.textPrimary} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={`${currentTheme.cardBg} ${currentTheme.cardBorder} p-6 rounded-2xl`}>
                        <div className="text-center mb-4">
                          <Wallet size={24} className={currentTheme.textAccent + ' mx-auto mb-2'} />
                          <h3 className={`${currentTheme.textPrimary} font-semibold`}>Withdrawal in Progress</h3>
                          <p className={`${currentTheme.textMuted} text-sm mt-1`}>
                            Sending {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM to your wallet
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`${currentTheme.textSecondary} text-sm`}>Global Transaction ID</p>
                              <button
                                onClick={() => copyToClipboard(withdrawInstructions.withdrawId, 'withdrawId')}
                                className={`flex items-center space-x-1 text-xs ${currentTheme.textAccent} hover:text-opacity-80 transition-colors`}
                              >
                                {copiedField === 'withdrawId' ? <CheckCircle size={12} /> : <Copy size={12} />}
                                <span>{copiedField === 'withdrawId' ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg break-all`}>
                              <code className={`${currentTheme.textAccent} font-mono text-sm`}>
                                {withdrawInstructions.withdrawId}
                              </code>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`${currentTheme.textSecondary} text-sm`}>Amount</p>
                              <button
                                onClick={() => copyToClipboard(
                                  parseFloat(withdrawInstructions.amount).toFixed(2),
                                  'amount'
                                )}
                                className={`flex items-center space-x-1 text-xs ${currentTheme.textAccent} hover:text-opacity-80 transition-colors`}
                              >
                                {copiedField === 'amount' ? <CheckCircle size={12} /> : <Copy size={12} />}
                                <span>{copiedField === 'amount' ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg`}>
                              <code className={`${currentTheme.textAccent} font-mono text-lg font-bold`}>
                                {parseFloat(withdrawInstructions.amount).toFixed(2)} XLM
                              </code>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`${currentTheme.textSecondary} text-sm`}>Destination Address</p>
                              <button
                                onClick={() => copyToClipboard(withdrawInstructions.destination, 'address')}
                                className={`flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors`}
                              >
                                {copiedField === 'address' ? <CheckCircle size={12} /> : <Copy size={12} />}
                                <span>{copiedField === 'address' ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg break-all`}>
                              <code className="text-blue-400 font-mono text-sm">
                                {withdrawInstructions.destination}
                              </code>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`${currentTheme.textSecondary} text-sm`}>Stellar Transaction ID</p>
                              <button
                                onClick={() => copyToClipboard(withdrawInstructions.transactionId, 'txId')}
                                className={`flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors`}
                              >
                                {copiedField === 'txId' ? <CheckCircle size={12} /> : <Copy size={12} />}
                                <span>{copiedField === 'txId' ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                            <div className={`${isDarkMode ? 'bg-black/30' : 'bg-gray-100/50'} px-4 py-3 rounded-lg break-all`}>
                              <code className="text-blue-400 font-mono text-sm">
                                {withdrawInstructions.transactionId}
                              </code>
                            </div>
                          </div>

                          <div className={`flex items-start space-x-2 ${currentTheme.warningText} text-xs ${currentTheme.warningBg} rounded-xl p-4`}>
                            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                            <p>
                              Ensure the destination address is correct. Transactions on the Stellar network are irreversible. Contact support if you encounter issues.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className={`${currentTheme.textSecondary} text-sm font-medium`}>Withdrawal Steps</p>
                            <ol className={`list-decimal list-inside ${currentTheme.textMuted} text-sm space-y-1`}>
                              {withdrawInstructions.instructions &&
                                Object.values(withdrawInstructions.instructions).map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                            </ol>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className={currentTheme.textSecondary}>Network</span>
                            <span className={`${currentTheme.textPrimary} font-medium`}>{withdrawInstructions.network}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className={currentTheme.textSecondary}>Expires in</span>
                            <span className={`${currentTheme.textPrimary} font-medium`}>{withdrawInstructions.timeoutMinutes} minutes</span>
                          </div>

                          <div className="text-center">
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${withdrawInstructions.transactionId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors`}
                            >
                              <ExternalLink size={16} />
                              <span>View Transaction on Stellar Explorer</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <button
                          onClick={() => checkWithdrawStatus(true)}
                          className={`w-full px-6 py-3 rounded-2xl font-semibold ${currentTheme.textPrimary} bg-blue-600 hover:bg-blue-500 transition-colors ${currentTheme.shadow} ${
                            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isProcessing}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
                            <span>Check Status Now</span>
                          </div>
                        </button>
                        <button
                          onClick={resetCryptoForm}
                          className={`w-full px-6 py-3 rounded-2xl font-semibold ${currentTheme.textPrimary} ${currentTheme.secondaryButtonBg} ${currentTheme.secondaryButtonHover} transition-all duration-300 ${currentTheme.shadow} transform hover:scale-[1.02]`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <ArrowRight size={20} />
                            <span>Start New Withdrawal</span>
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
      {showConfirmationDialog && <ConfirmationDialog />}
    </div>
  );
};

export default Withdraw;