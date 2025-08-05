// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion } from 'framer-motion';
// import { TrendingUp, ChevronRight, Menu, X } from 'lucide-react';

// const Platform = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//       <Helmet>
//         <title>GimaCapital Platform - AI-Driven Trading</title>
//         <meta name="description" content="Explore GimaCapital's AI-driven trading platform, powered by GimaBlockchain, for institutional-grade performance." />
//         <meta name="keywords" content="GimaCapital, platform, AI trading, GimaBlockchain" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             "name": "GimaCapital Platform",
//             "description": "Discover the features of GimaCapital's AI-driven trading platform.",
//             "url": "https://www.gimacapital.com/platform"
//           })}
//         </script>
//       </Helmet>

//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
//               </div>
//               <div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">PRO</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                Home Page
//               </Link>
//               <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Pricing
//               </Link>
//               <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 About
//               </Link>
//               <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Contact
//               </Link>
//               <div className="flex items-center space-x-6">
//                 <Link
//                   to="/login"
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Sign In</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Get Started</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </Link>
//               </div>
//             </div>
//             <div className="md:hidden flex items-center">
//               <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none">
//                 {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//               </button>
//             </div>
//           </div>
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
//             transition={{ duration: 0.3, ease: 'easeInOut' }}
//             className="md:hidden overflow-hidden"
//           >
//             <div className="flex flex-col space-y-4 mt-4">
//               <Link
//                 to="/"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                Home Page
//               </Link>
//               <Link
//                 to="/pricing"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Pricing
//               </Link>
//               <Link
//                 to="/about"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 About
//               </Link>
//               <Link
//                 to="/contact"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Contact
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                 onClick={toggleMenu}
//               >
//                 Get Started
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </nav>

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
//         <section className="py-24 md:py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
//           <div className="container mx-auto px-6 relative z-10">
//             <div className="max-w-4xl mx-auto text-center">
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//                 Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Platform</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 Discover GimaCapital's AI-driven trading platform, powered by GimaBlockchain, delivering institutional-grade performance and security.
//               </p>
//               <Link
//                 to="/register"
//                 className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
//               >
//                 <span>Start Trading Now</span>
//                 <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
//                 Coming Soon
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 We're working on a detailed overview of our platform's features, including real-time analytics, proprietary AI algorithms, and blockchain security. Stay tuned for updates!
//               </p>
//             </div>
//           </div>
//         </section>

//         <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//           <div className="container mx-auto px-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//               <div className="col-span-2">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
//                     <TrendingUp className="w-8 h-8" />
//                   </div>
//                   <div>
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                     <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                   GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
//                 </p>
//                 <div className="flex space-x-4">
//                   <button onClick={() => console.log("Facebook")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                     <span className="font-bold">f</span>
//                   </button>
//                   <button onClick={() => console.log("Twitter")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                     <span className="font-bold">t</span>
//                   </button>
//                   <button onClick={() => console.log("LinkedIn")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                     <span className="font-bold">in</span>
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
//                 <ul className="space-y-3">
//                   <li><button onClick={() => console.log("Trading Tools")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Trading Tools</button></li>
//                   <li><button onClick={() => console.log("Mobile App")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Mobile App</button></li>
//                   <li><button onClick={() => console.log("API Access")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">API Access</button></li>
//                   <li><button onClick={() => console.log("Market Data")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Market Data</button></li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//                 <ul className="space-y-3">
//                   <li><button onClick={() => console.log("Help Center")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</button></li>
//                   <li><button onClick={() => console.log("Contact Us")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</button></li>
//                   <li><button onClick={() => console.log("Education")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Education</button></li>
//                   <li><button onClick={() => console.log("Community")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Community</button></li>
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                   © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Platform;






// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import { TrendingUp, ChevronRight, Menu, X, Clock, Bot, DollarSign } from 'lucide-react';

// const Platform = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//       <Helmet>
//         <title>GimaCapital Platform - AI-Driven Trading</title>
//         <meta name="description" content="GimaCapital's AI-driven trading platform is coming soon! Powered by GimaBlockchain, it delivers institutional-grade performance and security." />
//         <meta name="keywords" content="GimaCapital, platform, AI trading, GimaBlockchain, coming soon" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             "name": "GimaCapital Platform",
//             "description": "GimaCapital's AI-driven trading platform is coming soon, powered by GimaBlockchain.",
//             "url": "https://www.gimacapital.com/platform"
//           })}
//         </script>
//       </Helmet>

