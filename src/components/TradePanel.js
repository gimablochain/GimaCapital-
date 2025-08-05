
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   TrendingUp,  DollarSign, Wallet, AlertCircle,
//   CheckCircle, X, Zap, Info, Shield, Clock, Target, BarChart2,
//   ChevronDown, ChevronUp, Flame, History, Trash2, Hash, ArrowUpDown, Activity, Users, Globe, BarChart3,
//   Pause, Play, Lock,
//   Sparkles,  ArrowRight
// } from 'lucide-react';
// import { Modal, Button } from 'antd'; 
// import Tooltip from '@mui/material/Tooltip';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import axios from 'axios';

// const TradePanel = ({ onTrade, balance = 0, holdings = 0, lockedHoldings = 0, isDarkMode = true }) => {
//   const [amount, setAmount] = useState('');
//   const [action, setAction] = useState('buy');
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertType, setAlertType] = useState('error');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showGimaDetails, setShowGimaDetails] = useState(false);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [showTradeDetails, setShowTradeDetails] = useState(null);
//   const [tradeStreak, setTradeStreak] = useState(0);
//   const [investmentAmount, setInvestmentAmount] = useState(balance);
//   const [uptime, setUptime] = useState(99.95);
//   const [celebrations, setCelebrations] = useState([]);
//   const [userId, setUserId] = useState(null);


//   const auth = getAuth();
//   const API_BASE_URL = 'http://localhost:5000';
//   const availableHoldings = holdings - lockedHoldings;
//   const [escrowedFunds, setescrowedFunds] = useState(0);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//       } else {
//         setUserId(null);
//         showCustomAlert('Please log in to save trades and streaks.', 'error');
//       }
//     });
//     return () => unsubscribe();
//   }, [auth]);


  // useEffect(() => {
  //   if (userId) {
  //     axios.get(`${API_BASE_URL}/api/get_trades/${userId}`)
  //       .then(response => {
  //         const trades = Array.isArray(response.data.trades_recent) ? response.data.trades_recent : [];
  //         setTradeHistory(trades);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching trades:', error);
  //         setTradeHistory([]);
  //         showCustomAlert('Failed to load trade history.', 'error');
  //       });

  //     axios.get(`${API_BASE_URL}/api/get_streak/${userId}`)
  //       .then(response => {
  //         setTradeStreak(response.data.streak || 0);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching streak:', error);
  //         setTradeStreak(0);
  //         showCustomAlert('Failed to load trade streak.', 'error');
  //       });
  //   }
  // }, [userId]);

//   const emojis = [
//     '🔥', '🎉', '🎊', '✨', '⭐', '🌟', '💫', '🏆', '🥇', '🎖️',
//     '👑', '💎', '🚀', '💰', '💸', '🤑', '✅', '🎯', '⚡', '💥'
//   ];

//   const getGimaStreakBadgePosition = () => {
//     const streakElement = document.querySelector('.gima-streak-badge');
//     if (streakElement) {
//       const rect = streakElement.getBoundingClientRect();
//       return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
//     }
//     return { x: window.innerWidth / 2, y: 100 };
//   };

//   const getTradeStreakBadgePosition = () => {
//     const streakElement = document.querySelector('.trade-streak-badge');
//     if (streakElement) {
//       const rect = streakElement.getBoundingClientRect();
//       return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
//     }
//     return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
//   };

//   const triggerCelebration = () => {
//     const gimaBadgePosition = getGimaStreakBadgePosition();
//     const tradeBadgePosition = getTradeStreakBadgePosition();

//     const newCelebrations = [];

//     const gimaCelebrations = Array(50).fill().map((_, i) => {
//       const angle = Math.random() * 360;
//       const distance = 150 + Math.random() * 100;
//       const endX = Math.cos((angle * Math.PI) / 180) * distance;
//       const endY = Math.sin((angle * Math.PI) / 180) * distance - 100;

//       return {
//         id: `gima-${Date.now()}-${i}`,
//         emoji: emojis[Math.floor(Math.random() * emojis.length)],
//         startX: gimaBadgePosition.x,
//         startY: gimaBadgePosition.y,
//         endX: endX,
//         endY: endY,
//         delay: Math.random() * 0.3,
//         duration: 2 + Math.random() * 1,
//       };
//     });

//     const tradeCelebrations = Array(50).fill().map((_, i) => {
//       const angle = Math.random() * 360;
//       const distance = 150 + Math.random() * 100;
//       const endX = Math.cos((angle * Math.PI) / 180) * distance;
//       const endY = Math.sin((angle * Math.PI) / 180) * distance - 100;

//       return {
//         id: `trade-${Date.now()}-${i}`,
//         emoji: emojis[Math.floor(Math.random() * emojis.length)],
//         startX: tradeBadgePosition.x,
//         startY: tradeBadgePosition.y,
//         endX: endX,
//         endY: endY,
//         delay: Math.random() * 0.3,
//         duration: 2 + Math.random() * 1,
//       };
//     });

//     newCelebrations.push(...gimaCelebrations, ...tradeCelebrations);
//     setCelebrations((prev) => [...prev, ...newCelebrations]);

//     setTimeout(() => {
//       setCelebrations((prev) =>
//         prev.filter((celeb) => !newCelebrations.some((newCeleb) => newCeleb.id === celeb.id))
//       );
//     }, 3000);
//   };


//   // Modified formatUnits function to handle negative values
//   const formatUnits = (value) => {
//     const num = parseFloat(value);
//     if (isNaN(num)) return "0";
    
//     // Get absolute value for formatting
//     const absValue = Math.abs(num);
//     let formatted;
    
//     if (absValue < 0.0001) formatted = absValue.toFixed(5);
//     else if (absValue < 1) formatted = absValue.toFixed(4);
//     else if (absValue < 100) formatted = absValue.toFixed(3);
//     else formatted = absValue.toFixed(2);
    
//     // Add negative sign if needed
//     return num < 0 ? `-${formatted}` : formatted;
//   };

//   const showCustomAlert = (message, type = 'error') => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);
//   };

//   useEffect(() => {
//     if (showAlert) {
//       const timer = setTimeout(() => {
//         setShowAlert(false);
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [showAlert]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setUptime(prev => Math.min(99.99, Math.max(99.9, prev + (Math.random() * 0.02 - 0.01))));
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);


//   const handleAmountChange = (e) => {
//   const value = e.target.value;
  
//   if (action === 'sell') {
//     // Prevent selling more than available holdings
//     const maxSellable = Math.max(0, holdings - lockedHoldings);
//     if (parseFloat(value) > maxSellable) {
//       showCustomAlert(`Cannot transfer more than available holdings: $${formatUnits(maxSellable)}`, 'error');
//       return;
//     }
//   }
  
//   // Original amount change logic
//   if (value === '' || parseFloat(value) >= 0) {
//     setAmount(value);
//   }
// };

// const handleQuickAmount = (percentage) => {
//   let availableAmount;
//   if (action === 'buy') {
//     availableAmount = balance;
//   } else {
//     availableAmount = Math.max(0, holdings - lockedHoldings); // Use available holdings
//   }
  
//   const quickAmount = (availableAmount * percentage / 100).toFixed(action === 'buy' ? 2 : 6);
//   setAmount(quickAmount);
// };



//   const handleTrade = () => {
//     setShowConfirm(true);
//   };


//   const confirmTrade = async () => {
//   setShowConfirm(false);
//   const numAmount = parseFloat(amount);

//   if (isNaN(numAmount) || numAmount <= 0) {
//     showCustomAlert('Please enter a valid amount', 'error');
//     return;
//   }

//   if (action === 'buy' && numAmount > balance) {
//     showCustomAlert(`Insufficient balance. Available: $${formatUnits(balance)}`, 'error');
//     return;
//   }

//   if (action === 'sell' && numAmount > availableHoldings) {
//     showCustomAlert(`Insufficient available holdings. Available: $${formatUnits(availableHoldings)}`, 'error');
//     return;
//   }

//   setIsProcessing(true);

//   const tradeId = Date.now().toString();
//   try {
//     const pendingTrade = {
//       id: tradeId,
//       type: action,
//       amount: numAmount,
//       timestamp: new Date().toLocaleTimeString(),
//       status: 'pending',
//       lockedAmount: action === 'sell' ? numAmount : 0
//     };

//     setTradeHistory(prev => [pendingTrade, ...prev.slice(0, 9)]);

//     const newStreak = tradeStreak + 1;
//     setTradeStreak(newStreak);
//     setAmount('');

//     if (userId) {
//       await axios.post(`${API_BASE_URL}/api/save_trade`, { userId, trade: pendingTrade });
//       await axios.post(`${API_BASE_URL}/api/save_streak`, { userId, streak: newStreak });
//     }

//     const response = await onTrade(action, numAmount);
//     if (response?.newLockedHoldings !== undefined) {
//       // Update locked holdings in parent component if needed
//     }

//     const completedTrade = {
//       ...pendingTrade,
//       status: 'complete'
//     };

//     setTradeHistory(prev => {
//       const updated = [...prev];
//       const index = updated.findIndex(t => t.id === tradeId);
//       if (index !== -1) updated[index] = completedTrade;
//       return updated;
//     });

//     if (userId) {
//       await axios.post(`${API_BASE_URL}/api/save_trade`, { userId, trade: completedTrade });
//     }

//     showCustomAlert(
//       `${action.charAt(0).toUpperCase() + action.slice(1)} order executed successfully for ${formatUnits(numAmount)} units!`,
//       'success'
//     );

//     triggerCelebration();

//     // After successful trade, fetch updated user data
//     if (action === 'sell') {
//       setTimeout(async () => {
//         try {
//           const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
//           const result = response.data;
//           if (result.status === 'success') {
//             const fetchedLockedHoldings = result.user.locked_holdings || result.newLockedHoldings || 0;
//             setescrowedFunds(fetchedLockedHoldings);
//             console.log('Updated lockedHoldings after sell:', fetchedLockedHoldings);
//           }
//         } catch (error) {
//           console.error('Error fetching updated user data:', error);
//         }
//       }, 1000); // 1 second delay to ensure backend has processed the trade
//     }
//   } catch (error) {
//     setTradeHistory(prev => prev.filter(t => t.id !== tradeId));
//     console.error('Trade execution error:', error);
//     showCustomAlert(`Trade execution failed: ${error.message}`, 'error');
//     setTradeStreak(0);

//     if (userId) {
//       try {
//         await axios.delete(`${API_BASE_URL}/api/delete_trade`, {
//           data: { userId, tradeId }
//         });
//       } catch (deleteError) {
//         console.error("Error deleting pending trade:", deleteError);
//       }
//       await axios.post(`${API_BASE_URL}/api/save_streak`, { userId, streak: 0 });
//     }
//   } finally {
//     setIsProcessing(false);
//   }
// };


//   const clearTradeHistory = async () => {
//     setTradeHistory([]);
//     setTradeStreak(0);
//     showCustomAlert('Trade history cleared', 'success');

//     if (userId) {
//       try {
//         await axios.post(`${API_BASE_URL}/api/clear_trades/${userId}`);
//       } catch (error) {
//         console.error('Error clearing trade history:', error);
//         showCustomAlert('Failed to clear trade history.', 'error');
//       }
//     }
//   };

//   const calculateProjectedReturns = () => {
//     const minReturn = investmentAmount * 0.08;
//     const maxReturn = investmentAmount * 0.102;
//     return { min: minReturn.toFixed(2), max: maxReturn.toFixed(2) };
//   };

//   const generateAnimatedGraph = () => {
//     return (
//       <svg width="40" height="24" viewBox="0 0 40 24" className="ml-2">
//         <path
//           d="M2,22 L8,16 L14,18 L20,10 L26,14 L32,8 L38,12"
//           fill="none"
//           stroke={isDarkMode ? "#34d399" : "#10b981"}
//           strokeWidth="2"
//           strokeLinecap="round"
//         >
//           <animate
//             attributeName="stroke-dasharray"
//             values="0, 100; 100, 0"
//             dur="1.5s"
//             repeatCount="indefinite"
//           />
//         </path>
//       </svg>
//     );
//   };

//   return (
//     <div className={`w-full min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'} p-4`}>
//       <style jsx>{`
//         .animate-shoot-celebration {
//           animation: shootCelebration var(--duration) ease-out var(--delay) forwards;
//         }
//         @keyframes shootCelebration {
//           0% {
//             transform: translate(0, 0) scale(1) rotate(0deg);
//             opacity: 1;
//           }
//           50% {
//             opacity: 1;
//           }
//           100% {
//             transform: translate(var(--end-x), var(--end-y)) scale(0.3) rotate(360deg);
//             opacity: 0;
//           }
//         }
//       `}</style>
//       {celebrations.map((celeb) => (
//         <div
//           key={celeb.id}
//           className="fixed z-[100] text-xl pointer-events-none animate-shoot-celebration"
//           style={{
//             left: `${celeb.startX}px`,
//             top: `${celeb.startY}px`,
//             '--end-x': `${celeb.endX}px`,
//             '--end-y': `${celeb.endY}px`,
//             '--duration': `${celeb.duration}s`,
//             '--delay': `${celeb.delay}s`,
//           }}
//         >
//           {celeb.emoji}
//         </div>
//       ))}
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//           <div className="lg:col-span-6">
//             <div className={`rounded-xl shadow-2xl p-4 ${
//               isDarkMode
//                 ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
//                 : 'bg-white border border-gray-200'
//             }`}>
//               <GIMATradingBot
//                 isDarkMode={isDarkMode}
//                 tradeStreak={tradeStreak}
//                 uptime={uptime}
//                 investmentAmount={investmentAmount}
//                 setInvestmentAmount={setInvestmentAmount}
//                 showGimaDetails={showGimaDetails}
//                 setShowGimaDetails={setShowGimaDetails}
//                 generateAnimatedGraph={generateAnimatedGraph}
//                 calculateProjectedReturns={calculateProjectedReturns}
//               />
//             </div>
            
