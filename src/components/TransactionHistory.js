
// import React, { useState, useMemo } from 'react';
// import { 
//   TrendingUp, TrendingDown, Clock, DollarSign, Sun, Moon,
//   ArrowUpCircle, ArrowDownCircle, Filter, Calendar, Search 
// } from 'lucide-react';

// const TransactionHistory = ({
//   trades = [],
//   deposits = [],
//   withdrawals = []
// }) => {
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [filterType, setFilterType] = useState('all'); // 'all', 'trades', 'deposits', 'withdrawals'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

//   // Combine all transactions into single array and format
//   const allTransactions = useMemo(() => {
//     const formattedTrades = trades.map(trade => ({
//       ...trade,
//       type: 'trade',
//       displayAmount: trade.amount,
//       description: `${trade.action} Trade`,
//       icon: trade.action?.toLowerCase() === 'buy' ? 'buy' : 'sell',
//     }));

//     const formattedDeposits = deposits.map(deposit => ({
//       ...deposit,
//       type: 'deposit',
//       displayAmount: deposit.amount,
//       description: 'Deposit',
//       icon: 'deposit',
//     }));

//     const formattedWithdrawals = withdrawals.map(withdrawal => ({
//       ...withdrawal,
//       type: 'withdrawal',
//       displayAmount: withdrawal.amount,
//       description: 'Withdrawal',
//       icon: 'withdrawal',
//     }));

//     const combined = [...formattedTrades, ...formattedDeposits, ...formattedWithdrawals];

//     // Sort by timestamp according to sortOrder
//     return combined.sort((a, b) => {
//       const dateA = new Date(a.timestamp);
//       const dateB = new Date(b.timestamp);
//       return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
//     });
//   }, [trades, deposits, withdrawals, sortOrder]);

//   // Filter transactions based on type and search term
//   const filteredTransactions = useMemo(() => {
//     let filtered = allTransactions;

//     // Filter by type
//     if (filterType === 'trades') {
//       filtered = filtered.filter(tx => tx.type === 'trade');
//     } else if (filterType === 'deposits') {
//       filtered = filtered.filter(tx => tx.type === 'deposit');
//     } else if (filterType === 'withdrawals') {
//       filtered = filtered.filter(tx => tx.type === 'withdrawal');
//     }

//     // Filter by search term
//     if (searchTerm) {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(tx =>
//         tx.description.toLowerCase().includes(lowerSearch) ||
//         tx.displayAmount.toString().includes(searchTerm)
//       );
//     }

//     return filtered;
//   }, [allTransactions, filterType, searchTerm]);

//   // Utility: format numbers as currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Utility: format timestamp to readable date+time
//   const formatTimestamp = (timestamp) => {
//     const dateObj = new Date(timestamp);
//     return {
//       date: dateObj.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       }),
//       time: dateObj.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       }),
//     };
//   };

//   // Icon selection for each transaction type
//   const getTransactionIcon = (tx) => {
//     const props = { className: "w-4 h-4" };
//     switch (tx.icon) {
//       case 'buy':
//         return <TrendingUp {...props} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />;
//       case 'sell':
//         return <TrendingDown {...props} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />;
//       case 'deposit':
//         return <ArrowDownCircle {...props} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />;
//       case 'withdrawal':
//         return <ArrowUpCircle {...props} className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} />;
//       default:
//         return <DollarSign {...props} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
//     }
//   };

//   // Color style classes based on type and mode
//   const getTransactionColor = (tx) => {
//     if (isDarkMode) {
//       switch (tx.type) {
//         case 'trade':
//           return tx.action?.toLowerCase() === 'buy'
//             ? 'text-green-400 bg-green-900/20 border-green-700/30'
//             : 'text-red-400 bg-red-900/20 border-red-700/30';
//         case 'deposit':
//           return 'text-blue-400 bg-blue-900/20 border-blue-700/30';
//         case 'withdrawal':
//           return 'text-orange-400 bg-orange-900/20 border-orange-700/30';
//         default:
//           return 'text-gray-400 bg-gray-900/20 border-gray-700/30';
//       }
//     } else {
//       switch (tx.type) {
//         case 'trade':
//           return tx.action?.toLowerCase() === 'buy'
//             ? 'text-green-600 bg-green-50 border-green-200'
//             : 'text-red-600 bg-red-50 border-red-200';
//         case 'deposit':
//           return 'text-blue-600 bg-blue-50 border-blue-200';
//         case 'withdrawal':
//           return 'text-orange-600 bg-orange-50 border-orange-200';
//         default:
//           return 'text-gray-600 bg-gray-50 border-gray-200';
//       }
//     }
//   };

