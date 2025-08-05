
// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion } from 'framer-motion';
// import { TrendingUp, Shield, Zap, BarChart3, BarChart2, Target, Users, Award, ChevronRight, Star, Sparkles , CheckCircle, ArrowRight, Globe, Lock, Smartphone, Menu, X, ArrowUpNarrowWideIcon } from 'lucide-react';

// const HeroSection = ({ isVisible, heroRef, images, currentImageIndex, stats }) => (
//   <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24">
//     <div className="absolute inset-0">
//       {images.map((img, index) => (
//         <img
//           key={index}
//           src={img}
//           alt={`GimaCapital trading platform background ${index + 1}`}
//           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
//           loading="lazy"
//         />
//       ))}
//       <div className="absolute inset-0 bg-black/50"></div>
//     </div>
//     <div className="container mx-auto px-6 relative z-10">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
//         transition={{ duration: 0.8 }}
//         className="max-w-6xl mx-auto text-center"
//       >
//         <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
//           <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
//             The Future of
//           </span>
//           <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent relative">
//             Algorithmic Trading
//             <div className="absolute -right-8 -top-4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
//           </span>
//         </h1>
//         <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
//           Powered by GimaBlockchain, GimaCapital delivers <span className="font-semibold text-emerald-400">proprietary AI-powered algorithms</span> for institutional-grade trading with consistent <span className="font-semibold text-teal-400">8-10.2% monthly returns</span> and zero manual intervention.
//         </p>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//               className="group text-center p-6 rounded-2xl bg-slate-900/30 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/50"
//             >
//               <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
//                 {stat.number}
//               </div>
//               <div className="text-white font-semibold mb-1">{stat.label}</div>
//               <div className="text-sm text-slate-400 mb-2">{stat.subtext}</div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   </section>
// );



// const FeaturesSection = () => {
//   const [activeCard, setActiveCard] = useState(null);

//   const features = [
//     {
//       icon: <BarChart2 className="w-6 h-6" />,
//       title: "Real-time Analytics",
//       description: "Proprietary AI-driven market analysis with predictive modeling for precise trading decisions.",
//       highlight: "99.9% Uptime",
//       color: "from-violet-500 to-purple-600",
//       metrics: ["Real-time data", "Predictive modeling", "Sentiment analysis"]
//     },
//     {
//       icon: <Shield className="w-6 h-6" />,
//       title: "Military-Grade Security",
//       description: "Blockchain-backed encryption with cold storage and institutional-grade protection.",
//       highlight: "ISO 27001 Certified",
//       color: "from-emerald-500 to-teal-600",
//       metrics: ["256-bit encryption", "Cold storage", "Zero-trust protocols"]
//     },
//     {
//       icon: <Zap className="w-6 h-6" />,
//       title: "Ultra-Low Latency",
//       description: "Sub-millisecond execution with direct market access and co-location for optimal performance.",
//       highlight: "<0.1ms Response",
//       color: "from-orange-500 to-red-600",
//       metrics: ["Direct market access", "Co-located servers", "Optimized routing"]
//     },
//     {
//       icon: <TrendingUp className="w-6 h-6" />,
//       title: "Proprietary Algorithms",
//       description: "Exclusive AI-powered trading algorithms designed for consistent, high-yield returns.",
//       highlight: "8-10.2% Returns",
//       color: "from-blue-500 to-indigo-600",
//       metrics: ["Automated trading", "High-yield strategies", "Zero intervention"]
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
//       </div>
      
//       {/* Grid Pattern Overlay */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
//       <section id="platform" className="relative py-32">
//         <div className="container mx-auto px-8 max-w-7xl">
//           {/* Header */}
//           <div className="text-center mb-24">
//             <div className="inline-flex items-center space-x-3 bg-slate-900/70 backdrop-blur-xl border border-violet-500/30 rounded-full px-8 py-4 mb-8 shadow-2xl">
//               <Award className="w-5 h-5 text-violet-400" />
//               <span className="text-violet-300 font-medium tracking-wide">Award-Winning Technology</span>
//               <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
//             </div>
            
//             <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
//               Built for{' '}
//               <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
//                 Excellence
//                 <div className="absolute -inset-2 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-pink-400/20 blur-2xl -z-10"></div>
//               </span>
//             </h2>
            
