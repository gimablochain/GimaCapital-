// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import { motion } from 'framer-motion';
// import { TrendingUp, Users, Award, ChevronRight, Menu, X } from 'lucide-react';

// const AboutUs = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const team = [
//       {
//       name: "Sarah Chen",
//       role: "CEO & Co-Founder",
//       img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
//       bio: "With over 15 years in fintech, Sarah leads GimaCapital's strategic vision, driving innovation in AI-driven trading."
//     },

//     {
//       name: "Marcus Rodriguez",
//       role: "CTO & Co-Founder",
//       img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
//       bio: "A blockchain pioneer, Marcus architects GimaCapital's cutting-edge trading infrastructure."
//     },
//     {
//       name: "Dr. Elena Kozlov",
//       role: "Head of Quantitative Research",
//       img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
//       bio: "Elena brings her PhD in Machine Learning to develop GimaCapital's proprietary algorithms."
//     }
//   ];

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
//       <Helmet>
//         <title>About GimaCapital - Our Mission & Team</title>
//         <meta name="description" content="Learn about GimaCapital's mission to revolutionize trading with AI and blockchain, and meet our visionary team." />
//         <meta name="keywords" content="GimaCapital, GimaBlockchain, about us, AI trading, team" />
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             "name": "GimaCapital",
//             "description": "GimaCapital, powered by GimaBlockchain, is a leader in AI-driven trading solutions.",
//             "url": "https://www.gimacapital.com"
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
//                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Home 
//               </Link>
//               <Link to="/Gima-Live-Stats" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                Gima Live Stats
//               </Link>
//               <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Pricing
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
//               <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
//                 Home 
//               </Link>
//               <Link
//                 to="/Gima-Live-Stats"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Gima Live Stats
//               </Link>
//               <Link
//                 to="/pricing"
//                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
//                 onClick={toggleMenu}
//               >
//                 Pricing
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
//                 About <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">GimaCapital</span>
//               </h1>
//               <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
//                 GimaCapital, powered by GimaBlockchain, is revolutionizing algorithmic trading with proprietary AI-driven solutions, delivering consistent returns and unmatched security for professional traders worldwide.
//               </p>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
//           <div className="container mx-auto px-6">
//             <div className="text-center mb-20">
//               <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-full px-4 py-2 mb-6">
//                 <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
//                 <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Our Mission</span>
//               </div>
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//                 Empowering Wealth Creation
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                 Our mission is to democratize institutional-grade trading tools, leveraging AI and blockchain to provide secure, high-performance solutions for traders globally.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
//               <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                   To redefine trading by integrating AI and blockchain, creating a transparent, efficient, and secure ecosystem that empowers traders to achieve consistent success.
//                 </p>
//               </div>
//               <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
//                 <ul className="space-y-4 text-gray-600 dark:text-gray-300">
//                   <li className="flex items-start">
//                     <ChevronRight className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
//                     <span>Innovation: Pioneering AI and blockchain solutions.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <ChevronRight className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
//                     <span>Transparency: Clear and honest operations.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <ChevronRight className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
//                     <span>Excellence: Delivering unmatched performance.</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-24 md:py-32">
//           <div className="container mx-auto px-6">
//             <div className="text-center mb-20">
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
//                 Meet the <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Visionaries</span>
//               </h2>
//               <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//                 Our team of experts drives innovation in AI and blockchain trading.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
//               {team.map((member, index) => (
//                 <div key={index} className="group text-center">
//                   <div className="relative mx-auto w-48 h-48 mb-8">
//                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
//                     <img
//                       src={member.img}
//                       alt={member.name}
//                       className="relative w-full h-full rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
//                     />
//                     <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
//                       <Users className="w-8 h-8 text-emerald-600" />
//                     </div>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
//                   <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg mb-2">{member.role}</p>
//                   <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
//                 </div>
//               ))}
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

// export default AboutUs;