//   // Container style classes based on theme
//   const getContainerClasses = () => {
//     return isDarkMode
//       ? 'p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl rounded-xl border border-gray-700'
//       : 'p-6 bg-white shadow-xl rounded-xl border border-gray-200';
//   };

//   // Text color classes based on theme
//   const getTextClasses = () => ({
//     title: isDarkMode ? 'text-white' : 'text-gray-900',
//     subtitle: isDarkMode ? 'text-gray-400' : 'text-gray-600',
//     muted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
//     primary: isDarkMode ? 'text-white' : 'text-gray-900',
//     secondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
//     accent: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
//   });

//   const textClasses = getTextClasses();

//   // Summary statistics
//   const stats = useMemo(() => {
//     const totalDeposits = deposits.reduce((acc, d) => acc + d.amount, 0);
//     const totalWithdrawals = withdrawals.reduce((acc, w) => acc + w.amount, 0);
//     const totalTrades = trades.length;

//     return { totalDeposits, totalWithdrawals, totalTrades, netFlow: totalDeposits - totalWithdrawals };
//   }, [deposits, withdrawals, trades]);

//   if (filteredTransactions.length === 0 && allTransactions.length === 0) {
//     return (
//       <div className={getContainerClasses()}>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className={`text-2xl font-bold ${textClasses.title} flex items-center gap-2`}>
//             <Clock className={`w-6 h-6 ${textClasses.accent}`} />
//             Transaction History
//           </h2>
//           <button
//             onClick={() => setIsDarkMode(!isDarkMode)}
//             className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
//               isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
//             }`}
//             aria-label="Toggle dark mode"
//           >
//             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//           </button>
//         </div>
//         <div className="text-center py-8">
//           <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
//             <DollarSign className={`w-8 h-8 ${textClasses.muted}`} />
//           </div>
//           <p className={`${textClasses.subtitle} text-lg`}>No transactions yet</p>
//           <p className={`${textClasses.muted} text-sm mt-2`}>Your transaction history will appear here</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={getContainerClasses()}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className={`text-2xl font-bold ${textClasses.title} flex items-center gap-2`}>
//           <Clock className={`w-6 h-6 ${textClasses.accent}`} />
//           Transaction History
//           <span className={`ml-4 text-sm font-normal ${textClasses.secondary}`}>
//             {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
//           </span>
//         </h2>
//         <button
//           onClick={() => setIsDarkMode(!isDarkMode)}
//           className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
//             isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
//           }`}
//           aria-label="Toggle dark mode"
//         >
//           {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//         </button>
//       </div>

//       {/* Summary Stats */}
//       <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
//         <div className="text-center">
//           <div className={`text-sm ${textClasses.muted}`}>Total Deposits</div>
//           <div className="text-lg font-bold text-blue-400">{formatCurrency(stats.totalDeposits)}</div>
//         </div>
//         <div className="text-center">
//           <div className={`text-sm ${textClasses.muted}`}>Total Withdrawals</div>
//           <div className="text-lg font-bold text-orange-400">{formatCurrency(stats.totalWithdrawals)}</div>
//         </div>
//         <div className="text-center">
//           <div className={`text-sm ${textClasses.muted}`}>Total Trades</div>
//           <div className={`text-lg font-bold ${textClasses.accent}`}>{stats.totalTrades}</div>
//         </div>
//         <div className="text-center">
//           <div className={`text-sm ${textClasses.muted}`}>Net Flow</div>
//           <div className={`text-lg font-bold ${stats.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//             {formatCurrency(stats.netFlow)}
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="flex items-center gap-2">
//           <Filter className={`w-4 h-4 ${textClasses.muted}`} />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className={`px-3 py-1 rounded-lg border text-sm ${
//               isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
//             }`}
//             aria-label="Filter transactions by type"
//           >
//             <option value="all">All Transactions</option>
//             <option value="trades">Trades Only</option>
//             <option value="deposits">Deposits Only</option>
//             <option value="withdrawals">Withdrawals Only</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Search className={`w-4 h-4 ${textClasses.muted}`} />
//           <input
//             type="text"
//             placeholder="Search transactions..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             title="Search by description or amount" // Tooltip for search bar
//             className={`px-3 py-1 rounded-lg border text-sm ${
//               isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//             }`}
//             aria-label="Search transactions"
//           />
//         </div>

