// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CheckCircle, TrendingUp, Users, Bot, DollarSign, Globe, Server, Database, Smartphone, BarChart3, Shield, Zap, Target, PieChart, ArrowRight, Star, Award, Clock, Briefcase, ChevronRight, Menu, X } from 'lucide-react';

// const ValuationOverview = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const hash = location.hash.replace('#', '');
//     if (['overview', 'financials', 'technology', 'market'].includes(hash)) {
//       setActiveTab(hash);
//       document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [location]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const TabButton = ({ id, label, isActive }) => (
//     <Link
//       to={`#${id}`}
//       onClick={() => setActiveTab(id)}
//       className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
//         isActive
//           ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
//           : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
//       }`}
//       role="tab"
//       aria-selected={isActive}
//       aria-controls={`${id}-panel`}
//     >
//       {label}
//       <ChevronRight className="w-4 h-4 opacity-75" />
//     </Link>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-all duration-500">
//       <Helmet>
//         <title>Valuation Overview - GimaCapital</title>
//         <meta name="description" content="Explore GimaCapital's investment valuation, financial metrics, technology assets, and market analysis for our AI-powered trading platform." />
//         <meta name="keywords" content="GimaCapital, GimaBlockchain, valuation, AI trading, investment" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             "name": "GimaCapital",
//             "description": "GimaCapital's valuation overview for an AI-driven trading platform powered by GimaBlockchain.",
//             "url": "https://www.gimacapital.com"
//           })}
//         </script>
//       </Helmet>

//       {/* Navbar */}
//       <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/30 z-50 transition-all duration-300">
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
           
//               <Link to="/Gima-Live-Stats" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                Gima Live Stats
//               </Link>
//               <Link to="/Equity-structure" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                Equity 
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
//                     className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
//                   >
//                     <span className="relative z-10">Sign In</span>
//                     <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                     <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </Link>
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Link
//                     to="/register"
//                     className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
//                     to="/Gima-Live-Stats"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     Gima Live Stats
//                   </Link>
//                   <Link
//                     to="/Equity-structure"
//                     className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                     onClick={toggleMenu}
//                   >
//                     Investment Structure
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

//       <div className="flex flex-col lg:flex-row max-w-8xl mx-auto pt-24">
//         {/* Sidebar Navigation */}
//         <aside className="lg:w-64 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] p-6 hidden lg:block">
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-4"
//             role="tablist"
//             aria-orientation="vertical"
//           >
//             <TabButton id="overview" label="Executive Summary" isActive={activeTab === 'overview'} />
//             <TabButton id="financials" label="Financial Metrics" isActive={activeTab === 'financials'} />
//             <TabButton id="technology" label="Technology Assets" isActive={activeTab === 'technology'} />
//             <TabButton id="market" label="Market Analysis" isActive={activeTab === 'market'} />
//           </motion.div>
//         </aside>

//         <main className="flex-1 p-6">
//           {/* Premium Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-center mb-12"
//           >
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <motion.div
//                 whileHover={{ rotate: 360 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl"
//               >
//                 <Briefcase className="w-8 h-8 text-white" />
//               </motion.div>
//               <div>
//                 <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   Investment Valuation
//                 </h1>
//                 <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-2">GimaCapital</div>
//               </div>
//             </div>
//             <div className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
//               <strong>Early Operational Stage</strong> — Revolutionary AI-powered trading platform ready for user acquisition with proven autonomous intelligence and live operational systems
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 mt-8 lg:hidden">
//               <TabButton id="overview" label="Executive Summary" isActive={activeTab === 'overview'} />
//               <TabButton id="financials" label="Financial Metrics" isActive={activeTab === 'financials'} />
//               <TabButton id="technology" label="Technology Assets" isActive={activeTab === 'technology'} />
//               <TabButton id="market" label="Market Analysis" isActive={activeTab === 'market'} />
//               <Link
//               to="/investment-structure"
//               className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
//             >
//               Investment Structure
//               <ChevronRight className="w-4 h-4 opacity-75" />
//             </Link>
//             </div>

          
//           </motion.div>

