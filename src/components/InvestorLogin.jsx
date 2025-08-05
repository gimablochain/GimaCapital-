


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signInWithCustomToken } from 'firebase/auth';
// import { auth } from '../firebase';
// import { Form, Input, Button, Alert, Typography, Tabs } from 'antd';
// import { LockOutlined, MailOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// const InvestorLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [requestTokenSuccess, setRequestTokenSuccess] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (values) => {
//     setLoading(true);
//     setError(null);

//     if (!auth) {
//       console.error('Firebase auth is undefined in InvestorLogin.');
//       setError('Authentication service unavailable. Please try again later or contact support.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/payment/investor-login`, {
//         accessToken: values.accessToken,
//       });
//       console.log('Backend response:', response.data);
//       const { customToken, investorId } = response.data;

//       const userCredential = await signInWithCustomToken(auth, customToken);
//       console.log('Firebase user:', userCredential.user.uid);

//       localStorage.setItem('investorId', investorId);
//       localStorage.setItem('accessToken', values.accessToken);
//       console.log('InvestorLogin: Navigating to /investor-dashboard');
//       navigate('/investor-dashboard', { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);
//       let errorMessage = err.response?.data?.error || 'Login failed. Please check your access token or contact support.';
//       if (err.response?.status === 401) {
//         errorMessage = 'Invalid or expired access token. Please request a new token.';
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRequestToken = async (values) => {
//     setLoading(true);
//     setError(null);
//     setRequestTokenSuccess(null);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/payment/request-new-token`, {
//         email: values.email,
//       });
//       console.log('Request token response:', response.data);
//       setRequestTokenSuccess('A new access token has been sent to your email. Please check your inbox (and spam folder).');
//     } catch (err) {
//       console.error('Request token error:', err);
//       setError(err.response?.data?.error || 'Failed to request new token. Please try again or contact support.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define tab items using the new format
//   const tabItems = [
//     {
//       key: 'login',
//       label: 'Log In',
//       children: (
//         <Form
//           name="investor_login"
//           onFinish={handleLogin}
//           style={{ maxWidth: 400, margin: '0 auto' }}
//         >
//           <Form.Item
//             name="accessToken"
//             rules={[{ required: true, message: 'Please input your access token!' }]}
//           >
//             <Input
//               prefix={<LockOutlined />}
//               placeholder="Access Token"
//               size="large"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               block
//               size="large"
//             >
//               Log In
//             </Button>
//           </Form.Item>
//         </Form>
//       ),
//     },
//     {
//       key: 'request-token',
//       label: 'Request New Token',
//       children: (
//         <Form
//           name="request_token"
//           onFinish={handleRequestToken}
//           style={{ maxWidth: 400, margin: '0 auto' }}
//         >
//           <Form.Item
//             name="email"
//             rules={[
//               { required: true, message: 'Please input your email!' },
//               { type: 'email', message: 'Please enter a valid email!' },
//             ]}
//           >
//             <Input
//               prefix={<MailOutlined />}
//               placeholder="Email"
//               size="large"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               block
//               size="large"
//             >
//               Request New Token
//             </Button>
//           </Form.Item>
//         </Form>
//       ),
//     },
//   ];

//   return (
//     <div className="investor-login-container">
//       <Typography.Title level={2} style={{ textAlign: 'center' }}>
//         Investor Login
//       </Typography.Title>
//       {error && (
//         <Alert
//           message="Error"
//           description={error}
//           type="error"
//           showIcon
//           style={{ marginBottom: 16 }}
//         />
//       )}
//       {requestTokenSuccess && (
//         <Alert
//           message="Success"
//           description={requestTokenSuccess}
//           type="success"
//           showIcon
//           style={{ marginBottom: 16 }}
//         />
//       )}
//       <Tabs defaultActiveKey="login" items={tabItems} />
//     </div>
//   );
// };

// export default InvestorLogin;




import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase';
import { Form, Input, Button, Alert, Typography, Tabs } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { ChevronRight, Menu, X, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// const InvestorLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [requestTokenSuccess, setRequestTokenSuccess] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state?.error) {
//       setError(location.state.error);
//     }
//   }, [location]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogin = async (values) => {
//     setLoading(true);
//     setError(null);

//     if (!auth) {
//       console.error('Firebase auth is undefined in InvestorLogin.');
//       setError('Authentication service unavailable. Please try again later or contact support.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/payment/investor-login`, {
//         accessToken: values.accessToken,
//       });
//       console.log('Backend response:', response.data);
//       const { customToken, investorId } = response.data;

//       const userCredential = await signInWithCustomToken(auth, customToken);
//       console.log('Firebase user:', userCredential.user.uid);

//       localStorage.setItem('investorId', investorId);
//       localStorage.setItem('accessToken', values.accessToken);
//       console.log('InvestorLogin: Navigating to /investor-dashboard');
//       navigate('/investor-dashboard', { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);
//       let errorMessage = err.response?.data?.error || 'Login failed. Please check your access token or contact support.';
//       if (err.response?.status === 401) {
//         errorMessage = 'Invalid or expired access token. Please request a new token.';
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRequestToken = async (values) => {
//     setLoading(true);
//     setError(null);
//     setRequestTokenSuccess(null);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/payment/request-new-token`, {
//         email: values.email,
//       });
//       console.log('Request token response:', response.data);
//       setRequestTokenSuccess('A new access token has been sent to your email. Please check your inbox (and spam folder).');
//     } catch (err) {
//       console.error('Request token error:', err);
//       setError(err.response?.data?.error || 'Failed to request new token. Please try again or contact support.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   const tabItems = [
//     {
//       key: 'login',
//       label: (
//         <span className="text-gray-700 dark:text-gray-300 font-medium">
//           Log In
//         </span>
//       ),
//       children: (
//         <Form
//           name="investor_login"
//           onFinish={handleLogin}
//           className="max-w-md mx-auto"
//         >
//           <Form.Item
//             name="accessToken"
//             rules={[{ required: true, message: 'Please input your access token!' }]}
//           >
//             <Input
//               prefix={<LockOutlined className="text-emerald-500" />}
//               placeholder="Access Token"
//               size="large"
//               className="rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-all duration-300"
//             />
//           </Form.Item>
//           <Form.Item>
//             <motion.div
//               whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 block
//                 size="large"
//                 className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg font-semibold overflow-hidden group"
//               >
//                 <span className="relative z-10">Log In</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//               </Button>
//             </motion.div>
//           </Form.Item>
//         </Form>
//       ),
//     },
//     {
//       key: 'request-token',
//       label: (
//         <span className="text-gray-700 dark:text-gray-300 font-medium">
//           Request New Token
//         </span>
//       ),
//       children: (
//         <Form
//           name="request_token"
//           onFinish={handleRequestToken}
//           className="max-w-md mx-auto"
//         >
//           <Form.Item
//             name="email"
//             rules={[
//               { required: true, message: 'Please input your email!' },
//               { type: 'email', message: 'Please enter a valid email!' },
//             ]}
//           >
//             <Input
//               prefix={<MailOutlined className="text-emerald-500" />}
//               placeholder="Email"
//               size="large"
//               className="rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-all duration-300"
//             />
//           </Form.Item>
//           <Form.Item>
//             <motion.div
//               whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 block
//                 size="large"
//                 className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg font-semibold overflow-hidden group"
//               >
//                 <span className="relative z-10">Request New Token</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//               </Button>
//             </motion.div>
//           </Form.Item>
//         </Form>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-all duration-500 relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Navbar */}
//       <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-800/50 z-50 transition-all duration-300">
//         <div className="container mx-auto px-4 sm:px-6 py-4">
//           <div className="flex items-center justify-between">
//             <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
//               <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative">
//                 <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl">
//                   <TrendingUp className="w-7 h-7" />
//                 </div>
//                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 blur-lg opacity-30 -z-10"></div>
//               </motion.div>
//               <div>
//                 <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
//                   GimaCapital
//                 </span>
//                 <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">SERIES SEED</div>
//               </div>
//             </motion.div>

//             <div className="hidden lg:flex items-center space-x-8">
//               {[
//                 { name: 'Gima Live Stats', path: '/gima-live-stats' },
//                 { name: 'Valuation Overview', path: '/ValuationOverview' },
//                 { name: 'Pricing', path: '/pricing' },
//                 { name: 'About', path: '/about' },
//                 { name: 'Contact', path: '/contact' },
//               ].map((item) => (
//                 <motion.div key={item.name} whileHover={{ y: -2 }}>
//                   <Link
//                     to={item.path}
//                     className="relative text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-all duration-300 text-sm group"
//                   >
//                     {item.name}
//                     <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             <div className="lg:hidden flex items-center">
//               <motion.button
//                 onClick={toggleMenu}
//                 className="text-gray-700 dark:text-gray-300 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                 whileTap={{ scale: 0.95 }}
//                 aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//               >
//                 <AnimatePresence mode="wait">
//                   {isMenuOpen ? (
//                     <motion.div
//                       key="close"
//                       initial={{ rotate: -90, opacity: 0 }}
//                       animate={{ rotate: 0, opacity: 1 }}
//                       exit={{ rotate: 90, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <X className="w-6 h-6" />
//                     </motion.div>
//                   ) : (
//                     <motion.div
//                       key="menu"
//                       initial={{ rotate: 90, opacity: 0 }}
//                       animate={{ rotate: 0, opacity: 1 }}
//                       exit={{ rotate: -90, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <Menu className="w-6 h-6" />
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.button>
//             </div>
//           </div>

//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className="lg:hidden overflow-hidden"
//               >
//                 <motion.div
//                   className="flex flex-col space-y-4 mt-6 pb-4"
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   {[
//                     { name: 'Gima Live Stats', path: '/gima-live-stats' },
//                     { name: 'Home', path: '/' },
//                     { name: 'Pricing', path: '/pricing' },
//                     { name: 'About', path: '/about' },
//                     { name: 'Contact', path: '/contact' },
//                   ].map((item) => (
//                     <motion.div key={item.name} variants={itemVariants}>
//                       <Link
//                         to={item.path}
//                         className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors py-2 text-sm border-l-2 border-transparent hover:border-emerald-500 pl-4"
//                         onClick={toggleMenu}
//                       >
//                         {item.name}
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="container mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative"
//       >
//         <div className="relative z-10 max-w-lg mx-auto">
//           <motion.div variants={itemVariants} className="text-center mb-12">
//             <Typography.Title
//               level={2}
//               className="text-4xl sm:text-5xl font-serif font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent"
//             >
//               Investor Login
//             </Typography.Title>
//             <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
//             <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
//               Access your GimaCapital investor dashboard
//             </p>
//           </motion.div>

//           <motion.div
//             variants={itemVariants}
//             className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
//             <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
//             <div className="relative z-10">
//               {error && (
//                 <motion.div variants={itemVariants}>
//                   <Alert
//                     message="Error"
//                     description={error}
//                     type="error"
//                     showIcon
//                     className="mb-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
//                   />
//                 </motion.div>
//               )}
//               {requestTokenSuccess && (
//                 <motion.div variants={itemVariants}>
//                   <Alert
//                     message="Success"
//                     description={requestTokenSuccess}
//                     type="success"
//                     showIcon
//                     className="mb-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
//                   />
//                 </motion.div>
//               )}
//               <Tabs
//                 defaultActiveKey="login"
//                 items={tabItems}
//                 className="investor-login-tabs"
//                 tabBarStyle={{
//                   color: '#4B5563',
//                   fontWeight: 500,
//                   borderBottom: '2px solid rgba(209, 213, 219, 0.5)',
//                 }}
//               />
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Footer */}
//       <footer className="w-full bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
//         <div className="container mx-auto px-4 sm:px-6 relative z-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="col-span-1 sm:col-span-2"
//             >
//               <div className="flex items-center space-x-4 mb-6">
//                 <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
//                   <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
//                     <TrendingUp className="w-8 h-8" />
//                   </div>
//                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 blur-lg opacity-30 -z-10"></div>
//                 </motion.div>
//                 <div>
//                   <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">GimaCapital</span>
//                   <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">by GimaBlockchain</div>
//                 </div>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 text-base max-w-md leading-relaxed">
//                 GimaCapital, powered by GimaBlockchain, offers proprietary AI-driven trading with unmatched performance,
//                 institutional-grade security, and revolutionary market insights.
//               </p>
//               <div className="flex items-center gap-4 mt-6">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
//                   <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Live Trading Active</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Shield className="w-4 h-4 text-teal-500" />
//                   <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">SEC Compliant</span>
//                 </div>
//               </div>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Platform</h4>
//               <ul className="space-y-4">
//                 {['Trading Tools', 'Mobile App', 'API Access', 'Market Data'].map((item, index) => (
//                   <li key={index}>
//                     <motion.button
//                       whileHover={{ x: 5, color: '#10B981' }}
//                       className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
//                     >
//                       <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
//               <h4 className="font-black text-gray-900 dark:text-white mb-6 text-lg">Support</h4>
//               <ul className="space-y-4">
//                 {['Help Center', 'Contact Us', 'Education', 'Community'].map((item, index) => (
//                   <li key={index}>
//                     <motion.button
//                       whileHover={{ x: 5, color: '#10B981' }}
//                       className="text-left w-full text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
//                     >
//                       <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
//             className="border-t border-gray-200/50 dark:border-gray-800/50 pt-8"
//           >
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-gray-500 dark:text-gray-400 text-sm">
//                 © {new Date().getFullYear()} GimaCapital by GimaBlockchain. All rights reserved. Licensed and regulated.
//               </div>
//               <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
//                 <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Privacy Policy</motion.span>
//                 <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Terms of Service</motion.span>
//                 <motion.span whileHover={{ color: '#10B981' }} className="cursor-pointer transition-colors">Risk Disclosure</motion.span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default InvestorLogin;









const API_BASE_URL = 'http://localhost:5000';

const InvestorLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTokenSuccess, setRequestTokenSuccess] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = async (values) => {
    setLoading(true);
    setError(null);

    if (!auth) {
      console.error('Firebase auth is undefined in InvestorLogin.');
      setError('Authentication service unavailable. Please try again later or contact support.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/investor-login`, {
        accessToken: values.accessToken,
      });
      console.log('Backend response:', response.data);
      const { customToken, investorId } = response.data;

      const userCredential = await signInWithCustomToken(auth, customToken);
      console.log('Firebase user:', userCredential.user.uid);

      localStorage.setItem('investorId', investorId);
      localStorage.setItem('accessToken', values.accessToken);
      console.log('InvestorLogin: Navigating to /investor-dashboard');
      navigate('/investor-dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = err.response?.data?.error || 'Login failed. Please check your access token or contact support.';
      if (err.response?.status === 401) {
        errorMessage = 'Invalid or expired access token. Please request a new token.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToken = async (values) => {
    setLoading(true);
    setError(null);
    setRequestTokenSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/request-new-token`, {
        email: values.email,
      });
      console.log('Request token response:', response.data);
      setRequestTokenSuccess('A new access token has been sent to your email. Please check your inbox (and spam folder).');
    } catch (err) {
      console.error('Request token error:', err);
      setError(err.response?.data?.error || 'Failed to request new token. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const tabItems = [
    {
      key: 'login',
      label: (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Log In
        </span>
      ),
      children: (
        <Form
          name="investor_login"
          onFinish={handleLogin}
          className="max-w-md mx-auto"
        >
          <Form.Item
            name="accessToken"
            rules={[{ required: true, message: 'Please input your access token!' }]}
          >
            <Input
              prefix={<LockOutlined className="text-emerald-500" />}
              placeholder="Access Token"
              size="large"
              className="rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-all duration-300"
            />
          </Form.Item>
          <Form.Item>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg font-semibold overflow-hidden group"
              >
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'request-token',
      label: (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Request New Token
        </span>
      ),
      children: (
        <Form
          name="request_token"
          onFinish={handleRequestToken}
          className="max-w-md mx-auto"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-emerald-500" />}
              placeholder="Email"
              size="large"
              className="rounded-xl bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-emerald-500 transition-all duration-300"
            />
          </Form.Item>
          <Form.Item>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg font-semibold overflow-hidden group"
              >
                <span className="relative z-10">Request New Token</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-all duration-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
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
                    { name: 'Gima Live Stats', path: '/gima-live-stats' },
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

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Typography.Title
              level={2}
              className="text-4xl sm:text-5xl font-serif font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent"
            >
              Investor Login
            </Typography.Title>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              Access your GimaCapital investor dashboard
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              This secure portal is exclusively for GimaCapital investors to access their dashboard and manage investments with our AI-driven trading platform.
            </p>
          </motion.div>

          {/* <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <Alert
              message="Important"
              description="This is a private investor-only link. Please save this URL https://www.gimacapital.com/investor-login in a secure, memorable location, as it is not publicly accessible."
              type="warning"
              showIcon
              className="bg-yellow-50/70 dark:bg-yellow-900/70 border border-yellow-200 dark:border-yellow-800 rounded-xl"
            />
          </motion.div> */}


          <motion.div variants={itemVariants} className="mb-6">
            <Alert
                message="Important"
                description={
                <>
                    This is a private investor-only link. Please save this URL{' '}
                    <a
                    href="https://www.gimacapital.com/investor-login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
                    >
                    https://www.gimacapital.com/investor-login
                    </a>{' '}
                    in a secure, memorable location, as it is not publicly accessible.
                </>
                }
                type="warning"
                showIcon
                className="bg-yellow-50/70 dark:bg-yellow-900/70 border border-yellow-200 dark:border-yellow-800 rounded-xl"
            />
            </motion.div>


          <motion.div
            variants={itemVariants}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative z-10">
              {error && (
                <motion.div variants={itemVariants}>
                  <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mb-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </motion.div>
              )}
              {requestTokenSuccess && (
                <motion.div variants={itemVariants}>
                  <Alert
                    message="Success"
                    description={requestTokenSuccess}
                    type="success"
                    showIcon
                    className="mb-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </motion.div>
              )}
              <Tabs
                defaultActiveKey="login"
                items={tabItems}
                className="investor-login-tabs"
                tabBarStyle={{
                  color: '#4B5563',
                  fontWeight: 500,
                  borderBottom: '2px solid rgba(209, 213, 219, 0.5)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
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

export default InvestorLogin;