//         <button
//           onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//           className={`px-3 py-1 rounded-lg border text-sm flex items-center gap-1 ${
//             isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
//           }`}
//           aria-label="Toggle transaction sort order"
//         >
//           <Calendar className="w-4 h-4" />
//           {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
//         </button>
//       </div>

//       {/* Transaction List */}
//       <div className={`space-y-3 max-h-96 overflow-y-auto ${
//         isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
//       }`}>
//         {filteredTransactions.map((tx, idx) => {
//           const { date, time } = formatTimestamp(tx.timestamp);

//           return (
//             <div 
//               key={`${tx.type}-${idx}`}
//               className={`
//                 relative p-4 rounded-lg border cursor-pointer
//                 ${getTransactionColor(tx)}
//               `}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {getTransactionIcon(tx)}
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className={`font-semibold capitalize text-lg ${textClasses.primary}`}>
//                         {tx.description}
//                       </span>
//                       <span className={`font-bold ${textClasses.primary}`}>
//                         {formatCurrency(tx.displayAmount)}
//                       </span>
//                     </div>
//                     <div className={`flex items-center gap-2 text-sm mt-1 ${textClasses.secondary}`}>
//                       <span>{date}</span>
//                       <span>•</span>
//                       <span>{time}</span>
//                       {tx.type === 'trade' && tx.price && (
//                         <>
//                           <span>•</span>
//                           <span>@ {formatCurrency(tx.price)}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className={`text-sm ${textClasses.secondary} capitalize`}>
//                     {tx.type}
//                   </div>
//                   <div className={`text-xs ${textClasses.muted}`}>
//                     #{allTransactions.indexOf(tx) + 1}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredTransactions.length > 5 && (
//         <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//           <p className={`text-center text-sm ${textClasses.secondary}`}>
//             Showing {filteredTransactions.length} of {allTransactions.length} transactions
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;






// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   TrendingUp, TrendingDown, Clock, DollarSign, ArrowUpCircle, ArrowDownCircle, Filter, Calendar, Search 
// } from 'lucide-react';

// const TransactionHistory = ({
//   trades = [],
//   deposits = [],
//   withdrawals = [],
//   isDarkMode = true,
// }) => {
//   const [filterType, setFilterType] = useState('all'); // 'all', 'trades', 'deposits', 'withdrawals'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