//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <motion.div
//                 className="relative"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <motion.div
//                   className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{ repeat: Infinity, duration: 2 }}
//                 ></motion.div>
//               </motion.div>
//               <div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">PRO</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Home Page
//               </Link>
//               <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Pricing
//               </Link>
//               <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 About
//               </Link>
//               <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Contact
//               </Link>
//               <div className="flex items-center space-x-6">
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/login"
//                     className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                   >
//                     <span className="relative z-10">Sign In</span>
//                     <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                     <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </Link>
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/register"
//                     className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                   >
//                     <span className="relative z-10">Get Started</span>
//                     <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                     <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </Link>
//                 </motion.div>
//               </div>
//             </div>
//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-gray-300 focus:outline-none"
//                 aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//               >
//                 {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//               </button>
//             </div>
//           </div>
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className="md:hidden overflow-hidden"
//               >
//                 <div className="flex flex-col space-y-4 mt-4">
//                   <Link
//                     to="/"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     Home Page
//                   </Link>
//                   <Link
//                     to="/pricing"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     Pricing
//                   </Link>
//                   <Link
//                     to="/about"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     About
//                   </Link>
//                   <Link
//                     to="/contact"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     Contact
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                     onClick={toggleMenu}
//                   >
//                     Get Started
//                   </Link>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </nav>

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
//         <section className="py-24 md:py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
//           <div className="container mx-auto px-6 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="max-w-4xl mx-auto text-center"
//             >
//               <motion.div
//                 whileHover={{ rotate: 360 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6"
//               >
//                 <Clock className="w-8 h-8 text-white" />
//               </motion.div>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//                 Platform <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Coming Soon</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
//                 GimaCapital's AI-driven trading platform, powered by GimaBlockchain, is in its final stages. Our infrastructure is live, and we're ready to launch user onboarding. Stay tuned for a revolutionary trading experience!
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/register"
//                     className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
//                   >
//                     <span>Join the Waitlist</span>
//                     <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/ValuationOverview"
//                     className="group inline-flex items-center bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
//                   >
//                     <span>Explore Investment Opportunity</span>
//                     <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="max-w-4xl mx-auto text-center"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
//                 Why GimaCapital?
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 Our platform is built on proven technology, ready to scale. With operational systems in place, we're poised to deliver institutional-grade AI-driven trading.
//               </p>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {[
//                   {
//                     icon: Bot,
//                     title: "Gima-Alpha AI",
//                     desc: "Proprietary AI engine executing 5,000+ daily micro-trades with real-time market analysis.",
//                     color: "emerald",
//                   },
//                   {
//                     icon: DollarSign,
//                     title: "PAMM Infrastructure",
//                     desc: "Scalable fund management system ready for user onboarding and performance fees.",
//                     color: "teal",
//                   },
//                   {
//                     icon: Clock,
//                     title: "Launch Ready",
//                     desc: "Fully operational infrastructure, awaiting user acquisition to unlock full potential.",
//                     color: "cyan",
//                   },
//                 ].map((feature, index) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
//                     className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300`}
//                   >
//                     <div className={`w-12 h-12 bg-${feature.color}-600 rounded-lg flex items-center justify-center mb-4 mx-auto`}>
//                       <feature.icon className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white">
//           <div className="container mx-auto px-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="max-w-3xl mx-auto text-center"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">Be the First to Experience GimaCapital</h2>
//               <p className="text-lg text-gray-200 mb-8 leading-relaxed">
//                 Sign up for updates to get notified when our platform launches. Join the waitlist to access exclusive beta features and early adopter benefits.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="px-4 py-3 rounded-lg bg-white/10 border border-gray-300/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   aria-label="Email for platform updates"
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="group bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
//                 >
//                   <span>Join Waitlist</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//           <div className="container mx-auto px-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="col-span-2"
//               >
//                 <div className="flex items-center space-x-3 mb-6">
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
//                   >
//                     <TrendingUp className="w-8 h-8" />
//                   </motion.div>
//                   <div>
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                     <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                   GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
//                 </p>
//                 <div className="flex space-x-4">
//                   {['Facebook', 'Twitter', 'LinkedIn'].map((platform, index) => (
//                     <motion.button
//                       key={index}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => console.log(platform)}
//                       className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
//                       aria-label={`Visit our ${platform} page`}
//                     >
//                       <span className="font-bold">{platform[0].toLowerCase()}</span>
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//               >
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
//                 <ul className="space-y-3">
//                   {['Trading Tools', 'Mobile App', 'API Access', 'Market Data'].map((item, index) => (
//                     <li key={index}>
//                       <motion.button
//                         whileHover={{ x: 5 }}
//                         onClick={() => console.log(item)}
//                         className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
//                       >
//                         {item}
//                       </motion.button>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//                 <ul className="space-y-3">
//                   {['Help Center', 'Contact Us', 'Education', 'Community'].map((item, index) => (
//                     <li key={index}>
//                       <motion.button
//                         whileHover={{ x: 5 }}
//                         onClick={() => console.log(item)}
//                         className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
//                       >
//                         {item}
//                       </motion.button>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="border-t border-gray-200 dark:border-gray-800 pt-8"
//             >
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                   © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Platform;













// import { useState } from 'react';
// import { Helmet } from 'react-helmet';
// import { TrendingUp, ChevronRight, Menu, X, PlayCircle, Bot, DollarSign, Shield, BarChart3, Users, Zap } from 'lucide-react';

// const Platform = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleNavClick = (section) => {
//     // Simulate navigation - in a real app, this would use React Router
//     if (section === 'register' || section === '/register') {
//       window.location.href = '/register';
//     } else if (section === 'login' || section === '/login') {
//       window.location.href = '/login';
//     } else if (section === 'Home') {
//       window.location.href = '/';
//     } else if (section === 'Pricing') {
//       window.location.href = '/pricing';
//     } else if (section === 'About') {
//       window.location.href = '/about';
//     } else if (section === 'Contact') {
//       window.location.href = '/contact';
//     } else if (section === 'performance') {
//       window.location.href = '/ValuationOverview';
//     } else {
//       console.log(`Navigate to ${section}`);
//     }
//   };

//   return (


//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//        <Helmet>
//         <title>GimaCapital Platform - AI-Driven Trading</title>
//         <meta name="description" content="GimaCapital's AI-driven trading platform is coming soon! Powered by GimaBlockchain, it delivers institutional-grade performance and security." />
//         <meta name="keywords" content="GimaCapital, platform, AI trading, GimaBlockchain, coming soon" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             "name": "GimaCapital Platform",
//             "description": "GimaCapital's AI-driven trading platform is coming soon, powered by GimaBlockchain.",
//             "url": "https://www.gimacapital.com/platform"
//           })}
//         </script>
//       </Helmet>

