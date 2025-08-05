


// import React, { useState, useEffect } from 'react';
// import { Shield, CheckCircle, Radio, Circle, Lock, Zap, TrendingUp, Activity, BarChart3, Target } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const GimaConnectionApp = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isActivityOpen, setIsActivityOpen] = useState(false);
//   const [isViewActivityLoading, setIsViewActivityLoading] = useState(false);
//   const [isTradePanelLoading, setIsTradePanelLoading] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const navigate = useNavigate();

//   const closeModal = () => setModalContent(null);

//   // Check for existing connection on component mount
//   useEffect(() => {
//     const connectionStatus = localStorage?.getItem?.('gimaConnected');
    
//     if (connectionStatus === 'true') {
//       const initTimer = setTimeout(() => {
//         setIsLoading(false);
//         setIsConnected(true);
//       }, 2000);
      
//       return () => clearTimeout(initTimer);
//     } else {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleConnect = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsViewActivityLoading(false);
//       if (typeof Storage !== "undefined") {
//         localStorage.setItem('gimaConnected', 'true');
//       }
//     }, 3000);
//   };

//   const handleViewActivity = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsActivityOpen(true);
//       setIsViewActivityLoading(false);
//     }, 3000);
//   };

//   const handleNavigateToTradePanel = () => {
//     setIsTradePanelLoading(true);
//     setTimeout(() => {
//       navigate('/dashboard/trade/panel');
//       setIsTradePanelLoading(false);
//     }, 3000);
//   };

//   const getContent = () => {
//     switch (modalContent) {
//       case 'Terms':
//         return <p>These are the terms of use...</p>;
//       case 'Privacy':
//         return <p>This is our privacy policy...</p>;
//       case 'Security':
//         return <p>Security practices are outlined here...</p>;
//       case 'Contact':
//         return <p>Contact us at: support@gimablockchain.com</p>;
//       default:
//         return null;
//     }
//   };

//   // Enhanced background with more sophisticated gradients
//   const BackgroundElements = () => (
//     <>
//       {/* Primary ambient lighting */}
//       <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/25 via-cyan-400/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
//       <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-indigo-600/20 via-blue-500/10 to-transparent rounded-full blur-[120px]" style={{ animationDelay: '1s' }}></div>
      
//       {/* Secondary accent lights */}
//       <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-blue-400/15 to-transparent rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
//       <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-radial from-cyan-300/20 to-transparent rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      
//       {/* Subtle grid pattern overlay */}
//       <div className="absolute inset-0 opacity-[0.02]" style={{
//         backgroundImage: `
//           linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
//         `,
//         backgroundSize: '50px 50px'
//       }}></div>
//     </>
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden flex items-center justify-center">
//         <BackgroundElements />
        
//         <div className="relative z-10">
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-10 flex flex-col items-center space-y-8">
//             {/* Enhanced loading spinner */}
//             <div className="relative">
//               <div className="w-20 h-20 border-[3px] border-white/10 rounded-full"></div>
//               <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20"></div>
//               <div className="absolute top-1 left-1 w-[72px] h-[72px] border-[2px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin shadow-md shadow-blue-500/20" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
//               <div className="absolute top-3 left-3 w-14 h-14 border border-transparent border-t-indigo-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
//             </div>
            
//             <div className="text-center space-y-4">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">
//                 Initializing GIMA Trading Algorithm
//               </h3>
//               <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
//                 Establishing secure connection to institutional trading infrastructure
//               </p>
//               <div className="flex items-center justify-center space-x-2 text-gray-400">
//                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
//                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
//               </div>
//             </div>
            
//             {/* Enhanced status indicators */}
//             <div className="flex space-x-6 text-xs text-gray-300">
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 rounded-lg flex items-center justify-center border border-cyan-400/20">
//                   <Shield className="w-4 h-4 text-cyan-400" />
//                 </div>
//                 <span>Secure</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg flex items-center justify-center border border-blue-400/20">
//                   <Zap className="w-4 h-4 text-blue-400" />
//                 </div>
//                 <span>Processing</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 rounded-lg flex items-center justify-center border border-indigo-400/20">
//                   <TrendingUp className="w-4 h-4 text-indigo-400" />
//                 </div>
//                 <span>Analyzing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isConnected) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden flex items-center justify-center">
//         <BackgroundElements />
  
//         <div className="relative z-10 max-w-md w-full">
//           {/* Header with enhanced styling */}
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className="w-10 h-10 bg-slate-800/50 border border-cyan-400/30 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200">
//               <Lock className="w-6 h-6 text-cyan-300" />
//             </div>

//             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30"></div>
//             </div>
//             <div className="ml-4">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
//                 GIMA
//               </h2>
//               <p className="text-gray-400 text-sm font-medium">Trading Algorithm</p>
//             </div>
//           </div>

//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center space-y-8">
//             {/* Enhanced icon */}
//             <div className="relative">
   
//             <div className="w-10 h-10 bg-slate-800/50 border border-cyan-400/30 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200">
//               <Shield className="w-6 h-6 text-cyan-300" />
//             </div>

//               <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40"></div>
//             </div>

//             <div className="text-center space-y-4">
//               <p className="text-gray-300 leading-relaxed max-w-sm text-sm">
//                 Activate your smart account to deploy{' '}
//                 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text font-semibold">
//                   GimaBlockchain's proprietary GIMA Trading Algorithm
//                 </span>{' '}
//                 — an advanced algorithmic trading system that autonomously analyzes market conditions and executes high-precision trades in real time, delivering real-time market analysis and automated trade execution with unmatched accuracy and institutional precision. Historically, the system has demonstrated consistent monthly returns ranging between 8% and 10.2%, with a zero recorded loss rate.
//               </p>

//               {/* Disclaimer */}
//               <p className="text-gray-500 text-sm italic max-w-sm mx-auto">
//                 Past performance is not indicative of future results. Trading involves risk, and returns are not 100% guaranteed.
//               </p>

//               {/* Feature highlights */}
//               <div className="grid grid-cols-3 gap-3 pt-4">
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-cyan-400/20">
//                     <Activity className="w-4 h-4 text-cyan-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Real-time</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-blue-400/20">
//                     <BarChart3 className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Analytics</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-indigo-400/20">
//                     <Target className="w-4 h-4 text-indigo-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Precision</span>
//                 </div>
//               </div>
//             </div>


//           <button
//           onClick={handleConnect}
//           disabled={isViewActivityLoading || isTradePanelLoading}
//           className="group relative inline-flex items-center px-8 py-4 text-base font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-2xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//         >
//           {isViewActivityLoading ? (
//             <>
//               <span className="relative">Connecting</span>
//               <div className="relative w-5 h-5 ml-3 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
//             </>
//           ) : (
//             <>
//               <span className="relative">Activate & Connect</span>
//               <Radio className="relative w-5 h-5 ml-3 animate-pulse" />
//             </>
//           )}
//         </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden flex flex-col">
//       <BackgroundElements />
      
//       <div className="max-w-5xl mx-auto relative z-10 flex-grow">
       
//         <div className="absolute top-0 right-10 w-80 mb-8">
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-cyan-500/10 border border-emerald-400/30 rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] p-6">
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-emerald-300 mb-1">
//                   Smart Account Connected
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Institutional-grade access active
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
        
        
//         <div className="text-center mb-18 mt-12  pt-24">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
//             GIMA Trading Algorithm
//           </h1>
//           <p className="text-gray-400 text-lg">Institutional-Grade Quantitative Trading System</p>
//         </div>

//         <div className="space-y-8">
        
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-8">
         
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 Connected
//               </div>
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-green-500/20 text-green-300 border border-green-400/30 animate-pulse shadow-lg shadow-green-500/10">
//                 <Circle className="w-4 h-4 mr-2 animate-ping" />
//                 LIVE
//               </div>
            
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-400/30 shadow-lg shadow-blue-500/10">
//                 <Activity className="w-4 h-4 mr-2" />
//                 Processing
//               </div>
//             </div>

          
//             <div className="mb-8">
//               <p className="text-gray-300 leading-relaxed text-lg mb-6">
//                 Your smart account is now actively synchronized with GimaBlockchain's proprietary{' '}
//                 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text font-semibold">
//                   GIMA Trading Algorithm
//                 </span>
//                 , receiving real-time institutional trading signals. This cutting-edge quantitative system leverages multi-factor analysis, machine learning models, and high-frequency data processing to deliver superior trading performance.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="group p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
//                     <span className="text-sm font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">Live Signal Processing</span>
//                   </div>
//                 </div>
//                 <div className="group p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                     <span className="text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors">Real-time Risk Assessment</span>
//                   </div>
//                 </div>
//                 <div className="group p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                     <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-300 transition-colors">Active Trade Optimization</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

     
//             <div className="flex items-center justify-between pt-6 border-t border-white/10">
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">
//                   Powered by GimaBlockchain Technology
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Enterprise-grade infrastructure • 99.9% uptime
//                 </p>
//               </div>
//               <div className="flex space-x-4">
//                 <button 
//                   onClick={handleViewActivity}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   {isViewActivityLoading ? (
//                     <>
//                       <span className="relative">Loading</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-cyan-300/70 border-t-cyan-300 rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">View Live Activity</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleNavigateToTradePanel}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
//                   {isTradePanelLoading ? (
//                     <>
//                       <span className="relative">Navigating</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-white/70 border-t-white rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">Go to Trade Panel</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

        
//           {isActivityOpen && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
//               <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-8 max-w-2xl w-full mx-4">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
//                     Live Trading Activity
//                   </h3>
//                   <p className="text-gray-400 text-sm">Real-time system monitoring</p>
//                 </div>
                