//   // Theme styles configuration
//   const themeStyles = {
//     dark: {
//       background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
//       container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
//       containerBorder: 'border-gray-700',
//       textPrimary: 'text-white',
//       textSecondary: 'text-gray-400',
//       textMuted: 'text-gray-500',
//       textAccent: 'text-emerald-400',
//       cardBg: 'bg-gray-800/50',
//       cardBorder: 'border-gray-700',
//       tradeBuy: 'text-green-400 bg-green-900/20 border-green-700/30',
//       tradeSell: 'text-red-400 bg-red-900/20 border-red-700/30',
//       deposit: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
//       withdrawal: 'text-orange-400 bg-orange-900/20 border-orange-700/30',
//       default: 'text-gray-400 bg-gray-900/20 border-gray-700/30',
//       inputBg: 'bg-gray-800',
//       inputBorder: 'border-gray-700',
//       inputPlaceholder: 'placeholder-gray-400',
//       buttonBg: 'bg-gray-800',
//       buttonHover: 'hover:bg-gray-700',
//       scrollbarThumb: 'scrollbar-thumb-gray-600',
//       scrollbarTrack: 'scrollbar-track-gray-800',
//       shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
//     },
//     light: {
//       background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
//       container: 'bg-white',
//       containerBorder: 'border-gray-200',
//       textPrimary: 'text-gray-900',
//       textSecondary: 'text-gray-600',
//       textMuted: 'text-gray-500',
//       textAccent: 'text-emerald-600',
//       cardBg: 'bg-gray-50',
//       cardBorder: 'border-gray-200',
//       tradeBuy: 'text-green-600 bg-green-50 border-green-200',
//       tradeSell: 'text-red-600 bg-red-50 border-red-200',
//       deposit: 'text-blue-600 bg-blue-50 border-blue-200',
//       withdrawal: 'text-orange-600 bg-orange-50 border-orange-200',
//       default: 'text-gray-600 bg-gray-50 border-gray-200',
//       inputBg: 'bg-white',
//       inputBorder: 'border-gray-300',
//       inputPlaceholder: 'placeholder-gray-500',
//       buttonBg: 'bg-white',
//       buttonHover: 'hover:bg-gray-50',
//       scrollbarThumb: 'scrollbar-thumb-gray-300',
//       scrollbarTrack: 'scrollbar-track-gray-100',
//       shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
//     }
//   };

//   // Map isDarkMode to theme key
//   const themeKey = isDarkMode ? 'dark' : 'light';
//   const currentTheme = themeStyles[themeKey] || themeStyles.dark;

//   // Debug theme prop
//   useEffect(() => {
//     console.log("TransactionHistory component isDarkMode:", isDarkMode);
//   }, [isDarkMode]);

//   // Combine all transactions into single array and format
//   const allTransactions = useMemo(() => {
//     const formattedTrades = trades.map(trade => ({
//       ...trade,
//       type: 'trade',
//       displayAmount: trade.amount,
//       description: `${trade.action} Trade`,
//       icon: trade.action?.toLowerCase() === 'buy' ? 'buy' : 'sell',
//     }));

//     const formattedDeposits = deposits.map(deposit => ({
//       ...deposit,
//       type: 'deposit',
//       displayAmount: deposit.amount,
//       description: 'Deposit',
//       icon: 'deposit',
//     }));

//     const formattedWithdrawals = withdrawals.map(withdrawal => ({
//       ...withdrawal,
//       type: 'withdrawal',
//       displayAmount: withdrawal.amount,
//       description: 'Withdrawal',
//       icon: 'withdrawal',
//     }));

//     const combined = [...formattedTrades, ...formattedDeposits, ...formattedWithdrawals];

//     // Sort by timestamp according to sortOrder
//     return combined.sort((a, b) => {
//       const dateA = new Date(a.timestamp);
//       const dateB = new Date(b.timestamp);
//       return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
//     });
//   }, [trades, deposits, withdrawals, sortOrder]);

//   // Filter transactions based on type and search term
//   const filteredTransactions = useMemo(() => {
//     let filtered = allTransactions;

//     // Filter by type
//     if (filterType === 'trades') {
//       filtered = filtered.filter(tx => tx.type === 'trade');
//     } else if (filterType === 'deposits') {
//       filtered = filtered.filter(tx => tx.type === 'deposit');
//     } else if (filterType === 'withdrawals') {
//       filtered = filtered.filter(tx => tx.type === 'withdrawal');
//     }

//     // Filter by search term
//     if (searchTerm) {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(tx =>
//         tx.description.toLowerCase().includes(lowerSearch) ||
//         tx.displayAmount.toString().includes(searchTerm)
//       );
//     }

//     return filtered;
//   }, [allTransactions, filterType, searchTerm]);

//   // Utility: format numbers as currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Utility: format timestamp to readable date+time
//   const formatTimestamp = (timestamp) => {
//     const dateObj = new Date(timestamp);
//     return {
//       date: dateObj.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       }),
//       time: dateObj.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       }),
//     };
//   };

