

// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// import { Search, ChevronUp, ChevronDown, Filter, X, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const MarketOverview = ({ theme }) => {
//   const [marketData, setMarketData] = useState([]);
//   const [cachedData, setCachedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('symbol');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [filterBy, setFilterBy] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedTicker, setSelectedTicker] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showAllModal, setShowAllModal] = useState(false);
//   const [chartData, setChartData] = useState(null);
//   const [loadingChart, setLoadingChart] = useState(false);
//   const [chartError, setChartError] = useState(null);
//   const [visibleItems, setVisibleItems] = useState(5);
  
//   const MAX_RETRIES = 3;
//   const ITEMS_PER_PAGE = 3;
//   const scrollContainerRef = useRef(null);

//   // Fetch market data
//   useEffect(() => {
//     const fetchMarketData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/market-data');
        
//         if (!response.ok) {
//           throw new Error(getErrorMessage(response.status));
//         }
        
//         const data = await response.json();
        
//         if (!data || data.length === 0) {
//           throw new Error("No market data available at the moment");
//         }

//         // Map and validate data for all pairs
//         const mappedData = data.map(ticker => ({
//           symbol: ticker.symbol || 'N/A',
//           lastPrice: ticker.lastPrice ? parseFloat(ticker.lastPrice) : 0,
//           price24hPcnt: ticker.price24hPcnt ? parseFloat(ticker.price24hPcnt) : 0,
//           volume24h: ticker.volume24h || 'N/A',
//           highPrice24h: ticker.highPrice24h || 'N/A',
//           lowPrice24h: ticker.lowPrice24h || 'N/A',
//           marketCap: ticker.marketCap || 'N/A',
//           openPrice: ticker.openPrice ? parseFloat(ticker.openPrice) : parseFloat(ticker.lastPrice) || 0
//         }));

//         // Merge with cached data to maintain continuity
//         setMarketData(prev => {
//           const merged = [...mappedData];
//           prev.forEach(prevTicker => {
//             if (!merged.find(t => t.symbol === prevTicker.symbol)) {
//               merged.push(prevTicker);
//             }
//           });
//           return merged;
//         });
        
//         setCachedData(mappedData);
//         setError(null);
//         setRetryCount(0);
//       } catch (err) {
//         console.error('Market data error:', err);
//         setError(err.message);
        
//         if (retryCount < MAX_RETRIES && 
//             (err.message.includes('temporarily unavailable') || 
//              err.message.includes('Cannot connect'))) {
//           setTimeout(() => {
//             setRetryCount(prev => prev + 1);
//           }, 5000 * (retryCount + 1));
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMarketData();
//     const interval = setInterval(fetchMarketData, 30000);

//     return () => clearInterval(interval);
//   }, [retryCount]);

//   // Fetch chart data
//   useEffect(() => {
//     if (!selectedTicker) return;
    
//     const fetchChartData = async () => {
//       try {
//         setLoadingChart(true);
//         setChartError(null);
        
//         console.log(`Fetching chart data for ${selectedTicker.symbol}`);
//         const response = await fetch(
//           `http://localhost:5000/api/chart-data?symbol=${selectedTicker.symbol}`
//         );
        
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`HTTP error ${response.status}: ${errorText}`);
//         }
        
//         const data = await response.json();
//         console.log('Chart data response:', data);
//         if (!data || data.length === 0) {
//           throw new Error('No chart data returned');
//         }
//         setChartData(data);
//       } catch (err) {
//         console.error('Chart data error:', err);
//         setChartError(`Failed to load chart data: ${err.message}`);
//       } finally {
//         setLoadingChart(false);
//       }
//     };
    
//     fetchChartData();
//   }, [selectedTicker]);

//   const getErrorMessage = (status) => {
//     switch (status) {
//       case 500:
//       case 503:
//         return "Market data service is temporarily unavailable";
//       case 504:
//         return "Request timeout. Please try again";
//       case 429:
//         return "Too many requests. Please wait a moment";
//       case 400:
//       case 401:
//       case 403:
//         return "Unable to access market data";
//       default:
//         return "Market data service is temporarily unavailable";
//     }
//   };