//             <div className="mt-4">
//               <NewsAdvertFeed isDarkMode={isDarkMode} />
//             </div>
//           </div>
//           <div className="lg:col-span-6">
//             <div
//               className={`rounded-xl shadow-2xl p-4 mb-4 ${
//                 isDarkMode
//                   ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               <TradePanelMain
//                 isDarkMode={isDarkMode}
//                 action={action}
//                 setAction={setAction}
//                 amount={amount}
//                 handleAmountChange={handleAmountChange}
//                 isProcessing={isProcessing}
//                 handleTrade={handleTrade}
//                 handleQuickAmount={handleQuickAmount}
//                 balance={balance}
//                 holdings={holdings}
//                 lockedHoldings={lockedHoldings}
//                 escrowedFunds={escrowedFunds} // Pass the state value as prop
//                 formatUnits={formatUnits}
//                 tradeStreak={tradeStreak}
//               />
//             </div>
//             <div
//               className={`rounded-xl shadow-2xl p-4 ${
//                 isDarkMode
//                   ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               <TradeHistory
//                 isDarkMode={isDarkMode}
//                 tradeHistory={tradeHistory}
//                 showTradeDetails={showTradeDetails}
//                 setShowTradeDetails={setShowTradeDetails}
//                 clearTradeHistory={clearTradeHistory}
//                 formatUnits={formatUnits}
//               />
//             </div>
//           </div>
//           <div className="lg:col-span-12 mt-4">
//             <div
//               className={`rounded-xl shadow-2xl p-4 ${
//                 isDarkMode
//                   ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               <Footer
//                 isDarkMode={isDarkMode}
//                 balance={balance}
//                 holdings={holdings}
//                 lockedHoldings={lockedHoldings}
//                 formatUnits={formatUnits}
//                 escrowedFunds={escrowedFunds} // Pass the state value as prop
//               />
//             </div>
//           </div>
//         </div>
//         {showAlert && (
//           <CustomAlert
//             alertType={alertType}
//             alertMessage={alertMessage}
//             setShowAlert={setShowAlert}
//             isDarkMode={isDarkMode}
//           />
//         )}
//         {showConfirm && (
//           <TradeConfirmationModal
//             isDarkMode={isDarkMode}
//             action={action}
//             amount={amount}
//             balance={balance}
//             holdings={holdings}
//             lockedHoldings={lockedHoldings}
//             formatUnits={formatUnits}
//             setShowConfirm={setShowConfirm}
//             confirmTrade={confirmTrade}
//             isProcessing={isProcessing}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const GIMATradingBot = ({
//   isDarkMode, tradeStreak, uptime, investmentAmount, setInvestmentAmount,
//   showGimaDetails, setShowGimaDetails, generateAnimatedGraph, calculateProjectedReturns
// }) => {
//   return (
//     <div className={`mb-4 p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-700/50 shadow-lg shadow-emerald-500/10' : 'bg-emerald-50 border border-emerald-200 shadow-lg shadow-emerald-200/20'}`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center">
//           <BarChart2 className="mr-2 text-emerald-400" size={24} />
//           <h2 className={`text-xl font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
//             Powered by GIMA Trading Bot
//           </h2>
//         </div>
//         {tradeStreak > 0 && (
//           <div className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-1 rounded-full ">
//             <Flame className="text-white mr-1" size={14} />
//             <span className="text-white text-xs font-bold">{tradeStreak}x Streak</span>
//           </div>
//         )}
//       </div>
//       <div className="flex justify-between items-center mb-3">
//         <div className={`text-xs font-medium px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
//           ⭐ Trusted by over 10,000 traders worldwide
//         </div>
//         <div className={`flex items-center ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
//           <div className="relative w-2 h-2 mr-2">
//             <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'} animate-ping`}></div>
//             <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
//           </div>
//           <span className="font-bold text-sm">{uptime.toFixed(2)}%</span>
//           <span className="ml-1 text-xs">Uptime</span>
//         </div>
//       </div>
//       <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-3`}>
//         This application connects to the GIMA trading bot, leveraging real-time market data for automated trading with cutting-edge AI strategies.
//       </p>
//       <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-emerald-900/50 border-l-4 border-emerald-400' : 'bg-emerald-100 border-l-4 border-emerald-500'}`}>
//         <div className="flex items-center">
//           <h4 className={`font-semibold mb-2 text-emerald-500 text-base`}>
//             Exceptional Performance
//           </h4>
//           {generateAnimatedGraph()}
//         </div>
//         <p className={`text-xl font-bold bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-700'} animate-pulse`}>
//           8-10.2% Monthly Returns
//         </p>
//         <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-2`}>
//           Experience consistent profits with a proven track record of no losses, powered by 24/7 market monitoring.
//         </p>
//       </div>
//       <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
//         <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           Profit Calculator
//         </h4>
//         <div className="mb-2">
//           <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//             Investment Amount ($)
//           </label>
//           <div className="relative">
//             <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
//             <input
//               type="number"
//               value={investmentAmount}
//               onChange={(e) => setInvestmentAmount(e.target.value)}
//               className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-black'}`}
//             />
//           </div>
//         </div>
//         <input
//           type="range"
//           min="0"
//           max="100000"
//           value={investmentAmount}
//           onChange={(e) => setInvestmentAmount(e.target.value)}
//           className="w-full accent-emerald-500"
//         />
//         <div className="mt-2">
//           <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
//             Projected Monthly Returns:
//           </p>
//           <p className={`text-base font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
//             ${calculateProjectedReturns().min} - ${calculateProjectedReturns().max}
//           </p>
//         </div>
//       </div>
//       <button
//         onClick={() => setShowGimaDetails(!showGimaDetails)}
//         className={`mt-4 flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'}`}
//       >
//         {showGimaDetails ? (
//           <>
//             <ChevronUp size={18} />
//             <span>Hide Details</span>
//           </>
//         ) : (
//           <>
//             <ChevronDown size={18} />
//             <span>Discover Why GIMA Excels</span>
//           </>
//         )}
//       </button>
//       <Modal
//         title={
//           <div className="flex items-center space-x-2">
//             <BarChart2 size={16} className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
//             <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Why Choose GIMA Trading Bot?
//             </span>
//           </div>
//         }
//         open={showGimaDetails}
//         onCancel={() => setShowGimaDetails(false)}
//         footer={[
//           <button
//             key="close"
//             onClick={() => setShowGimaDetails(false)}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
//           >
//             Close
//           </button>,
//         ]}
//         centered
//         width={500}
//         className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
//         styles={{
//           content: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             borderRadius: '12px',
//             boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
//             padding: 0,
//           },
//           header: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             marginBottom: 0,
//           },
//           body: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             color: isDarkMode ? '#e2e8f0' : '#1f2937',
//             padding: '16px',
//           },
//           footer: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             display: 'flex',
//             justifyContent: 'flex-end',
//           },
//         }}
//         closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
//       >
//         <div className="space-y-3">
//           {[
//             {
//               icon: CheckCircle,
//               label: 'Unmatched Returns',
//               value: 'Achieve 8-10.2% monthly profits with a flawless no-loss record.'
//             },
//             {
//               icon: CheckCircle,
//               label: 'AI-Driven Strategies',
//               value: 'Advanced algorithms analyze market trends for optimal trade execution.'
//             },
//             {
//               icon: CheckCircle,
//               label: '24/7 Monitoring',
//               value: 'Never miss a market opportunity with round-the-clock surveillance.'
//             },
//             {
//               icon: CheckCircle,
//               label: 'User-Friendly',
//               value: 'Seamless integration designed for traders of all experience levels.'
//             },
//             {
//               icon: CheckCircle,
//               label: 'Risk Management',
//               value: 'Built-in safeguards protect your investments and minimize risks.'
//             }
//           ].map(({ icon: Icon, label, value }) => (
//             <div
//               key={label}
//               className={`flex items-start space-x-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50/50 border border-gray-200/50'}`}
//             >
//               <Icon size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
//               <div>
//                 <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                   {label}
//                 </span>
//                 <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-1`}>
//                   {value}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Modal>
//     </div>
//   );
// };




// const TradePanelMain = ({
//   action,
//   setAction,
//   amount,
//   handleAmountChange,
//   isProcessing,
//   handleTrade,
//   handleQuickAmount,
//   balance,
//   holdings,
//   lockedHoldings = 0,
//   formatUnits,
//   tradeStreak,
//   escrowedFunds,
//   isDarkMode,
// }) => {
//   // State for modal visibility
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // Function to show modal
//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   // Function to handle modal close
//   const handleModalClose = () => {
//     setIsModalVisible(false);
//   };

//   // Calculate available holdings
//   const availableHoldings = Math.max(0, holdings - lockedHoldings);

//   return (
//     <>
//       {/* Existing code for the top part remains unchanged */}
//       <div className="flex items-center justify-between mb-6">
//         <h2
//           className={`text-xl font-semibold flex items-center ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}
//         >
//           <TrendingUp className="mr-3 text-emerald-400" size={24} /> Internal Fund
//           Transfer
//         </h2>
//         <div
//           className={`text-sm px-3 py-1 rounded-lg font-medium flex items-center select-none ${
//             isDarkMode
//               ? 'bg-slate-800 text-slate-400'
//               : 'bg-gray-200 text-gray-700'
//           }`}
//         >
//           {action === 'buy' ? (
//             <>
//               <ArrowRight className="mx-1" size={16} />
//               Prime Reserve → Smart Fund
//             </>
//           ) : (
//             <>
//               <ArrowRight className="mx-1" size={16} />
//               Smart Fund → Prime Reserve
//             </>
//           )}
//         </div>
//         {tradeStreak > 0 && (
//           <div className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full">
//             <Flame className="text-white mr-2" size={16} />
//             <span className="text-white text-sm font-semibold">
//               {tradeStreak}x Streak
//             </span>
//           </div>
//         )}
//       </div>


//       <div
//   className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 p-4 sm:p-5 rounded-lg shadow-md ${
//     isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700'
//   }`}
// >
//   <section>
//     <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
//       <section>
//         <h3 className="text-base sm:text-lg font-semibold mb-1">Prime Reserve</h3>
//         <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
//           Current Balance
//         </p>
//         <p className="text-xl sm:text-2xl font-bold mb-2">{formatUnits(balance)} XLM</p>
//         <p className="text-xs sm:text-sm text-gray-400 mb-4">
//           Secure Holdings • Main Account
//         </p>
//         <p className="text-xs sm:text-sm">
//           <span className="font-semibold">Account Type:</span> Primary Wallet
//         </p>
//         <p className="text-xs sm:text-sm mb-1">
//           <span className="font-semibold">Status:</span> Active
//         </p>
//       </section>
//     </div>
//   </section>

//   <section>
//     <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
//       <h3 className="text-base sm:text-lg font-semibold mb-1 flex items-center">
//         <Sparkles className="mr-2 text-amber-400" size={16} />
//         Smart Fund
//       </h3>
//       <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
//         Current Value
//       </p>
//       <p className="text-xl sm:text-2xl font-bold mb-2">${formatUnits(holdings)}</p>
//       <p className="text-xs sm:text-sm text-gray-400 mb-4">
//         AI-Powered Trading • Automated Portfolio
//       </p>
//       <p className="text-xs sm:text-sm mb-1">
//         <span className="font-semibold">Status:</span> Active
//       </p>
//       <Button
//         type="primary"
//         onClick={showModal}
//         className="mt-4 w-full sm:w-auto"
//         style={{
//           backgroundColor: isDarkMode ? '#059669' : '#10B981',
//           borderColor: isDarkMode ? '#059669' : '#10B981',
//         }}
//       >
//         View Smart Fund Details
//       </Button>
//     </div>
//   </section>

//   <Modal
//     title="Smart Fund Details"
//     open={isModalVisible}
//     onCancel={handleModalClose}
//     footer={[
//       <Button key="close" onClick={handleModalClose}>
//         Close
//       </Button>,
//     ]}
//     className={isDarkMode ? 'ant-modal-dark' : ''}
//     width="90%"
//     style={{ maxWidth: '600px' }}
//   >
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Total Holdings:</span> ${formatUnits(holdings)}
//     </p>
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Escrowed Funds:</span> ${formatUnits(escrowedFunds)}
//     </p>
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Available Holdings:</span> ${formatUnits(availableHoldings)}
//     </p>
//     <p className="text-xs sm:text-sm mt-4">
//       The Smart Fund utilizes the Gima Trading Bot, an advanced AI system designed to optimize trading strategies based on market trends. Funds in escrow are actively managed by the bot and may be subject to lock-up periods during trading cycles.
//     </p>
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center space-x-2">
//         <div
//           className={`w-2 h-2 rounded-full ${
//             isDarkMode ? 'bg-amber-400' : 'bg-amber-500'
//           } animate-pulse`}
//         ></div>
//         <span
//           className={`text-xs sm:text-sm font-medium ${
//             isDarkMode ? 'text-slate-300' : 'text-slate-700'
//           }`}
//         >
//           Locked Funds
//         </span>
//       </div>
//       <div className="text-right">
//         <span
//           className={`text-xl sm:text-2xl font-bold ${
//             isDarkMode ? 'text-amber-300' : 'text-amber-600'
//           }`}
//         >
//           ${formatUnits(escrowedFunds)}
//         </span>
//       </div>
//     </div>
//   </Modal>

//   <style jsx>{`
//     @keyframes shimmer {
//       0% {
//         transform: translateX(-100%);
//       }
//       100% {
//         transform: translateX(100%);
//       }
//     }
//     .animate-shimmer {
//       animation: shimmer 2s infinite;
//     }

//     .ant-modal-dark .ant-modal-content {
//       background-color: #1e293b;
//       color: #e2e8f0;
//     }
//     .ant-modal-dark .ant-modal-header {
//       background-color: #1e293b;
//       color: #e2e8f0;
//       border-bottom: 1px solid #334155;
//     }
//     .ant-modal-dark .ant-modal-title {
//       color: #e2e8f0;
//     }
//     .ant-modal-dark .ant-modal-close-x {
//       color: #e2e8f0;
//     }
//     /* Ensure modal is responsive */
//     .ant-modal {
//       width: 90% !important;
//       max-width: 600px;
//     }
//     @media (max-width: 640px) {
//       .ant-modal {
//         padding: 0 8px;
//       }
//     }
//   `}</style>
// </div>

//       {/* Rest of the component remains unchanged */}
//       <div className="flex space-x-4 mb-6">
//         <Tooltip title="Move capital into Smart Fund for automated trading" arrow>
//           <button
//             onClick={() => setAction('buy')}
//             className={`flex-1 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
//               action === 'buy'
//                 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
//                 : isDarkMode
//                 ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//             disabled={isProcessing}
//           >
//             <ArrowRight className="transform rotate-180" size={16} />
//             Transfer to Smart Fund
//           </button>
//         </Tooltip>

//         <Tooltip title="Move funds back to your Prime Reserve" arrow>
//           <button
//             onClick={() => setAction('sell')}
//             className={`flex-1 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
//               action === 'sell'
//                 ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
//                 : isDarkMode
//                 ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//             disabled={isProcessing}
//           >
//             <ArrowRight size={16} />
//             Transfer to Prime Reserve
//           </button>
//         </Tooltip>
//       </div>

//       <div className="mb-6">
//         <label
//           className={`block text-sm font-medium mb-2 ${
//             isDarkMode ? 'text-slate-400' : 'text-gray-600'
//           }`}
//         >
//           Transfer Amount (XLM)
//         </label>
//         <div className="relative">
//           <DollarSign
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
//             size={16}
//           />
//           <input
//             type="number"
//             value={amount}
//             onChange={handleAmountChange}
//             placeholder="Enter transfer amount"
//             className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent text-sm ${
//               isDarkMode
//                 ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
//                 : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'
//             }`}
//             disabled={isProcessing}
//             min={0}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-4 gap-3 mb-6">
//         {[25, 50, 75, 100].map((pct) => (
//           <button
//             key={pct}
//             onClick={() => handleQuickAmount(pct)}
//             className={`py-2 text-sm rounded-lg font-semibold transition-colors ${
//               isDarkMode
//                 ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//             disabled={isProcessing}
//           >
//             {pct}%
//           </button>
//         ))}
//       </div>

//       <div
//         className={`flex items-center justify-between mb-6 p-4 rounded-lg border ${
//           isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-100'
//         }`}
//       >
//         <div className="flex items-center space-x-3">
//           <Wallet
//             className={action === 'buy' ? 'text-emerald-400' : 'text-red-400'}
//             size={20}
//           />
//           <span
//             className={`text-md font-semibold ${
//               isDarkMode ? 'text-slate-400' : 'text-gray-600'
//             }`}
//           >
//             {action === 'buy'
//               ? 'Available Capital (Prime Reserve)'
//               : 'Available Smart Fund Holdings'}
//           </span>
//         </div>
//         <span
//           className={`text-md font-bold ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}
//         >
//           {action === 'buy'
//             ? `${formatUnits(balance)} XLM`
//             : `$${formatUnits(availableHoldings)}`}
//         </span>
//       </div>

//       <div className="flex justify-center">
//         <button
//           onClick={handleTrade}
//           disabled={isProcessing || parseFloat(amount) < 1}
//           className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-3 text-sm transition-colors ${
//             parseFloat(amount) < 1
//               ? 'opacity-50 cursor-not-allowed'
//               : isProcessing
//               ? isDarkMode
//                 ? 'bg-emerald-700 text-white cursor-not-allowed'
//                 : 'bg-emerald-400 text-white cursor-not-allowed'
//               : isDarkMode
//               ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30'
//               : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
//           }`}
//         >
//           {isProcessing ? (
//             <>
//               <Zap className="animate-spin" size={20} />
//               <span>Processing Transfer...</span>
//             </>
//           ) : (
//             <>
//               <Zap className="fill-current" size={20} />
//               <span>
//                 Execute{' '}
//                 {action === 'buy'
//                   ? 'Transfer to Smart Fund'
//                   : 'Transfer to Prime Reserve'}
//               </span>
//             </>
//           )}
//         </button>
//       </div>
//     </>
//   );
// };


// const TradeHistory = ({ tradeHistory, showTradeDetails, setShowTradeDetails, clearTradeHistory, isDarkMode, formatUnits }) => {
//   const [isClearModalVisible, setIsClearModalVisible] = useState(false);

//   const getTradeIcon = (type) => {
//     switch (type) {
//       case 'buy': return <TrendingUp size={14} className="text-emerald-400" />;
//       case 'sell': return <Activity size={14} className="text-red-400" />;
//       default: return <ArrowUpDown size={14} className="text-gray-400" />;
//     }
//   };

//   const getTradeStatusColor = (type) => {
//     switch (type) {
//       case 'buy': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
//       case 'sell': return 'from-red-500/20 to-red-600/10 border-red-500/30';
//       default: return 'from-gray-500/20 to-gray-600/10 border-gray-500/30';
//     }
//   };

//   const handleClearClick = () => {
//     setIsClearModalVisible(true);
//   };

//   const handleClearConfirm = () => {
//     clearTradeHistory();
//     setIsClearModalVisible(false);
//   };

//   const handleClearCancel = () => {
//     setIsClearModalVisible(false);
//   };