//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
//               </div>
//               <div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => handleNavClick(item)}
//                   className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
//                 >
//                   {item}
//                 </button>
//               ))}
//               <div className="flex items-center space-x-6">
//                 <button
//                   onClick={() => handleNavClick('login')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Sign In</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('register')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Start Trading</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//               </div>
//             </div>
//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-gray-300 focus:outline-none"
//                 aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//               >
//                 {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//               </button>
//             </div>
//           </div>
//           {isMenuOpen && (
//             <div className="md:hidden overflow-hidden transition-all duration-300">
//               <div className="flex flex-col space-y-4 mt-4">
//                 {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                   <button
//                     key={item}
//                     onClick={() => {
//                       handleNavClick(item);
//                       toggleMenu();
//                     }}
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-left"
//                   >
//                     {item}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => {
//                     handleNavClick('register');
//                     toggleMenu();
//                   }}
//                   className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                 >
//                   Start Trading
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
//         <section className="py-24 md:py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
//           <div className="container mx-auto px-6 relative z-10">
//             <div className="max-w-4xl mx-auto text-center">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-spin" style={{animationDuration: '2s'}}>
//                 <PlayCircle className="w-8 h-8 text-white" />
//               </div>
//               <div className="flex items-center justify-center gap-3 mb-4">
//                 <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   PLATFORM LIVE
//                 </div>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//                 Trade with <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Gima-Alpha AI</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
//                 GimaCapital's AI-driven trading platform is now fully operational! Experience institutional-grade performance with our proprietary Gima-Alpha AI executing 5,000+ daily micro-trades powered by GimaBlockchain technology.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('register')}
//                   className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>Start Trading Now</span>
//                   <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('performance')}
//                   className="group inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>View Live Performance</span>
//                   <BarChart3 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
              
//               {/* Live Stats */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
//                 {[
//                   { label: "Active Traders", value: "2,847", color: "emerald" },
//                   { label: "Daily Trades", value: "5,000+", color: "teal" },
//                   { label: "Success Rate", value: "94.2%", color: "cyan" }
//                 ].map((stat, index) => (
//                   <div
//                     key={index}
//                     className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className={`text-2xl font-bold ${index === 0 ? 'text-emerald-600 dark:text-emerald-400' : index === 1 ? 'text-teal-600 dark:text-teal-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
//                       {stat.value}
//                     </div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
//                 Platform Features Now Live
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 Experience the full power of GimaCapital's AI-driven trading platform with real-time execution, advanced analytics, and institutional-grade security.
//               </p>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {[
//                   {
//                     icon: Bot,
//                     title: "Gima-Alpha AI Active",
//                     desc: "Our proprietary AI is live, executing 5,000+ daily micro-trades with real-time market analysis and adaptive strategies.",
//                     color: "emerald",
//                     status: "Live"
//                   },
//                   {
//                     icon: Shield,
//                     title: "PAMM System Online",
//                     desc: "Fully operational fund management system with live user accounts, performance tracking, and automated fee distribution.",
//                     color: "teal",
//                     status: "Operational"
//                   },
//                   {
//                     icon: Zap,
//                     title: "Real-Time Trading",
//                     desc: "Instant order execution, live market data, and real-time portfolio management with 99.9% uptime guarantee.",
//                     color: "cyan",
//                     status: "Active"
//                   },
//                 ].map((feature, index) => (
//                   <div
//                     key={index}
//                     className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 relative hover:-translate-y-2 hover:shadow-xl"
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`w-12 h-12 ${index === 0 ? 'bg-emerald-600' : index === 1 ? 'bg-teal-600' : 'bg-cyan-600'} rounded-lg flex items-center justify-center`}>
//                         <feature.icon className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                         {feature.status}
//                       </span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white">
//           <div className="container mx-auto px-6">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Thousands of Active Traders</h2>
//               <p className="text-lg text-gray-200 mb-8 leading-relaxed">
//                 Our platform is live and ready for you. Start trading with Gima-Alpha AI today and experience institutional-grade performance with retail accessibility.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('register')}
//                   className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <Users className="w-5 h-5" />
//                   <span>Create Account</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('login')}
//                   className="group bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <span>Sign In to Trade</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//           <div className="container mx-auto px-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//               <div className="col-span-2">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-110 transition-transform cursor-pointer">
//                     <TrendingUp className="w-8 h-8" />
//                   </div>
//                   <div>
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                     <div className="text-sm text-green-600 dark:text-green-400 font-medium">LIVE TRADING</div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                   GimaCapital, powered by GimaBlockchain, offers live AI-driven trading with institutional-grade performance and security. Join thousands of active traders today.
//                 </p>
//                 <div className="flex space-x-4">
//                   {['Facebook', 'Twitter', 'LinkedIn'].map((platform, index) => (
//                     <button
//                       key={index}
//                       onClick={() => console.log(`Visit ${platform}`)}
//                       className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer hover:scale-110"
//                       aria-label={`Visit our ${platform} page`}
//                     >
//                       <span className="font-bold">{platform[0].toLowerCase()}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Live Platform</h4>
//                 <ul className="space-y-3">
//                   {['Live Trading', 'Mobile App', 'API Access', 'Real-time Data'].map((item, index) => (
//                     <li key={index}>
//                       <button
//                         onClick={() => console.log(`Navigate to ${item}`)}
//                         className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                       >
//                         {item}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//                 <ul className="space-y-3">
//                   {['24/7 Support', 'Contact Us', 'Trading Guide', 'Community'].map((item, index) => (
//                     <li key={index}>
//                       <button
//                         onClick={() => console.log(`Navigate to ${item}`)}
//                         className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                       >
//                         {item}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                   © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Platform;