//                 <div className="space-y-4 mb-8">
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
//                       <span className="text-gray-300 font-medium">Signal Processing</span>
//                     </div>
//                     <span className="text-emerald-300 font-semibold">Active</span>
//                   </div>
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                       <span className="text-gray-300 font-medium">Market Analysis</span>
//                     </div>
//                     <span className="text-blue-300 font-semibold">Running</span>
//                   </div>
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 rounded-2xl border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                       <span className="text-gray-300 font-medium">Trade Execution</span>
//                     </div>
//                     <span className="text-indigo-300 font-semibold">Monitoring</span>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => setIsActivityOpen(false)}
//                   className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>










// import React, { useState, useEffect } from 'react';
// import { Shield, CheckCircle, Radio, Circle, Lock, Zap, TrendingUp, Activity, BarChart3, Target } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const GimaConnectionApp = () => {
//   // { isDarkMode = true }
   
//   const [isLoading, setIsLoading] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isActivityOpen, setIsActivityOpen] = useState(false);
//   const [isViewActivityLoading, setIsViewActivityLoading] = useState(false);
//   const [isTradePanelLoading, setIsTradePanelLoading] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const navigate = useNavigate();

//   const closeModal = () => setModalContent(null);

//   // Check for existing connection on component mount
//   useEffect(() => {
//     const connectionStatus = localStorage?.getItem?.('gimaConnected');
    
//     if (connectionStatus === 'true') {
//       const initTimer = setTimeout(() => {
//         setIsLoading(false);
//         setIsConnected(true);
//       }, 2000);
      
//       return () => clearTimeout(initTimer);
//     } else {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleConnect = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsViewActivityLoading(false);
//       if (typeof Storage !== "undefined") {
//         localStorage.setItem('gimaConnected', 'true');
//       }
//     }, 3000);
//   };

//   const handleViewActivity = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsActivityOpen(true);
//       setIsViewActivityLoading(false);
//     }, 3000);
//   };

//   const handleNavigateToTradePanel = () => {
//     setIsTradePanelLoading(true);
//     setTimeout(() => {
//       navigate('/dashboard/trade/panel');
//       setIsTradePanelLoading(false);
//     }, 3000);
//   };

//   const getContent = () => {
//     switch (modalContent) {
//       case 'Terms':
//         return <p>These are the terms of use...</p>;
//       case 'Privacy':
//         return <p>This is our privacy policy...</p>;
//       case 'Security':
//         return <p>Security practices are outlined here...</p>;
//       case 'Contact':
//         return <p>Contact us at: support@gimablockchain.com</p>;
//       default:
//         return null;
//     }
//   };

//   // Enhanced background with more sophisticated gradients
//   const BackgroundElements = () => (
//     <>
//       {/* Primary ambient lighting */}
//       <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/25 via-cyan-400/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
//       <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-indigo-600/20 via-blue-500/10 to-transparent rounded-full blur-[120px]" style={{ animationDelay: '1s' }}></div>
      
//       {/* Secondary accent lights */}
//       <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-blue-400/15 to-transparent rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
//       <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-radial from-cyan-300/20 to-transparent rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      
//       {/* Subtle grid pattern overlay */}
//       <div className="absolute inset-0 opacity-[0.02]" style={{
//         backgroundImage: `
//           linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
//         `,
//         backgroundSize: '50px 50px',
        
//       }}></div>
//     </>
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen  bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden flex items-center justify-center">
//         <BackgroundElements />
        
//         <div className="relative z-10">
          
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-10 flex flex-col items-center space-y-8">
//             {/* Enhanced loading spinner */}
//             <div className="relative">
//               <div className="w-20 h-20 border-[3px] border-white/10 rounded-full"></div>
//               <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20"></div>
//               <div className="absolute top-1 left-1 w-[72px] h-[72px] border-[2px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin shadow-md shadow-blue-500/20" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
//               <div className="absolute top-3 left-3 w-14 h-14 border border-transparent border-t-indigo-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
//             </div>
            
//             <div className="text-center space-y-4">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent tracking-tight">
//                 Initializing GIMA Trading Algorithm
//               </h3>
//               <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
//                 Establishing secure connection to institutional trading infrastructure
//               </p>
//               <div className="flex items-center justify-center space-x-2 text-gray-400">
//                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
//                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
//               </div>
//             </div>
            
//             {/* Enhanced status indicators */}
//             <div className="flex space-x-6 text-xs text-gray-300">
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 rounded-lg flex items-center justify-center border border-cyan-400/20">
//                   <Shield className="w-4 h-4 text-cyan-400" />
//                 </div>
//                 <span>Secure</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg flex items-center justify-center border border-blue-400/20">
//                   <Zap className="w-4 h-4 text-blue-400" />
//                 </div>
//                 <span>Processing</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 rounded-lg flex items-center justify-center border border-indigo-400/20">
//                   <TrendingUp className="w-4 h-4 text-indigo-400" />
//                 </div>
//                 <span>Analyzing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isConnected) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden flex items-center justify-center">
//         <BackgroundElements />
  
//         <div className="relative z-10 max-w-md w-full">
//           {/* Header with enhanced styling */}
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className="w-10 h-10 bg-slate-800/50 border border-cyan-400/30 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200">
//               <Lock className="w-6 h-6 text-cyan-300" />
//             </div>

//             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30"></div>
//             </div>
//             <div className="ml-4">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
//                 GIMA
//               </h2>
//               <p className="text-gray-400 text-sm font-medium">Trading Algorithm</p>
//             </div>
//           </div>

//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center space-y-8">
//             {/* Enhanced icon */}
//             <div className="relative">
   
//             <div className="w-10 h-10 bg-slate-800/50 border border-cyan-400/30 rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200">
//               <Shield className="w-6 h-6 text-cyan-300" />
//             </div>

//               <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40"></div>
//             </div>

//             <div className="text-center space-y-4">
//               <p className="text-gray-300 leading-relaxed max-w-sm text-sm">
//                 Activate your smart account to deploy{' '}
//                 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text font-semibold">
//                   GimaBlockchain's proprietary GIMA Trading Algorithm
//                 </span>{' '}
//                 — an advanced algorithmic trading system that autonomously analyzes market conditions and executes high-precision trades in real time, delivering real-time market analysis and automated trade execution with unmatched accuracy and institutional precision. Historically, the system has demonstrated consistent monthly returns ranging between 8% and 10.2%, with a zero recorded loss rate.
//               </p>

//               {/* Disclaimer */}
//               <p className="text-gray-500 text-sm italic max-w-sm mx-auto">
//                 Past performance is not indicative of future results. Trading involves risk, and returns are not 100% guaranteed.
//               </p>

//               {/* Feature highlights */}
//               <div className="grid grid-cols-3 gap-3 pt-4">
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-cyan-400/20">
//                     <Activity className="w-4 h-4 text-cyan-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Real-time</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-blue-400/20">
//                     <BarChart3 className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Analytics</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-indigo-400/20">
//                     <Target className="w-4 h-4 text-indigo-400" />
//                   </div>
//                   <span className="text-xs text-gray-400">Precision</span>
//                 </div>
//               </div>
//             </div>


//           <button
//           onClick={handleConnect}
//           disabled={isViewActivityLoading || isTradePanelLoading}
//           className="group relative inline-flex items-center px-8 py-4 text-base font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-2xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//         >
//           {isViewActivityLoading ? (
//             <>
//               <span className="relative">Connecting</span>
//               <div className="relative w-5 h-5 ml-3 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
//             </>
//           ) : (
//             <>
//               <span className="relative">Activate & Connect</span>
//               <Radio className="relative w-5 h-5 ml-3 animate-pulse" />
//             </>
//           )}
//         </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 relative overflow-hidden flex flex-col">
//       <BackgroundElements />
      
//       <div className="max-w-5xl mx-auto relative z-10 flex-grow w-full">
       