//   // Icon selection for each transaction type
//   const getTransactionIcon = (tx) => {
//     const props = { className: "w-4 h-4" };
//     switch (tx.icon) {
//       case 'buy':
//         return <TrendingUp {...props} className={currentTheme.tradeBuy.split(' ')[0]} />;
//       case 'sell':
//         return <TrendingDown {...props} className={currentTheme.tradeSell.split(' ')[0]} />;
//       case 'deposit':
//         return <ArrowDownCircle {...props} className={currentTheme.deposit.split(' ')[0]} />;
//       case 'withdrawal':
//         return <ArrowUpCircle {...props} className={currentTheme.withdrawal.split(' ')[0]} />;
//       default:
//         return <DollarSign {...props} className={currentTheme.default.split(' ')[0]} />;
//     }
//   };

//   // Color style classes based on type
//   const getTransactionColor = (tx) => {
//     switch (tx.type) {
//       case 'trade':
//         return tx.action?.toLowerCase() === 'buy' ? currentTheme.tradeBuy : currentTheme.tradeSell;
//       case 'deposit':
//         return currentTheme.deposit;
//       case 'withdrawal':
//         return currentTheme.withdrawal;
//       default:
//         return currentTheme.default;
//     }
//   };

//   // Summary statistics
//   const stats = useMemo(() => {
//     const totalDeposits = deposits.reduce((acc, d) => acc + d.amount, 0);
//     const totalWithdrawals = withdrawals.reduce((acc, w) => acc + w.amount, 0);
//     const totalTrades = trades.length;

//     return { totalDeposits, totalWithdrawals, totalTrades, netFlow: totalDeposits - totalWithdrawals };
//   }, [deposits, withdrawals, trades]);

//   if (filteredTransactions.length === 0 && allTransactions.length === 0) {
//     return (
//       <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
//         <div className={`max-w-4xl mx-auto ${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow}`}>
//           <div className="flex items-center justify-between mb-6 p-6">
//             <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex items-center gap-2`}>
//               <Clock className={`w-6 h-6 ${currentTheme.textAccent}`} />
//               Transaction History
//             </h2>
//           </div>
//           <div className="text-center py-8">
//             <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${currentTheme.cardBg} flex items-center justify-center ${currentTheme.cardBorder}`}>
//               <DollarSign className={`w-8 h-8 ${currentTheme.textMuted}`} />
//             </div>
//             <p className={`${currentTheme.textSecondary} text-lg`}>No transactions yet</p>
//             <p className={`${currentTheme.textMuted} text-sm mt-2`}>Your transaction history will appear here</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
//       <div className={`max-w-4xl mx-auto ${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow}`}>
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6 p-6">
//           <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex items-center gap-2`}>
//             <Clock className={`w-6 h-6 ${currentTheme.textAccent}`} />
//             Transaction History
//             <span className={`ml-4 text-sm font-normal ${currentTheme.textSecondary}`}>
//               {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
//             </span>
//           </h2>
//         </div>

//         {/* Summary Stats */}
//         <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
//           <div className="text-center">
//             <div className={`text-sm ${currentTheme.textMuted}`}>Total Deposits</div>
//             <div className="text-lg font-bold text-blue-400">{formatCurrency(stats.totalDeposits)}</div>
//           </div>
//           <div className="text-center">
//             <div className={`text-sm ${currentTheme.textMuted}`}>Total Withdrawals</div>
//             <div className="text-lg font-bold text-orange-400">{formatCurrency(stats.totalWithdrawals)}</div>
//           </div>
//           <div className="text-center">
//             <div className={`text-sm ${currentTheme.textMuted}`}>Total Trades</div>
//             <div className={`text-lg font-bold ${currentTheme.textAccent}`}>{stats.totalTrades}</div>
//           </div>
//           <div className="text-center">
//             <div className={`text-sm ${currentTheme.textMuted}`}>Net Flow</div>
//             <div className={`text-lg font-bold ${stats.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//               {formatCurrency(stats.netFlow)}
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6 px-6">
//           <div className="flex items-center gap-2">
//             <Filter className={`w-4 h-4 ${currentTheme.textMuted}`} />
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className={`px-3 py-1 rounded-lg border text-sm ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary}`}
//               aria-label="Filter transactions by type"
//             >
//               <option value="all">All Transactions</option>
//               <option value="trades">Trades Only</option>
//               <option value="deposits">Deposits Only</option>
//               <option value="withdrawals">Withdrawals Only</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <Search className={`w-4 h-4 ${currentTheme.textMuted}`} />
//             <input
//               type="text"
//               placeholder="Search transactions..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               title="Search by description or amount"
//               className={`px-3 py-1 rounded-lg border text-sm ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder}`}
//               aria-label="Search transactions"
//             />
//           </div>

