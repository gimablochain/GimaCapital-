


// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from './Auth';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { Button, Modal, Form, Input, Select, Statistic, Card, message, Switch} from 'antd';
// import { DollarOutlined, UserOutlined, TransactionOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
// import { getAuth, onIdTokenChanged } from 'firebase/auth';






// // Inline styles for modals and badges
// const styles = {
//   modal: (theme) => ({
//     '.ant-modal-content': {
//       background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
//       borderRadius: '0',
//       padding: '24px',
//       boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.15)',
//     },
//     '.ant-modal-header': {
//       background: 'transparent',
//       borderBottom: 'none',
//       padding: '0 0 16px 0',
//     },
//     '.ant-modal-title': {
//       color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//     },
//     '.ant-modal-body': {
//       padding: '0',
//     },
//     '.ant-modal-footer': {
//       borderTop: 'none',
//       padding: '16px 0 0 0',
//     },
//   }),
//   badge: (theme) => ({
//     '.badge': {
//       padding: '4px 8px',
//       borderRadius: '12px',
//       fontSize: '0.75rem',
//       fontWeight: '500',
//     },
//     '.bg-danger': {
//       background: '#B91C1C',
//       color: '#FFFFFF',
//     },
//     '.bg-warning': {
//       background: '#D97706',
//       color: '#FFFFFF',
//     },
//     '.bg-success': {
//       background: '#16A34A',
//       color: '#FFFFFF',
//     },
//     '.bg-secondary': {
//       background: '#6B7280',
//       color: '#FFFFFF',
//     },
//   }),
// };

// const API_BASE_URL = 'http://localhost:5000';

// const AdminDashboard = ({ theme, toggleTheme }) => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [loadingTransactions, setLoadingTransactions] = useState(false);
//   const [loadingFixDistributions, setLoadingFixDistributions] = useState(false);
//   const [userModalVisible, setUserModalVisible] = useState(false);
//   const [pammModalVisible, setPammModalVisible] = useState(false);
//   const [fixDistributionsModalVisible, setFixDistributionsModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [pagination, setPagination] = useState({
//     users: { next_cursor: null },
//     transactions: { next_cursor: null },
//   });

//   // Keep authToken updated with Firebase
//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onIdTokenChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const idToken = await user.getIdToken();
//           const refreshToken = user.refreshToken;
//           localStorage.setItem('authToken', idToken);
//           localStorage.setItem('refreshToken', refreshToken);
//         } catch (error) {
//           console.error('Error getting ID token:', error);
//           message.error('Authentication error, please sign in again');
//           localStorage.removeItem('authToken');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//         }
//       } else {
//         console.log('No user signed in, clearing tokens');
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Token refresh function
//   const refreshToken = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       message.error('No refresh token available, please sign in again');
//       return null;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//       }

//       const data = await response.json();
//       if (data.status === 'success') {
//         localStorage.setItem('authToken', data.idToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         return data.idToken;
//       } else {
//         throw new Error(data.message || 'Failed to refresh token');
//       }
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       message.error('Session expired, please sign in again');
//       return null;
//     }
//   }, []);

//   // Generic fetch with token refresh
//   const fetchWithAuth = useCallback(
//     async (url, options = {}) => {
//       let token = localStorage.getItem('authToken');
//       if (!token) {
//         token = await refreshToken();
//         if (!token) return null;
//       }

//       options.headers = {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       try {
//         const response = await fetch(url, options);
//         if (response.status === 401) {
//           token = await refreshToken();
//           if (token) {
//             options.headers.Authorization = `Bearer ${token}`;
//             return await fetch(url, options);
//           }
//           return null;
//         }
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//         }
//         return await response.json();
//       } catch (error) {
//         console.error(`Fetch error for ${url}:`, error);
//         message.error(`Error fetching data: ${error.message}`);
//         return null;
//       }
//     },
//     [refreshToken]
//   );

//   // Fetch users
//   const fetchUsers = useCallback(
//     async (cursor = null) => {
//       setLoadingUsers(true);
//       try {
//         let url = `${API_BASE_URL}/admin/users?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setUsers((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             users: { next_cursor: data.next_cursor },
//           }));
//         }
//       } finally {
//         setLoadingUsers(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch transactions
//   const fetchTransactions = useCallback(
//     async (cursor = null) => {
//       setLoadingTransactions(true);
//       try {
//         let url = `${API_BASE_URL}/admin/transactions?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setTransactions((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             transactions: { next_cursor: data.next_cursor },
//           }));
//         }
//       } finally {
//         setLoadingTransactions(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch system stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/system/stats`, { method: 'GET' });
//       if (data?.status === 'success') {
//         setStats(data.data);
//       } else {
//         setStats({
//           total_users: 0,
//           active_users: 0,
//           total_deposits: 0.0,
//           total_volume: 0.0,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       message.warning('System stats unavailable');
//       setStats({
//         total_users: 0,
//         active_users: 0,
//         total_deposits: 0.0,
//         total_volume: 0.0,
//       });
//     }
//   }, [fetchWithAuth]);

//   // Handle user promotion
//   const handlePromote = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/users/${selectedUser.id}/promote`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setUserModalVisible(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       console.error('Error promoting user:', error);
//       message.error('Error promoting user');
//     }
//   };

//   // Handle PAMM override
//   const handlePammOverride = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/pamm/override`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setPammModalVisible(false);
//       }
//     } catch (error) {
//       console.error('Error in PAMM override:', error);
//       message.error('Error in PAMM override');
//     }
//   };

//   // Handle fix distributions
//   const handleFixDistributions = async () => {
//     setFixDistributionsModalVisible(false);
//     setLoadingFixDistributions(true);
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/pamm/fix-distributions`, {
//         method: 'POST',
//       });
//       if (data?.status === 'success') {
//         message.success(`${data.message} (${data.count || 0} distributions fixed)`);
//       }
//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       message.error('Error fixing distributions');
//     } finally {
//       setLoadingFixDistributions(false);
//     }
//   };

//   // Refresh all data
//   const refreshAllData = useCallback(() => {
//     fetchUsers();
//     fetchTransactions();
//     fetchStats();
//   }, [fetchUsers, fetchTransactions, fetchStats]);

//   // Initial data fetch
//   useEffect(() => {
//     if (currentUser?.is_admin) {
//       refreshAllData();
//     }
//   }, [currentUser, refreshAllData]);

//   // Redirect non-admin users
//   if (!currentUser?.is_admin) {
//     return <Navigate to="/dashboard" />;
//   }

//   // Custom Table Component for Users
//   const UserTable = ({ data, loading, onManage }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Balance</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Status</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.email || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.balance || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <div className="flex flex-wrap gap-1">
//                     {record.is_admin && <span className="badge bg-danger">Admin</span>}
//                     {record.is_manager && <span className="badge bg-warning">Manager</span>}
//                     {record.accountStatus === 'active' && <span className="badge bg-success">Active</span>}
//                     {!record.accountStatus && <span className="badge bg-secondary">Unknown</span>}
//                   </div>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <Button
//                     onClick={() => onManage(record)}
//                     className={`px-4 py-1 font-medium text-white ${
//                       theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                     } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                   >
//                     Manage
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Custom Table Component for Transactions
//   const TransactionTable = ({ data, loading }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">User ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Type</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.user_id || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <span className="flex items-center">
//                     <TransactionOutlined
//                       className={theme === 'dark' ? 'text-blue-400 mr-2' : 'text-blue-500 mr-2'}
//                     />
//                     {record.type || 'Unknown'}
//                   </span>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.amount || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Load More button component
//   const LoadMoreButton = ({ onClick, hasMore, loading }) => (
//     hasMore && (
//       <div className="text-center mt-4">
//         <Button
//           onClick={onClick}
//           loading={loading}
//           className={`px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//         >
//           Load More
//         </Button>
//       </div>
//     )
//   );

//   return (
//     <div
//       className={`min-h-screen p-4 sm:p-6 md:p-8 ${
//         theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
//       }`}
//     >
//       <style jsx global>{`
//         ${Object.entries(styles.badge(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//         ${Object.entries(styles.modal(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//       `}</style>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2
//           className={`text-2xl sm:text-3xl font-bold ${
//             theme === 'dark'
//               ? 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
//               : 'text-gray-900'
//           }`}
//         >
//           Admin Dashboard
//         </h2>
//         <div className="flex items-center gap-4">
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={refreshAllData}
//             loading={loadingUsers || loadingTransactions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh Data
//           </Button>
//           <Switch
//             checked={theme === 'dark'}
//             onChange={toggleTheme}
//             checkedChildren="Dark"
//             unCheckedChildren="Light"
//             className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           />
//         </div>
//       </div>

//       {/* System Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Users</span>}
//             value={stats.total_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Active Users</span>}
//             value={stats.active_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Deposits</span>}
//             value={stats.total_deposits || 0}
//             precision={2}
//             prefix={<DollarOutlined className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Volume</span>}
//             value={stats.total_volume || 0}
//             precision={2}
//             prefix={<LineChartOutlined className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//       </div>

//       {/* PAMM Controls */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>PAMM Controls</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//       >
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//           <Button
//             type="primary"
//             onClick={() => setPammModalVisible(true)}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Manage PAMM Settings
//           </Button>
//           <Button
//             type="primary"
//             danger
//             onClick={() => setFixDistributionsModalVisible(true)}
//             loading={loadingFixDistributions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//             } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Fix Historical Distributions
//           </Button>
//         </div>
//       </Card>

//       {/* Users Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Users</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchUsers()}
//             loading={loadingUsers}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <UserTable
//           data={users}
//           loading={loadingUsers}
//           onManage={(record) => {
//             setSelectedUser(record);
//             setUserModalVisible(true);
//           }}
//         />
//         <LoadMoreButton
//           onClick={() => fetchUsers(pagination.users.next_cursor)}
//           hasMore={!!pagination.users.next_cursor}
//           loading={loadingUsers}
//         />
//       </Card>

//       {/* Transactions Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transactions</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchTransactions()}
//             loading={loadingTransactions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <TransactionTable data={transactions} loading={loadingTransactions} />
//         <LoadMoreButton
//           onClick={() => fetchTransactions(pagination.transactions.next_cursor)}
//           hasMore={!!pagination.transactions.next_cursor}
//           loading={loadingTransactions}
//         />
//       </Card>

//       {/* User Management Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage User</span>}
//         open={userModalVisible}
//         onCancel={() => setUserModalVisible(false)}
//         footer={null}
//       >
//         {selectedUser && (
//           <Form
//             layout="vertical"
//             initialValues={{
//               role: selectedUser.is_admin ? 'admin' : selectedUser.is_manager ? 'manager' : 'user',
//             }}
//             onFinish={handlePromote}
//           >
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//             >
//               <Input
//                 value={selectedUser.email || 'N/A'}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Current Balance</span>}
//             >
//               <Input
//                 value={`$${Number(selectedUser.balance || 0).toFixed(2)}`}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               name="role"
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Role</span>}
//             >
//               <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//                 <Select.Option value="user">Regular User</Select.Option>
//                 <Select.Option value="manager">Manager</Select.Option>
//                 <Select.Option value="admin">Admin</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className={`px-4 py-1 font-medium text-white ${
//                   theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                 } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//               >
//                 Update Role
//               </Button>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>