// import { useState } from 'react';
// import { Helmet } from 'react-helmet';
// import { Link, useNavigate } from 'react-router-dom'; // Import React Router utilities
// import { TrendingUp, Clock, ChevronRight, Menu, X, PlayCircle, Bot, DollarSign, Shield, BarChart3, Users, Zap } from 'lucide-react';

// const Platform = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate(); // Hook for programmatic navigation

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleNavClick = (path) => {
//     navigate(path); // Navigate without reloading
//     if (isMenuOpen) toggleMenu(); // Close menu on mobile after navigation
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//       <Helmet>
//         <title>GimaCapital Platform - AI-Driven Trading</title>
//         <meta name="description" content="GimaCapital's AI-driven trading platform is coming soon! Powered by GimaBlockchain, it delivers institutional-grade performance and security." />
//         <meta name="keywords" content="GimaCapital, platform, AI trading, GimaBlockchain, coming soon" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             "name": "GimaCapital Platform",
//             "description": "GimaCapital's AI-driven trading platform is coming soon, powered by GimaBlockchain.",
//             "url": "https://www.gimacapital.com/platform"
//           })}
//         </script>
//       </Helmet>

//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
//               </div>
//               <div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                 <Link
//                   key={item}
//                   to={`/${item.toLowerCase()}`}
//                   className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
//                 >
//                   {item}
//                 </Link>
//               ))}
//               <div className="flex items-center space-x-6">
//                 <button
//                   onClick={() => handleNavClick('/login')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Sign In</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Start Trading</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//               </div>
//             </div>
//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-gray-300 focus:outline-none"
//                 aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//               >
//                 {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//               </button>
//             </div>
//           </div>
//           {isMenuOpen && (
//             <div className="md:hidden overflow-hidden transition-all duration-300">
//               <div className="flex flex-col space-y-4 mt-4">
//                 {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                   <Link
//                     key={item}
//                     to={`/${item.toLowerCase()}`}
//                     onClick={() => toggleMenu()}
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-left"
//                   >
//                     {item}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                 >
//                   Start Trading
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
//         <section className="py-24 md:py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
//           <div className="container mx-auto px-6 relative z-10">
//             <div className="max-w-4xl mx-auto text-center">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-spin" style={{ animationDuration: '2s' }}>
//                 <PlayCircle className="w-8 h-8 text-white" />
//               </div>
//               <div className="flex items-center justify-center gap-3 mb-4">
//                 <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   PLATFORM LIVE
//                 </div>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//                 Trade with <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Gima-Alpha AI</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
//                 GimaCapital's AI-driven trading platform is now fully operational! Experience institutional-grade performance with our proprietary Gima-Alpha AI executing 5,000+ daily micro-trades powered by GimaBlockchain technology.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>Start Trading Now</span>
//                   <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/ValuationOverview')}
//                   className="group inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>View Live Performance</span>
//                   <BarChart3 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>

//               {/* Live Stats */}
//            {/* Live Stats */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
//               {[
//                 { label: "Active Traders", value: "2,847", color: "emerald", icon: Users },
//                 { label: "Daily Trades", value: "5,000+", color: "teal", icon: Zap, DollarSign},
//                 { label: "Success Rate", value: "94.2%", color: "cyan", icon: TrendingUp }
//               ].map((stat, index) => (
//                 <div
//                   key={index}
//                   className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300"
//                 >
//                   <div className="flex items-center gap-2">
//                     <stat.icon
//                       className={`w-6 h-6 ${
//                         index === 0
//                           ? 'text-emerald-600 dark:text-emerald-400'
//                           : index === 1
//                           ? 'text-teal-600 dark:text-teal-400'
//                           : 'text-cyan-600 dark:text-cyan-400'
//                       }`}
//                     />
//                     <div
//                       className={`text-2xl font-bold ${
//                         index === 0
//                           ? 'text-emerald-600 dark:text-emerald-400'
//                           : index === 1
//                           ? 'text-teal-600 dark:text-teal-400'
//                           : 'text-cyan-600 dark:text-cyan-400'
//                       }`}
//                     >
//                       {stat.value}
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
//                 Platform Features Now Live
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 Experience the full power of GimaCapital's AI-driven trading platform with real-time execution, advanced analytics, and institutional-grade security.
//               </p>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {[
//                   {
//                     icon: Bot,
//                     title: "Gima-Alpha AI Active",
//                     desc: "Our proprietary AI is live, executing 5,000+ daily micro-trades with real-time market analysis and adaptive strategies.",
//                     color: "emerald",
//                     status: "Live"
//                   },
//                   {
//                     icon: Shield,
//                     title: "PAMM System Online",
//                     desc: "Fully operational fund management system with live user accounts, performance tracking, and automated fee distribution.",
//                     color: "teal",
//                     status: "Operational"
//                   },
//                   {
//                     icon: Zap,
//                     title: "Real-Time Trading",
//                     desc: "Instant order execution, live market data, and real-time portfolio management with 99.9% uptime guarantee.",
//                     color: "cyan",
//                     status: "Active"
//                   },
//                 ].map((feature, index) => (
//                   <div
//                     key={index}
//                     className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 relative hover:-translate-y-2 hover:shadow-xl"
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`w-12 h-12 ${index === 0 ? 'bg-emerald-600' : index === 1 ? 'bg-teal-600' : 'bg-cyan-600'} rounded-lg flex items-center justify-center`}>
//                         <feature.icon className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                         {feature.status}
//                       </span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white">
//           <div className="container mx-auto px-6">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Thousands of Active Traders</h2>
//               <p className="text-lg text-gray-200 mb-8 leading-relaxed">
//                 Our platform is live and ready for you. Start trading with Gima-Alpha AI today and experience institutional-grade performance with retail accessibility.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <Users className="w-5 h-5" />
//                   <span>Create Account</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/login')}
//                   className="group bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <span>Sign In to Trade</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>