//         {/* Mobile-friendly connection status - moved to top and stacked */}
//         <div className="w-full mb-6 sm:mb-8">
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-cyan-500/10 border border-emerald-400/30 rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] p-4 sm:p-6">
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//               </div>
//               <div className="flex-grow min-w-0">
//                 <p className="text-sm font-bold text-emerald-300 mb-1">
//                   Smart Account Connected
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Institutional-grade access active
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile-friendly header */}
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
//             GIMA Trading Algorithm
//           </h1>
//           <p className="text-gray-400 text-sm sm:text-lg px-4">Institutional-Grade Quantitative Trading System</p>
//         </div>

//         <div className="space-y-6 sm:space-y-8">
        
//           <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-4 sm:p-8">
         
//             {/* Mobile-friendly status badges */}
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10">
//                 <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Connected
//               </div>
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-green-500/20 text-green-300 border border-green-400/30 animate-pulse shadow-lg shadow-green-500/10">
//                 <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-ping" />
//                 LIVE
//               </div>
            
//               <div className="inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-400/30 shadow-lg shadow-blue-500/10">
//                 <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Processing
//               </div>
//             </div>

          
//             <div className="mb-6 sm:mb-8">
//               <p className="text-gray-300 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6">
//                 Your smart account is now actively synchronized with GimaBlockchain's proprietary{' '}
//                 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text font-semibold">
//                   GIMA Trading Algorithm
//                 </span>
//                 , receiving real-time institutional trading signals. This cutting-edge quantitative system leverages multi-factor analysis, machine learning models, and high-frequency data processing to deliver superior trading performance.
//               </p>

//               {/* Mobile-friendly feature grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                 <div className="group p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
//                     <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">Live Signal Processing</span>
//                   </div>
//                 </div>
//                 <div className="group p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                     <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors">Real-time Risk Assessment</span>
//                   </div>
//                 </div>
//                 <div className="group p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                     <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-indigo-300 transition-colors">Active Trade Optimization</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

     
//             {/* Mobile-friendly footer section */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 space-y-4 sm:space-y-0">
//               <div className="text-center sm:text-left">
//                 <p className="text-xs sm:text-sm text-gray-400 mb-1">
//                   Powered by GimaBlockchain Technology
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Enterprise-grade infrastructure • 99.9% uptime
//                 </p>
//               </div>
              
//               {/* Mobile-friendly button layout */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 <button 
//                   onClick={handleViewActivity}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   {isViewActivityLoading ? (
//                     <>
//                       <span className="relative">Loading</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-cyan-300/70 border-t-cyan-300 rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">View Live Activity</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleNavigateToTradePanel}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
//                   {isTradePanelLoading ? (
//                     <>
//                       <span className="relative">Navigating</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-white/70 border-t-white rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">Go to Trade Panel</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

        
//           {isActivityOpen && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
//               <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] p-6 sm:p-8 max-w-2xl w-full">
//                 <div className="text-center mb-6">
//                   <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
//                     Live Trading Activity
//                   </h3>
//                   <p className="text-gray-400 text-sm">Real-time system monitoring</p>
//                 </div>
                
//                 <div className="space-y-4 mb-8">
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
//                       <span className="text-gray-300 font-medium text-sm sm:text-base">Signal Processing</span>
//                     </div>
//                     <span className="text-emerald-300 font-semibold text-sm sm:text-base">Active</span>
//                   </div>
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                       <span className="text-gray-300 font-medium text-sm sm:text-base">Market Analysis</span>
//                     </div>
//                     <span className="text-blue-300 font-semibold text-sm sm:text-base">Running</span>
//                   </div>
//                   <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 rounded-2xl border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                       <span className="text-gray-300 font-medium text-sm sm:text-base">Trade Execution</span>
//                     </div>
//                     <span className="text-indigo-300 font-semibold text-sm sm:text-base">Monitoring</span>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => setIsActivityOpen(false)}
//                   className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced modal */}
//       {modalContent && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
//           <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl p-8 w-96 text-gray-900 shadow-2xl border border-gray-200">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">{modalContent}</h2>
//             <div className="text-gray-600 mb-6">{getContent()}</div>
//             <button 
//               onClick={closeModal} 
//               className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Enhanced footer */}
//       <footer className="relative z-10 mt-auto py-8 text-center">
//         <div className="container mx-auto px-4">
//           <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
//             <p className="text-gray-400 mb-4">© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
//             <div className="flex justify-center space-x-6">
//              <button onClick={() => setModalContent('Terms')} className="hover:text-cyan-300 transition-colors">terms</button>
//             <button onClick={() => setModalContent('Privacy')} className="hover:text-cyan-300 transition-colors">Privacy</button>
//             <button onClick={() => setModalContent('Security')} className="hover:text-cyan-300 transition-colors">Security</button>
//             <button onClick={() => setModalContent('Contact')} className="hover:text-cyan-300 transition-colors">Contact</button>
//           </div>
//         </div>
//         </div>
//       </footer>
//     </div> 
//   );
// };

// export default GimaConnectionApp;

// const GimaConnectionApp = ({ theme = 'dark' }) => {







// import React, { useState, useEffect, memo  } from 'react';
// import { Shield, CheckCircle, Radio, Circle, Lock, Zap, TrendingUp, Activity, BarChart3, Target } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

//   const MarketData = memo(({ theme = 'dark' }) => {
//   const isDarkMode = theme === 'dark';
//   const [isLoading, setIsLoading] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isActivityOpen, setIsActivityOpen] = useState(false);
//   const [isViewActivityLoading, setIsViewActivityLoading] = useState(false);
//   const [isTradePanelLoading, setIsTradePanelLoading] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const navigate = useNavigate();

//   const closeModal = () => setModalContent(null);
  

//   useEffect(() => {
//     console.log("Current theme:", theme);
//   }, [theme]);



//   // Theme styles configuration
//   const themeStyles = {
//     dark: {
//       background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
//       textPrimary: 'text-gray-300',
//       textSecondary: 'text-gray-400',
//       textTertiary: 'text-gray-500',
//       textAccent: 'text-cyan-300',
//       cardBg: 'bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05]',
//       cardBorder: 'border-white/20',
//       accentText: 'bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300',
//       buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600',
//       buttonSecondary: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10',
//       successBg: 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-cyan-500/10',
//       successBorder: 'border-emerald-400/30',
//       successText: 'text-emerald-300',
//       iconPrimary: 'text-cyan-400',
//       iconSecondary: 'text-blue-400',
//       iconTertiary: 'text-indigo-400',
//       shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]',
//       modalBg: 'bg-gradient-to-br from-slate-800 to-slate-900',
//       modalBorder: 'border-white/20',
//     },
//     light: {
//       background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
//       textPrimary: 'text-gray-800',
//       textSecondary: 'text-gray-600',
//       textTertiary: 'text-gray-500',
//       textAccent: 'text-cyan-600',
//       cardBg: 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
//       cardBorder: 'border-gray-200',
//       accentText: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600',
//       buttonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500',
//       buttonSecondary: 'bg-gradient-to-r from-cyan-100 to-blue-100',
//       successBg: 'bg-gradient-to-br from-emerald-100 via-green-50 to-cyan-100',
//       successBorder: 'border-emerald-300',
//       successText: 'text-emerald-600',
//       iconPrimary: 'text-cyan-500',
//       iconSecondary: 'text-blue-500',
//       iconTertiary: 'text-indigo-500',
//       shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]',
//       modalBg: 'bg-gradient-to-br from-white via-gray-50 to-white',
//       modalBorder: 'border-gray-200',
//     }
//   };

//   // const currentTheme = themeStyles[theme];
//     // Apply theme classes with transitions
//     const currentTheme = themeStyles[theme];
//     // const rootClasses = `min-h-screen transition-colors duration-300 ${currentTheme.background}`;
//     // const cardClasses = `transition-colors duration-300 ${currentTheme.cardBg} ${currentTheme.cardBorder}`;

//   // Check for existing connection on component mount
//   useEffect(() => {
//     const connectionStatus = localStorage?.getItem?.('gimaConnected');
    
//     if (connectionStatus === 'true') {
//       const initTimer = setTimeout(() => {
//         setIsLoading(false);
//         setIsConnected(true);
//       }, 2000);
      
//       return () => clearTimeout(initTimer);
//     } else {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleConnect = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsViewActivityLoading(false);
//       if (typeof Storage !== "undefined") {
//         localStorage.setItem('gimaConnected', 'true');
//       }
//     }, 3000);
//   };

//   const handleViewActivity = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsActivityOpen(true);
//       setIsViewActivityLoading(false);
//     }, 3000);
//   };

//   const handleNavigateToTradePanel = () => {
//     setIsTradePanelLoading(true);
//     setTimeout(() => {
//       navigate('/dashboard/trade/panel');
//       setIsTradePanelLoading(false);
//     }, 3000);
//   };