//       {/* PAMM Override Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage PAMM Settings</span>}
//         open={pammModalVisible}
//         onCancel={() => setPammModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           layout="vertical"
//           initialValues={{ action: 'pause', fee: 0.2 }}
//           onFinish={handlePammOverride}
//         >
//           <Form.Item
//             name="action"
//             label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Action</span>}
//           >
//             <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//               <Select.Option value="pause">Pause PAMM</Select.Option>
//               <Select.Option value="resume">Resume PAMM</Select.Option>
//               <Select.Option value="adjust_fee">Adjust Fee</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('action') === 'adjust_fee' && (
//                 <Form.Item
//                   name="fee"
//                   label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Performance Fee (0-1)</span>}
//                 >
//                   <Input
//                     type="number"
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//                   />
//                 </Form.Item>
//               )
//             }
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className={`px-4 py-1 font-medium text-white ${
//                 theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//               } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//             >
//               Apply
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Fix Distributions Confirmation Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Confirm Fix Distributions</span>}
//         open={fixDistributionsModalVisible}
//         onOk={handleFixDistributions}
//         onCancel={() => setFixDistributionsModalVisible(false)}
//         okText="Confirm"
//         cancelText="Cancel"
//         okButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//           } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         cancelButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         confirmLoading={loadingFixDistributions}
//       >
//         <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}>
//           This will update all historical distributions with incorrect fees (10%) to the correct 20% fee.
//         </p>
//         <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//           This action cannot be undone. Are you sure you want to proceed?
//         </p>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;




// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from './Auth';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { Button, Modal, Form, Input, Select, Statistic, Card, message, Switch, Typography, Table, Alert, Tag } from 'antd';
// import { DollarOutlined, UserOutlined, TransactionOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
// import { getAuth, onIdTokenChanged } from 'firebase/auth';
// import { motion } from 'framer-motion';
// import { CheckCircle, AlertCircle } from 'lucide-react';
// import axios from 'axios';

// const { Title, Text } = Typography;

// const API_BASE_URL = 'http://localhost:5000';

// // Inline styles for modals and badges
// const styles = {
//   modal: (theme) => ({
//     '.ant-modal-content': {
//       background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
//       borderRadius: '0',
//       padding: '24px',
//       boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.15)',
//     },
//     '.ant-modal-header': {
//       background: 'transparent',
//       borderBottom: 'none',
//       padding: '0 0 16px 0',
//     },
//     '.ant-modal-title': {
//       color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//     },
//     '.ant-modal-body': {
//       padding: '0',
//     },
//     '.ant-modal-footer': {
//       borderTop: 'none',
//       padding: '16px 0 0 0',
//     },
//   }),
//   badge: (theme) => ({
//     '.badge': {
//       padding: '4px 8px',
//       borderRadius: '12px',
//       fontSize: '0.75rem',
//       fontWeight: '500',
//     },
//     '.bg-danger': {
//       background: '#B91C1C',
//       color: '#FFFFFF',
//     },
//     '.bg-warning': {
//       background: '#D97706',
//       color: '#FFFFFF',
//     },
//     '.bg-success': {
//       background: '#16A34A',
//       color: '#FFFFFF',
//     },
//     '.bg-secondary': {
//       background: '#6B7280',
//       color: '#FFFFFF',
//     },
//   }),
// };

// const AdminDashboard = ({ theme, toggleTheme }) => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [pendingInvestors, setPendingInvestors] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [loadingTransactions, setLoadingTransactions] = useState(false);
//   const [loadingPendingInvestors, setLoadingPendingInvestors] = useState(false);
//   const [loadingFixDistributions, setLoadingFixDistributions] = useState(false);
//   const [userModalVisible, setUserModalVisible] = useState(false);
//   const [pammModalVisible, setPammModalVisible] = useState(false);
//   const [fixDistributionsModalVisible, setFixDistributionsModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [pagination, setPagination] = useState({
//     users: { next_cursor: null },
//     transactions: { next_cursor: null },
//     pendingInvestors: { next_cursor: null },
//   });
//   const [error, setError] = useState(null);

//   // Keep authToken updated with Firebase
//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onIdTokenChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const idToken = await user.getIdToken();
//           const refreshToken = user.refreshToken;
//           localStorage.setItem('authToken', idToken);
//           localStorage.setItem('refreshToken', refreshToken);
//         } catch (error) {
//           console.error('Error getting ID token:', error);
//           message.error('Authentication error, please sign in again');
//           localStorage.removeItem('authToken');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//         }
//       } else {
//         console.log('No user signed in, clearing tokens');
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Token refresh function
//   const refreshToken = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       message.error('No refresh token available, please sign in again');
//       return null;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//       }

//       const data = await response.json();
//       if (data.status === 'success') {
//         localStorage.setItem('authToken', data.idToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         return data.idToken;
//       } else {
//         throw new Error(data.message || 'Failed to refresh token');
//       }
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       message.error('Session expired, please sign in again');
//       return null;
//     }
//   }, []);

//   // Generic fetch with token refresh
//   const fetchWithAuth = useCallback(
//     async (url, options = {}) => {
//       let token = localStorage.getItem('authToken');
//       if (!token) {
//         token = await refreshToken();
//         if (!token) return null;
//       }

//       options.headers = {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       try {
//         const response = await fetch(url, options);
//         if (response.status === 401) {
//           token = await refreshToken();
//           if (token) {
//             options.headers.Authorization = `Bearer ${token}`;
//             return await fetch(url, options);
//           }
//           return null;
//         }
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//         }
//         return await response.json();
//       } catch (error) {
//         console.error(`Fetch error for ${url}:`, error);
//         message.error(`Error fetching data: ${error.message}`);
//         return null;
//       }
//     },
//     [refreshToken]
//   );

//   // Fetch users
//   const fetchUsers = useCallback(
//     async (cursor = null) => {
//       setLoadingUsers(true);
//       try {
//         let url = `${API_BASE_URL}/admin/users?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setUsers((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             users: { next_cursor: data.next_cursor },
//           }));
//         }
//       } finally {
//         setLoadingUsers(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch transactions
//   const fetchTransactions = useCallback(
//     async (cursor = null) => {
//       setLoadingTransactions(true);
//       try {
//         let url = `${API_BASE_URL}/admin/transactions?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setTransactions((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             transactions: { next_cursor: data.next_cursor },
//           }));
//         }
//       } finally {
//         setLoadingTransactions(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch pending accredited investors
//   const fetchPendingInvestors = useCallback(
//     async (cursor = null) => {
//       setLoadingPendingInvestors(true);
//       try {
//         let url = `${API_BASE_URL}/api/payment/admin/pending-investors?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data) {
//           setPendingInvestors((prev) => (cursor ? [...prev, ...data] : data));
//           setPagination((prev) => ({
//             ...prev,
//             pendingInvestors: { next_cursor: data.next_cursor || null },
//           }));
//         }
//       } catch (error) {
//         setError(error.message || 'Failed to fetch pending investors');
//       } finally {
//         setLoadingPendingInvestors(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch system stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/system/stats`, { method: 'GET' });
//       if (data?.status === 'success') {
//         setStats(data.data);
//       } else {
//         setStats({
//           total_users: 0,
//           active_users: 0,
//           total_deposits: 0.0,
//           total_volume: 0.0,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       message.warning('System stats unavailable');
//       setStats({
//         total_users: 0,
//         active_users: 0,
//         total_deposits: 0.0,
//         total_volume: 0.0,
//       });
//     }
//   }, [fetchWithAuth]);

//   // Handle user promotion
//   const handlePromote = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/users/${selectedUser.id}/promote`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setUserModalVisible(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       console.error('Error promoting user:', error);
//       message.error('Error promoting user');
//     }
//   };

//   // Handle PAMM override
//   const handlePammOverride = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/pamm/override`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setPammModalVisible(false);
//       }
//     } catch (error) {
//       console.error('Error in PAMM override:', error);
//       message.error('Error in PAMM override');
//     }
//   };

//   // Handle fix distributions
//   const handleFixDistributions = async () => {
//     setFixDistributionsModalVisible(false);
//     setLoadingFixDistributions(true);
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/pamm/fix-distributions`, {
//         method: 'POST',
//       });
//       if (data?.status === 'success') {
//         message.success(`${data.message} (${data.count || 0} distributions fixed)`);
//       }
//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       message.error('Error fixing distributions');
//     } finally {
//       setLoadingFixDistributions(false);
//     }
//   };

//   // Handle verify accredited investor
//   const handleVerify = async (investorId) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/api/payment/admin/verify-investor/${investorId}`, {
//         method: 'POST',
//         body: JSON.stringify({}),
//       });
//       if (data?.message) {
//         message.success(data.message);
//         setPendingInvestors((prev) => prev.filter((investor) => investor.investorId !== investorId));
//       }
//     } catch (error) {
//       console.error('Error verifying investor:', error);
//       message.error(error.message || 'Verification failed');
//     }
//   };

//   // Refresh all data
//   const refreshAllData = useCallback(() => {
//     fetchUsers();
//     fetchTransactions();
//     fetchPendingInvestors();
//     fetchStats();
//   }, [fetchUsers, fetchTransactions, fetchPendingInvestors, fetchStats]);

//   // Initial data fetch
//   useEffect(() => {
//     if (currentUser?.is_admin) {
//       refreshAllData();
//     }
//   }, [currentUser, refreshAllData]);

//   // Redirect non-admin users
//   if (!currentUser?.is_admin) {
//     return <Navigate to="/dashboard" />;
//   }

//   // Custom Table Component for Users
//   const UserTable = ({ data, loading, onManage }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Balance</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Status</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.email || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.balance || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <div className="flex flex-wrap gap-1">
//                     {record.is_admin && <span className="badge bg-danger">Admin</span>}
//                     {record.is_manager && <span className="badge bg-warning">Manager</span>}
//                     {record.accountStatus === 'active' && <span className="badge bg-success">Active</span>}
//                     {!record.accountStatus && <span className="badge bg-secondary">Unknown</span>}
//                   </div>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <Button
//                     onClick={() => onManage(record)}
//                     className={`px-4 py-1 font-medium text-white ${
//                       theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                     } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                   >
//                     Manage
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Custom Table Component for Transactions
//   const TransactionTable = ({ data, loading }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">User ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Type</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.user_id || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <span className="flex items-center">
//                     <TransactionOutlined
//                       className={theme === 'dark' ? 'text-blue-400 mr-2' : 'text-blue-500 mr-2'}
//                     />
//                     {record.type || 'Unknown'}
//                   </span>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.amount || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Custom Table Component for Pending Accredited Investors
//   const PendingInvestorsTable = ({ data, loading, onVerify }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Name</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Transaction Hash</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="6"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="6"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No pending investors
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.investorId}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.investorId}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.name || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.email || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.transactions.map((tx) => (
//                     <div key={tx.transactionHash}>
//                       {tx.amount.toLocaleString()} {tx.currency}
//                     </div>
//                   ))}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.transactions.map((tx) => (
//                     <div key={tx.transactionHash}>
//                       <Text code>{tx.transactionHash}</Text>
//                       <Button
//                         type="link"
//                         href={
//                           tx.currency === 'BTC'
//                             ? `https://blockchain.info/tx/${tx.transactionHash}`
//                             : `https://etherscan.io/tx/${tx.transactionHash}`
//                         }
//                         target="_blank"
//                         className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
//                       >
//                         View on Blockchain
//                       </Button>
//                     </div>
//                   ))}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <Button
//                     onClick={() => onVerify(record.investorId)}
//                     className={`px-4 py-1 font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                   >
//                     Verify
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Load More button component
//   const LoadMoreButton = ({ onClick, hasMore, loading }) => (
//     hasMore && (
//       <div className="text-center mt-4">
//         <Button
//           onClick={onClick}
//           loading={loading}
//           className={`px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//         >
//           Load More
//         </Button>
//       </div>
//     )
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen p-4 sm:p-6 md:p-8 ${
//         theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
//       }`}
//     >
//       <style jsx global>{`
//         ${Object.entries(styles.badge(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//         ${Object.entries(styles.modal(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//       `}</style>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2
//           className={`text-2xl sm:text-3xl font-bold ${
//             theme === 'dark'
//               ? 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
//               : 'text-gray-900'
//           }`}
//         >
//           Admin Dashboard
//         </h2>
//         <div className="flex items-center gap-4">
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={refreshAllData}
//             loading={loadingUsers || loadingTransactions || loadingPendingInvestors}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh Data
//           </Button>
//           <Switch
//             checked={theme === 'dark'}
//             onChange={toggleTheme}
//             checkedChildren="Dark"
//             unCheckedChildren="Light"
//             className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           />
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}

//       {/* System Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Users</span>}
//             value={stats.total_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Active Users</span>}
//             value={stats.active_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Deposits</span>}
//             value={stats.total_deposits || 0}
//             precision={2}
//             prefix={<DollarOutlined className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Volume</span>}
//             value={stats.total_volume || 0}
//             precision={2}
//             prefix={<LineChartOutlined className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//       </div>

//       {/* PAMM Controls */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>PAMM Controls</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//       >
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//           <Button
//             type="primary"
//             onClick={() => setPammModalVisible(true)}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Manage PAMM Settings
//           </Button>
//           <Button
//             type="primary"
//             danger
//             onClick={() => setFixDistributionsModalVisible(true)}
//             loading={loadingFixDistributions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//             } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Fix Historical Distributions
//           </Button>
//         </div>
//       </Card>

//       {/* Pending Accredited Investors Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Pending Accredited Investors</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchPendingInvestors()}
//             loading={loadingPendingInvestors}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <PendingInvestorsTable
//           data={pendingInvestors}
//           loading={loadingPendingInvestors}
//           onVerify={handleVerify}
//         />
//         <LoadMoreButton
//           onClick={() => fetchPendingInvestors(pagination.pendingInvestors.next_cursor)}
//           hasMore={!!pagination.pendingInvestors.next_cursor}
//           loading={loadingPendingInvestors}
//         />
//       </Card>

//       {/* Users Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Users</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchUsers()}
//             loading={loadingUsers}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <UserTable
//           data={users}
//           loading={loadingUsers}
//           onManage={(record) => {
//             setSelectedUser(record);
//             setUserModalVisible(true);
//           }}
//         />
//         <LoadMoreButton
//           onClick={() => fetchUsers(pagination.users.next_cursor)}
//           hasMore={!!pagination.users.next_cursor}
//           loading={loadingUsers}
//         />
//       </Card>

//       {/* Transactions Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transactions</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchTransactions()}
//             loading={loadingTransactions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <TransactionTable data={transactions} loading={loadingTransactions} />
//         <LoadMoreButton
//           onClick={() => fetchTransactions(pagination.transactions.next_cursor)}
//           hasMore={!!pagination.transactions.next_cursor}
//           loading={loadingTransactions}
//         />
//       </Card>

//       {/* User Management Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage User</span>}
//         open={userModalVisible}
//         onCancel={() => setUserModalVisible(false)}
//         footer={null}
//       >
//         {selectedUser && (
//           <Form
//             layout="vertical"
//             initialValues={{
//               role: selectedUser.is_admin ? 'admin' : selectedUser.is_manager ? 'manager' : 'user',
//             }}
//             onFinish={handlePromote}
//           >
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//             >
//               <Input
//                 value={selectedUser.email || 'N/A'}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Current Balance</span>}
//             >
//               <Input
//                 value={`$${Number(selectedUser.balance || 0).toFixed(2)}`}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               name="role"
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Role</span>}
//             >
//               <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//                 <Select.Option value="user">Regular User</Select.Option>
//                 <Select.Option value="manager">Manager</Select.Option>
//                 <Select.Option value="admin">Admin</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className={`px-4 py-1 font-medium text-white ${
//                   theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                 } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//               >
//                 Update Role
//               </Button>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>

//       {/* PAMM Override Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage PAMM Settings</span>}
//         open={pammModalVisible}
//         onCancel={() => setPammModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           layout="vertical"
//           initialValues={{ action: 'pause', fee: 0.2 }}
//           onFinish={handlePammOverride}
//         >
//           <Form.Item
//             name="action"
//             label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Action</span>}
//           >
//             <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//               <Select.Option value="pause">Pause PAMM</Select.Option>
//               <Select.Option value="resume">Resume PAMM</Select.Option>
//               <Select.Option value="adjust_fee">Adjust Fee</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('action') === 'adjust_fee' && (
//                 <Form.Item
//                   name="fee"
//                   label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Performance Fee (0-1)</span>}
//                 >
//                   <Input
//                     type="number"
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//                   />
//                 </Form.Item>
//               )
//             }
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className={`px-4 py-1 font-medium text-white ${
//                 theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//               } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//             >
//               Apply
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Fix Distributions Confirmation Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Confirm Fix Distributions</span>}
//         open={fixDistributionsModalVisible}
//         onOk={handleFixDistributions}
//         onCancel={() => setFixDistributionsModalVisible(false)}
//         okText="Confirm"
//         cancelText="Cancel"
//         okButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//           } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         cancelButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         confirmLoading={loadingFixDistributions}
//       >
//         <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}>
//           This will update all historical distributions with incorrect fees (10%) to the correct 20% fee.
//         </p>
//         <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//           This action cannot be undone. Are you sure you want to proceed?
//         </p>
//       </Modal>
//     </motion.div>
//   );
// };

// export default AdminDashboard;



import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './Auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Select, Statistic, Card, message, Switch, Typography, Alert} from 'antd';
import { DollarOutlined, UserOutlined, TransactionOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
// import { CheckCircle, AlertCircle } from 'lucide-react';
// import axios from 'axios';

const {Text } = Typography;

const API_BASE_URL = 'http://localhost:5000';

// Inline styles for modals and badges
const styles = {
  modal: (theme) => ({
    '.ant-modal-content': {
      background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
      borderRadius: '0',
      padding: '24px',
      boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.15)',
    },
    '.ant-modal-header': {
      background: 'transparent',
      borderBottom: 'none',
      padding: '0 0 16px 0',
    },
    '.ant-modal-title': {
      color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    '.ant-modal-body': {
      padding: '0',
    },
    '.ant-modal-footer': {
      borderTop: 'none',
      padding: '16px 0 0 0',
    },
  }),
  badge: (theme) => ({
    '.badge': {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
    },
    '.bg-danger': {
      background: '#B91C1C',
      color: '#FFFFFF',
    },
    '.bg-warning': {
      background: '#D97706',
      color: '#FFFFFF',
    },
    '.bg-success': {
      background: '#16A34A',
      color: '#FFFFFF',
    },
    '.bg-secondary': {
      background: '#6B7280',
      color: '#FFFFFF',
    },
  }),
};

const AdminDashboard = ({ theme, toggleTheme }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingInvestors, setPendingInvestors] = useState([]);
  const [activeInvestors, setActiveInvestors] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingPendingInvestors, setLoadingPendingInvestors] = useState(false);
  const [loadingActiveInvestors, setLoadingActiveInvestors] = useState(false);
  const [loadingFixDistributions, setLoadingFixDistributions] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [pammModalVisible, setPammModalVisible] = useState(false);
  const [fixDistributionsModalVisible, setFixDistributionsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    users: { next_cursor: null },
    transactions: { next_cursor: null },
    pendingInvestors: { next_cursor: null },
    activeInvestors: { next_cursor: null },
  });
  const [error, setError] = useState(null);

  // Keep authToken updated with Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          localStorage.setItem('authToken', idToken);
          localStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
          console.error('Error getting ID token:', error);
          message.error('Authentication error, please sign in again');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      } else {
        console.log('No user signed in, clearing tokens');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Token refresh function
  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      message.error('No refresh token available, please sign in again');
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('authToken', data.idToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.idToken;
      } else {
        throw new Error(data.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      message.error('Session expired, please sign in again');
      return null;
    }
  }, []);

  // Generic fetch with token refresh
  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      let token = localStorage.getItem('authToken');
      if (!token) {
        token = await refreshToken();
        if (!token) return null;
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      try {
        const response = await fetch(url, options);
        if (response.status === 401) {
          token = await refreshToken();
          if (token) {
            options.headers.Authorization = `Bearer ${token}`;
            return await fetch(url, options);
          }
          return null;
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        message.error(`Error fetching data: ${error.message}`);
        return null;
      }
    },
    [refreshToken]
  );

  // Fetch users
  const fetchUsers = useCallback(
    async (cursor = null) => {
      setLoadingUsers(true);
      try {
        let url = `${API_BASE_URL}/admin/users?limit=50`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const data = await fetchWithAuth(url, { method: 'GET' });
        if (data?.status === 'success') {
          setUsers((prev) => (cursor ? [...prev, ...data.data] : data.data));
          setPagination((prev) => ({
            ...prev,
            users: { next_cursor: data.next_cursor },
          }));
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch users');
      } finally {
        setLoadingUsers(false);
      }
    },
    [fetchWithAuth]
  );

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (cursor = null) => {
      setLoadingTransactions(true);
      try {
        let url = `${API_BASE_URL}/admin/transactions?limit=50`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const data = await fetchWithAuth(url, { method: 'GET' });
        if (data?.status === 'success') {
          setTransactions((prev) => (cursor ? [...prev, ...data.data] : data.data));
          setPagination((prev) => ({
            ...prev,
            transactions: { next_cursor: data.next_cursor },
          }));
        } else {
          setError('Failed to fetch transactions');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoadingTransactions(false);
      }
    },
    [fetchWithAuth]
  );

  // Fetch pending accredited investors
  const fetchPendingInvestors = useCallback(
    async (cursor = null) => {
      setLoadingPendingInvestors(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/api/payment/admin/pending-investors?limit=50`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const data = await fetchWithAuth(url, { method: 'GET' });
        if (data) {
          setPendingInvestors((prev) => (cursor ? [...prev, ...data] : data));
          setPagination((prev) => ({
            ...prev,
            pendingInvestors: { next_cursor: data.next_cursor || null },
          }));
        } else {
          setPendingInvestors([]);
          setError('No pending investors found');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch pending investors');
        setPendingInvestors([]);
      } finally {
        setLoadingPendingInvestors(false);
      }
    },
    [fetchWithAuth]
  );

  // Fetch active accredited investors
  const fetchActiveInvestors = useCallback(
    async (cursor = null) => {
      setLoadingActiveInvestors(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/api/payment/admin/active-investors?limit=50`;
        if (cursor) {
          url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const data = await fetchWithAuth(url, { method: 'GET' });
        if (data) {
          setActiveInvestors((prev) => (cursor ? [...prev, ...data] : data));
          setPagination((prev) => ({
            ...prev,
            activeInvestors: { next_cursor: data.next_cursor || null },
          }));
        } else {
          setActiveInvestors([]);
          setError('No active investors found');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch active investors');
        setActiveInvestors([]);
      } finally {
        setLoadingActiveInvestors(false);
      }
    },
    [fetchWithAuth]
  );

  // Fetch system stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/admin/system/stats`, { method: 'GET' });
      if (data?.status === 'success') {
        setStats(data.data);
      } else {
        setStats({
          total_users: 0,
          active_users: 0,
          total_deposits: 0.0,
          total_volume: 0.0,
        });
        setError('Failed to fetch system stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      message.warning('System stats unavailable');
      setStats({
        total_users: 0,
        active_users: 0,
        total_deposits: 0.0,
        total_volume: 0.0,
      });
      setError(error.message || 'Failed to fetch system stats');
    }
  }, [fetchWithAuth]);

  // Handle user promotion
  const handlePromote = async (values) => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/admin/users/${selectedUser.id}/promote`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (data?.status === 'success') {
        message.success(data.message);
        setUserModalVisible(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      message.error('Error promoting user');
    }
  };

  // Handle PAMM override
  const handlePammOverride = async (values) => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/admin/pamm/override`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (data?.status === 'success') {
        message.success(data.message);
        setPammModalVisible(false);
      }
    } catch (error) {
      console.error('Error in PAMM override:', error);
      message.error('Error in PAMM override');
    }
  };

  // Handle fix distributions
  const handleFixDistributions = async () => {
    setFixDistributionsModalVisible(false);
    setLoadingFixDistributions(true);
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/pamm/fix-distributions`, {
        method: 'POST',
      });
      if (data?.status === 'success') {
        message.success(`${data.message} (${data.count || 0} distributions fixed)`);
      }
    } catch (error) {
      console.error('Error fixing distributions:', error);
      message.error('Error fixing distributions');
    } finally {
      setLoadingFixDistributions(false);
    }
  };

  // Handle verify accredited investor
  const handleVerify = async (investorId) => {
    try {
      setLoadingPendingInvestors(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/api/payment/admin/verify-investor/${investorId}`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (data?.message) {
        message.success(data.message);
        await fetchPendingInvestors();
        await fetchActiveInvestors(); // Refresh active investors after verification
      }
    } catch (error) {
      console.error('Error verifying investor:', error);
      message.error(error.message || 'Verification failed');
    } finally {
      setLoadingPendingInvestors(false);
    }
  };

  // Refresh all data
  const refreshAllData = useCallback(() => {
    setPagination({
      users: { next_cursor: null },
      transactions: { next_cursor: null },
      pendingInvestors: { next_cursor: null },
      activeInvestors: { next_cursor: null },
    });
    setPendingInvestors([]);
    setActiveInvestors([]);
    fetchUsers();
    fetchTransactions();
    fetchPendingInvestors();
    fetchActiveInvestors();
    fetchStats();
  }, [fetchUsers, fetchTransactions, fetchPendingInvestors, fetchActiveInvestors, fetchStats]);

  // Initial data fetch
  useEffect(() => {
    if (currentUser?.is_admin) {
      refreshAllData();
    }
  }, [currentUser, refreshAllData]);

  // Redirect non-admin users
  if (!currentUser?.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  // Custom Table Component for Users
  const UserTable = ({ data, loading, onManage }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr
            className={`${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
          >
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Balance</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="5"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr
                key={record.id}
                className={`${
                  theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.id}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.email || 'N/A'}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  ${Number(record.balance || 0).toFixed(2)}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex flex-wrap gap-1">
                    {record.is_admin && <span className="badge bg-danger">Admin</span>}
                    {record.is_manager && <span className="badge bg-warning">Manager</span>}
                    {record.accountStatus === 'active' && <span className="badge bg-success">Active</span>}
                    {!record.accountStatus && <span className="badge bg-secondary">Unknown</span>}
                  </div>
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <Button
                    onClick={() => onManage(record)}
                    className={`px-4 py-1 font-medium text-white ${
                      theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Custom Table Component for Transactions
  const TransactionTable = ({ data, loading }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr
            className={`${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
          >
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">User ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="5"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr
                key={record.id}
                className={`${
                  theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.id}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.user_id || 'N/A'}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <span className="flex items-center">
                    <TransactionOutlined
                      className={theme === 'dark' ? 'text-blue-400 mr-2' : 'text-blue-500 mr-2'}
                    />
                    {record.type || 'Unknown'}
                  </span>
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  ${Number(record.amount || 0).toFixed(2)}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Custom Table Component for Pending Accredited Investors
  const PendingInvestorsTable = ({ data, loading, onVerify }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr
            className={`${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
          >
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Transaction Hash</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="6"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className={`px-4 py-2 text-center ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                No pending investors
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr
                key={record.investorId}
                className={`${
                  theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.investorId}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.name || 'N/A'}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.email || 'N/A'}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.transactions.map((tx) => (
                    <div key={tx.transactionHash}>
                      {tx.amount.toLocaleString()} {tx.currency}
                    </div>
                  ))}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  {record.transactions.map((tx) => (
                    <div key={tx.transactionHash}>
                      <Text code>{tx.transactionHash}</Text>
                      <Button
                        type="link"
                        href={
                          tx.currency === 'BTC'
                            ? `https://blockchain.info/tx/${tx.transactionHash}`
                            : `https://etherscan.io/tx/${tx.transactionHash}`
                        }
                        target="_blank"
                        className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
                      >
                        View on Blockchain
                      </Button>
                    </div>
                  ))}
                </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <Button
                    onClick={() => onVerify(record.investorId)}
                    className={`px-4 py-1 font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
                    loading={loadingPendingInvestors}
                  >
                    Verify
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // // Custom Table Component for Active Accredited Investors
  // const ActiveInvestorsTable = ({ data, loading }) => (
  //   <div className="overflow-x-auto">
  //     <table className="min-w-full border-collapse">
  //       <thead>
  //         <tr
  //           className={`${
  //             theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
  //           }`}
  //         >
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Name</th>
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Total Invested</th>
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Transaction Hash</th>
  //           <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Status</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {loading ? (
  //           <tr>
  //             <td
  //               colSpan="6"
  //               className={`px-4 py-2 text-center ${
  //                 theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
  //               }`}
  //             >
  //               Loading...
  //             </td>
  //           </tr>
  //         ) : data.length === 0 ? (
  //           <tr>
  //             <td
  //               colSpan="6"
  //               className={`px-4 py-2 text-center ${
  //                 theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
  //               }`}
  //             >
  //               No active investors
  //             </td>
  //           </tr>
  //         ) : (
  //           data.map((record) => (
  //             <tr
  //               key={record.investorId}
  //               className={`${
  //                 theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
  //               }`}
  //             >
  //               <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 {record.investorId}
  //               </td>
  //               <td className=`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 {record.name || 'N/A'}
  //               </td>
  //               <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 {record.email || 'N/A'}
  //               </td>
  //               <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 {record.totalInvested ? record.totalInvested.toLocaleString() : '0'} {record.transactions[0]?.currency || 'N/A'}
  //               </td>
  //               <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 {record.transactions.map((tx) => (
  //                   <div key={tx.transactionHash}>
  //                     <Text code>{tx.transactionHash}</Text>
  //                     <Button
  //                       type="link"
  //                       href={
  //                         tx.currency === 'BTC'
  //                           ? `https://blockchain.info/tx/${tx.transactionHash}`
  //                           : `https://etherscan.io/tx/${tx.transactionHash}`
  //                       }
  //                       target="_blank"
  //                       className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
  //                     >
  //                       View on Blockchain
  //                     </Button>
  //                   </div>
  //                 ))}
  //               </td>
  //               <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
  //                 <span className="badge bg-success">{record.status}</span>
  //               </td>
  //             </tr>
  //           ))
  //         )}
  //       </tbody>
  //     </table>
  //   </div>
  // );


  // Custom Table Component for Active Accredited Investors
const ActiveInvestorsTable = ({ data, loading, theme }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse">
      <thead>
        <tr
          className={`${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-gray-100 border-gray-200 text-gray-600'
          }`}
        >
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Name</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Total Invested</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">date/time</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Transaction Hash</th>
          <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Status</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan="6"
              className={`px-4 py-2 text-center ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan="6"
              className={`px-4 py-2 text-center ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}
            >
              No active investors
            </td>
          </tr>
        ) : (
          data.map((record) => (
            <tr
              key={record.investorId}
              className={`${
                theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
              }`}
            >
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.investorId}
              </td>
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.name || 'N/A'}
              </td>
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.email || 'N/A'}
              </td>
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.totalInvested ? record.totalInvested.toLocaleString() : '0'}{' '}
                {record.transactions[0]?.currency || 'N/A'}
              </td>
                <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.createdAt}
              </td>
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                {record.transactions.map((tx) => (
                  <div key={tx.transactionHash}>
                    {/* <code className="block mb-1">{tx.transactionHash}</code> */}
                    <a
                      href={
                        tx.currency === 'BTC'
                          ? `https://blockchain.info/tx/${tx.transactionHash}`
                          : `https://etherscan.io/tx/${tx.transactionHash}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
                    >
                      View on Blockchain
                    </a>
                  </div>
                ))}
              </td>
              <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <span className="badge bg-success">{record.status}</span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);


  // Load More button component
  const LoadMoreButton = ({ onClick, hasMore, loading }) => (
    hasMore && (
      <div className="text-center mt-4">
        <Button
          onClick={onClick}
          loading={loading}
          className={`px-4 py-1 font-medium text-white ${
            theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
          } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          Load More
        </Button>
      </div>
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-4 sm:p-6 md:p-8 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
      }`}
    >
      <style jsx global>{`
        ${Object.entries(styles.badge(theme)).map(([selector, rules]) => `
          ${selector} {
            ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
          }
        `).join(' ')}
        ${Object.entries(styles.modal(theme)).map(([selector, rules]) => `
          ${selector} {
            ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
          }
        `).join(' ')}
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2
          className={`text-2xl sm:text-3xl font-bold ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}
        >
          Admin Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshAllData}
            loading={loadingUsers || loadingTransactions || loadingPendingInvestors || loadingActiveInvestors}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Refresh Data
          </Button>
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        >
          <Statistic
            title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Users</span>}
            value={stats.total_users || 0}
            prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
            valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
          />
        </Card>
        <Card
          className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        >
          <Statistic
            title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Active Users</span>}
            value={stats.active_users || 0}
            prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
            valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
          />
        </Card>
        <Card
          className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        >
          <Statistic
            title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Deposits</span>}
            value={stats.total_deposits || 0}
            precision={2}
            prefix={<DollarOutlined className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />}
            valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
          />
        </Card>
        <Card
          className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        >
          <Statistic
            title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Volume</span>}
            value={stats.total_volume || 0}
            precision={2}
            prefix={<LineChartOutlined className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />}
            valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
          />
        </Card>
      </div>

      {/* PAMM Controls */}
      <Card
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>PAMM Controls</span>}
        className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            type="primary"
            onClick={() => setPammModalVisible(true)}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Manage PAMM Settings
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => setFixDistributionsModalVisible(true)}
            loading={loadingFixDistributions}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
            } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Fix Historical Distributions
          </Button>
        </div>
      </Card>

      {/* Pending Accredited Investors Table */}
      <Card
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Pending Accredited Investors</span>}
        className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchPendingInvestors()}
            loading={loadingPendingInvestors}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Refresh
          </Button>
        }
      >
        <PendingInvestorsTable
          data={pendingInvestors}
          loading={loadingPendingInvestors}
          onVerify={handleVerify}
        />
        <LoadMoreButton
          onClick={() => fetchPendingInvestors(pagination.pendingInvestors.next_cursor)}
          hasMore={!!pagination.pendingInvestors.next_cursor}
          loading={loadingPendingInvestors}
        />
      </Card>

      {/* Active Accredited Investors Table */}
      <Card
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Active Accredited Investors</span>}
        className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchActiveInvestors()}
            loading={loadingActiveInvestors}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Refresh
          </Button>
        }
      >
        <ActiveInvestorsTable
          data={activeInvestors}
          loading={loadingActiveInvestors}
        />
        <LoadMoreButton
          onClick={() => fetchActiveInvestors(pagination.activeInvestors.next_cursor)}
          hasMore={!!pagination.activeInvestors.next_cursor}
          loading={loadingActiveInvestors}
        />
      </Card>

      {/* Users Table */}
      <Card
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Users</span>}
        className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchUsers()}
            loading={loadingUsers}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Refresh
          </Button>
        }
      >
        <UserTable
          data={users}
          loading={loadingUsers}
          onManage={(record) => {
            setSelectedUser(record);
            setUserModalVisible(true);
          }}
        />
        <LoadMoreButton
          onClick={() => fetchUsers(pagination.users.next_cursor)}
          hasMore={!!pagination.users.next_cursor}
          loading={loadingUsers}
        />
      </Card>

      {/* Transactions Table */}
      <Card
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transactions</span>}
        className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchTransactions()}
            loading={loadingTransactions}
            className={`px-4 py-1 font-medium text-white ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Refresh
          </Button>
        }
      >
        <TransactionTable data={transactions} loading={loadingTransactions} />
        <LoadMoreButton
          onClick={() => fetchTransactions(pagination.transactions.next_cursor)}
          hasMore={!!pagination.transactions.next_cursor}
          loading={loadingTransactions}
        />
      </Card>

      {/* User Management Modal */}
      <Modal
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage User</span>}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <Form
            layout="vertical"
            initialValues={{
              role: selectedUser.is_admin ? 'admin' : selectedUser.is_manager ? 'manager' : 'user',
            }}
            onFinish={handlePromote}
          >
            <Form.Item
              label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
            >
              <Input
                value={selectedUser.email || 'N/A'}
                disabled
                className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
              />
            </Form.Item>
            <Form.Item
              label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Current Balance</span>}
            >
              <Input
                value={`$${Number(selectedUser.balance || 0).toFixed(2)}`}
                disabled
                className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
              />
            </Form.Item>
            <Form.Item
              name="role"
              label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Role</span>}
            >
              <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                <Select.Option value="user">Regular User</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`px-4 py-1 font-medium text-white ${
                  theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
              >
                Update Role
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* PAMM Override Modal */}
      <Modal
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage PAMM Settings</span>}
        open={pammModalVisible}
        onCancel={() => setPammModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{ action: 'pause', fee: 0.2 }}
          onFinish={handlePammOverride}
        >
          <Form.Item
            name="action"
            label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Action</span>}
          >
            <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
              <Select.Option value="pause">Pause PAMM</Select.Option>
              <Select.Option value="resume">Resume PAMM</Select.Option>
              <Select.Option value="adjust_fee">Adjust Fee</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
          >
            {({ getFieldValue }) =>
              getFieldValue('action') === 'adjust_fee' && (
                <Form.Item
                  name="fee"
                  label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Performance Fee (0-1)</span>}
                >
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
                  />
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`px-4 py-1 font-medium text-white ${
                theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
              } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Fix Distributions Confirmation Modal */}
      <Modal
        title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Confirm Fix Distributions</span>}
        open={fixDistributionsModalVisible}
        onOk={handleFixDistributions}
        onCancel={() => setFixDistributionsModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          className: `px-4 py-1 font-medium text-white ${
            theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
          } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
        }}
        cancelButtonProps={{
          className: `px-4 py-1 font-medium text-white ${
            theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
          } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
        }}
        confirmLoading={loadingFixDistributions}
      >
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}>
          This will update all historical distributions with incorrect fees (10%) to the correct 20% fee.
        </p>
        <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          This action cannot be undone. Are you sure you want to proceed?
        </p>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;




// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from './Auth';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { Button, Modal, Form, Input, Select, Statistic, Card, message, Switch, Typography, Table, Alert, Tag } from 'antd';
// import { DollarOutlined, UserOutlined, TransactionOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
// import { getAuth, onIdTokenChanged } from 'firebase/auth';
// import { motion } from 'framer-motion';
// import { CheckCircle, AlertCircle } from 'lucide-react';
// import axios from 'axios';

// const { Title, Text } = Typography;

// const API_BASE_URL = 'http://localhost:5000';

// // Inline styles for modals and badges
// const styles = {
//   modal: (theme) => ({
//     '.ant-modal-content': {
//       background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
//       borderRadius: '0',
//       padding: '24px',
//       boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(59, 130, 246, 0.15)',
//     },
//     '.ant-modal-header': {
//       background: 'transparent',
//       borderBottom: 'none',
//       padding: '0 0 16px 0',
//     },
//     '.ant-modal-title': {
//       color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//     },
//     '.ant-modal-body': {
//       padding: '0',
//     },
//     '.ant-modal-footer': {
//       borderTop: 'none',
//       padding: '16px 0 0 0',
//     },
//   }),
//   badge: (theme) => ({
//     '.badge': {
//       padding: '4px 8px',
//       borderRadius: '12px',
//       fontSize: '0.75rem',
//       fontWeight: '500',
//     },
//     '.bg-danger': {
//       background: '#B91C1C',
//       color: '#FFFFFF',
//     },
//     '.bg-warning': {
//       background: '#D97706',
//       color: '#FFFFFF',
//     },
//     '.bg-success': {
//       background: '#16A34A',
//       color: '#FFFFFF',
//     },
//     '.bg-secondary': {
//       background: '#6B7280',
//       color: '#FFFFFF',
//     },
//   }),
// };