//   const filteredAndSortedData = useMemo(() => {
//     let filtered = marketData.filter(ticker => {
//       const matchesSearch = ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase());
//       const priceChange = parseFloat(ticker.price24hPcnt) * 100;
      
//       let matchesFilter = true;
//       if (filterBy === 'gainers') {
//         matchesFilter = priceChange > 0;
//       } else if (filterBy === 'losers') {
//         matchesFilter = priceChange < 0;
//       }
      
//       return matchesSearch && matchesFilter;
//     });

//     filtered.sort((a, b) => {
//       let aValue, bValue;
      
//       switch (sortBy) {
//         case 'symbol':
//           aValue = a.symbol;
//           bValue = b.symbol;
//           break;
//         case 'price':
//           aValue = parseFloat(a.lastPrice);
//           bValue = parseFloat(b.lastPrice);
//           break;
//         case 'change':
//           aValue = parseFloat(a.price24hPcnt);
//           bValue = parseFloat(b.price24hPcnt);
//           break;
//         case 'volume':
//           aValue = parseFloat(a.volume24h || 0);
//           bValue = parseFloat(b.volume24h || 0);
//           break;
//         default:
//           aValue = a.symbol;
//           bValue = b.symbol;
//       }
      
//       if (typeof aValue === 'string') {
//         return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//       }
      
//       return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
//     });

//     return filtered;
//   }, [marketData, searchTerm, sortBy, sortOrder, filterBy]);

//   const paginatedData = filteredAndSortedData.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterBy, sortBy, sortOrder]);

//   const handleRetry = () => {
//     setLoading(true);
//     setError(null);
//     setRetryCount(0);
//   };

//   const formatSymbol = (symbol) => {
//     if (!symbol) return "N/A";
//     const base = symbol.replace('USDT', '');
//     return `${base}/USDT`;
//   };

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('asc');
//     }
//   };

//   const SortIcon = ({ field }) => {
//     if (sortBy !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
//     return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
//   };

//   const handleScroll = useCallback(() => {
//     if (!scrollContainerRef.current) return;
    
//     const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
//     const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.2;
    
//     if (isNearBottom && visibleItems < filteredAndSortedData.length) {
//       setVisibleItems(prev => Math.min(prev + 5, filteredAndSortedData.length));
//     }
//   }, [filteredAndSortedData.length, visibleItems]);

//   const TickerModal = ({ ticker, onClose }) => {
//     if (!ticker) return null;
    
//     const priceChange = parseFloat(ticker.price24hPcnt) * 100;
//     const isPositive = priceChange >= 0;

//     // Prepare Chart.js data
//     const chartLabels = chartData ? chartData.map((_, index) => `Hour ${index + 1}`) : [];
//     const chartPrices = chartData ? chartData.map(point => point.price) : [];

//     const chartConfig = {
//       data: {
//         labels: chartLabels,
//         datasets: [
//           {
//             label: `${formatSymbol(ticker.symbol)} Price`,
//             data: chartPrices,
//             borderColor: theme === 'dark' ? '#34D399' : '#10B981',
//             backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
//             fill: true,
//             tension: 0.4,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             display: true,
//             title: {
//               display: true,
//               text: 'Hour',
//             },
//           },
//           y: {
//             display: true,
//             title: {
//               display: true,
//               text: 'Price (USDT)',
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: true,
//           },
//           tooltip: {
//             enabled: true,
//           },
//         },
//       },
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className={`max-w-2xl w-full rounded-lg p-6 ${
//           theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-black'
//         }`}>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">{formatSymbol(ticker.symbol)}</h2>
//             <button
//               onClick={onClose}
//               className={`p-1 rounded-full hover:bg-opacity-20 ${
//                 theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
//               }`}
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm opacity-75">Last Price</span>
//               <span className="text-lg font-bold">
//                 ${parseFloat(ticker.lastPrice).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 6
//                 })}
//               </span>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span className="text-sm opacity-75">24h Change</span>
//               <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
//                 {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
//               </span>
//             </div>
            
//             <div className="mt-4">
//               <h3 className="text-sm font-medium mb-2">24h Price Chart</h3>
              