//   const getContent = () => {
//     switch (modalContent) {
//       case 'Terms':
//         return <p>These are the terms of use...</p>;
//       case 'Privacy':
//         return <p>This is our privacy policy...</p>;
//       case 'Security':
//         return <p>Security practices are outlined here...</p>;
//       case 'Contact':
//         return <p>Contact us at: support@gimablockchain.com</p>;
//       default:
//         return null;
//     }
//   };

//   const BackgroundElements = () => (
//     <>
//       {isDarkMode ? (
//         <>
//           <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/25 via-cyan-400/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
//           <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-indigo-600/20 via-blue-500/10 to-transparent rounded-full blur-[120px]" style={{ animationDelay: '1s' }}></div>
//         </>
//       ) : (
//         <>
//           <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-cyan-200/25 via-cyan-100/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>
//           <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-indigo-200/20 via-blue-200/10 to-transparent rounded-full blur-[120px]" style={{ animationDelay: '1s' }}></div>
//         </>
//       )}
      
//       <div className={`absolute inset-0 opacity-[0.02] ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{
//         backgroundImage: `
//           linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
//           linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
//         `,
//         backgroundSize: '50px 50px',
//       }}></div>
//     </>
//   );

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
//         <BackgroundElements />
        
//         <div className="relative z-10">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-10 flex flex-col items-center space-y-8`}>
//             <div className="relative">
//               <div className={`w-20 h-20 border-[3px] ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-full`}></div>
//               <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20"></div>
//               <div className="absolute top-1 left-1 w-[72px] h-[72px] border-[2px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin shadow-md shadow-blue-500/20" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
//               <div className="absolute top-3 left-3 w-14 h-14 border border-transparent border-t-indigo-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
//             </div>
            
//             <div className="text-center space-y-4">
//               <h3 className={`text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent tracking-tight`}>
//                 Initializing GIMA Trading Algorithm
//               </h3>
//               <p className={`${currentTheme.textSecondary} text-sm max-w-xs leading-relaxed`}>
//                 Establishing secure connection to institutional trading infrastructure
//               </p>
//               <div className="flex items-center justify-center space-x-2">
//                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
//                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
//               </div>
//             </div>
            
//             <div className="flex space-x-6 text-xs">
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/30' : 'bg-cyan-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-cyan-400/20' : 'border border-cyan-200'}`}>
//                   <Shield className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Secure</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'}`}>
//                   <Zap className={`w-4 h-4 ${currentTheme.iconSecondary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Processing</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/30' : 'bg-indigo-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-indigo-400/20' : 'border border-indigo-200'}`}>
//                   <TrendingUp className={`w-4 h-4 ${currentTheme.iconTertiary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Analyzing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isConnected) {
//     return (
//       <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
//         <BackgroundElements />
  
//         <div className="relative z-10 max-w-md w-full">
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} ${isDarkMode ? 'border border-cyan-400/30' : 'border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
//                 <Lock className={`w-6 h-6 ${currentTheme.textAccent}`} />
//               </div>
//               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30"></div>
//             </div>
//             <div className="ml-4">
//               <h2 className={`text-3xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent`}>
//                 GIMA
//               </h2>
//               <p className={`${currentTheme.textSecondary} text-sm font-medium`}>Trading Algorithm</p>
//             </div>
//           </div>

//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-8 flex flex-col items-center space-y-8`}>
//             <div className="relative">
//               <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} ${isDarkMode ? 'border border-cyan-400/30' : 'border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
//                 <Shield className={`w-6 h-6 ${currentTheme.textAccent}`} />
//               </div>
//               <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40"></div>
//             </div>

//             <div className="text-center space-y-4">
//               <p className={`${currentTheme.textPrimary} leading-relaxed max-w-sm text-sm`}>
//                 Activate your smart account to deploy{' '}
//                 <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
//                   GimaBlockchain's proprietary GIMA Trading Algorithm
//                 </span>{' '}
//                 — an advanced algorithmic trading system that autonomously analyzes market conditions and executes high-precision trades in real time.
//               </p>

//               <p className={`${currentTheme.textTertiary} text-sm italic max-w-sm mx-auto`}>
//                 Past performance is not indicative of future results. Trading involves risk, and returns are not 100% guaranteed.
//               </p>

//               <div className="grid grid-cols-3 gap-3 pt-4">
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100'} rounded-lg flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'border border-cyan-400/20' : 'border border-cyan-200'}`}>
//                     <Activity className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Real-time</span>
//                 </div>
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'} rounded-lg flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'}`}>
//                     <BarChart3 className={`w-4 h-4 ${currentTheme.iconSecondary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Analytics</span>
//                 </div>
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-100'} rounded-lg flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'border border-indigo-400/20' : 'border border-indigo-200'}`}>
//                     <Target className={`w-4 h-4 ${currentTheme.iconTertiary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Precision</span>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleConnect}
//               disabled={isViewActivityLoading || isTradePanelLoading}
//               className={`group relative inline-flex items-center px-8 py-4 text-base font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-100'} ${isDarkMode ? 'border border-cyan-400/30' : 'border border-cyan-300'} rounded-2xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//             >
//               {isViewActivityLoading ? (
//                 <>
//                   <span className="relative">Connecting</span>
//                   <div className={`relative w-5 h-5 ml-3 border-2 ${isDarkMode ? 'border-cyan-300' : 'border-cyan-500'} border-t-transparent rounded-full animate-spin`} />
//                 </>
//               ) : (
//                 <>
//                   <span className="relative">Activate & Connect</span>
//                   <Radio className="relative w-5 h-5 ml-3 animate-pulse" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${currentTheme.background} p-4 sm:p-6 relative overflow-hidden flex flex-col transition-colors duration-300`}>
//       <BackgroundElements />
      
//       <div className="max-w-5xl mx-auto relative z-10 flex-grow w-full">
//         <div className="w-full mb-6 sm:mb-8">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.successBg} border ${currentTheme.successBorder} rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] p-4 sm:p-6`}>
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//               </div>
//               <div className="flex-grow min-w-0">
//                 <p className={`text-sm font-bold ${currentTheme.successText} mb-1`}>
//                   Smart Account Connected
//                 </p>
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>
//                   Institutional-grade access active
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className={`text-2xl sm:text-4xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
//             GIMA Trading Algorithm
//           </h1>
//           <p className={`${currentTheme.textSecondary} text-sm sm:text-lg px-4`}>Institutional-Grade Quantitative Trading System</p>
//         </div>

//         <div className="space-y-6 sm:space-y-8">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-4 sm:p-8`}>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20' : 'bg-emerald-100'} ${currentTheme.successText} ${isDarkMode ? 'border border-emerald-400/30' : 'border border-emerald-300'} shadow-lg shadow-emerald-500/10`}>
//                 <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Connected
//               </div>
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} ${isDarkMode ? 'text-green-300' : 'text-green-600'} ${isDarkMode ? 'border border-green-400/30' : 'border border-green-300'} animate-pulse shadow-lg shadow-green-500/10`}>
//                 <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-ping" />
//                 LIVE
//               </div>
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : 'bg-blue-100'} ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} ${isDarkMode ? 'border border-blue-400/30' : 'border border-blue-300'} shadow-lg shadow-blue-500/10`}>
//                 <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Processing
//               </div>
//             </div>

//             <div className="mb-6 sm:mb-8">
//               <p className={`${currentTheme.textPrimary} leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6`}>
//                 Your smart account is now actively synchronized with GimaBlockchain's proprietary{' '}
//                 <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
//                   GIMA Trading Algorithm
//                 </span>
//                 , receiving real-time institutional trading signals.
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5' : 'bg-cyan-50'} ${isDarkMode ? 'border border-cyan-400/20' : 'border border-cyan-200'} hover:border-cyan-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-cyan-500 transition-colors`}>Live Signal Processing</span>
//                   </div>
//                 </div>
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5' : 'bg-blue-50'} ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'} hover:border-blue-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-blue-500 transition-colors`}>Real-time Risk Assessment</span>
//                   </div>
//                 </div>
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5' : 'bg-indigo-50'} ${isDarkMode ? 'border border-indigo-400/20' : 'border border-indigo-200'} hover:border-indigo-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-indigo-500 transition-colors`}>Active Trade Optimization</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 space-y-4 sm:space-y-0">
//               <div className="text-center sm:text-left">
//                 <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}>
//                   Powered by GimaBlockchain Technology
//                 </p>
//                 <p className={`text-xs ${currentTheme.textTertiary}`}>
//                   Enterprise-grade infrastructure • 99.9% uptime
//                 </p>
//               </div>
              
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 <button 
//                   onClick={handleViewActivity}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10' : 'bg-cyan-50'} ${isDarkMode ? 'border border-cyan-400/30' : 'border border-cyan-300'} shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//                 >
//                   <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-cyan-400/10 to-blue-500/10' : 'bg-cyan-100'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
//                   {isViewActivityLoading ? (
//                     <>
//                       <span className="relative">Loading</span>
//                       <div className={`relative w-4 h-4 ml-2 border-2 ${isDarkMode ? 'border-cyan-300/70' : 'border-cyan-500/70'} border-t-cyan-300 rounded-full animate-spin`} />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">View Live Activity</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleNavigateToTradePanel}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white ${currentTheme.buttonPrimary} rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
//                   {isTradePanelLoading ? (
//                     <>
//                       <span className="relative">Navigating</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-white/70 border-t-white rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">Go to Trade Panel</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {isActivityOpen && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
//               <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-6 sm:p-8 max-w-2xl w-full`}>
//                 <div className="text-center mb-6">
//                   <h3 className={`text-xl sm:text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
//                     Live Trading Activity
//                   </h3>
//                   <p className={`${currentTheme.textSecondary} text-sm`}>Real-time system monitoring</p>
//                 </div>
                
