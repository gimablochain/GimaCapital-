


// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Modal, Form, Input, Checkbox, Button, Card, Typography, Space, Alert, message } from 'antd';
// import { DollarSign, Bitcoin, CreditCard, Wallet, Copy, CheckCircle, ArrowRight, ArrowLeft, Shield, Clock, AlertCircle } from 'lucide-react';

// import PropTypes from 'prop-types';

// const { Title, Text, Paragraph } = Typography;

// const PaymentModal = ({
//   isOpen,
//   onClose,
//   investmentAmount = 0,
//   investorType = 'Unknown Investor'
// }) => {
//   const [form] = Form.useForm();
//   const [selectedCurrency, setSelectedCurrency] = useState('USD');
//   const [paymentStep, setPaymentStep] = useState('details');

//   const currencies = [
//     {
//       code: 'USD',
//       name: 'US Dollar',
//       icon: DollarSign,
//       color: 'emerald',
//       methods: ['stripe', 'wire', 'ach'],
//       processingTime: '1-3 business days',
//       fees: '2.9% + $0.30'
//     },
//     {
//       code: 'BTC',
//       name: 'Bitcoin',
//       icon: Bitcoin,
//       color: 'orange',
//       methods: ['wallet'],
//       processingTime: '10-60 minutes',
//       fees: 'Network fees only'
//     },
//     {
//       code: 'USDT',
//       name: 'Tether USD',
//       icon: Wallet,
//       color: 'teal',
//       methods: ['wallet'],
//       processingTime: '5-30 minutes',
//       fees: 'Network fees only'
//     }
//   ];

//   const paymentMethods = {
//     stripe: {
//       name: 'Credit/Debit Card',
//       icon: CreditCard,
//       description: 'Secure payment via Stripe'
//     },
//     wire: {
//       name: 'Wire Transfer',
//       icon: DollarSign,
//       description: 'Direct bank wire transfer'
//     },
//     ach: {
//       name: 'ACH Transfer', 
//       icon: DollarSign,
//       description: 'US bank account transfer'
//     },
//     wallet: {
//       name: 'Crypto Wallet',
//       icon: Wallet,
//       description: 'Send from your crypto wallet'
//     }
//   };

//   const walletAddresses = {
//     BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
//     USDT: '0x742d35Cc6634C0532925a3b8D65391444444444'
//   };

//   const handleCurrencySelect = (currency) => {
//     setSelectedCurrency(currency);
//     setPaymentStep('payment');
//   };

//   const handlePaymentMethod = (method) => {
//     if (method === 'stripe') {
//       handleStripePayment();
//     } else if (method === 'wallet') {
//       setPaymentStep('confirmation');
//     } else {
//       handleBankTransfer(method);
//     }
//   };

//   const handleStripePayment = () => {
//     console.log('Initializing Stripe payment...', form.getFieldsValue());
//     setPaymentStep('confirmation');
//   };

//   const handleBankTransfer = (method) => {
//     console.log(`Initializing ${method} payment...`, form.getFieldsValue());
//     setPaymentStep('confirmation');
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       message.success('Address copied to clipboard!');
//     });
//   };

//   const renderDetailsStep = () => (
//     <div>
//       <Title level={3} className="text-center mb-2">Enter Your Details</Title>
//       <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
//         Please provide your information to proceed with the investment.
//       </Paragraph>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={() => setPaymentStep('currency')}
//       >
//         <Form.Item
//           name="name"
//           label="Full Name"
//           rules={[{ required: true, message: 'Please enter your full name' }]}
//         >
//           <Input
//             placeholder="Enter your full name"
//             className="rounded-lg"
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label="Email"
//           rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
//         >
//           <Input
//             placeholder="Enter your email"
//             className="rounded-lg"
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="phone"
//           label="Phone"
//         >
//           <Input
//             placeholder="Enter your phone number"
//             className="rounded-lg"
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="accreditedInvestor"
//           valuePropName="checked"
//           rules={[{ required: true, message: 'You must confirm accredited investor status' }]}
//         >
//           <Checkbox>I confirm I am an accredited investor</Checkbox>
//         </Form.Item>
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//           >
//             Continue to Payment
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );

//   const renderCurrencyStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('details')}
//           type="text"
//         />
//         <div>
//           <Title level={3}>Choose Payment Currency</Title>
//           <Paragraph className="text-gray-600 dark:text-gray-300">
//             Select your preferred payment method
//           </Paragraph>
//         </div>
//       </Space>
//       <Space direction="vertical" size="middle" className="w-full">
//         {currencies.map((currency) => {
//           const IconComponent = currency.icon;
//           return (
//             <Card
//               key={currency.code}
//               hoverable
//               onClick={() => handleCurrencySelect(currency.code)}
//               className={`border-2 ${
//                 currency.color === 'emerald' // Fixed: Ensure 'emerald' is properly quoted
//                   ? 'border-emerald-200 hover:border-emerald-400'
//                   : currency.color === 'orange'
//                   ? 'border-orange-200 hover:border-orange-400'
//                   : 'border-teal-200 hover:border-teal-400'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <Space>
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//                     currency.color === 'emerald'
//                       ? 'bg-emerald-500'
//                       : currency.color === 'orange'
//                       ? 'bg-orange-500'
//                       : 'bg-teal-500'
//                   }`}>
//                     <IconComponent className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <Text strong className="text-lg">{currency.name}</Text>
//                     <br />
//                     <Text type="secondary">{currency.code}</Text>
//                   </div>
//                 </Space>
//                 <ArrowRight className="w-6 h-6 text-gray-400" />
//               </div>
//               <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                 <Space>
//                   <Clock size={16} className="text-gray-500" />
//                   <Text type="secondary">{currency.processingTime}</Text>
//                 </Space>
//                 <Space>
//                   <DollarSign size={16} className="text-gray-500" />
//                   <Text type="secondary">{currency.fees}</Text>
//                 </Space>
//               </div>
//             </Card>
//           );
//         })}
//       </Space>
//     </div>
//   );

//   const renderPaymentStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('currency')}
//           type="text"
//         />
//         <div>
//           <Title level={3}>Payment Method</Title>
//           <Paragraph className="text-gray-600 dark:text-gray-300">
//             {selectedCurrency} • ${investmentAmount.toLocaleString()}
//           </Paragraph>
//         </div>
//       </Space>
//       <Space direction="vertical" size="middle" className="w-full">
//         {currencies
//           .find(c => c.code === selectedCurrency)
//           ?.methods.map((method) => {
//             const methodInfo = paymentMethods[method];
//             const IconComponent = methodInfo.icon;
//             return (
//               <Card
//                 key={method}
//                 hoverable
//                 onClick={() => handlePaymentMethod(method)}
//                 className="border-2 border-gray-200 hover:border-emerald-400" // Fixed: Properly closed string
//               >
//                 <div className="flex items-center justify-between">
//                   <Space>
//                     <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
//                       <IconComponent className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <Text strong className="text-lg">{methodInfo.name}</Text>
//                       <br />
//                       <Text type="secondary">{methodInfo.description}</Text>
//                     </div>
//                   </Space>
//                   <ArrowRight className="w-6 h-6 text-gray-400" />
//                 </div>
//               </Card>
//             );
//           })}
//       </Space>
//     </div>
//   );

//   const renderConfirmationStep = () => (
//     <div>
//       <div className="text-center mb-8">
//         <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
//         <Title level={3}>Payment Instructions</Title>
//         <Paragraph className="text-gray-600 dark:text-gray-300">
//           Complete your ${investmentAmount.toLocaleString()} investment in {selectedCurrency}
//         </Paragraph>
//       </div>

//       {(selectedCurrency === 'BTC' || selectedCurrency === 'USDT') && (
//         <Card className="mb-6">
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Wallet className="w-6 h-6 text-emerald-500" />
//             <Text strong className="text-lg">Send {selectedCurrency} to this address:</Text>
//           </Space>
//           <Card className="bg-gray-50 dark:bg-gray-700">
//             <Space className="flex justify-between items-center">
//               <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//               <Button
//                 icon={<Copy size={16} />}
//                 onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//                 className="bg-emerald-100 hover:bg-emerald-200" // Fixed: Properly closed string
//               />
//             </Space>
//           </Card>
//           <Alert
//             message="Important"
//             description={
//               <ul className="text-xs space-y-1">
//                 <li>Send exactly ${investmentAmount.toLocaleString()} worth of {selectedCurrency}</li>
//                 <li>Use only {selectedCurrency === 'USDT' ? 'ERC-20' : 'native Bitcoin'} network</li>
//                 <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//                 <li>Keep transaction hash for your records</li>
//               </ul>
//             }
//             type="warning"
//             showIcon
//             icon={<AlertCircle size={20} />}
//             className="mt-4"
//           />
//         </Card>
//       )}

