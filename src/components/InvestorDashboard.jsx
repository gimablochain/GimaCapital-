

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import { auth as firebaseAuth } from '../firebase';
// import { motion } from 'framer-motion';
// import { Card, Typography, Alert, Table, Tag, Button, Tabs } from 'antd';
// import { DollarSign, AlertCircle, FileText } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// const InvestorDashboard = () => {
// //   const { currentUser } = useAuth();
//   const [investorData, setInvestorData] = useState(null);
//   const [quarterlyUpdates, setQuarterlyUpdates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Added navigate

//   useEffect(() => {
   
//     const fetchInvestorData = async (retryCount = 0, maxRetries = 1) => {
//       try {
//         const user = firebaseAuth.currentUser;
//         if (!user) {
//           throw new Error('User not authenticated');
//         }

//         const accessToken = localStorage.getItem('accessToken');
//         if (!accessToken) {
//           throw new Error('Access token not found in localStorage');
//         }
//         console.log('InvestorDashboard: Using accessToken:', accessToken);

//         const [investorResponse, updatesResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/payment/investor/${user.uid}`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }),
//           axios.get(`${API_BASE_URL}/api/payment/quarterly-updates`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }),
//         ]);

//         setInvestorData(investorResponse.data);
//         setQuarterlyUpdates(updatesResponse.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('InvestorDashboard error:', err);
//         if (err.response?.status === 401) {
//           localStorage.removeItem('accessToken'); // Clear expired token
//           setError('Your access token has expired. Please request a new token.');
//           navigate('/investor-login', { state: { error: 'Your access token has expired. Please request a new token.' } });
//           return;
//         }
//         if (err.response?.status === 429 && retryCount < maxRetries) {
//           console.log(`InvestorDashboard: Retrying fetch (attempt ${retryCount + 1}/${maxRetries})`);
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//           return fetchInvestorData(retryCount + 1, maxRetries);
//         }
//         setError(err.response?.data?.error || err.message || 'Failed to fetch investor data');
//         setLoading(false);
//       }
//     };

//     fetchInvestorData();
//   }, [navigate]);