//               {loadingChart ? (
//                 <div className="h-48 flex items-center justify-center">
//                   <div className="text-sm">Loading chart...</div>
//                 </div>
//               ) : chartError ? (
//                 <div className="h-48 flex items-center justify-center text-red-400">
//                   <div className="text-sm">{chartError}</div>
//                 </div>
//               ) : chartData && chartData.length > 0 ? (
//                 <div className="relative h-48">
//                   <Line {...chartConfig} />
//                   <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs opacity-75">
//                     <span>Open: ${parseFloat(ticker.openPrice).toFixed(2)}</span>
//                     <span>Current: ${parseFloat(ticker.lastPrice).toFixed(2)}</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-48 flex items-center justify-center">
//                   <div className="text-sm">No chart data available</div>
//                 </div>
//               )}
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div className="flex flex-col">
//                 <span className="text-sm opacity-75">24h Volume</span>
//                 <span className="font-medium">
//                 ${ticker.volume24h !== 'N/A' 
//                     ? parseFloat(ticker.volume24h).toLocaleString(undefined, {
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 0
//                       })
//                     : 'N/A'}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm opacity-75">24h High</span>
//                 <span className="font-medium">
//                   {ticker.highPrice24h !== 'N/A' 
//                     ? `$${parseFloat(ticker.highPrice24h).toLocaleString(undefined, { 
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 6 
//                       })}`
//                     : 'N/A'}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm opacity-75">24h Low</span>
//                 <span className="font-medium">
//                   {ticker.lowPrice24h !== 'N/A' 
//                     ? `$${parseFloat(ticker.lowPrice24h).toLocaleString(undefined, { 
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 6 
//                       })}`
//                     : 'N/A'}
//                 </span>
//               </div>
              
//               <div className="flex flex-col">
//                 <span className="text-sm opacity-75">Market Cap</span>
//                 <span className="font-medium">
//                   {ticker.marketCap !== 'N/A' 
//                     ? `$${parseFloat(ticker.marketCap).toLocaleString(undefined, { 
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 0 
//                       })}`
//                     : 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Rest of the component remains unchanged
//   if (loading && cachedData.length > 0) {
//     return (
//       <div className="space-y-4">
//         <div className={`text-center text-sm ${
//           theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//         }`}>
//           Updating market data...
//         </div>
//         <RenderMarketData />
//       </div>
//     );
//   }

//   if (loading && cachedData.length === 0) {
//     return (
//       <div className="space-y-3">
//         <div className={`text-center text-sm ${
//           theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//         }`}>
//           {retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRIES})` : 'Loading market data...'}
//         </div>
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="flex justify-between">
//             <div className={`h-4 w-1/3 rounded animate-pulse ${
//               theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
//             }`}></div>
//             <div className="flex space-x-2">
//               <div className={`h-4 w-20 rounded animate-pulse ${
//                 theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
//               }`}></div>
//               <div className={`h-4 w-12 rounded animate-pulse ${
//                 theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
//               }`}></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error && cachedData.length === 0) {
//     return (
//       <div className={`p-4 rounded-lg ${
//         theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'
//       }`}>
//         <div className="text-center">
//           <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
//             theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
//           }`}>
//             <Activity className={`h-6 w-6 ${
//               theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//             }`} />
//           </div>
          
//           <h3 className={`text-sm font-medium mb-2 ${
//             theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
//           }`}>
//             Market Data Unavailable
//           </h3>
          
//           <p className={`text-xs mb-4 ${
//             theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//           }`}>
//             {error}
//           </p>
          