//                 <div className="space-y-4 mb-8">
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5' : 'bg-cyan-50'} rounded-2xl ${isDarkMode ? 'border border-cyan-400/20' : 'border border-cyan-200'} hover:border-cyan-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
//                       <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Signal Processing</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} font-semibold text-sm sm:text-base`}>Active</span>
//                   </div>
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/5' : 'bg-blue-50'} rounded-2xl ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'} hover:border-blue-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                       <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Market Analysis</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold text-sm sm:text-base`}>Running</span>
//                   </div>
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5' : 'bg-indigo-50'} rounded-2xl ${isDarkMode ? 'border border-indigo-400/20' : 'border border-indigo-200'} hover:border-indigo-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                       <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Trade Execution</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-semibold text-sm sm:text-base`}>Monitoring</span>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => setIsActivityOpen(false)}
//                   className={`w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10' : 'bg-cyan-50'} ${isDarkMode ? 'border border-cyan-400/30' : 'border border-cyan-300'} rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300`}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {modalContent && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
//           <div className={`${currentTheme.modalBg} rounded-2xl p-8 w-96 ${currentTheme.textPrimary} shadow-2xl border ${currentTheme.modalBorder}`}>
//             <h2 className="text-2xl font-bold mb-4">{modalContent}</h2>
//             <div className={`${currentTheme.textSecondary} mb-6`}>{getContent()}</div>
//             <button 
//               onClick={closeModal} 
//               className={`w-full px-6 py-3 ${currentTheme.buttonPrimary} text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <footer className="relative z-10 mt-auto py-8 text-center">
//         <div className="container mx-auto px-4">
//           <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} ${isDarkMode ? 'border-white/10' : 'border-gray-200'} border rounded-2xl p-6`}>
//             <p className={`${currentTheme.textSecondary} mb-4`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
//             <div className="flex justify-center space-x-6">
//               <button onClick={() => setModalContent('Terms')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Terms</button>
//               <button onClick={() => setModalContent('Privacy')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Privacy</button>
//               <button onClick={() => setModalContent('Security')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Security</button>
//               <button onClick={() => setModalContent('Contact')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Contact</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div> 
//   );
// });

// export default MarketData;




// import React, { useState, useEffect, memo } from 'react';
// import { Shield, CheckCircle, Radio, Circle, Lock, Zap, TrendingUp, Activity, BarChart3, Target } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const MarketData = memo(({ isDarkMode = true }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isActivityOpen, setIsActivityOpen] = useState(false);
//   const [isViewActivityLoading, setIsViewActivityLoading] = useState(false);
//   const [isTradePanelLoading, setIsTradePanelLoading] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const navigate = useNavigate();

//   const closeModal = () => setModalContent(null);

//   // Theme styles configuration
//   const themeStyles = {
//     dark: {
//       background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
//       textPrimary: 'text-gray-300',
//       textSecondary: 'text-gray-400',
//       textTertiary: 'text-gray-500',
//       textAccent: 'text-cyan-300',
//       cardBg: 'bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05]',
//       cardBorder: 'border-white/20',
//       accentText: 'bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300',
//       buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600',
//       buttonSecondary: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10',
//       successBg: 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-cyan-500/10',
//       successBorder: 'border-emerald-400/30',
//       successText: 'text-emerald-300',
//       iconPrimary: 'text-cyan-400',
//       iconSecondary: 'text-blue-400',
//       iconTertiary: 'text-indigo-400',
//       shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]',
//       modalBg: 'bg-gradient-to-br from-slate-800 to-slate-900',
//       modalBorder: 'border-white/20',
//     },
//     light: {
//       background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
//       textPrimary: 'text-gray-800',
//       textSecondary: 'text-gray-600',
//       textTertiary: 'text-gray-500',
//       textAccent: 'text-cyan-600',
//       cardBg: 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
//       cardBorder: 'border-gray-200',
//       accentText: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600',
//       buttonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500',
//       buttonSecondary: 'bg-gradient-to-r from-cyan-100 to-blue-100',
//       successBg: 'bg-gradient-to-br from-emerald-100 via-green-50 to-cyan-100',
//       successBorder: 'border-emerald-300',
//       successText: 'text-emerald-600',
//       iconPrimary: 'text-cyan-500',
//       iconSecondary: 'text-blue-500',
//       iconTertiary: 'text-indigo-500',
//       shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]',
//       modalBg: 'bg-gradient-to-br from-white via-gray-50 to-white',
//       modalBorder: 'border-gray-200',
//     }
//   };

//   // Map isDarkMode to theme key
//   const themeKey = isDarkMode ? 'dark' : 'light';
//   const currentTheme = themeStyles[themeKey] || themeStyles.dark; // Fallback to dark if undefined

//   // Debug theme prop
//   useEffect(() => {
//     console.log("Current isDarkMode:", isDarkMode);
//   }, [isDarkMode]);

//   // Check for existing connection on component mount
//   useEffect(() => {
//     const connectionStatus = localStorage?.getItem?.('gimaConnected');
    
//     if (connectionStatus === 'true') {
//       const initTimer = setTimeout(() => {
//         setIsLoading(false);
//         setIsConnected(true);
//       }, 2000);
//       return () => clearTimeout(initTimer);
//     } else {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const handleConnect = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsConnected(true);
//       setIsViewActivityLoading(false);
//       if (typeof Storage !== "undefined") {
//         localStorage.setItem('gimaConnected', 'true');
//       }
//     }, 3000);
//   };

//   const handleViewActivity = () => {
//     setIsViewActivityLoading(true);
//     setTimeout(() => {
//       setIsActivityOpen(true);
//       setIsViewActivityLoading(false);
//     }, 3000);
//   };

//   const handleNavigateToTradePanel = () => {
//     setIsTradePanelLoading(true);
//     setTimeout(() => {
//       navigate('/dashboard/trade/panel');
//       setIsTradePanelLoading(false);
//     }, 3000);
//   };

//   const getContent = () => {
//     switch (modalContent) {
//       case 'Terms':
//         return <p>These are the terms of use...</p>;
//       case 'Privacy':
//         return <p>This is our privacy policy...</p>;
//       case 'Security':
//         return <p>Security practices are outlined here...</p>;
//       case 'Contact':
//         return <p>Contact us at: support@gimablockchain.com</p>;
//       default:
//         return null;
//     }
//   };