// const AdminDashboard = ({ theme, toggleTheme }) => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [pendingInvestors, setPendingInvestors] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [loadingTransactions, setLoadingTransactions] = useState(false);
//   const [loadingPendingInvestors, setLoadingPendingInvestors] = useState(false);
//   const [loadingFixDistributions, setLoadingFixDistributions] = useState(false);
//   const [userModalVisible, setUserModalVisible] = useState(false);
//   const [pammModalVisible, setPammModalVisible] = useState(false);
//   const [fixDistributionsModalVisible, setFixDistributionsModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [pagination, setPagination] = useState({
//     users: { next_cursor: null },
//     transactions: { next_cursor: null },
//     pendingInvestors: { next_cursor: null },
//   });
//   const [error, setError] = useState(null);

//   // Keep authToken updated with Firebase
//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onIdTokenChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const idToken = await user.getIdToken();
//           const refreshToken = user.refreshToken;
//           localStorage.setItem('authToken', idToken);
//           localStorage.setItem('refreshToken', refreshToken);
//         } catch (error) {
//           console.error('Error getting ID token:', error);
//           message.error('Authentication error, please sign in again');
//           localStorage.removeItem('authToken');
//           localStorage.removeItem('refreshToken');
//           navigate('/login');
//         }
//       } else {
//         console.log('No user signed in, clearing tokens');
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/login');
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Token refresh function
//   const refreshToken = useCallback(async () => {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       message.error('No refresh token available, please sign in again');
//       return null;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//       }