//             <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
//               GimaCapital's proprietary infrastructure, powered by{' '}
//               <span className="text-emerald-400 font-semibold">GimaBlockchain</span>, 
//               delivers unmatched performance and security for professional traders.
//             </p>
//           </div>

//           {/* Features Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className={`group relative bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 xl:p-10 border transition-all duration-700 cursor-pointer transform hover:-translate-y-2 ${
//                   activeCard === index 
//                     ? 'border-emerald-400/50 shadow-2xl shadow-emerald-500/10 scale-[1.02]' 
//                     : 'border-slate-800/50 hover:border-slate-700/70'
//                 }`}
//                 onMouseEnter={() => setActiveCard(index)}
//                 onMouseLeave={() => setActiveCard(null)}
//               >
//                 {/* Gradient Overlay */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}></div>
                
//                 {/* Glowing Border Effect */}
//                 {activeCard === index && (
//                   <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-20 blur-xl transition-opacity duration-500`}></div>
//                 )}
                
//                 <div className="relative z-10">
//                   {/* Header */}
//                   <div className="flex items-start justify-between mb-8">
//                     <div className={`w-18 h-18 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
//                       {feature.icon}
//                       <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-lg opacity-50 -z-10`}></div>
//                     </div>
                    
//                     <div className="text-right">
//                       <div className={`text-xs font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent uppercase tracking-widest px-3 py-1 rounded-full border border-current/20`}>
//                         {feature.highlight}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-2xl xl:text-3xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">
//                     {feature.title}
//                   </h3>
                  
//                   <p className="text-slate-300 leading-relaxed mb-8 text-base xl:text-lg group-hover:text-slate-200 transition-colors duration-300">
//                     {feature.description}
//                   </p>

//                   {/* Metrics */}
//                   <div className="space-y-3 mb-8">
//                     {feature.metrics.map((metric, i) => (
//                       <div 
//                         key={i} 
//                         className={`flex items-center space-x-3 transition-all duration-300 delay-${i * 100}`}
//                       >
//                         <div className="relative">
//                           <CheckCircle className="w-5 h-5 text-emerald-400 relative z-10" />
//                           <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-sm"></div>
//                         </div>
//                         <span className="text-slate-300 font-medium group-hover:text-white transition-colors duration-300">
//                           {metric}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* CTA */}
//                   <div className={`flex items-center text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:translate-x-3 transition-all duration-300`}>
//                     <span className="text-base">Explore capabilities</span>
//                     <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 </div>

//                 {/* Corner Accent */}
//                 <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.color} opacity-10 rounded-tr-3xl transition-opacity duration-500 group-hover:opacity-20`}></div>
//               </div>
//             ))}
//           </div>

//           {/* Bottom CTA */}
//           <div className="text-center mt-20">
//             <button className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1">
//               <span className="text-lg">Start Trading Today</span>
//               <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
//               <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// const LandingPage = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [activeCard, setActiveCard] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const heroRef = useRef(null);

//   const images = [
//     "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
//   ];



//   const images2 = [
//     "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === images2.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 6000);

//     return () => clearInterval(interval);
//   }, [images2.length]);


//   const stats = [
//     { number: "$2.4B+", label: "Trading Volume", subtext: "Monthly" },
//     { number: "150K+", label: "Active Traders", subtext: "Worldwide" },
//     { number: "99.99%", label: "Uptime", subtext: "Guaranteed" },
//     { number: "0.01%", label: "Trading Fees", subtext: "Industry Low" }
//   ];

//   const features = [
//     {
//       icon: <BarChart3 className="w-8 h-8" />,
//       title: "Advanced Analytics",
//       description: "Real-time market data with proprietary charting tools and technical indicators",
//       highlight: "99.9% Uptime"
//     },
//     {
//       icon: <Shield className="w-8 h-8" />,
//       title: "Blockchain Security",
//       description: "GimaBlockchain's encryption, cold storage, and regulatory compliance",
//       highlight: "SOC 2 Certified"
//     },
//     {
//       icon: <Zap className="w-8 h-8" />,
//       title: "Lightning Execution",
//       description: "Sub-millisecond order execution with direct market access",
//       highlight: "<1ms Latency"
//     },
//     {
//       icon: <Smartphone className="w-8 h-8" />,
//       title: "Mobile First",
//       description: "Trade anywhere with our award-winning mobile app",
//       highlight: "4.9★ Rating"
//     }
//   ];