//       {selectedCurrency === 'USD' && (
//         <Card className="mb-6">
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Shield className="w-6 h-6 text-emerald-500" />
//             <Text strong className="text-lg">Secure Payment Processing</Text>
//           </Space>
//           <Paragraph className="text-sm text-gray-600 dark:text-gray-300">
//             Your payment is being processed securely through our payment partner.<br />
//             You will receive a confirmation email within 24 hours to {form.getFieldValue('email') || 'your email'}.<br />
//             For wire transfers, please contact our investment team for banking details.
//           </Paragraph>
//         </Card>
//       )}

//       <Card className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
//         <Text strong className="text-lg">What happens next?</Text>
//         <ul className="text-sm text-emerald-700 dark:text-emerald-300 mt-3 space-y-2">
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Investment team will verify your payment
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Legal documents will be sent for signing
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Welcome package with investor portal access
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Quarterly updates and financial reports
//           </li>
//         </ul>
//       </Card>

//       <Space className="w-full">
//         <Button
//           type="primary"
//           size="large"
//           onClick={onClose}
//           className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700" // Fixed: Properly closed string
//         >
//           Done
//         </Button>
//         <Button
//           size="large"
//           onClick={() => message.info('Contact support at investment@gimacapital.com')}
//           className="border-gray-300 dark:border-gray-600" // Fixed: Properly closed string
//         >
//           Contact Support
//         </Button>
//       </Space>
//     </div>
//   );

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={600}
//       className="dark:bg-gray-900" // Fixed: Properly closed string
//       title={
//         <div>
//           <Title level={2}>Complete Investment</Title>
//           <Text type="secondary">{investorType} • ${investmentAmount.toLocaleString()}</Text>
//         </div>
//       }
//     >
//       {paymentStep === 'details' && renderDetailsStep()}
//       {paymentStep === 'currency' && renderCurrencyStep()}
//       {paymentStep === 'payment' && renderPaymentStep()}
//       {paymentStep === 'confirmation' && renderConfirmationStep()}
//     </Modal>
//   );
// };

// PaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   investmentAmount: PropTypes.number,
//   investorType: PropTypes.string,
// };

// const InvestmentButton = ({
//   investorType,
//   minInvestment = '$0',
//   maxInvestors = 1
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const investmentAmount = minInvestment && typeof minInvestment === 'string'
//     ? parseInt(minInvestment.replace(/[^0-9]/g, ''), 10)
//     : 0;

//   return (
//     <>
//       <motion.button
//         whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }} // Fixed: Properly closed string
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsModalOpen(true)}
//         className="relative group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-bold text-sm overflow-hidden w-full" // Fixed: Properly closed string
//       >
//         <DollarSign className="w-4 h-4" />
//         <span className="relative z-10">
//           Invest Now - {minInvestment}
//         </span>
//         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//         <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//       </motion.button>

//       <PaymentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         investmentAmount={investmentAmount}
//         investorType={investorType}
//       />
//     </>
//   );
// };

// InvestmentButton.propTypes = {
//   investorType: PropTypes.string.isRequired,
//   minInvestment: PropTypes.string,
//   maxInvestors: PropTypes.number,
// };

// const InvestmentPaymentSystem = () => {
//   const { state } = useLocation();

//   const investorType = state?.investorType || 'Unknown Investor';
//   const minInvestment = state?.minInvestment || '$0';
//   const maxInvestors = state?.maxInvestors || 1;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white p-4" // Fixed: Properly closed string
//     >
//       <h1 className="text-3xl font-black text-center mb-8">Investment Payment System</h1>
//       <div className="max-w-md mx-auto">
//         <InvestmentButton
//           investorType={investorType}
//           minInvestment={minInvestment}
//           maxInvestors={maxInvestors}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default InvestmentPaymentSystem;
// export { InvestmentButton };





// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Modal, Form,  Input, Checkbox, Button, Card, Typography, Space, Alert, message } from 'antd';
// import { DollarSign, Bitcoin, CreditCard, Wallet, Copy, CheckCircle, ArrowRight, ArrowLeft, Shield, Clock, AlertCircle } from 'lucide-react';
// import axios from 'axios';
// import PropTypes from 'prop-types';

// const { Title, Text, Paragraph } = Typography;

// const API_BASE_URL = 'http://localhost:5000';

// const PaymentModal = ({
//   isOpen,
//   onClose,
//   investmentAmount = 0,
//   investorType = 'Unknown Investor',
//   theme = 'light',
// }) => {
//   const [form] = Form.useForm();
//   const [selectedCurrency, setSelectedCurrency] = useState('USD');
//   const [paymentStep, setPaymentStep] = useState('details');
//   const [transactionData, setTransactionData] = useState(null);
//   const [error, setError] = useState(null);

//   const currencies = [
//     {
//       code: 'USD',
//       name: 'US Dollar',
//       icon: DollarSign,
//       color: 'emerald',
//       methods: ['stripe', 'wire', 'ach'],
//       processingTime: '1-3 business days',
//       fees: '2.9% + $0.30',
//     },
//     {
//       code: 'BTC',
//       name: 'Bitcoin',
//       icon: Bitcoin,
//       color: 'orange',
//       methods: ['wallet'],
//       processingTime: '10-60 minutes',
//       fees: 'Network fees only',
//     },
//     {
//       code: 'USDT',
//       name: 'Tether USD',
//       icon: Wallet,
//       color: 'teal',
//       methods: ['wallet'],
//       processingTime: '5-30 minutes',
//       fees: 'Network fees only',
//     },
//   ];

//   const paymentMethods = {
//     stripe: {
//       name: 'Credit/Debit Card',
//       icon: CreditCard,
//       description: 'Secure payment via Stripe',
//     },
//     wire: {
//       name: 'Wire Transfer',
//       icon: DollarSign,
//       description: 'Direct bank wire transfer',
//     },
//     ach: {
//       name: 'ACH Transfer',
//       icon: DollarSign,
//       description: 'US bank account transfer',
//     },
//     wallet: {
//       name: 'Crypto Wallet',
//       icon: Wallet,
//       description: 'Send from your crypto wallet',
//     },
//   };

//   const walletAddresses = {
//     BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
//     USDT: '0x742d35Cc6634C0532925a3b8D65391444444444',
//   };

//   const handleCurrencySelect = (currency) => {
//     setSelectedCurrency(currency);
//     setPaymentStep('payment');
//   };

//   const handlePaymentMethod = async (method) => {
//     try {
//       if (method === 'stripe') {
//         console.log('Initializing Stripe payment...', form.getFieldsValue());
//         setPaymentStep('confirmation');
//       } else if (method === 'wallet') {
//         const formData = form.getFieldsValue();
//         const { name, email, phone, accreditedInvestor, transactionHash } = formData;

//         if (!transactionHash) {
//           setError('Please provide a transaction hash');
//           return;
//         }

//         const response = await axios.post(`${API_BASE_URL}/api/payment/save-investor`, {
//           name,
//           email,
//           phone,
//           accreditedInvestor,
//           transactionHash,
//           currency: selectedCurrency,
//           amount: investmentAmount,
//         });

//         setTransactionData(response.data);
//         setPaymentStep('confirmation');
//       } else {
//         console.log(`Initializing ${method} payment...`, form.getFieldsValue());
//         setPaymentStep('confirmation');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       message.success('Address copied to clipboard!');
//     });
//   };