//   const BackgroundElements = () => (
//     <>
//       <div className={`absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial ${isDarkMode ? 'from-cyan-500/25 via-cyan-400/10 to-transparent' : 'from-cyan-200/25 via-cyan-100/10 to-transparent'} rounded-full blur-[100px] animate-pulse`}></div>
//       <div className={`absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial ${isDarkMode ? 'from-indigo-600/20 via-blue-500/10 to-transparent' : 'from-indigo-200/20 via-blue-200/10 to-transparent'} rounded-full blur-[120px]`} style={{ animationDelay: '1s' }}></div>
//       <div className={`absolute inset-0 opacity-[0.02] ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{
//         backgroundImage: `
//           linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
//           linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
//         `,
//         backgroundSize: '50px 50px',
//       }}></div>
//     </>
//   );

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
//         <BackgroundElements />
//         <div className="relative z-10">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-10 flex flex-col items-center space-y-8`}>
//             <div className="relative">
//               <div className={`w-20 h-20 border-[3px] ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-full`}></div>
//               <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20"></div>
//               <div className="absolute top-1 left-1 w-[72px] h-[72px] border-[2px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin shadow-md shadow-blue-500/20" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
//               <div className="absolute top-3 left-3 w-14 h-14 border border-transparent border-t-indigo-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
//             </div>
//             <div className="text-center space-y-4">
//               <h3 className={`text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent tracking-tight`}>
//                 Initializing GIMA Trading Algorithm
//               </h3>
//               <p className={`${currentTheme.textSecondary} text-sm max-w-xs leading-relaxed`}>
//                 Establishing secure connection to institutional trading infrastructure
//               </p>
//               <div className="flex items-center justify-center space-x-2">
//                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
//                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
//                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
//               </div>
//             </div>
//             <div className="flex space-x-6 text-xs">
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/30' : 'bg-cyan-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-cyan-400/20' : 'border border-cyan-200'}`}>
//                   <Shield className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Secure</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'}`}>
//                   <Zap className={`w-4 h-4 ${currentTheme.iconSecondary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Processing</span>
//               </div>
//               <div className="flex flex-col items-center space-y-2">
//                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 border border-indigo-400/20' : 'bg-indigo-100 border border-indigo-200'}`}>
//                   <TrendingUp className={`w-4 h-4 ${currentTheme.iconTertiary}`} />
//                 </div>
//                 <span className={currentTheme.textSecondary}>Analyzing</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isConnected) {
//     return (
//       <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
//         <BackgroundElements />
//         <div className="relative z-10 max-w-md w-full">
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50 border border-cyan-400/30' : 'bg-white border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
//                 <Lock className={`w-6 h-6 ${currentTheme.textAccent}`} />
//               </div>
//               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30"></div>
//             </div>
//             <div className="ml-4">
//               <h2 className={`text-3xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent`}>
//                 GIMA
//               </h2>
//               <p className={`${currentTheme.textSecondary} text-sm font-medium`}>Trading Algorithm</p>
//             </div>
//           </div>
//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-8 flex flex-col items-center space-y-8`}>
//             <div className="relative">
//               <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50 border border-cyan-400/30' : 'bg-white border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
//                 <Shield className={`w-6 h-6 ${currentTheme.textAccent}`} />
//               </div>
//               <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40"></div>
//             </div>
//             <div className="text-center space-y-4">
//               <p className={`${currentTheme.textPrimary} leading-relaxed max-w-sm text-sm`}>
//                 Activate your smart account to deploy{' '}
//                 <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
//                   GimaBlockchain's proprietary GIMA Trading Algorithm
//                 </span>{' '}
//                 — an advanced algorithmic trading system that autonomously analyzes market conditions and executes high-precision trades in real time.
//               </p>
//               <p className={`${currentTheme.textTertiary} text-sm italic max-w-sm mx-auto`}>
//                 Past performance is not indicative of future results. Trading involves risk, and returns are not 100% guaranteed.
//               </p>
//               <div className="grid grid-cols-3 gap-3 pt-4">
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/20' : 'bg-cyan-100 border border-cyan-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
//                     <Activity className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Real-time</span>
//                 </div>
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-100 border border-blue-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
//                     <BarChart3 className={`w-4 h-4 ${currentTheme.iconSecondary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Analytics</span>
//                 </div>
//                 <div className="text-center">
//                   <div className={`w-8 h-8 ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-400/20' : 'bg-indigo-100 border border-indigo-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
//                     <Target className={`w-4 h-4 ${currentTheme.iconTertiary}`} />
//                   </div>
//                   <span className={`text-xs ${currentTheme.textSecondary}`}>Precision</span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleConnect}
//               disabled={isViewActivityLoading || isTradePanelLoading}
//               className={`group relative inline-flex items-center px-8 py-4 text-base font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/30' : 'bg-cyan-100 border border-cyan-300'} rounded-2xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//             >
//               {isViewActivityLoading ? (
//                 <>
//                   <span className="relative">Connecting</span>
//                   <div className={`relative w-5 h-5 ml-3 border-2 ${isDarkMode ? 'border-cyan-300' : 'border-cyan-500'} border-t-transparent rounded-full animate-spin`} />
//                 </>
//               ) : (
//                 <>
//                   <span className="relative">Activate & Connect</span>
//                   <Radio className="relative w-5 h-5 ml-3 animate-pulse" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className={`min-h-screen ${currentTheme.background} p-4 sm:p-6 relative overflow-hidden flex flex-col transition-colors duration-300`}>
//       <BackgroundElements />
//       <div className="max-w-5xl mx-auto relative z-10 flex-grow w-full">
//         <div className="w-full mb-6 sm:mb-8">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.successBg} border ${currentTheme.successBorder} rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] p-4 sm:p-6`}>
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//               </div>
//               <div className="flex-grow min-w-0">
//                 <p className={`text-sm font-bold ${currentTheme.successText} mb-1`}>
//                   Smart Account Connected
//                 </p>
//                 <p className={`text-xs ${currentTheme.textSecondary}`}>
//                   Institutional-grade access active
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className={`text-2xl sm:text-4xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
//             GIMA Trading Algorithm
//           </h1>
//           <p className={`${currentTheme.textSecondary} text-sm sm:text-lg px-4`}>Institutional-Grade Quantitative Trading System</p>
//         </div>
//         <div className="space-y-6 sm:space-y-8">
//           <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-4 sm:p-8`}>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30' : 'bg-emerald-100 border border-emerald-300'} ${currentTheme.successText} shadow-lg shadow-emerald-500/10`}>
//                 <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Connected
//               </div>
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-green-500/20 border border-green-400/30 text-green-300' : 'bg-green-100 border border-green-300 text-green-600'} animate-pulse shadow-lg shadow-green-500/10`}>
//                 <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-ping" />
//                 LIVE
//               </div>
//               <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300' : 'bg-blue-100 border border-blue-300 text-blue-600'} shadow-lg shadow-blue-500/10`}>
//                 <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//                 Processing
//               </div>
//             </div>
//             <div className="mb-6 sm:mb-8">
//               <p className={`${currentTheme.textPrimary} leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6`}>
//                 Your smart account is now actively synchronized with GimaBlockchain's proprietary{' '}
//                 <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
//                   GIMA Trading Algorithm
//                 </span>
//                 , receiving real-time institutional trading signals.
//               </p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-400/20' : 'bg-cyan-50 border border-cyan-200'} hover:border-cyan-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-cyan-500 transition-colors`}>Live Signal Processing</span>
//                   </div>
//                 </div>
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'} hover:border-blue-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-blue-500 transition-colors`}>Real-time Risk Assessment</span>
//                   </div>
//                 </div>
//                 <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-400/20' : 'bg-indigo-50 border border-indigo-200'} hover:border-indigo-400/40 transition-all duration-300 hover:scale-105`}>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                     <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-indigo-500 transition-colors`}>Active Trade Optimization</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 space-y-4 sm:space-y-0">
//               <div className="text-center sm:text-left">
//                 <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}>
//                   Powered by GimaBlockchain Technology
//                 </p>
//                 <p className={`text-xs ${currentTheme.textTertiary}`}>
//                   Enterprise-grade infrastructure • 99.9% uptime
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 <button 
//                   onClick={handleViewActivity}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300'} shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//                 >
//                   <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-cyan-400/10 to-blue-500/10' : 'bg-cyan-100'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
//                   {isViewActivityLoading ? (
//                     <>
//                       <span className="relative">Loading</span>
//                       <div className={`relative w-4 h-4 ml-2 border-2 ${isDarkMode ? 'border-cyan-300/70' : 'border-cyan-500/70'} border-t-cyan-300 rounded-full animate-spin`} />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">View Live Activity</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={handleNavigateToTradePanel}
//                   disabled={isViewActivityLoading || isTradePanelLoading}
//                   className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white ${currentTheme.buttonPrimary} rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
//                   {isTradePanelLoading ? (
//                     <>
//                       <span className="relative">Navigating</span>
//                       <div className="relative w-4 h-4 ml-2 border-2 border-white/70 border-t-white rounded-full animate-spin" />
//                     </>
//                   ) : (
//                     <>
//                       <span className="relative">Go to Trade Panel</span>
//                       <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//           {isActivityOpen && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
//               <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-6 sm:p-8 max-w-2xl w-full`}>
//                 <button
//                   onClick={() => setIsActivityOpen(false)}
//                   className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300'} rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300`}
//                 >
//                   Close
//                 </button>
//                 <div className="text-center mb-6">
//                   <h3 className={`text-xl sm:text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
//                     Live Trading Activity
//                   </h3>
//                   <p className={`${currentTheme.textSecondary} text-sm`}>Real-time system monitoring</p>
//                 </div>
//                 <div className="space-y-4 mb-8">
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-400/20' : 'bg-cyan-50 border border-cyan-200'} rounded-2xl hover:border-cyan-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
//                       <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Signal Processing</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} font-semibold text-sm sm:text-base`}>Active</span>
//                   </div>
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'} rounded-2xl hover:border-blue-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
//                       <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Market Analysis</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold text-sm sm:text-base`}>Running</span>
//                   </div>
//                   <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-400/20' : 'bg-indigo-50 border border-indigo-200'} rounded-2xl hover:border-indigo-400/40 transition-all duration-300`}>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
//                     <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Trade Execution</span>
//                     </div>
//                     <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-semibold text-sm sm:text-base`}>Monitoring</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         {modalContent && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
//             <div className={`${currentTheme.modalBg} rounded-2xl p-8 w-96 ${currentTheme.textPrimary} shadow-2xl border ${currentTheme.modalBorder}`}>
//               <h2 className="text-2xl font-bold mb-4">{modalContent}</h2>
//               <div className={`${currentTheme.textSecondary} mb-6`}>{getContent()}</div>
//               <button 
//                 onClick={closeModal} 
//                 className={`w-full px-6 py-3 ${currentTheme.buttonPrimary} text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//         <footer className="relative z-10 mt-auto py-8 text-center">
//           <div className="container mx-auto px-4">
            // <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-gray-200'} border rounded-2xl p-6`}>
            //   <p className={`${currentTheme.textSecondary} mb-4`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
            //   <div className="flex justify-center space-x-6">