//   const columns = [
//     {
//       title: 'Transaction Hash',
//       dataIndex: 'transactionHash',
//       key: 'transactionHash',
//       render: (hash) => <Text code>{hash}</Text>,
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount, record) => (
//         <span>{amount.toLocaleString()} {record.currency}</span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={status === 'confirmed' ? 'green' : 'orange'}>
//           {status.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Date',
//       dataIndex: 'confirmedAt',
//       key: 'confirmedAt',
//       render: (date) => (date ? new Date(date).toLocaleDateString() : 'Pending'),
//     },
//   ];

//   const dataSource = investorData?.investments
//     ? Object.entries(investorData.investments).map(([id, investment]) => ({
//         key: id,
//         transactionHash: id,
//         amount: investment.amount,
//         currency: investment.currency,
//         status: investment.status,
//         confirmedAt: investment.confirmedAt,
//       }))
//     : [];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white p-4"
//     >
//       <div className="max-w-4xl mx-auto">
//         <Title level={2} className="text-center mb-8">
//           Investor Dashboard
//         </Title>

//         <Alert
//           message="USD Payments Coming Soon"
//           description="We're working on adding USD payment options (credit card, wire, ACH). For now, please use crypto deposits (BTC, USDT)."
//           type="info"
//           showIcon
//           icon={<AlertCircle size={20} />}
//           className="mb-6"
//         />

//         {loading && <Text>Loading...</Text>}
//         {error && <Alert message="Error" description={error} type="error" showIcon />}
//         {investorData && (
//           <Tabs defaultActiveKey="investments">
//             <TabPane
//               tab={
//                 <span>
//                   <DollarSign size={16} className="inline mr-2" />
//                   Investments
//                 </span>
//               }
//               key="investments"
//             >
//               <Card className="mb-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Text strong className="text-lg">Welcome, {investorData.name}</Text>
//                     <br />
//                     <Text type="secondary">{investorData.email}</Text>
//                   </div>
//                   <div>
//                     <Text strong>Total Invested</Text>
//                     <br />
//                     <Text className="text-2xl font-bold text-emerald-600">
//                       ${investorData.totalInvested.toLocaleString()}
//                     </Text>
//                   </div>
//                 </div>
//               </Card>

//               <Card title="Investment History">
//                 <Table
//                   columns={columns}
//                   dataSource={dataSource}
//                   pagination={false}
//                   rowKey="key"
//                 />
//               </Card>
//             </TabPane>

//             <TabPane
//               tab={
//                 <span>
//                   <FileText size={16} className="inline mr-2" />
//                   Quarterly Updates
//                 </span>
//               }
//               key="updates"
//             >
//               <Card title="Quarterly Updates & Financial Reports">
//                 {quarterlyUpdates.length > 0 ? (
//                   quarterlyUpdates.map((update, index) => (
//                     <Card key={index} className="mb-4">
//                       <Text strong>{update.title}</Text>
//                       <br />
//                       <Text type="secondary">Published: {new Date(update.publishedAt).toLocaleDateString()}</Text>
//                       <br />
//                       <Text>{update.summary}</Text>
//                       {update.reportUrl && (
//                         <Button
//                           type="link"
//                           href={update.reportUrl}
//                           target="_blank"
//                           className="mt-2"
//                         >
//                           View Full Report
//                         </Button>
//                       )}
//                     </Card>
//                   ))
//                 ) : (
//                   <Text>No updates available yet.</Text>
//                 )}
//               </Card>
//             </TabPane>
//           </Tabs>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default InvestorDashboard;







// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { auth as firebaseAuth } from '../firebase';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Card, Typography, Alert, Table, Tag, Button, Tabs } from 'antd';
// import { DollarSign, AlertCircle, FileText, TrendingUp, ChevronRight, Menu, X, Shield } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';


// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// const InvestorDashboard = () => {
//   const [investorData, setInvestorData] = useState(null);
//   const [quarterlyUpdates, setQuarterlyUpdates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchInvestorData = async (retryCount = 0, maxRetries = 1) => {
//       try {
//         const user = firebaseAuth.currentUser;
//         if (!user) {
//           throw new Error('User not authenticated');
//         }

//         const accessToken = localStorage.getItem('accessToken');
//         if (!accessToken) {
//           throw new Error('Access token not found in localStorage');
//         }
//         console.log('InvestorDashboard: Using accessToken:', accessToken);

//         const [investorResponse, updatesResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/payment/investor/${user.uid}`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }),
//           axios.get(`${API_BASE_URL}/api/payment/quarterly-updates`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }),
//         ]);

//         setInvestorData(investorResponse.data);
//         setQuarterlyUpdates(updatesResponse.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('InvestorDashboard error:', err);
//         if (err.response?.status === 401) {
//           localStorage.removeItem('accessToken');
//           setError('Your access token has expired. Please request a new token.');
//           navigate('/investor-login', { state: { error: 'Your access token has expired. Please request a new token.' } });
//           return;
//         }
//         if (err.response?.status === 429 && retryCount < maxRetries) {
//           console.log(`InvestorDashboard: Retrying fetch (attempt ${retryCount + 1}/${maxRetries})`);
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//           return fetchInvestorData(retryCount + 1, maxRetries);
//         }
//         setError(err.response?.data?.error || err.message || 'Failed to fetch investor data');
//         setLoading(false);
//       }
//     };

//     fetchInvestorData();
//   }, [navigate]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
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

//   const columns = [
//     {
//       title: 'Transaction Hash',
//       dataIndex: 'transactionHash',
//       key: 'transactionHash',
//       render: (hash) => (
//         <Text code className="text-gray-600 dark:text-gray-300 font-mono">
//           {hash}
//         </Text>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount, record) => (
//         <span className="text-gray-900 dark:text-white font-medium">
//           {amount.toLocaleString()} {record.currency}
//         </span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag
//           color={status === 'confirmed' ? 'green' : 'orange'}
//           className="rounded-full px-3 py-1 font-medium"
//         >
//           {status.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Date',
//       dataIndex: 'confirmedAt',
//       key: 'confirmedAt',
//       render: (date) => (
//         <span className="text-gray-600 dark:text-gray-300">
//           {date ? new Date(date).toLocaleDateString() : 'Pending'}
//         </span>
//       ),
//     },
//   ];

//   const dataSource = investorData?.investments
//     ? Object.entries(investorData.investments).map(([id, investment]) => ({
//         key: id,
//         transactionHash: id,
//         amount: investment.amount,
//         currency: investment.currency,
//         status: investment.status,
//         confirmedAt: investment.confirmedAt,
//       }))
//     : [];

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
//         <div className="relative z-10 max-w-4xl mx-auto">
//           <motion.div variants={itemVariants} className="text-center mb-12">
//             <Title
//               level={2}
//               className="text-4xl sm:text-5xl font-serif font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent"
//             >
//               Investor Dashboard
//             </Title>
//             <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
//             <Text className="text-lg text-gray-600 dark:text-gray-300 mt-4">
//               Manage your investments and stay updated with GimaCapital
//             </Text>
//           </motion.div>

//           <motion.div variants={itemVariants} className="mb-6">
//             <Alert
//               message="USD Payments Coming Soon"
//               description="We're working on adding USD payment options (credit card, wire, ACH). For now, please use crypto deposits (BTC, USDT)."
//               type="info"
//               showIcon
//               icon={<AlertCircle size={20} className="text-cyan-500" />}
//               className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
//             />
//           </motion.div>

//           {loading && (
//             <motion.div variants={itemVariants}>
//               <Text className="text-gray-600 dark:text-gray-300">Loading...</Text>
//             </motion.div>
//           )}
//           {error && (
//             <motion.div variants={itemVariants}>
//               <Alert
//                 message="Error"
//                 description={error}
//                 type="error"
//                 showIcon
//                 className="mb-6 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl"
//               />
//             </motion.div>
//           )}
//           {investorData && (
//             <Tabs
//               defaultActiveKey="investments"
//               className="investor-dashboard-tabs"
//               tabBarStyle={{
//                 color: '#4B5563',
//                 fontWeight: 500,
//                 borderBottom: '2px solid rgba(209, 213, 219, 0.5)',
//               }}
//             >
//               <TabPane
//                 tab={
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     <DollarSign size={16} className="inline mr-2 text-emerald-500" />
//                     Investments
//                   </span>
//                 }
//                 key="investments"
//               >
//                 <motion.div variants={itemVariants}>
//                   <Card
//                     className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
//                     <div className="relative z-10 flex items-center justify-between p-6">
//                       <div>
//                         <Text strong className="text-lg text-gray-900 dark:text-white">
//                           Welcome, {investorData.name}
//                         </Text>
//                         <br />
//                         <Text className="text-gray-600 dark:text-gray-300">{investorData.email}</Text>
//                       </div>
//                       <div className="text-right">
//                         <Text strong className="text-gray-900 dark:text-white">
//                           Total Invested
//                         </Text>
//                         <br />
//                         <Text className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                           ${investorData.totalInvested.toLocaleString()}
//                         </Text>
//                       </div>
//                     </div>
//                   </Card>
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <Card
//                     title={<span className="text-lg font-bold text-gray-900 dark:text-white">Investment History</span>}
//                     className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
//                     <div className="relative z-10">
//                       <Table
//                         columns={columns}
//                         dataSource={dataSource}
//                         pagination={false}
//                         rowKey="key"
//                         className="investor-dashboard-table"
//                       />
//                     </div>
//                   </Card>
//                 </motion.div>
//               </TabPane>

//               <TabPane
//                 tab={
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     <FileText size={16} className="inline mr-2 text-emerald-500" />
//                     Quarterly Updates
//                   </span>
//                 }
//                 key="updates"
//               >
//                 <motion.div variants={itemVariants}>
//                   <Card
//                     title={<span className="text-lg font-bold text-gray-900 dark:text-white">Quarterly Updates & Financial Reports</span>}
//                     className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10"></div>
//                     <div className="relative z-10">
//                       {quarterlyUpdates.length > 0 ? (
//                         quarterlyUpdates.map((update, index) => (
//                           <Card
//                             key={index}
//                             className="mb-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/30 dark:border-gray-700/30"
//                           >
//                             <Text strong className="text-gray-900 dark:text-white">{update.title}</Text>
//                             <br />
//                             <Text className="text-gray-600 dark:text-gray-300">
//                               Published: {new Date(update.publishedAt).toLocaleDateString()}
//                             </Text>
//                             <br />
//                             <Text className="text-gray-600 dark:text-gray-300">{update.summary}</Text>
//                             {update.reportUrl && (
//                               <motion.div
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="mt-2"
//                               >
//                                 <Button
//                                   type="link"
//                                   href={update.reportUrl}
//                                   target="_blank"
//                                   className="relative text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-500 transition-all duration-300"
//                                 >
//                                   View Full Report
//                                   <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                                 </Button>
//                               </motion.div>
//                             )}
//                           </Card>
//                         ))
//                       ) : (
//                         <Text className="text-gray-600 dark:text-gray-300">No updates available yet.</Text>
//                       )}
//                     </div>
//                   </Card>
//                 </motion.div>
//               </TabPane>
//             </Tabs>
//           )}
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

// export default InvestorDashboard;





import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth as firebaseAuth } from '../firebase';
import { motion } from 'framer-motion';
import { Card, Typography, Alert, Table, Tag, Button, Tabs, Avatar, Space } from 'antd';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const InvestorDashboard = () => {
  const [investorData, setInvestorData] = useState(null);
  const [quarterlyUpdates, setQuarterlyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestorData = async (retryCount = 0, maxRetries = 1) => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found in localStorage');
        }

        const [investorResponse, updatesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/payment/investor/${user.uid}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_BASE_URL}/api/payment/quarterly-updates`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setInvestorData(investorResponse.data);
        setQuarterlyUpdates(updatesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('InvestorDashboard error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          setError('Your access token has expired. Please request a new token.');
          navigate('/investor-login', { state: { error: 'Your access token has expired. Please request a new token.' } });
          return;
        }
        if (err.response?.status === 429 && retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return fetchInvestorData(retryCount + 1, maxRetries);
        }
        setError(err.response?.data?.error || err.message || 'Failed to fetch investor data');
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      localStorage.removeItem('accessToken');
      navigate('/investor-login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const columns = [
    {
      title: 'Transaction Hash',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: (hash) => (
        <Text className="font-mono text-sm text-gray-600">{hash.slice(0, 6) + '...' + hash.slice(-4)}</Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text className="font-medium">{amount.toLocaleString()} {record.currency}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'confirmed' ? 'blue' : 'gold'}
          className="rounded-full px-3 py-0.5 text-sm font-medium"
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'confirmedAt',
      key: 'confirmedAt',
      render: (date) => (
        <Text className="text-gray-600">{date ? new Date(date).toLocaleDateString() : 'Pending'}</Text>
      ),
    },
  ];

  const dataSource = investorData?.investments
    ? Object.entries(investorData.investments).map(([id, investment]) => ({
        key: id,
        transactionHash: id,
        amount: investment.amount,
        currency: investment.currency,
        status: investment.status,
        confirmedAt: investment.confirmedAt,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <span>$</span>
            </div>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">GimaCapital</Text>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-600 dark:text-gray-300">
            <span>X</span>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { name: 'Dashboard', path: '/investor-dashboard', icon: '🏠' },
            { name: 'Investments', path: '/Equity-structure', icon: '💰' },
            { name: 'Reports', path: '/reports', icon: '📄' },
            { name: 'Profile', path: '/profile', icon: '👤' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              <Text className="font-medium">{item.name}</Text>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full text-left"
          >
            <span>🚪</span>
            <Text className="font-medium">Logout</Text>
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <button onClick={toggleSidebar} className="lg:hidden text-gray-600 dark:text-gray-300">
            <span>☰</span>
          </button>
          <div className="flex items-center space-x-4">
            <Avatar className="bg-blue-600">{investorData?.name?.charAt(0) || 'U'}</Avatar>
            <Text className="font-medium text-gray-900 dark:text-white">{investorData?.name || 'Investor'}</Text>
          </div>
        </header>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 lg:p-8 flex-1"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8">
              <Title level={3} className="text-2xl font-semibold text-gray-900 dark:text-white">
                Investor Dashboard
              </Title>
              <Text className="text-gray-600 dark:text-gray-400">
                Overview of your investments and updates
              </Text>
            </motion.div>

            {loading && (
              <motion.div variants={itemVariants}>
                <Text className="text-gray-600 dark:text-gray-400">Loading...</Text>
              </motion.div>
            )}
            {error && (
              <motion.div variants={itemVariants}>
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </motion.div>
            )}
            {investorData && (
              <>
                {/* Summary Card */}
                <motion.div variants={itemVariants} className="mb-6">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Text className="text-gray-600 dark:text-gray-400">Total Invested</Text>
                        <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${investorData.totalInvested.toLocaleString()}
                        </Text>
                      </div>
                      <div>
                        <Text className="text-gray-600 dark:text-gray-400">Investor</Text>
                        <Text className="text-lg font-medium">{investorData.name}</Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 block">{investorData.email}</Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <Tabs
                  defaultActiveKey="investments"
                  className="investor-dashboard-tabs"
                  tabBarStyle={{
                    borderBottom: '1px solid #e5e7eb',
                    color: '#374151',
                    fontWeight: 500,
                  }}
                >
                  <TabPane
                    tab={
                      <span className="flex items-center space-x-2">
                        <span>$</span>
                        <Text>Investments</Text>
                      </span>
                    }
                    key="investments"
                  >
                    <motion.div variants={itemVariants}>
                      <Card
                        title={<Text className="text-lg font-semibold text-gray-900 dark:text-white">Investment History</Text>}
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                      >
                        <Table
                          columns={columns}
                          dataSource={dataSource}
                          pagination={{ pageSize: 5 }}
                          rowKey="key"
                          className="investor-dashboard-table"
                        />
                      </Card>
                    </motion.div>
                  </TabPane>

                  <TabPane
                    tab={
                      <span className="flex items-center space-x-2">
                        <span>📄</span>
                        <Text>Quarterly Updates</Text>
                      </span>
                    }
                    key="updates"
                  >
                    <motion.div variants={itemVariants}>
                      <Card
                        title={<Text className="text-lg font-semibold text-gray-900 dark:text-white">Quarterly Updates & Financial Reports</Text>}
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                      >
                        {quarterlyUpdates.length > 0 ? (
                          quarterlyUpdates.map((update, index) => (
                            <Card
                              key={index}
                              className="mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <Text strong className="text-gray-900 dark:text-white">{update.title}</Text>
                              <Text className="text-gray-600 dark:text-gray-400 block">
                                Published: {new Date(update.publishedAt).toLocaleDateString()}
                              </Text>
                              <Text className="text-gray-600 dark:text-gray-400">{update.summary}</Text>
                              {update.reportUrl && (
                                <Button
                                  type="link"
                                  href={update.reportUrl}
                                  target="_blank"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2"
                                >
                                  View Full Report
                                </Button>
                              )}
                            </Card>
                          ))
                        ) : (
                          <Text className="text-gray-600 dark:text-gray-400">No updates available yet.</Text>
                        )}
                      </Card>
                    </motion.div>
                  </TabPane>
                </Tabs>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} GimaCapital. All rights reserved. Licensed and regulated.
            </Text>
            <Space>
              <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                Terms of Service
              </Link>
              <Link to="/risk" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                Risk Disclosure
              </Link>
            </Space>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InvestorDashboard;