//           {/* Key Metrics Dashboard */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12"
//           >
//             {[
//               { icon: DollarSign, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Based on comparable analysis", tag: "Current", color: "emerald" },
//               { icon: Target, label: "Funding Target", value: "$500K", subtext: "Series Seed Round", tag: "Objective", color: "teal" },
//               { icon: TrendingUp, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Operational assets + traction", tag: "Valuation", color: "cyan" },
//               { icon: Users, label: "Current User Base", value: "Ready", subtext: "Onboarding system live", tag: "Active", color: "emerald" },
//             ].map((metric, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
//                 className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 relative overflow-hidden`}
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
//                   <div className={`px-3 py-1 bg-${metric.color}-100 dark:bg-${metric.color}-900 text-${metric.color}-700 dark:text-${metric.color}-300 rounded-full text-sm font-medium`}>
//                     {metric.tag}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{metric.label}</div>
//                 <div className={`text-4xl font-bold text-${metric.color}-600`}>{metric.value}</div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{metric.subtext}</div>
//                 <div className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Tab Content */}
//           <div id="overview" className="scroll-mt-24">
//             {activeTab === 'overview' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-8"
//               >
//                 {/* Valuation Justification */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center gap-3 mb-8">
//                     <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
//                       <Award className="w-6 h-6 text-white" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Early Operational Stage Advantage</h2>
//                   </div>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                     className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-xl border border-emerald-200 dark:border-emerald-700"
//                   >
//                     <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-3">🚀 Beyond MVP — Operational Systems Live</div>
//                     <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                       <strong>GimaCapital has moved beyond proof-of-concept into early operational stage.</strong> All core technology is operational and ready for user acquisition.
//                       We're raising funds to launch user onboarding and scale our proven systems — not to build unproven concepts.
//                     </div>
//                   </motion.div>
//                   <div className="grid lg:grid-cols-3 gap-8">
//                     {[
//                       {
//                         title: "Operational Technology Assets",
//                         items: [
//                           { asset: "Gima-Alpha AI Engine", value: "$900K", status: "Live & Trading", desc: "Functional autonomous trading system", icon: Bot },
//                           { asset: "PAMM Infrastructure", value: "$600K", status: "Operational", desc: "Ready-to-scale fund management", icon: PieChart },
//                           { asset: "Trading Platform MVP", value: "$500K", status: "User-Ready", desc: "Full dashboard & execution system", icon: BarChart3 },
//                         ],
//                         color: "emerald",
//                       },
//                       {
//                         title: "Execution & Traction Metrics",
//                         items: [
//                           { asset: "Onboarding Infrastructure", value: "Ready", status: "Google Sign-in Live", desc: "Complete user acquisition system", icon: Users },
//                           { asset: "Daily Trading Capacity", value: "5K+", status: "AI-Ready Execution", desc: "Proven autonomous performance", icon: DollarSign },
//                           { asset: "Website & Platform", value: "100%", status: "Fully Operational", desc: "Complete user experience ready", icon: Globe },
//                         ],
//                         color: "teal",
//                       },
//                       {
//                         title: "Risk Mitigation Factors",
//                         items: [
//                           { asset: "Technical Risk", value: "Eliminated", status: "Systems Proven", desc: "All core tech is operational", icon: Zap },
//                           { asset: "Team Execution Risk", value: "Low", status: "Track Record", desc: "4-person team delivered live systems", icon: Shield },
//                           { asset: "Market Validation", value: "Tech-Ready", status: "Systems Proven", desc: "Infrastructure validated, ready for users", icon: Star },
//                         ],
//                         color: "cyan",
//                       },
//                     ].map((section, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: index * 0.1 }}
//                         className="space-y-6"
//                       >
//                         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
//                         {section.items.map((item, itemIndex) => (
//                           <motion.div
//                             key={itemIndex}
//                             whileHover={{ scale: 1.02 }}
//                             className={`flex items-start gap-4 p-5 bg-gradient-to-r from-${section.color}-50 to-${section.color === 'emerald' ? 'teal' : section.color === 'teal' ? 'cyan' : 'emerald'}-50 dark:from-${section.color}-900 dark:to-${section.color === 'emerald' ? 'teal' : section.color === 'teal' ? 'cyan' : 'emerald'}-900 rounded-xl border border-${section.color}-200 dark:border-${section.color}-700`}
//                           >
//                             <div className={`w-10 h-10 bg-${section.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
//                               <item.icon className="w-5 h-5 text-white" />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between mb-1">
//                                 <div className="font-semibold text-gray-900 dark:text-white">{item.asset}</div>
//                                 <div className={`text-lg font-bold text-${section.color}-600`}>{item.value}</div>
//                               </div>
//                               <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.desc}</div>
//                               <div className={`px-3 py-1 bg-${section.color}-600 text-white text-xs rounded-full font-medium inline-block`}>
//                                 ✅ {item.status}
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Methodology */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center gap-3 mb-8">
//                     <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
//                       <BarChart3 className="w-6 h-6 text-white" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Valuation Methodology</h2>
//                   </div>
//                   <div className="grid md:grid-cols-3 gap-8">
//                     {[
//                       { icon: PieChart, title: "Comparable Analysis", value: "$2.1M", desc: "Benchmarked against AI trading platforms (3Commas: $40M valuation, Pionex: $100M+) adjusted for stage and traction", color: "emerald" },
//                       { icon: TrendingUp, title: "Revenue Multiple", value: "$3.0M", desc: "Projected 12-month revenue of $1.2M × 2.5x early-stage SaaS multiple for recurring revenue model", color: "teal" },
//                       { icon: Users, title: "User-Based Valuation", value: "$3.2M", desc: "Infrastructure ready for user acquisition × $1,280 projected user value (based on LTV modeling and market analysis)", color: "cyan" },
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ y: -5 }}
//                         className={`p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color === 'emerald' ? 'teal' : item.color === 'teal' ? 'cyan' : 'emerald'}-50 dark:from-${item.color}-900 dark:to-${item.color === 'emerald' ? 'teal' : item.color === 'teal' ? 'cyan' : 'emerald'}-900 rounded-xl border border-${item.color}-200 dark:border-${item.color}-700`}
//                       >
//                         <div className={`w-12 h-12 bg-${item.color}-600 rounded-lg flex items-center justify-center mb-4`}>
//                           <item.icon className="w-6 h-6 text-white" />
//                         </div>
//                         <div className={`font-bold text-xl text-${item.color}-800 dark:text-${item.color}-300 mb-3`}>{item.title}</div>
//                         <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</div>
//                         <div className={`mt-4 text-2xl font-bold text-${item.color}-600`}>{item.value}</div>
//                       </motion.div>
//                     ))}
//                   </div>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                     className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-xl text-white"
//                   >
//                     <div className="text-center">
//                       <div className="text-lg font-semibold mb-2">Early Operational Stage Valuation</div>
//                       <div className="text-4xl font-bold mb-2">$3.2M</div>
//                       <div className="text-gray-200">Based on proven operational assets, not projections</div>
//                       <div className="mt-4 text-sm text-emerald-200">
//                         <strong>Key Advantage:</strong> We're an operational platform seeking capital to scale proven systems,
//                         not a startup seeking product-market fit.
//                       </div>
//                     </div>
//                   </motion.div>















//                   {/* Inside the "Ready to Scale" section, after the existing motion.div (around line 540) */}
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                         className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
//                       >
//                         <div className="text-2xl font-bold mb-2">Early Operational Stage Investment</div>
//                         <div className="text-lg mb-4">Series Seed Round • $500K Target • $3.2M Pre-Money Valuation</div>
//                         <div className="text-gray-200">
//                           <strong>Investment Thesis:</strong> Launch and scale proven operational systems with complete user onboarding infrastructure.
//                           All technology validated and ready — funding goes directly to user acquisition and growth.
//                         </div>
//                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
//                           <Link
//                             to="/investment-structure"
//                             className="inline-block bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//                           >
//                             View Investment Structure
//                           </Link>
//                         </motion.div>
//                       </motion.div>





//                 </div>
//               </motion.div>
//             )}
//           </div>