//           <button
//             onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//             className={`px-3 py-1 rounded-lg border text-sm flex items-center gap-1 ${currentTheme.buttonBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary} ${currentTheme.buttonHover}`}
//             aria-label="Toggle transaction sort order"
//           >
//             <Calendar className="w-4 h-4" />
//             {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
//           </button>
//         </div>

//         {/* Transaction List */}
//         <div className={`space-y-3 max-h-96 overflow-y-auto px-6 scrollbar-thin ${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack}`}>
//           {filteredTransactions.map((tx, idx) => {
//             const { date, time } = formatTimestamp(tx.timestamp);

//             return (
//               <div 
//                 key={`${tx.type}-${idx}`}
//                 className={`relative p-4 rounded-lg border cursor-pointer ${getTransactionColor(tx)}`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {getTransactionIcon(tx)}
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className={`font-semibold capitalize text-lg ${currentTheme.textPrimary}`}>
//                           {tx.description}
//                         </span>
//                         <span className={`font-bold ${currentTheme.textPrimary}`}>
//                           {formatCurrency(tx.displayAmount)}
//                         </span>
//                       </div>
//                       <div className={`flex items-center gap-2 text-sm ${currentTheme.textSecondary}`}>
//                         <span>{date}</span>
//                         <span>•</span>
//                         <span>{time}</span>
//                         {tx.type === 'trade' && tx.price && (
//                           <>
//                             <span>•</span>
//                             <span>@ {formatCurrency(tx.price)}</span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <div className={`text-sm ${currentTheme.textSecondary} capitalize`}>
//                       {tx.type}
//                     </div>
//                     <div className={`text-xs ${currentTheme.textMuted}`}>
//                       #{allTransactions.indexOf(tx) + 1}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredTransactions.length > 5 && (
//           <div className={`mt-4 pt-4 border-t px-6 ${currentTheme.cardBorder}`}>
//             <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
//               Showing {filteredTransactions.length} of {allTransactions.length} transactions
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;




import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, ArrowUpCircle, ArrowDownCircle, Filter, Calendar, Search 
} from 'lucide-react';