//       const data = await response.json();
//       if (data.status === 'success') {
//         localStorage.setItem('authToken', data.idToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         return data.idToken;
//       } else {
//         throw new Error(data.message || 'Failed to refresh token');
//       }
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       message.error('Session expired, please sign in again');
//       return null;
//     }
//   }, []);

//   // Generic fetch with token refresh
//   const fetchWithAuth = useCallback(
//     async (url, options = {}) => {
//       let token = localStorage.getItem('authToken');
//       if (!token) {
//         token = await refreshToken();
//         if (!token) return null;
//       }

//       options.headers = {
//         ...options.headers,
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       try {
//         const response = await fetch(url, options);
//         if (response.status === 401) {
//           token = await refreshToken();
//           if (token) {
//             options.headers.Authorization = `Bearer ${token}`;
//             return await fetch(url, options);
//           }
//           return null;
//         }
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//         }
//         return await response.json();
//       } catch (error) {
//         console.error(`Fetch error for ${url}:`, error);
//         message.error(`Error fetching data: ${error.message}`);
//         return null;
//       }
//     },
//     [refreshToken]
//   );

//   // Fetch users
//   const fetchUsers = useCallback(
//     async (cursor = null) => {
//       setLoadingUsers(true);
//       try {
//         let url = `${API_BASE_URL}/admin/users?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setUsers((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             users: { next_cursor: data.next_cursor },
//           }));
//         } else {
//           setError('Failed to fetch users');
//         }
//       } catch (error) {
//         setError(error.message || 'Failed to fetch users');
//       } finally {
//         setLoadingUsers(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch transactions
//   const fetchTransactions = useCallback(
//     async (cursor = null) => {
//       setLoadingTransactions(true);
//       try {
//         let url = `${API_BASE_URL}/admin/transactions?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data?.status === 'success') {
//           setTransactions((prev) => (cursor ? [...prev, ...data.data] : data.data));
//           setPagination((prev) => ({
//             ...prev,
//             transactions: { next_cursor: data.next_cursor },
//           }));
//         } else {
//           setError('Failed to fetch transactions');
//         }
//       } catch (error) {
//         setError(error.message || 'Failed to fetch transactions');
//       } finally {
//         setLoadingTransactions(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch pending accredited investors
//   const fetchPendingInvestors = useCallback(
//     async (cursor = null) => {
//       setLoadingPendingInvestors(true);
//       setError(null); // Clear previous errors
//       try {
//         let url = `${API_BASE_URL}/api/payment/admin/pending-investors?limit=50`;
//         if (cursor) {
//           url += `&cursor=${encodeURIComponent(cursor)}`;
//         }

//         const data = await fetchWithAuth(url, { method: 'GET' });
//         if (data) {
//           setPendingInvestors((prev) => (cursor ? [...prev, ...data] : data));
//           setPagination((prev) => ({
//             ...prev,
//             pendingInvestors: { next_cursor: data.next_cursor || null },
//           }));
//         } else {
//           setPendingInvestors([]);
//           setError('No pending investors found');
//         }
//       } catch (error) {
//         setError(error.message || 'Failed to fetch pending investors');
//         setPendingInvestors([]);
//       } finally {
//         setLoadingPendingInvestors(false);
//       }
//     },
//     [fetchWithAuth]
//   );

//   // Fetch system stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/system/stats`, { method: 'GET' });
//       if (data?.status === 'success') {
//         setStats(data.data);
//       } else {
//         setStats({
//           total_users: 0,
//           active_users: 0,
//           total_deposits: 0.0,
//           total_volume: 0.0,
//         });
//         setError('Failed to fetch system stats');
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       message.warning('System stats unavailable');
//       setStats({
//         total_users: 0,
//         active_users: 0,
//         total_deposits: 0.0,
//         total_volume: 0.0,
//       });
//       setError(error.message || 'Failed to fetch system stats');
//     }
//   }, [fetchWithAuth]);

//   // Handle user promotion
//   const handlePromote = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/users/${selectedUser.id}/promote`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setUserModalVisible(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       console.error('Error promoting user:', error);
//       message.error('Error promoting user');
//     }
//   };

//   // Handle PAMM override
//   const handlePammOverride = async (values) => {
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/admin/pamm/override`, {
//         method: 'POST',
//         body: JSON.stringify(values),
//       });
//       if (data?.status === 'success') {
//         message.success(data.message);
//         setPammModalVisible(false);
//       }
//     } catch (error) {
//       console.error('Error in PAMM override:', error);
//       message.error('Error in PAMM override');
//     }
//   };

//   // Handle fix distributions
//   const handleFixDistributions = async () => {
//     setFixDistributionsModalVisible(false);
//     setLoadingFixDistributions(true);
//     try {
//       const data = await fetchWithAuth(`${API_BASE_URL}/pamm/fix-distributions`, {
//         method: 'POST',
//       });
//       if (data?.status === 'success') {
//         message.success(`${data.message} (${data.count || 0} distributions fixed)`);
//       }
//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       message.error('Error fixing distributions');
//     } finally {
//       setLoadingFixDistributions(false);
//     }
//   };

//   // Handle verify accredited investor
//   const handleVerify = async (investorId) => {
//     try {
//       setLoadingPendingInvestors(true);
//       const data = await fetchWithAuth(`${API_BASE_URL}/api/payment/admin/verify-investor/${investorId}`, {
//         method: 'POST',
//         body: JSON.stringify({}),
//       });
//       if (data?.message) {
//         message.success(data.message);
//         // Refresh the pending investors list instead of manually filtering
//         await fetchPendingInvestors();
//       }
//     } catch (error) {
//       console.error('Error verifying investor:', error);
//       message.error(error.message || 'Verification failed');
//     } finally {
//       setLoadingPendingInvestors(false);
//     }
//   };

//   // Refresh all data
//   const refreshAllData = useCallback(() => {
//     setPagination({
//       users: { next_cursor: null },
//       transactions: { next_cursor: null },
//       pendingInvestors: { next_cursor: null },
//     });
//     setPendingInvestors([]);
//     fetchUsers();
//     fetchTransactions();
//     fetchPendingInvestors();
//     fetchStats();
//   }, [fetchUsers, fetchTransactions, fetchPendingInvestors, fetchStats]);

//   // Initial data fetch
//   useEffect(() => {
//     if (currentUser?.is_admin) {
//       refreshAllData();
//     }
//   }, [currentUser, refreshAllData]);

//   // Redirect non-admin users
//   if (!currentUser?.is_admin) {
//     return <Navigate to="/dashboard" />;
//   }

//   // Custom Table Component for Users
//   const UserTable = ({ data, loading, onManage }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Balance</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Status</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.email || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.balance || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <div className="flex flex-wrap gap-1">
//                     {record.is_admin && <span className="badge bg-danger">Admin</span>}
//                     {record.is_manager && <span className="badge bg-warning">Manager</span>}
//                     {record.accountStatus === 'active' && <span className="badge bg-success">Active</span>}
//                     {!record.accountStatus && <span className="badge bg-secondary">Unknown</span>}
//                   </div>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <Button
//                     onClick={() => onManage(record)}
//                     className={`px-4 py-1 font-medium text-white ${
//                       theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                     } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                   >
//                     Manage
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Custom Table Component for Transactions
//   const TransactionTable = ({ data, loading }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">User ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Type</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No data available
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.id}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.id}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.user_id || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <span className="flex items-center">
//                     <TransactionOutlined
//                       className={theme === 'dark' ? 'text-blue-400 mr-2' : 'text-blue-500 mr-2'}
//                     />
//                     {record.type || 'Unknown'}
//                   </span>
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   ${Number(record.amount || 0).toFixed(2)}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Custom Table Component for Pending Accredited Investors
//   const PendingInvestorsTable = ({ data, loading, onVerify }) => (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse">
//         <thead>
//           <tr
//             className={`${
//               theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
//             }`}
//           >
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">ID</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Name</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-48">Email</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-32">Amount</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-40">Transaction Hash</th>
//             <th className="px-4 py-2 text-left text-sm font-semibold border-b w-24">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td
//                 colSpan="6"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 Loading...
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="6"
//                 className={`px-4 py-2 text-center ${
//                   theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
//                 }`}
//               >
//                 No pending investors
//               </td>
//             </tr>
//           ) : (
//             data.map((record) => (
//               <tr
//                 key={record.investorId}
//                 className={`${
//                   theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'
//                 }`}
//               >
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.investorId}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.name || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.email || 'N/A'}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.transactions.map((tx) => (
//                     <div key={tx.transactionHash}>
//                       {tx.amount.toLocaleString()} {tx.currency}
//                     </div>
//                   ))}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   {record.transactions.map((tx) => (
//                     <div key={tx.transactionHash}>
//                       <Text code>{tx.transactionHash}</Text>
//                       <Button
//                         type="link"
//                         href={
//                           tx.currency === 'BTC'
//                             ? `https://blockchain.info/tx/${tx.transactionHash}`
//                             : `https://etherscan.io/tx/${tx.transactionHash}`
//                         }
//                         target="_blank"
//                         className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}
//                       >
//                         View on Blockchain
//                       </Button>
//                     </div>
//                   ))}
//                 </td>
//                 <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
//                   <Button
//                     onClick={() => onVerify(record.investorId)}
//                     className={`px-4 py-1 font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                     loading={loadingPendingInvestors}
//                   >
//                     Verify
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Load More button component
//   const LoadMoreButton = ({ onClick, hasMore, loading }) => (
//     hasMore && (
//       <div className="text-center mt-4">
//         <Button
//           onClick={onClick}
//           loading={loading}
//           className={`px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//         >
//           Load More
//         </Button>
//       </div>
//     )
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen p-4 sm:p-6 md:p-8 ${
//         theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
//       }`}
//     >
//       <style jsx global>{`
//         ${Object.entries(styles.badge(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//         ${Object.entries(styles.modal(theme)).map(([selector, rules]) => `
//           ${selector} {
//             ${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join(' ')}
//           }
//         `).join(' ')}
//       `}</style>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2
//           className={`text-2xl sm:text-3xl font-bold ${
//             theme === 'dark'
//               ? 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
//               : 'text-gray-900'
//           }`}
//         >
//           Admin Dashboard
//         </h2>
//         <div className="flex items-center gap-4">
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={refreshAllData}
//             loading={loadingUsers || loadingTransactions || loadingPendingInvestors}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh Data
//           </Button>
//           <Switch
//             checked={theme === 'dark'}
//             onChange={toggleTheme}
//             checkedChildren="Dark"
//             unCheckedChildren="Light"
//             className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           />
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}

//       {/* System Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Users</span>}
//             value={stats.total_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Active Users</span>}
//             value={stats.active_users || 0}
//             prefix={<UserOutlined className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Deposits</span>}
//             value={stats.total_deposits || 0}
//             precision={2}
//             prefix={<DollarOutlined className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//         <Card
//           className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         >
//           <Statistic
//             title={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Total Volume</span>}
//             value={stats.total_volume || 0}
//             precision={2}
//             prefix={<LineChartOutlined className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />}
//             valueStyle={{ color: theme === 'dark' ? '#FFFFFF' : '#1F2A44' }}
//           />
//         </Card>
//       </div>

//       {/* PAMM Controls */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>PAMM Controls</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//       >
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//           <Button
//             type="primary"
//             onClick={() => setPammModalVisible(true)}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Manage PAMM Settings
//           </Button>
//           <Button
//             type="primary"
//             danger
//             onClick={() => setFixDistributionsModalVisible(true)}
//             loading={loadingFixDistributions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//             } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Fix Historical Distributions
//           </Button>
//         </div>
//       </Card>

//       {/* Pending Accredited Investors Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Pending Accredited Investors</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchPendingInvestors()}
//             loading={loadingPendingInvestors}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <PendingInvestorsTable
//           data={pendingInvestors}
//           loading={loadingPendingInvestors}
//           onVerify={handleVerify}
//         />
//         <LoadMoreButton
//           onClick={() => fetchPendingInvestors(pagination.pendingInvestors.next_cursor)}
//           hasMore={!!pagination.pendingInvestors.next_cursor}
//           loading={loadingPendingInvestors}
//         />
//       </Card>

//       {/* Users Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Users</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700 mb-6' : 'bg-white border-gray-200 mb-6'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchUsers()}
//             loading={loadingUsers}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <UserTable
//           data={users}
//           loading={loadingUsers}
//           onManage={(record) => {
//             setSelectedUser(record);
//             setUserModalVisible(true);
//           }}
//         />
//         <LoadMoreButton
//           onClick={() => fetchUsers(pagination.users.next_cursor)}
//           hasMore={!!pagination.users.next_cursor}
//           loading={loadingUsers}
//         />
//       </Card>

//       {/* Transactions Table */}
//       <Card
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Transactions</span>}
//         className={theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
//         extra={
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={() => fetchTransactions()}
//             loading={loadingTransactions}
//             className={`px-4 py-1 font-medium text-white ${
//               theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//             } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//           >
//             Refresh
//           </Button>
//         }
//       >
//         <TransactionTable data={transactions} loading={loadingTransactions} />
//         <LoadMoreButton
//           onClick={() => fetchTransactions(pagination.transactions.next_cursor)}
//           hasMore={!!pagination.transactions.next_cursor}
//           loading={loadingTransactions}
//         />
//       </Card>

//       {/* User Management Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage User</span>}
//         open={userModalVisible}
//         onCancel={() => setUserModalVisible(false)}
//         footer={null}
//       >
//         {selectedUser && (
//           <Form
//             layout="vertical"
//             initialValues={{
//               role: selectedUser.is_admin ? 'admin' : selectedUser.is_manager ? 'manager' : 'user',
//             }}
//             onFinish={handlePromote}
//           >
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Email</span>}
//             >
//               <Input
//                 value={selectedUser.email || 'N/A'}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Current Balance</span>}
//             >
//               <Input
//                 value={`$${Number(selectedUser.balance || 0).toFixed(2)}`}
//                 disabled
//                 className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//               />
//             </Form.Item>
//             <Form.Item
//               name="role"
//               label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Role</span>}
//             >
//               <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//                 <Select.Option value="user">Regular User</Select.Option>
//                 <Select.Option value="manager">Manager</Select.Option>
//                 <Select.Option value="admin">Admin</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className={`px-4 py-1 font-medium text-white ${
//                   theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//                 } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//               >
//                 Update Role
//               </Button>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>