//   return (
//     <div className={`p-2 border-b ${isDarkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}>
//       <div className="flex items-center justify-between space-x-1">
//         <div className={`p-1 rounded-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
//           <History size={14} />
//         </div>
//         <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           Total Trades {tradeHistory.length}
//         </h3>
//         <button
//           onClick={handleClearClick}
//           className={`group flex items-center px-2 py-1 rounded-sm font-medium text-xs transition-all duration-200 transform hover:scale-102 hover:shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-500/10' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-red-500/10'}`}
//         >
//           <Trash2 size={10} className="mr-1 group-hover:animate-pulse" />
//           Clear
//         </button>
//       </div>
//       <div className="p-4 overflow-x-hidden">
//         {tradeHistory.length > 0 ? (
//           <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-700/20 mx-2">
//             {tradeHistory.map((trade, index) => (
//               <div
//                 key={trade?.id ?? `trade-${index}`}
//                 onClick={() => setShowTradeDetails(trade || null)}
//                 className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border backdrop-blur-sm mx-1 ${isDarkMode ? `bg-gradient-to-r ${getTradeStatusColor(trade?.type)} hover:bg-slate-700/50 border-slate-600/30` : `bg-gradient-to-r ${getTradeStatusColor(trade?.type)} hover:bg-gray-50/80 border-gray-300/30`} hover:border-current hover:shadow-md break-words`}
//               >
//                 <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20 ${isDarkMode ? 'bg-slate-600 text-slate-200 border-2 border-slate-800' : 'bg-white text-gray-700 border-2 border-gray-200'} shadow-sm`}>
//                   {tradeHistory.length - index}
//                 </div>
//                 <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${trade?.status === 'complete' ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></div>
//                 <div className="absolute top-1 right-1 w-2 h-2 opacity-20 overflow-hidden rounded-full">
//                   <div className="w-full h-full rounded-full bg-current animate-pulse"></div>
//                 </div>
//                 <div className="flex justify-between items-center relative z-10 ml-2">
//                   <div className="flex items-center space-x-2 min-w-0 flex-1">
//                     <div className="flex items-center space-x-2">
//                       {getTradeIcon(trade?.type)}
//                       <div className="min-w-0">
//                         <span className={`font-bold text-sm ${trade?.type === 'buy' ? 'text-emerald-400' : trade?.type === 'sell' ? 'text-red-400' : 'text-gray-400'}`}>
//                           {(trade?.type || 'Unknown').charAt(0).toUpperCase() + (trade?.type || 'unknown').slice(1)}
//                         </span>
//                         <div className="flex items-center space-x-1 mt-0.5">
//                           <Hash size={14} className={`${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`} />
//                           <span className={`text-sm font-mono truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                             ID ({(trade?.id ?? 'unknown').toString().slice(-8)})
//                           </span>
//                           <span className={`text-xs font-medium ${trade?.status === 'complete' ? 'text-emerald-500' : 'text-yellow-500'}`}>
//                             {trade?.status === 'complete' ? 'Complete' : '⌛ Pending'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right flex-shrink-0 ml-3">
//                     <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
//                       XLM {formatUnits(trade?.amount ?? 0)} units
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className={`p-4 text-center rounded-lg relative overflow-hidden mx-2 ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-gray-50/50 to-gray-100/50'}`}>
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-current animate-pulse"></div>
//               <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-current animate-pulse delay-1000"></div>
//             </div>
//             <div className="relative z-10">
//               <div className={`mx-auto mb-3 p-3 rounded-full w-fit ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200/50'}`}>
//                 <History className="text-gray-400" size={24} />
//               </div>
//               <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
//                 No Trades Yet
//               </h4>
//               <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
//                 Your trading history will appear here
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <Modal
//         title={
//           <div className="flex items-center space-x-2">
//             <Trash2 size={16} className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
//             <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Confirm Clear Trade History
//             </span>
//           </div>
//         }
//         open={isClearModalVisible}
//         onCancel={handleClearCancel}
//         footer={[
//           <button
//             key="cancel"
//             onClick={handleClearCancel}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
//           >
//             Cancel
//           </button>,
//           <button
//             key="confirm"
//             onClick={handleClearConfirm}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
//           >
//             Confirm
//           </button>,
//         ]}
//         centered
//         width={400}
//         className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
//         styles={{
//           content: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             borderRadius: '12px',
//             boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
//             padding: 0,
//           },
//           header: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             marginBottom: 0,
//           },
//           body: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             color: isDarkMode ? '#e2e8f0' : '#1f2937',
//             padding: '16px',
//           },
//           footer: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '8px',
//           },
//         }}
//         closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
//       >
//         <div className="space-y-3">
//           <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
//             Are you sure you want to clear your trade history? This action will permanently delete all trade records from the database and cannot be undone.
//           </p>
//         </div>
//       </Modal>
      
//       <Modal
//         title={
//           <div className="flex items-center space-x-2">
//             <Activity size={16} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//             <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Trade Details
//             </span>
//           </div>
//         }
//         open={!!showTradeDetails}
//         onCancel={() => setShowTradeDetails(null)}
//         footer={[
//           <button
//             key="close"
//             onClick={() => setShowTradeDetails(null)}
//             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
//           >
//             Close
//           </button>,
//         ]}
//         centered
//         width={500}
//         className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
//         styles={{
//           content: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             borderRadius: '12px',
//             boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
//             padding: 0,
//           },
//           header: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             marginBottom: 0,
//           },
//           body: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             color: isDarkMode ? '#e2e8f0' : '#1f2937',
//             padding: '16px',
//           },
//           footer: {
//             background: isDarkMode ? '#1e293b' : '#ffffff',
//             borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
//             padding: '12px 16px',
//             display: 'flex',
//             justifyContent: 'flex-end',
//           },
//         }}
//         closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
//       >
//         <div className="space-y-3">
//           {[
//             { icon: Hash, label: 'ID', value: `${(showTradeDetails?.id ?? 'unknown').toString()}` },
//             {
//               icon: ArrowUpDown,
//               label: 'Type',
//               value: (showTradeDetails?.type || 'Unknown').charAt(0).toUpperCase() + (showTradeDetails?.type || 'unknown').slice(1),
//               colored: true
//             },
//             { icon: DollarSign, label: 'Amount', value: `${formatUnits(showTradeDetails?.amount ?? 0)}` },
//             { icon: Clock, label: 'Time', value: showTradeDetails?.timestamp ?? 'Unknown' },
//             {
//               icon: Info,
//               label: 'Status',
//               value: showTradeDetails?.status === 'complete' ? 'Completed' : 'Pending',
//               colored: true
//             }
//           ].map(({ icon: Icon, label, value, colored = false }) => (
//             <div
//               key={label}
//               className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50/50 border border-gray-200/50'}`}
//             >
//               <div className="flex items-center space-x-2">
//                 <Icon size={14} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
//                 <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                   {label}
//                 </span>
//               </div>
//               <span className={`text-sm font-semibold ${colored ? (showTradeDetails?.type === 'buy' || showTradeDetails?.status === 'complete' ? 'text-emerald-400' : showTradeDetails?.type === 'sell' ? 'text-red-400' : 'text-yellow-400') : isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
//                 {value}
//               </span>
//             </div>
//           ))}
//           {showTradeDetails?.lockedAmount && (
//             <div className={`flex items-center justify-between p-2 rounded-lg ${
//               isDarkMode ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-100/50 border border-amber-200/50'
//             }`}>
//               <div className="flex items-center space-x-2">
//                 <Lock className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`} size={14} />
//                 <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
//                   Locked Amount
//                 </span>
//               </div>
//               <span className={`text-sm font-semibold ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
//                 ${formatUnits(showTradeDetails.lockedAmount)}
//               </span>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };





// const NewsAdvertFeed = ({ isDarkMode = false }) => {
//     const [feedItems, setFeedItems] = useState({ news: [], ad: [], alert: [] });
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('news');
//     const [newItemsCount, setNewItemsCount] = useState({ news: 0, ad: 0, alert: 0 });
//     const [recentItemsCount, setRecentItemsCount] = useState({ news: 0, ad: 0, alert: 0 });
//     const [showNewItemsBanner, setShowNewItemsBanner] = useState(false);
//     const [priorityFilter, setPriorityFilter] = useState('all');
//     const [isPaused, setIsPaused] = useState(false);
//     const [updateFrequency, setUpdateFrequency] = useState('medium');
//     const [lastUpdate, setLastUpdate] = useState(0);
//     const [showClearModal, setShowClearModal] = useState(false);
//     const feedRef = useRef(null);
  
//     // News templates
//     const newsTemplates = React.useMemo(() => [
//       {
//         type: 'news',
//         templates: [
//           {
//             title: 'XLM Price Update',
//             content: 'Stellar Lumens shows {change}% movement in the last hour. Trading volume up {volume}%.',
//             priority: 'high',
//             icon: TrendingUp
//           },
//           {
//             title: 'GIMA Bot Performance',
//             content: 'Trading bot reports {accuracy}% success rate with {profit}% average returns this week.',
//             priority: 'medium',
//             icon: BarChart3
//           },
//           {
//             title: 'Market Analysis',
//             content: 'Technical indicators suggest {sentiment} sentiment. RSI at {rsi}, MACD showing {signal}.',
//             priority: 'medium',
//             icon: Activity
//           },
//           {
//             title: 'Network Status',
//             content: 'System uptime: {uptime}%. Processing {tps} transactions per second.',
//             priority: 'low',
//             icon: Globe
//           },
//           {
//             title: 'User Activity',
//             content: '{users} active traders online. Portfolio values increased by {growth}% today.',
//             priority: 'low',
//             icon: Users
//           }
//         ]
//       },
//       {
//         type: 'ad',
//         templates: [
//           {
//             title: 'Premium Features',
//             content: 'Unlock advanced analytics and automated trading. {discount}% off this month!',
//             cta: 'Upgrade Now',
//             priority: 'medium',
//             icon: Zap
//           },
//           {
//             title: 'New Trading Pairs',
//             content: 'Now supporting {pairs} new cryptocurrency pairs. Start trading today!',
//             cta: 'Explore',
//             priority: 'medium',
//             icon: DollarSign
//           },
//           {
//             title: 'Risk Management',
//             content: 'Protect your investments with our new stop-loss features. Free trial available.',
//             cta: 'Try Free',
//             priority: 'medium',
//             icon: AlertCircle
//           }
//         ]
//       },
//       {
//         type: 'alert',
//         templates: [
//           {
//             title: 'Price Alert',
//             content: 'XLM has reached your target price of {price}. Consider your next move.',
//             priority: 'high',
//             icon: AlertCircle
//           },
//           {
//             title: 'Maintenance Notice',
//             content: 'Scheduled maintenance in {hours} hours. Trading will be briefly unavailable.',
//             priority: 'medium',
//             icon: Clock
//           }
//         ]
//       }
//     ], []);
  
//     // Generate random realistic data
//     const generateRandomData = () => ({
//       change: (Math.random() * 20 - 10).toFixed(2),
//       volume: (Math.random() * 50 + 10).toFixed(0),
//       accuracy: (95 + Math.random() * 4).toFixed(1),
//       profit: (Math.random() * 15 + 5).toFixed(1),
//       sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
//       rsi: (30 + Math.random() * 40).toFixed(0),
//       signal: Math.random() > 0.5 ? 'bullish crossover' : 'consolidation',
//       uptime: (99.5 + Math.random() * 0.5).toFixed(2),
//       tps: (1000 + Math.random() * 2000).toFixed(0),
//       users: (500 + Math.random() * 1000).toFixed(0),
//       growth: (Math.random() * 10 + 2).toFixed(1),
//       discount: [10, 15, 20, 25][Math.floor(Math.random() * 4)],
//       pairs: Math.floor(Math.random() * 10 + 5),
//       price: (0.10 + Math.random() * 0.50).toFixed(3),
//       hours: Math.floor(Math.random() * 12 + 1)
//     });
  
//     // Generate a single feed item
//     const generateFeedItem = useCallback((type, timestamp) => {
//       const category = newsTemplates.find(cat => cat.type === type);
//       if (!category) {
//         console.error(`No category found for type: ${type}`);
//         return null;
//       }
//       const template = category.templates[Math.floor(Math.random() * category.templates.length)];
//       const data = generateRandomData();
      
//       let content = template.content;
//       Object.keys(data).forEach(key => {
//         content = content.replace(`{${key}}`, data[key]);
//       });
  
//       return {
//         id: `item_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
//         type,
//         title: template.title,
//         content,
//         timestamp: new Date(timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
//         priority: template.priority || 'medium',
//         cta: template.cta,
//         icon: template.icon,
//         isNew: true
//       };
//     }, [newsTemplates]);
  
//     // Add new items
//     const addNewItems = useCallback(() => {
//       if (isPaused) return;
//       const now = Date.now();
//       if (now - lastUpdate < 10000) return;
  
//       const types = ['news', 'ad', 'alert'];
//       const newItems = { news: [], ad: [], alert: [] };
//       const type = types[Math.floor(Math.random() * types.length)];
//       const timestamp = now;
//       const item = generateFeedItem(type, timestamp);
//       if (item) newItems[type].push(item);
  
//       setFeedItems(prev => ({
//         news: [...newItems.news, ...prev.news].slice(0, 10),
//         ad: [...newItems.ad, ...prev.ad].slice(0, 10),
//         alert: [...newItems.alert, ...prev.alert].slice(0, 10)
//       }));
  
//       setNewItemsCount(prev => ({
//         news: newItems.news.length + prev.news,
//         ad: newItems.ad.length + prev.ad,
//         alert: newItems.alert.length + prev.alert
//       }));
  
//       setRecentItemsCount(prev => ({
//         news: newItems.news.length + prev.news,
//         ad: newItems.ad.length + prev.ad,
//         alert: newItems.alert.length + prev.alert
//       }));
  
//       if (feedRef.current && feedRef.current.scrollTop > 50) {
//         setShowNewItemsBanner(true);
//       }
  
//       setTimeout(() => {
//         setRecentItemsCount(prev => ({
//           news: Math.max(0, prev.news - newItems.news.length),
//           ad: Math.max(0, prev.ad - newItems.ad.length),
//           alert: Math.max(0, prev.alert - newItems.alert.length)
//         }));
//       }, 60000);
  
//       setTimeout(() => {
//         setFeedItems(prev => ({
//           news: prev.news.map(item => ({ ...item, isNew: false })),
//           ad: prev.ad.map(item => ({ ...item, isNew: false })),
//           alert: prev.alert.map(item => ({ ...item, isNew: false }))
//         }));
//       }, 5000);
  
//       setLastUpdate(now);
//     }, [generateFeedItem, isPaused, lastUpdate]);
  
//     // Initial load
//     useEffect(() => {
//       const initialItems = {
//         news: Array.from({ length: 3 }, (_, i) => generateFeedItem('news', Date.now() - (i * 1000 * 60 * 5))),
//         ad: Array.from({ length: 2 }, (_, i) => generateFeedItem('ad', Date.now() - (i * 1000 * 60 * 5))),
//         alert: Array.from({ length: 2 }, (_, i) => generateFeedItem('alert', Date.now() - (i * 1000 * 60 * 5)))
//       };
  
//       setTimeout(() => {
//         setFeedItems({
//           news: initialItems.news.filter(item => item).map(item => ({ ...item, isNew: false })),
//           ad: initialItems.ad.filter(item => item).map(item => ({ ...item, isNew: false })),
//           alert: initialItems.alert.filter(item => item).map(item => ({ ...item, isNew: false }))
//         });
//         setIsLoading(false);
//       }, 1000);
//     }, [generateFeedItem]);
  
//     // Periodic updates
//     useEffect(() => {
//       if (isLoading || isPaused) return;
  
//       const scheduleNext = () => {
//         const intervals = { slow: [30000, 60000], medium: [20000, 30000], fast: [10000, 15000] };
//         const [min, max] = intervals[updateFrequency];
//         const interval = Math.random() * (max - min) + min;
//         return setTimeout(() => {
//           addNewItems();
//           scheduleNext();
//         }, interval);
//       };
  
//       const timeoutId = scheduleNext();
//       return () => clearTimeout(timeoutId);
//     }, [isLoading, isPaused, updateFrequency, addNewItems]);
  
//     const scrollToTop = () => {
//       feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
//       setShowNewItemsBanner(false);
//       setNewItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
//     };
  
//     const togglePause = () => setIsPaused(prev => !prev);
  
//     const handleClearFeed = () => {
//       setShowClearModal(true);
//     };
  
//     const confirmClearFeed = () => {
//       setFeedItems(prev => ({ ...prev, [activeTab]: [] }));
//       setNewItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
//       setRecentItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
//       setShowClearModal(false);
//     };
  
//     const cancelClearFeed = () => {
//       setShowClearModal(false);
//     };
  