const TransactionHistory = ({
  trades = [],
  deposits = [],
  withdrawals = [],
  isDarkMode = true,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      containerBorder: 'border-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      textAccent: 'text-emerald-400',
      cardBg: 'bg-gray-800/50',
      cardBorder: 'border-gray-700',
      tradeBuy: 'text-green-400 bg-green-900/20 border-green-700/30',
      tradeSell: 'text-red-400 bg-red-900/20 border-red-700/30',
      deposit: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
      withdrawal: 'text-orange-400 bg-orange-900/20 border-orange-700/30',
      default: 'text-gray-400 bg-gray-900/20 border-gray-700/30',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-700',
      inputPlaceholder: 'placeholder-gray-400',
      buttonBg: 'bg-gray-800',
      buttonHover: 'hover:bg-gray-700',
      scrollbarThumb: 'scrollbar-thumb-gray-600',
      scrollbarTrack: 'scrollbar-track-gray-800',
      shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
    },
    light: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      container: 'bg-white',
      containerBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      textAccent: 'text-emerald-600',
      cardBg: 'bg-gray-50',
      cardBorder: 'border-gray-200',
      tradeBuy: 'text-green-600 bg-green-50 border-green-200',
      tradeSell: 'text-red-600 bg-red-50 border-red-200',
      deposit: 'text-blue-600 bg-blue-50 border-blue-200',
      withdrawal: 'text-orange-600 bg-orange-50 border-orange-200',
      default: 'text-gray-600 bg-gray-50 border-gray-200',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      inputPlaceholder: 'placeholder-gray-500',
      buttonBg: 'bg-white',
      buttonHover: 'hover:bg-gray-50',
      scrollbarThumb: 'scrollbar-thumb-gray-300',
      scrollbarTrack: 'scrollbar-track-gray-100',
      shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
    }
  };

  const themeKey = isDarkMode ? 'dark' : 'light';
  const currentTheme = themeStyles[themeKey] || themeStyles.dark;

  useEffect(() => {
    console.log("TransactionHistory component isDarkMode:", isDarkMode);
  }, [isDarkMode]);

  const allTransactions = useMemo(() => {
    const formattedTrades = trades.map(trade => ({
      ...trade,
      type: 'trade',
      displayAmount: trade.amount,
      description: `${trade.action} Trade`,
      icon: trade.action?.toLowerCase() === 'buy' ? 'buy' : 'sell',
    }));

    const formattedDeposits = deposits.map(deposit => ({
      ...deposit,
      type: 'deposit',
      displayAmount: deposit.amount,
      description: 'Deposit',
      icon: 'deposit',
    }));

    const formattedWithdrawals = withdrawals.map(withdrawal => ({
      ...withdrawal,
      type: 'withdrawal',
      displayAmount: withdrawal.amount,
      description: 'Withdrawal',
      icon: 'withdrawal',
    }));

    const combined = [...formattedTrades, ...formattedDeposits, ...formattedWithdrawals];

    return combined.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [trades, deposits, withdrawals, sortOrder]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    if (filterType === 'trades') {
      filtered = filtered.filter(tx => tx.type === 'trade');
    } else if (filterType === 'deposits') {
      filtered = filtered.filter(tx => tx.type === 'deposit');
    } else if (filterType === 'withdrawals') {
      filtered = filtered.filter(tx => tx.type === 'withdrawal');
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(lowerSearch) ||
        tx.displayAmount.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [allTransactions, filterType, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    return {
      date: dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getTransactionIcon = (tx) => {
    const props = { className: "w-4 h-4" };
    switch (tx.icon) {
      case 'buy':
        return <TrendingUp {...props} className={currentTheme.tradeBuy.split(' ')[0]} />;
      case 'sell':
        return <TrendingDown {...props} className={currentTheme.tradeSell.split(' ')[0]} />;
      case 'deposit':
        return <ArrowDownCircle {...props} className={currentTheme.deposit.split(' ')[0]} />;
      case 'withdrawal':
        return <ArrowUpCircle {...props} className={currentTheme.withdrawal.split(' ')[0]} />;
      default:
        return <DollarSign {...props} className={currentTheme.default.split(' ')[0]} />;
    }
  };

  const getTransactionColor = (tx) => {
    switch (tx.type) {
      case 'trade':
        return tx.action?.toLowerCase() === 'buy' ? currentTheme.tradeBuy : currentTheme.tradeSell;
      case 'deposit':
        return currentTheme.deposit;
      case 'withdrawal':
        return currentTheme.withdrawal;
      default:
        return currentTheme.default;
    }
  };

  const stats = useMemo(() => {
    const totalDeposits = deposits.reduce((acc, d) => acc + d.amount, 0);
    const totalWithdrawals = withdrawals.reduce((acc, w) => acc + w.amount, 0);
    const totalTrades = trades.length;

    return { totalDeposits, totalWithdrawals, totalTrades, netFlow: totalDeposits - totalWithdrawals };
  }, [deposits, withdrawals, trades]);

  if (filteredTransactions.length === 0 && allTransactions.length === 0) {
    return (
      <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
        <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow}`}>
          <div className="flex items-center justify-between mb-6 p-6">
            <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex items-center gap-2`}>
              <Clock className={`w-6 h-6 ${currentTheme.textAccent}`} />
              Transaction History
            </h2>
          </div>
          <div className="text-center py-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${currentTheme.cardBg} flex items-center justify-center ${currentTheme.cardBorder}`}>
              <DollarSign className={`w-8 h-8 ${currentTheme.textMuted}`} />
            </div>
            <p className={`${currentTheme.textSecondary} text-lg`}>No transactions yet</p>
            <p className={`${currentTheme.textMuted} text-sm mt-2`}>Your transaction history will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
      <div className={`${currentTheme.container} ${currentTheme.containerBorder} rounded-xl ${currentTheme.shadow}`}>
        <div className="flex items-center justify-between mb-6 p-6">
          <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex items-center gap-2`}>
            <Clock className={`w-6 h-6 ${currentTheme.textAccent}`} />
            Transaction History
            <span className={`ml-4 text-sm font-normal ${currentTheme.textSecondary}`}>
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
            </span>
          </h2>
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
          <div className="text-center">
            <div className={`text-sm ${currentTheme.textMuted}`}>Total Deposits</div>
            <div className="text-lg font-bold text-blue-400">{formatCurrency(stats.totalDeposits)}</div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${currentTheme.textMuted}`}>Total Withdrawals</div>
            <div className="text-lg font-bold text-orange-400">{formatCurrency(stats.totalWithdrawals)}</div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${currentTheme.textMuted}`}>Total Trades</div>
            <div className={`text-lg font-bold ${currentTheme.textAccent}`}>{stats.totalTrades}</div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${currentTheme.textMuted}`}>Net Flow</div>
            <div className={`text-lg font-bold ${stats.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(stats.netFlow)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-6 px-6">
          <div className="flex items-center gap-2">
            <Filter className={`w-4 h-4 ${currentTheme.textMuted}`} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-1 rounded-lg border text-sm ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary}`}
              aria-label="Filter transactions by type"
            >
              <option value="all">All Transactions</option>
              <option value="trades">Trades Only</option>
              <option value="deposits">Deposits Only</option>
              <option value="withdrawals">Withdrawals Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Search className={`w-4 h-4 ${currentTheme.textMuted}`} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              title="Search by description or amount"
              className={`px-3 py-1 rounded-lg border text-sm ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary} ${currentTheme.inputPlaceholder}`}
              aria-label="Search transactions"
            />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className={`px-3 py-1 rounded-lg border text-sm flex items-center gap-1 ${currentTheme.buttonBg} ${currentTheme.inputBorder} ${currentTheme.textPrimary} ${currentTheme.buttonHover}`}
            aria-label="Toggle transaction sort order"
          >
            <Calendar className="w-4 h-4" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
        <div className={`space-y-3 max-h-96 overflow-y-auto px-6 scrollbar-thin ${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack}`}>
          {filteredTransactions.map((tx, idx) => {
            const { date, time } = formatTimestamp(tx.timestamp);
            return (
              <div 
                key={`${tx.type}-${idx}`}
                className={`relative p-4 rounded-lg border cursor-pointer ${getTransactionColor(tx)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold capitalize text-lg ${currentTheme.textPrimary}`}>
                          {tx.description}
                        </span>
                        <span className={`font-bold ${currentTheme.textPrimary}`}>
                          {formatCurrency(tx.displayAmount)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${currentTheme.textSecondary}`}>
                        <span>{date}</span>
                        <span>•</span>
                        <span>{time}</span>
                        {tx.type === 'trade' && tx.price && (
                          <>
                            <span>•</span>
                            <span>@ {formatCurrency(tx.price)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${currentTheme.textSecondary} capitalize`}>
                      {tx.type}
                    </div>
                    <div className={`text-xs ${currentTheme.textMuted}`}>
                      #{allTransactions.indexOf(tx) + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredTransactions.length > 5 && (
          <div className={`mt-4 pt-4 border-t px-6 ${currentTheme.cardBorder}`}>
            <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
              Showing {filteredTransactions.length} of {allTransactions.length} transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;