//           <button
//             onClick={handleRetry}
//             className="px-4 py-2 text-xs font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const RenderMarketData = () => (
//     <div className="space-y-4">
//       <div className="space-y-3">
//         <div className="relative">
//           <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
//             theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
//           }`} />
//           <input
//             type="text"
//             placeholder="Search symbols..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2 text-sm rounded-md border ${
//               theme === 'dark' 
//                 ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
//                 : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500'
//             } focus:outline-none focus:ring-1 focus:ring-blue-500`}
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md border transition-colors ${
//                 theme === 'dark'
//                   ? 'border-slate-600 hover:bg-slate-700 text-slate-300'
//                   : 'border-gray-300 hover:bg-gray-50 text-gray-600'
//               }`}
//             >
//               <Filter className="w-3 h-3" />
//               <span>Filters</span>
//             </button>
            
//             {showFilters && (
//               <div className="flex space-x-2">
//                 {['all', 'gainers', 'losers'].map((filter) => (
//                   <button
//                     key={filter}
//                     onClick={() => setFilterBy(filter)}
//                     className={`px-2 py-1 text-xs rounded transition-colors ${
//                       filterBy === filter
//                         ? 'bg-blue-600 text-white'
//                         : theme === 'dark'
//                         ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     {filter === 'all' ? 'All' : filter === 'gainers' ? 'Gainers' : 'Losers'}
//                     {filter === 'gainers' && <TrendingUp className="inline w-3 h-3 ml-1" />}
//                     {filter === 'losers' && <TrendingDown className="inline w-3 h-3 ml-1" />}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowAllModal(true)}
//               className={`flex items-center text-xs px-2 py-1 rounded border ${
//                 theme === 'dark'
//                   ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
//                   : 'bg-white border-gray-300 text-black hover:bg-gray-100'
//               }`}
//             >
//               <BarChart2 className="w-4 h-4 mr-1" />
//               View All
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-4 gap-2 pb-2 border-b border-opacity-20 border-gray-500">
//         <button
//           onClick={() => handleSort('symbol')}
//           className={`flex items-center space-x-1 text-xs font-medium text-left ${
//             theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
//           }`}
//         >
//           <span>Symbol</span>
//           <SortIcon field="symbol" />
//         </button>
//         <button
//           onClick={() => handleSort('price')}
//           className={`flex items-center space-x-1 text-xs font-medium text-right ${
//             theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
//           }`}
//         >
//           <span>Price</span>
//           <SortIcon field="price" />
//         </button>
//         <button
//           onClick={() => handleSort('change')}
//           className={`flex items-center space-x-1 text-xs font-medium text-right ${
//             theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
//           }`}
//         >
//           <span>24h Change</span>
//           <SortIcon field="change" />
//         </button>
//         <div className={`text-xs font-medium text-right ${
//           theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//         }`}>
//           Actions
//         </div>
//       </div>

//       <div className="space-y-2">
//         {paginatedData.map((ticker) => {
//           const lastPrice = parseFloat(ticker.lastPrice);
//           const priceChangePercent = parseFloat(ticker.price24hPcnt) * 100;
//           const isPositive = priceChangePercent >= 0;

//           return (
//             <div key={ticker.symbol} className={`grid grid-cols-4 gap-2 py-2 px-2 rounded-md hover:bg-opacity-50 transition-colors ${
//               theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
//             }`}>
//               <span className={`text-sm font-medium ${
//                 theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
//               }`}>
//                 {formatSymbol(ticker.symbol)}
//               </span>
              
//               <span className={`text-sm font-bold text-right ${
//                 theme === 'dark' ? 'text-white' : 'text-black'
//               }`}>
//                 ${lastPrice.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: lastPrice < 1 ? 6 : 2
//                 })}
//               </span>
              
//               <span className={`text-right`}>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   isPositive
//                     ? 'bg-emerald-900/50 text-emerald-400'
//                     : 'bg-red-900/50 text-red-400'
//                 }`}>
//                   {isPositive ? '+' : ''}
//                   {priceChangePercent.toFixed(2)}%
//                 </span>
//               </span>
              
//               <div className="text-right">
//                 <button
//                   onClick={() => setSelectedTicker(ticker)}
//                   className={`px-2 py-1 text-xs rounded transition-colors ${
//                     theme === 'dark'
//                       ? 'bg-slate-600 hover:bg-slate-500 text-white'
//                       : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                   }`}
//                 >
//                   Details
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredAndSortedData.length > ITEMS_PER_PAGE && (
//         <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-gray-500">
//           <div className={`text-xs ${
//             theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//           }`}>
//             Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 text-xs rounded transition-colors ${
//                 currentPage === 1
//                   ? theme === 'dark' ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'
//                   : theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//               }`}
//             >
//               Previous
//             </button>
            
//             <span className={`text-xs ${
//               theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
//             }`}>
//               {currentPage} of {Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)}
//             </span>
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)))}
//               disabled={currentPage === Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)}
//               className={`px-3 py-1 text-xs rounded transition-colors ${
//                 currentPage === Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
//                   ? theme === 'dark' ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'
//                   : theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {showAllModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className={`max-w-4xl w-full max-h-[80vh] flex flex-col rounded-lg ${
//             theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-black'
//           }`}>
//             <div className="p-4 border-b border-opacity-20 border-gray-500">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold">All Market Data</h2>
//                 <button
//                   onClick={() => setShowAllModal(false)}
//                   className={`p-1 rounded-full hover:bg-opacity-20 ${
//                     theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
//                   }`}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
            