//     const getItemBackground = (type, priority, isNew) => {
//       let classes = 'border-l-4 ';
//       if (isNew) classes += isDarkMode ? 'ring-1 ring-blue-500/50 bg-blue-900/20' : 'ring-1 ring-blue-300/50 bg-blue-50/70';
//       if (type === 'ad') return classes + (isDarkMode ? 'border-purple-400 bg-purple-900/20' : 'border-purple-300 bg-purple-50/70');
//       if (type === 'alert') return classes + (isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-300 bg-red-50/70');
//       if (priority === 'high') return classes + (isDarkMode ? 'border-amber-400 bg-amber-900/20' : 'border-amber-300 bg-amber-50/70');
//       return classes + (isDarkMode ? 'border-slate-500 bg-slate-800/20' : 'border-gray-200 bg-gray-50/70');
//     };
  
//     const getItemIcon = (item) => {
//       const IconComponent = item.icon || Info;
//       const colorClass = {
//         news: isDarkMode ? 'text-blue-300' : 'text-blue-500',
//         ad: isDarkMode ? 'text-purple-300' : 'text-purple-500',
//         alert: isDarkMode ? 'text-red-300' : 'text-red-500'
//       }[item.type] || (isDarkMode ? 'text-gray-400' : 'text-gray-500');
//       return <IconComponent size={16} className={colorClass} />;
//     };
  
//     const filteredItems = feedItems[activeTab].filter(item => priorityFilter === 'all' || item.priority === priorityFilter);
  
//     return (
//       <div className={`rounded-lg shadow-md p-4 w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900'}`}>
//         <style jsx>{`
//           .scrollbar-thin::-webkit-scrollbar {
//             width: 6px;
//           }
//           .scrollbar-thin::-webkit-scrollbar-track {
//             background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
//             border-radius: 3px;
//           }
//           .scrollbar-thin::-webkit-scrollbar-thumb {
//             background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
//             border-radius: 3px;
//           }
//           .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//             background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
//           }
//           .sticky-tabs {
//             position: sticky;
//             top: 0;
//             z-index: 10;
//             background: ${isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
//           }
//           @keyframes blink {
//             0%, 100% { opacity: 1; }
//             50% { opacity: 0.3; }
//           }
//           .blink {
//             animation: blink 1.5s infinite;
//           }
//           .dark-modal .ant-modal-content {
//             background-color: #1e293b;
//           }
//           .dark-modal .ant-modal-header {
//             background-color: #1e293b;
//             border-bottom: 1px solid #334155;
//           }
//           .dark-modal .ant-modal-title {
//             color: #f87171;
//           }
//           .light-modal .ant-modal-content {
//             background-color: #f3f4f6;
//           }
//           .light-modal .ant-modal-header {
//             background-color: #f3f4f6;
//             border-bottom: 1px solid #d1d5db;
//           }
//           .light-modal .ant-modal-title {
//             color: #ef4444;
//           }
//         `}</style>
  
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold flex items-center">
//             <Activity className={`mr-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'} ${isPaused ? '' : 'blink'}`} size={20} />
//             Market Updates
//           </h3>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={togglePause}
//               className={`p-1 rounded-full ${isPaused ? (isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600') : (isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600')}`}
//               title={isPaused ? 'Resume updates' : 'Pause updates'}
//             >
//               {isPaused ? <Play size={16} /> : <Pause size={16} />}
//             </button>
//             <button
//               onClick={handleClearFeed}
//               className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
//               title="Clear feed"
//             >
//               <Trash2 size={16} />
//             </button>
//             <div className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600'} ${isPaused ? '' : 'blink'}`}>
//               {isPaused ? 'Paused' : 'Live'}
//             </div>
//           </div>
//         </div>
  
//         {/* Clear Feed Modal */}
//         <Modal
//           title="Confirm Clear Feed"
//           open={showClearModal}
//           onOk={confirmClearFeed}
//           onCancel={cancelClearFeed}
//           okText="Confirm"
//           cancelText="Cancel"
//           className={isDarkMode ? 'dark-modal' : 'light-modal'}
//           okButtonProps={{
//             className: `text-white ${isDarkMode ? 'bg-red-400 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'}`,
//           }}
//           cancelButtonProps={{
//             className: isDarkMode ? 'bg-gray-700 hover:bg-gray-800 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
//           }}
//         >
//           <p className={isDarkMode ? 'text-red-400' : 'text-red-500'}>
//             Are you sure you want to clear the <span className="capitalize">{activeTab}</span> feed? All current items will be permanently deleted and cannot be recovered until new updates are generated.
//           </p>
//         </Modal>
  
//         {/* Controls */}
//         <div className="flex flex-wrap gap-4 mb-4">
//           <div className="flex border-b border-gray-200 dark:border-slate-700 sticky-tabs">
//             {['news', 'ad', 'alert'].map(tab => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? (isDarkMode ? 'border-b-2 border-blue-400 text-blue-300' : 'border-b-2 border-blue-500 text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab} {newItemsCount[tab] > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{newItemsCount[tab]}</span>}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="text-sm">Priority:</label>
//             <select
//               value={priorityFilter}
//               onChange={e => setPriorityFilter(e.target.value)}
//               className={`text-sm p-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-gray-100 text-gray-900'}`}
//             >
//               <option value="all">All</option>
//               <option value="high">High</option>
//               <option value="medium">Medium</option>
//               <option value="low">Low</option>
//             </select>
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="text-sm">Update Speed:</label>
//             <select
//               value={updateFrequency}
//               onChange={e => setUpdateFrequency(e.target.value)}
//               className={`text-sm p-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-gray-100 text-gray-900'}`}
//             >
//               <option value="slow">Slow</option>
//               <option value="medium">Medium</option>
//               <option value="fast">Fast</option>
//             </select>
//           </div>
//         </div>
  
//         {/* New Items Banner */}
//         {showNewItemsBanner && newItemsCount[activeTab] > 0 && (
//           <div className={`mb-4 p-2 rounded text-sm text-center cursor-pointer ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`} onClick={scrollToTop}>
//             {newItemsCount[activeTab]} new {activeTab} update{newItemsCount[activeTab] > 1 ? 's' : ''} • Click to view
//           </div>
//         )}
  
//         {/* Feed Content */}
//         <div className="h-40 overflow-y-auto scrollbar-thin" ref={feedRef}>
//           {isLoading ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map((_, index) => (
//                 <div key={index} className={`p-3 rounded ${isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50/50'} animate-pulse`}>
//                   <div className={`h-4 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
//                   <div className={`h-3 rounded w-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
//                 </div>
//               ))}
//             </div>
//           ) : filteredItems.length === 0 ? (
//             <div className={`text-sm text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
//               No {priorityFilter !== 'all' ? `${priorityFilter} priority` : ''} items in {activeTab} tab
//             </div>
//           ) : (
//             filteredItems.map(item => (
//               <div key={item.id} className={`p-3 mb-2 rounded ${getItemBackground(item.type, item.priority, item.isNew)}`}>
//                 <div className="flex items-start space-x-3">
//                   <div className="mt-1">{getItemIcon(item)}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h4 className="text-sm font-semibold">{item.title}</h4>
//                       <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${{
//                         high: isDarkMode ? 'bg-amber-600 text-amber-100' : 'bg-amber-500 text-white',
//                         medium: isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-500 text-white',
//                         low: isDarkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-500 text-white'
//                       }[item.priority]}`}>
//                         {item.priority}
//                       </span>
//                       {item.isNew && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-500 text-white'}`}>NEW</span>}
//                     </div>
//                     <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{item.content}</p>
//                     <div className="flex justify-between items-center mt-2">
//                       <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.timestamp}</span>
//                       {item.cta && (
//                         <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
//                           {item.cta}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
  
//         {/* Footer */}
//         <div className={`mt-4 text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
//           {filteredItems.length} {activeTab} items {priorityFilter !== 'all' ? `(${priorityFilter} priority)` : ''} • {recentItemsCount[activeTab]} added in last minute • Update: {updateFrequency}
//           {recentItemsCount[activeTab] > 3 && !isPaused && <span className="ml-2 text-red-500">High activity, consider pausing or slowing updates</span>}
//         </div>
//       </div>
//     );
//   };

  

// const Footer = ({ balance, holdings, isDarkMode,  formatUnits, escrowedFunds}) => {

//   return (
//     <footer className={`w-full py-6 px-4 md:px-8 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-center mb-6">
//           <Info className="mr-2 text-blue-400" size={20} />
//           <h2 className="text-lg font-bold">About the Trade Component</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <h3 className="text-base font-semibold mb-3">Key Features</h3>
//             <div className="space-y-3">
//               <div className="flex items-start space-x-2">
//                 <Target className="text-emerald-400 mt-1 flex-shrink-0" size={14} />
//                 <div>
//                   <h4 className="font-medium text-sm">Buy & Sell Orders</h4>
//                   <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                     Real-time balance validation for seamless trading
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <Shield className="text-blue-400 mt-1 flex-shrink-0" size={14} />
//                 <div>
//                   <h4 className="font-medium text-sm">Smart Validation</h4>
//                   <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                     Prevents invalid trades with input checks
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <Clock className="text-yellow-400 mt-1 flex-shrink-0" size={14} />
//                 <div>
//                   <h4 className="font-medium text-sm">Confirmation Flow</h4>
//                   <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                     Double-check system to avoid errors
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-base font-semibold mb-3">Trading Info</h3>
//             <div className="space-y-3">
//               <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
//                 <h4 className="font-semibold text-sm mb-1">Quick Amount Selection</h4>
//                 <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                   Use 25%, 50%, 75%, 100% buttons for fast trading
//                 </p>
//               </div>
//               <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
//                 <h4 className="font-semibold text-sm mb-1">Real-time Feedback</h4>
//                 <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//                   Instant success/error notifications (4s)
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-base font-semibold mb-3">Account Status</h3>
//             <div className="space-y-3">
//               <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 border-l-4 border-emerald-400' : 'bg-emerald-50 border-l-4 border-emerald-500'}`}>
//                 <h4 className="font-semibold text-sm mb-1 text-emerald-500">Live Mode</h4>
//                 <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
//                   Connected to your GIMA trading bot
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
//                   <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Prime Reserve</div>
//                   <div className="font-semibold text-sm">XLM {formatUnits(balance)}</div>
//                 </div>
//                 <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
//                   <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Smart Fund</div>
                
//                   <div className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
//                     (${formatUnits(holdings)} available)
//                   </div>


//                         <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
//                           Locked Funds
//                         </span>
                 
                
//                         <span className={`text-xs semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
//                           ${formatUnits(escrowedFunds)}
//                         </span>
                  

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
//           <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
//             Powered by GIMA AI Trading Platform
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// const CustomAlert = ({ alertType, alertMessage, setShowAlert, isDarkMode }) => {
//   return (
//     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out max-w-sm w-full mx-4">
//       <div className={`${alertType === 'error' ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500' : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500'} text-white px-4 py-2 rounded-lg shadow-2xl backdrop-blur-sm border border-white/20`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             {alertType === 'error' ? (
//               <AlertCircle className="w-4 h-4" />
//             ) : (
//               <CheckCircle className="w-4 h-4" />
//             )}
//             <span className="font-medium text-sm">{alertMessage}</span>
//           </div>
//           <button
//             onClick={() => setShowAlert(false)}
//             className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };




// const TradeConfirmationModal = ({
//   isDarkMode, action, amount,  formatUnits, setShowConfirm, confirmTrade, isProcessing
// }) => {

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
//       <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-lg p-4 max-w-sm w-full mx-4 shadow-2xl border`}>
//         <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
//           Confirm {action.charAt(0).toUpperCase() + action.slice(1)} Trade
//         </h3>
//         <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
//           You are about to {action} ${formatUnits(amount)} worth of assets.
//         </p>
    
//         <div className="flex justify-end space-x-2">
//           <button
//             onClick={() => setShowConfirm(false)}
//             className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={confirmTrade}
//             className={`px-3 py-1 rounded-lg flex items-center space-x-1 text-sm ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
//             disabled={isProcessing}
//           >
//             {isProcessing ? (
//               <>
//                 <Zap className="w-4 h-4 animate-spin" />
//                 <span>Processing...</span>
//               </>
//             ) : (
//               'Confirm'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TradePanel;






























import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TrendingUp, DollarSign, Wallet, AlertCircle,
  CheckCircle, X, Zap, Info, Shield, Clock, Target, BarChart2,
  ChevronDown, ChevronUp, Flame, History, Trash2, Hash, ArrowUpDown, Activity, Users, Globe, BarChart3,
  Pause, Play, Lock, 
  Sparkles, ArrowRight,
  ArrowLeftCircle,
  ArrowUpRight
} from 'lucide-react';
import { Modal, Button } from 'antd'; 
import Tooltip from '@mui/material/Tooltip';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';