//       <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//             <div className="col-span-2">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-110 transition-transform cursor-pointer">
//                   <TrendingUp className="w-8 h-8" />
//                 </div>
//                 <div>
//                   <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                   <div className="text-sm text-green-600 dark:text-green-400 font-medium">LIVE TRADING</div>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                 GimaCapital, powered by GimaBlockchain, offers live AI-driven trading with institutional-grade performance and security. Join thousands of active traders today.
//               </p>
//               <div className="flex space-x-4">
//                 {['Facebook', 'Twitter', 'LinkedIn'].map((platform, index) => (
//                   <button
//                     key={index}
//                     // onClick={() => console.log(`Visit ${platform}`)}
//                     onClick={() => handleNavClick('/register')}
//                     className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer hover:scale-110"
//                     aria-label={`Visit our ${platform} page`}
//                   >
//                     <span className="font-bold">{platform[0].toLowerCase()}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 dark:text-white mb-4">Live Platform</h4>
//               <ul className="space-y-3">
//                 {[
//                   { name: 'Live Trading', status: 'live' },
//                   { name: 'Mobile App', status: 'development' },
//                   { name: 'API Access', status: 'development' },
//                   { name: 'Real-time Data', status: 'live' }
//                 ].map((item, index) => (
//                   <li key={index} className="flex items-center justify-between">
//                     <button
//                       // onClick={() => console.log(`Navigate to ${item.name}`)}
//                        onClick={() => handleNavClick('/register')}
//                       className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                     >
//                       {item.name}
//                     </button>
//                     {item.status === 'development' && (
//                       <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
//                         <Clock className="w-3 h-3" />
//                         In Development
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//               <ul className="space-y-3">
//                 {[
//                   { name: '24/7 Support', status: 'live' },
//                   { name: 'Contact Us', status: 'live' },
//                   { name: 'Trading Guide', status: 'development' },
//                   { name: 'Community', status: 'development' }
//                 ].map((item, index) => (
//                   <li key={index} className="flex items-center justify-between">
//                     <button
//                       onClick={() => console.log(`Navigate to ${item.name}`)}
//                       className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                     >
//                       {item.name}
//                     </button>
//                     {item.status === 'development' && (
//                       <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
//                         <Clock className="w-3 h-3" />
//                         In Development
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                 © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//       </main>
//     </div>
//   );
// };

// export default Platform;








// import { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import { Link, useNavigate } from 'react-router-dom';
// import { TrendingUp, Clock, ChevronRight, Menu, X, PlayCircle, Bot, Shield, BarChart3, Users, Zap, DollarSign } from 'lucide-react';