//                 <button onClick={() => setModalContent('Terms')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Terms</button>
//                 <button onClick={() => setModalContent('Privacy')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Privacy</button>
//                 <button onClick={() => setModalContent('Security')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Security</button>
//                 <button onClick={() => setModalContent('Contact')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary}`}>Contact</button>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// });

// export default MarketData;





import { useState, useEffect, memo } from 'react';
import { Shield, CheckCircle, Radio, Circle, Lock, Zap, TrendingUp, Activity, BarChart3, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketData = memo(({ isDarkMode = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isViewActivityLoading, setIsViewActivityLoading] = useState(false);
  const [isTradePanelLoading, setIsTradePanelLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  const closeModal = () => setModalContent(null);

  // Theme styles configuration
  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      textPrimary: 'text-gray-300',
      textSecondary: 'text-gray-400',
      textTertiary: 'text-gray-500',
      textAccent: 'text-cyan-300',
      cardBg: 'bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05]',
      cardBorder: 'border-white/20',
      accentText: 'bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300',
      buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      buttonSecondary: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10',
      successBg: 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-cyan-500/10',
      successBorder: 'border-emerald-400/30',
      successText: 'text-emerald-300',
      iconPrimary: 'text-cyan-400',
      iconSecondary: 'text-blue-400',
      iconTertiary: 'text-indigo-400',
      shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]',
      modalBg: 'bg-gradient-to-br from-slate-800 to-slate-900',
      modalBorder: 'border-white/20',
    },
    light: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textTertiary: 'text-gray-500',
      textAccent: 'text-cyan-600',
      cardBg: 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
      cardBorder: 'border-gray-200',
      accentText: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600',
      buttonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      buttonSecondary: 'bg-gradient-to-r from-cyan-100 to-blue-100',
      successBg: 'bg-gradient-to-br from-emerald-100 via-green-50 to-cyan-100',
      successBorder: 'border-emerald-300',
      successText: 'text-emerald-600',
      iconPrimary: 'text-cyan-500',
      iconSecondary: 'text-blue-500',
      iconTertiary: 'text-indigo-500',
      shadow: 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]',
      modalBg: 'bg-gradient-to-br from-white via-gray-50 to-white',
      modalBorder: 'border-gray-200',
    }
  };

  // Map isDarkMode to theme key
  const themeKey = isDarkMode ? 'dark' : 'light';
  const currentTheme = themeStyles[themeKey] || themeStyles.dark;

  // Debug theme prop
  useEffect(() => {
    console.log("Current isDarkMode:", isDarkMode);
  }, [isDarkMode]);

  // Check for existing connection on component mount
  useEffect(() => {
    const connectionStatus = localStorage?.getItem?.('gimaConnected');
    
    if (connectionStatus === 'true') {
      const initTimer = setTimeout(() => {
        setIsLoading(false);
        setIsConnected(true);
      }, 2000);
      return () => clearTimeout(initTimer);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConnect = () => {
    setIsViewActivityLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsViewActivityLoading(false);
      if (typeof Storage !== "undefined") {
        localStorage.setItem('gimaConnected', 'true');
      }
    }, 3000);
  };

  const handleViewActivity = () => {
    setIsViewActivityLoading(true);
    setTimeout(() => {
      setIsActivityOpen(true);
      setIsViewActivityLoading(false);
    }, 3000);
  };

  const handleNavigateToTradePanel = () => {
    setIsTradePanelLoading(true);
    setTimeout(() => {
      navigate('/dashboard/trade/panel');
      setIsTradePanelLoading(false);
    }, 3000);
  };

  const getContent = () => {
    switch (modalContent) {
      case 'Terms':
        return <p>These are the terms of use...</p>;
      case 'Privacy':
        return <p>This is our privacy policy...</p>;
      case 'Security':
        return <p>Security practices are outlined here...</p>;
      case 'Contact':
        return <p>Contact us at: support@gimablockchain.com</p>;
      default:
        return null;
    }
  };

  const BackgroundElements = () => (
    <>
      <div className={`absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial ${isDarkMode ? 'from-cyan-500/25 via-cyan-400/10 to-transparent' : 'from-cyan-200/25 via-cyan-100/10 to-transparent'} rounded-full blur-[100px] animate-pulse`}></div>
      <div className={`absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial ${isDarkMode ? 'from-indigo-600/20 via-blue-500/10 to-transparent' : 'from-indigo-200/20 via-blue-200/10 to-transparent'} rounded-full blur-[120px]`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute inset-0 opacity-[0.02] ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{
        backgroundImage: `
          linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}></div>
    </>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
        <BackgroundElements />
        <div className="flex-grow flex items-center justify-center">
          <div className="relative z-10">
            <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-10 flex flex-col items-center space-y-8`}>
              <div className="relative">
                <div className={`w-20 h-20 border-[3px] ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-full`}></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-[3px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/20"></div>
                <div className="absolute top-1 left-1 w-[72px] h-[72px] border-[2px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin shadow-md shadow-blue-500/20" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <div className="absolute top-3 left-3 w-14 h-14 border border-transparent border-t-indigo-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
              <div className="text-center space-y-4">
                <h3 className={`text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent tracking-tight`}>
                  Initializing GIMA Trading Algorithm
                </h3>
                <p className={`${currentTheme.textSecondary} text-sm max-w-xs leading-relaxed`}>
                  Establishing secure connection to institutional trading infrastructure
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
                </div>
              </div>
              <div className="flex space-x-6 text-xs">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/30' : 'bg-blue-full-height'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'}`}>
                    <Shield className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
                  </div>
                  <span className={currentTheme.textSecondary}>Secure</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center ${isDarkMode ? 'border border-blue-400/20' : 'border border-blue-200'}`}>
                    <Zap className={`w-4 h-4 ${currentTheme.blueSecondary}`} />
                  </div>
                  <span className={currentTheme.textSecondary}>Processing</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/20 to-blue-600/30 border border-blue-blue/400' : 'bg-blue-100 border border-blue-200'}`}>
                    <TrendingUp className={`w-4 h-4 ${currentTheme.blueTertiary}`} />
                  </div>
                  <span className={currentTheme.textSecondary}>Analyzing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-auto py-2 text-center flex-shrink-0">
          <div className="container mx-auto px-4">
            <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-gray-200'} border rounded-2xl p-2`}>
              <p className={`${currentTheme.textSecondary} mb-2 text-xs`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setModalContent('Terms')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Terms</button>
                <button onClick={() => setModalContent('Privacy')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Privacy</button>
                <button onClick={() => setModalContent('Security')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Security</button>
                <button onClick={() => setModalContent('Contact')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Contact</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={`min-h-screen flex flex-col ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
        <BackgroundElements />
        <div className="flex-grow flex items-center justify-center">
          <div className="relative z-10 max-w-md w-full">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50 border border-cyan-400/30' : 'bg-white border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
                  <Lock className={`w-6 h-6 ${currentTheme.textAccent}`} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-30"></div>
              </div>
              <div className="ml-4">
                <h2 className={`text-3xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent`}>
                  GIMA
                </h2>
                <p className={`${currentTheme.textSecondary} text-sm font-medium`}>Trading Algorithm</p>
              </div>
            </div>
            <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-8 flex flex-col items-center space-y-8`}>
              <div className="relative">
                <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-800/50 border border-cyan-400/30' : 'bg-white border border-cyan-300'} rounded-xl flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-colors duration-200`}>
                  <Shield className={`w-6 h-6 ${currentTheme.textAccent}`} />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40"></div>
              </div>
              <div className="text-center space-y-4">
                <p className={`${currentTheme.textPrimary} leading-relaxed max-w-sm text-sm`}>
                  Activate your smart account to deploy{' '}
                  <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
                    GimaBlockchain's proprietary GIMA Trading Algorithm
                  </span>{' '}
                  — an advanced algorithmic trading system that autonomously analyzes market conditions and executes high-precision trades in real time.
                </p>
                <p className={`${currentTheme.textTertiary} text-sm italic max-w-sm mx-auto`}>
                  Past performance is not indicative of future results. Trading involves risk, and returns are not 100% guaranteed.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="text-center">
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/20' : 'bg-cyan-100 border border-cyan-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Activity className={`w-4 h-4 ${currentTheme.iconPrimary}`} />
                    </div>
                    <span className={`text-xs ${currentTheme.textSecondary}`}>Real-time</span>
                  </div>
                  <div className="text-center">
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-100 border border-blue-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <BarChart3 className={`w-4 h-4 ${currentTheme.iconSecondary}`} />
                    </div>
                    <span className={`text-xs ${currentTheme.textSecondary}`}>Analytics</span>
                  </div>
                  <div className="text-center">
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-400/20' : 'bg-indigo-100 border border-indigo-200'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Target className={`w-4 h-4 ${currentTheme.iconTertiary}`} />
                    </div>
                    <span className={`text-xs ${currentTheme.textSecondary}`}>Precision</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleConnect}
                disabled={isViewActivityLoading || isTradePanelLoading}
                className={`group relative inline-flex items-center px-8 py-4 text-base font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/30' : 'bg-cyan-100 border border-cyan-300'} rounded-2xl hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
              >
                {isViewActivityLoading ? (
                  <>
                    <span className="relative">Connecting</span>
                    <div className={`relative w-5 h-5 ml-3 border-2 ${isDarkMode ? 'border-cyan-300' : 'border-cyan-500'} border-t-transparent rounded-full animate-spin`} />
                  </>
                ) : (
                  <>
                    <span className="relative">Activate & Connect</span>
                    <Radio className="relative w-5 h-5 ml-3 animate-pulse" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <footer className="mt-auto py-2 text-center flex-shrink-0">
          <div className="container mx-auto px-4">
            <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-gray-200'} border rounded-2xl p-2`}>
              <p className={`${currentTheme.textSecondary} mb-2 text-xs`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setModalContent('Terms')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Terms</button>
                <button onClick={() => setModalContent('Privacy')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Privacy</button>
                <button onClick={() => setModalContent('Security')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Security</button>
                <button onClick={() => setModalContent('Contact')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Contact</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background} p-4 sm:p-6 relative overflow-hidden transition-colors duration-300`}>
      <BackgroundElements />
      <div className="flex-grow mb-10 max-w-5xl mx-auto relative z-10 w-full">
        <div className="w-full mb-6 sm:mb-8">
          <div className={`relative backdrop-blur-2xl ${currentTheme.successBg} border ${currentTheme.successBorder} rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)] p-4 sm:p-6`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <p className={`text-sm font-bold ${currentTheme.successText} mb-1`}>
                  Smart Account Connected
                </p>
                <p className={`text-xs ${currentTheme.textSecondary}`}>
                  Institutional-grade access active
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className={`text-2xl sm:text-4xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
            GIMA Trading Algorithm
          </h1>
          <p className={`${currentTheme.textSecondary} text-sm sm:text-lg px-4`}>Institutional-Grade Quantitative Trading System</p>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-4 sm:p-8`}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30' : 'bg-emerald-100 border border-emerald-300'} ${currentTheme.successText} shadow-lg shadow-emerald-500/10`}>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Connected
              </div>
              <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-green-500/20 border border-green-400/30 text-green-300' : 'bg-green-100 border border-green-300 text-green-600'} animate-pulse shadow-lg shadow-green-500/10`}>
                <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-ping" />
                LIVE
              </div>
              <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold ${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300' : 'bg-blue-100 border border-blue-300 text-blue-600'} shadow-lg shadow-blue-500/10`}>
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Processing
              </div>
            </div>
            <div className="mb-6 sm:mb-8">
              <p className={`${currentTheme.textPrimary} leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6`}>
                Your smart account is now actively synchronized with GimaBlockchain's proprietary{' '}
                <span className={`${currentTheme.accentText} bg-clip-text font-semibold`}>
                  GIMA Trading Algorithm
                </span>
                , receiving real-time institutional trading signals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-400/20' : 'bg-cyan-50 border border-cyan-200'} hover:border-cyan-400/40 transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
                    <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-cyan-500 transition-colors`}>Live Signal Processing</span>
                  </div>
                </div>
                <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'} hover:border-blue-400/40 transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
                    <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-blue-500 transition-colors`}>Real-time Risk Assessment</span>
                  </div>
                </div>
                <div className={`group p-3 sm:p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-400/20' : 'bg-indigo-50 border border-indigo-200'} hover:border-indigo-400/40 transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
                    <span className={`text-xs sm:text-sm font-medium ${currentTheme.textPrimary} group-hover:text-indigo-500 transition-colors`}>Active Trade Optimization</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-1`}>
                  Powered by GimaBlockchain Technology
                </p>
                <p className={`text-xs ${currentTheme.textTertiary}`}>
                  Enterprise-grade infrastructure • 99.9% uptime
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={handleViewActivity}
                  disabled={isViewActivityLoading || isTradePanelLoading}
                  className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300'} shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-cyan-400/10 to-blue-500/10' : 'bg-cyan-100'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  {isViewActivityLoading ? (
                    <>
                      <span className="relative">Loading</span>
                      <div className={`relative w-4 h-4 ml-2 border-2 ${isDarkMode ? 'border-cyan-300/70' : 'border-cyan-500/70'} border-t-cyan-300 rounded-full animate-spin`} />
                    </>
                  ) : (
                    <>
                      <span className="relative">View Live Activity</span>
                      <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
                    </>
                  )}
                </button>
                <button
                  onClick={handleNavigateToTradePanel}
                  disabled={isViewActivityLoading || isTradePanelLoading}
                  className={`group relative inline-flex items-center justify-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white ${currentTheme.buttonPrimary} rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  {isTradePanelLoading ? (
                    <>
                      <span className="relative">Navigating</span>
                      <div className="relative w-4 h-4 ml-2 border-2 border-white/70 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <span className="relative">Go to Trade Panel</span>
                      <Radio className="relative w-4 h-4 ml-2 animate-pulse" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {isActivityOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className={`relative backdrop-blur-2xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-3xl ${currentTheme.shadow} p-6 sm:p-8 max-w-2xl w-full`}>
                <button
                  onClick={() => setIsActivityOpen(false)}
                  className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold ${currentTheme.textAccent} ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300'} rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 transition-all duration-300`}
                >
                  Close
                </button>
                <div className="text-center mb-6">
                  <h3 className={`text-xl sm:text-2xl font-bold ${currentTheme.accentText} bg-clip-text text-transparent mb-2`}>
                    Live Trading Activity
                  </h3>
                  <p className={`${currentTheme.textSecondary} text-sm`}>Real-time system monitoring</p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-400/20' : 'bg-cyan-50 border border-cyan-200'} rounded-2xl hover:border-cyan-400/40 transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                      <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Signal Processing</span>
                    </div>
                    <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} font-semibold text-sm sm:text-base`}>Active</span>
                  </div>
                  <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'} rounded-2xl hover:border-blue-400/40 transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
                      <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Market Analysis</span>
                    </div>
                    <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} font-semibold text-sm sm:text-base`}>Running</span>
                  </div>
                  <div className={`group flex items-center justify-between p-4 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-400/20' : 'bg-indigo-50 border border-indigo-200'} rounded-2xl hover:border-indigo-400/40 transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0.6s' }}></div>
                      <span className={`${currentTheme.textPrimary} font-medium text-sm sm:text-base`}>Trade Execution</span>
                    </div>
                    <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-semibold text-sm sm:text-base`}>Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {modalContent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
            <div className={`${currentTheme.modalBg} rounded-2xl p-8 w-96 ${currentTheme.textPrimary} shadow-2xl border ${currentTheme.modalBorder}`}>
              <h2 className="text-2xl font-bold mb-4">{modalContent}</h2>
              <div className={`${currentTheme.textSecondary} mb-6`}>{getContent()}</div>
              <button 
                onClick={closeModal} 
                className={`w-full px-6 py-3 ${currentTheme.buttonPrimary} text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-auto py-2 text-center flex-shrink-0">
        <div className="container mx-auto px-4">
          {/* <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-gray-200'} border rounded-2xl p-2`}>
            <p className={`${currentTheme.textSecondary} mb-2 text-xs`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
            <div className="flex justify-center space-x-4"> */}

              <div className={`backdrop-blur-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-gray-200'} border  p-6`}>
              <p className={`${currentTheme.textSecondary} mb-4`}>© {new Date().getFullYear()} GimaBlockchain Technologies. All rights reserved.</p>
              <div className="flex justify-center space-x-6">
              <button onClick={() => setModalContent('Terms')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Terms</button>
              <button onClick={() => setModalContent('Privacy')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Privacy</button>
              <button onClick={() => setModalContent('Security')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Security</button>
              <button onClick={() => setModalContent('Contact')} className={`hover:${currentTheme.textAccent} transition-colors ${currentTheme.textSecondary} text-xs`}>Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default MarketData;