const TradePanel = ({ onTrade, balance = 0, holdings = 0, lockedHoldings = 0, isDarkMode = true }) => {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('buy');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGimaDetails, setShowGimaDetails] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [showTradeDetails, setShowTradeDetails] = useState(null);
  const [tradeStreak, setTradeStreak] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(balance);
  // const [uptime, setUptime] = useState(99.95);
  const [celebrations, setCelebrations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sellAttempts, setSellAttempts] = useState(0);
  const [lastSellDate, setLastSellDate] = useState(null);
  const [isSellLocked, setIsSellLocked] = useState(false);
  const [escrowedFunds, setEscrowedFunds] = useState(0);

  const auth = getAuth();
  const API_BASE_URL = 'http://localhost:5000';
  const availableHoldings = holdings - lockedHoldings;
  const MAX_SELL_ATTEMPTS = 1;



  
  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE_URL}/api/get_trades/${userId}`)
        .then(response => {
          const trades = Array.isArray(response.data.trades_recent) ? response.data.trades_recent : [];
          setTradeHistory(trades);
        })
        .catch(error => {
          console.error('Error fetching trades:', error);
          setTradeHistory([]);
          showCustomAlert('Failed to load trade history.', 'error');
        });

      axios.get(`${API_BASE_URL}/api/get_streak/${userId}`)
        .then(response => {
          setTradeStreak(response.data.streak || 0);
        })
        .catch(error => {
          console.error('Error fetching streak:', error);
          setTradeStreak(0);
          showCustomAlert('Failed to load trade streak.', 'error');
        });
    }
  }, [userId]);


  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Load sell attempts from storage
        axios.get(`${API_BASE_URL}/api/get_sell_attempts/${user.uid}`)
          .then(response => {
            const today = new Date().toDateString();
            const lastAttemptDate = response.data.lastSellDate ? new Date(response.data.lastSellDate).toDateString() : null;
            
            if (lastAttemptDate === today) {
              setSellAttempts(response.data.attempts || 0);
              setLastSellDate(response.data.lastSellDate);
              setIsSellLocked(response.data.attempts >= MAX_SELL_ATTEMPTS);
            } else {
              setSellAttempts(0);
              setLastSellDate(null);
              setIsSellLocked(false);
            }
          })
          .catch(error => {
            console.error('Error loading sell attempts:', error);
          });
      } else {
        setUserId(null);
        showCustomAlert('Please log in to save trades and streaks.', 'error');
      }
    });
    return () => unsubscribe();
  }, [auth]);



  const checkSellLimit = useCallback(() => {
    const today = new Date().toDateString();
    const lastSellDay = lastSellDate ? new Date(lastSellDate).toDateString() : null;
    
    // If it's a new day, reset the counter
    if (lastSellDay !== today) {
      setSellAttempts(0);
      setLastSellDate(null);
      setIsSellLocked(false);
      return true;
    }
    


// Check if limit reached 
if (sellAttempts >= MAX_SELL_ATTEMPTS) {
  setIsSellLocked(true);
  return false;
}

    return true;
  }, [lastSellDate, sellAttempts]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    if (action === 'sell') {
      // Prevent selling more than available holdings
      const maxSellable = Math.max(0, holdings - lockedHoldings);
      if (parseFloat(value) > maxSellable) {
        showCustomAlert(`Cannot transfer more than available holdings: $${formatUnits(maxSellable)}`, 'error');
        return;
      }
    }
    
    // Original amount change logic
    if (value === '' || parseFloat(value) >= 0) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (percentage) => {
    let availableAmount;
    if (action === 'buy') {
      availableAmount = balance;
    } else {
      availableAmount = Math.max(0, holdings - lockedHoldings);
    }
    
    const quickAmount = (availableAmount * percentage / 100).toFixed(action === 'buy' ? 2 : 6);
    setAmount(quickAmount);
  };

  const handleTrade = () => {
    if (action === 'sell') {
      const canSell = checkSellLimit();
      if (!canSell) {
        showCustomAlert('Daily sell limit reached (1 sells per day). Please try again tomorrow.', 'error');
        return;
      }
    }
    setShowConfirm(true);
  };

  const confirmTrade = async () => {
    setShowConfirm(false);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      showCustomAlert('Please enter a valid amount', 'error');
      return;
    }

    if (action === 'buy' && numAmount > balance) {
      showCustomAlert(`Insufficient balance. Available: $${formatUnits(balance)}`, 'error');
      return;
    }

    if (action === 'sell' && numAmount > availableHoldings) {
      showCustomAlert(`Insufficient available holdings. Available: $${formatUnits(availableHoldings)}`, 'error');
      return;
    }

    setIsProcessing(true);

    // Track sell attempts if this is a sell action
    if (action === 'sell') {
      const today = new Date().toDateString();
      const lastSellDay = lastSellDate ? new Date(lastSellDate).toDateString() : null;
      
      let newAttempts = sellAttempts + 1;
      const newLastSellDate = new Date();

      // Reset counter if it's a new day
      if (lastSellDay !== today) {
        newAttempts = 1;
      }

      setSellAttempts(newAttempts);
      setLastSellDate(newLastSellDate);
      
      // Check if we've reached the limit
      if (newAttempts >= MAX_SELL_ATTEMPTS) {
        setIsSellLocked(true);
      }

      // Save to backend if logged in
      if (userId) {
        try {
          await axios.post(`${API_BASE_URL}/api/save_sell_attempts`, {
            userId,
            attempts: newAttempts,
            lastSellDate: newLastSellDate
          });
        } catch (error) {
          console.error('Error saving sell attempts:', error);
        }
      }
    }

    const tradeId = Date.now().toString();
    try {
      const pendingTrade = {
        id: tradeId,
        type: action,
        amount: numAmount,
        timestamp: new Date().toLocaleTimeString(),
        status: 'pending',
        lockedAmount: action === 'sell' ? numAmount : 0
      };

      setTradeHistory(prev => [pendingTrade, ...prev.slice(0, 9)]);

      const newStreak = tradeStreak + 1;
      setTradeStreak(newStreak);
      setAmount('');

      if (userId) {
        await axios.post(`${API_BASE_URL}/api/save_trade`, { userId, trade: pendingTrade });
        await axios.post(`${API_BASE_URL}/api/save_streak`, { userId, streak: newStreak });
      }

      const response = await onTrade(action, numAmount);
      if (response?.newLockedHoldings !== undefined) {
        // Update locked holdings in parent component if needed
      }

      const completedTrade = {
        ...pendingTrade,
        status: 'complete'
      };

      setTradeHistory(prev => {
        const updated = [...prev];
        const index = updated.findIndex(t => t.id === tradeId);
        if (index !== -1) updated[index] = completedTrade;
        return updated;
      });

      if (userId) {
        await axios.post(`${API_BASE_URL}/api/save_trade`, { userId, trade: completedTrade });
      }

      showCustomAlert(
        `${action.charAt(0).toUpperCase() + action.slice(1)} order executed successfully for ${formatUnits(numAmount)} units!`,
        'success'
      );

      triggerCelebration();

      // After successful trade, fetch updated user data
      if (action === 'sell') {
        setTimeout(async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
            const result = response.data;
            if (result.status === 'success') {
              const fetchedLockedHoldings = result.user.locked_holdings || result.newLockedHoldings || 0;
              setEscrowedFunds(fetchedLockedHoldings);
            }
          } catch (error) {
            console.error('Error fetching updated user data:', error);
          }
        }, 1000);
      }
    } catch (error) {
      setTradeHistory(prev => prev.filter(t => t.id !== tradeId));
      console.error('Trade execution error:', error);
      showCustomAlert(`Trade execution failed: ${error.message}`, 'error');
      setTradeStreak(0);

      if (userId) {
        try {
          await axios.delete(`${API_BASE_URL}/api/delete_trade`, {
            data: { userId, tradeId }
          });
        } catch (deleteError) {
          console.error("Error deleting pending trade:", deleteError);
        }
        await axios.post(`${API_BASE_URL}/api/save_streak`, { userId, streak: 0 });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatUnits = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    
    const absValue = Math.abs(num);
    let formatted;
    
    if (absValue < 0.0001) formatted = absValue.toFixed(5);
    else if (absValue < 1) formatted = absValue.toFixed(4);
    else if (absValue < 100) formatted = absValue.toFixed(3);
    else formatted = absValue.toFixed(2);
    
    return num < 0 ? `-${formatted}` : formatted;
  };

  const showCustomAlert = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const triggerCelebration = () => {
    const gimaBadgePosition = getGimaStreakBadgePosition();
    const tradeBadgePosition = getTradeStreakBadgePosition();

    const newCelebrations = [];

    const gimaCelebrations = Array(50).fill().map((_, i) => {
      const angle = Math.random() * 360;
      const distance = 150 + Math.random() * 100;
      const endX = Math.cos((angle * Math.PI) / 180) * distance;
      const endY = Math.sin((angle * Math.PI) / 180) * distance - 100;

      return {
        id: `gima-${Date.now()}-${i}`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        startX: gimaBadgePosition.x,
        startY: gimaBadgePosition.y,
        endX: endX,
        endY: endY,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1,
      };
    });

    const tradeCelebrations = Array(50).fill().map((_, i) => {
      const angle = Math.random() * 360;
      const distance = 150 + Math.random() * 100;
      const endX = Math.cos((angle * Math.PI) / 180) * distance;
      const endY = Math.sin((angle * Math.PI) / 180) * distance - 100;

      return {
        id: `trade-${Date.now()}-${i}`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        startX: tradeBadgePosition.x,
        startY: tradeBadgePosition.y,
        endX: endX,
        endY: endY,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1,
      };
    });

    newCelebrations.push(...gimaCelebrations, ...tradeCelebrations);
    setCelebrations((prev) => [...prev, ...newCelebrations]);

    setTimeout(() => {
      setCelebrations((prev) =>
        prev.filter((celeb) => !newCelebrations.some((newCeleb) => newCeleb.id === celeb.id))
      );
    }, 3000);
  };

  const getGimaStreakBadgePosition = () => {
    const streakElement = document.querySelector('.gima-streak-badge');
    if (streakElement) {
      const rect = streakElement.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth / 2, y: 100 };
  };

  const getTradeStreakBadgePosition = () => {
    const streakElement = document.querySelector('.trade-streak-badge');
    if (streakElement) {
      const rect = streakElement.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  const emojis = [
    '🔥', '🎉', '🎊', '✨', '⭐', '🌟', '💫', '🏆', '🥇', '🎖️',
    '👑', '💎', '🚀', '💰', '💸', '🤑', '✅', '🎯', '⚡', '💥'
  ];

  const clearTradeHistory = async () => {
    setTradeHistory([]);
    setTradeStreak(0);
    showCustomAlert('Trade history cleared', 'success');

    if (userId) {
      try {
        await axios.post(`${API_BASE_URL}/api/clear_trades/${userId}`);
      } catch (error) {
        console.error('Error clearing trade history:', error);
        showCustomAlert('Failed to clear trade history.', 'error');
      }
    }
  };

  const calculateProjectedReturns = () => {
    const minReturn = investmentAmount * 0.08;
    const maxReturn = investmentAmount * 0.102;
    return { min: minReturn.toFixed(2), max: maxReturn.toFixed(2) };
  };

  const generateAnimatedGraph = () => {
    return (
      <svg width="40" height="24" viewBox="0 0 40 24" className="ml-2">
        <path
          d="M2,22 L8,16 L14,18 L20,10 L26,14 L32,8 L38,12"
          fill="none"
          stroke={isDarkMode ? "#34d399" : "#10b981"}
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0, 100; 100, 0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    );
  };

  return (
    <div className={`w-full min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'} p-4`}>
      <style jsx>{`
        .animate-shoot-celebration {
          animation: shootCelebration var(--duration) ease-out var(--delay) forwards;
        }
        @keyframes shootCelebration {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {celebrations.map((celeb) => (
        <div
          key={celeb.id}
          className="fixed z-[100] text-xl pointer-events-none animate-shoot-celebration"
          style={{
            left: `${celeb.startX}px`,
            top: `${celeb.startY}px`,
            '--end-x': `${celeb.endX}px`,
            '--end-y': `${celeb.endY}px`,
            '--duration': `${celeb.duration}s`,
            '--delay': `${celeb.delay}s`,
          }}
        >
          {celeb.emoji}
        </div>
      ))}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <div className={`rounded-xl shadow-2xl p-4 ${
              isDarkMode
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
                : 'bg-white border border-gray-200'
            }`}>
              <GIMATradingBot
                isDarkMode={isDarkMode}
                tradeStreak={tradeStreak}
                // uptime={uptime}
                investmentAmount={investmentAmount}
                setInvestmentAmount={setInvestmentAmount}
                showGimaDetails={showGimaDetails}
                setShowGimaDetails={setShowGimaDetails}
                generateAnimatedGraph={generateAnimatedGraph}
                calculateProjectedReturns={calculateProjectedReturns}
              />
            </div>
            
            <div className="mt-4">
              <NewsAdvertFeed isDarkMode={isDarkMode} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div
              className={`rounded-xl shadow-2xl p-4 mb-4 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <TradePanelMain
                isDarkMode={isDarkMode}
                action={action}
                setAction={setAction}
                amount={amount}
                handleAmountChange={handleAmountChange}
                isProcessing={isProcessing}
                handleTrade={handleTrade}
                handleQuickAmount={handleQuickAmount}
                balance={balance}
                holdings={holdings}
                lockedHoldings={lockedHoldings}
                escrowedFunds={escrowedFunds}
                formatUnits={formatUnits}
                tradeStreak={tradeStreak}
                sellAttempts={sellAttempts}
                isSellLocked={isSellLocked}
                setIsSellLocked={setIsSellLocked}
                MAX_SELL_ATTEMPTS={MAX_SELL_ATTEMPTS}
              />
            </div>
            <div
              className={`rounded-xl shadow-2xl p-4 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <TradeHistory
                isDarkMode={isDarkMode}
                tradeHistory={tradeHistory}
                showTradeDetails={showTradeDetails}
                setShowTradeDetails={setShowTradeDetails}
                clearTradeHistory={clearTradeHistory}
                formatUnits={formatUnits}
              />
            </div>
          </div>
          <div className="lg:col-span-12 mt-4">
            <div
              className={`rounded-xl shadow-2xl p-4 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Footer
                isDarkMode={isDarkMode}
                balance={balance}
                holdings={holdings}
                lockedHoldings={lockedHoldings}
                formatUnits={formatUnits}
                escrowedFunds={escrowedFunds}
              />
            </div>
          </div>
        </div>
        {showAlert && (
          <CustomAlert
            alertType={alertType}
            alertMessage={alertMessage}
            setShowAlert={setShowAlert}
            isDarkMode={isDarkMode}
          />
        )}
        {showConfirm && (
          <TradeConfirmationModal
            isDarkMode={isDarkMode}
            action={action}
            amount={amount}
            balance={balance}
            holdings={holdings}
            lockedHoldings={lockedHoldings}
            formatUnits={formatUnits}
            setShowConfirm={setShowConfirm}
            confirmTrade={confirmTrade}
            isProcessing={isProcessing}
            sellAttempts={sellAttempts}
          />
        )}
      </div>
    </div>
  );
};