//   const renderDetailsStep = () => (
//     <div>
//       <Title level={3} className="text-center mb-2">Enter Your Details</Title>
//       <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
//         Please provide your information to proceed with the investment.
//       </Paragraph>
//       {error && (
//         <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={() => setPaymentStep('currency')}
//       >
//         <Form.Item
//           name="name"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Full Name</span>}
//           rules={[{ required: true, message: 'Please enter your full name' }]}
//         >
//           <Input
//             placeholder="Enter your full name"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//           rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
//         >
//           <Input
//             placeholder="Enter your email"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="phone"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Phone</span>}
//         >
//           <Input
//             placeholder="Enter your phone number"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="accreditedInvestor"
//           valuePropName="checked"
//           rules={[{ required: true, message: 'You must confirm accredited investor status' }]}
//         >
//           <Checkbox>I confirm I am an accredited investor</Checkbox>
//         </Form.Item>
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700 ${theme === 'dark' ? 'text-white' : 'text-white'}`}
//           >
//             Continue to Payment
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );

//   const renderCurrencyStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('details')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Choose Payment Currency</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Select your preferred currency for the ${investmentAmount.toLocaleString()} investment.
//           </Paragraph>
//         </div>
//       </Space>
//       <Space direction="vertical" size="middle" className="w-full">
//         {currencies.map((currency) => {
//           const IconComponent = currency.icon;
//           return (
//             <Card
//               key={currency.code}
//               hoverable
//               onClick={() => handleCurrencySelect(currency.code)}
//               className={`border-2 ${
//                 currency.color === 'emerald'
//                   ? 'border-emerald-200 hover:border-emerald-400'
//                   : currency.color === 'orange'
//                   ? 'border-orange-200 hover:border-orange-400'
//                   : 'border-teal-200 hover:border-teal-400'
//               } ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
//             >
//               <div className="flex items-center justify-between">
//                 <Space>
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//                     currency.color === 'emerald'
//                       ? 'bg-emerald-500'
//                       : currency.color === 'orange'
//                       ? 'bg-orange-500'
//                       : 'bg-teal-500'
//                   }`}>
//                     <IconComponent className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currency.name}</Text>
//                     <br />
//                     <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.code}</Text>
//                   </div>
//                 </Space>
//                 <ArrowRight className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
//               </div>
//               <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                 <Space>
//                   <Clock size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.processingTime}</Text>
//                 </Space>
//                 <Space>
//                   <DollarSign size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.fees}</Text>
//                 </Space>
//               </div>
//             </Card>
//           );
//         })}
//       </Space>
//     </div>
//   );

//   const renderPaymentStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('currency')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Payment Method</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             {selectedCurrency} • ${investmentAmount.toLocaleString()}
//           </Paragraph>
//         </div>
//       </Space>
//       {selectedCurrency === 'BTC' || selectedCurrency === 'USDT' ? (
//         <div>
//           {error && (
//             <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//           )}
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={() => handlePaymentMethod('wallet')}
//           >
//             <Form.Item
//               name="transactionHash"
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash</span>}
//               rules={[{ required: true, message: 'Please enter the transaction hash' }]}
//             >
//               <Input
//                 placeholder="Enter transaction hash"
//                 className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//                 size="large"
//               />
//             </Form.Item>
//             <Space className="w-full justify-between">
//               <Button
//                 size="large"
//                 onClick={() => setPaymentStep('currency')}
//                 className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//                 icon={<ArrowLeft size={16} />}
//               >
//                 Back
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 size="large"
//                 className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//               >
//                 Submit Payment
//               </Button>
//             </Space>
//           </Form>
//         </div>
//       ) : (
//         <Space direction="vertical" size="middle" className="w-full">
//           {currencies
//             .find(c => c.code === selectedCurrency)
//             ?.methods.map((method) => {
//               const methodInfo = paymentMethods[method];
//               const IconComponent = methodInfo.icon;
//               return (
//                 <Card
//                   key={method}
//                   hoverable
//                   onClick={() => handlePaymentMethod(method)}
//                   className={`border-2 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} hover:border-emerald-400`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <Space>
//                       <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
//                         <IconComponent className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{methodInfo.name}</Text>
//                         <br />
//                         <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{methodInfo.description}</Text>
//                       </div>
//                     </Space>
//                     <ArrowRight className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
//                   </div>
//                 </Card>
//               );
//             })}
//         </Space>
//       )}
//     </div>
//   );

//   const renderConfirmationStep = () => (
//     <div>
//       <div className="text-center mb-8">
//         <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
//         <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Payment Submitted</Title>
//         <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//           Your ${investmentAmount.toLocaleString()} investment in {selectedCurrency} has been submitted for verification.
//         </Paragraph>
//       </div>

//       {(selectedCurrency === 'BTC' || selectedCurrency === 'USDT') && (
//         <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Wallet className="w-6 h-6 text-emerald-500" />
//             <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Details</Text>
//           </Space>
//           <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//             <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash:</Text>
//             <Text code className="text-sm break-all">{transactionData?.transactionHash || 'N/A'}</Text>
//             <Button
//               type="link"
//               href={
//                 selectedCurrency === 'BTC'
//                   ? `https://blockchain.info/tx/${transactionData?.transactionHash}`
//                   : `https://etherscan.io/tx/${transactionData?.transactionHash}`
//               }
//               target="_blank"
//               className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
//             >
//               View on Blockchain
//             </Button>
//           </Card>
//           <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//             <Space className="flex justify-between items-center">
//               <div>
//                 <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Wallet Address:</Text>
//                 <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//               </div>
//               <Button
//                 icon={<Copy size={16} />}
//                 onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//                 className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
//               />
//             </Space>
//           </Card>
//           <Alert
//             message="Important"
//             description={
//               <ul className="text-xs space-y-1">
//                 <li>Send exactly ${investmentAmount.toLocaleString()} worth of {selectedCurrency}</li>
//                 <li>Use only {selectedCurrency === 'USDT' ? 'ERC-20' : 'native Bitcoin'} network</li>
//                 <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//                 <li>Keep transaction hash for your records</li>
//               </ul>
//             }
//             type="warning"
//             showIcon
//             icon={<AlertCircle size={20} />}
//             className="mt-4"
//           />
//         </Card>
//       )}

//       {selectedCurrency === 'USD' && (
//         <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Shield className="w-6 h-6 text-emerald-500" />
//             <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Secure Payment Processing</Text>
//           </Space>
//           <Paragraph className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//             Your payment is being processed securely through our payment partner.<br />
//             You will receive a confirmation email within 24 hours to {form.getFieldValue('email') || 'your email'}.<br />
//             For wire transfers, please contact our investment team for banking details.
//           </Paragraph>
//         </Card>
//       )}

//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
//         <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What happens next?</Text>
//         <ul className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} mt-3 space-y-2`}>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Investment team will verify your payment
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Legal documents will be sent for signing
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Welcome package with investor portal access
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Quarterly updates and financial reports
//           </li>
//         </ul>
//       </Card>

//       <Space className="w-full">
//         <Button
//           type="primary"
//           size="large"
//           onClick={onClose}
//           className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//         >
//           Done
//         </Button>
//         <Button
//           size="large"
//           onClick={() => message.info('Contact support at investment@gimacapital.com')}
//           className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//         >
//           Contact Support
//         </Button>
//       </Space>
//     </div>
//   );

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={600}
//       className={theme === 'dark' ? 'dark:bg-slate-900' : ''}
//       title={
//         <div>
//           <Title level={2} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Complete Investment</Title>
//           <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{investorType} • ${investmentAmount.toLocaleString()}</Text>
//         </div>
//       }
//     >
//       {paymentStep === 'details' && renderDetailsStep()}
//       {paymentStep === 'currency' && renderCurrencyStep()}
//       {paymentStep === 'payment' && renderPaymentStep()}
//       {paymentStep === 'confirmation' && renderConfirmationStep()}
//     </Modal>
//   );
// };

// PaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   investmentAmount: PropTypes.number,
//   investorType: PropTypes.string,
//   theme: PropTypes.string,
// };

// const InvestmentButton = ({
//   investorType,
//   minInvestment = '$0',
//   maxInvestors = 1,
//   theme = 'light',
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const investmentAmount = minInvestment && typeof minInvestment === 'string'
//     ? parseInt(minInvestment.replace(/[^0-9]/g, ''), 10)
//     : 0;

//   return (
//     <>
//       <motion.button
//         whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsModalOpen(true)}
//         className={`relative group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-bold text-sm overflow-hidden w-full ${theme === 'dark' ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-700' : ''}`}
//       >
//         <DollarSign className="w-4 h-4" />
//         <span className="relative z-10">
//           Invest Now - {minInvestment}
//         </span>
//         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//         <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//       </motion.button>

//       <PaymentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         investmentAmount={investmentAmount}
//         investorType={investorType}
//         theme={theme}
//       />
//     </>
//   );
// };

// InvestmentButton.propTypes = {
//   investorType: PropTypes.string.isRequired,
//   minInvestment: PropTypes.string,
//   maxInvestors: PropTypes.number,
//   theme: PropTypes.string,
// };

// const InvestmentPaymentSystem = () => {
//   const { state } = useLocation();