//             <div 
//               ref={scrollContainerRef}
//               onScroll={handleScroll}
//               className="flex-1 overflow-auto p-4"
//             >
//               <div className="space-y-2">
//                 {filteredAndSortedData.slice(0, visibleItems).map((ticker) => {
//                   const lastPrice = parseFloat(ticker.lastPrice);
//                   const priceChangePercent = parseFloat(ticker.price24hPcnt) * 100;
//                   const isPositive = priceChangePercent >= 0;
                  
//                   return (
//                     <div key={ticker.symbol} className={`grid grid-cols-4 gap-2 py-2 px-2 rounded-md hover:bg-opacity-50 transition-colors ${
//                       theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
//                     }`}>
//                       <span className={`text-sm font-medium ${
//                         theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
//                       }`}>
//                         {formatSymbol(ticker.symbol)}
//                       </span>
                      
//                       <span className={`text-sm font-bold text-right ${
//                         theme === 'dark' ? 'text-white' : 'text-black'
//                       }`}>
//                         ${lastPrice.toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: lastPrice < 1 ? 6 : 2
//                         })}
//                       </span>
                      
//                       <span className={`text-right`}>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           isPositive
//                             ? 'bg-emerald-900/50 text-emerald-400'
//                             : 'bg-red-900/50 text-red-400'
//                         }`}>
//                           {isPositive ? '+' : ''}
//                           {priceChangePercent.toFixed(2)}%
//                         </span>
//                       </span>
                      
//                       <div className="text-right">
//                         <button
//                           onClick={() => setSelectedTicker(ticker)}
//                           className={`px-2 py-1 text-xs rounded transition-colors ${
//                             theme === 'dark'
//                               ? 'bg-slate-600 hover:bg-slate-500 text-white'
//                               : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                           }`}
//                         >
//                           Details
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
              
//               {visibleItems < filteredAndSortedData.length && (
//                 <div className="text-center py-4">
//                   <button
//                     onClick={() => setVisibleItems(prev => prev + 5)}
//                     className={`px-4 py-2 text-sm rounded transition-colors ${
//                       theme === 'dark'
//                         ? 'bg-slate-700 hover:bg-slate-600 text-white'
//                         : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                     }`}
//                   >
//                     Load More
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <TickerModal ticker={selectedTicker} onClose={() => setSelectedTicker(null)} theme={theme} chartData={chartData} loadingChart={loadingChart} chartError={chartError} />
//     </div>
//   );

//   return <RenderMarketData />;
// };

// export default MarketOverview;