const GIMATradingBot = ({
  isDarkMode, tradeStreak, uptime, investmentAmount, setInvestmentAmount,
  showGimaDetails, setShowGimaDetails, generateAnimatedGraph, calculateProjectedReturns
}) => {
  return (
    <div className={`mb-4 p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-700/50 shadow-lg shadow-emerald-500/10' : 'bg-emerald-50 border border-emerald-200 shadow-lg shadow-emerald-200/20'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <BarChart2 className="mr-2 text-emerald-400" size={24} />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Powered by GIMA Trading Bot
          </h2>
        </div>
        {tradeStreak > 0 && (
          <div className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-1 rounded-full ">
            <Flame className="text-white mr-1" size={14} />
            <span className="text-white text-xs font-bold">{tradeStreak}x Streak</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
          ⭐ Trusted by over 10,000 traders worldwide
        </div>
        <div className={`flex items-center ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
          <div className="relative w-2 h-2 mr-2">
            <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'} animate-ping`}></div>
            <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
          </div>
          {/* <span className="font-bold text-sm">{uptime.toFixed(2)}%</span> */}
          <span className="ml-1 text-xs">Uptime</span>
        </div>
      </div>
      <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-3`}>
        This application connects to the GIMA trading bot, leveraging real-time market data for automated trading with cutting-edge AI strategies.
      </p>
      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-emerald-900/50 border-l-4 border-emerald-400' : 'bg-emerald-100 border-l-4 border-emerald-500'}`}>
        <div className="flex items-center">
          <h4 className={`font-semibold mb-2 text-emerald-500 text-base`}>
            Exceptional Performance
          </h4>
          {generateAnimatedGraph()}
        </div>
        <p className={`text-xl font-bold bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-700'} animate-pulse`}>
          8-10.2% Monthly Returns
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-2`}>
          Experience consistent profits with a proven track record of no losses, powered by 24/7 market monitoring.
        </p>
      </div>
      <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Profit Calculator
        </h4>
        <div className="mb-2">
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Investment Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-black'}`}
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100000"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          className="w-full accent-emerald-500"
        />
        <div className="mt-2">
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Projected Monthly Returns:
          </p>
          <p className={`text-base font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ${calculateProjectedReturns().min} - ${calculateProjectedReturns().max}
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowGimaDetails(!showGimaDetails)}
        className={`mt-4 flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'}`}
      >
        {showGimaDetails ? (
          <>
            <ChevronUp size={18} />
            <span>Hide Details</span>
          </>
        ) : (
          <>
            <ChevronDown size={18} />
            <span>Discover Why GIMA Excels</span>
          </>
        )}
      </button>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <BarChart2 size={16} className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose GIMA Trading Bot?
            </span>
          </div>
        }
        open={showGimaDetails}
        onCancel={() => setShowGimaDetails(false)}
        footer={[
          <button
            key="close"
            onClick={() => setShowGimaDetails(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
          >
            Close
          </button>,
        ]}
        centered
        width={500}
        className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
        styles={{
          content: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: 0,
          },
          header: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            marginBottom: 0,
          },
          body: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#e2e8f0' : '#1f2937',
            padding: '16px',
          },
          footer: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
          },
        }}
        closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
      >
        <div className="space-y-3">
          {[
            {
              icon: CheckCircle,
              label: 'Unmatched Returns',
              value: 'Achieve 8-10.2% monthly profits with a flawless no-loss record.'
            },
            {
              icon: CheckCircle,
              label: 'AI-Driven Strategies',
              value: 'Advanced algorithms analyze market trends for optimal trade execution.'
            },
            {
              icon: CheckCircle,
              label: '24/7 Monitoring',
              value: 'Never miss a market opportunity with round-the-clock surveillance.'
            },
            {
              icon: CheckCircle,
              label: 'User-Friendly',
              value: 'Seamless integration designed for traders of all experience levels.'
            },
            {
              icon: CheckCircle,
              label: 'Risk Management',
              value: 'Built-in safeguards protect your investments and minimize risks.'
            }
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className={`flex items-start space-x-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50/50 border border-gray-200/50'}`}
            >
              <Icon size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {label}
                </span>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-1`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};









// const TradePanelMain = ({
//   isDarkMode,
//   action,
//   setAction,
//   amount,
//   handleAmountChange,
//   isProcessing,
//   handleTrade,
//   handleQuickAmount,
//   balance,
//   holdings,
//   lockedHoldings = 0,
//   escrowedFunds,
//   formatUnits,
//   tradeStreak,
//   sellAttempts,
//   isSellLocked,
//   MAX_SELL_ATTEMPTS
// }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setIsModalVisible(false);
//   };

//   const availableHoldings = Math.max(0, holdings - lockedHoldings);

//   return (
//     <>
//       <div className="flex items-center justify-between mb-6">
//         <h2
//           className={`text-xl font-semibold flex items-center ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}
//         >
//           <TrendingUp className="mr-3 text-emerald-400" size={24} /> Internal Fund
//           Transfer
//         </h2>
//         <div
//           className={`text-sm px-3 py-1 rounded-lg font-medium flex items-center select-none ${
//             isDarkMode
//               ? 'bg-slate-800 text-slate-400'
//               : 'bg-gray-200 text-gray-700'
//           }`}
//         >
//           {action === 'buy' ? (
//             <>
//               <ArrowRight className="mx-1" size={16} />
//               Prime Reserve → Smart Fund
//             </>
//           ) : (
//             <>
//               <ArrowRight className="mx-1" size={16} />
//               Smart Fund → Prime Reserve
//             </>
//           )}
//         </div>
//         {tradeStreak > 0 && (
//           <div className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full">
//             <Flame className="text-white mr-2" size={16} />
//             <span className="text-white text-sm font-semibold">
//               {tradeStreak}x Streak
//             </span>
//           </div>
//         )}
//       </div>



//       <div
//   className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 p-4 sm:p-5 rounded-lg shadow-md ${
//     isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700'
//   }`}
// >
//   <section>
//     <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
//       <section>
//         <h3 className="text-base sm:text-lg font-semibold mb-1">Prime Reserve</h3>
//         <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
//           Current Balance
//         </p>
//         <p className="text-xl sm:text-2xl font-bold mb-2">{formatUnits(balance)} XLM</p>
//         <p className="text-xs sm:text-sm text-gray-400 mb-4">
//           Secure Holdings • Main Account
//         </p>
//         <p className="text-xs sm:text-sm">
//           <span className="font-semibold">Account Type:</span> Primary Wallet
//         </p>
//         <p className="text-xs sm:text-sm mb-1">
//           <span className="font-semibold">Status:</span> Active
//         </p>
//       </section>
//     </div>
//   </section>

//   <section>
//     <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
//       <h3 className="text-base sm:text-lg font-semibold mb-1 flex items-center">
//         <Sparkles className="mr-2 text-amber-400" size={16} />
//         Smart Fund
//       </h3>
//       <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
//         Current Value
//       </p>
//       <p className="text-xl sm:text-2xl font-bold mb-2">${formatUnits(holdings)}</p>
//       <p className="text-xs sm:text-sm text-gray-400 mb-4">
//         AI-Powered Trading • Automated Portfolio
//       </p>
//       <p className="text-xs sm:text-sm mb-1">
//         <span className="font-semibold">Status:</span> Active
//       </p>
//       <Button
//         type="primary"
//         onClick={showModal}
//         className="mt-4 w-full sm:w-auto"
//         style={{
//           backgroundColor: isDarkMode ? '#059669' : '#10B981',
//           borderColor: isDarkMode ? '#059669' : '#10B981',
//         }}
//       >
//         View Smart Fund Details
//       </Button>
//     </div>
//   </section>

//   <Modal
//     title="Smart Fund Details"
//     open={isModalVisible}
//     onCancel={handleModalClose}
//     footer={[
//       <Button key="close" onClick={handleModalClose}>
//         Close
//       </Button>,
//     ]}
//     className={isDarkMode ? 'ant-modal-dark' : ''}
//     width="90%"
//     style={{ maxWidth: '600px' }}
//   >
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Total Holdings:</span> ${formatUnits(holdings)}
//     </p>
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Escrowed Funds:</span> ${formatUnits(escrowedFunds)}
//     </p>
//     <p className="text-xs sm:text-sm">
//       <span className="font-semibold">Available Holdings:</span> ${formatUnits(availableHoldings)}
//     </p>
//     <p className="text-xs sm:text-sm mt-4">
//       The Smart Fund utilizes the Gima Trading Bot, an advanced AI system designed to optimize trading strategies based on market trends. Funds in escrow are actively managed by the bot and may be subject to lock-up periods during trading cycles.
//     </p>
//     <div className="flex items-center justify-between mb-6">
//       <div className="flex items-center space-x-2">
//         <div
//           className={`w-2 h-2 rounded-full ${
//             isDarkMode ? 'bg-amber-400' : 'bg-amber-500'
//           } animate-pulse`}
//         ></div>
//         <span
//           className={`text-xs sm:text-sm font-medium ${
//             isDarkMode ? 'text-slate-300' : 'text-slate-700'
//           }`}
//         >
//           Locked Funds
//         </span>
//       </div>
//       <div className="text-right">
//         <span
//           className={`text-xl sm:text-2xl font-bold ${
//             isDarkMode ? 'text-amber-300' : 'text-amber-600'
//           }`}
//         >
//           ${formatUnits(escrowedFunds)}
//         </span>
//       </div>
//     </div>
//   </Modal>

//   <style jsx>{`
//     @keyframes shimmer {
//       0% {
//         transform: translateX(-100%);
//       }
//       100% {
//         transform: translateX(100%);
//       }
//     }
//     .animate-shimmer {
//       animation: shimmer 2s infinite;
//     }

//     .ant-modal-dark .ant-modal-content {
//       background-color: #1e293b;
//       color: #e2e8f0;
//     }
//     .ant-modal-dark .ant-modal-header {
//       background-color: #1e293b;
//       color: #e2e8f0;
//       border-bottom: 1px solid #334155;
//     }
//     .ant-modal-dark .ant-modal-title {
//       color: #e2e8f0;
//     }
//     .ant-modal-dark .ant-modal-close-x {
//       color: #e2e8f0;
//     }
//     /* Ensure modal is responsive */
//     .ant-modal {
//       width: 90% !important;
//       max-width: 600px;
//     }
//     @media (max-width: 640px) {
//       .ant-modal {
//         padding: 0 8px;
//       }
//     }
//   `}</style>
// </div>


//       <div className="flex space-x-4 mb-6">
//         <Tooltip title="Move capital into Smart Fund for automated trading" arrow>
//           <button
//             onClick={() => setAction('buy')}
//             className={`flex-1 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
//               action === 'buy'
//                 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
//                 : isDarkMode
//                 ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//             disabled={isProcessing}
//           >
//             <ArrowRight className="transform rotate-180" size={16} />
//             Transfer to Smart Fund
//           </button>
//         </Tooltip>

//         <Tooltip 
//           title={isSellLocked ? 
//             "Daily sell limit reached (3 sells per day). Please try again tomorrow." : 
//             "Move funds back to your Prime Reserve"
//           } 
//           arrow
//         >
//           <button
//             onClick={() => setAction('sell')}
            // className={`flex-1 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
            //   action === 'sell'
            //     ? isSellLocked 
            //       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            //       : 'bg-red-600 text-white shadow-lg shadow-red-500/30'
            //     : isDarkMode
            //     ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            //     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            // }`}
//             disabled={isProcessing || isSellLocked}
//           >
//             {isSellLocked ? (
//               <>
//                 <Lock size={16} />
//                 <span>Transfer Locked</span>
//               </>
//             ) : (
//               <>
//                 <ArrowRight size={16} />
//                 <span>Transfer to Prime Reserve</span>
//               </>
//             )}
//           </button>
//         </Tooltip>
//       </div>

//       {action === 'sell' && (
//         <div className={`text-xs mb-4 text-center ${
//           isDarkMode ? 'text-slate-400' : 'text-gray-600'
//         }`}>
//           {isSellLocked ? (
//             <span className="text-red-400">Daily sell limit reached</span>
//           ) : (
//             <span>Sells remaining today: {MAX_SELL_ATTEMPTS - sellAttempts}</span>
//           )}
//         </div>
//       )}

//       <div className="mb-6">
//         <label
//           className={`block text-sm font-medium mb-2 ${
//             isDarkMode ? 'text-slate-400' : 'text-gray-600'
//           }`}
//         >
//           Transfer Amount (XLM)
//         </label>
//         <div className="relative">
//           <DollarSign
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
//             size={16}
//           />
//           <input
//             type="number"
//             value={amount}
//             onChange={handleAmountChange}
//             placeholder="Enter transfer amount"
//             className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent text-sm ${
//               isDarkMode
//                 ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
//                 : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'
//             }`}
//             disabled={isProcessing}
//             min={0}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-4 gap-3 mb-6">
//         {[25, 50, 75, 100].map((pct) => (
//           <button
//             key={pct}
//             onClick={() => handleQuickAmount(pct)}
//             className={`py-2 text-sm rounded-lg font-semibold transition-colors ${
//               isDarkMode
//                 ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//             disabled={isProcessing}
//           >
//             {pct}%
//           </button>
//         ))}
//       </div>

//       <div
//         className={`flex items-center justify-between mb-6 p-4 rounded-lg border ${
//           isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-100'
//         }`}
//       >
//         <div className="flex items-center space-x-3">
//           <Wallet
//             className={action === 'buy' ? 'text-emerald-400' : 'text-red-400'}
//             size={20}
//           />
//           <span
//             className={`text-md font-semibold ${
//               isDarkMode ? 'text-slate-400' : 'text-gray-600'
//             }`}
//           >
//             {action === 'buy'
//               ? 'Available Capital (Prime Reserve)'
//               : 'Available Smart Fund Holdings'}
//           </span>
//         </div>
//         <span
//           className={`text-md font-bold ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}
//         >
//           {action === 'buy'
//             ? `${formatUnits(balance)} XLM`
//             : `$${formatUnits(availableHoldings)}`}
//         </span>
//       </div>

//       <div className="flex justify-center">
//         <button
//           onClick={handleTrade}
//           disabled={isProcessing || parseFloat(amount) < 1}
//           className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-3 text-sm transition-colors ${
//             parseFloat(amount) < 1
//               ? 'opacity-50 cursor-not-allowed'
//               : isProcessing
//               ? isDarkMode
//                 ? 'bg-emerald-700 text-white cursor-not-allowed'
//                 : 'bg-emerald-400 text-white cursor-not-allowed'
//               : isDarkMode
//               ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30'
//               : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
//           }`}
//         >
//           {isProcessing ? (
//             <>
//               <Zap className="animate-spin" size={20} />
//               <span>Processing Transfer...</span>
//             </>
//           ) : (
//             <>
//               <Zap className="fill-current" size={20} />
//               <span>
//                 Execute{' '}
//                 {action === 'buy'
//                   ? 'Transfer to Smart Fund'
//                   : 'Transfer to Prime Reserve'}
//               </span>
//             </>
//           )}
//         </button>
//       </div>
//     </>
//   );
// };




const TradePanelMain = ({
  isDarkMode,
  action,
  setAction,
  amount,
  handleAmountChange,
  isProcessing,
  handleTrade,
  handleQuickAmount,
  balance,
  holdings,
  lockedHoldings = 0,
  escrowedFunds,
  formatUnits,
  tradeStreak,
  sellAttempts,
  isSellLocked,
  setIsSellLocked,
  MAX_SELL_ATTEMPTS,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(null);
  const LOCK_INTERVAL = 24 * 60 * 60 * 1000 / MAX_SELL_ATTEMPTS; // 8 hours in milliseconds
  const availableHoldings = Math.max(0, holdings - lockedHoldings);

  // Function to format time remaining (e.g., "7h 45m 30s")
  const formatTimeRemaining = (ms) => {
    if (ms <= 0) return null;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Effect to handle countdown timer
  useEffect(() => {
    let timer;
    if (isSellLocked && sellAttempts > 0) {
      const lastSellTime = localStorage.getItem('lastSellTime');
      if (lastSellTime) {
        const lastSellTimestamp = parseInt(lastSellTime, 10);
        const elapsed = Date.now() - lastSellTimestamp;
        const remaining = LOCK_INTERVAL - (elapsed % LOCK_INTERVAL);

        if (remaining > 0) {
          setLockTimeRemaining(remaining);
          timer = setInterval(() => {
            const newElapsed = Date.now() - lastSellTimestamp;
            const newRemaining = LOCK_INTERVAL - (newElapsed % LOCK_INTERVAL);
            setLockTimeRemaining(newRemaining);

            if (newRemaining <= 0) {
              setLockTimeRemaining(null);
              setIsSellLocked(false);
              localStorage.setItem('sellAttempts', '0');
              localStorage.removeItem('lastSellTime');
            }
          }, 1000);
        } else {
          setLockTimeRemaining(null);
          setIsSellLocked(false);
          localStorage.setItem('sellAttempts', '0');
          localStorage.removeItem('lastSellTime');
        }
      }
    }

    return () => clearInterval(timer);
  }, [isSellLocked, sellAttempts, LOCK_INTERVAL, setIsSellLocked]); // Added LOCK_INTERVAL and setIsSellLocked

  // Modified handleTrade to store last sell time
  const handleTradeWithLock = () => {
    if (action === 'sell') {
      localStorage.setItem('lastSellTime', Date.now().toString());
    }
    handleTrade();
  };

  const showModal = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);



  const StatCard = ({ icon: Icon, label, value, gradient, glowColor }) => (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm border
      transition-all duration-500 hover:scale-105 hover:shadow-2xl
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-slate-600/70' 
        : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200/50 hover:border-slate-300/70'
      }
    `}>
      <div className="absolute inset-0 bg-gradient-to-r opacity-5" style={{ background: gradient }}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-xl backdrop-blur-sm transition-all duration-300
            ${isDarkMode 
              ? 'bg-slate-700/50 text-slate-300' 
              : 'bg-white/70 text-slate-600'
            }
          `}>
            <Icon size={24} />
          </div>
          <div className={`
            w-2 h-2 rounded-full animate-pulse shadow-lg
            ${glowColor}
          `} style={{ 
            boxShadow: isDarkMode 
              ? `0 0 12px ${glowColor.includes('emerald') ? '#10b981' : glowColor.includes('amber') ? '#f59e0b' : '#3b82f6'}` 
              : 'none'
          }}></div>
        </div>
        <div className={`
          text-sm font-medium mb-2 transition-colors duration-300
          ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
        `}>
          {label}
        </div>
        <div className={`
          text-2xl font-bold tracking-tight transition-colors duration-300
          ${isDarkMode ? 'text-white' : 'text-slate-900'}
        `}>
          ${value}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-semibold flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          <ArrowRight className="mr-3 text-emerald-400" size={24} /> Internal Fund Transfer
        </h2>
        <div
          className={`text-sm px-3 py-1 rounded-lg font-medium flex items-center select-none ${
            isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {action === 'buy' ? (
            <>
              <ArrowRight className="mx-1" size={16} />
              Prime Reserve → Smart Fund
            </>
          ) : (
            <>
              <ArrowRight className="mx-1" size={16} />
              Smart Fund → Prime Reserve
            </>
          )}
        </div>
        {tradeStreak > 0 && (
          <div className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full">
            <Flame className="text-white mr-2" size={16} />
            <span className="text-white text-sm font-semibold">{tradeStreak}x Streak</span>
          </div>
        )}
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 p-4 sm:p-5 rounded-lg shadow-md ${
          isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700'
        }`}
      >
        <section>
          <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-1">Prime Reserve</h3>
            <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
              Current Balance
            </p>
            <p className="text-xl sm:text-2xl font-bold mb-2">{formatUnits(balance)} XLM</p>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Secure Holdings • Main Account
            </p>
            <p className="text-xs sm:text-sm">
              <span className="font-semibold">Account Type:</span> Primary Wallet
            </p>
            <p className="text-xs sm:text-sm mb-1">
              <span className="font-semibold">Status:</span> Active
            </p>
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-1 flex items-center">
              <Sparkles className="mr-2 text-amber-400" size={16} />
              Smart Fund
            </h3>
            <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">
              Current Value
            </p>
            <p className="text-xl sm:text-2xl font-bold mb-2">${formatUnits(holdings)}</p>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              AI-Powered Trading • Automated Portfolio
            </p>
            <p className="text-xs sm:text-sm mb-1">
              <span className="font-semibold">Status:</span> Active
            </p>
            <Button
              type="primary"
              onClick={showModal}
              className="mt-4 w-full sm:w-auto"
              style={{
                backgroundColor: isDarkMode ? '#059669' : '#10B981',
                borderColor: isDarkMode ? '#059669' : '#10B981',
              }}
            >
              View Smart Fund Details
            </Button>
          </div>
        </section>

        {/* <Modal
          title="Smart Fund Details"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[<Button key="close" onClick={handleModalClose}>Close</Button>]}
          className={isDarkMode ? 'ant-modal-dark' : ''}
          width="90%"
          style={{ maxWidth: '600px' }}
        >
          <p className="text-xs sm:text-sm">
            <span className="font-semibold">Total Holdings:</span> ${formatUnits(holdings)}
          </p>
          <p className="text-xs sm:text-sm">
            <span className="font-semibold">Escrowed Funds:</span> ${formatUnits(escrowedFunds)}
          </p>
          <p className="text-xs sm:text-sm">
            <span className="font-semibold">Available Holdings:</span> ${formatUnits(availableHoldings)}
          </p>
          <p className="text-xs sm:text-sm mt-4">
            The Smart Fund utilizes the Gima Trading Bot, an advanced AI system designed to optimize trading strategies based on market trends. Funds in escrow are actively managed by the bot and may be subject to lock-up periods during trading cycles.
          </p>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-amber-400' : 'bg-amber-500'
                } animate-pulse`}
              ></div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Locked Funds
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode ? 'text-amber-300' : 'text-amber-600'
                }`}
              >
                ${formatUnits(escrowedFunds)}
              </span>
            </div>
          </div>
        </Modal>
      </div> */}







       <Modal
          title={null}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="sophisticated-modal"
          width="95%"
          style={{ maxWidth: '900px' }}
          maskStyle={{
            backdropFilter: 'blur(8px)',
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }}
          styles={{
            content: {
              padding: 0,
              background: 'transparent',
              boxShadow: 'none'
            }
          }}
        >
          <div className={`
            relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-500
            ${isDarkMode 
              ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border-slate-700/50' 
              : 'bg-gradient-to-br from-white/95 via-slate-50/95 to-white/95 border-slate-200/50'
            }
          `}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`
                    p-4 rounded-2xl backdrop-blur-sm transition-all duration-300
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
                      : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-300/30'
                    }
                  `}>
                    <TrendingUp className={`
                      w-8 h-8 transition-colors duration-300
                      ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
                    `} />
                  </div>
                  <div>
                    <h2 className={`
                      text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                      ${isDarkMode 
                        ? 'from-white to-slate-300' 
                        : 'from-slate-900 to-slate-600'
                      }
                    `}>
                      Smart Fund Analytics
                    </h2>
                    <p className={`
                      text-sm mt-1 transition-colors duration-300
                      ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                    `}>
                      Powered by Gima Trading Bot AI
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleModalClose}
                  className={`
                    rounded-xl border-0 w-12 h-12 flex items-center justify-center transition-all duration-300
                    ${isDarkMode 
                      ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700'
                    }
                  `}
                >
                  ✕
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                  icon={BarChart3}
                  label="Total Holdings"
                  value={formatUnits(holdings)}
                  gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                  glowColor="bg-blue-400"
                />
                <StatCard 
                  icon={Lock}
                  label="Escrowed Funds"
                  value={formatUnits(escrowedFunds)}
                  gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                  glowColor="bg-amber-400"
                />
                <StatCard 
                  icon={Shield}
                  label="Available Holdings"
                  value={formatUnits(availableHoldings)}
                  gradient="linear-gradient(135deg, #10b981, #059669)"
                  glowColor="bg-emerald-400"
                />
              </div>

              {/* AI System Info */}
              <div className={`
                rounded-2xl p-6 backdrop-blur-sm border transition-all duration-500
                ${isDarkMode 
                  ? 'bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50' 
                  : 'bg-gradient-to-r from-white/70 to-slate-50/70 border-slate-200/50'
                }
              `}>
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-3 rounded-xl backdrop-blur-sm transition-all duration-300
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30' 
                      : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300/30'
                    }
                  `}>
                    <Zap className={`
                      w-6 h-6 transition-colors duration-300
                      ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
                    `} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`
                      text-lg font-semibold mb-3 transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-slate-900'}
                    `}>
                      Advanced AI Trading System
                    </h3>
                    <p className={`
                      text-sm leading-relaxed transition-colors duration-300
                      ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                    `}>
                      The Smart Fund utilizes the Gima Trading Bot, an advanced AI system designed to optimize trading strategies based on real-time market analysis and predictive algorithms. Funds in escrow are actively managed through sophisticated risk assessment protocols and may be subject to strategic lock-up periods during high-frequency trading cycles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className={`
                    relative w-3 h-3 rounded-full transition-colors duration-300
                    ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}
                  `}>
                    <div className={`
                      absolute inset-0 w-3 h-3 rounded-full animate-ping
                      ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}
                    `}></div>
                  </div>
                  <span className={`
                    text-sm font-medium transition-colors duration-300
                    ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}
                  `}>
                    AI System Active • Real-time Monitoring
                  </span>
                </div>
                <div className={`
                  text-xs px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-slate-700/50 text-slate-400 border border-slate-600/50' 
                    : 'bg-slate-100/70 text-slate-600 border border-slate-200/50'
                  }
                `}>
                  Last updated: Just now
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>







  <div className="flex space-x-4 mb-6">  
  <Tooltip title="Move capital into Smart Fund for automated trading" arrow>
    <span className="flex-1">
      <button
        onClick={() => setAction('buy')}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 ease-out flex items-center justify-center gap-3 relative overflow-hidden group ${
          action === 'buy'
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/40 transform scale-[1.02] border-2 border-emerald-400/50'
            : isDarkMode
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-slate-600 hover:to-slate-700 hover:text-white shadow-lg shadow-slate-900/20 border-2 border-slate-600/30 hover:border-slate-500/50'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 shadow-lg shadow-gray-300/20 border-2 border-gray-200/50 hover:border-gray-300/70'
        } ${
          isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:transform hover:scale-105'
        }`}
        disabled={isProcessing}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${
          action === 'buy' ? 'opacity-100' : 'opacity-0'
        }`} />
        
        <ArrowLeftCircle className={`transform rotate-180 transition-transform duration-300 ${
          action === 'buy' ? 'scale-110' : 'group-hover:scale-110'
        }`} size={18} />
        
        <span className="relative z-10 tracking-wide">
          Transfer to Smart Fund
        </span>
        
        {action === 'buy' && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
        )}
      </button>
    </span>
  </Tooltip>

  <Tooltip
    title={
      isSellLocked
        ? `Sell locked. ${formatTimeRemaining(lockTimeRemaining) || 'Please try again later.'}`
        : ' Gima Alpha AutoBot Units'
    }
    arrow
  >
    <span className="flex-1">
      <button
        onClick={() => setAction('sell')}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-300 ease-out flex items-center justify-center gap-3 relative overflow-hidden group ${
          action === 'sell'
            ? isSellLocked
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-gray-300 cursor-not-allowed shadow-lg shadow-gray-600/30 border-2 border-gray-400/30'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/40 transform scale-[1.02] border-2 border-red-400/50'
            : isDarkMode
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-slate-600 hover:to-slate-700 hover:text-white shadow-lg shadow-slate-900/20 border-2 border-slate-600/30 hover:border-slate-500/50'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 shadow-lg shadow-gray-300/20 border-2 border-gray-200/50 hover:border-gray-300/70'
        } ${
          isProcessing || isSellLocked ? 'opacity-70' : 'hover:shadow-2xl hover:transform hover:scale-105'
        }`}
        disabled={isProcessing || isSellLocked}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${
          action === 'sell' && !isSellLocked ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {isSellLocked ? (
          <>
            <div className="flex items-center gap-2">
              <Lock size={18} className="animate-pulse" />
              <Clock size={18} className="animate-spin" />
            </div>
            <span className="relative z-10 tracking-wide">
              {formatTimeRemaining(lockTimeRemaining) || 'Locked'}
            </span>
          </>
        ) : (
      <>
        <Zap className={`transition-transform duration-300 fill-current ${
            action === 'sell' ? 'scale-110' : 'group-hover:scale-110'
          }`} size={18} />
          <span className="relative z-10 tracking-wide">
           Gima-Alpha Bot Units
          </span>
          
          {/* Arrow in top-right corner of button */}
          <ArrowUpRight className="absolute top-2 right-2 opacity-60" size={18} />
          
          {action === 'sell' && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-300 rounded-full animate-pulse" />
          )}
        </>
        )}
      </button>
    </span>
  </Tooltip>