import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Award,  Menu, X, 
  Shield, Zap, Globe, Target, Brain, Rocket,
  CheckCircle, Star, ArrowUpRight, Sparkles
} from 'lucide-react';

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const team = [
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

  const stats = [
    { value: "$coming soon+", label: "Assets Under Management", icon: TrendingUp },
    { value: "99.9%", label: "System Uptime", icon: Shield },
    { value: "comming soon+", label: "Active Traders", icon: Users },
    { value: "47%", label: "Average Annual Returns", icon: Award }
  ];

  const values = [
    {
      icon: Brain,
      title: "Innovation Excellence",
      description: "Pioneering cutting-edge AI and blockchain solutions that redefine trading possibilities."
    },
    {
      icon: Shield,
      title: "Uncompromising Security",
      description: "Military-grade encryption and multi-layer security protocols protecting every transaction."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Democratizing institutional-grade trading tools for traders worldwide, 24/7."
    },
    {
      icon: Target,
      title: "Performance Focus",
      description: "Delivering consistent, measurable results through data-driven algorithmic strategies."
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
      {/* Enhanced Navigation */}
      <Helmet>
        <title>About GimaCapital - Revolutionizing AI-Powered Trading | Our Mission & Expert Team</title>
        <meta name="description" content="Discover GimaCapital's mission to revolutionize algorithmic trading with AI and blockchain technology. Meet our world-class team of fintech experts and quantitative researchers." />
        <meta name="keywords" content="GimaCapital, AI trading, blockchain, fintech experts, algorithmic trading, quantitative research" />
      </Helmet>

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-800/30 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  GimaCapital
                </span>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">ENTERPRISE</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-all duration-300 hover:scale-105">
                Home 
              </Link>
              <Link to="/Gima-Live-Stats" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-all duration-300 hover:scale-105">
                Live Analytics
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-all duration-300 hover:scale-105">
                Pricing
              </Link>
            
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">Sign In</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
            
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none p-2">
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
            <div className="flex flex-col space-y-4 mt-6 pb-4">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-semibold py-2">
                Home 
              </Link>
              <Link to="/Gima-Live-Stats" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-semibold py-2">
                Live Analytics
              </Link>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-semibold py-2">
                Pricing
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 text-center mt-4"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </nav>

      <main className="min-h-screen">
        {/* Enhanced Hero Section */}
        <section className="relative pt-32 pb-20 md:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.1),transparent_50%)]"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-emerald-200/50 dark:border-emerald-800/50">
                <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm tracking-wide">PIONEERING THE FUTURE OF TRADING</span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                Redefining{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent relative">
                  Trading Excellence
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-60"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">GimaCapital</span>, 
                powered by <span className="font-bold text-gray-800 dark:text-gray-200">GimaBlockchain</span>, delivers 
                institutional-grade AI-driven trading solutions with unprecedented performance, security, and transparency for elite traders worldwide.
              </p>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3 mx-auto" />
                        <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Mission Section */}
        <section className="py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-emerald-50/50 dark:from-gray-900/80 dark:to-emerald-950/50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-full px-6 py-3 mb-8">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold tracking-wide">OUR MISSION & VISION</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
                Empowering Global 
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Wealth Creation</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                We're democratizing institutional-grade trading excellence through revolutionary AI and blockchain technology, 
                creating unprecedented opportunities for professional traders to achieve consistent, superior returns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 dark:border-gray-700/50 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Our Vision</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    To establish the global standard for AI-powered trading platforms, creating a transparent, 
                    secure, and highly profitable ecosystem that transforms how institutions and professionals 
                    approach algorithmic trading.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 dark:border-gray-700/50 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Core Values</h3>
                  <div className="space-y-4">
                    {['Innovation Excellence', 'Uncompromising Security', 'Performance Transparency', 'Client Success'].map((value, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 border border-white/50 dark:border-gray-700/50 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

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

        {/* Enhanced Footer */}
        <footer className="w-full bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-900 dark:to-slate-950 py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-60"></div>
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">GimaCapital</span>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">by GimaBlockchain</div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md leading-relaxed font-medium">
                  Pioneering the future of institutional-grade AI-powered trading with unmatched performance, 
                  security, and transparency for professional traders worldwide.
                </p>
                <div className="flex space-x-4">
                  {['f', 't', 'in', 'yt'].map((platform, index) => (
                    <button 
                      key={index}
                      className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 text-white font-bold shadow-md"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Platform</h4>
                <ul className="space-y-4">
                  {['AI Trading Tools', 'Mobile App', 'Enterprise API', 'Real-time Analytics'].map((item, index) => (
                    <li key={index}>
                      <button className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Support</h4>
                <ul className="space-y-4">
                  {['24/7 Support', 'Expert Consultation', 'Trading Academy', 'Community Hub'].map((item, index) => (
                    <li key={index}>
                      <button className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0 font-medium">
                  © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved.
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Licensed & Regulated</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AboutUs;