//   const milestones = [
//     {
//       period: "2019",
//       title: "Foundation",
//       details: [
//         "Founded under GimaBlockchain",
//         "Secured $10M Series A funding",
//         "Built proprietary trading infrastructure"
//       ]
//     },
//     {
//       period: "2020-2021",
//       title: "Rapid Growth",
//       details: [
//         "Reached 10K+ active users",
//         "Launched mobile trading app",
//         "Expanded to European markets"
//       ]
//     },
//     {
//       period: "2022-2023",
//       title: "Market Leader",
//       details: [
//         "100K+ traders milestone",
//         "Advanced AI trading tools",
//         "Institutional partnerships"
//       ]
//     },
//     {
//       period: "2024-2025",
//       title: "Global Expansion",
//       details: [
//         "Multi-region compliance",
//         "Blockchain-based DeFi integration",
//         "Next-gen proprietary algorithms"
//       ]
//     }
//   ];

//   const team = [
//     {
//       name: "Sarah Chen",
//       role: "CEO & Co-Founder",
//       img: "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=400&h=400&fit=crop&crop=face"
//     },
//     {
//       name: "Marcus Rodriguez",
//       role: "CTO & Co-Founder",
//       img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
//     },
//     {
//       name: "Dr. Elena Kozlov",
//       role: "Head of Quantitative Research",
//       img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
//     }
//   ];

//   const testimonials = [
//     {
//       name: "David Park",
//       role: "Hedge Fund Manager",
//       company: "Meridian Capital",
//       content: "GimaCapital's proprietary algorithms and execution speed have transformed our trading operations.",
//       rating: 5
//     },
//     {
//       name: "Lisa Thompson",
//       role: "Independent Trader",
//       company: "Thompson Trading LLC",
//       content: "GimaCapital's AI-driven platform delivers consistent returns with unmatched reliability.",
//       rating: 5
//     }
//   ];

//   useEffect(() => {
//     setIsVisible(true);
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 6000);

//     return () => clearInterval(interval);
//   }, [images.length]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
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
//               <a href="#platform" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Platform
//               </a>
//               <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Pricing
//               </a>
//               <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 About
//               </a>

//               <div className="flex items-center space-x-6">

//                 <Link
//                   to="/login"
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Sign In</span>
//                   <ArrowUpNarrowWideIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </Link>

//                 <Link
//                   to="/register"
//                   className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//                 >
//                   <span className="relative z-10">Get Started</span>
//                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
//               <a
//                 href="#platform"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Platform
//               </a>
//               <a
//                 href="#pricing"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Pricing
//               </a>
//               <a
//                 href="#about"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 About
//               </a>
//               <button
//                 className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 text-left"
//                 onClick={toggleMenu}
//               >
//                 Get Started
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </nav>

//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
//         <Helmet>
//           <title>GimaCapital - AI-Powered Trading by GimaBlockchain</title>
//           <meta name="description" content="GimaCapital, powered by GimaBlockchain, offers proprietary AI-powered algorithms for institutional-grade trading with 8-10.2% monthly returns and zero manual intervention." />
//           <meta name="keywords" content="GimaCapital, GimaBlockchain, algorithmic trading, AI trading, private algorithms, institutional trading" />
//           <script type="application/ld+json">
//             {JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "Product",
//               "name": "GimaCapital",
//               "description": "Professional trading platform with proprietary AI-powered algorithms, powered by GimaBlockchain.",
//               "brand": {
//                 "@type": "Brand",
//                 "name": "GimaCapital by GimaBlockchain"
//               }
//             })}
//           </script>
//         </Helmet>


//         <main>
//           <HeroSection isVisible={isVisible} heroRef={heroRef} images={images} currentImageIndex={currentImageIndex} stats={stats} />
//           <FeaturesSection setActiveCard={setActiveCard} />
//         </main>

//         <div className="container mx-auto px-6">
//           <div className="relative max-w-6xl mx-auto">
//             <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 z-10"></div>
//               <div className="aspect-w-16 aspect-h-9 h-[500px] overflow-hidden">
//                 {images2.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Trading platform demo ${index + 1}`}
//                     className={`w-full h-full object-cover transition-all duration-1000 ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 absolute top-0 left-0'
//                       }`}
//                   />
//                 ))}
//               </div>


//               <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
//                 {images2.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
//                         ? 'bg-white w-8'
//                         : 'bg-white/50 hover:bg-white/75'
//                       }`}
//                   />
//                 ))}
//               </div>

