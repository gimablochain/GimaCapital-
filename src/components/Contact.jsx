import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, Menu, X, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add backend integration here (e.g., API call to send form data)
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-all duration-500">
      <Helmet>
        <title>Contact GimaCapital - Get in Touch</title>
        <meta name="description" content="Contact GimaCapital for support, inquiries, or enterprise solutions. Reach out via our form or direct contact details." />
        <meta name="keywords" content="GimaCapital, contact, support, GimaBlockchain, AI trading" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "GimaCapital Contact",
            "description": "Contact GimaCapital for trading platform inquiries and support.",
            "url": "https://www.gimacapital.com/contact"
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
                to="/Gima-Live-Stats"
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2"
                onClick={toggleMenu}
              >
                Gima Live Stats
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
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Contact</span> Us
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Get in touch with GimaCapital for support, inquiries, or enterprise solutions. Our team is here to help you succeed.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                  >
                    <span>Send Message</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-emerald-500 mr-3" />
                      <span className="text-gray-600 dark:text-gray-300">support@gimacapital.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-emerald-500 mr-3" />
                      <span className="text-gray-600 dark:text-gray-300">+1 (800) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-emerald-500 mr-3" />
                      <span className="text-gray-600 dark:text-gray-300">123 Blockchain Ave, New York, NY 10001</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9 AM - 6 PM EST</p>
                  <p className="text-gray-600 dark:text-gray-300">Saturday: 10 AM - 4 PM EST</p>
                  <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
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

export default Contact;