// const Platform = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [stats, setStats] = useState({
//     activeTraders: null,
//     dailyTrades: null,
//     lastUpdated: null,
//     // totalDeposits: null,
//     // totalVolume: null,
//     totalTrades: null // New field
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleNavClick = (path) => {
//     navigate(path);
//     if (isMenuOpen) toggleMenu();
//   };

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('http://localhost:5000/api/stats', { method: 'GET' });
//         if (!response.ok) throw new Error('Failed to fetch stats');
//         const data = await response.json();
//         setStats({
//           activeTraders: data.activeTraders.toLocaleString(),
//           dailyTrades: data.dailyTrades,
//           totalTrades: data.totalTrades.toLocaleString(), // New field
//           lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('en-US', { timeZone: 'Africa/Lagos' }) : null,
//           // totalDeposits: data.totalDeposits ? `$${data.totalDeposits.toLocaleString()}` : 'N/A',
//           // totalVolume: data.totalVolume ? `${data.totalVolume.toLocaleString()}` : '0'
//         });
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to load stats');
//         setStats({
//           activeTraders: '1',
//           dailyTrades: '5,000+',
//           lastUpdated: null,
//           totalTrades: '47', // Fallback based on known trade count
//           // totalDeposits: '$108,767.50',
//           // totalVolume: '0'
//         });
//         setIsLoading(false);
//       }
//     };
//     loadStats();
//     const interval = setInterval(loadStats, 300000); // Poll every 5 minutes
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//       <Helmet>
//         <title>GimaCapital Platform - AI-Driven Trading Now Live</title>
//         <meta
//           name="description"
//           content={`GimaCapital's AI-driven trading platform is now live! Powered by GimaBlockchain, it supports ${
//             stats.activeTraders || 'our growing community of'
//           } active traders and over ${stats.dailyTrades || '5,000'} daily micro-trades with institutional-grade performance and security.`}
//         />
//         <meta name="keywords" content="GimaCapital, platform, AI trading, GimaBlockchain, live trading, active traders, daily trades" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             "name": "GimaCapital Platform",
//             "description": `GimaCapital's AI-driven trading platform is now live, powered by GimaBlockchain, supporting ${
//               stats.activeTraders || 'our growing community of'
//             } active traders and over ${stats.dailyTrades || '5,000'} daily trades.`,
//             "url": "https://www.gimacapital.com/platform"
//           })}
//         </script>
//       </Helmet>

//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
//               </div>
//               <div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</div>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                 <Link
//                   key={item}
//                   to={`/${item.toLowerCase()}`}
//                   className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
//                 >
//                   {item}
//                 </Link>
//               ))}
//               <div className="flex items-center space-x-6">
//                 <button
//                   onClick={() => handleNavClick('/login')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Sign In</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Start Trading</span>
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                 </button>
//               </div>
//             </div>
//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-gray-300 focus:outline-none"
//                 aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//               >
//                 {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//               </button>
//             </div>
//           </div>
//           {isMenuOpen && (
//             <div className="md:hidden overflow-hidden transition-all duration-300">
//               <div className="flex flex-col space-y-4 mt-4">
//                 {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
//                   <Link
//                     key={item}
//                     to={`/${item.toLowerCase()}`}
//                     onClick={() => toggleMenu()}
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-left"
//                   >
//                     {item}
//                   </Link>
//                 ))}
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                 >
//                   Start Trading
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
//         <section className="py-24 md:py-32 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
//           <div className="container mx-auto px-6 relative z-10">
//             <div className="max-w-4xl mx-auto text-center">
//               <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-spin" style={{ animationDuration: '2s' }}>
//                 <PlayCircle className="w-8 h-8 text-white" />
//               </div>
//               <div className="flex items-center justify-center gap-3 mb-4">
//                 <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   PLATFORM JUST LAUNCHED
//                 </div>
//               </div>
//               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
//                 Trade with <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Gima-Alpha AI</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
//                 GimaCapital's AI-driven trading platform is now live! Powered by GimaBlockchain, it supports {stats.activeTraders || 'our growing community of'} active traders and over {stats.dailyTrades || '5,000'} daily micro-trades with institutional-grade performance and security.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>Start Trading Now</span>
//                   <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/ValuationOverview')}
//                   className="group inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg hover:scale-105"
//                 >
//                   <span>View Live Performance</span>
//                   <BarChart3 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>

//               {/* Live Stats */}
//               {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto" aria-live="polite">
//                 {isLoading ? (
//                   <div className="col-span-3 flex justify-center">
//                     <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                 ) : error ? (
//                   <div className="col-span-3 text-center text-red-600 dark:text-red-400">Error: {error}</div>
//                 ) : (
//                   [
//                     { label: "Active Traders", value: stats.activeTraders, color: "emerald", icon: Users },
//                     { label: "Daily Trades", value: stats.dailyTrades, color: "teal", icon: Zap },
//                     { label: "Total Deposits", value: stats.totalDeposits, color: "amber", icon: DollarSign }
//                   ].map((stat, index) => (
//                     <div
//                       key={index}
//                       className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300"
//                     >
//                       <div className="flex items-center gap-2">
//                         <stat.icon
//                           className={`w-6 h-6 ${
//                             index === 0
//                               ? 'text-emerald-600 dark:text-emerald-400'
//                               : index === 1
//                               ? 'text-teal-600 dark:text-teal-400'
//                               : 'text-amber-600 dark:text-amber-400'
//                           }`}
//                         />
//                         <div
//                           className={`text-2xl font-bold ${
//                             index === 0
//                               ? 'text-emerald-600 dark:text-emerald-400'
//                               : index === 1
//                               ? 'text-teal-600 dark:text-teal-400'
//                               : 'text-amber-600 dark:text-amber-400'
//                           }`}
//                         >
//                           {stat.value}
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
//                     </div>
//                   ))
//                 )}
//               </div> */}





//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto" aria-live="polite">
//               {isLoading ? (
//                 <div className="col-span-3 flex justify-center">
//                   <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               ) : error ? (
//                 <div className="col-span-3 text-center text-red-600 dark:text-red-400">Error: {error}</div>
//               ) : (
//                 [
//                   { label: "Active Traders", value: stats.activeTraders, color: "emerald", icon: Users },
//                   { label: "Daily Trades", value: stats.dailyTrades, color: "teal", icon: Zap },
//                   { label: "Total Trades", value: stats.totalTrades, color: "cyan", icon: BarChart3 }, // New field
//                   // { label: "Total Deposits", value: stats.totalDeposits, color: "amber", icon: DollarSign }
//                 ].map((stat, index) => (
//                   <div
//                     key={index}
//                     className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="flex items-center gap-2">
//                       <stat.icon
//                         className={`w-6 h-6 ${
//                           index === 0
//                             ? 'text-emerald-600 dark:text-emerald-400'
//                             : index === 1
//                             ? 'text-teal-600 dark:text-teal-400'
//                             : index === 2
//                             ? 'text-cyan-600 dark:text-cyan-400'
//                             : 'text-amber-600 dark:text-amber-400'
//                         }`}
//                       />
//                       <div
//                         className={`text-2xl font-bold ${
//                           index === 0
//                             ? 'text-emerald-600 dark:text-emerald-400'
//                             : index === 1
//                             ? 'text-teal-600 dark:text-teal-400'
//                             : index === 2
//                             ? 'text-cyan-600 dark:text-cyan-400'
//                             : 'text-amber-600 dark:text-amber-400'
//                         }`}
//                       >
//                         {stat.value}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
//                   </div>
//                 ))
//               )}
//             </div>

//               {stats.lastUpdated && (
//                 <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
//                   Last updated: {stats.lastUpdated}
//                 </div>
//               )}
//               {stats.dailyTrades === '5,000+' && (
//                 <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
//                   Trade volume data coming soon
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
//                 Platform Features Now Live
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 Experience the full power of GimaCapital's AI-driven trading platform with real-time execution, advanced analytics, and institutional-grade security.
//               </p>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {[
//                   {
//                     icon: Bot,
//                     title: "Gima-Alpha AI Active",
//                     desc: `Our proprietary AI is live, executing ${stats.dailyTrades || '5,000+'} daily micro-trades with real-time market analysis and adaptive strategies.`,
//                     color: "emerald",
//                     status: "Live"
//                   },
//                   {
//                     icon: Shield,
//                     title: "PAMM System Online",
//                     desc: "Fully operational fund management system with live user accounts, performance tracking, and automated fee distribution.",
//                     color: "teal",
//                     status: "Operational"
//                   },
//                   {
//                     icon: Zap,
//                     title: "Real-Time Trading",
//                     desc: "Instant order execution, live market data, and real-time portfolio management with 99.9% uptime guarantee.",
//                     color: "cyan",
//                     status: "Active"
//                   },
//                 ].map((feature, index) => (
//                   <div
//                     key={index}
//                     className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 relative hover:-translate-y-2 hover:shadow-xl"
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`w-12 h-12 ${index === 0 ? 'bg-emerald-600' : index === 1 ? 'bg-teal-600' : 'bg-cyan-600'} rounded-lg flex items-center justify-center`}>
//                         <feature.icon className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                         {feature.status}
//                       </span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white">
//           <div className="container mx-auto px-6">
//             <div className="max-w-3xl mx-auto text-center">
//               <h2 className="text-3xl md:text-4xl font-bold mb-6">
//                 Join {stats.activeTraders || 'Our Growing Community of'} Active Traders
//               </h2>
//               <p className="text-lg text-gray-200 mb-8 leading-relaxed">
//                 Our platform just launched, powered by Gima-Alpha AI, executing over {stats.dailyTrades || '5,000'} daily trades. Start trading today and experience institutional-grade performance with retail accessibility.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => handleNavClick('/register')}
//                   className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <Users className="w-5 h-5" />
//                   <span>Create Account</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <button
//                   onClick={() => handleNavClick('/login')}
//                   className="group bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
//                 >
//                   <span>Sign In to Trade</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//           <div className="container mx-auto px-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//               <div className="col-span-2">
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-110 transition-transform cursor-pointer">
//                     <TrendingUp className="w-8 h-8" />
//                   </div>
//                   <div>
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                     <div className="text-sm text-green-600 dark:text-green-400 font-medium">LIVE TRADING</div>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                   GimaCapital, powered by GimaBlockchain, offers live AI-driven trading with institutional-grade performance and security. Join {stats.activeTraders || 'our growing community of'} active traders today.
//                 </p>
//                 <div className="flex space-x-4">
//                   {['facebook', 'twitter', 'linkedin'].map((platform, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleNavClick(`/${platform}`)}
//                       className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer hover:scale-110"
//                       aria-label={`Visit our ${platform} page`}
//                     >
//                       <span className="font-bold">{platform[0].toUpperCase()}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Live Platform</h4>
//                 <ul className="space-y-3">
//                   {[
//                     { name: 'Live Trading', status: 'live' },
//                     { name: 'Mobile App', status: 'development' },
//                     { name: 'API Access', status: 'development' },
//                     { name: 'Real-time Data', status: 'live' }
//                   ].map((item, index) => (
//                     <li key={index} className="flex items-center justify-between">
//                       <button
//                         onClick={() => handleNavClick(`/${item.name.toLowerCase().replace(' ', '-')}`)}
//                         className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                       >
//                         {item.name}
//                       </button>
//                       {item.status === 'development' && (
//                         <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
//                           <Clock className="w-3 h-3" />
//                           In Development
//                         </span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//                 <ul className="space-y-3">
//                   {[
//                     { name: '24/7 Support', status: 'live' },
//                     { name: 'Contact Us', status: 'live' },
//                     { name: 'Trading Guide', status: 'development' },
//                     { name: 'Community', status: 'development' }
//                   ].map((item, index) => (
//                     <li key={index} className="flex items-center justify-between">
//                       <button
//                         onClick={() => handleNavClick(`/${item.name.toLowerCase().replace(' ', '-')}`)}
//                         className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
//                       >
//                         {item.name}
//                       </button>
//                       {item.status === 'development' && (
//                         <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
//                           <Clock className="w-3 h-3" />
//                           In Development
//                         </span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                   © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default Platform;