//               <div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 dark:border-slate-700/20 z-20">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Live Performance</span>
//                 </div>
//                 <div className="text-2xl font-bold text-green-500">+9.2%</div>
//                 <div className="text-sm text-slate-500">This Month</div>
//               </div>
//             </div>
//           </div>
//         </div>




//         {/* AI Bot Section */}
//         <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
//           <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 opacity-20"></div>

//           <div className="container mx-auto px-6 relative z-10">
//             <div className="max-w-6xl mx-auto">
//               <div className="text-center mb-16">
//                 <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full border border-emerald-200 dark:border-emerald-800 mb-6">
//                   <Target className="w-4 h-4 text-emerald-500 mr-2" />
//                   <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
//                     AI-Powered Trading Engine
//                   </span>
//                 </div>

//                 <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
//                   Meet <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Gima-Alpha </span>
//                 </h2>
//                 <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
//                   Our flagship algorithmic trading system that executes thousands of micro-trades per day,
//                   delivering consistent returns while you sleep.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                 <div className="relative">
//                   <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
//                   <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">

//                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4 shadow-lg">
//                       <TrendingUp className="w-7 h-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
//                         Gima-Alpha
//                       </h3>
//                       <p className="text-emerald-600 dark:text-emerald-400 font-medium">
//                         Autonomous Trading System
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
      
 
 

//               <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
//                 <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-400/10 blur-3xl"></div>
//                 <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-3xl"></div>

//                 <div className="container mx-auto px-6 py-20 relative z-10">
//                   <div className="max-w-5xl mx-auto text-center">
//                     <div className={`inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
//                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                       <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Live Trading Platform • 99.9% Uptime</span>
//                     </div>

//                     <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//                       <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
//                         Trade Like a
//                       </span>
//                       <br />
//                       <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
//                         Professional
//                       </span>
//                     </h1>

//                     <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//                       GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with institutional-grade tools and lightning-fast execution. <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Join 150,000+ professionals</span>.
//                     </p>

//                     <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//                       <button className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2">
//                         <span>Start Trading Now</span>
//                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                       </button>
//                       <button className="group bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 flex items-center space-x-2">
//                         <span>Watch Demo</span>
//                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
//                       </button>
//                     </div>

//                     <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//                       {stats.map((stat, index) => (
//                         <div key={index} className="text-center group">
//                           <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
//                             {stat.number}
//                           </div>
//                           <div className="text-gray-900 dark:text-white font-semibold">{stat.label}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400">{stat.subtext}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section id="features" className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//                 <div className="container mx-auto px-6">
//                   <div className="text-center mb-20">
//                     <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-full px-4 py-2 mb-6">
//                       <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
//                       <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Award-Winning Platform</span>
//                     </div>
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//                       Built for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Performance</span>
//                     </h2>
//                     <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                       GimaCapital's proprietary tools, powered by GimaBlockchain, are trusted by professionals worldwide.
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
//                     {features.map((feature, index) => (
//                       <div
//                         key={index}
//                         className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
//                       >
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>

//                         <div className="relative z-10">
//                           <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
//                             {feature.icon}
//                           </div>

//                           <div className="mb-4">
//                             <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
//                               {feature.highlight}
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
//                             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
//                           </div>

//                           <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
//                             <span className="text-sm">Learn more</span>
//                             <ChevronRight className="w-4 h-4 ml-1" />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//                     {testimonials.map((testimonial, index) => (
//                       <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
//                         <div className="flex items-center mb-4">
//                           {[...Array(testimonial.rating)].map((_, i) => (
//                             <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                           ))}
//                         </div>
//                         <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
//                           "{testimonial.content}"
//                         </p>
//                         <div className="flex items-center">
//                           <div>
//                             <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
//                             <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.company}</div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               <section className="py-24 md:py-32">
//                 <div className="container mx-auto px-6">
//                   <div className="text-center mb-20">
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//                       Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Journey</span>
//                     </h2>
//                     <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                       From inception under GimaBlockchain to global leader in AI-driven trading.
//                     </p>
//                   </div>

//                   <div className="overflow-x-auto pb-8">
//                     <div className="flex gap-8 w-max px-4 min-w-full justify-center">
//                       {milestones.map((milestone, index) => (
//                         <div
//                           key={index}
//                           className="min-w-[320px] bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
//                         >
//                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