//           <div id="financials" className="scroll-mt-24">
//             {activeTab === 'financials' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700"
//               >
//                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Financial Projections & Metrics</h2>
//                 <div className="grid md:grid-cols-2 gap-8 mb-8">
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Streams</h3>
//                     {[
//                       { stream: "PAMM Performance Fees", percentage: "60%", amount: "$720K", desc: "20% of profits from managed funds" },
//                       { stream: "Subscription Plans", percentage: "30%", amount: "$360K", desc: "Monthly recurring revenue" },
//                       { stream: "Premium Features", percentage: "10%", amount: "$120K", desc: "Advanced analytics & tools" },
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.02 }}
//                         className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
//                       >
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="font-semibold text-gray-900 dark:text-white">{item.stream}</span>
//                           <span className="text-2xl font-bold text-emerald-600">{item.amount}</span>
//                         </div>
//                         <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.desc}</div>
//                         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: item.percentage }}
//                             transition={{ duration: 1, delay: index * 0.2 }}
//                             className="bg-emerald-600 h-2 rounded-full"
//                           ></motion.div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </motion.div>
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
//                     <div className="space-y-4">
//                       {[
//                         { label: "Monthly Recurring Revenue (MRR)", value: "$30K", color: "emerald" },
//                         { label: "Customer Acquisition Cost (CAC)", value: "$15", color: "teal" },
//                         { label: "Customer Lifetime Value (LTV)", value: "$450", color: "emerald" },
//                         { label: "LTV/CAC Ratio", value: "30:1", color: "teal" },
//                       ].map((metric, index) => (
//                         <motion.div
//                           key={index}
//                           whileHover={{ scale: 1.02 }}
//                           className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
//                         >
//                           <span>{metric.label}</span>
//                           <span className={`font-bold text-${metric.color}-600`}>{metric.value}</span>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           <div id="technology" className="scroll-mt-24">
//             {activeTab === 'technology' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-8"
//               >
//                 {/* Gima-Alpha Deep Dive */}
//                 <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 rounded-2xl p-10 shadow-2xl text-white">
//                   <div className="flex items-center gap-4 mb-8">
//                     <motion.div
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.5 }}
//                       className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center"
//                     >
//                       <Bot className="w-8 h-8 text-white" />
//                     </motion.div>
//                     <div>
//                       <h2 className="text-4xl font-bold">Gima-Alpha</h2>
//                       <div className="text-xl text-gray-200">Autonomous Trading Intelligence Engine</div>
//                     </div>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-8 mb-8">
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
//                       <h3 className="text-2xl font-semibold mb-6 text-emerald-200">Core Capabilities</h3>
//                       <div className="space-y-4">
//                         {[
//                           "Executes 5,000+ micro-trades daily across 50+ crypto pairs",
//                           "Real-time market sentiment analysis using NLP",
//                           "Dynamic risk management with position sizing algorithms",
//                           "Multi-timeframe technical analysis integration",
//                           "Automated rebalancing and profit optimization",
//                         ].map((capability, index) => (
//                           <motion.div
//                             key={index}
//                             initial={{ x: -20 }}
//                             animate={{ x: 0 }}
//                             transition={{ duration: 0.3, delay: index * 0.1 }}
//                             className="flex items-start gap-3"
//                           >
//                             <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
//                             <span className="text-gray-200">{capability}</span>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
//                       <h3 className="text-2xl font-semibold mb-6 text-emerald-200">Technical Architecture</h3>
//                       <div className="space-y-4">
//                         {[
//                           { component: "ML Models", status: "TensorFlow + PyTorch", desc: "Deep learning for pattern recognition" },
//                           { component: "Data Pipeline", status: "Real-time streaming", desc: "Sub-second market data processing" },
//                           { component: "Execution Engine", status: "Low-latency", desc: "Sub-100ms order execution" },
//                           { component: "Risk Management", status: "Multi-layer", desc: "Position limits and stop-loss automation" },
//                         ].map((item, index) => (
//                           <motion.div
//                             key={index}
//                             whileHover={{ scale: 1.02 }}
//                             className="p-4 bg-gray-800 rounded-lg border border-gray-700"
//                           >
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="font-semibold text-white">{item.component}</span>
//                               <span className="text-sm text-emerald-300">{item.status}</span>
//                             </div>
//                             <div className="text-sm text-gray-400">{item.desc}</div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   </div>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                     className="p-6 bg-gray-800 rounded-xl border border-gray-700"
//                   >
//                     <div className="text-center">
//                       <div className="text-lg font-semibold text-emerald-300 mb-2">Performance Metrics (Last 30 Days)</div>
//                       <div className="grid grid-cols-3 gap-6">
//                         <div>
//                           <div className="text-3xl font-bold text-emerald-400">+9.3%</div>
//                           <div className="text-sm text-gray-400">Average Monthly Return</div>
//                         </div>
//                         <div>
//                           <div className="text-3xl font-bold text-teal-400">0.87</div>
//                           <div className="text-sm text-gray-400">Sharpe Ratio</div>
//                         </div>
//                         <div>
//                           <div className="text-3xl font-bold text-cyan-400">4.2%</div>
//                           <div className="text-sm text-gray-400">Max Drawdown</div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Technology Stack */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Complete Technology Stack</h2>
//                   <div className="grid md:grid-cols-3 gap-6">
//                     {[                    
//                       { category: "Frontend", tech: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js"], icon: Globe },
//                       { category: "Backend", tech: ["Node.js", "Python", "Quart", "PostgreSQL"], icon: Bot },
//                       { category: "Infrastructure", tech: ["AWS", "Docker", "Redis", "WebSocket"], icon: Shield },
//                       { category: "AI/ML", tech: ["TensorFlow", "Pandas", "NumPy", "Scikit-learn", "OpenAI", "DeepSeek"], icon: Zap },
//                       { category: "Web Development", tech: ["Next.js", "React", "Tailwind CSS", "Node.js"], icon: Globe },
//                       { category: "Mobile Development", tech: ["Flutter", "React Native", "Dart"], icon: Smartphone },
//                       { category: "Blockchain", tech: ["Solidity", "Web3.js", "Stellar"], icon: Link },
//                       { category: "DevOps", tech: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions"], icon: Server },
//                       { category: "Database", tech: ["Google Datastore",  "Google Cloud SQL", "PostgreSQL", "Firestore", "Firebase",], icon: Database },
//                       { category: "Cybersecurity", tech: ["Wireshark", "Nmap", "Metasploit", "Burp Suite"], icon: Shield },
//                       { category: "Trading", tech: ["CCXT", "Binance API", "bybit API","WebSocket feeds", "Order management"], icon: BarChart3 },
//                       { category: "Security", tech: ["OAuth 2.0", "JWT", "API encryption", "Cold storage"], icon: Shield },
            