//   const investorType = state?.investorType || 'Unknown Investor';
//   const minInvestment = state?.minInvestment || '$0';
//   const maxInvestors = state?.maxInvestors || 1;
//   const theme = state?.theme || 'light'; // Pass theme from router state or default to light

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900'}`}
//     >
//       <h1 className="text-3xl font-black text-center mb-8">Investment Payment System</h1>
//       <div className="max-w-md mx-auto">
//         <InvestmentButton
//           investorType={investorType}
//           minInvestment={minInvestment}
//           maxInvestors={maxInvestors}
//           theme={theme}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default InvestmentPaymentSystem;
// export { InvestmentButton };





// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Modal, Form, Input, Checkbox, Button, Card, Typography, Space, Alert, message } from 'antd';
// import { DollarSign, Bitcoin, CreditCard, Wallet, Copy, CheckCircle, ArrowRight, ArrowLeft, Shield, Clock, AlertCircle } from 'lucide-react';
// import axios from 'axios';
// import PropTypes from 'prop-types';

// const { Title, Text, Paragraph } = Typography;

// const API_BASE_URL = 'http://localhost:5000';

// const PaymentModal = ({
//   isOpen,
//   onClose,
//   investmentAmount = 0,
//   investorType = 'Unknown Investor',
//   theme = 'light',
// }) => {
//   const [form] = Form.useForm();
//   const [selectedCurrency, setSelectedCurrency] = useState('USD');
//   const [paymentStep, setPaymentStep] = useState('details');
//   const [transactionData, setTransactionData] = useState(null);
//   const [error, setError] = useState(null);

//   const currencies = [
//     {
//       code: 'USD',
//       name: 'US Dollar',
//       icon: DollarSign,
//       color: 'emerald',
//       methods: ['stripe', 'wire', 'ach'],
//       processingTime: '1-3 business days',
//       fees: '2.9% + $0.30',
//     },
//     {
//       code: 'BTC',
//       name: 'Bitcoin',
//       icon: Bitcoin,
//       color: 'orange',
//       methods: ['wallet'],
//       processingTime: '10-60 minutes',
//       fees: 'Network fees only',
//     },
//     {
//       code: 'USDT',
//       name: 'Tether USD',
//       icon: Wallet,
//       color: 'teal',
//       methods: ['wallet'],
//       processingTime: '5-30 minutes',
//       fees: 'Network fees only',
//     },
//   ];

//   const paymentMethods = {
//     stripe: {
//       name: 'Credit/Debit Card',
//       icon: CreditCard,
//       description: 'Secure payment via Stripe',
//     },
//     wire: {
//       name: 'Wire Transfer',
//       icon: DollarSign,
//       description: 'Direct bank wire transfer',
//     },
//     ach: {
//       name: 'ACH Transfer',
//       icon: DollarSign,
//       description: 'US bank account transfer',
//     },
//     wallet: {
//       name: 'Crypto Wallet',
//       icon: Wallet,
//       description: 'Send from your crypto wallet',
//     },
//   };

//   const walletAddresses = {
//     BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
//     USDT: '0x742d35Cc6634C0532925a3b8D65391444444444',
//   };

//   const handleCurrencySelect = (currency) => {
//     setSelectedCurrency(currency);
//     if (currency === 'BTC' || currency === 'USDT') {
//       setPaymentStep('deposit');
//     } else {
//       setPaymentStep('payment');
//     }
//   };

//   const handlePaymentMethod = async (method) => {
//     try {
//       setError(null);
//       if (method === 'stripe') {
//         console.log('Initializing Stripe payment...', form.getFieldsValue());
//         setPaymentStep('confirmation');
//       } else if (method === 'wallet') {
//         const formData = form.getFieldsValue();
//         const { name, email, phone, accreditedInvestor, transactionHash } = formData;

//         if (!transactionHash) {
//           setError('Please provide a transaction hash');
//           return;
//         }

//         const response = await axios.post(`${API_BASE_URL}/api/payment/save-investor`, {
//           name,
//           email,
//           phone,
//           accreditedInvestor,
//           transactionHash,
//           currency: selectedCurrency,
//           amount: investmentAmount,
//         });

//         setTransactionData(response.data);
//         setPaymentStep('confirmation');
//       } else {
//         console.log(`Initializing ${method} payment...`, form.getFieldsValue());
//         setPaymentStep('confirmation');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       message.success('Address copied to clipboard!');
//     });
//   };