//                           <div className="flex items-center mb-6">
//                             <div className="w-4 h-4 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
//                             <h4 className="text-sm uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
//                               {milestone.period}
//                             </h4>
//                           </div>

//                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{milestone.title}</h3>

//                           <ul className="space-y-4">
//                             {milestone.details.map((point, i) => (
//                               <li key={i} className="flex items-start group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${i * 100}ms` }}>
//                                 <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
//                                 <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{point}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//                 <div className="container mx-auto px-6">
//                   <div className="text-center mb-20">
//                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//                       Meet the <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Visionaries</span>
//                     </h2>
//                     <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                       The team behind GimaCapital, driving innovation in AI and blockchain trading.
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
//                     {team.map((member, index) => (
//                       <div
//                         key={index}
//                         className="group text-center"
//                       >
//                         <div className="relative mx-auto w-48 h-48 mb-8">
//                           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
//                           <img
//                             src={member.img}
//                             alt={member.name}
//                             className="relative w-full h-full rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
//                           />
//                           <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
//                             <Users className="w-8 h-8 text-emerald-600" />
//                           </div>
//                         </div>

//                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
//                         <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">{member.role}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               <section className="relative py-24 md:py-32 overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
//                 <div className="absolute inset-0 bg-black/20"></div>
//                 <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
//                 <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>

//                 <div className="container mx-auto px-6 text-center relative z-10">
//                   <div className="max-w-4xl mx-auto">
//                     <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
//                       Ready to Transform Your Trading?
//                     </h2>
//                     <p className="text-xl md:text-2xl text-emerald-100 mb-12 leading-relaxed">
//                       Experience GimaCapital's proprietary AI algorithms, powered by GimaBlockchain. Start with a free account.
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//                       <button className="group bg-white text-emerald-600 hover:bg-gray-50 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 flex items-center space-x-3">
//                         <span>Create Free Account</span>
//                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                       </button>
//                       <button className="group border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 flex items-center space-x-3">
//                         <Globe className="w-5 h-5" />
//                         <span>Explore Global Markets</span>
//                       </button>
//                     </div>

//                     <div className="flex items-center justify-center space-x-8 mt-12 text-emerald-100">
//                       <div className="flex items-center space-x-2">
//                         <Lock className="w-5 h-5" />
//                         <span>Blockchain Security</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Shield className="w-5 h-5" />
//                         <span>Regulated Platform</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <CheckCircle className="w-5 h-5" />
//                         <span>No Hidden Fees</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
//                 <div className="container mx-auto px-6">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//                     <div className="col-span-2">
//                       <div className="flex items-center space-x-3 mb-6">
//                         <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
//                           <TrendingUp className="w-8 h-8" />
//                         </div>
//                         <div>
//                           <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
//                           <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
//                         </div>
//                       </div>
//                       <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
//                         GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
//                       </p>
//                       <div className="flex space-x-4">
//                         <button onClick={() => console.log("Facebook")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                           <span className="font-bold">f</span>
//                         </button>
//                         <button onClick={() => console.log("Twitter")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                           <span className="font-bold">t</span>
//                         </button>
//                         <button onClick={() => console.log("LinkedIn")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
//                           <span className="font-bold">in</span>
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
//                       <ul className="space-y-3">
//                         <li><button onClick={() => console.log("Trading Tools")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Trading Tools</button></li>
//                         <li><button onClick={() => console.log("Mobile App")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Mobile App</button></li>
//                         <li><button onClick={() => console.log("API Access")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">API Access</button></li>
//                         <li><button onClick={() => console.log("Market Data")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Market Data</button></li>
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
//                       <ul className="space-y-3">
//                         <li><button onClick={() => console.log("Help Center")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</button></li>
//                         <li><button onClick={() => console.log("Contact Us")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</button></li>
//                         <li><button onClick={() => console.log("Education")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Education</button></li>
//                         <li><button onClick={() => console.log("Community")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Community</button></li>
//                       </ul>
//                     </div>
//                    </div>

//                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
//                     <div className="flex flex-col md:flex-row justify-between items-center">
//                       <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
//                         © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </footer>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;


















import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TrendingUp, Shield, Zap, BarChart3, BarChart2, Target, Users, Award, ChevronRight, Star, Sparkles, CheckCircle, ArrowRight, Globe, Lock, Smartphone, Menu, X } from 'lucide-react';