import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, Filter, X, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketOverview = ({ theme }) => {
  const [marketData, setMarketData] = useState([]);
  const [cachedData, setCachedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(5);
  
  const MAX_RETRIES = 3;
  const ITEMS_PER_PAGE = 3;
  const scrollContainerRef = useRef(null);

  // Fetch market data (unchanged)
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/market-data');
        
        if (!response.ok) {
          throw new Error(getErrorMessage(response.status));
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          throw new Error("No market data available at the moment");
        }

        const mappedData = data.map(ticker => ({
          symbol: ticker.symbol || 'N/A',
          lastPrice: ticker.lastPrice ? parseFloat(ticker.lastPrice) : 0,
          price24hPcnt: ticker.price24hPcnt ? parseFloat(ticker.price24hPcnt) : 0,
          volume24h: ticker.volume24h || 'N/A',
          highPrice24h: ticker.highPrice24h || 'N/A',
          lowPrice24h: ticker.lowPrice24h || 'N/A',
          marketCap: ticker.marketCap || 'N/A',
          openPrice: ticker.openPrice ? parseFloat(ticker.openPrice) : parseFloat(ticker.lastPrice) || 0
        }));

        setMarketData(prev => {
          const merged = [...mappedData];
          prev.forEach(prevTicker => {
            if (!merged.find(t => t.symbol === prevTicker.symbol)) {
              merged.push(prevTicker);
            }
          });
          return merged;
        });
        
        setCachedData(mappedData);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Market data error:', err);
        setError(err.message);
        
        if (retryCount < MAX_RETRIES && 
            (err.message.includes('temporarily unavailable') || 
             err.message.includes('Cannot connect'))) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000 * (retryCount + 1));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);

    return () => clearInterval(interval);
  }, [retryCount]);

  // Fetch chart data with improved error handling
  useEffect(() => {
    if (!selectedTicker) return;
    
    const fetchChartData = async () => {
      try {
        setLoadingChart(true);
        setChartError(null);
        
        console.log(`Fetching chart data for ${selectedTicker.symbol}`);
        const response = await fetch(
          `http://localhost:5000/api/chart-data?symbol=${selectedTicker.symbol}`
        );
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: 'Unknown error', code: response.status };
          }
          console.error(`Chart fetch error: HTTP ${response.status}`, errorData);
          
          // Map backend error codes to user-friendly messages
          const errorMessage = mapChartError(errorData);
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Chart data response:', data);
        if (!data || data.length === 0) {
          throw new Error('No chart data available for this symbol');
        }
        setChartData(data);
      } catch (err) {
        console.error('Chart data error:', err.message);
        setChartError(err.message);
      } finally {
        setLoadingChart(false);
      }
    };
    
    fetchChartData();
  }, [selectedTicker]);

  // Map backend error codes to user-friendly messages
  const mapChartError = (errorData) => {
    const { code, error } = errorData;
    switch (code) {
      case 'SERVICE_UNAVAILABLE':
        return 'Chart data is temporarily unavailable. Please try again later.';
      case 'TIMEOUT':
        return 'Request timed out. Please check your connection and try again.';
      case 'CONNECTION_ERROR':
        return 'Unable to connect to the data service. Please try again later.';
      case 'INTERNAL_ERROR':
        return 'An unexpected error occurred. Please try again later.';
      case 400:
        return 'Invalid request. Please select a different symbol.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      default:
        return error?.includes('Invalid symbol') 
          ? 'Chart data not available for this symbol.'
          : 'Unable to load chart data. Please try again later.';
    }
  };

  const getErrorMessage = (status) => {
    switch (status) {
      case 500:
      case 503:
        return "Market data service is temporarily unavailable";
      case 504:
        return "Request timeout. Please try again";
      case 429:
        return "Too many requests. Please wait a moment";
      case 400:
      case 401:
      case 403:
        return "Unable to access market data";
      default:
        return "Market data service is temporarily unavailable";
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = marketData.filter(ticker => {
      const matchesSearch = ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const priceChange = parseFloat(ticker.price24hPcnt) * 100;
      
      let matchesFilter = true;
      if (filterBy === 'gainers') {
        matchesFilter = priceChange > 0;
      } else if (filterBy === 'losers') {
        matchesFilter = priceChange < 0;
      }
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'price':
          aValue = parseFloat(a.lastPrice);
          bValue = parseFloat(b.lastPrice);
          break;
        case 'change':
          aValue = parseFloat(a.price24hPcnt);
          bValue = parseFloat(a.price24hPcnt);
          break;
        case 'volume':
          aValue = parseFloat(a.volume24h || 0);
          bValue = parseFloat(b.volume24h || 0);
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [marketData, searchTerm, sortBy, sortOrder, filterBy]);

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy, sortOrder]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
  };

  const formatSymbol = (symbol) => {
    if (!symbol) return "N/A";
    const base = symbol.replace('USDT', '');
    return `${base}/USDT`;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.2;
    
    if (isNearBottom && visibleItems < filteredAndSortedData.length) {
      setVisibleItems(prev => Math.min(prev + 5, filteredAndSortedData.length));
    }
  }, [filteredAndSortedData.length, visibleItems]);

  const TickerModal = ({ ticker, onClose, theme, chartData, loadingChart, chartError }) => {
    if (!ticker) return null;
    
    const priceChange = parseFloat(ticker.price24hPcnt) * 100;
    const isPositive = priceChange >= 0;

    // Prepare Chart.js data
    const chartLabels = chartData ? chartData.map((_, index) => `Hour ${index + 1}`) : [];
    const chartPrices = chartData ? chartData.map(point => point.price) : [];

    const chartConfig = {
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: `${formatSymbol(ticker.symbol)} Price`,
            data: chartPrices,
            borderColor: theme === 'dark' ? '#34D399' : '#10B981',
            backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Hour',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Price (USDT)',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-2xl w-full rounded-lg p-6 ${
          theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-black'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{formatSymbol(ticker.symbol)}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Last Price</span>
              <span className="text-lg font-bold">
                ${parseFloat(ticker.lastPrice).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">24h Change</span>
              <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">24h Price Chart</h3>
              
              {loadingChart ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="text-sm">Loading chart...</div>
                </div>
              ) : chartError ? (
                <div className="h-48 flex items-center justify-center text-red-400">
                  <div className="text-sm">{chartError}</div>
                </div>
              ) : chartData && chartData.length > 0 ? (
                <div className="relative h-48">
                  <Line {...chartConfig} />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs opacity-75">
                    <span>Open: ${parseFloat(ticker.openPrice).toFixed(2)}</span>
                    <span>Current: ${parseFloat(ticker.lastPrice).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <div className="text-sm">No chart data available</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-sm opacity-75">24h Volume</span>
                <span className="font-medium">
                  {ticker.volume24h !== 'N/A' 
                    ? parseFloat(ticker.volume24h).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })
                    : 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm opacity-75">24h High</span>
                <span className="font-medium">
                  {ticker.highPrice24h !== 'N/A' 
                    ? `$${parseFloat(ticker.highPrice24h).toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6 
                      })}`
                    : 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm opacity-75">24h Low</span>
                <span className="font-medium">
                  {ticker.lowPrice24h !== 'N/A' 
                    ? `$${parseFloat(ticker.lowPrice24h).toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6 
                      })}`
                    : 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm opacity-75">Market Cap</span>
                <span className="font-medium">
                  {ticker.marketCap !== 'N/A' 
                    ? `$${parseFloat(ticker.marketCap).toLocaleString(undefined, { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0 
                      })}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rest of the component (unchanged)
  if (loading && cachedData.length > 0) {
    return (
      <div className="space-y-4">
        <div className={`text-center text-sm ${
          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Updating market data...
        </div>
        <RenderMarketData />
      </div>
    );
  }

  if (loading && cachedData.length === 0) {
    return (
      <div className="space-y-3">
        <div className={`text-center text-sm ${
          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
        }`}>
          {retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRIES})` : 'Loading market data...'}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <div className={`h-4 w-1/3 rounded animate-pulse ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
            }`}></div>
            <div className="flex space-x-2">
              <div className={`h-4 w-20 rounded animate-pulse ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 w-12 rounded animate-pulse ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && cachedData.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <Activity className={`h-6 w-6 ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
            }`} />
          </div>
          
          <h3 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Market Data Unavailable
          </h3>
          
          <p className={`text-xs mb-4 ${
            theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
          }`}>
            {error}
          </p>
          
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-xs font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const RenderMarketData = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm rounded-md border ${
              theme === 'dark' 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-600 hover:bg-slate-700 text-slate-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
            </button>
            
            {showFilters && (
              <div className="flex space-x-2">
                {['all', 'gainers', 'losers'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      filterBy === filter
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'gainers' ? 'Gainers' : 'Losers'}
                    {filter === 'gainers' && <TrendingUp className="inline w-3 h-3 ml-1" />}
                    {filter === 'losers' && <TrendingDown className="inline w-3 h-3 ml-1" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAllModal(true)}
              className={`flex items-center text-xs px-2 py-1 rounded border ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                  : 'bg-white border-gray-300 text-black hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-1" />
              View All
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pb-2 border-b border-opacity-20 border-gray-500">
        <button
          onClick={() => handleSort('symbol')}
          className={`flex items-center space-x-1 text-xs font-medium text-left ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          <span>Symbol</span>
          <SortIcon field="symbol" />
        </button>
        <button
          onClick={() => handleSort('price')}
          className={`flex items-center space-x-1 text-xs font-medium text-right ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          <span>Price</span>
          <SortIcon field="price" />
        </button>
        <button
          onClick={() => handleSort('change')}
          className={`flex items-center space-x-1 text-xs font-medium text-right ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          <span>24h Change</span>
          <SortIcon field="change" />
        </button>
        <div className={`text-xs font-medium text-right ${
          theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
        }`}>
          Actions
        </div>
      </div>

      <div className="space-y-2">
        {paginatedData.map((ticker) => {
          const lastPrice = parseFloat(ticker.lastPrice);
          const priceChangePercent = parseFloat(ticker.price24hPcnt) * 100;
          const isPositive = priceChangePercent >= 0;

          return (
            <div key={ticker.symbol} className={`grid grid-cols-4 gap-2 py-2 px-2 rounded-md hover:bg-opacity-50 transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {formatSymbol(ticker.symbol)}
              </span>
              
              <span className={`text-sm font-bold text-right ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                ${lastPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: lastPrice < 1 ? 6 : 2
                })}
              </span>
              
              <span className={`text-right`}>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isPositive
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {isPositive ? '+' : ''}
                  {priceChangePercent.toFixed(2)}%
                </span>
              </span>
              
              <div className="text-right">
                <button
                  onClick={() => setSelectedTicker(ticker)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-600 hover:bg-slate-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedData.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-gray-500">
          <div className={`text-xs ${
            theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentPage === 1
                  ? theme === 'dark' ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'
                  : theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Previous
            </button>
            
            <span className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {currentPage} of {Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)))}
              disabled={currentPage === Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                currentPage === Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
                  ? theme === 'dark' ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'
                  : theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-4xl w-full max-h-[80vh] flex flex-col rounded-lg ${
            theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-black'
          }`}>
            <div className="p-4 border-b border-opacity-20 border-gray-500">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">All Market Data</h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className={`p-1 rounded-full hover:bg-opacity-20 ${
                    theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-auto p-4"
            >
              <div className="space-y-2">
                {filteredAndSortedData.slice(0, visibleItems).map((ticker) => {
                  const lastPrice = parseFloat(ticker.lastPrice);
                  const priceChangePercent = parseFloat(ticker.price24hPcnt) * 100;
                  const isPositive = priceChangePercent >= 0;
                  
                  return (
                    <div key={ticker.symbol} className={`grid grid-cols-4 gap-2 py-2 px-2 rounded-md hover:bg-opacity-50 transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {formatSymbol(ticker.symbol)}
                      </span>
                      
                      <span className={`text-sm font-bold text-right ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        ${lastPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: lastPrice < 1 ? 6 : 2
                        })}
                      </span>
                      
                      <span className={`text-right`}>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isPositive
                            ? 'bg-emerald-900/50 text-emerald-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {isPositive ? '+' : ''}
                          {priceChangePercent.toFixed(2)}%
                        </span>
                      </span>
                      
                      <div className="text-right">
                        <button
                          onClick={() => setSelectedTicker(ticker)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            theme === 'dark'
                              ? 'bg-slate-600 hover:bg-slate-500 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {visibleItems < filteredAndSortedData.length && (
                <div className="text-center py-4">
                  <button
                    onClick={() => setVisibleItems(prev => prev + 5)}
                    className={`px-4 py-2 text-sm rounded transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TickerModal 
        ticker={selectedTicker} 
        onClose={() => setSelectedTicker(null)} 
        theme={theme} 
        chartData={chartData} 
        loadingChart={loadingChart} 
        chartError={chartError} 
      />
    </div>
  );

  return <RenderMarketData />;
};

export default MarketOverview;