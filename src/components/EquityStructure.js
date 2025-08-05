import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestmentButton } from './InvestmentPaymentSystem';
import { DollarSign, PieChart, Sparkles, Users, Briefcase, ChevronRight, Menu, X, TrendingUp, CheckCircle, Star, Zap, Shield, Target, Award, Globe } from 'lucide-react';

const InvestmentStructure = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);


  useEffect(() => {
    setIsVisible(true);
  }, []);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const investmentData = useMemo(() => [
    {
      category: 'Lead Investor',
      percentage: '8%',
      amount: '$250K',
      description: 'Primary investor leading the round, providing strategic guidance and industry connections.',
      color: 'emerald',
      icon: Target,
      benefits: ['Board seat', 'Strategic advisory', 'Network access', 'Due diligence support'],
      minInvestment: '$250,000',
      maxInvestors: 1
    },
    {
      category: 'Strategic Investors',
      percentage: '4%',
      amount: '$125K',
      description: 'Institutional or corporate investors with expertise in fintech or AI, contributing to platform growth.',
      color: 'teal',
      icon: Shield,
      benefits: ['Industry expertise', 'Partnership opportunities', 'Market validation', 'Scaling support'],
      minInvestment: '$50,000',
      maxInvestors: 3
    },
    {
      category: 'Angel Investors',
      percentage: '3.5%',
      amount: '$100K',
      description: 'High-net-worth individuals supporting early-stage growth with capital and mentorship.',
      color: 'cyan',
      icon: Star,
      benefits: ['Mentorship access', 'Industry connections', 'Experience sharing', 'Growth guidance'],
      minInvestment: '$25,000',
      maxInvestors: 5
    },
    {
      category: 'Crowdfunding/Other',
      percentage: '1.5%',
      amount: '$25K',
      description: 'Smaller investments via regulated crowdfunding or other accredited investors.',
      color: 'blue',
      icon: Globe,
      benefits: ['Community building', 'Market validation', 'Brand advocacy', 'User acquisition'],
      minInvestment: '$5,000',
      maxInvestors: 20
    }
  ], []);

  const milestones = [
    { phase: 'Q1 2026', title: 'Platform Enhancement', progress: 100, description: 'Complete AI optimization and user interface improvements' },
    { phase: 'Q2 2026', title: 'Market Expansion', progress: 60, description: 'Launch in 3 new markets with regulatory compliance' },
    { phase: 'Q3 2026', title: 'Feature Launch', progress: 30, description: 'Release advanced trading algorithms and mobile app' },
    { phase: 'Q4 2026', title: 'Scale Operations', progress: 10, description: 'Achieve 10,000+ active users and $2M ARR' }
  ];

  const totalEquityOffered = useMemo(() => investmentData.reduce((sum, item) => sum + parseFloat(item.percentage), 0), [investmentData]);
  const postMoneyValuation = useMemo(() => (3.2e6 + 500e3).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), []);



    const investmentMetrics = [
    { 
      icon: DollarSign, 
      value: '$500K', 
      label: 'Funding Target', 
      color: 'emerald', 
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50/80 via-emerald-100/40 to-transparent',
      darkBgGradient: 'from-emerald-900/30 via-emerald-800/20 to-transparent',
      description: 'Strategic capital for market expansion',
      accent: 'emerald-400'
    },
    { 
      icon: PieChart, 
      value: `${totalEquityOffered}%`, 
      label: 'Total Equity Offered', 
      color: 'teal', 
      gradient: 'from-teal-500 via-teal-600 to-teal-700',
      bgGradient: 'from-teal-50/80 via-teal-100/40 to-transparent',
      darkBgGradient: 'from-teal-900/30 via-teal-800/20 to-transparent',
      description: 'Optimized ownership structure',
      accent: 'teal-400'
    },
    { 
      icon: TrendingUp, 
      value: postMoneyValuation, 
      label: 'Post-Money Valuation', 
      color: 'cyan', 
      gradient: 'from-cyan-500 via-cyan-600 to-cyan-700',
      bgGradient: 'from-cyan-50/80 via-cyan-100/40 to-transparent',
      darkBgGradient: 'from-cyan-900/30 via-cyan-800/20 to-transparent',
      description: 'Premium market positioning',
      accent: 'cyan-400'
    }
  ];


  const chartConfig = useMemo(() => ({
    type: 'doughnut',
    data: {
      labels: investmentData.map(item => item.category),
      datasets: [
        {
          data: investmentData.map(item => parseFloat(item.percentage)),
          backgroundColor: ['#10B981', '#14B8A6', '#06B6D4', '#3B82F6'],
          borderColor: ['#059669', '#0D9488', '#0891B2', '#2563EB'],
          borderWidth: 3,
          hoverOffset: 20
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          borderColor: '#10B981',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}% (${investmentData[context.dataIndex].amount})`
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 2000
      }
    }
  }), [investmentData]);

  useEffect(() => {
    let chartInstance = null;
    const loadChart = async () => {
      const { default: Chart } = await import('chart.js/auto');
      if (chartRef.current) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstance = new Chart(chartRef.current, chartConfig);
        chartInstanceRef.current = chartInstance;
      }
    };

    loadChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartConfig]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl"></div>
      </div>

      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-800/50 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 blur-lg opacity-30 -z-10"></div>
              </motion.div>
              <div>
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  GimaCapital
                </span>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">SERIES SEED</div>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Gima Live Stats', path: '/gima-live-stats' },
                { name: 'Valuation Overview', path: '/ValuationOverview' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link
                    to={item.path}
                    className="relative text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-all duration-300 text-sm group"
                  >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-semibold text-sm overflow-hidden"
                  >
                    <span className="relative z-10">Sign In</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="lg:hidden flex items-center">
              <motion.button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-gray-300 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden"
              >
                <motion.div
                  className="flex flex-col space-y-4 mt-6 pb-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { name: 'Gima Live Stats', path: '/Gima-Live-Stats' },
                    { name: 'Home', path: '/' },
                    { name: 'Pricing', path: '/pricing' },
                    { name: 'About', path: '/about' },
                    { name: 'Contact', path: '/contact' },
                  ].map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Link
                        to={item.path}
                        className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-sm border-l-2 border-transparent hover:border-emerald-500 pl-4"
                        onClick={toggleMenu}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

   

 



 <div className="container mx-auto pt-32 px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-cyan-400/20 via-teal-400/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-300/5 via-teal-300/5 to-transparent rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className={`text-center mb-20 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-12">
          <div className="relative group order-1 sm:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-110"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl ring-2 ring-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Briefcase className="w-12 h-12 text-white drop-shadow-lg" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-left order-2 sm:order-2">
            <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight leading-none mb-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
                Investment
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent relative">
                Structure
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
              </span>
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
              <div className="text-xl sm:text-2xl font-sans font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
                GimaCapital Series Seed
              </div>
              <Award className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Enhanced Info Card */}
        <div className="max-w-5xl mx-auto mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-2xl rounded-3xl"></div>
          <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/30 dark:border-gray-700/30">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-60"></div>
            </div>
            
            <div className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 sm:gap-8 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-emerald-600" />
                  <span className="font-black text-3xl sm:text-4xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    $500K Funding Target
                  </span>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-teal-600" />
                  <span className="font-black text-3xl sm:text-4xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 bg-clip-text text-transparent">
                    $3.2M Pre-Money
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                Pioneering the future of AI-powered trading
              </span>{' '}
              with institutional-grade technology and unprecedented market opportunities in the next-generation fintech ecosystem.
            </div>
          </div>
        </div>
      </div>

      {/* Sophisticated Investment Overview */}
      <div className="mb-20 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10 p-12 sm:p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                Investment Overview
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Strategic investment structure designed for optimal growth and value creation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {investmentMetrics.map((item, index) => {
                const IconComponent = item.icon;
                const isHovered = hoveredCard === index;
                
                return (
                  <div
                    key={index}
                    className={`relative group cursor-pointer transition-all duration-700 ${isHovered ? 'scale-105 -rotate-1' : 'hover:scale-105 hover:rotate-1'}`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Card Background with Enhanced Effects */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} dark:${item.darkBgGradient} rounded-3xl transition-all duration-500`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
                    <div className="absolute inset-0 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500"></div>
                    
                    {/* Floating Elements */}
                    <div className={`absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`}></div>
                    <div className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-${item.color}-300 to-${item.color}-500 rounded-full opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700`}></div>
                    
                    <div className="relative z-10 p-10">
                      {/* Icon Section */}
                      <div className="mb-8">
                        <div className={`relative w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                          <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                          <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-110`}></div>
                      </div>

                      {/* Value Section */}
                      <div className="mb-6">
                        <div className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-3 tracking-tight group-hover:scale-105 transition-transform duration-300`}>
                          {item.value}
                        </div>
                        <div className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                            style={{ 
                              width: isHovered ? '100%' : '75%',
                              transition: 'width 1s ease-in-out'
                            }}
                          ></div>
                        </div>
                        <div className={`absolute -right-1 -top-1 w-4 h-4 bg-gradient-to-br ${item.gradient} rounded-full shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>



      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/30 dark:border-gray-700/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/8 via-cyan-500/4 to-emerald-500/8 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div
              className="text-center mb-12"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 via-teal-800 to-cyan-800 dark:from-white dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent mb-4">
                Investor Categories & Equity Distribution
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {investmentData.map((investor, index) => {
                  const IconComponent = investor.icon;
                  return (
                    <div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative bg-gradient-to-br from-${investor.color}-50/90 to-${investor.color}-100/90 dark:from-${investor.color}-900/20 dark:to-${investor.color}-800/20 rounded-2xl p-6 shadow-xl border border-${investor.color}-200/40 dark:border-${investor.color}-700/40 group overflow-hidden backdrop-blur-sm`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${investor.color}-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className={`w-12 h-12 bg-gradient-to-br from-${investor.color}-500 to-${investor.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                              whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                              <IconComponent className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                              <h3 className={`text-lg font-black text-${investor.color}-700 dark:text-${investor.color}-300 mb-1`}>
                                {investor.category}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {investor.minInvestment} min • {investor.maxInvestors} max
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-black text-${investor.color}-600 dark:text-${investor.color}-400 leading-none`}>
                              {investor.percentage}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">equity</div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className={`inline-flex items-center gap-2 bg-${investor.color}-100 dark:bg-${investor.color}-900/30 px-3 py-1 rounded-full`}>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Investment:</span>
                            <span className={`text-sm font-bold text-${investor.color}-700 dark:text-${investor.color}-300`}>
                              {investor.amount}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                          {investor.description}
                        </p>
                        <div className="grid grid-cols-1 gap-2 mb-5">
                          {investor.benefits.slice(0, 2).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 text-${investor.color}-500 flex-shrink-0`} />
                              <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{benefit}</span>
                            </div>
                          ))}
                          {investor.benefits.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{investor.benefits.length - 2} more benefits
                            </div>
                          )}
                        </div>
                        <InvestmentButton
                          investorType={investor.category}
                          minInvestment={investor.minInvestment}
                          maxInvestors={investor.maxInvestors}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-900/40 dark:to-gray-800/40 rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-xl backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5"></div>
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                      Equity Distribution
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full"></div>
                  </div>
                  <div className="relative w-full h-64 mb-6">
                    <canvas ref={chartRef} id="equityChart" className="drop-shadow-lg"></canvas>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                        <div className="text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          {totalEquityOffered}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Total Equity
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    {investmentData.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/40 rounded-lg backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-300"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${index === 0 ? 'from-emerald-500 to-emerald-600' :
                              index === 1 ? 'from-teal-500 to-teal-600' :
                              index === 2 ? 'from-cyan-500 to-cyan-600' :
                              'from-blue-500 to-blue-600'
                            } shadow-sm`}
                            whileHover={{ scale: 1.3 }}
                          ></motion.div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          {item.percentage}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center leading-relaxed">
                    Real-time equity visualization with interactive elements
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
        <motion.div
          variants={itemVariants}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative z-10">
            <motion.h2
              className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-12 text-center"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Growth Roadmap & Milestones
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                        {milestone.phase}
                      </div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">
                        {milestone.progress}%
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${milestone.progress}%` }}
                          transition={{ duration: 2, delay: index * 0.2 }}
                        ></motion.div>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 rounded-3xl p-8 sm:p-12 shadow-2xl text-white overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <motion.div
              className="text-center mb-12"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black">
                  Why Invest in GimaCapital?
                </h2>
              </div>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Join the revolution in AI-powered trading with proven technology and exponential growth potential.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Operational Platform',
                  description: 'Fully functional AI trading platform ready for immediate user acquisition and revenue generation.',
                  highlight: 'Live & Ready'
                },
                {
                  icon: Shield,
                  title: 'Proven Technology',
                  description: 'Battle-tested algorithms with eliminated technical risks and demonstrated market performance.',
                  highlight: 'De-risked'
                },
                {
                  icon: TrendingUp,
                  title: 'Scalable Infrastructure',
                  description: 'Cloud-native architecture designed for rapid scaling and global market expansion.',
                  highlight: 'Scalable'
                },
                {
                  icon: Users,
                  title: 'Expert Team',
                  description: 'Seasoned professionals with proven track record in fintech and AI development.',
                  highlight: 'Experienced'
                },
                {
                  icon: Target,
                  title: 'Market Position',
                  description: 'Strategic positioning in the $127B cryptocurrency trading market with first-mover advantages.',
                  highlight: '$127B Market'
                },
                {
                  icon: Award,
                  title: 'ROI Projection',
                  description: 'Conservative projections show 15-25x return potential over 3-5 year investment horizon.',
                  highlight: '15-25x ROI'
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-white">
                          {benefit.title}
                        </div>
                        <div className="text-sm text-emerald-200 font-semibold">
                          {benefit.highlight}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-100 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
            <div className="relative z-10">
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Ready to Join the Future?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Connect with our investment team for detailed financial projections, due diligence materials, and exclusive investor access.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                variants={containerVariants}
              >
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-2xl font-bold text-lg overflow-hidden"
                >
                  <Zap className="w-6 h-6" />
                  <span className="relative z-10">Schedule Investment Call</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl font-bold text-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10">Download Pitch Deck</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </motion.button>
              </motion.div>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  GimaCapital Investment Team
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold">investment@gimacapital.com</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed">
                  This document contains forward-looking statements and projections. Past performance does not guarantee future results.
                  All financial projections are estimates based on current market conditions and comprehensive business analysis.
                  Please consult with qualified financial advisors before making investment decisions.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <footer className="w-full bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1 sm:col-span-2"
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 blur-lg opacity-30 -z-10"></div>
                </motion.div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">GimaCapital</span>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">by GimaBlockchain</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-base max-w-md leading-relaxed">
                GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance,
                institutional-grade security, and revolutionary market insights.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Live Trading Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">SEC Compliant</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Platform</h4>
              <ul className="space-y-4">
                {['Trading Tools', 'Mobile App', 'API Access', 'Market Data'].map((item, index) => (
                  <li key={index}>
                    <motion.button
                      whileHover={{ x: 5, color: '#10B981' }}
                      className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Support</h4>
              <ul className="space-y-4">
                {['Help Center', 'Contact Us', 'Education', 'Community'].map((item, index) => (
                  <li key={index}>
                    <motion.button
                      whileHover={{ x: 5, color: '#10B981' }}
                      className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="border-t border-gray-200/50 dark:border-gray-800/50 pt-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Privacy Policy</motion.span>
                <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Terms of Service</motion.span>
                <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Risk Disclosure</motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default InvestmentStructure;