// HeroSection Component
const HeroSection = ({ isVisible, heroRef, images, currentImageIndex, stats }) => (
  <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24">
    <div className="absolute inset-0">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`GimaCapital trading platform background ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      ))}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
          <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
            The Future of
          </span>
          <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent relative">
            Algorithmic Trading
            <div className="absolute -right-8 -top-4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
          Powered by GimaBlockchain, GimaCapital delivers <span className="font-semibold text-emerald-400">proprietary AI-powered algorithms</span> for institutional-grade trading with consistent <span className="font-semibold text-teal-400">8-10.2% monthly returns</span> and zero manual intervention.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group text-center p-6 rounded-2xl bg-slate-900/30 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/50"
            >
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-slate-400 mb-2">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// FeaturesSection Component
const FeaturesSection = () => {
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Proprietary AI-driven market analysis with predictive modeling for precise trading decisions.",
    
      color: "from-violet-500 to-purple-600",
      metrics: ["Real-time data", "Predictive modeling", "Sentiment analysis"]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Military-Grade Security",
      description: "Blockchain-backed encryption with cold storage and institutional-grade protection.",
      highlight: "ISO 27001 Certified",
      color: "from-emerald-500 to-teal-600",
      metrics: ["256-bit encryption", "Cold storage", "Zero-trust protocols"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Ultra-Low Latency",
      description: "Sub-millisecond execution with direct market access and co-location for optimal performance.",
      highlight: "<0.1ms Response",
      color: "from-orange-500 to-red-600",
      metrics: ["Direct market access", "Co-located servers", "Optimized routing"]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Proprietary Algorithms",
      description: "Exclusive AI-powered trading algorithms designed for consistent, high-yield returns.",
      highlight: "8-10.2% Returns",
      color: "from-blue-500 to-indigo-600",
      metrics: ["Automated trading", "High-yield strategies", "Zero intervention"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      <section id="platform" className="relative py-32">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 bg-slate-900/70 backdrop-blur-xl border border-violet-500/30 rounded-full px-8 py-4 mb-8 shadow-2xl">
              <Award className="w-5 h-5 text-violet-400" />
              <span className="text-violet-300 font-medium tracking-wide">Award-Winning Technology</span>
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
              Built for{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                Excellence
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-pink-400/20 blur-2xl -z-10"></div>
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
              GimaCapital's proprietary infrastructure, powered by{' '}
              <span className="text-emerald-400 font-semibold">GimaBlockchain</span>, 
              delivers unmatched performance and security for professional traders.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 xl:p-10 border transition-all duration-700 cursor-pointer transform hover:-translate-y-2 ${
                  activeCard === index 
                    ? 'border-emerald-400/50 shadow-2xl shadow-emerald-500/10 scale-[1.02]' 
                    : 'border-slate-800/50 hover:border-slate-700/70'
                }`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}></div>
                {activeCard === index && (
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-20 blur-xl transition-opacity duration-500`}></div>
                )}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-18 h-18 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                      {feature.icon}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-lg opacity-50 -z-10`}></div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent uppercase tracking-widest px-3 py-1 rounded-full border border-current/20`}>
                        {feature.highlight}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl xl:text-3xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-8 text-base xl:text-lg group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {feature.metrics.map((metric, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center space-x-3 transition-all duration-300 delay-${i * 100}`}
                      >
                        <div className="relative">
                          <CheckCircle className="w-5 h-5 text-emerald-400 relative z-10" />
                          <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-sm"></div>
                        </div>
                        <span className="text-slate-300 font-medium group-hover:text-white transition-colors duration-300">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`flex items-center text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:translate-x-3 transition-all duration-300`}>
                    <span className="text-base">Explore capabilities</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.color} opacity-10 rounded-tr-3xl transition-opacity duration-500 group-hover:opacity-20`}></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-20">
            <button className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-lg">Start Trading Today</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// LandingPage Component
const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);

  const images = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"

  ];

  const stats = [
    { number: "	~$12 T+", label: "Trading Volume", subtext: "Monthly" },
    { number: "stat", label: "Active Traders", subtext: "Worldwide" },
    { number: "99.99%", label: "Uptime", subtext: "Guaranteed" },
    { number: "0.01%", label: "Trading Fees", subtext: "Industry Low" }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Real-time market data with proprietary charting tools and technical indicators",
      highlight: "99.9% Uptime"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Security",
      description: "GimaBlockchain's encryption, cold storage, and regulatory compliance",
      highlight: "SOC 2 Certified"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Execution",
      description: "Sub-millisecond order execution with direct market access",
      highlight: "<1ms Latency"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile First",
      description: "Trade anywhere with our award-winning mobile app",
      highlight: "4.9★ Rating"
    }
  ];

  const milestones = [
    {
      period: "2020",
      title: "Foundation",
      details: [
        "Founded under GimaBlockchain",
        "Secured $25k Series A funding",
        "Built proprietary trading infrastructure"
      ]
    },
    {
      period: "2020-2021",
      title: "Rapid Growth",
      details: [
        "Reached 10K+ active users",
        "Launched p2p trading app",
        "Expanded to European markets"
      ]
    },
    {
      period: "2022-2023",
      title: "Market Leader",
      details: [
        "1K+ traders milestone",
        "Advanced AI trading tools",
        "Institutional partnerships"
      ]
    },
    {
      period: "2024-2025",
      title: "Global Expansion",
      details: [
        "Multi-region compliance",
        "Blockchain-based DeFi integration",
        "Next-gen proprietary algorithms"
      ]
    }
  ];

  const team = [
    // {
    //   name: "Sarah Chen",
    //   role: "CEO & Co-Founder",
    //   img: "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=400&h=400&fit=crop&crop=face"
    // },
    // {
    //   name: "Marcus Rodriguez",
    //   role: "CTO & Co-Founder",
    //   img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    // },
    // {
    //   name: "Dr. Elena Kozlov",
    //   role: "Head of Quantitative Research",
    //   img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    // }

     {
      name: "Gideon Gideon",
      role: "CEO & Chief Visionary",
      // img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      bio: "Current chairman of GimaBlockchain with 10+ years leading fintech innovation. pioneer in AI-driven algorithmic trading systems.",
      specialties: ["Strategic Leadership", "Fintech Innovation", "Blockchain Technology", "System Architecture"],
      linkedin: "#"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Blockchain Architect",
      // img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Ex-Google engineer and blockchain pioneer. MIT Computer Science PhD, architect of enterprise-grade trading infrastructure.",
      specialties: ["Blockchain Technology", "System Architecture", "AI/ML Engineering"],
      linkedin: "#"
    },
    {
      name: "Dr. Elena Kozlov",
      role: "Head of Quantitative Research",
      // img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Former Renaissance Technologies quant researcher. PhD Machine Learning from Cambridge, creator of proprietary trading algorithms.",
      specialties: ["Quantitative Analysis", "Machine Learning", "Risk Management"],
      linkedin: "#"
    }
  ];

  const testimonials = [
    {
      name: "David Park",
      role: "Hedge Fund Manager",
      company: "Meridian Capital",
      content: "GimaCapital's proprietary algorithms and execution speed have transformed our trading operations.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Independent Trader",
      company: "Thompson Trading LLC",
      content: "GimaCapital's AI-driven platform delivers consistent returns with unmatched reliability.",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    rtl: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
      <Helmet>
        <title>GimaCapital - AI-Powered Trading by GimaBlockchain</title>
        <meta name="description" content="GimaCapital, powered by GimaBlockchain, offers proprietary AI-powered algorithms for institutional-grade trading with 8-10.2% monthly returns and zero manual intervention." />
        <meta name="keywords" content="GimaCapital, GimaBlockchain, algorithmic trading, AI trading, private algorithms, institutional trading" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "GimaCapital",
            "description": "Professional trading platform with proprietary AI-powered algorithms, powered by GimaBlockchain.",
            "brand": {
              "@type": "Brand",
              "name": "GimaCapital by GimaBlockchain"
            }
          })}
        </script>
      </Helmet>

      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
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
              <Link to="/ValuationOverview" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Valuation
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
               contact
              </Link>
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/register"
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none">
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
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
                to="/ValuationOverview"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Valuation
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
               contact
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
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <HeroSection isVisible={isVisible} heroRef={heroRef} images={images} currentImageIndex={currentImageIndex} stats={stats} />
        <FeaturesSection />

        <div className="container mx-auto px-6">
          <div className="relative max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 z-10"></div>
              <div className="aspect-w-16 aspect-h-9 h-[500px] overflow-hidden">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Trading platform demo ${index + 1}`}
                    className={`w-full h-full object-cover transition-all duration-1000 ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 absolute top-0 left-0'}`}
                  />
                ))}
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`}
                  />
                ))}
              </div>
              <div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 dark:border-slate-700/20 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Live Performance</span>
                </div>
                <div className="text-2xl font-bold text-green-500">+9.2%</div>
                <div className="text-sm text-slate-500">This Month</div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 opacity-20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full border border-emerald-200 dark:border-emerald-800 mb-6">
                  <Target className="w-4 h-4 text-emerald-500 mr-2" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    AI-Powered Trading Engine
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                  Meet <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Gima-Alpha</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                  Our flagship algorithmic trading system that executes thousands of micro-trades per day,
                  delivering consistent returns while you sleep.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
                  <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4 shadow-lg">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Gima-Alpha</h3>
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">Autonomous Trading System</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-full px-4 py-2 mb-6">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Award-Winning Platform</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Built for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Performance</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                GimaCapital's proprietary tools, powered by GimaBlockchain, are trusted by professionals worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        {feature.highlight}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="journey" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From inception under GimaBlockchain to global leader in AI-driven trading.
              </p>
            </div>
            <Slider {...carouselSettings}>
              {milestones.map((milestone, index) => (
                <div key={index} className="px-4">
                  <div className="min-w-[320px] bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                    <div className="flex items-center mb-6">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
                      <h4 className="text-sm uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
                        {milestone.period}
                      </h4>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{milestone.title}</h3>
                    <ul className="space-y-4">
                      {milestone.details.map((point, i) => (
                        <li key={i} className="flex items-start group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${i * 100}ms` }}>
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Meet the <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Visionaries</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The team behind GimaCapital, driving innovation in AI and blockchain trading.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="group text-center">
                  <div className="relative mx-auto w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                    <img
                      src={member.img}
                      alt={member.name}
                      className="relative w-full h-full rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}


            {/* Enhanced Team Section */}
                <section className="py-24 md:py-32 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-gray-950 dark:to-slate-900"></div>
                  <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                      <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
                        Meet Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">World-Class Team</span>
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                        Industry veterans and visionary leaders driving the next generation of AI-powered trading innovation.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                      {team.map((member, index) => (
                        <div key={index} className="group text-center relative">
                          <div className="relative mx-auto w-64 h-64 mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-700 shadow-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                            <img
                              src={member.img}
                              alt={member.name}
                              className="relative w-full h-full rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700 border-4 border-white dark:border-gray-800"
                            />
                            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-emerald-500/20">
                              <Users className="w-10 h-10 text-emerald-600" />
                            </div>
                          </div>
                          
                          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{member.name}</h3>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">{member.role}</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">{member.bio}</p>
                            
                            <div className="space-y-2 mb-6">
                              <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Specialties:</div>
                              <div className="flex flex-wrap gap-2 justify-center">
                                {member.specialties.map((specialty, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
        

        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-xl md:text-2xl text-emerald-100 mb-12 leading-relaxed">
                Experience GimaCapital's proprietary AI algorithms, powered by GimaBlockchain. Start with a free account.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register" className="group bg-white text-emerald-600 hover:bg-gray-50 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 flex items-center space-x-3">
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 flex items-center space-x-3">
                  <Globe className="w-5 h-5" />
                  <span>Explore Global Markets</span>
                </button>
              </div>
              <div className="flex items-center justify-center space-x-8 mt-12 text-emerald-100">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Blockchain Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Regulated Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">GimaCapital</span>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">by GimaBlockchain</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
                  GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance and security.
                </p>
                <div className="flex space-x-4">
                  <button onClick={() => console.log("Facebook")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                    <span className="font-bold">f</span>
                  </button>
                  <button onClick={() => console.log("Twitter")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                    <span className="font-bold">t</span>
                  </button>
                  <button onClick={() => console.log("LinkedIn")} className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                    <span className="font-bold">in</span>
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => console.log("Trading Tools")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Trading Tools</button></li>
                  <li><button onClick={() => console.log("Mobile App")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Mobile App</button></li>
                  <li><button onClick={() => console.log("API Access")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">API Access</button></li>
                  <li><button onClick={() => console.log("Market Data")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Market Data</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><button onClick={() => console.log("Help Center")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</button></li>
                  <li><button onClick={() => console.log("Contact Us")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</button></li>
                  <li><button onClick={() => console.log("Education")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Education</button></li>
                  <li><button onClick={() => console.log("Community")} className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Community</button></li>
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

export default LandingPage;