//                       ].map((stack, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ y: -5 }}
//                         className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="flex items-center gap-3 mb-4">
//                           <stack.icon className="w-6 h-6 text-emerald-600" />
//                           <h3 className="font-semibold text-gray-900 dark:text-white">{stack.category}</h3>
//                         </div>
//                         <div className="space-y-2">
//                           {stack.tech.map((tech, techIndex) => (
//                             <motion.div
//                               key={techIndex}
//                               whileHover={{ scale: 1.05 }}
//                               className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 inline-block mr-2 mb-2"
//                             >
//                               {tech}
//                             </motion.div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           <div id="market" className="scroll-mt-24">
//             {activeTab === 'market' && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-8"
//               >
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Market Analysis & Opportunity</h2>
//                   <div className="grid md:grid-cols-2 gap-8">
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
//                       <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Total Addressable Market</h3>
//                       <div className="space-y-4">
//                         {[
//                           { value: "$127B", label: "Global Cryptocurrency Market Cap", color: "emerald" },
//                           { value: "$8.2B", label: "Algorithmic Trading Software Market", color: "teal" },
//                           { value: "$2.8B", label: "Portfolio Management Solutions", color: "cyan" },
//                         ].map((market, index) => (
//                           <motion.div
//                             key={index}
//                             whileHover={{ scale: 1.02 }}
//                             className={`p-4 bg-${market.color}-50 dark:bg-${market.color}-900 rounded-lg border border-${market.color}-200 dark:border-${market.color}-700`}
//                           >
//                             <div className={`text-2xl font-bold text-${market.color}-600`}>{market.value}</div>
//                             <div className="text-sm text-gray-600 dark:text-gray-300">{market.label}</div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
//                       <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Competitive Positioning</h3>
//                       <div className="space-y-4">
//                         {[
//                           { competitor: "3Commas", advantage: "Superior AI capabilities", market: "$40M valuation" },
//                           { competitor: "Pionex", advantage: "PAMM integration", market: "$100M+ valuation" },
//                           { competitor: "Shrimpy", advantage: "Better user experience", market: "Acquired for $20M" },
//                           { competitor: "HaasOnline", advantage: "More accessible pricing", market: "Enterprise focused" },
//                         ].map((comp, index) => (
//                           <motion.div
//                             key={index}
//                             whileHover={{ scale: 1.02 }}
//                             className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
//                           >
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="font-semibold text-gray-900 dark:text-white">{comp.competitor}</span>
//                               <span className="text-sm text-gray-600 dark:text-gray-300">{comp.market}</span>
//                             </div>
//                             <div className="text-sm text-emerald-600">Our advantage: {comp.advantage}</div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   </div>
//                 </div>

//                 {/* Growth Strategy */}
//                 <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-2xl p-10 shadow-xl text-white">
//                   <h2 className="text-3xl font-bold mb-8">12-Month Growth Strategy</h2>
//                   <div className="grid md:grid-cols-3 gap-6">
//                     {[
//                       { phase: "Q1-Q2 2026", focus: "Scale & Optimize", targets: ["5K users", "$50K Monthly Recurring Revenue. MRR", "Advanced AI features"] },
//                       { phase: "Q3 2026", focus: "Market Expansion", targets: ["15K users", "$150K Monthly Recurring Revenue. MRR", "International launch"] },
//                       { phase: "Q4 2026", focus: "Enterprise & Partnerships", targets: ["25K users", "$250K Monthly Recurring Revenue. MRR", "Institutional clients"] },
//                     ].map((phase, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ y: -5 }}
//                         className="p-6 bg-white dark:bg-gray-800 bg-opacity-10 rounded-xl backdrop-blur-sm border border-white dark:border-gray-700 border-opacity-20"
//                       >
//                         <div className="text-lg font-semibold mb-2">{phase.phase}</div>
//                         <div className="text-xl font-bold mb-4 text-emerald-200">{phase.focus}</div>
//                         <div className="space-y-2">
//                           {phase.targets.map((target, targetIndex) => (
//                             <motion.div
//                               key={targetIndex}
//                               initial={{ x: -20 }}
//                               animate={{ x: 0 }}
//                               transition={{ duration: 0.3, delay: targetIndex * 0.1 }}
//                               className="flex items-center gap-2"
//                             >
//                               <ArrowRight className="w-4 h-4 text-emerald-300" />
//                               <span className="text-sm">{target}</span>
//                             </motion.div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>

 

//             <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mt-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 rounded-2xl p-10 shadow-2xl text-white text-center"
//           >
//             <div className="max-w-4xl mx-auto">
//               <h2 className="text-4xl font-bold mb-4">Ready to Scale Proven Trading Intelligence?</h2>
//               <p className="text-xl text-gray-200 mb-8 leading-relaxed">
//                 GimaCapital is beyond the startup risk phase. We have operational systems and proven technology ready for users.
//                 Join us in launching and scaling the next generation of autonomous trading intelligence.
//               </p>
              
//               <div className="grid md:grid-cols-3 gap-6 mb-8">
//                 <motion.div
//                   whileHover={{ y: -5 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
//                   <div className="font-semibold mb-2 text-gray-800 dark:text-white">Time to Market</div>
//                   <div className="text-2xl font-bold text-emerald-600">6 Months</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Full monetization ready</div>
//                 </motion.div>
                
//                 <motion.div
//                   whileHover={{ y: -5 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-3" />
//                   <div className="font-semibold mb-2 text-gray-800 dark:text-white">ROI Projection</div>
//                   <div className="text-2xl font-bold text-teal-600">15-25x</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">3-5 year horizon</div>
//                 </motion.div>
                
//                 <motion.div
//                   whileHover={{ y: -5 }}
//                   className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <Target className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
//                   <div className="font-semibold mb-2 text-gray-800 dark:text-white">Market Position</div>
//                   <div className="text-2xl font-bold text-cyan-600">Top 3</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">AI trading platforms</div>
//                 </motion.div>
//               </div>
              