import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, ChevronRight, Menu, X, Radio, Bot, Shield, BarChart3, Users, Zap,  DollarSign } from 'lucide-react';

const GimaLiveStats = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    activeTraders: null,
    dailyTrades: null,
    totalTrades: null,
    totalVolume: null,
    newUsers: null,
    lastUpdated: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMenuOpen) toggleMenu();
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/stats', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats({
          activeTraders: data.activeTraders?.toLocaleString() || 'N/A',
          dailyTrades: data.dailyTrades?.toLocaleString() || '5,000+',
          totalTrades: data.totalTrades?.toLocaleString() || 'N/A',
          totalVolume: data.totalVolume ? `$${data.totalVolume.toLocaleString()}` : 'coming soon',
          newUsers: data.newUsers?.toLocaleString() || 'active',
          lastUpdated: data.lastUpdated
            ? new Date(data.lastUpdated).toLocaleString('en-US', { timeZone: 'Africa/Lagos' })
            : null,
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load stats');
        setStats({
          activeTraders: '1',
          dailyTrades: '5,000+',
          totalTrades: '47',
          totalVolume: 'N/A',
          newUsers: 'N/A',
          lastUpdated: null,
        });
        setIsLoading(false);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 300000); // Poll every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
      <Helmet>
        <title>Gima Live Stats | GimaCapital</title>
        <meta
          name="description"
          content={`Explore live trading stats on GimaCapital! Powered by GimaBlockchain, track ${
            stats.activeTraders || 'our growing community of'
          } active traders and over ${stats.dailyTrades || '5,000'} daily micro-trades with institutional-grade performance.`}
        />
        <meta name="keywords" content="GimaCapital, live stats, AI trading, GimaBlockchain, active traders, daily trades" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Gima Live Stats",
            "description": `GimaCapital's live trading stats, powered by GimaBlockchain, showcasing ${
              stats.activeTraders || 'our growing community of'
            } active traders and over ${stats.dailyTrades || '5,000'} daily trades.`,
            "url": "https://www.gimacapital.com/gima-live-stats"
          })}
        </script>
      </Helmet>

      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  GimaCapital
                </span>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  onClick={() => handleNavClick(`/${item.toLowerCase()}`)}
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Sign In</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Start Trading</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-gray-300 focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden overflow-hidden transition-all duration-300">
              <div className="flex flex-col space-y-4 mt-4">
                {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    onClick={() => handleNavClick(`/${item.toLowerCase()}`)}
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-left"
                  >
                    {item}
                  </Link>
                ))}
                <button
                  onClick={() => handleNavClick('/register')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
                >
                  Start Trading
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white">
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-pulse">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  GIMA LIVE STATS LAUNCHED
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Track with <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Gima-Alpha AI</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Explore GimaCapital's live trading stats! Powered by GimaBlockchain, monitor {stats.activeTraders || 'our growing community of'} active traders and over {stats.dailyTrades || '5,000'} daily micro-trades with institutional-grade performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleNavClick('/register')}
                  className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-lg hover:scale-105"
                >
                  <span>Start Trading Now</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleNavClick('/ValuationOverview')}
                  className="group inline-flex items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-lg hover:scale-105"
                >
                  <span>View Our Valuation</span>
                  <BarChart3 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto" aria-live="polite">
                {isLoading ? (
                  <div className="col-span-3 flex justify-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="col-span-3 text-center text-red-600 dark:text-red-400">Error: {error}</div>
                ) : (
                  [
                    { label: "Active Traders", value: stats.activeTraders, color: "emerald", icon: Users },
                    { label: "Daily Trades", value: stats.dailyTrades, color: "teal", icon: Zap },
                    { label: "Total Trades", value: stats.totalTrades, color: "cyan", icon: BarChart3 },
                    { label: "Total Volume", value: stats.totalVolume, color: "amber", icon: DollarSign },
                    { label: "New Users", value: stats.newUsers, color: "blue", icon: Users },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon
                          className={`w-6 h-6 ${
                            index === 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : index === 1
                              ? 'text-teal-600 dark:text-teal-400'
                              : index === 2
                              ? 'text-cyan-600 dark:text-cyan-400'
                              : index === 3
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                        <div
                          className={`text-2xl font-bold ${
                            index === 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : index === 1
                              ? 'text-teal-600 dark:text-teal-400'
                              : index === 2
                              ? 'text-cyan-600 dark:text-cyan-400'
                              : index === 3
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
                    </div>
                  ))
                )}
              </div>

              {stats.lastUpdated && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Last updated: {stats.lastUpdated}
                </div>
              )}
              {stats.dailyTrades === '5,000+' && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Trade volume data coming soon
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Gima Live Stats Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Monitor real-time trading performance with GimaCapital's AI-driven stats, powered by GimaBlockchain, offering advanced analytics and institutional-grade reliability.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Bot,
                    title: "Gima-Alpha AI Active",
                    desc: `Our proprietary AI is live, executing ${stats.dailyTrades || '5,000+'} daily micro-trades with real-time market analysis and adaptive strategies.`,
                    color: "emerald",
                    status: "Live"
                  },
                  {
                    icon: Shield,
                    title: "PAMM System Online",
                    desc: "Fully operational fund management system with live user accounts, performance tracking, and automated fee distribution.",
                    color: "teal",
                    status: "Operational"
                  },
                  {
                    icon: Zap,
                    title: "Real-Time Stats",
                    desc: "Instant data updates, live market insights, and real-time performance metrics with 99.9% uptime guarantee.",
                    color: "cyan",
                    status: "Active"
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 relative hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${index === 0 ? 'bg-emerald-600' : index === 1 ? 'bg-teal-600' : 'bg-cyan-600'} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join {stats.activeTraders || 'Our Growing Community of'} Active Traders
              </h2>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Gima Live Stats is powered by Gima-Alpha AI, tracking over {stats.dailyTrades || '5,000'} daily trades. Start trading today and experience institutional-grade performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleNavClick('/register')}
                  className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
                >
                  <Users className="w-5 h-5" />
                  <span>Create Account</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleNavClick('/login')}
                  className="group bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:scale-105"
                >
                  <span>Sign In to Trade</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-110 transition-transform cursor-pointer">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">LIVE TRADING</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
                  GimaCapital, powered by GimaBlockchain, offers live AI-driven trading stats. Monitor {stats.activeTraders || 'our growing community of'} active traders today.
                </p>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin'].map((platform, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavClick(`/${platform}`)}
                      className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer hover:scale-110"
                      aria-label={`Visit our ${platform} page`}
                    >
                      <span className="font-bold">{platform[0].toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Live Stats</h4>
                <ul className="space-y-3">
                  {[
                    { name: 'Live Trading', status: 'live' },
                    { name: 'Mobile App', status: 'development' },
                    { name: 'API Access', status: 'development' },
                    { name: 'Real-time Data', status: 'live' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick(`/${item.name.toLowerCase().replace(' ', '-')}`)}
                        className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
                      >
                        {item.name}
                      </button>
                      {item.status === 'development' && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3 h-3" />
                          In Development
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
                <ul className="space-y-3">
                  {[
                    { name: '24/7 Support', status: 'live' },
                    { name: 'Contact Us', status: 'live' },
                    { name: 'Trading Guide', status: 'development' },
                    { name: 'Community', status: 'development' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick(`/${item.name.toLowerCase().replace(' ', '-')}`)}
                        className="text-left text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-1 transform duration-200"
                      >
                        {item.name}
                      </button>
                      {item.status === 'development' && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3 h-3" />
                          In Development
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                  © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default GimaLiveStats;