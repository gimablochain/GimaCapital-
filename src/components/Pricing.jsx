import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, ChevronRight, Menu, X, Check, X as XIcon } from 'lucide-react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const Pricing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // State for billing cycle toggle

  const plans = [
    {
      name: "Starter",
      priceMonthly: "Free",
      priceYearly: "Free",
      durationMonthly: "No subscription",
      durationYearly: "No subscription",
      description: "Perfect for beginners exploring AI-driven trading.",
      features: [
        "Basic AI trading algorithms",
        "$5,000 virtual trading account",
        "Real-time market data (delayed)",
        "Community support via forums"
      ],
      cta: "Start for Free",
      link: "/register"
    },
    {
      name: "Basic",
      priceMonthly: "$19",
      priceYearly: "$193",
      durationMonthly: "per month",
      durationYearly: "per year",
      description: "Ideal for individual traders starting with enhanced features.",
      features: [
        "Standard AI trading algorithms",
        "$25,000 virtual trading account",
        "Real-time market data",
        "Email support (48-hour response)"
      ],
      cta: "Get Basic",
      link: "/register"
    },
    {
      name: "Pro",
      priceMonthly: "$99",
      priceYearly: "$1009",
      durationMonthly: "per month",
      durationYearly: "per year",
      description: "Advanced tools for professional traders.",
      features: [
        "Proprietary AI algorithms with backtesting",
        "Direct market access",
        "Priority email support (24-hour response)",
        "Basic API integration (up to 100 calls/day)"
      ],
      cta: "Get Pro",
      link: "/register"
    },
    {
      name: "Advanced",
      priceMonthly: "$499",
      priceYearly: "$5090",
      durationMonthly: "per month",
      durationYearly: "per year",
      description: "Comprehensive tools for experienced traders and small teams.",
      features: [
        "Customizable AI algorithms with real-time optimization",
        "Multi-account management (up to 5 accounts)",
        "24/7 priority support (phone + email)",
        "Advanced API and webhook integration (up to 1000 calls/day)"
      ],
      cta: "Get Advanced",
      link: "/register"
    },
    {
      name: "Premium",
      priceMonthly: "$1999",
      priceYearly: "$20390",
      durationMonthly: "per month",
      durationYearly: "per year",
      description: "Premium features for high-volume traders and organizations.",
      features: [
        "Premium AI algorithm suite with predictive analytics",
        "Dedicated support channel with SLA (4-hour response)",
        "Enhanced security (SOC 2 Type II compliance)",
        "Custom reporting and advanced analytics dashboard"
      ],
      cta: "Get Premium",
      link: "/contact"
    },
    {
      name: "Enterprise",
      priceMonthly: "$4999",
      priceYearly: "$50990",
      durationMonthly: "per month",
      durationYearly: "per year",
      description: "Tailored solutions for large institutions.",
      features: [
        "Custom AI algorithm development with dedicated data science team",
        "Dedicated account manager with bi-weekly reviews",
        "Institutional-grade security (ISO 27001, GDPR, CCPA compliance)",
        "Multi-region compliance and custom integrations"
      ],
      cta: "Get Enterprise",
      link: "/contact"
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleBillingCycle = (cycle) => {
    setBillingCycle(cycle);
  };

  // Chart data for pricing comparison
  const chartData = {
    labels: plans.map(plan => plan.name),
    datasets: [{
      label: "Monthly Cost (USD)",
      data: plans.map(plan => parseFloat(plan.priceMonthly.replace('$', '')) || 0),
      backgroundColor: [
        "#10B981",
        "#14B8A6",
        "#06B6D4",
        "#0EA5E9",
        "#3B82F6",
        "#8B5CF6"
      ],
      borderColor: [
        "#059669",
        "#0D9488",
        "#0284C7",
        "#0284C7",
        "#2563EB",
        "#7C3AED"
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Monthly Cost (USD)"
        }
      },
      x: {
        title: {
          display: true,
          text: "Plan"
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "GimaCapital Pricing Plans"
      }
    }
  };

  // Features for comparison table
  const features = [
    "AI Trading Algorithms",
    "Virtual Trading Account",
    "Real-Time Market Data",
    "Support",
    "Direct Market Access",
    "API Integration",
    "Multi-Account Management",
    "24/7 Priority Support",
    "Customizable AI Algorithms",
    "Dedicated Support Channel",
    "Security Compliance",
    "Custom Reporting",
    "Dedicated Account Manager",
    "Multi-Region Compliance"
  ];

  const featureAvailability = {
    "Starter": [
      "Basic",
      "$5,000",
      "Delayed",
      "Community forums",
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "Basic": [
      "Standard",
      "$25,000",
      "Real-time",
      "Email (48-hour)",
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "Pro": [
      "Proprietary",
      "$50,000",
      "Real-time",
      "Priority email (24-hour)",
      true,
      "Basic (100 calls/day)",
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ],
    "Advanced": [
      "Customizable",
      "$100,000",
      "Real-time",
      "24/7 phone + email",
      true,
      "Advanced (1000 calls/day)",
      "Up to 5 accounts",
      true,
      true,
      false,
      false,
      false,
      false,
      false
    ],
    "Premium": [
      "Premium suite",
      "$500,000",
      "Real-time",
      "Dedicated (4-hour SLA)",
      true,
      "Advanced (unlimited)",
      "Up to 10 accounts",
      true,
      true,
      true,
      "SOC 2 Type II",
      true,
      false,
      false
    ],
    "Enterprise": [
      "Custom development",
      "Unlimited",
      "Real-time",
      "Dedicated manager",
      true,
      "Custom integrations",
      "Unlimited accounts",
      true,
      true,
      true,
      "ISO 27001, GDPR, CCPA",
      true,
      true,
      true
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
      <Helmet>
        <title>Pricing - GimaCapital Trading Plans</title>
        <meta name="description" content="Explore GimaCapital's pricing plans for AI-driven trading, from free starter accounts to enterprise solutions." />
        <meta name="keywords" content="GimaCapital, pricing, trading plans, AI trading, GimaBlockchain" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "GimaCapital Pricing",
            "description": "Flexible pricing plans for AI-driven trading with GimaCapital, powered by GimaBlockchain.",
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
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Sign In</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/register"
                  className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Get Started</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
               Home
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
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Pricing
                </span> Plans
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Choose the perfect plan for your trading needs, from free starter accounts to enterprise solutions, all powered by GimaBlockchain's AI technology.
              </p>
              <div className="flex justify-center mb-12">
                <div className="relative bg-gray-200 dark:bg-gray-800 rounded-xl p-1 flex">
                  <motion.button
                    onClick={() => toggleBillingCycle('monthly')}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-colors duration-300 z-10 ${
                      billingCycle === 'monthly'
                        ? 'text-white bg-emerald-500'
                        : 'text-gray-900 dark:text-gray-300'
                    }`}
                  >
                    Monthly
                    {billingCycle === 'monthly' && (
                      <motion.div
                        className="absolute inset-0 bg-emerald-500 rounded-xl"
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => toggleBillingCycle('yearly')}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-colors duration-300 z-10 flex items-center gap-2 ${
                      billingCycle === 'yearly'
                        ? 'text-white bg-emerald-500'
                        : 'text-gray-900 dark:text-gray-300'
                    }`}
                  >
                    Yearly
                    <span className="text-sm bg-emerald-600 px-2 py-1 rounded">Save 15%</span>
                    {billingCycle === 'yearly' && (
                      <motion.div
                        className="absolute inset-0 bg-emerald-500 rounded-xl"
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {billingCycle === 'monthly' ? plan.durationMonthly : plan.durationYearly}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{plan.description}</p>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={plan.link}
                      className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                    >
                      <span>{plan.cta}</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Compare Plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-4 text-gray-900 dark:text-white font-semibold">Feature</th>
                    {plans.map((plan, index) => (
                      <th key={index} className="p-4 text-gray-900 dark:text-white font-semibold text-center">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4 text-gray-600 dark:text-gray-300">{feature}</td>
                      {plans.map((plan, i) => (
                        <td key={i} className="p-4 text-center">
                          {featureAvailability[plan.name][index] === true ? (
                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                          ) : featureAvailability[plan.name][index] === false ? (
                            <XIcon className="w-5 h-5 text-gray-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600 dark:text-gray-300">{featureAvailability[plan.name][index]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Pricing Overview</h2>
            <div className="max-w-4xl mx-auto">
              <Bar data={chartData} options={chartOptions} />
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

export default Pricing;