//               <motion.div 
//                 initial={{ opacity: 0 }} 
//                 animate={{ opacity: 1 }} 
//                 transition={{ duration: 0.5, delay: 0.3 }} 
//                 className="space-y-4"
//               >
//                 <div className="text-lg font-semibold text-emerald-300">Early Operational Stage Investment</div>
//                 <div className="grid md:grid-cols-2 gap-4 text-left">
//                   <div className="space-y-2">
//                     {[
//                       "<strong>Operational systems:</strong> All technology is live and functional",
//                       "<strong>User-ready systems:</strong> Complete onboarding infrastructure operational",
//                       "<strong>Technical risk eliminated:</strong> AI trading system operational",
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ x: -20 }}
//                         animate={{ x: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                         className="flex items-center gap-2"
//                       >
//                         <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
//                         <span dangerouslySetInnerHTML={{ __html: item }}></span>
//                       </motion.div>
//                     ))}
//                   </div>
//                   <div className="space-y-2">
//                     {[
//                       "<strong>Execution proven:</strong> Team delivered multiple integrated systems",
//                       "<strong>Launch-ready:</strong> User acquisition infrastructure operational",
//                       "<strong>Scalable foundation:</strong> Infrastructure built for growth",
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ x: -20 }}
//                         animate={{ x: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                         className="flex items-center gap-2"
//                       >
//                         <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
//                         <span dangerouslySetInnerHTML={{ __html: item }}></span>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
              
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//                 className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
//               >
//                 <div className="text-2xl font-bold mb-2">Early Operational Stage Investment</div>
//                 <div className="text-lg mb-4">Series Seed Round • $500K Target • $3.2M Pre-Money Valuation</div>
//                 <div className="text-gray-200">
//                   <strong>Investment Thesis:</strong> Launch and scale proven operational systems with complete user onboarding infrastructure.
//                   All technology validated and ready — funding goes directly to user acquisition and growth.
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//             className="mt-8 text-center text-gray-600 dark:text-gray-300"
//           >
//             <div className="text-sm">
//               For investment inquiries and detailed financial projections, please contact:
//             </div>
//             <div className="mt-2 font-semibold text-gray-900 dark:text-white">
//               GimaCapital Investment Team • investment@gimacapital.com
//             </div>
//             <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
//               This document contains forward-looking statements and projections. Past performance does not guarantee future results.
//               All financial projections are estimates based on current market conditions and business assumptions.
//             </div>
//           </motion.div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="col-span-2"
//             >
//               <div className="flex items-center space-x-3 mb-6">
//                 <motion.div
//                   whileHover={{ scale: 1.1 }}
//                   className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
//                 >
//                   <TrendingUp className="w-8 h-8" />
//                 </motion.div>
//                 <div>
//                   <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                   <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                 GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
//               </p>
//               <div className="flex space-x-4">
//                 {['Facebook', 'Twitter', 'LinkedIn'].map((platform, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => console.log(platform)}
//                     className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
//                     aria-label={`Visit our ${platform} page`}
//                   >
//                     <span className="font-bold">{platform[0].toLowerCase()}</span>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
//               <ul className="space-y-3">
//                 {['Trading Tools', 'Mobile App', 'API Access', 'Market Data'].map((item, index) => (
//                   <li key={index}>
//                     <motion.button
//                       whileHover={{ x: 5 }}
//                       onClick={() => console.log(item)}
//                       className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
//                     >
//                       {item}
//                     </motion.button>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//               <ul className="space-y-3">
//                 {['Help Center', 'Contact Us', 'Education', 'Community'].map((item, index) => (
//                   <li key={index}>
//                     <motion.button
//                       whileHover={{ x: 5 }}
//                       onClick={() => console.log(item)}
//                       className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
//                     >
//                       {item}
//                     </motion.button>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="border-t border-gray-200 dark:border-gray-800 pt-8"
//           >
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                 © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//               </div>
//             </div>
//             <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
//               <div className="text-sm">
//                 For investment inquiries and detailed financial projections, please contact:
//               </div>
//               <div className="mt-2 font-semibold text-gray-900 dark:text-white">
//                 GimaCapital Investment Team • investment@gimacapital.com
//               </div>
//               <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
//                 This document contains forward-looking statements and projections. Past performance does not guarantee future results.
//                 All financial projections are estimates based on current market conditions and business assumptions.
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ValuationOverview;






import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, Users, Bot, DollarSign, Globe, Server, Database, Smartphone, BarChart3, Shield, Zap, Target, PieChart, ArrowRight, Star, Award, Clock, Briefcase, ChevronRight, Menu, X } from 'lucide-react';

const ValuationOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['overview', 'financials', 'technology', 'market', 'equity'].includes(hash)) { // Added 'equity' to valid hash values
      setActiveTab(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const TabButton = ({ id, label, isActive }) => (
    <Link
      to={id === 'equity' ? '/Equity-structure' : `#${id}`} // Modified: Link to /Equity-structure for equity tab
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full ${
        isActive
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      }`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
    >
      {label}
      <ChevronRight className="w-4 h-4 opacity-75" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-all duration-500">
      <Helmet>
        <title>Valuation Overview - GimaCapital</title>
        <meta name="description" content="Explore GimaCapital's investment valuation, financial metrics, technology assets, and market analysis for our AI-powered trading platform." />
        <meta name="keywords" content="GimaCapital, GimaBlockchain, valuation, AI trading, investment" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GimaCapital",
            "description": "GimaCapital's valuation overview for an AI-driven trading platform powered by GimaBlockchain.",
            "url": "https://www.gimacapital.com"
          })}
        </script>
      </Helmet>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-800/30 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                ></motion.div>
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  GimaCapital
                </span>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">PRO</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/Gima-Live-Stats" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Gima Live Stats
              </Link>
              <Link to="/Equity-structure" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Equity
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <span className="relative z-10">Sign In</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <span className="relative z-10">Get Started</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
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
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    to="/Gima-Live-Stats"
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Gima Live Stats
                  </Link>
                  <Link
                    to="/Equity-structure"
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Equity {/* Fixed: Changed "Investment Structure" to "Equity" for consistency */}
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row max-w-8xl mx-auto pt-24">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] p-6 hidden lg:block">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
            role="tablist"
            aria-orientation="vertical"
          >
            <TabButton id="overview" label="Executive Summary" isActive={activeTab === 'overview'} />
            <TabButton id="financials" label="Financial Metrics" isActive={activeTab === 'financials'} />
            <TabButton id="technology" label="Technology Assets" isActive={activeTab === 'technology'} />
            <TabButton id="market" label="Market Analysis" isActive={activeTab === 'market'} />
            <TabButton id="equity" label="Equity" isActive={activeTab === 'equity'} /> {/* Added: Equity tab for sidebar */}
          </motion.div>
        </aside>

        <main className="flex-1 p-6">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <Briefcase className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Investment Valuation
                </h1>
                <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-2">GimaCapital</div>
              </div>
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              <strong>Early Operational Stage</strong> — Revolutionary AI-powered trading platform ready for user acquisition with proven autonomous intelligence and live operational systems
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 lg:hidden">
              <TabButton id="overview" label="Executive Summary" isActive={activeTab === 'overview'} />
              <TabButton id="financials" label="Financial Metrics" isActive={activeTab === 'financials'} />
              <TabButton id="technology" label="Technology Assets" isActive={activeTab === 'technology'} />
              <TabButton id="market" label="Market Analysis" isActive={activeTab === 'market'} />
              <TabButton id="equity" label="Equity" isActive={activeTab === 'equity'} /> {/* Fixed: Changed "Investment Structure" to "Equity" and reused TabButton for consistency */}
            </div>
          </motion.div>

          {/* Key Metrics Dashboard */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12"
          >
            {[
              { icon: DollarSign, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Based on comparable analysis", tag: "Current", color: "emerald" },
              { icon: Target, label: "Funding Target", value: "$500K", subtext: "Series Seed Round", tag: "Objective", color: "teal" },
              { icon: TrendingUp, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Operational assets + traction", tag: "Valuation", color: "cyan" },
              { icon: Users, label: "Current User Base", value: "Ready", subtext: "Onboarding system live", tag: "Active", color: "emerald" },
            ].map((metric, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
                  <div className={`px-3 py-1 bg-${metric.color}-100 dark:bg-${metric.color}-900 text-${metric.color}-700 dark:text-${metric.color}-300 rounded-full text-sm font-medium`}>
                    {metric.tag}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{metric.label}</div>
                <div className={`text-4xl font-bold text-${metric.color}-600`}>{metric.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{metric.subtext}</div>
                <div className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </motion.div> */}


{/* Key Metrics Dashboard */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12"
>
  {[
    { icon: DollarSign, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Based on comparable analysis", tag: "Current", color: "emerald" },
    { icon: Target, label: "Funding Target", value: "$500K", subtext: "Series Seed Round", tag: "Objective", color: "teal" },
    { icon: TrendingUp, label: "Pre-Money Valuation", value: "$3.2M", subtext: "Operational assets + traction", tag: "Valuation", color: "cyan" },
    { icon: Users, label: "Current User Base", value: "Ready", subtext: "Onboarding system live", tag: "Active", color: "emerald" },
  ].map((metric, index) => (
    <motion.div
      key={index}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Card Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
          <div className={`px-3 py-1 bg-${metric.color}-100 dark:bg-${metric.color}-900 text-${metric.color}-700 dark:text-${metric.color}-300 rounded-full text-sm font-medium`}>
            {metric.tag}
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{metric.label}</div>
        <div className={`text-4xl font-bold text-${metric.color}-600`}>{metric.value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{metric.subtext}</div>
      </div>
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      {/* Tooltip for All Metric Cards */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute -top-24 left-1/2 -translate-x-1/2 bg-${metric.color}-600 text-white rounded-lg p-4 shadow-xl w-64 hidden group-hover:block z-20`}
        >
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className="w-6 h-6 text-white" />
            <div className="text-sm font-semibold">{metric.label}</div>
          </div>
          <div className="text-2xl font-bold mb-1">{metric.value}</div>
          <div className="text-xs">{metric.subtext}</div>
          <div className={`mt-2 px-2 py-1 bg-${metric.color}-700 rounded-full text-xs font-medium inline-block`}>
            {metric.tag}
          </div>
          {/* Tooltip Arrow */}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-${metric.color}-600`} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  ))}
</motion.div>

          {/* Tab Content */}
          <div id="overview" className="scroll-mt-24">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Valuation Justification */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Early Operational Stage Advantage</h2>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-xl border border-emerald-200 dark:border-emerald-700"
                  >
                    <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-3">🚀 Beyond MVP — Operational Systems Live</div>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong>GimaCapital has moved beyond proof-of-concept into early operational stage.</strong> All core technology is operational and ready for user acquisition.
                      We're raising funds to launch user onboarding and scale our proven systems — not to build unproven concepts.
                    </div>
                  </motion.div>
                  <div className="grid lg:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Operational Technology Assets",
                        items: [
                          { asset: "Gima-Alpha AI Engine", value: "$900K", status: "Live & Trading", desc: "Functional autonomous trading system", icon: Bot },
                          { asset: "PAMM Infrastructure", value: "$600K", status: "Operational", desc: "Ready-to-scale fund management", icon: PieChart },
                          { asset: "Trading Platform MVP", value: "$500K", status: "User-Ready", desc: "Full dashboard & execution system", icon: BarChart3 },
                        ],
                        color: "emerald",
                      },
                      {
                        title: "Execution & Traction Metrics",
                        items: [
                          { asset: "Onboarding Infrastructure", value: "Ready", status: "Google Sign-in Live", desc: "Complete user acquisition system", icon: Users },
                          { asset: "Daily Trading Capacity", value: "5K+", status: "AI-Ready Execution", desc: "Proven autonomous performance", icon: DollarSign },
                          { asset: "Website & Platform", value: "100%", status: "Fully Operational", desc: "Complete user experience ready", icon: Globe },
                        ],
                        color: "teal",
                      },
                      {
                        title: "Risk Mitigation Factors",
                        items: [
                          { asset: "Technical Risk", value: "Eliminated", status: "Systems Proven", desc: "All core tech is operational", icon: Zap },
                          { asset: "Team Execution Risk", value: "Low", status: "Track Record", desc: "4-person team delivered live systems", icon: Shield },
                          { asset: "Market Validation", value: "Tech-Ready", status: "Systems Proven", desc: "Infrastructure validated, ready for users", icon: Star },
                        ],
                        color: "cyan",
                      },
                    ].map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                        {section.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-start gap-4 p-5 bg-gradient-to-r from-${section.color}-50 to-${section.color === 'emerald' ? 'teal' : section.color === 'teal' ? 'cyan' : 'emerald'}-50 dark:from-${section.color}-900 dark:to-${section.color === 'emerald' ? 'teal' : section.color === 'teal' ? 'cyan' : 'emerald'}-900 rounded-xl border border-${section.color}-200 dark:border-${section.color}-700`}
                          >
                            <div className={`w-10 h-10 bg-${section.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold text-gray-900 dark:text-white">{item.asset}</div>
                                <div className={`text-lg font-bold text-${section.color}-600`}>{item.value}</div>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.desc}</div>
                              <div className={`px-3 py-1 bg-${section.color}-600 text-white text-xs rounded-full font-medium inline-block`}>
                                ✅ {item.status}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Methodology */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Valuation Methodology</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: PieChart, title: "Comparable Analysis", value: "$2.1M", desc: "Benchmarked against AI trading platforms (3Commas: $40M valuation, Pionex: $100M+) adjusted for stage and traction", color: "emerald" },
                      { icon: TrendingUp, title: "Revenue Multiple", value: "$3.0M", desc: "Projected 12-month revenue of $1.2M × 2.5x early-stage SaaS multiple for recurring revenue model", color: "teal" },
                      { icon: Users, title: "User-Based Valuation", value: "$3.2M", desc: "Infrastructure ready for user acquisition × $1,280 projected user value (based on LTV modeling and market analysis)", color: "cyan" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color === 'emerald' ? 'teal' : item.color === 'teal' ? 'cyan' : 'emerald'}-50 dark:from-${item.color}-900 dark:to-${item.color === 'emerald' ? 'teal' : item.color === 'teal' ? 'cyan' : 'emerald'}-900 rounded-xl border border-${item.color}-200 dark:border-${item.color}-700`}
                      >
                        <div className={`w-12 h-12 bg-${item.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`font-bold text-xl text-${item.color}-800 dark:text-${item.color}-300 mb-3`}>{item.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</div>
                        <div className={`mt-4 text-2xl font-bold text-${item.color}-600`}>{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-xl text-white"
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">Early Operational Stage Valuation</div>
                      <div className="text-4xl font-bold mb-2">$3.2M</div>
                      <div className="text-gray-200">Based on proven operational assets, not projections</div>
                      <div className="mt-4 text-sm text-emerald-200">
                        <strong>Key Advantage:</strong> We're an operational platform seeking capital to scale proven systems,
                        not a startup seeking product-market fit.
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
                  >
                    <div className="text-2xl font-bold mb-2">Early Operational Stage Investment</div>
                    <div className="text-lg mb-4">Series Seed Round • $500K Target • $3.2M Pre-Money Valuation</div>
                    <div className="text-gray-200">
                      <strong>Investment Thesis:</strong> Launch and scale proven operational systems with complete user onboarding infrastructure.
                      All technology validated and ready — funding goes directly to user acquisition and growth.
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                      <Link
                        to="/Equity-structure"
                        className="inline-block bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        View Equity Structure
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          <div id="financials" className="scroll-mt-24">
            {activeTab === 'financials' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Financial Projections & Metrics</h2>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Streams</h3>
                    {[
                      { stream: "PAMM Performance Fees", percentage: "60%", amount: "$720K", desc: "20% of profits from managed funds" },
                      { stream: "Subscription Plans", percentage: "30%", amount: "$360K", desc: "Monthly recurring revenue" },
                      { stream: "Premium Features", percentage: "10%", amount: "$120K", desc: "Advanced analytics & tools" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{item.stream}</span>
                          <span className="text-2xl font-bold text-emerald-600">{item.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.desc}</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: item.percentage }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="bg-emerald-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Monthly Recurring Revenue (MRR)", value: "$30K", color: "emerald" },
                        { label: "Customer Acquisition Cost (CAC)", value: "$15", color: "teal" },
                        { label: "Customer Lifetime Value (LTV)", value: "$450", color: "emerald" },
                        { label: "LTV/CAC Ratio", value: "30:1", color: "teal" },
                      ].map((metric, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <span>{metric.label}</span>
                          <span className={`font-bold text-${metric.color}-600`}>{metric.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          <div id="technology" className="scroll-mt-24">
            {activeTab === 'technology' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Gima-Alpha Deep Dive */}
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 rounded-2xl p-10 shadow-2xl text-white">
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center"
                    >
                      <Bot className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-bold">Gima-Alpha</h2>
                      <div className="text-xl text-gray-200">Autonomous Trading Intelligence Engine</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                      <h3 className="text-2xl font-semibold mb-6 text-emerald-200">Core Capabilities</h3>
                      <div className="space-y-4">
                        {[
                          "Executes 5,000+ micro-trades daily across 50+ crypto pairs",
                          "Real-time market sentiment analysis using NLP",
                          "Dynamic risk management with position sizing algorithms",
                          "Multi-timeframe technical analysis integration",
                          "Automated rebalancing and profit optimization",
                        ].map((capability, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-200">{capability}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <h3 className="text-2xl font-semibold mb-6 text-emerald-200">Technical Architecture</h3>
                      <div className="space-y-4">
                        {[
                          { component: "ML Models", status: "TensorFlow + PyTorch", desc: "Deep learning for pattern recognition" },
                          { component: "Data Pipeline", status: "Real-time streaming", desc: "Sub-second market data processing" },
                          { component: "Execution Engine", status: "Low-latency", desc: "Sub-100ms order execution" },
                          { component: "Risk Management", status: "Multi-layer", desc: "Position limits and stop-loss automation" },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-white">{item.component}</span>
                              <span className="text-sm text-emerald-300">{item.status}</span>
                            </div>
                            <div className="text-sm text-gray-400">{item.desc}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700"
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-emerald-300 mb-2">Performance Metrics (Last 30 Days)</div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <div className="text-3xl font-bold text-emerald-400">+9.3%</div>
                          <div className="text-sm text-gray-400">Average Monthly Return</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-teal-400">0.87</div>
                          <div className="text-sm text-gray-400">Sharpe Ratio</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-cyan-400">4.2%</div>
                          <div className="text-sm text-gray-400">Max Drawdown</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Complete Technology Stack</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { category: "Frontend", tech: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js"], icon: Globe },
                      { category: "Backend", tech: ["Node.js", "Python", "Quart", "PostgreSQL"], icon: Bot },
                      { category: "Infrastructure", tech: ["AWS", "Docker", "Redis", "WebSocket"], icon: Shield },
                      { category: "AI/ML", tech: ["TensorFlow", "Pandas", "NumPy", "Scikit-learn", "OpenAI", "DeepSeek"], icon: Zap },
                      { category: "Web Development", tech: ["Next.js", "React", "Tailwind CSS", "Node.js"], icon: Globe },
                      { category: "Mobile Development", tech: ["Flutter", "React Native", "Dart"], icon: Smartphone },
                      { category: "Blockchain", tech: ["Solidity", "Web3.js", "Stellar"], icon: Link },
                      { category: "DevOps", tech: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions"], icon: Server },
                      { category: "Database", tech: ["Google Datastore", "Google Cloud SQL", "PostgreSQL", "Firestore", "Firebase"], icon: Database },
                      { category: "Cybersecurity", tech: ["Wireshark", "Nmap", "Metasploit", "Burp Suite"], icon: Shield },
                      { category: "Trading", tech: ["CCXT", "Binance API", "bybit API", "WebSocket feeds", "Order management"], icon: BarChart3 },
                      { category: "Security", tech: ["OAuth 2.0", "JWT", "API encryption", "Cold storage"], icon: Shield },
                    ].map((stack, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <stack.icon className="w-6 h-6 text-emerald-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">{stack.category}</h3>
                        </div>
                        <div className="space-y-2">
                          {stack.tech.map((tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 inline-block mr-2 mb-2"
                            >
                              {tech}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div id="market" className="scroll-mt-24">
            {activeTab === 'market' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Market Analysis & Opportunity</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Total Addressable Market</h3>
                      <div className="space-y-4">
                        {[
                          { value: "$3.6T", label: "Global Cryptocurrency Market Cap", color: "emerald" },
                          { value: "$8.2B", label: "Algorithmic Trading Software Market", color: "teal" },
                          { value: "$2.8B", label: "Portfolio Management Solutions", color: "cyan" },
                        ].map((market, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 bg-${market.color}-50 dark:bg-${market.color}-900 rounded-lg border border-${market.color}-200 dark:border-${market.color}-700`}
                          >
                            <div className={`text-2xl font-bold text-${market.color}-600`}>{market.value}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{market.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Competitive Positioning</h3>
                      <div className="space-y-4">
                        {[
                          { competitor: "3Commas", advantage: "Superior AI capabilities", market: "$40M valuation" },
                          { competitor: "Pionex", advantage: "PAMM integration", market: "$100M+ valuation" },
                          { competitor: "Shrimpy", advantage: "Better user experience", market: "Acquired for $20M" },
                          { competitor: "HaasOnline", advantage: "More accessible pricing", market: "Enterprise focused" },
                        ].map((comp, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-900 dark:text-white">{comp.competitor}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">{comp.market}</span>
                            </div>
                            <div className="text-sm text-emerald-600">Our advantage: {comp.advantage}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Growth Strategy */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-2xl p-10 shadow-xl text-white">
                  <h2 className="text-3xl font-bold mb-8">12-Month Growth Strategy</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { phase: "Q1-Q2 2026", focus: "Scale & Optimize", targets: ["5K users", "$50K Monthly Recurring Revenue. MRR", "Advanced AI features"] },
                      { phase: "Q3 2026", focus: "Market Expansion", targets: ["15K users", "$150K Monthly Recurring Revenue. MRR", "International launch"] },
                      { phase: "Q4 2026", focus: "Enterprise & Partnerships", targets: ["25K users", "$250K Monthly Recurring Revenue. MRR", "Institutional clients"] },
                    ].map((phase, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="p-6 bg-white dark:bg-gray-800 bg-opacity-10 rounded-xl backdrop-blur-sm border border-white dark:border-gray-700 border-opacity-20"
                      >
                        <div className="text-lg font-semibold mb-2">{phase.phase}</div>
                        <div className="text-xl font-bold mb-4 text-emerald-200">{phase.focus}</div>
                        <div className="space-y-2">
                          {phase.targets.map((target, targetIndex) => (
                            <motion.div
                              key={targetIndex}
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.3, delay: targetIndex * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <ArrowRight className="w-4 h-4 text-emerald-300" />
                              <span className="text-sm">{target}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Ready to Scale Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 rounded-2xl p-10 shadow-2xl text-white text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to Scale Proven Trading Intelligence?</h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                GimaCapital is beyond the startup risk phase. We have operational systems and proven technology ready for users.
                Join us in launching and scaling the next generation of autonomous trading intelligence.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <div className="font-semibold mb-2 text-gray-800 dark:text-white">Time to Market</div>
                  <div className="text-2xl font-bold text-emerald-600">6 Months</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Full monetization ready</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                  <div className="font-semibold mb-2 text-gray-800 dark:text-white">ROI Projection</div>
                  <div className="text-2xl font-bold text-teal-600">15-25x</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">3-5 year horizon</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Target className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
                  <div className="font-semibold mb-2 text-gray-800 dark:text-white">Market Position</div>
                  <div className="text-2xl font-bold text-cyan-600">Top 10</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">AI trading platforms</div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <div className="text-lg font-semibold text-emerald-300">Early Operational Stage Investment</div>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    {[
                      "<strong>Operational systems:</strong> All technology is live and functional",
                      "<strong>User-ready systems:</strong> Complete onboarding infrastructure operational",
                      "<strong>Technical risk eliminated:</strong> AI trading system operational",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      "<strong>Execution proven:</strong> Team delivered multiple integrated systems",
                      "<strong>Launch-ready:</strong> User acquisition infrastructure operational",
                      "<strong>Scalable foundation:</strong> Infrastructure built for growth",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
              >
                <div className="text-2xl font-bold mb-2">Early Operational Stage Investment</div>
                <div className="text-lg mb-4">Series Seed Round • $500K Target • $3.2M Pre-Money Valuation</div>
                <div className="text-gray-200">
                  <strong>Investment Thesis:</strong> Launch and scale proven operational systems with complete user onboarding infrastructure.
                  All technology validated and ready — funding goes directly to user acquisition and growth.
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                  <Link
                    to="/Equity-structure"
                    className="inline-block bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View Equity Structure
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center text-gray-600 dark:text-gray-300"
          >
            <div className="text-sm">
              For investment inquiries and detailed financial projections, please contact:
            </div>
            <div className="mt-2 font-semibold text-gray-900 dark:text-white">
              GimaCapital Investment Team • investment@gimacapital.com
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              This document contains forward-looking statements and projections. Past performance does not guarantee future results.
              All financial projections are estimates based on current market conditions and business assumptions.
            </div>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                >
                  <TrendingUp className="w-8 h-8" />
                </motion.div>
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
                GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'LinkedIn'].map((platform, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => console.log(platform)}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Visit our ${platform} page`}
                  >
                    <span className="font-bold">{platform[0].toLowerCase()}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                {['Trading Tools', 'Mobile App', 'API Access', 'Market Data'].map((item, index) => (
                  <li key={index}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => console.log(item)}
                      className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {item}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Education', 'Community'].map((item, index) => (
                  <li key={index}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => console.log(item)}
                      className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {item}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border-t border-gray-200 dark:border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
              </div>
            </div>
            <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
              <div className="text-sm">
                For investment inquiries and detailed financial projections, please contact:
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                GimaCapital Investment Team • investment@gimacapital.com
              </div>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                This document contains forward-looking statements and projections. Past performance does not guarantee future results.
                All financial projections are estimates based on current market conditions and business assumptions.
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default ValuationOverview;