//   const renderDetailsStep = () => (
//     <div>
//       <Title level={3} className="text-center mb-2">Enter Your Details</Title>
//       <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
//         Please provide your information to proceed with the investment.
//       </Paragraph>
//       {error && (
//         <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={() => setPaymentStep('currency')}
//       >
//         <Form.Item
//           name="name"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Full Name</span>}
//           rules={[{ required: true, message: 'Please enter your full name' }]}
//         >
//           <Input
//             placeholder="Enter your full name"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//           rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
//         >
//           <Input
//             placeholder="Enter your email"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="phone"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Phone</span>}
//         >
//           <Input
//             placeholder="Enter your phone number"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="accreditedInvestor"
//           valuePropName="checked"
//           rules={[{ required: true, message: 'You must confirm accredited investor status' }]}
//         >
//           <Checkbox>I confirm I am an accredited investor</Checkbox>
//         </Form.Item>
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700 ${theme === 'dark' ? 'text-white' : 'text-white'}`}
//           >
//             Continue to Payment
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );

//   const renderCurrencyStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('details')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Choose Payment Currency</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Select your preferred currency for the ${investmentAmount.toLocaleString()} investment.
//           </Paragraph>
//         </div>
//       </Space>
//       <Space direction="vertical" size="middle" className="w-full">
//         {currencies.map((currency) => {
//           const IconComponent = currency.icon;
//           return (
//             <Card
//               key={currency.code}
//               hoverable
//               onClick={() => handleCurrencySelect(currency.code)}
//               className={`border-2 ${
//                 currency.color === 'emerald'
//                   ? 'border-emerald-200 hover:border-emerald-400'
//                   : currency.color === 'orange'
//                   ? 'border-orange-200 hover:border-orange-400'
//                   : 'border-teal-200 hover:border-teal-400'
//               } ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
//             >
//               <div className="flex items-center justify-between">
//                 <Space>
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//                     currency.color === 'emerald'
//                       ? 'bg-emerald-500'
//                       : currency.color === 'orange'
//                       ? 'bg-orange-500'
//                       : 'bg-teal-500'
//                   }`}>
//                     <IconComponent className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currency.name}</Text>
//                     <br />
//                     <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.code}</Text>
//                   </div>
//                 </Space>
//                 <ArrowRight className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
//               </div>
//               <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                 <Space>
//                   <Clock size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.processingTime}</Text>
//                 </Space>
//                 <Space>
//                   <DollarSign size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.fees}</Text>
//                 </Space>
//               </div>
//             </Card>
//           );
//         })}
//       </Space>
//     </div>
//   );

//   const renderDepositStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('currency')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Deposit {selectedCurrency}</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Send ${investmentAmount.toLocaleString()} in {selectedCurrency} to the address below.
//           </Paragraph>
//         </div>
//       </Space>
//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//         <Space direction="horizontal" align="center" className="mb-4">
//           <Wallet className="w-6 h-6 text-emerald-500" />
//           <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Send {selectedCurrency} to this address:</Text>
//         </Space>
//         <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//           <Space className="flex justify-between items-center">
//             <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//             <Button
//               icon={<Copy size={16} />}
//               onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//               className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
//             >
//               Copy
//             </Button>
//           </Space>
//         </Card>
//         <Alert
//           message="Important"
//           description={
//             <ul className="text-xs space-y-1">
//               <li>Send exactly ${investmentAmount.toLocaleString()} worth of {selectedCurrency}</li>
//               <li>Use only {selectedCurrency === 'USDT' ? 'ERC-20' : 'native Bitcoin'} network</li>
//               <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//               <li>Keep your transaction hash for the next step</li>
//             </ul>
//           }
//           type="warning"
//           showIcon
//           icon={<AlertCircle size={20} />}
//           className="mt-4"
//         />
//       </Card>
//       <Space className="w-full justify-between">
//         <Button
//           size="large"
//           onClick={() => setPaymentStep('currency')}
//           className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//           icon={<ArrowLeft size={16} />}
//         >
//           Back
//         </Button>
//         <Button
//           type="primary"
//           size="large"
//           onClick={() => setPaymentStep('payment')}
//           className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//         >
//           I’ve Sent the Payment
//         </Button>
//       </Space>
//     </div>
//   );

//   const renderPaymentStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('deposit')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Submit Transaction Hash</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Enter the transaction hash for your ${investmentAmount.toLocaleString()} {selectedCurrency} payment.
//           </Paragraph>
//         </div>
//       </Space>
//       {error && (
//         <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={() => handlePaymentMethod('wallet')}
//       >
//         <Form.Item
//           name="transactionHash"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash</span>}
//           rules={[{ required: true, message: 'Please enter the transaction hash' }]}
//         >
//           <Input
//             placeholder="Enter transaction hash"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Space className="w-full justify-between">
//           <Button
//             size="large"
//             onClick={() => setPaymentStep('deposit')}
//             className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//             icon={<ArrowLeft size={16} />}
//           >
//             Back
//           </Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//           >
//             Submit Payment
//           </Button>
//         </Space>
//       </Form>
//     </div>
//   );

//   const renderConfirmationStep = () => (
//     <div>
//       <div className="text-center mb-8">
//         <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
//         <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Payment Submitted</Title>
//         <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//           Your ${investmentAmount.toLocaleString()} investment in {selectedCurrency} has been submitted for verification.
//         </Paragraph>
//       </div>

//       {(selectedCurrency === 'BTC' || selectedCurrency === 'USDT') && (
//         <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Wallet className="w-6 h-6 text-emerald-500" />
//             <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Details</Text>
//           </Space>
//           <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//             <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash:</Text>
//             <Text code className="text-sm break-all">{transactionData?.transactionHash || 'N/A'}</Text>
//             <Button
//               type="link"
//               href={
//                 selectedCurrency === 'BTC'
//                   ? `https://blockchain.info/tx/${transactionData?.transactionHash}`
//                   : `https://etherscan.io/tx/${transactionData?.transactionHash}`
//               }
//               target="_blank"
//               className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
//             >
//               View on Blockchain
//             </Button>
//           </Card>
//           <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//             <Space className="flex justify-between items-center">
//               <div>
//                 <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Wallet Address:</Text>
//                 <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//               </div>
//               <Button
//                 icon={<Copy size={16} />}
//                 onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//                 className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
//               />
//             </Space>
//           </Card>
//           <Alert
//             message="Important"
//             description={
//               <ul className="text-xs space-y-1">
//                 <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//                 <li>Keep transaction hash for your records</li>
//               </ul>
//             }
//             type="info"
//             showIcon
//             icon={<AlertCircle size={20} />}
//             className="mt-4"
//           />
//         </Card>
//       )}

//       {selectedCurrency === 'USD' && (
//         <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//           <Space direction="horizontal" align="center" className="mb-4">
//             <Shield className="w-6 h-6 text-emerald-500" />
//             <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Secure Payment Processing</Text>
//           </Space>
//           <Paragraph className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
//             Your payment is being processed securely through our payment partner.<br />
//             You will receive a confirmation email within 24 hours to {form.getFieldValue('email') || 'your email'}.<br />
//             For wire transfers, please contact our investment team for banking details.
//           </Paragraph>
//         </Card>
//       )}

//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
//         <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What happens next?</Text>
//         <ul className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} mt-3 space-y-2`}>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Investment team will verify your payment
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Legal documents will be sent for signing
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Welcome package with investor portal access
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Quarterly updates and financial reports
//           </li>
//         </ul>
//       </Card>

//       <Space className="w-full">
//         <Button
//           type="primary"
//           size="large"
//           onClick={onClose}
//           className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//         >
//           Done
//         </Button>
//         <Button
//           size="large"
//           onClick={() => message.info('Contact support at investment@gimacapital.com')}
//           className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//         >
//           Contact Support
//         </Button>
//       </Space>
//     </div>
//   );

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={600}
//       className={theme === 'dark' ? 'dark:bg-slate-900' : ''}
//       title={
//         <div>
//           <Title level={2} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Complete Investment</Title>
//           <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{investorType} • ${investmentAmount.toLocaleString()}</Text>
//         </div>
//       }
//     >
//       {paymentStep === 'details' && renderDetailsStep()}
//       {paymentStep === 'currency' && renderCurrencyStep()}
//       {paymentStep === 'deposit' && renderDepositStep()}
//       {paymentStep === 'payment' && renderPaymentStep()}
//       {paymentStep === 'confirmation' && renderConfirmationStep()}
//     </Modal>
//   );
// };

// PaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   investmentAmount: PropTypes.number,
//   investorType: PropTypes.string,
//   theme: PropTypes.string,
// };

// const InvestmentButton = ({
//   investorType,
//   minInvestment = '$0',
//   maxInvestors = 1,
//   theme = 'light',
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const investmentAmount = minInvestment && typeof minInvestment === 'string'
//     ? parseInt(minInvestment.replace(/[^0-9]/g, ''), 10)
//     : 0;

//   return (
//     <>
//       <motion.button
//         whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsModalOpen(true)}
//         className={`relative group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-bold text-sm overflow-hidden w-full ${theme === 'dark' ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-700' : ''}`}
//       >
//         <DollarSign className="w-4 h-4" />
//         <span className="relative z-10">
//           Invest Now - {minInvestment}
//         </span>
//         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//         <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//       </motion.button>

//       <PaymentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         investmentAmount={investmentAmount}
//         investorType={investorType}
//         theme={theme}
//       />
//     </>
//   );
// };

// InvestmentButton.propTypes = {
//   investorType: PropTypes.string.isRequired,
//   minInvestment: PropTypes.string,
//   maxInvestors: PropTypes.number,
//   theme: PropTypes.string,
// };

// const InvestmentPaymentSystem = () => {
//   const { state } = useLocation();

//   const investorType = state?.investorType || 'Unknown Investor';
//   const minInvestment = state?.minInvestment || '$0';
//   const maxInvestors = state?.maxInvestors || 1;
//   const theme = state?.theme || 'light';

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900'}`}
//     >
//       <h1 className="text-3xl font-black text-center mb-8">Investment Payment System</h1>
//       <div className="max-w-md mx-auto">
//         <InvestmentButton
//           investorType={investorType}
//           minInvestment={minInvestment}
//           maxInvestors={maxInvestors}
//           theme={theme}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default InvestmentPaymentSystem;
// export { InvestmentButton };





// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Modal, Form, Input, InputNumber, Checkbox, Button, Card, Typography, Space, Alert, message } from 'antd';
// import { Bitcoin, Wallet, Copy, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, Clock, DollarSign } from 'lucide-react';
// import axios from 'axios';
// import PropTypes from 'prop-types';

// const { Title, Text, Paragraph } = Typography;

// const API_BASE_URL = 'http://localhost:5000';

// const PaymentModal = ({
//   isOpen,
//   onClose,
//   investorType = 'Unknown Investor',
//   theme = 'light',
// }) => {
//   const [form] = Form.useForm();
//   const [selectedCurrency, setSelectedCurrency] = useState('BTC');
//   const [paymentStep, setPaymentStep] = useState('details');
//   const [transactionData, setTransactionData] = useState(null);
//   const [error, setError] = useState(null);

//   const currencies = [
//     {
//       code: 'BTC',
//       name: 'Bitcoin',
//       icon: Bitcoin,
//       color: 'orange',
//       processingTime: '10-60 minutes',
//       fees: 'Network fees only',
//     },
//     {
//       code: 'USDT',
//       name: 'Tether USD',
//       icon: Wallet,
//       color: 'teal',
//       processingTime: '5-30 minutes',
//       fees: 'Network fees only',
//     },
//   ];

//   const walletAddresses = {
//     BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
//     USDT: '0x742d35Cc6634C0532925a3b8D65391444444444',
//   };

//   // Initialize form with default values
//   useEffect(() => {
//     form.setFieldsValue({
//       name: '',
//       email: '',
//       phone: '',
//       amount: 0,
//       accreditedInvestor: true,
//       transactionHash: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
//     });
//   }, [form]);

//   const handleCurrencySelect = (currency) => {
//     setSelectedCurrency(currency);
//     setPaymentStep('deposit');
//   };

//   const handlePaymentMethod = async () => {
//     try {
//       setError(null);
//       const formData = form.getFieldsValue();
//       const { name, email, phone, accreditedInvestor, transactionHash, amount } = formData;

//       console.log('Form data in payment step:', formData); // Debug form data

//       if (!name || !email || !transactionHash || !amount) {
//         setError('Please fill in all required fields');
//         return;
//       }
//       if (!accreditedInvestor) {
//         setError('You must confirm accredited investor status');
//         return;
//       }
//       if (amount <= 0) {
//         setError('Investment amount must be greater than 0');
//         return;
//       }

//       const payload = {
//         name,
//         email,
//         phone: phone || '',
//         accreditedInvestor,
//         transactionHash,
//         currency: selectedCurrency,
//         amount: Number(amount),
//       };
//       console.log('Sending payload to backend:', payload); // Debug payload
//       const response = await axios.post(`${API_BASE_URL}/api/payment/save-investor`, payload);
//       setTransactionData(response.data);
//       setPaymentStep('confirmation');
//     } catch (err) {
//       const errorMessage = err.response?.data?.error || err.message;
//       setError(errorMessage);
//       console.error('Error submitting payment:', errorMessage);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       message.success('Address copied to clipboard!');
//     });
//   };

//   const renderDetailsStep = () => (
//     <div>
//       <Title level={3} className="text-center mb-2">Enter Your Details</Title>
//       <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
//         Please provide your information to proceed with the investment.
//       </Paragraph>
//       {error && (
//         <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={() => {
//           form.validateFields().then(() => {
//             console.log('Details step form values:', form.getFieldsValue()); // Debug form values
//             setPaymentStep('currency');
//           }).catch((err) => {
//             console.error('Validation failed:', err);
//           });
//         }}
//       >
//         <Form.Item
//           name="name"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Full Name</span>}
//           rules={[{ required: true, message: 'Please enter your full name' }]}
//           initialValue="gideon gideon"
//         >
//           <Input
//             placeholder="Enter your full name"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//           rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
//           initialValue="g4buildiokjng@gmail.com"
//         >
//           <Input
//             placeholder="Enter your email"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="phone"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Phone</span>}
//           initialValue="1234567823"
//         >
//           <Input
//             placeholder="Enter your phone number"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           name="amount"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Investment Amount</span>}
//           rules={[
//             { required: true, message: 'Please enter the investment amount' },
//             {
//               validator: (_, value) => {
//                 const numValue = Number(value);
//                 if (isNaN(numValue) || numValue <= 0) {
//                   return Promise.reject('Amount must be greater than 0');
//                 }
//                 // Optional: Enforce minimum investment of $50,000
//                 // if (numValue < 50000) {
//                 //   return Promise.reject('Amount must be at least $50,000');
//                 // }
//                 return Promise.resolve();
//               },
//             },
//           ]}
//           initialValue={6575}
//         >
//           <InputNumber
//             placeholder="Enter investment amount"
//             className={`w-full rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//             min={1}
//           />
//         </Form.Item>
//         <Form.Item
//           name="accreditedInvestor"
//           valuePropName="checked"
//           rules={[{ required: true, message: 'You must confirm accredited investor status' }]}
//           initialValue={true}
//         >
//           <Checkbox>I confirm I am an accredited investor</Checkbox>
//         </Form.Item>
//         <Space className="w-full justify-between">
//           <Button
//             size="large"
//             onClick={() => form.resetFields()}
//             className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//           >
//             Reset Form
//           </Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className={`bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700 ${theme === 'dark' ? 'text-white' : 'text-white'}`}
//           >
//             Continue to Payment
//           </Button>
//         </Space>
//       </Form>
//     </div>
//   );

//   const renderCurrencyStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('details')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Choose Payment Currency</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Select your preferred cryptocurrency for the investment.
//           </Paragraph>
//         </div>
//       </Space>
//       <Space direction="vertical" size="middle" className="w-full">
//         {currencies.map((currency) => {
//           const IconComponent = currency.icon;
//           return (
//             <Card
//               key={currency.code}
//               hoverable
//               onClick={() => handleCurrencySelect(currency.code)}
//               className={`border-2 ${
//                 currency.color === 'orange'
//                   ? 'border-orange-200 hover:border-orange-400'
//                   : 'border-teal-200 hover:border-teal-400'
//               } ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
//             >
//               <div className="flex items-center justify-between">
//                 <Space>
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//                     currency.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'
//                   }`}>
//                     <IconComponent className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currency.name}</Text>
//                     <br />
//                     <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.code}</Text>
//                   </div>
//                 </Space>
//                 <ArrowRight className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
//               </div>
//               <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                 <Space>
//                   <Clock size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.processingTime}</Text>
//                 </Space>
//                 <Space>
//                   <DollarSign size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
//                   <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.fees}</Text>
//                 </Space>
//               </div>
//             </Card>
//           );
//         })}
//       </Space>
//     </div>
//   );

//   const renderDepositStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('currency')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Deposit {selectedCurrency}</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Send {form.getFieldValue('amount')} in {selectedCurrency} to the address below.
//           </Paragraph>
//         </div>
//       </Space>
//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//         <Space direction="horizontal" align="center" className="mb-4">
//           <Wallet className="w-6 h-6 text-emerald-500" />
//           <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Send {selectedCurrency} to this address:</Text>
//         </Space>
//         <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//           <Space className="flex justify-between items-center">
//             <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//             <Button
//               icon={<Copy size={16} />}
//               onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//               className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
//             >
//               Copy
//             </Button>
//           </Space>
//         </Card>
//         <Alert
//           message="Important"
//           description={
//             <ul className="text-xs space-y-1">
//               <li>Send exactly {form.getFieldValue('amount')} worth of {selectedCurrency}</li>
//               <li>Use only {selectedCurrency === 'USDT' ? 'ERC-20' : 'native Bitcoin'} network</li>
//               <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//               <li>Keep your transaction hash for the next step</li>
//             </ul>
//           }
//           type="warning"
//           showIcon
//           icon={<AlertCircle size={20} />}
//           className="mt-4"
//         />
//       </Card>
//       <Space className="w-full justify-between">
//         <Button
//           size="large"
//           onClick={() => setPaymentStep('currency')}
//           className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//           icon={<ArrowLeft size={16} />}
//         >
//           Back
//         </Button>
//         <Button
//           type="primary"
//           size="large"
//           onClick={() => setPaymentStep('payment')}
//           className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//         >
//           I’ve Sent the Payment
//         </Button>
//       </Space>
//     </div>
//   );

//   const renderPaymentStep = () => (
//     <div>
//       <Space direction="horizontal" align="center" className="mb-8">
//         <Button
//           icon={<ArrowLeft size={20} />}
//           onClick={() => setPaymentStep('deposit')}
//           type="text"
//           className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
//         />
//         <div>
//           <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Submit Transaction Hash</Title>
//           <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//             Enter the transaction hash for your {form.getFieldValue('amount')} {selectedCurrency} payment.
//           </Paragraph>
//         </div>
//       </Space>
//       {error && (
//         <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handlePaymentMethod}
//       >
//         <Form.Item
//           name="transactionHash"
//           label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash</span>}
//           rules={[{ required: true, message: 'Please enter the transaction hash' }]}
//           initialValue="f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16"
//         >
//           <Input
//             placeholder="Enter transaction hash"
//             className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
//             size="large"
//           />
//         </Form.Item>
//         <Space className="w-full justify-between">
//           <Button
//             size="large"
//             onClick={() => setPaymentStep('deposit')}
//             className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//             icon={<ArrowLeft size={16} />}
//           >
//             Back
//           </Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//           >
//             Submit Payment
//           </Button>
//         </Space>
//       </Form>
//     </div>
//   );

//   const renderConfirmationStep = () => (
//     <div>
//       <div className="text-center mb-8">
//         <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
//         <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Payment Submitted</Title>
//         <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
//           Your {form.getFieldValue('amount')} investment in {selectedCurrency} has been submitted for verification.
//         </Paragraph>
//       </div>
//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
//         <Space direction="horizontal" align="center" className="mb-4">
//           <Wallet className="w-6 h-6 text-emerald-500" />
//           <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Details</Text>
//         </Space>
//         <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//           <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash:</Text>
//           <Text code className="text-sm break-all">{transactionData?.transactionHash || 'N/A'}</Text>
//           <Button
//             type="link"
//             href={
//               selectedCurrency === 'BTC'
//                 ? `https://blockchain.info/tx/${transactionData?.transactionHash}`
//                 : `https://etherscan.io/tx/${transactionData?.transactionHash}`
//             }
//             target="_blank"
//             className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
//           >
//             View on Blockchain
//           </Button>
//         </Card>
//         <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
//           <Space className="flex justify-between items-center">
//             <div>
//               <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Wallet Address:</Text>
//               <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
//             </div>
//             <Button
//               icon={<Copy size={16} />}
//               onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
//               className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
//             />
//           </Space>
//         </Card>
//         <Alert
//           message="Important"
//           description={
//             <ul className="text-xs space-y-1">
//               <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
//               <li>Keep transaction hash for your records</li>
//             </ul>
//           }
//           type="info"
//           showIcon
//           icon={<AlertCircle size={20} />}
//           className="mt-4"
//         />
//       </Card>
//       <Card className={`mb-6 ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
//         <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What happens next?</Text>
//         <ul className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} mt-3 space-y-2`}>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Investment team will verify your payment
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Legal documents will be sent for signing
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Welcome package with investor portal access
//           </li>
//           <li className="flex items-center gap-2">
//             <CheckCircle size={16} />
//             Quarterly updates and financial reports
//           </li>
//         </ul>
//       </Card>
//       <Space className="w-full">
//         <Button
//           type="primary"
//           size="large"
//           onClick={onClose}
//           className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
//         >
//           Done
//         </Button>
//         <Button
//           size="large"
//           onClick={() => message.info('Contact support at investment@gimacapital.com')}
//           className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
//         >
//           Contact Support
//         </Button>
//       </Space>
//     </div>
//   );

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={600}
//       className={theme === 'dark' ? 'dark:bg-slate-900' : ''}
//       title={
//         <div>
//           <Title level={2} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Complete Investment</Title>
//           <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{investorType}</Text>
//         </div>
//       }
//     >
//       {paymentStep === 'details' && renderDetailsStep()}
//       {paymentStep === 'currency' && renderCurrencyStep()}
//       {paymentStep === 'deposit' && renderDepositStep()}
//       {paymentStep === 'payment' && renderPaymentStep()}
//       {paymentStep === 'confirmation' && renderConfirmationStep()}
//     </Modal>
//   );
// };

// PaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   investorType: PropTypes.string,
//   theme: PropTypes.string,
// };

// const InvestmentButton = ({
//   investorType,
//   minInvestment = '',
//   maxInvestors = 1,
//   theme = 'light',
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <>
//       <motion.button
//         whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsModalOpen(true)}
//         className={`relative group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-bold text-sm overflow-hidden w-full ${theme === 'dark' ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-700' : ''}`}
//       >
//         <DollarSign className="w-4 h-4" />
//         <span className="relative z-10">
//           Invest Now - {minInvestment}
//         </span>
//         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//         <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//       </motion.button>

//       <PaymentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         investorType={investorType}
//         theme={theme}
//       />
//     </>
//   );
// };

// PaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   investorType: PropTypes.string,
//   theme: PropTypes.string,
// };

// const InvestmentPaymentSystem = () => {
//   const { state } = useLocation();

//   const investorType = state?.investorType || 'Lead Investor';
//   const minInvestment = state?.minInvestment || '';
//   const maxInvestors = state?.maxInvestors || 1;
//   const theme = state?.theme || 'light';

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900'}`}
//     >
//       <h1 className="text-3xl font-black text-center mb-8">Investment Payment System</h1>
//       <div className="max-w-md mx-auto">
//         <InvestmentButton
//           investorType={investorType}
//           minInvestment={minInvestment}
//           maxInvestors={maxInvestors}
//           theme={theme}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default InvestmentPaymentSystem;
// export { InvestmentButton };



import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Modal, Form, Input, InputNumber, Checkbox, Button, Card, Typography, Space, Alert, message } from 'antd';
import { Bitcoin, Wallet, Copy, CheckCircle, ArrowRight, ArrowLeft, AlertCircle, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import PropTypes from 'prop-types';

const { Title, Text, Paragraph } = Typography;

const API_BASE_URL = 'http://localhost:5000';

const PaymentModal = ({
  isOpen,
  onClose,
  investorType = 'Unknown Investor',
  theme = 'light',
  minInvestment = '$0',
}) => {
  const [form] = Form.useForm();
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [paymentStep, setPaymentStep] = useState('details');
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);
  const hasInitialized = useRef(false);

  // Parse minInvestment to number (remove '$' and commas)
  const minInvestmentValue = parseFloat(minInvestment.replace(/[$,]/g, '')) || 0;

  const currencies = [
    {
      code: 'BTC',
      name: 'Bitcoin',
      icon: Bitcoin,
      color: 'orange',
      processingTime: '10-60 minutes',
      fees: 'Network fees only',
    },
    {
      code: 'USDT',
      name: 'Tether USD',
      icon: Wallet,
      color: 'teal',
      processingTime: '5-30 minutes',
      fees: 'Network fees only',
    },
  ];

  const walletAddresses = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    USDT: '0x742d35Cc6634C0532925a3b8D65391444444444',
  };

  // Initialize form with dynamic minInvestment
  useEffect(() => {
    if (isOpen && minInvestmentValue > 0 && !hasInitialized.current) {
      form.setFieldsValue({
        name: '',
        email: '',
        phone: '',
        amount: minInvestmentValue,
        accreditedInvestor: false,
        transactionHash: '',
      });
      console.log('Form initialized with:', form.getFieldsValue(), 'minInvestmentValue:', minInvestmentValue);
      hasInitialized.current = true;
    }
  }, [form, isOpen, minInvestmentValue]);

  // Reset hasInitialized when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      form.resetFields();
      setPaymentStep('details');
      setError(null);
    }
  }, [isOpen, form]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setPaymentStep('deposit');
    console.log('Currency selected:', currency, 'Form state:', form.getFieldsValue());
  };

  const handlePaymentMethod = async () => {
    try {
      setError(null);
      const formData = await form.validateFields();
      console.log('Form data in payment step:', formData);
      const { name, email, phone, accreditedInvestor, transactionHash, amount } = formData;

      if (!name || !email || !transactionHash || !amount) {
        setError('Please fill in all required fields');
        return;
      }
      if (!accreditedInvestor) {
        setError('You must confirm accredited investor status');
        return;
      }
      if (amount < minInvestmentValue) {
        setError(`Investment amount must be at least ${minInvestment}`);
        return;
      }

      const payload = {
        name,
        email,
        phone: phone || '',
        accreditedInvestor,
        transactionHash,
        currency: selectedCurrency,
        amount: Number(amount),
        investorType,
      };
      console.log('Sending payload to backend:', payload);
      const response = await axios.post(`${API_BASE_URL}/api/payment/save-investor`, payload);
      setTransactionData(response.data);
      setPaymentStep('confirmation');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      console.error('Error submitting payment:', errorMessage);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Address copied to clipboard!');
    });
  };

  const renderDetailsStep = () => (
    <div>
      <Title level={3} className="text-center mb-2">Enter Your Details</Title>
      <Paragraph className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Please provide your information to proceed with the investment.
      </Paragraph>
      {error && (
        <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          form.validateFields().then(() => {
            console.log('Details step form values:', form.getFieldsValue());
            setPaymentStep('currency');
          }).catch((err) => {
            console.error('Validation failed:', err);
          });
        }}
      >
        <Form.Item
          name="name"
          label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Full Name</span>}
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input
            placeholder="Enter your full name"
            className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input
            placeholder="Enter your email"
            className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Phone</span>}
        >
          <Input
            placeholder="Enter your phone number"
            className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Investment Amount</span>}
          rules={[
            { required: true, message: 'Please enter the investment amount' },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue <= 0) {
                  return Promise.reject('Amount must be greater than 0');
                }
                if (numValue < minInvestmentValue) {
                  return Promise.reject(`Amount must be at least ${minInvestment}`);
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Enter investment amount"
            className={`w-full rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
            size="large"
            min={minInvestmentValue}
          />
        </Form.Item>
        <Form.Item
          name="accreditedInvestor"
          valuePropName="checked"
          rules={[{ required: true, message: 'You must confirm accredited investor status' }]}
        >
          <Checkbox>I confirm I am an accredited investor</Checkbox>
        </Form.Item>
        <Space className="w-full justify-between">
          <Button
            size="large"
            onClick={() => form.resetFields()}
            className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
          >
            Reset Form
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={`bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700 ${theme === 'dark' ? 'text-white' : 'text-white'}`}
          >
            Continue to Payment
          </Button>
        </Space>
      </Form>
    </div>
  );

  const renderCurrencyStep = () => (
    <div>
      <Space direction="horizontal" align="center" className="mb-8">
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={() => setPaymentStep('details')}
          type="text"
          className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
        />
        <div>
          <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Choose Payment Currency</Title>
          <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
            Select your preferred cryptocurrency for the investment.
          </Paragraph>
        </div>
      </Space>
      <Space direction="vertical" size="middle" className="w-full">
        {currencies.map((currency) => {
          const IconComponent = currency.icon;
          return (
            <Card
              key={currency.code}
              hoverable
              onClick={() => handleCurrencySelect(currency.code)}
              className={`border-2 ${
                currency.color === 'orange'
                  ? 'border-orange-200 hover:border-orange-400'
                  : 'border-teal-200 hover:border-teal-400'
              } ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <Space>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    currency.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currency.name}</Text>
                    <br />
                    <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.code}</Text>
                  </div>
                </Space>
                <ArrowRight className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <Space>
                  <Clock size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                  <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.processingTime}</Text>
                </Space>
                <Space>
                  <DollarSign size={16} className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} />
                  <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{currency.fees}</Text>
                </Space>
              </div>
            </Card>
          );
        })}
      </Space>
    </div>
  );

  const renderDepositStep = () => (
    <div>
      <Space direction="horizontal" align="center" className="mb-8">
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={() => setPaymentStep('currency')}
          type="text"
          className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
        />
        <div>
          <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Deposit {selectedCurrency}</Title>
          <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
            Send {form.getFieldValue('amount')} in {selectedCurrency} to the address below.
          </Paragraph>
        </div>
      </Space>
      <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        <Space direction="horizontal" align="center" className="mb-4">
          <Wallet className="w-6 h-6 text-emerald-500" />
          <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Send {selectedCurrency} to this address:</Text>
        </Space>
        <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
          <Space className="flex justify-between items-center">
            <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
            <Button
              icon={<Copy size={16} />}
              onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
              className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
            >
              Copy
            </Button>
          </Space>
        </Card>
        <Alert
          message="Important"
          description={
            <ul className="text-xs space-y-1">
              <li>Send exactly {form.getFieldValue('amount')} worth of {selectedCurrency}</li>
              <li>Use only {selectedCurrency === 'USDT' ? 'ERC-20' : 'native Bitcoin'} network</li>
              <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
              <li>Keep your transaction hash for the next step</li>
            </ul>
          }
          type="warning"
          showIcon
          icon={<AlertCircle size={20} />}
          className="mt-4"
        />
      </Card>
      <Space className="w-full justify-between">
        <Button
          size="large"
          onClick={() => setPaymentStep('currency')}
          className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
          icon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            console.log('Deposit step form values:', form.getFieldsValue());
            setPaymentStep('payment');
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
        >
          I’ve Sent the Payment
        </Button>
      </Space>
    </div>
  );

  const renderPaymentStep = () => (
    <div>
      <Space direction="horizontal" align="center" className="mb-8">
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={() => setPaymentStep('deposit')}
          type="text"
          className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
        />
        <div>
          <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Submit Transaction Hash</Title>
          <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
            Enter the transaction hash for your {form.getFieldValue('amount')} {selectedCurrency} payment.
          </Paragraph>
        </div>
      </Space>
      {error && (
        <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handlePaymentMethod}
      >
        {/* Hidden fields to preserve form data */}
        <Form.Item name="name" noStyle><Input type="hidden" /></Form.Item>
        <Form.Item name="email" noStyle><Input type="hidden" /></Form.Item>
        <Form.Item name="phone" noStyle><Input type="hidden" /></Form.Item>
        <Form.Item name="amount" noStyle><InputNumber type="hidden" /></Form.Item>
        <Form.Item name="accreditedInvestor" noStyle><Checkbox style={{ display: 'none' }} /></Form.Item>
        <Form.Item
          name="transactionHash"
          label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash</span>}
          rules={[{ required: true, message: 'Please enter the transaction hash' }]}
        >
          <Input
            placeholder="Enter transaction hash"
            className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
            size="large"
          />
        </Form.Item>
        <Space className="w-full justify-between">
          <Button
            size="large"
            onClick={() => setPaymentStep('deposit')}
            className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
          >
            Submit Payment
          </Button>
        </Space>
      </Form>
    </div>
  );

  const renderConfirmationStep = () => (
    <div>
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <Title level={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Payment Submitted</Title>
        <Paragraph className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
          Your {form.getFieldValue('amount')} investment in {selectedCurrency} has been submitted for verification.
        </Paragraph>
      </div>
      <Card className={`mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        <Space direction="horizontal" align="center" className="mb-4">
          <Wallet className="w-6 h-6 text-emerald-500" />
          <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Details</Text>
        </Space>
        <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
          <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Transaction Hash:</Text>
          <Text code className="text-sm break-all">{transactionData?.transactionHash || 'N/A'}</Text>
          <Button
            type="link"
            href={
              selectedCurrency === 'BTC'
                ? `https://blockchain.info/tx/${transactionData?.transactionHash}`
                : `https://etherscan.io/tx/${transactionData?.transactionHash}`
            }
            target="_blank"
            className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
          >
            View on Blockchain
          </Button>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
          <Space className="flex justify-between items-center">
            <div>
              <Text strong className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Wallet Address:</Text>
              <Text code className="text-sm break-all">{walletAddresses[selectedCurrency]}</Text>
            </div>
            <Button
              icon={<Copy size={16} />}
              onClick={() => copyToClipboard(walletAddresses[selectedCurrency])}
              className={theme === 'dark' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}
            />
          </Space>
        </Card>
        <Alert
          message="Important"
          description={
            <ul className="text-xs space-y-1">
              <li>Transaction will be confirmed within {selectedCurrency === 'BTC' ? '10-60' : '5-30'} minutes</li>
              <li>Keep transaction hash for your records</li>
            </ul>
          }
          type="info"
          showIcon
          icon={<AlertCircle size={20} />}
          className="mt-4"
        />
      </Card>
      <Card className={`mb-6 ${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
        <Text strong className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What happens next?</Text>
        <ul className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} mt-3 space-y-2`}>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} />
            Investment team will verify your payment
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} />
            Legal documents will be sent for signing
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} />
            Welcome package with investor portal access
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} />
            Quarterly updates and financial reports
          </li>
        </ul>
      </Card>
      <Space className="w-full">
        <Button
          type="primary"
          size="large"
          onClick={onClose}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border-none hover:from-emerald-600 hover:to-teal-700"
        >
          Done
        </Button>
        <Button
          size="large"
          onClick={() => message.info('Contact support at investment@gimacapital.com')}
          className={`border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}
        >
          Contact Support
        </Button>
      </Space>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className={theme === 'dark' ? 'dark:bg-slate-900' : ''}
      title={
        <div>
          <Title level={2} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Complete Investment</Title>
          <Text type="secondary" className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{investorType}</Text>
        </div>
      }
    >
      {paymentStep === 'details' && renderDetailsStep()}
      {paymentStep === 'currency' && renderCurrencyStep()}
      {paymentStep === 'deposit' && renderDepositStep()}
      {paymentStep === 'payment' && renderPaymentStep()}
      {paymentStep === 'confirmation' && renderConfirmationStep()}
    </Modal>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  investorType: PropTypes.string,
  theme: PropTypes.string,
  minInvestment: PropTypes.string,
};

const InvestmentButton = ({
  investorType,
  minInvestment = '$0',
  theme = 'light',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className={`relative group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg font-bold text-sm overflow-hidden w-full ${theme === 'dark' ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-700' : ''}`}
      >
        <DollarSign className="w-4 h-4" />
        <span className="relative z-10">
          Invest Now - {minInvestment}
        </span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </motion.button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investorType={investorType}
        theme={theme}
        minInvestment={minInvestment}
      />
    </>
  );
};

InvestmentButton.propTypes = {
  investorType: PropTypes.string,
  minInvestment: PropTypes.string,
  theme: PropTypes.string,
};

const InvestmentPaymentSystem = () => {
  const { state } = useLocation();

  const investorType = state?.investorType || 'Crowdfunding/Other';
  const minInvestment = state?.minInvestment || '$5000';
  const theme = state?.theme || 'light';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900'}`}
    >
      <h1 className="text-3xl font-black text-center mb-8">Investment Payment System</h1>
      <div className="max-w-md mx-auto">
        <InvestmentButton
          investorType={investorType}
          minInvestment={minInvestment}
          theme={theme}
        />
      </div>
    </motion.div>
  );
};

export default InvestmentPaymentSystem;
export { InvestmentButton };