</div>



      {action === 'sell' && (
        <div
          className={`text-xs mb-4 text-center ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          {isSellLocked ? (
            <span className="text-red-400">
              locked for {formatTimeRemaining(lockTimeRemaining) || 'some time'}
            </span>
          ) : (
            <span>trade remaining today: {MAX_SELL_ATTEMPTS - sellAttempts}</span>
          )}
        </div>
      )}

      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}
        >
          Transfer Amount (XLM)
        </label>
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter transfer amount"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-transparent text-sm ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'
            }`}
            disabled={isProcessing}
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            onClick={() => handleQuickAmount(pct)}
            className={`py-2 text-sm rounded-lg font-semibold transition-colors ${
              isDarkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isProcessing}
          >
            {pct}%
          </button>
        ))}
      </div>

      <div
        className={`flex items-center justify-between mb-6 p-4 rounded-lg border ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Wallet
            className={action === 'buy' ? 'text-emerald-400' : 'text-red-400'}
            size={20}
          />
          <span
            className={`text-md font-semibold ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            {action === 'buy' ? 'Available Capital (Prime Reserve)' : 'Available Smart Fund Holdings'}
          </span>
        </div>
        <span
          className={`text-md font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          {action === 'buy' ? `${formatUnits(balance)} XLM` : `$${formatUnits(availableHoldings)}`}
        </span>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTradeWithLock}
          disabled={isProcessing || parseFloat(amount) < 1 || (action === 'sell' && isSellLocked)}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-3 text-sm transition-colors ${
            parseFloat(amount) < 1 || (action === 'sell' && isSellLocked)
              ? 'opacity-50 cursor-not-allowed'
              : isProcessing
              ? isDarkMode
                ? 'bg-emerald-700 text-white cursor-not-allowed'
                : 'bg-emerald-400 text-white cursor-not-allowed'
              : isDarkMode
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
          }`}
        >
          {isProcessing ? (
            <>
              <Zap className="animate-spin" size={20} />
              <span>Processing Transfer...</span>
            </>
          ) : (
            <>
              <Zap className="fill-current" size={20} />
              <span>
                Execute {action === 'buy' ? 'Transfer to Smart Fund' : 'Bot'}
              </span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .ant-modal-dark .ant-modal-content {
          background-color: #1e293b;
          color: #e2e8f0;
        }
        .ant-modal-dark .ant-modal-header {
          background-color: #1e293b;
          color: #e2e8f0;
          border-bottom: 1px solid #334155;
        }
        .ant-modal-dark .ant-modal-title {
          color: #e2e8f0;
        }
        .ant-modal-dark .ant-modal-close-x {
          color: #e2e8f0;
        }
        .ant-modal {
          width: 90% !important;
          max-width: 600px;
        }
        @media (max-width: 640px) {
          .ant-modal {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
};







const TradeHistory = ({ tradeHistory, showTradeDetails, setShowTradeDetails, clearTradeHistory, isDarkMode, formatUnits }) => {
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  const getTradeIcon = (type) => {
    switch (type) {
      case 'buy': return <TrendingUp size={14} className="text-emerald-400" />;
      case 'sell': return <Activity size={14} className="text-red-400" />;
      default: return <ArrowUpDown size={14} className="text-gray-400" />;
    }
  };

  const getTradeStatusColor = (type) => {
    switch (type) {
      case 'buy': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
      case 'sell': return 'from-red-500/20 to-red-600/10 border-red-500/30';
      default: return 'from-gray-500/20 to-gray-600/10 border-gray-500/30';
    }
  };

  const handleClearClick = () => {
    setIsClearModalVisible(true);
  };

  const handleClearConfirm = () => {
    clearTradeHistory();
    setIsClearModalVisible(false);
  };

  const handleClearCancel = () => {
    setIsClearModalVisible(false);
  };

  return (
    <div className={`p-2 border-b ${isDarkMode ? 'border-slate-700/30' : 'border-gray-200/30'}`}>
      <div className="flex items-center justify-between space-x-1">
        <div className={`p-1 rounded-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
          <History size={14} />
        </div>
        <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Total Trades {tradeHistory.length}
        </h3>
        <button
          onClick={handleClearClick}
          className={`group flex items-center px-2 py-1 rounded-sm font-medium text-xs transition-all duration-200 transform hover:scale-102 hover:shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-500/10' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-red-500/10'}`}
        >
          <Trash2 size={10} className="mr-1 group-hover:animate-pulse" />
          Clear
        </button>
      </div>
      <div className="p-4 overflow-x-hidden">
        {tradeHistory.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-slate-700/20 mx-2">
            {tradeHistory.map((trade, index) => (
              <div
                key={trade?.id ?? `trade-${index}`}
                onClick={() => setShowTradeDetails(trade || null)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border backdrop-blur-sm mx-1 ${isDarkMode ? `bg-gradient-to-r ${getTradeStatusColor(trade?.type)} hover:bg-slate-700/50 border-slate-600/30` : `bg-gradient-to-r ${getTradeStatusColor(trade?.type)} hover:bg-gray-50/80 border-gray-300/30`} hover:border-current hover:shadow-md break-words`}
              >
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20 ${isDarkMode ? 'bg-slate-600 text-slate-200 border-2 border-slate-800' : 'bg-white text-gray-700 border-2 border-gray-200'} shadow-sm`}>
                  {tradeHistory.length - index}
                </div>
                <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${trade?.status === 'complete' ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                <div className="absolute top-1 right-1 w-2 h-2 opacity-20 overflow-hidden rounded-full">
                  <div className="w-full h-full rounded-full bg-current animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center relative z-10 ml-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      {getTradeIcon(trade?.type)}
                      <div className="min-w-0">
                        <span className={`font-bold text-sm ${trade?.type === 'buy' ? 'text-emerald-400' : trade?.type === 'sell' ? 'text-red-400' : 'text-gray-400'}`}>
                          {(trade?.type || 'Unknown').charAt(0).toUpperCase() + (trade?.type || 'unknown').slice(1)}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <Hash size={14} className={`${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`} />
                          <span className={`text-sm font-mono truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            ID ({(trade?.id ?? 'unknown').toString().slice(-8)})
                          </span>
                          <span className={`text-xs font-medium ${trade?.status === 'complete' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {trade?.status === 'complete' ? 'Complete' : '⌛ Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                      XLM {formatUnits(trade?.amount ?? 0)} units
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-4 text-center rounded-lg relative overflow-hidden mx-2 ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-gray-50/50 to-gray-100/50'}`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-current animate-pulse"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-current animate-pulse delay-1000"></div>
            </div>
            <div className="relative z-10">
              <div className={`mx-auto mb-3 p-3 rounded-full w-fit ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200/50'}`}>
                <History className="text-gray-400" size={24} />
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                No Trades Yet
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Your trading history will appear here
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <Trash2 size={16} className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Confirm Clear Trade History
            </span>
          </div>
        }
        open={isClearModalVisible}
        onCancel={handleClearCancel}
        footer={[
          <button
            key="cancel"
            onClick={handleClearCancel}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
          >
            Cancel
          </button>,
          <button
            key="confirm"
            onClick={handleClearConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
          >
            Confirm
          </button>,
        ]}
        centered
        width={400}
        className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
        styles={{
          content: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: 0,
          },
          header: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            marginBottom: 0,
          },
          body: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#e2e8f0' : '#1f2937',
            padding: '16px',
          },
          footer: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          },
        }}
        closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
      >
        <div className="space-y-3">
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Are you sure you want to clear your trade history? This action will permanently delete all trade records from the database and cannot be undone.
          </p>
        </div>
      </Modal>
      
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <Activity size={16} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trade Details
            </span>
          </div>
        }
        open={!!showTradeDetails}
        onCancel={() => setShowTradeDetails(null)}
        footer={[
          <button
            key="close"
            onClick={() => setShowTradeDetails(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
          >
            Close
          </button>,
        ]}
        centered
        width={500}
        className={`${isDarkMode ? 'ant-modal-dark' : 'ant-modal-light'}`}
        styles={{
          content: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: isDarkMode ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: 0,
          },
          header: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            marginBottom: 0,
          },
          body: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#e2e8f0' : '#1f2937',
            padding: '16px',
          },
          footer: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
          },
        }}
        closeIcon={<span className={`text-base ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>✕</span>}
      >
        <div className="space-y-3">
          {[
            { icon: Hash, label: 'ID', value: `${(showTradeDetails?.id ?? 'unknown').toString()}` },
            {
              icon: ArrowUpDown,
              label: 'Type',
              value: (showTradeDetails?.type || 'Unknown').charAt(0).toUpperCase() + (showTradeDetails?.type || 'unknown').slice(1),
              colored: true
            },
            { icon: DollarSign, label: 'Amount', value: `${formatUnits(showTradeDetails?.amount ?? 0)}` },
            { icon: Clock, label: 'Time', value: showTradeDetails?.timestamp ?? 'Unknown' },
            {
              icon: Info,
              label: 'Status',
              value: showTradeDetails?.status === 'complete' ? 'Completed' : 'Pending',
              colored: true
            }
          ].map(({ icon: Icon, label, value, colored = false }) => (
            <div
              key={label}
              className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50/50 border border-gray-200/50'}`}
            >
              <div className="flex items-center space-x-2">
                <Icon size={14} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {label}
                </span>
              </div>
              <span className={`text-sm font-semibold ${colored ? (showTradeDetails?.type === 'buy' || showTradeDetails?.status === 'complete' ? 'text-emerald-400' : showTradeDetails?.type === 'sell' ? 'text-red-400' : 'text-yellow-400') : isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                {value}
              </span>
            </div>
          ))}
          {showTradeDetails?.lockedAmount && (
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              isDarkMode ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-100/50 border border-amber-200/50'
            }`}>
              <div className="flex items-center space-x-2">
                <Lock className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`} size={14} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                  Locked Amount
                </span>
              </div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                ${formatUnits(showTradeDetails.lockedAmount)}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const NewsAdvertFeed = ({ isDarkMode = false }) => {
  const [feedItems, setFeedItems] = useState({ news: [], ad: [], alert: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const [newItemsCount, setNewItemsCount] = useState({ news: 0, ad: 0, alert: 0 });
  const [recentItemsCount, setRecentItemsCount] = useState({ news: 0, ad: 0, alert: 0 });
  const [showNewItemsBanner, setShowNewItemsBanner] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState('medium');
  const [lastUpdate, setLastUpdate] = useState(0);
  const [showClearModal, setShowClearModal] = useState(false);
  const feedRef = useRef(null);

  // News templates
  const newsTemplates = React.useMemo(() => [
    {
      type: 'news',
      templates: [
        {
          title: 'XLM Price Update',
          content: 'Stellar Lumens shows {change}% movement in the last hour. Trading volume up {volume}%.',
          priority: 'high',
          icon: TrendingUp
        },
        {
          title: 'GIMA Bot Performance',
          content: 'Trading bot reports {accuracy}% success rate with {profit}% average returns this week.',
          priority: 'medium',
          icon: BarChart3
        },
        {
          title: 'Market Analysis',
          content: 'Technical indicators suggest {sentiment} sentiment. RSI at {rsi}, MACD showing {signal}.',
          priority: 'medium',
          icon: Activity
        },
        {
          title: 'Network Status',
          content: 'System uptime: {uptime}%. Processing {tps} transactions per second.',
          priority: 'low',
          icon: Globe
        },
        {
          title: 'User Activity',
          content: '{users} active traders online. Portfolio values increased by {growth}% today.',
          priority: 'low',
          icon: Users
        }
      ]
    },
    {
      type: 'ad',
      templates: [
        {
          title: 'Premium Features',
          content: 'Unlock advanced analytics and automated trading. {discount}% off this month!',
          cta: 'Upgrade Now',
          priority: 'medium',
          icon: Zap
        },
        {
          title: 'New Trading Pairs',
          content: 'Now supporting {pairs} new cryptocurrency pairs. Start trading today!',
          cta: 'Explore',
          priority: 'medium',
          icon: DollarSign
        },
        {
          title: 'Risk Management',
          content: 'Protect your investments with our new stop-loss features. Free trial available.',
          cta: 'Try Free',
          priority: 'medium',
          icon: AlertCircle
        }
      ]
    },
    {
      type: 'alert',
      templates: [
        {
          title: 'Price Alert',
          content: 'XLM has reached your target price of {price}. Consider your next move.',
          priority: 'high',
          icon: AlertCircle
        },
        {
          title: 'Maintenance Notice',
          content: 'Scheduled maintenance in {hours} hours. Trading will be briefly unavailable.',
          priority: 'medium',
          icon: Clock
        }
      ]
    }
  ], []);

  // Generate random realistic data
  const generateRandomData = () => ({
    change: (Math.random() * 20 - 10).toFixed(2),
    volume: (Math.random() * 50 + 10).toFixed(0),
    accuracy: (95 + Math.random() * 4).toFixed(1),
    profit: (Math.random() * 15 + 5).toFixed(1),
    sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
    rsi: (30 + Math.random() * 40).toFixed(0),
    signal: Math.random() > 0.5 ? 'bullish crossover' : 'consolidation',
    uptime: (99.5 + Math.random() * 0.5).toFixed(2),
    tps: (1000 + Math.random() * 2000).toFixed(0),
    users: (500 + Math.random() * 1000).toFixed(0),
    growth: (Math.random() * 10 + 2).toFixed(1),
    discount: [10, 15, 20, 25][Math.floor(Math.random() * 4)],
    pairs: Math.floor(Math.random() * 10 + 5),
    price: (0.10 + Math.random() * 0.50).toFixed(3),
    hours: Math.floor(Math.random() * 12 + 1)
  });

  // Generate a single feed item
  const generateFeedItem = useCallback((type, timestamp) => {
    const category = newsTemplates.find(cat => cat.type === type);
    if (!category) {
      console.error(`No category found for type: ${type}`);
      return null;
    }
    const template = category.templates[Math.floor(Math.random() * category.templates.length)];
    const data = generateRandomData();
    
    let content = template.content;
    Object.keys(data).forEach(key => {
      content = content.replace(`{${key}}`, data[key]);
    });

    return {
      id: `item_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: template.title,
      content,
      timestamp: new Date(timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      priority: template.priority || 'medium',
      cta: template.cta,
      icon: template.icon,
      isNew: true
    };
  }, [newsTemplates]);

  // Add new items
  const addNewItems = useCallback(() => {
    if (isPaused) return;
    const now = Date.now();
    if (now - lastUpdate < 10000) return;

    const types = ['news', 'ad', 'alert'];
    const newItems = { news: [], ad: [], alert: [] };
    const type = types[Math.floor(Math.random() * types.length)];
    const timestamp = now;
    const item = generateFeedItem(type, timestamp);
    if (item) newItems[type].push(item);

    setFeedItems(prev => ({
      news: [...newItems.news, ...prev.news].slice(0, 10),
      ad: [...newItems.ad, ...prev.ad].slice(0, 10),
      alert: [...newItems.alert, ...prev.alert].slice(0, 10)
    }));

    setNewItemsCount(prev => ({
      news: newItems.news.length + prev.news,
      ad: newItems.ad.length + prev.ad,
      alert: newItems.alert.length + prev.alert
    }));

    setRecentItemsCount(prev => ({
      news: newItems.news.length + prev.news,
      ad: newItems.ad.length + prev.ad,
      alert: newItems.alert.length + prev.alert
    }));

    if (feedRef.current && feedRef.current.scrollTop > 50) {
      setShowNewItemsBanner(true);
    }

    setTimeout(() => {
      setRecentItemsCount(prev => ({
        news: Math.max(0, prev.news - newItems.news.length),
        ad: Math.max(0, prev.ad - newItems.ad.length),
        alert: Math.max(0, prev.alert - newItems.alert.length)
      }));
    }, 60000);

    setTimeout(() => {
      setFeedItems(prev => ({
        news: prev.news.map(item => ({ ...item, isNew: false })),
        ad: prev.ad.map(item => ({ ...item, isNew: false })),
        alert: prev.alert.map(item => ({ ...item, isNew: false }))
      }));
    }, 5000);

    setLastUpdate(now);
  }, [generateFeedItem, isPaused, lastUpdate]);

  // Initial load
  useEffect(() => {
    const initialItems = {
      news: Array.from({ length: 3 }, (_, i) => generateFeedItem('news', Date.now() - (i * 1000 * 60 * 5))),
      ad: Array.from({ length: 2 }, (_, i) => generateFeedItem('ad', Date.now() - (i * 1000 * 60 * 5))),
      alert: Array.from({ length: 2 }, (_, i) => generateFeedItem('alert', Date.now() - (i * 1000 * 60 * 5)))
    };

    setTimeout(() => {
      setFeedItems({
        news: initialItems.news.filter(item => item).map(item => ({ ...item, isNew: false })),
        ad: initialItems.ad.filter(item => item).map(item => ({ ...item, isNew: false })),
        alert: initialItems.alert.filter(item => item).map(item => ({ ...item, isNew: false }))
      });
      setIsLoading(false);
    }, 1000);
  }, [generateFeedItem]);

  // Periodic updates
  useEffect(() => {
    if (isLoading || isPaused) return;

    const scheduleNext = () => {
      const intervals = { slow: [30000, 60000], medium: [20000, 30000], fast: [10000, 15000] };
      const [min, max] = intervals[updateFrequency];
      const interval = Math.random() * (max - min) + min;
      return setTimeout(() => {
        addNewItems();
        scheduleNext();
      }, interval);
    };

    const timeoutId = scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [isLoading, isPaused, updateFrequency, addNewItems]);

  const scrollToTop = () => {
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setShowNewItemsBanner(false);
    setNewItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
  };

  const togglePause = () => setIsPaused(prev => !prev);

  const handleClearFeed = () => {
    setShowClearModal(true);
  };

  const confirmClearFeed = () => {
    setFeedItems(prev => ({ ...prev, [activeTab]: [] }));
    setNewItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
    setRecentItemsCount(prev => ({ ...prev, [activeTab]: 0 }));
    setShowClearModal(false);
  };

  const cancelClearFeed = () => {
    setShowClearModal(false);
  };

  const getItemBackground = (type, priority, isNew) => {
    let classes = 'border-l-4 ';
    if (isNew) classes += isDarkMode ? 'ring-1 ring-blue-500/50 bg-blue-900/20' : 'ring-1 ring-blue-300/50 bg-blue-50/70';
    if (type === 'ad') return classes + (isDarkMode ? 'border-purple-400 bg-purple-900/20' : 'border-purple-300 bg-purple-50/70');
    if (type === 'alert') return classes + (isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-300 bg-red-50/70');
    if (priority === 'high') return classes + (isDarkMode ? 'border-amber-400 bg-amber-900/20' : 'border-amber-300 bg-amber-50/70');
    return classes + (isDarkMode ? 'border-slate-500 bg-slate-800/20' : 'border-gray-200 bg-gray-50/70');
  };

  const getItemIcon = (item) => {
    const IconComponent = item.icon || Info;
    const colorClass = {
      news: isDarkMode ? 'text-blue-300' : 'text-blue-500',
      ad: isDarkMode ? 'text-purple-300' : 'text-purple-500',
      alert: isDarkMode ? 'text-red-300' : 'text-red-500'
    }[item.type] || (isDarkMode ? 'text-gray-400' : 'text-gray-500');
    return <IconComponent size={16} className={colorClass} />;
  };

  const filteredItems = feedItems[activeTab].filter(item => priorityFilter === 'all' || item.priority === priorityFilter);

  return (
    <div className={`rounded-lg shadow-md p-4 w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900'}`}>
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
        }
        .sticky-tabs {
          position: sticky;
          top: 0;
          z-index: 10;
          background: ${isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .blink {
          animation: blink 1.5s infinite;
        }
        .dark-modal .ant-modal-content {
          background-color: #1e293b;
        }
        .dark-modal .ant-modal-header {
          background-color: #1e293b;
          border-bottom: 1px solid #334155;
        }
        .dark-modal .ant-modal-title {
          color: #f87171;
        }
        .light-modal .ant-modal-content {
          background-color: #f3f4f6;
        }
        .light-modal .ant-modal-header {
          background-color: #f3f4f6;
          border-bottom: 1px solid #d1d5db;
        }
        .light-modal .ant-modal-title {
          color: #ef4444;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Activity className={`mr-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'} ${isPaused ? '' : 'blink'}`} size={20} />
          Market Updates
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className={`p-1 rounded-full ${isPaused ? (isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600') : (isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600')}`}
            title={isPaused ? 'Resume updates' : 'Pause updates'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={handleClearFeed}
            className={`p-1 rounded-full ${isDarkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            title="Clear feed"
          >
            <Trash2 size={16} />
          </button>
          <div className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600'} ${isPaused ? '' : 'blink'}`}>
            {isPaused ? 'Paused' : 'Live'}
          </div>
        </div>
      </div>

      {/* Clear Feed Modal */}
      <Modal
        title="Confirm Clear Feed"
        open={showClearModal}
        onOk={confirmClearFeed}
        onCancel={cancelClearFeed}
        okText="Confirm"
        cancelText="Cancel"
        className={isDarkMode ? 'dark-modal' : 'light-modal'}
        okButtonProps={{
          className: `text-white ${isDarkMode ? 'bg-red-400 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'}`,
        }}
        cancelButtonProps={{
          className: isDarkMode ? 'bg-gray-700 hover:bg-gray-800 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        }}
      >
        <p className={isDarkMode ? 'text-red-400' : 'text-red-500'}>
          Are you sure you want to clear the <span className="capitalize">{activeTab}</span> feed? All current items will be permanently deleted and cannot be recovered until new updates are generated.
        </p>
      </Modal>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex border-b border-gray-200 dark:border-slate-700 sticky-tabs">
          {['news', 'ad', 'alert'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? (isDarkMode ? 'border-b-2 border-blue-400 text-blue-300' : 'border-b-2 border-blue-500 text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {newItemsCount[tab] > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{newItemsCount[tab]}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Priority:</label>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className={`text-sm p-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Update Speed:</label>
          <select
            value={updateFrequency}
            onChange={e => setUpdateFrequency(e.target.value)}
            className={`text-sm p-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-gray-100 text-gray-900'}`}
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      {/* New Items Banner */}
      {showNewItemsBanner && newItemsCount[activeTab] > 0 && (
        <div className={`mb-4 p-2 rounded text-sm text-center cursor-pointer ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`} onClick={scrollToTop}>
          {newItemsCount[activeTab]} new {activeTab} update{newItemsCount[activeTab] > 1 ? 's' : ''} • Click to view
        </div>
      )}

      {/* Feed Content */}
      <div className="h-40 overflow-y-auto scrollbar-thin" ref={feedRef}>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className={`p-3 rounded ${isDarkMode ? 'bg-slate-800/30' : 'bg-gray-50/50'} animate-pulse`}>
                <div className={`h-4 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                <div className={`h-3 rounded w-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={`text-sm text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            No {priorityFilter !== 'all' ? `${priorityFilter} priority` : ''} items in {activeTab} tab
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className={`p-3 mb-2 rounded ${getItemBackground(item.type, item.priority, item.isNew)}`}>
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getItemIcon(item)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${{
                      high: isDarkMode ? 'bg-amber-600 text-amber-100' : 'bg-amber-500 text-white',
                      medium: isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-500 text-white',
                      low: isDarkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-500 text-white'
                    }[item.priority]}`}>
                      {item.priority}
                    </span>
                    {item.isNew && <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-500 text-white'}`}>NEW</span>}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{item.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.timestamp}</span>
                    {item.cta && (
                      <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                        {item.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={`mt-4 text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
        {filteredItems.length} {activeTab} items {priorityFilter !== 'all' ? `(${priorityFilter} priority)` : ''} • {recentItemsCount[activeTab]} added in last minute • Update: {updateFrequency}
        {recentItemsCount[activeTab] > 3 && !isPaused && <span className="ml-2 text-red-500">High activity, consider pausing or slowing updates</span>}
      </div>
    </div>
  );
};

const Footer = ({ balance, holdings, isDarkMode, formatUnits, escrowedFunds }) => {
  return (
    <footer className={`w-full py-6 px-4 md:px-8 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Info className="mr-2 text-blue-400" size={20} />
          <h2 className="text-lg font-bold">About the Trade Component</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-semibold mb-3">Key Features</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Target className="text-emerald-400 mt-1 flex-shrink-0" size={14} />
                <div>
                  <h4 className="font-medium text-sm">Buy & Sell Orders</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Real-time balance validation for seamless trading
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="text-blue-400 mt-1 flex-shrink-0" size={14} />
                <div>
                  <h4 className="font-medium text-sm">Smart Validation</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Prevents invalid trades with input checks
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="text-yellow-400 mt-1 flex-shrink-0" size={14} />
                <div>
                  <h4 className="font-medium text-sm">Confirmation Flow</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Double-check system to avoid errors
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Trading Info</h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
                <h4 className="font-semibold text-sm mb-1">Quick Amount Selection</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Use 25%, 50%, 75%, 100% buttons for fast trading
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
                <h4 className="font-semibold text-sm mb-1">Real-time Feedback</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Instant success/error notifications (4s)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Account Status</h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 border-l-4 border-emerald-400' : 'bg-emerald-50 border-l-4 border-emerald-500'}`}>
                <h4 className="font-semibold text-sm mb-1 text-emerald-500">Live Mode</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Connected to your GIMA trading bot
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Prime Reserve</div>
                  <div className="font-semibold text-sm">XLM {formatUnits(balance)}</div>
                </div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Smart Fund</div>
                  <div className="font-semibold text-sm">${formatUnits(holdings)}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    (${formatUnits(holdings - escrowedFunds)} available)
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Locked Funds
                    </span>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                      ${formatUnits(escrowedFunds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Powered by GIMA AI Trading Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

const CustomAlert = ({ alertType, alertMessage, setShowAlert, isDarkMode }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out max-w-sm w-full mx-4">
      <div className={`${alertType === 'error' ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500' : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500'} text-white px-4 py-2 rounded-lg shadow-2xl backdrop-blur-sm border border-white/20`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {alertType === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="font-medium text-sm">{alertMessage}</span>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TradeConfirmationModal = ({
  isDarkMode, action, amount, balance, holdings, lockedHoldings,
  formatUnits, setShowConfirm, confirmTrade, isProcessing, sellAttempts
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-lg p-4 max-w-sm w-full mx-4 shadow-2xl border`}>
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
          Confirm {action.charAt(0).toUpperCase() + action.slice(1)} Trade
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
          You are about to {action} ${formatUnits(amount)} worth of assets.
        </p>
        
        {action === 'sell' && (
          <p className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} mb-3`}>
            This will use 1 of your daily sell attempts ({1 - sellAttempts} remaining today)
          </p>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowConfirm(false)}
            className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Cancel
          </button>
          <button
            onClick={confirmTrade}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 text-sm ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;