//       {/* PAMM Override Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Manage PAMM Settings</span>}
//         open={pammModalVisible}
//         onCancel={() => setPammModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           layout="vertical"
//           initialValues={{ action: 'pause', fee: 0.2 }}
//           onFinish={handlePammOverride}
//         >
//           <Form.Item
//             name="action"
//             label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Action</span>}
//           >
//             <Select className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
//               <Select.Option value="pause">Pause PAMM</Select.Option>
//               <Select.Option value="resume">Resume PAMM</Select.Option>
//               <Select.Option value="adjust_fee">Adjust Fee</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
//           >
//             {({ getFieldValue }) =>
//               getFieldValue('action') === 'adjust_fee' && (
//                 <Form.Item
//                   name="fee"
//                   label={<span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Performance Fee (0-1)</span>}
//                 >
//                   <Input
//                     type="number"
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     className={theme === 'dark' ? 'bg-slate-800 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}
//                   />
//                 </Form.Item>
//               )
//             }
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className={`px-4 py-1 font-medium text-white ${
//                 theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//               } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
//             >
//               Apply
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Fix Distributions Confirmation Modal */}
//       <Modal
//         title={<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Confirm Fix Distributions</span>}
//         open={fixDistributionsModalVisible}
//         onOk={handleFixDistributions}
//         onCancel={() => setFixDistributionsModalVisible(false)}
//         okText="Confirm"
//         cancelText="Cancel"
//         okButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
//           } hover:from-red-800 hover:to-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         cancelButtonProps={{
//           className: `px-4 py-1 font-medium text-white ${
//             theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
//           } hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`,
//         }}
//         confirmLoading={loadingFixDistributions}
//       >
//         <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}>
//           This will update all historical distributions with incorrect fees (10%) to the correct 20% fee.
//         </p>
//         <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//           This action cannot be undone. Are you sure you want to proceed?
//         </p>
//       </Modal>
//     </motion.div>
//   );
// };

// export default AdminDashboard;