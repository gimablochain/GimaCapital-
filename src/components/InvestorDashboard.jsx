



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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Set to true for lg screens
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

    // Handle window resize to toggle sidebar visibility
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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
            { name: 'Profile', path: '', icon: '👤' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsSidebarOpen(window.innerWidth < 1024)} // Close sidebar on mobile after click
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
      <div className="flex-1 flex flex-col lg:ml-64"> {/* Add margin-left for large screens */}
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