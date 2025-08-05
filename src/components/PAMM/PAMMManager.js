


// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     TextField,
//     CircularProgress,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import {
//     People as InvestorsIcon,
//     AttachMoney as ProfitIcon,
//     PieChart as AllocationIcon,
//     Add as AddIcon,
//     AccountBalance as TradeIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import { API_BASE_URL } from './config';

// const PAMMManager = ({ theme, userId }) => {
//     const [pammData, setPammData] = useState(null);
//     const [distributions, setDistributions] = useState([]);
//     const [performance, setPerformance] = useState({
//         ytdReturn: 0,
//         totalFees: 0,
//         nextDistribution: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [openDistribution, setOpenDistribution] = useState(false);
//     const [profitAmount, setProfitAmount] = useState('');
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//     const navigate = useNavigate();
//     const [isDistributing, setIsDistributing] = useState(false);

//     useEffect(() => {
//         const fetchPAMMData = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const [statusRes, distRes, perfRes] = await Promise.all([
//                     axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     }),
//                     axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     }),
//                     axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//                         headers: { Authorization: `Bearer ${token}` }
//                     })
//                 ]);

//                 setPammData({
//                     totalFunds: statusRes.data.investors.reduce((sum, inv) => sum + inv.balance, 0),
//                     investors: statusRes.data.investors,
//                     managerAllocation: 0.2
//                 });
//                 setDistributions(distRes.data.data);
//                 setPerformance(perfRes.data);
//                 setLoading(false);
//             } catch (error) {
//                 setLoading(false);
//                 if (error.response?.status === 401) {
//                     setSnackbar({
//                         open: true,
//                         message: 'Session expired. Please log in again.',
//                         severity: 'error'
//                     });
//                     localStorage.removeItem('token');
//                     navigate('/login');
//                 } else {
//                     setSnackbar({
//                         open: true,
//                         message: 'Failed to load PAMM data',
//                         severity: 'error'
//                     });
//                 }
//             }
//         };

//         if (userId) {
//             fetchPAMMData();
//         }
//     }, [userId, navigate]);

//     const handleDistributeProfits = async () => {
//         setIsDistributing(true);
//         if (!profitAmount || parseFloat(profitAmount) <= 0) {
//             setSnackbar({
//                 open: true,
//                 message: 'Please enter a valid profit amount',
//                 severity: 'error'
//             });
//             setIsDistributing(false); // Don't forget to reset loading state
//             return;
//         }
    
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`, {
//                 profit: parseFloat(profitAmount)
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             // Check if response.data exists and has distributionId
//             const distributionId = response.data?.distributionId || 'N/A';
//             console.log("Distribution completed with ID:", distributionId); // For debugging

    
//             setSnackbar({
//                 open: true,
//                 message: `Profits distributed successfully! (ID: ${distributionId})`, // Include ID
//                 severity: 'success'
//             });
            
//             setOpenDistribution(false);
//             setProfitAmount('');
    
//             // Refresh data
//             const [statusRes, distRes, perfRes] = await Promise.all([
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 })
//             ]);
    
//             setPammData({
//                 totalFunds: statusRes.data.investors.reduce((sum, inv) => sum + inv.balance, 0),
//                 investors: statusRes.data.investors,
//                 managerAllocation: 0.2
//             });
//             setDistributions(distRes.data.data);
//             setPerformance(perfRes.data);
    
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 setSnackbar({
//                     open: true,
//                     message: 'Session expired. Please log in again.',
//                     severity: 'error'
//                 });
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 setSnackbar({
//                     open: true,
//                     message: error.response?.data?.message || 'Failed to distribute profits',
//                     severity: 'error'
//                 });
//             }
//         } finally {
//             setIsDistributing(false); // This will run in both success and error cases
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box p={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//             <Typography variant="h4" gutterBottom>
//                 PAMM Manager Dashboard
//             </Typography>

//             <Grid container spacing={3} mb={4}>
//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <InvestorsIcon color="primary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Investors</Typography>
//                                     <Typography variant="h4">
//                                         {pammData?.investors?.length || '0'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <ProfitIcon color="secondary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Total Funds</Typography>
//                                     <Typography variant="h4">
//                                         ${pammData?.totalFunds?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <AllocationIcon color="success" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Your Allocation</Typography>
//                                     <Typography variant="h4">
//                                         {pammData ? `${(pammData.managerAllocation * 100).toFixed(2)}%` : 'N/A'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             <Card sx={{ mb: 4 }}>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                         Recent Profit Distributions
//                     </Typography>
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Date</TableCell>
//                                     <TableCell align="right">Amount</TableCell>
//                                     <TableCell align="right">Investors</TableCell>
//                                     <TableCell align="right">Fees</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {distributions.length > 0 ? (
//                                     distributions.slice(0, 5).map((row) => (
//                                         <TableRow key={row.id}>
//                                             <TableCell>{new Date(row.timestamp).toLocaleDateString()}</TableCell>
//                                             <TableCell align="right">${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
//                                             <TableCell align="right">{row.investors}</TableCell>
//                                             <TableCell align="right">${row.fees.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={4} align="center">
//                                             No distributions yet
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </CardContent>
//             </Card>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Quick Actions
//                             </Typography>
//                             <Box display="flex" flexDirection="column" gap={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => setOpenDistribution(true)}
//                                     startIcon={<AddIcon />}
//                                 >
//                                     Distribute Profits
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/trading')}
//                                     startIcon={<TradeIcon />}
//                                 >
//                                     Execute Managed Trades
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/reports')}
//                                 >
//                                     View Investor Reports
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Performance Summary
//                             </Typography>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>YTD Return:</Typography>
//                                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                                     {performance.ytdReturn.toFixed(2)}%
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>Total Fees Earned:</Typography>
//                                 <Typography>
//                                     ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between">
//                                 <Typography>Next Distribution:</Typography>
//                                 <Typography>
//                                     {new Date(performance.nextDistribution).toLocaleDateString()}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//                 <DialogTitle>Distribute Profits</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Profit Amount"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={profitAmount}
//                         onChange={(e) => setProfitAmount(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//                     {/* <Button onClick={handleDistributeProfits} color="primary" variant="contained">
//                         Distribute
//                     </Button> */}
//                     <Button 
//                         onClick={handleDistributeProfits} 
//                         color="primary" 
//                         variant="contained"
//                         disabled={isDistributing}
//                     >
//                         {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//             >
//                 <Alert
//                     onClose={() => setSnackbar({ ...snackbar, open: false })}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default PAMMManager;



// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     TextField,
//     CircularProgress,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import {
//     People as InvestorsIcon,
//     AttachMoney as ProfitIcon,
//     PieChart as AllocationIcon,
//     Add as AddIcon,
//     AccountBalance as TradeIcon,
//     AccountCircle as ManagerIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PAMMManager = ({ theme, userId }) => {
//     const [pammData, setPammData] = useState(null);
//     const [distributions, setDistributions] = useState([]);
//     const [performance, setPerformance] = useState({
//         ytdReturn: 0,
//         totalFees: 0,
//         nextDistribution: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [openDistribution, setOpenDistribution] = useState(false);
//     const [profitAmount, setProfitAmount] = useState('');
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//     const navigate = useNavigate();
//     const [isDistributing, setIsDistributing] = useState(false);
//     const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//     const [initDialogOpen, setInitDialogOpen] = useState(false);
//     const [initialCapital, setInitialCapital] = useState('');
//     const [initLoading, setInitLoading] = useState(false);

//     // const showSnackbar = (message, severity = 'success') => {
//     //     setSnackbar({ open: true, message, severity });
//     // };
//       // Properly memoized showSnackbar
//     const showSnackbar = useCallback((message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     }, []);

//     const closeSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     // Properly memoized fetchPAMMData with all dependencies
//     const fetchPAMMData = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const [statusRes, distRes, perfRes] = await Promise.all([
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 })
//             ]);

//             setPammData({
//                 totalFunds: statusRes.data.investors.reduce((sum, inv) => sum + inv.balance, 0),
//                 investors: statusRes.data.investors,
//                 managerAllocation: 0.2,
//                 isManagerInitialized: statusRes.data.manager !== undefined
//             });
//             setIsManagerInitialized(statusRes.data.manager !== undefined);
//             setDistributions(distRes.data.data);
//             setPerformance(perfRes.data);
//             setLoading(false);
//         } catch (error) {
//             setLoading(false);
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar('Failed to load PAMM data', 'error');
//             }
//         }
//     }, [navigate, showSnackbar]);  // All dependencies properly declared

//     useEffect(() => {
//         if (userId) {
//             fetchPAMMData();
//         }
//     }, [userId, fetchPAMMData]);  // Now safe to include fetchPAMMData

//     const handleInitializeManager = async () => {
//         if (!initialCapital || isNaN(initialCapital)) {
//             showSnackbar('Please enter a valid initial capital amount', 'error');
//             return;
//         }
    
//         setInitLoading(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//                 {
//                     user_id: userId,
//                     initial_capital: parseFloat(initialCapital)
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             showSnackbar(`Manager initialized with $${initialCapital}`, 'success');
//             setIsManagerInitialized(true);
//             setInitDialogOpen(false);
//             setInitialCapital('');
//             await fetchPAMMData();
//         } catch (error) {
//             showSnackbar(
//                 error.response?.data?.message || 'Failed to initialize manager', 
//                 'error'
//             );
//         } finally {
//             setInitLoading(false);
//         }
//     };

//     const handleDistributeProfits = async () => {
//         if (!isManagerInitialized) {
//             showSnackbar('Please initialize manager first', 'error');
//             setInitDialogOpen(true);
//             return;
//         }

//         if (!profitAmount || parseFloat(profitAmount) <= 0) {
//             showSnackbar('Please enter a valid profit amount', 'error');
//             return;
//         }

//         setIsDistributing(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//                 { profit: parseFloat(profitAmount) },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             showSnackbar(
//                 `Profits distributed successfully! (ID: ${response.data.distributionId})`,
//                 'success'
//             );
            
//             setOpenDistribution(false);
//             setProfitAmount('');
//             await fetchPAMMData();
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar(
//                     error.response?.data?.message || 'Failed to distribute profits',
//                     'error'
//                 );
//             }
//         } finally {
//             setIsDistributing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box p={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//             <Typography variant="h4" gutterBottom>
//                 PAMM Manager Dashboard
//             </Typography>

//             {!isManagerInitialized && (
//                 <Box mb={4} textAlign="center">
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => setInitDialogOpen(true)}
//                         startIcon={<ManagerIcon />}
//                         size="large"
//                     >
//                         Initialize Manager Account
//                     </Button>
//                     <Typography variant="body1" mt={2}>
//                         You must initialize your manager account before performing any operations
//                     </Typography>
//                 </Box>
//             )}

//             <Grid container spacing={3} mb={4}>
//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <InvestorsIcon color="primary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Investors</Typography>
//                                     <Typography variant="h4">
//                                         {pammData?.investors?.length || '0'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <ProfitIcon color="secondary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Total Funds</Typography>
//                                     <Typography variant="h4">
//                                         ${pammData?.totalFunds?.toLocaleString(undefined, { 
//                                             minimumFractionDigits: 2, 
//                                             maximumFractionDigits: 2 
//                                         }) || '0.00'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <AllocationIcon color="success" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Your Allocation</Typography>
//                                     <Typography variant="h4">
//                                         {pammData ? `${(pammData.managerAllocation * 100).toFixed(2)}%` : 'N/A'}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//         <Card sx={{ mb: 4 }}>
//   <CardContent>
//     <Typography variant="h6" gutterBottom>
//       Recent Profit Distributions
//     </Typography>
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell align="right">Investors</TableCell>
//             <TableCell align="right">Fees</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {distributions.length > 0 ? (
//             distributions.slice(0, 5).map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>
//                   {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                 </TableCell>
//                 <TableCell align="right">
//                   ${(row.amount || 0).toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                   })}
//                 </TableCell>
//                 <TableCell align="right">{row.investors || 0}</TableCell>
//                 <TableCell align="right">
//                   ${(row.fees || 0).toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                   })}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={4} align="center">
//                 No distributions yet
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </CardContent>
// </Card>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Quick Actions
//                             </Typography>
//                             <Box display="flex" flexDirection="column" gap={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => setOpenDistribution(true)}
//                                     startIcon={<AddIcon />}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     Distribute Profits
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/trading')}
//                                     startIcon={<TradeIcon />}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     Execute Managed Trades
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/reports')}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     View Investor Reports
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Performance Summary
//                             </Typography>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>YTD Return:</Typography>
//                                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                                     {performance.ytdReturn.toFixed(2)}%
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>Total Fees Earned:</Typography>
//                                 <Typography>
//                                     ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between">
//                                 <Typography>Next Distribution:</Typography>
//                                 <Typography>
//                                     {new Date(performance.nextDistribution).toLocaleDateString()}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Initialize Manager Dialog */}
//             <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//                 <DialogTitle>Initialize Manager Account</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Please set your initial manager capital to begin managing the PAMM system.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Initial Capital"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={initialCapital}
//                         onChange={(e) => setInitialCapital(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleInitializeManager}
//                         color="primary"
//                         variant="contained"
//                         disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//                     >
//                         {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Distribute Profits Dialog */}
//             <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//                 <DialogTitle>Distribute Profits</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Profit Amount"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={profitAmount}
//                         onChange={(e) => setProfitAmount(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleDistributeProfits}
//                         color="primary"
//                         variant="contained"
//                         disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//                     >
//                         {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={closeSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert
//                     onClose={closeSnackbar}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default PAMMManager;



// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     TextField,
//     CircularProgress,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import {
//     People as InvestorsIcon,
//     AttachMoney as ProfitIcon,
//     PieChart as AllocationIcon,
//     Add as AddIcon,
//     AccountBalance as TradeIcon,
//     AccountCircle as ManagerIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PAMMManager = ({ theme, userId }) => {
//     const [pammData, setPammData] = useState({
//         totalFunds: 0,
//         investors: [],
//         managerAllocation: 0.2,
//         isManagerInitialized: false
//     });
//     const [distributions, setDistributions] = useState([]);
//     const [performance, setPerformance] = useState({
//         ytdReturn: 0,
//         totalFees: 0,
//         nextDistribution: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [openDistribution, setOpenDistribution] = useState(false);
//     const [profitAmount, setProfitAmount] = useState('');
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//     const navigate = useNavigate();
//     const [isDistributing, setIsDistributing] = useState(false);
//     const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//     const [initDialogOpen, setInitDialogOpen] = useState(false);
//     const [initialCapital, setInitialCapital] = useState('');
//     const [initLoading, setInitLoading] = useState(false);

//     const showSnackbar = useCallback((message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     }, []);

//     const closeSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     const fetchPAMMData = useCallback(async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('authToken');
//             const [statusRes, distRes, perfRes] = await Promise.all([
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 })
//             ]);

//             const managerExists = statusRes.data.manager !== undefined && 
//                                statusRes.data.manager !== null;
            
//             setPammData({
//                 totalFunds: statusRes.data.investors?.reduce((sum, inv) => sum + inv.balance, 0) || 0,
//                 investors: statusRes.data.investors || [],
//                 managerAllocation: 0.2,
//                 isManagerInitialized: managerExists
//             });
            
//             setIsManagerInitialized(managerExists);
//             setDistributions(distRes.data?.data || []);
//             setPerformance(perfRes.data || {
//                 ytdReturn: 0,
//                 totalFees: 0,
//                 nextDistribution: ''
//             });
//         } catch (error) {
//             setLoading(false);
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar('Failed to load PAMM data', 'error');
//                 console.error('PAMM data fetch error:', error);
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, showSnackbar]);

//     useEffect(() => {
//         if (userId) {
//             fetchPAMMData();
//         }
//     }, [userId, fetchPAMMData]);


//     const handleInitializeManager = async () => {
//         if (!initialCapital || isNaN(initialCapital)) {
//             showSnackbar('Please enter a valid initial capital amount', 'error');
//             return;
//         }
    
//         setInitLoading(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//                 {
//                     user_id: userId,
//                     initial_capital: parseFloat(initialCapital)
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             // Update all relevant states immediately
//             setIsManagerInitialized(true);
//             setPammData(prev => ({
//                 ...prev,
//                 isManagerInitialized: true,
//                 totalFunds: response.data.initial_capital,
//                 investors: [...prev.investors, {
//                     id: userId,
//                     balance: response.data.initial_capital,
//                     isManager: true
//                 }]
//             }));
    
//             showSnackbar(response.data.message, 'success');
//             setInitDialogOpen(false);
//             setInitialCapital('');
            
//             // Force a complete data refresh
//             await fetchPAMMData();
//         } catch (error) {
//             showSnackbar(
//                 error.response?.data?.message || 'Failed to initialize manager', 
//                 'error'
//             );
//             console.error('Manager init error:', error);
//         } finally {
//             setInitLoading(false);
//         }
//     };

//     const handleDistributeProfits = async () => {
//         if (!isManagerInitialized) {
//             showSnackbar('Please initialize manager first', 'error');
//             setInitDialogOpen(true);
//             return;
//         }

//         if (!profitAmount || parseFloat(profitAmount) <= 0) {
//             showSnackbar('Please enter a valid profit amount', 'error');
//             return;
//         }

//         setIsDistributing(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//                 { profit: parseFloat(profitAmount) },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             showSnackbar(
//                 `Profits distributed successfully! (ID: ${response.data.distributionId})`,
//                 'success'
//             );
            
//             setOpenDistribution(false);
//             setProfitAmount('');
//             await fetchPAMMData();
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar(
//                     error.response?.data?.message || 'Failed to distribute profits',
//                     'error'
//                 );
//             }
//         } finally {
//             setIsDistributing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box p={3} className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
//             <Typography variant="h4" gutterBottom>
//                 PAMM Manager Dashboard
//             </Typography>

//             {!isManagerInitialized && (
//                 <Box mb={4} textAlign="center">
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => setInitDialogOpen(true)}
//                         startIcon={<ManagerIcon />}
//                         size="large"
//                     >
//                         Initialize Manager Account
//                     </Button>
//                     <Typography variant="body1" mt={2}>
//                         You must initialize your manager account before performing any operations
//                     </Typography>
//                 </Box>
//             )}

//             <Grid container spacing={3} mb={4}>
//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <InvestorsIcon color="primary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Investors</Typography>
//                                     <Typography variant="h4">
//                                         {pammData.investors.length}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <ProfitIcon color="secondary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Total Funds</Typography>
//                                     <Typography variant="h4">
//                                         ${pammData.totalFunds.toLocaleString(undefined, { 
//                                             minimumFractionDigits: 2, 
//                                             maximumFractionDigits: 2 
//                                         })}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <AllocationIcon color="success" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Your Allocation</Typography>
//                                     <Typography variant="h4">
//                                         {(pammData.managerAllocation * 100).toFixed(2)}%
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             <Card sx={{ mb: 4 }}>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                         Recent Profit Distributions
//                     </Typography>
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Date</TableCell>
//                                     <TableCell align="right">Amount</TableCell>
//                                     <TableCell align="right">Investors</TableCell>
//                                     <TableCell align="right">Fees</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {distributions.length > 0 ? (
//                                     distributions.slice(0, 5).map((row) => (
//                                         <TableRow key={row.id}>
//                                             <TableCell>
//                                                 {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 ${(row.amount || 0).toLocaleString(undefined, {
//                                                     minimumFractionDigits: 2,
//                                                     maximumFractionDigits: 2
//                                                 })}
//                                             </TableCell>
//                                             <TableCell align="right">{row.investors || 0}</TableCell>
//                                             <TableCell align="right">
//                                                 ${(row.fees || 0).toLocaleString(undefined, {
//                                                     minimumFractionDigits: 2,
//                                                     maximumFractionDigits: 2
//                                                 })}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={4} align="center">
//                                             No distributions yet
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </CardContent>
//             </Card>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Quick Actions
//                             </Typography>
//                             <Box display="flex" flexDirection="column" gap={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => setOpenDistribution(true)}
//                                     startIcon={<AddIcon />}
//                                     disabled={!isManagerInitialized || loading}
//                                 >
//                                     {loading ? <CircularProgress size={24} /> : 'Distribute Profits'}
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/trading')}
//                                     startIcon={<TradeIcon />}
//                                     disabled={!isManagerInitialized || loading}
//                                 >
//                                     {loading ? <CircularProgress size={24} /> : 'Execute Managed Trades'}
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/reports')}
//                                     disabled={!isManagerInitialized || loading}
//                                 >
//                                     View Investor Reports
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Performance Summary
//                             </Typography>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>YTD Return:</Typography>
//                                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                                     {performance.ytdReturn.toFixed(2)}%
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>Total Fees Earned:</Typography>
//                                 <Typography>
//                                     ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between">
//                                 <Typography>Next Distribution:</Typography>
//                                 <Typography>
//                                     {performance.nextDistribution ? 
//                                         new Date(performance.nextDistribution).toLocaleDateString() : 
//                                         'Not scheduled'}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Initialize Manager Dialog */}
//             <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//                 <DialogTitle>Initialize Manager Account</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Please set your initial manager capital to begin managing the PAMM system.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Initial Capital"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={initialCapital}
//                         onChange={(e) => setInitialCapital(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleInitializeManager}
//                         color="primary"
//                         variant="contained"
//                         disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//                     >
//                         {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Distribute Profits Dialog */}
//             <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//                 <DialogTitle>Distribute Profits</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Profit Amount"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={profitAmount}
//                         onChange={(e) => setProfitAmount(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleDistributeProfits}
//                         color="primary"
//                         variant="contained"
//                         disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//                     >
//                         {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={closeSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert
//                     onClose={closeSnackbar}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default PAMMManager;


// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     TextField,
//     CircularProgress,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import {
//     People as InvestorsIcon,
//     AttachMoney as ProfitIcon,
//     PieChart as AllocationIcon,
//     Add as AddIcon,
//     AccountBalance as TradeIcon,
//     AccountCircle as ManagerIcon,
//     Refresh as RefreshIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const EMPTY_STATE = {
//     totalFunds: 0,
//     investors: [],
//     managerAllocation: 0.2
// };

// const PAMMManager = ({ theme, userId }) => {
//     const [pammData, setPammData] = useState(EMPTY_STATE);
//     const [distributions, setDistributions] = useState([]);
//     const [performance, setPerformance] = useState({
//         ytdReturn: 0,
//         totalFees: 0,
//         nextDistribution: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [openDistribution, setOpenDistribution] = useState(false);
//     const [profitAmount, setProfitAmount] = useState('');
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//     const navigate = useNavigate();
//     const [isDistributing, setIsDistributing] = useState(false);
//     const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//     const [initDialogOpen, setInitDialogOpen] = useState(false);
//     const [initialCapital, setInitialCapital] = useState('');
//     const [initLoading, setInitLoading] = useState(false);

//     const showSnackbar = useCallback((message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     }, []);

//     const closeSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     const fetchPAMMData = useCallback(async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('authToken');
//             const [statusRes, distRes, perfRes] = await Promise.all([
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                     params: { nocache: Date.now() }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                     params: { nocache: Date.now() }
//                 }),
//                 axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                     params: { nocache: Date.now() }
//                 })
//             ]);

//             const managerExists = statusRes.data.manager !== undefined && 
//                                statusRes.data.manager !== null;
            
//             setPammData({
//                 totalFunds: statusRes.data.investors?.reduce((sum, inv) => sum + inv.balance, 0) || 0,
//                 investors: statusRes.data.investors || [],
//                 managerAllocation: 0.2
//             });
            
//             setIsManagerInitialized(managerExists);
//             setDistributions(distRes.data?.data || []);
//             setPerformance(perfRes.data || {
//                 ytdReturn: 0,
//                 totalFees: 0,
//                 nextDistribution: ''
//             });
//         } catch (error) {
//             setPammData(EMPTY_STATE);
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar('Failed to load PAMM data', 'error');
//                 console.error('PAMM data fetch error:', error);
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate, showSnackbar]);

//     useEffect(() => {
//         if (userId) {
//             fetchPAMMData();
//         }
//     }, [userId, fetchPAMMData]);

//     const handleInitializeManager = async () => {
//         if (!initialCapital || isNaN(initialCapital)) {
//             showSnackbar('Please enter a valid initial capital amount', 'error');
//             return;
//         }
    
//         setInitLoading(true);
//         try {
//             setPammData(EMPTY_STATE);
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//                 {
//                     user_id: userId,
//                     initial_capital: parseFloat(initialCapital)
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             setIsManagerInitialized(true);
//             setPammData(prev => ({
//                 ...prev,
//                 totalFunds: response.data.initial_capital,
//                 investors: [...prev.investors, {
//                     id: userId,
//                     balance: response.data.initial_capital,
//                     isManager: true
//                 }]
//             }));
    
//             showSnackbar(response.data.message, 'success');
//             setInitDialogOpen(false);
//             setInitialCapital('');
            
//             await fetchPAMMData();
//         } catch (error) {
//             showSnackbar(
//                 error.response?.data?.message || 'Failed to initialize manager', 
//                 'error'
//             );
//             console.error('Manager init error:', error);
//         } finally {
//             setInitLoading(false);
//         }
//     };

//     const handleDistributeProfits = async () => {
//         if (!isManagerInitialized) {
//             showSnackbar('Please initialize manager first', 'error');
//             setInitDialogOpen(true);
//             return;
//         }

//         if (!profitAmount || parseFloat(profitAmount) <= 0) {
//             showSnackbar('Please enter a valid profit amount', 'error');
//             return;
//         }

//         setIsDistributing(true);
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//                 { profit: parseFloat(profitAmount) },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             showSnackbar(
//                 `Profits distributed successfully! (ID: ${response.data.distributionId})`,
//                 'success'
//             );
            
//             setOpenDistribution(false);
//             setProfitAmount('');
//             await fetchPAMMData();
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 showSnackbar('Session expired. Please log in again.', 'error');
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             } else {
//                 showSnackbar(
//                     error.response?.data?.message || 'Failed to distribute profits',
//                     'error'
//                 );
//             }
//         } finally {
//             setIsDistributing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box p={3} sx={{ 
//             backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//             color: theme === 'dark' ? '#ffffff' : '#121212'
//         }}>
//             <Typography variant="h4" gutterBottom>
//                 PAMM Manager Dashboard
//             </Typography>

//             {!isManagerInitialized && (
//                 <Box mb={4} textAlign="center" sx={{ 
//                     border: '1px dashed', 
//                     p: 3, 
//                     borderRadius: 1,
//                     borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//                 }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => setInitDialogOpen(true)}
//                         startIcon={<ManagerIcon />}
//                         size="large"
//                         sx={{ mb: 2 }}
//                     >
//                         Initialize Manager Account
//                     </Button>
//                     <Typography variant="body1">
//                         You must initialize your manager account before performing any operations
//                     </Typography>
//                 </Box>
//             )}

//             <Box mb={2} display="flex" justifyContent="flex-end">
//                 <Button 
//                     variant="outlined" 
//                     onClick={fetchPAMMData}
//                     startIcon={<RefreshIcon />}
//                     disabled={loading}
//                 >
//                     {loading ? <CircularProgress size={24} /> : 'Refresh Data'}
//                 </Button>
//             </Box>

//             <Grid container spacing={3} mb={4}>
//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <InvestorsIcon color="primary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Investors</Typography>
//                                     <Typography variant="h4">
//                                         {pammData.investors.length}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <ProfitIcon color="secondary" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Total Funds</Typography>
//                                     <Typography variant="h4">
//                                         ${pammData.totalFunds.toLocaleString(undefined, { 
//                                             minimumFractionDigits: 2, 
//                                             maximumFractionDigits: 2 
//                                         })}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card>
//                         <CardContent>
//                             <Box display="flex" alignItems="center">
//                                 <AllocationIcon color="success" fontSize="large" />
//                                 <Box ml={2}>
//                                     <Typography variant="h6">Your Allocation</Typography>
//                                     <Typography variant="h4">
//                                         {(pammData.managerAllocation * 100).toFixed(2)}%
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             <Card sx={{ mb: 4 }}>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom>
//                         Recent Profit Distributions
//                     </Typography>
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Date</TableCell>
//                                     <TableCell align="right">Amount</TableCell>
//                                     <TableCell align="right">Investors</TableCell>
//                                     <TableCell align="right">Fees</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {distributions.length > 0 ? (
//                                     distributions.slice(0, 5).map((row) => (
//                                         <TableRow key={row.id}>
//                                             <TableCell>
//                                                 {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 ${(row.amount || 0).toLocaleString(undefined, {
//                                                     minimumFractionDigits: 2,
//                                                     maximumFractionDigits: 2
//                                                 })}
//                                             </TableCell>
//                                             <TableCell align="right">{row.investors || 0}</TableCell>
//                                             <TableCell align="right">
//                                                 ${(row.fees || 0).toLocaleString(undefined, {
//                                                     minimumFractionDigits: 2,
//                                                     maximumFractionDigits: 2
//                                                 })}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={4} align="center">
//                                             No distributions yet
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </CardContent>
//             </Card>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Quick Actions
//                             </Typography>
//                             <Box display="flex" flexDirection="column" gap={2}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => setOpenDistribution(true)}
//                                     startIcon={<AddIcon />}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     Distribute Profits
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/trading')}
//                                     startIcon={<TradeIcon />}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     Execute Managed Trades
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     fullWidth
//                                     onClick={() => navigate('/dashboard/manager/reports')}
//                                     disabled={!isManagerInitialized}
//                                 >
//                                     View Investor Reports
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <Card>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Performance Summary
//                             </Typography>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>YTD Return:</Typography>
//                                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                                     {performance.ytdReturn.toFixed(2)}%
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between" mb={2}>
//                                 <Typography>Total Fees Earned:</Typography>
//                                 <Typography>
//                                     ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </Typography>
//                             </Box>
//                             <Box display="flex" justifyContent="space-between">
//                                 <Typography>Next Distribution:</Typography>
//                                 <Typography>
//                                     {performance.nextDistribution ? 
//                                         new Date(performance.nextDistribution).toLocaleDateString() : 
//                                         'Not scheduled'}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Initialize Manager Dialog */}
//             <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//                 <DialogTitle>Initialize Manager Account</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Please set your initial manager capital to begin managing the PAMM system.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Initial Capital"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={initialCapital}
//                         onChange={(e) => setInitialCapital(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleInitializeManager}
//                         color="primary"
//                         variant="contained"
//                         disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//                     >
//                         {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Distribute Profits Dialog */}
//             <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//                 <DialogTitle>Distribute Profits</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Profit Amount"
//                         type="number"
//                         fullWidth
//                         variant="outlined"
//                         value={profitAmount}
//                         onChange={(e) => setProfitAmount(e.target.value)}
//                         InputProps={{
//                             startAdornment: '$',
//                         }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//                     <Button 
//                         onClick={handleDistributeProfits}
//                         color="primary"
//                         variant="contained"
//                         disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//                     >
//                         {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={closeSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert
//                     onClose={closeSnackbar}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default PAMMManager;





// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import {
//   People as InvestorsIcon,
//   AttachMoney as ProfitIcon,
//   PieChart as AllocationIcon,
//   Add as AddIcon,
//   AccountBalance as TradeIcon,
//   AccountCircle as ManagerIcon,
//   Refresh as RefreshIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerAllocation: 0.2
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0,
//     nextDistribution: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

// //   const fetchPAMMData = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('authToken');
      
// //       const [statusRes, distRes, perfRes] = await Promise.all([
// //         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         }),
// //         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         }),
// //         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         })
// //       ]);

// //       // Check if user is manager
// //       if (statusRes.data.manager) {
// //         setIsManagerInitialized(true);
// //         setPammData({
// //           totalFunds: statusRes.data.total_funds || 0,
// //           investors: statusRes.data.investors || [],
// //           managerAllocation: 0.2 // Default manager allocation
// //         });
// //       }

// //       setDistributions(distRes.data.data || []);
// //       setPerformance({
// //         ytdReturn: perfRes.data.ytdReturn || 0,
// //         totalFees: perfRes.data.totalFees || 0,
// //         nextDistribution: perfRes.data.nextDistribution || ''
// //       });

// //     } catch (error) {
// //       console.error('Failed to fetch PAMM data:', error);
// //       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
// //       if (error.response?.status === 401) {
// //         showSnackbar('Session expired. Please log in again.', 'error');
// //         localStorage.removeItem('authToken');
// //         navigate('/login');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [navigate, showSnackbar]);


// const fetchPAMMData = useCallback(async () => {
//     if (!userId) {
//         navigate('/login'); // Now navigate is used in the main body
//         return;
//       }
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
//     //   const token = localStorage.getItem('refreshToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         // Add explicit manager check
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }).catch(() => ({ data: { is_manager: false } })) // Fallback if endpoint doesn't exist
//       ]);
  
//     //   // Set manager initialization status
//     //   const isManager = managerRes.data.is_manager || 
//     //                    (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//     //   setIsManagerInitialized(isManager);



//         // Set manager status - default to false if endpoint failed
//     const isManager = managerRes.data.status === 'success' ? 
//     managerRes.data.is_manager : 
//     (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//     setIsManagerInitialized(isManager);





  
//       // Rest of your data processing...
//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerAllocation: 0.2
//       });
  
//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0,
//       });
  
//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, navigate, showSnackbar]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//     //   const token = localStorage.getItem('refreshToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

// //   const handleDistributeProfits = async () => {
// //     if (!profitAmount || parseFloat(profitAmount) <= 0) {
// //       showSnackbar('Please enter a valid profit amount', 'error');
// //       return;
// //     }

// //     setIsDistributing(true);
// //     try {
// //       const token = localStorage.getItem('authToken');
// //       const response = await axios.post(
// //         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
// //         { profit: parseFloat(profitAmount) },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       showSnackbar(
// //         `Profits distributed successfully! (ID: ${response.data.result.distribution_id})`,
// //         'success'
// //       );
      
// //       setOpenDistribution(false);
// //       setProfitAmount('');
// //       await fetchPAMMData();
// //     } catch (error) {
// //       showSnackbar(
// //         error.response?.data?.message || 'Failed to distribute profits',
// //         'error'
// //       );
// //     } finally {
// //       setIsDistributing(false);
// //     }
// //   };

// const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//     // const token = localStorage.getItem('refreshToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }
  
//       // Validate input
//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }
  
//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors. Fees: $${response.data.total_fees.toFixed(2)}`,
//         'success'
//       );
      
//       // Reset and refresh data
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={3} sx={{ 
//       backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//       color: theme === 'dark' ? '#ffffff' : '#121212'
//     }}>
//       <Typography variant="h4" gutterBottom>
//         PAMM Manager Dashboard
//       </Typography>

//       {/* {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//           border: '1px dashed', 
//           p: 3, 
//           borderRadius: 1,
//           borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//           >
//             Initialize Manager Account
//           </Button>
//           <Typography variant="body1">
//             You must initialize your manager account before performing any operations
//           </Typography>
//         </Box>
//       )} */}

//         {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//             border: '1px dashed', 
//             p: 3, 
//             borderRadius: 1,
//             borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//             <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//             >
//             {loading ? <CircularProgress size={24} /> : 'Initialize Manager Account'}
//             </Button>
//             <Typography variant="body1">
//             {loading ? 'Checking manager status...' : 'You must initialize your manager account'}
//             </Typography>
//         </Box>
//         )}

//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Button 
//           variant="outlined" 
//           onClick={fetchPAMMData}
//           startIcon={<RefreshIcon />}
//           disabled={loading}
//         >
//           Refresh Data
//         </Button>
//       </Box>

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <InvestorsIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Investors</Typography>
//                   <Typography variant="h4">
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProfitIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Total Funds</Typography>
//                   <Typography variant="h4">
//                     ${pammData.totalFunds.toLocaleString(undefined, { 
//                       minimumFractionDigits: 2, 
//                       maximumFractionDigits: 2 
//                     })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AllocationIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Your Allocation</Typography>
//                   <Typography variant="h4">
//                     {(pammData.managerAllocation * 100).toFixed(2)}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recent Profit Distributions
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell align="right">Amount</TableCell>
//                   <TableCell align="right">Investors</TableCell>
//                   <TableCell align="right">Fees</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {distributions.length > 0 ? (
//                   distributions.slice(0, 5).map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell>
//                         {new Date(row.timestamp).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell align="right">
//                         ${(row.amount || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.investor_count || 0}</TableCell>
//                       <TableCell align="right">
//                         ${(row.fees || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">
//                       No distributions yet
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Rest of the component remains the same */}
//       {/* ... */}

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => setOpenDistribution(true)}
//                   startIcon={<AddIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Distribute Profits
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/trading')}
//                   startIcon={<TradeIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Execute Managed Trades
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/reports')}
//                   disabled={!isManagerInitialized}
//                 >
//                   View Investor Reports
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Performance Summary
//               </Typography>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>YTD Return:</Typography>
//                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                   {performance.ytdReturn.toFixed(2)}%
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>Total Fees Earned:</Typography>
//                 <Typography>
//                   ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               {/* <Box display="flex" justifyContent="space-between">
//                 <Typography>Next Distribution:</Typography>
//                 <Typography>
//                   {performance.nextDistribution ? 
//                     new Date(performance.nextDistribution).toLocaleDateString() : 
//                     'Not scheduled'}
//                 </Typography>
//               </Box> */}

//         {/* // In your manager dashboard component, remove or modify the Next Distribution display */}
//             <Box display="flex" justifyContent="space-between">
//             <Typography>Last Distribution:</Typography>
//             <Typography>
//                 {distributions.length > 0 ? 
//                 new Date(distributions[0].timestamp).toLocaleDateString() : 
//                 'Never'}
//             </Typography>
//             </Box>
//            </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Initialize Manager Dialog */}
//       <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//         <DialogTitle>Initialize Manager Account</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please set your initial manager capital to begin managing the PAMM system.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Initial Capital"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleInitializeManager}
//             color="primary"
//             variant="contained"
//             disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//           >
//             {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>



//       {/* Distribute Profits Dialog */}
//       <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//         <DialogTitle>Distribute Profits</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Profit Amount"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//           <Button 
//             onClick={handleDistributeProfits}
//             color="primary"
//             variant="contained"
//             disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//           >
//             {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PAMMManager;





// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   LinearProgress
// } from '@mui/material';
// import {
//   People as InvestorsIcon,
//   AttachMoney as ProfitIcon,
//   PieChart as AllocationIcon,
//   Add as AddIcon,
//   AccountBalance as TradeIcon,
//   AccountCircle as ManagerIcon,
//   Refresh as RefreshIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerAllocation: 0.2,
//     managerCapital: 0,
//     investorCapital: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0,
//     initialBalance: 0,
//     currentBalance: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [capitalWarning, setCapitalWarning] = useState(false);

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerAllocation: 0.2,
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0,
//         initialBalance: perfRes.data.initialBalance || 0,
//         currentBalance: perfRes.data.currentBalance || 0
//       });

//       setCapitalWarning(capitalRatio < 0.2);

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={3} sx={{ 
//       backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//       color: theme === 'dark' ? '#ffffff' : '#121212'
//     }}>
//       <Typography variant="h4" gutterBottom>
//         PAMM Manager Dashboard
//       </Typography>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//           border: '1px dashed', 
//           p: 3, 
//           borderRadius: 1,
//           borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//           >
//             Initialize Manager Account
//           </Button>
//           <Typography variant="body1">
//             You must initialize your manager account before performing any operations
//           </Typography>
//         </Box>
//       )}

//       {capitalWarning && isManagerInitialized && (
//         <Alert severity="warning" sx={{ mb: 3 }}>
//           <WarningIcon fontSize="inherit" />
//           Your capital ratio is below the recommended 20% minimum. Consider adding more funds.
//         </Alert>
//       )}

//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Button 
//           variant="outlined" 
//           onClick={fetchPAMMData}
//           startIcon={<RefreshIcon />}
//           disabled={loading}
//         >
//           Refresh Data
//         </Button>
//       </Box>

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <InvestorsIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Investors</Typography>
//                   <Typography variant="h4">
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProfitIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Total Funds</Typography>
//                   <Typography variant="h4">
//                     ${pammData.totalFunds.toLocaleString(undefined, { 
//                       minimumFractionDigits: 2, 
//                       maximumFractionDigits: 2 
//                     })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AllocationIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Capital Ratio</Typography>
//                   <Typography variant="h4">
//                     {(pammData.capitalRatio * 100).toFixed(1)}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Capital Safety
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <Box width="100%" mr={1}>
//               <LinearProgress
//                 variant="determinate"
//                 value={Math.min(pammData.capitalRatio * 100, 100)}
//                 sx={{
//                   height: 10,
//                   '& .MuiLinearProgress-bar': {
//                     backgroundColor: pammData.capitalRatio >= 0.2 ? 'success.main' : 'error.main'
//                   }
//                 }}
//               />
//             </Box>
//             <Typography>
//               ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//             </Typography>
//           </Box>
//           <Typography variant="caption">
//             {pammData.capitalRatio >= 0.2
//               ? "✅ Meets minimum 20% requirement"
//               : "⚠️ Below recommended capital ratio"}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recent Profit Distributions
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell align="right">Amount</TableCell>
//                   <TableCell align="right">Investors</TableCell>
//                   <TableCell align="right">Fees</TableCell>
//                   <TableCell align="right">Liquidations</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {distributions.length > 0 ? (
//                   distributions.slice(0, 5).map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell>
//                         {new Date(row.timestamp).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell align="right">
//                         ${(row.amount || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.investor_count || 0}</TableCell>
//                       <TableCell align="right">
//                         ${(row.fees || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.liquidated_count || 0}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No distributions yet
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => setOpenDistribution(true)}
//                   startIcon={<AddIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Distribute Profits
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/trading')}
//                   startIcon={<TradeIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Execute Managed Trades
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/reports')}
//                   disabled={!isManagerInitialized}
//                 >
//                   View Investor Reports
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Performance Summary
//               </Typography>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>YTD Return:</Typography>
//                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                   {performance.ytdReturn.toFixed(2)}%
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>Total Fees Earned:</Typography>
//                 <Typography>
//                   ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography>Last Distribution:</Typography>
//                 <Typography>
//                   {distributions.length > 0 ? 
//                     new Date(distributions[0].timestamp).toLocaleDateString() : 
//                     'Never'}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Initialize Manager Dialog */}
//       <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//         <DialogTitle>Initialize Manager Account</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please set your initial manager capital (minimum 20% of investor capital recommended)
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Initial Capital"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleInitializeManager}
//             color="primary"
//             variant="contained"
//             disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//           >
//             {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Distribute Profits Dialog */}
//       <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//         <DialogTitle>Distribute Profits</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Profit Amount"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//           <Button 
//             onClick={handleDistributeProfits}
//             color="primary"
//             variant="contained"
//             disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//           >
//             {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PAMMManager;




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   LinearProgress
// } from '@mui/material';
// import {
//   People as InvestorsIcon,
//   AttachMoney as ProfitIcon,
//   PieChart as AllocationIcon,
//   Add as AddIcon,
//   AccountBalance as TradeIcon,
//   AccountCircle as ManagerIcon,
//   Refresh as RefreshIcon,
//   Warning as WarningIcon,
//   AttachMoney as MoneyIcon,
//   ZoomInRounded
// } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const ratio = investorCapital > 0 ? managerCapital / investorCapital : 0;
//   if (ratio >= 0.2) return null;
  
//   const requiredAdditional = (investorCapital * 0.2) - managerCapital;
  
//   return (
//     <Alert severity="error" sx={{ mb: 3 }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon fontSize="inherit" sx={{ mr: 1 }} />
//         <Box>
//           <Typography fontWeight="bold">
//             Capital Crisis: Only {Math.round(ratio * 100)}% ratio
//           </Typography>
//           <Typography variant="body2">
//             You need to add <strong>${requiredAdditional.toLocaleString(undefined, { 
//               minimumFractionDigits: 2 
//             })}</strong> to reach 20% minimum
//           </Typography>
//         </Box>
//       </Box>
//     </Alert>
//   );
// };

// const AllocationWarning = ({ investors }) => {
//   if (investors.length < 2) return null;
//   const largestAllocation = Math.max(...investors.map(i => i.allocation_pct));
//   if (largestAllocation <= 0.5) return null;
  
//   return (
//     <Alert severity="warning" sx={{ mt: 2 }}>
//       <Typography>
//         Warning: One investor controls {(largestAllocation * 100).toFixed(0)}% of allocations
//       </Typography>
//     </Alert>
//   );
// };

// // Performance Chart Component using the imported chart components
// const PerformanceChart = ({ distributions }) => {
//   const chartData = distributions.slice(0, 10).reverse().map((dist, index) => ({
//     name: `Dist ${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0
//   }));

//   if (chartData.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" color="text.secondary">
//           No distribution data available
//         </Typography>
//         <ZoomInRounded sx={{ ml: 1 }} />
//       </Box>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={200}>
//       <BarChart data={chartData}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="amount" fill="#8884d8">
//           {chartData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
//           ))}
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
//       if (error.response?.status === 401) {
//         showSnackbar('Session expired. Please log in again.', 'error');
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, showSnackbar, navigate]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleAddCapital = async () => {
//     try {
//       const amount = parseFloat(boostAmount);
//       if (isNaN(amount)) {
//         throw new Error("Invalid amount");
//       }
      
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/add-capital`, 
//         { amount }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSnackbar(`Successfully added $${amount} to manager capital`, 'success');
//       setBoostDialogOpen(false);
//       fetchPAMMData();
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={3} sx={{ 
//       backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//       color: theme === 'dark' ? '#ffffff' : '#121212'
//     }}>
//       <Typography variant="h4" gutterBottom>
//         PAMM Manager Dashboard
//       </Typography>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//           border: '1px dashed', 
//           p: 3, 
//           borderRadius: 1,
//           borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//           >
//             Initialize Manager Account
//           </Button>
//           <Typography variant="body1">
//             You must initialize your manager account before performing any operations
//           </Typography>
//         </Box>
//       )}

//       <CapitalHealthWarning 
//         investorCapital={pammData.investorCapital} 
//         managerCapital={pammData.managerCapital} 
//       />

//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Button 
//           variant="outlined" 
//           onClick={fetchPAMMData}
//           startIcon={<RefreshIcon />}
//           disabled={loading}
//         >
//           Refresh Data
//         </Button>
//       </Box>

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <InvestorsIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Investors</Typography>
//                   <Typography variant="h4">
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProfitIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Total Funds</Typography>
//                   <Typography variant="h4">
//                     ${pammData.totalFunds.toLocaleString(undefined, { 
//                       minimumFractionDigits: 2, 
//                       maximumFractionDigits: 2 
//                     })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AllocationIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Capital Ratio</Typography>
//                   <Typography variant="h4">
//                     {(pammData.capitalRatio * 100).toFixed(1)}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Capital Safety
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <Box width="100%" mr={1}>
//               <LinearProgress
//                 variant="determinate"
//                 value={Math.min(pammData.capitalRatio * 100, 100)}
//                 sx={{
//                   height: 10,
//                   '& .MuiLinearProgress-bar': {
//                     backgroundColor: pammData.capitalRatio >= 0.2 ? 'success.main' : 'error.main'
//                   }
//                 }}
//               />
//             </Box>
//             <Typography>
//               ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//             </Typography>
//           </Box>
//           <Typography variant="caption">
//             {pammData.capitalRatio >= 0.2
//               ? "✅ Meets minimum 20% requirement"
//               : "⚠️ Below recommended capital ratio"}
//           </Typography>
//           {pammData.capitalRatio < 0.2 && (
//             <Button
//               variant="outlined"
//               color="warning"
//               startIcon={<MoneyIcon />}
//               sx={{ mt: 1 }}
//               onClick={() => setBoostDialogOpen(true)}
//             >
//               Add Capital
//             </Button>
//           )}
//           <AllocationWarning investors={pammData.investors} />
//         </CardContent>
//       </Card>

//       {/* Performance Chart Section */}
//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Distribution Performance Chart
//           </Typography>
//           <PerformanceChart distributions={distributions} />
//         </CardContent>
//       </Card>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recent Profit Distributions
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell align="right">Amount</TableCell>
//                   <TableCell align="right">Investors</TableCell>
//                   <TableCell align="right">Fees</TableCell>
//                   <TableCell align="right">Liquidations</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {distributions.length > 0 ? (
//                   distributions.slice(0, 5).map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell>
//                         {new Date(row.timestamp).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell align="right">
//                         ${(row.amount || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.investor_count || 0}</TableCell>
//                       <TableCell align="right">
//                         ${(row.fees || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.liquidated_count || 0}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No distributions yet
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => setOpenDistribution(true)}
//                   startIcon={<AddIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Distribute Profits
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/trading')}
//                   startIcon={<TradeIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Execute Managed Trades
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/reports')}
//                   disabled={!isManagerInitialized}
//                 >
//                   View Investor Reports
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Performance Summary
//               </Typography>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>YTD Return:</Typography>
//                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                   {performance.ytdReturn.toFixed(2)}%
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>Total Fees Earned:</Typography>
//                 <Typography>
//                   ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography>Last Distribution:</Typography>
//                 <Typography>
//                   {distributions.length > 0 ? 
//                     new Date(distributions[0].timestamp).toLocaleDateString() : 
//                     'Never'}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Initialize Manager Dialog */}
//       <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//         <DialogTitle>Initialize Manager Account</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please set your initial manager capital (minimum 20% of investor capital recommended)
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Initial Capital"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleInitializeManager}
//             color="primary"
//             variant="contained"
//             disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//           >
//             {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Distribute Profits Dialog */}
//       <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//         <DialogTitle>Distribute Profits</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Profit Amount"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//           <Button 
//             onClick={handleDistributeProfits}
//             color="primary"
//             variant="contained"
//             disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//           >
//             {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Capital Dialog */}
//       <Dialog open={boostDialogOpen} onClose={() => setBoostDialogOpen(false)}>
//         <DialogTitle>Add Manager Capital</DialogTitle>
//         <DialogContent>
//           <Typography paragraph>
//             Current ratio: {(pammData.capitalRatio * 100).toFixed(1)}%
//           </Typography>
//           <Typography paragraph>
//             Minimum required: ${(pammData.investorCapital * 0.2 - pammData.managerCapital).toFixed(2)}
//           </Typography>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Amount to Add"
//             type="number"
//             fullWidth
//             value={boostAmount}
//             onChange={(e) => setBoostAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBoostDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddCapital}
//             color="primary"
//             variant="contained"
//           >
//             Add Capital
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PAMMManager;




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   LinearProgress
// } from '@mui/material';
// import {
//   People as InvestorsIcon,
//   AttachMoney as ProfitIcon,
//   PieChart as AllocationIcon,
//   Add as AddIcon,
//   AccountBalance as TradeIcon,
//   AccountCircle as ManagerIcon,
//   Refresh as RefreshIcon,
//   Warning as WarningIcon,
//   AttachMoney as MoneyIcon,
//   ZoomInRounded,
//   TrendingUp,
//   TrendingDown
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const ratio = investorCapital > 0 ? managerCapital / investorCapital : 0;
//   if (ratio >= 0.2) return null;
  
//   const requiredAdditional = (investorCapital * 0.2) - managerCapital;
  
//   return (
//     <Alert severity="error" sx={{ mb: 3 }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon fontSize="inherit" sx={{ mr: 1 }} />
//         <Box>
//           <Typography fontWeight="bold">
//             Capital Crisis: Only {Math.round(ratio * 100)}% ratio
//           </Typography>
//           <Typography variant="body2">
//             You need to add <strong>${requiredAdditional.toLocaleString(undefined, { 
//               minimumFractionDigits: 2 
//             })}</strong> to reach 20% minimum
//           </Typography>
//         </Box>
//       </Box>
//     </Alert>
//   );
// };

// const AllocationWarning = ({ investors }) => {
//   if (investors.length < 2) return null;
//   const largestAllocation = Math.max(...investors.map(i => i.allocation_pct));
//   if (largestAllocation <= 0.5) return null;
  
//   return (
//     <Alert severity="warning" sx={{ mt: 2 }}>
//       <Typography>
//         Warning: One investor controls {(largestAllocation * 100).toFixed(0)}% of allocations
//       </Typography>
//     </Alert>
//   );
// };

// const DistributionPerformance = ({ distributions }) => {
//   if (distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" color="text.secondary">
//           No distribution data available
//         </Typography>
//       </Box>
//     );
//   }

//   // Calculate statistics
//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1 
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100 
//     : 0;

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Distribution Performance
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Total Distributed</Typography>
//               <Typography variant="h5">
//                 ${totalDistributed.toLocaleString(undefined, { 
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2 
//                 })}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Average Distribution</Typography>
//               <Typography variant="h5">
//                 ${averageDistribution.toLocaleString(undefined, { 
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2 
//                 })}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Last Distribution</Typography>
//               <Box display="flex" alignItems="center">
//                 <Typography variant="h5" sx={{ mr: 1 }}>
//                   ${lastDistribution.toLocaleString(undefined, { 
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2 
//                   })}
//                 </Typography>
//                 {distributionChange !== 0 && (
//                   <>
//                     {distributionChange >= 0 ? (
//                       <TrendingUp color="success" />
//                     ) : (
//                       <TrendingDown color="error" />
//                     )}
//                     <Typography 
//                       color={distributionChange >= 0 ? "success.main" : "error.main"}
//                     >
//                       {Math.abs(distributionChange).toFixed(1)}%
//                     </Typography>
//                   </>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
//       if (error.response?.status === 401) {
//         showSnackbar('Session expired. Please log in again.', 'error');
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, showSnackbar, navigate]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleAddCapital = async () => {
//     try {
//       const amount = parseFloat(boostAmount);
//       if (isNaN(amount)) {
//         throw new Error("Invalid amount");
//       }
      
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/add-capital`, 
//         { amount }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSnackbar(`Successfully added $${amount} to manager capital`, 'success');
//       setBoostDialogOpen(false);
//       fetchPAMMData();
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={3} sx={{ 
//       backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//       color: theme === 'dark' ? '#ffffff' : '#121212'
//     }}>
//       <Typography variant="h4" gutterBottom>
//         PAMM Manager Dashboard
//       </Typography>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//           border: '1px dashed', 
//           p: 3, 
//           borderRadius: 1,
//           borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//           >
//             Initialize Manager Account
//           </Button>
//           <Typography variant="body1">
//             You must initialize your manager account before performing any operations
//           </Typography>
//         </Box>
//       )}

//       <CapitalHealthWarning 
//         investorCapital={pammData.investorCapital} 
//         managerCapital={pammData.managerCapital} 
//       />

//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Button 
//           variant="outlined" 
//           onClick={fetchPAMMData}
//           startIcon={<RefreshIcon />}
//           disabled={loading}
//         >
//           Refresh Data
//         </Button>
//       </Box>

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <InvestorsIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Investors</Typography>
//                   <Typography variant="h4">
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProfitIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Total Funds</Typography>
//                   <Typography variant="h4">
//                     ${pammData.totalFunds.toLocaleString(undefined, { 
//                       minimumFractionDigits: 2, 
//                       maximumFractionDigits: 2 
//                     })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AllocationIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Capital Ratio</Typography>
//                   <Typography variant="h4">
//                     {(pammData.capitalRatio * 100).toFixed(1)}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Capital Safety
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <Box width="100%" mr={1}>
//               <LinearProgress
//                 variant="determinate"
//                 value={Math.min(pammData.capitalRatio * 100, 100)}
//                 sx={{
//                   height: 10,
//                   '& .MuiLinearProgress-bar': {
//                     backgroundColor: pammData.capitalRatio >= 0.2 ? 'success.main' : 'error.main'
//                   }
//                 }}
//               />
//             </Box>
//             <Typography>
//               ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//             </Typography>
//           </Box>
//           <Typography variant="caption">
//             {pammData.capitalRatio >= 0.2
//               ? "✅ Meets minimum 20% requirement"
//               : "⚠️ Below recommended capital ratio"}
//           </Typography>
//           {pammData.capitalRatio < 0.2 && (
//             <Button
//               variant="outlined"
//               color="warning"
//               startIcon={<MoneyIcon />}
//               sx={{ mt: 1 }}
//               onClick={() => setBoostDialogOpen(true)}
//             >
//               Add Capital
//             </Button>
//           )}
//           <AllocationWarning investors={pammData.investors} />
//         </CardContent>
//       </Card>

//       {/* Distribution Performance Section */}
//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <DistributionPerformance distributions={distributions} />
//         </CardContent>
//       </Card>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => setOpenDistribution(true)}
//                   startIcon={<AddIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Distribute Profits
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/trading')}
//                   startIcon={<TradeIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Execute Managed Trades
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/reports')}
//                   disabled={!isManagerInitialized}
//                 >
//                   View Investor Reports
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Performance Summary
//               </Typography>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>YTD Return:</Typography>
//                 <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//                   {performance.ytdReturn.toFixed(2)}%
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>Total Fees Earned:</Typography>
//                 <Typography>
//                   ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography>Total Distributions:</Typography>
//                 <Typography>
//                   {distributions.length}
//                 </Typography>
//               </Box>
//               <Box display="flex" justifyContent="space-between">
//                 <Typography>Last Distribution:</Typography>
//                 <Typography>
//                   {distributions.length > 0 ? 
//                     new Date(distributions[0].timestamp).toLocaleDateString() : 
//                     'Never'}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mt: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recent Profit Distributions
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell align="right">Amount</TableCell>
//                   <TableCell align="right">Investors</TableCell>
//                   <TableCell align="right">Fees</TableCell>
//                   <TableCell align="right">Liquidations</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {distributions.length > 0 ? (
//                   distributions.slice(0, 5).map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell>
//                         {new Date(row.timestamp).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell align="right">
//                         ${(row.amount || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.investor_count || 0}</TableCell>
//                       <TableCell align="right">
//                         ${(row.fees || 0).toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell align="right">{row.liquidated_count || 0}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No distributions yet
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Initialize Manager Dialog */}
//       <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//         <DialogTitle>Initialize Manager Account</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please set your initial manager capital (minimum 20% of investor capital recommended)
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Initial Capital"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleInitializeManager}
//             color="primary"
//             variant="contained"
//             disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//           >
//             {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Distribute Profits Dialog */}
//       <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//         <DialogTitle>Distribute Profits</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Profit Amount"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//           <Button 
//             onClick={handleDistributeProfits}
//             color="primary"
//             variant="contained"
//             disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//           >
//             {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Capital Dialog */}
//       <Dialog open={boostDialogOpen} onClose={() => setBoostDialogOpen(false)}>
//         <DialogTitle>Add Manager Capital</DialogTitle>
//         <DialogContent>
//           <Typography paragraph>
//             Current ratio: {(pammData.capitalRatio * 100).toFixed(1)}%
//           </Typography>
//           <Typography paragraph>
//             Minimum required: ${(pammData.investorCapital * 0.2 - pammData.managerCapital).toFixed(2)}
//           </Typography>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Amount to Add"
//             type="number"
//             fullWidth
//             value={boostAmount}
//             onChange={(e) => setBoostAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBoostDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddCapital}
//             color="primary"
//             variant="contained"
//           >
//             Add Capital
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PAMMManager;







// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   LinearProgress
// } from '@mui/material';
// import {
//   People as InvestorsIcon,
//   AttachMoney as ProfitIcon,
//   PieChart as AllocationIcon,
//   Add as AddIcon,
//   AccountBalance as TradeIcon,
//   AccountCircle as ManagerIcon,
//   Refresh as RefreshIcon,
//   Warning as WarningIcon,
//   AttachMoney as MoneyIcon,
//   ZoomInRounded,
//   TrendingUp,
//   TrendingDown
// } from '@mui/icons-material';
// import { 
//   ResponsiveContainer, 
//   BarChart, 
//   Bar, 
//   Cell, 
//   XAxis, 
//   YAxis, 
//   Tooltip, 
//   Legend,
//   LineChart, 
//   Line 
// } from 'recharts';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const ratio = investorCapital > 0 ? managerCapital / investorCapital : 0;
//   if (ratio >= 0.2) return null;
  
//   const requiredAdditional = (investorCapital * 0.2) - managerCapital;
  
//   return (
//     <Alert severity="error" sx={{ mb: 3 }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon fontSize="inherit" sx={{ mr: 1 }} />
//         <Box>
//           <Typography fontWeight="bold">
//             Capital Crisis: Only {Math.round(ratio * 100)}% ratio
//           </Typography>
//           <Typography variant="body2">
//             You need to add <strong>${requiredAdditional.toLocaleString(undefined, { 
//               minimumFractionDigits: 2 
//             })}</strong> to reach 20% minimum
//           </Typography>
//         </Box>
//       </Box>
//     </Alert>
//   );
// };

// const AllocationWarning = ({ investors }) => {
//   if (investors.length < 2) return null;
//   const largestAllocation = Math.max(...investors.map(i => i.allocation_pct));
//   if (largestAllocation <= 0.5) return null;
  
//   return (
//     <Alert severity="warning" sx={{ mt: 2 }}>
//       <Typography>
//         Warning: One investor controls {(largestAllocation * 100).toFixed(0)}% of allocations
//       </Typography>
//     </Alert>
//   );
// };

// const PerformanceChart = ({ distributions }) => {
//   const chartData = distributions.slice(0, 10).reverse().map((dist, index) => ({
//     name: `Dist ${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0
//   }));

//   if (chartData.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" color="text.secondary">
//           No distribution data available
//         </Typography>
//         <ZoomInRounded sx={{ ml: 1 }} />
//       </Box>
//     );
//   }

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={chartData}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="amount" fill="#8884d8" name="Distribution Amount">
//           {chartData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
//           ))}
//         </Bar>
//         <Bar dataKey="fees" fill="#ffc658" name="Fees" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// const DistributionPerformance = ({ distributions }) => {
//   if (distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" color="text.secondary">
//           No distribution data available
//         </Typography>
//       </Box>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1 
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100 
//     : 0;

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Distribution Performance
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Total Distributed</Typography>
//               <Typography variant="h5">
//                 ${totalDistributed.toLocaleString(undefined, { 
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2 
//                 })}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Average Distribution</Typography>
//               <Typography variant="h5">
//                 ${averageDistribution.toLocaleString(undefined, { 
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2 
//                 })}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="text.secondary">Last Distribution</Typography>
//               <Box display="flex" alignItems="center">
//                 <Typography variant="h5" sx={{ mr: 1 }}>
//                   ${lastDistribution.toLocaleString(undefined, { 
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2 
//                   })}
//                 </Typography>
//                 {distributionChange !== 0 && (
//                   <>
//                     {distributionChange >= 0 ? (
//                       <TrendingUp color="success" />
//                     ) : (
//                       <TrendingDown color="error" />
//                     )}
//                     <Typography 
//                       color={distributionChange >= 0 ? "success.main" : "error.main"}
//                     >
//                       {Math.abs(distributionChange).toFixed(1)}%
//                     </Typography>
//                   </>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
      
//       <Typography variant="subtitle1" gutterBottom>
//         Distribution History
//       </Typography>
//       <PerformanceChart distributions={distributions} />
//     </Box>
//   );
// };

// const PerformanceSummary = ({ performance, distributions }) => {
//   const performanceData = distributions.slice(0, 6).reverse().map((dist, index) => ({
//     name: `Dist ${distributions.length - index}`,
//     return: dist.amount ? (dist.amount / (dist.amount - dist.fees)) * 100 : 0,
//     fees: dist.fees || 0
//   }));

//   return (
//     <Card variant="outlined">
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           Performance Summary
//         </Typography>
        
//         <Box mb={3}>
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography>YTD Return:</Typography>
//             <Typography color={performance.ytdReturn >= 0 ? "success.main" : "error.main"}>
//               {performance.ytdReturn.toFixed(2)}%
//             </Typography>
//           </Box>
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography>Total Fees Earned:</Typography>
//             <Typography>
//               ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box display="flex" justifyContent="space-between" mb={2}>
//             <Typography>Total Distributions:</Typography>
//             <Typography>
//               {distributions.length}
//             </Typography>
//           </Box>
//           <Box display="flex" justifyContent="space-between">
//             <Typography>Last Distribution:</Typography>
//             <Typography>
//               {distributions.length > 0 ? 
//                 new Date(distributions[0].timestamp).toLocaleDateString() : 
//                 'Never'}
//             </Typography>
//           </Box>
//         </Box>

//         <Typography variant="subtitle2" gutterBottom>
//           Performance Trend
//         </Typography>
//         {distributions.length > 0 ? (
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={performanceData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line 
//                 type="monotone" 
//                 dataKey="return" 
//                 stroke="#8884d8" 
//                 name="Return %" 
//                 strokeWidth={2}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="fees" 
//                 stroke="#82ca9d" 
//                 name="Fees ($)" 
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         ) : (
//           <Box display="flex" alignItems="center" justifyContent="center" height={100}>
//             <Typography variant="body2" color="text.secondary">
//               No performance data available
//             </Typography>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const RecentProfitDistributions = ({ distributions }) => {
//   const breakdownData = distributions.length > 0 
//     ? [
//         { name: 'Investor Payouts', value: distributions[0].amount - distributions[0].fees },
//         { name: 'Manager Fees', value: distributions[0].fees }
//       ]
//     : [];

//   return (
//     <Card variant="outlined">
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           Recent Profit Distributions
//         </Typography>
        
//         <TableContainer component={Paper} sx={{ mb: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Date</TableCell>
//                 <TableCell align="right">Amount</TableCell>
//                 <TableCell align="right">Investors</TableCell>
//                 <TableCell align="right">Fees</TableCell>
//                 <TableCell align="right">Liquidations</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {distributions.length > 0 ? (
//                 distributions.slice(0, 5).map((row) => (
//                   <TableRow key={row.id}>
//                     <TableCell>
//                       {new Date(row.timestamp).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell align="right">
//                       ${(row.amount || 0).toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                       })}
//                     </TableCell>
//                     <TableCell align="right">{row.investor_count || 0}</TableCell>
//                     <TableCell align="right">
//                       ${(row.fees || 0).toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                       })}
//                     </TableCell>
//                     <TableCell align="right">{row.liquidated_count || 0}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     No distributions yet
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {distributions.length > 0 && (
//           <>
//             <Typography variant="subtitle2" gutterBottom>
//               Last Distribution Breakdown
//             </Typography>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart
//                 layout="vertical"
//                 data={breakdownData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
//       if (error.response?.status === 401) {
//         showSnackbar('Session expired. Please log in again.', 'error');
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, showSnackbar, navigate]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleAddCapital = async () => {
//     try {
//       const amount = parseFloat(boostAmount);
//       if (isNaN(amount)) {
//         throw new Error("Invalid amount");
//       }
      
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/add-capital`, 
//         { amount }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSnackbar(`Successfully added $${amount} to manager capital`, 'success');
//       setBoostDialogOpen(false);
//       fetchPAMMData();
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={3} sx={{ 
//       backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
//       color: theme === 'dark' ? '#ffffff' : '#121212'
//     }}>
//       <Typography variant="h4" gutterBottom>
//         PAMM Manager Dashboard
//       </Typography>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center" sx={{ 
//           border: '1px dashed', 
//           p: 3, 
//           borderRadius: 1,
//           borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
//         }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<ManagerIcon />}
//             size="large"
//             sx={{ mb: 2 }}
//           >
//             Initialize Manager Account
//           </Button>
//           <Typography variant="body1">
//             You must initialize your manager account before performing any operations
//           </Typography>
//         </Box>
//       )}

//       <CapitalHealthWarning 
//         investorCapital={pammData.investorCapital} 
//         managerCapital={pammData.managerCapital} 
//       />

//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Button 
//           variant="outlined" 
//           onClick={fetchPAMMData}
//           startIcon={<RefreshIcon />}
//           disabled={loading}
//         >
//           Refresh Data
//         </Button>
//       </Box>

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <InvestorsIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Investors</Typography>
//                   <Typography variant="h4">
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProfitIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Total Funds</Typography>
//                   <Typography variant="h4">
//                     ${pammData.totalFunds.toLocaleString(undefined, { 
//                       minimumFractionDigits: 2, 
//                       maximumFractionDigits: 2 
//                     })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AllocationIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6">Capital Ratio</Typography>
//                   <Typography variant="h4">
//                     {(pammData.capitalRatio * 100).toFixed(1)}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Capital Safety
//           </Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//             <Box width="100%" mr={1}>
//               <LinearProgress
//                 variant="determinate"
//                 value={Math.min(pammData.capitalRatio * 100, 100)}
//                 sx={{
//                   height: 10,
//                   '& .MuiLinearProgress-bar': {
//                     backgroundColor: pammData.capitalRatio >= 0.2 ? 'success.main' : 'error.main'
//                   }
//                 }}
//               />
//             </Box>
//             <Typography>
//               ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//             </Typography>
//           </Box>
//           <Typography variant="caption">
//             {pammData.capitalRatio >= 0.2
//               ? "✅ Meets minimum 20% requirement"
//               : "⚠️ Below recommended capital ratio"}
//           </Typography>
//           {pammData.capitalRatio < 0.2 && (
//             <Button
//               variant="outlined"
//               color="warning"
//               startIcon={<MoneyIcon />}
//               sx={{ mt: 1 }}
//               onClick={() => setBoostDialogOpen(true)}
//             >
//               Add Capital
//             </Button>
//           )}
//           <AllocationWarning investors={pammData.investors} />
//         </CardContent>
//       </Card>

//       <Card sx={{ mb: 4 }}>
//         <CardContent>
//           <DistributionPerformance distributions={distributions} />
//         </CardContent>
//       </Card>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => setOpenDistribution(true)}
//                   startIcon={<AddIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Distribute Profits
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/trading')}
//                   startIcon={<TradeIcon />}
//                   disabled={!isManagerInitialized}
//                 >
//                   Execute Managed Trades
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   onClick={() => navigate('/dashboard/manager/reports')}
//                   disabled={!isManagerInitialized}
//                 >
//                   View Investor Reports
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <PerformanceSummary performance={performance} distributions={distributions} />
//         </Grid>
//       </Grid>

//       <RecentProfitDistributions distributions={distributions} />

//       {/* Initialize Manager Dialog */}
//       <Dialog open={initDialogOpen} onClose={() => setInitDialogOpen(false)}>
//         <DialogTitle>Initialize Manager Account</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please set your initial manager capital (minimum 20% of investor capital recommended)
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Initial Capital"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setInitDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleInitializeManager}
//             color="primary"
//             variant="contained"
//             disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//           >
//             {initLoading ? <CircularProgress size={24} /> : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Distribute Profits Dialog */}
//       <Dialog open={openDistribution} onClose={() => setOpenDistribution(false)}>
//         <DialogTitle>Distribute Profits</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Profit Amount"
//             type="number"
//             fullWidth
//             variant="outlined"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDistribution(false)}>Cancel</Button>
//           <Button 
//             onClick={handleDistributeProfits}
//             color="primary"
//             variant="contained"
//             disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//           >
//             {isDistributing ? <CircularProgress size={24} /> : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Capital Dialog */}
//       <Dialog open={boostDialogOpen} onClose={() => setBoostDialogOpen(false)}>
//         <DialogTitle>Add Manager Capital</DialogTitle>
//         <DialogContent>
//           <Typography paragraph>
//             Current ratio: {(pammData.capitalRatio * 100).toFixed(1)}%
//           </Typography>
//           <Typography paragraph>
//             Minimum required: ${(pammData.investorCapital * 0.2 - pammData.managerCapital).toFixed(2)}
//           </Typography>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Amount to Add"
//             type="number"
//             fullWidth
//             value={boostAmount}
//             onChange={(e) => setBoostAmount(e.target.value)}
//             InputProps={{
//               startAdornment: '$',
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBoostDialogOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddCapital}
//             color="primary"
//             variant="contained"
//           >
//             Add Capital
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default PAMMManager;





// import React, { useState, useMemo , useEffect, useCallback } from 'react';
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';


// // PerformanceChart Component
// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 

// 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   // Transform distributions data for chart
//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0,
//     date: new Date(dist.timestamp).toLocaleDateString()
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // CapitalHealthWarning Component
// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null; // Don't show warning if capital is healthy
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // AllocationWarning Component
// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   // Calculate allocation concentration
//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance || 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance || 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   // Check for risky concentration (>50% from single investor)
//   const isConcentrated = concentrationRatio > 0.5;

//   // Check for small investor base
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // DistributionPieChart Component
// const DistributionPieChart = ({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: lastDistribution.amount - lastDistribution.fees },
//     { name: 'Manager Fees', value: lastDistribution.fees }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // DistributionPerformance Component
// const DistributionPerformance = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     console.warn('DistributionPerformance: No distributions data provided');
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100
//     : 0;

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// };


// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount || 0;
//       const fees = dist.fees || 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       console.log(`Dist ${distributions.length - index}: amount=${amount}, fees=${fees}, return=${returnValue.toFixed(2)}%`);
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     console.warn('PerformanceSummary: No distributions data provided');
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {performance.ytdReturn.toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 ? new Date(distributions[0].timestamp).toLocaleDateString() : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'Return %' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });



// // RecentProfitDistributions Component
// const RecentProfitDistributions = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     console.warn('RecentProfitDistributions: No distributions data provided');
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: distributions[0].amount - distributions[0].fees },
//     { name: 'Manager Fees', value: distributions[0].fees }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row) => (
//               <tr key={row.id} className="border-b border-gray-700">
//                 <td className="p-2">{new Date(row.timestamp).toLocaleDateString()}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count || 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // PAMMManager Component
// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const navigate = useNavigate();
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
//       if (error.response?.status === 401) {
//         showSnackbar('Session expired. Please log in again.', 'error');
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, showSnackbar, navigate]);

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleAddCapital = async () => {
//     try {
//       const amount = parseFloat(boostAmount);
//       if (isNaN(amount)) {
//         throw new Error("Invalid amount");
//       }
      
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/add-capital`, 
//         { amount }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSnackbar(`Successfully added $${amount} to manager capital`, 'success');
//       setBoostDialogOpen(false);
//       fetchPAMMData();
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100' : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900'}`}>
//       <h1 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${theme === 'dark' ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
//         PAMM Manager Dashboard
//       </h1>

//       {!isManagerInitialized && (
//         <div className="mb-6 text-center p-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto mb-2"
//             onClick={() => setInitDialogOpen(true)}
//           >
//             <AccountCircle className="mr-2" />
//             Initialize Manager Account
//           </button>
//           <p className="text-gray-600 dark:text-gray-400">You must initialize your manager account before performing any operations</p>
//         </div>
//       )}

//       <CapitalHealthWarning 
//         investorCapital={pammData.investorCapital} 
//         managerCapital={pammData.managerCapital} 
//       />

//       <div className="flex justify-end mb-4">
//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
//           onClick={fetchPAMMData}
//           disabled={loading}
//         >
//           <Refresh className="mr-2" />
//           Refresh Data
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <People className="text-blue-500 dark:text-blue-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Investors</p>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 dark:text-green-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Total Funds</p>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <PieChart className="text-purple-500 dark:text-purple-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Capital Ratio</p>
//               <p className="text-2xl font-bold text-gray-100">{(pammData.capitalRatio * 100).toFixed(1)}%</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mb-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Capital Safety</h3>
//         <div className="flex items-center mb-2">
//           <div className="w-full mr-4">
//             <div className="h-2 bg-gray-600 rounded-full">
//               <div
//                 className={`h-2 rounded-full ${pammData.capitalRatio >= 0.2 ? 'bg-green-500' : 'bg-red-500'}`}
//                 style={{ width: `${Math.min(pammData.capitalRatio * 100, 100)}%` }}
//               ></div>
//             </div>
//           </div>
//           <p className="text-gray-100">
//             ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//           </p>
//         </div>
//         <p className="text-sm text-gray-400">
//           {pammData.capitalRatio >= 0.2 ? "✅ Meets minimum 20% requirement" : "⚠️ Below recommended capital ratio"}
//         </p>
//         {pammData.capitalRatio < 0.2 && (
//           <button
//             className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
//             onClick={() => setBoostDialogOpen(true)}
//           >
//             <AttachMoney className="mr-2" />
//             Add Capital
//           </button>
//         )}
//         <AllocationWarning investors={pammData.investors} />
//       </div>

//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mb-6">
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//           <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
//           <div className="flex flex-col gap-4">
//             <button
//               className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => setOpenDistribution(true)}
//               disabled={!isManagerInitialized}
//             >
//               <Add className="mr-2" />
//               Distribute Profits
//             </button>
//             <button
//               className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => navigate('/dashboard/manager/trading')}
//               disabled={!isManagerInitialized}
//             >
//               <AccountBalance className="mr-2" />
//               Execute Managed Trades
//             </button>
//             <button
//               className={`border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-lg ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => navigate('/dashboard/manager/reports')}
//               disabled={!isManagerInitialized}
//             >
//               View Investor Reports
//             </button>
//           </div>
//         </div>
//         <PerformanceSummary performance={performance} distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       {/* Initialize Manager Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${initDialogOpen ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Initialize Manager Account</h2>
//           <p className="text-gray-900 dark:text-white mb-4">Please set your initial manager capital (minimum 20% of investor capital recommended)</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               placeholder="Initial Capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setInitDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center ${initLoading || !initialCapital || isNaN(initialCapital) ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//             >
//               {initLoading ? (
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
//               ) : (
//                 'Initialize'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Distribute Profits Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${openDistribution ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Distribute Profits</h2>
//           <p className="text-gray-900 dark:text-white mb-4">Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               placeholder="Profit Amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setOpenDistribution(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center ${isDistributing || !profitAmount || parseFloat(profitAmount) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//             >
//               {isDistributing ? (
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
//               ) : (
//                 'Distribute'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Capital Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${boostDialogOpen ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Add Manager Capital</h2>
//           <p className="text-gray-900 dark:text-white mb-2">Current ratio: {(pammData.capitalRatio * 100).toFixed(1)}%</p>
//           <p className="text-gray-900 dark:text-white mb-4">Minimum required: ${(pammData.investorCapital * 0.2 - pammData.managerCapital).toFixed(2)}</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               placeholder="Amount to Add"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setBoostDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//               onClick={handleAddCapital}
//             >
//               Add Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${snackbar.open ? '' : 'hidden'}`}>
//         <div className={`p-4 rounded-lg shadow-lg ${snackbar.severity === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center`}>
//           <span>{snackbar.message}</span>
//           <button className="ml-4 text-white" onClick={closeSnackbar}>×</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PAMMManager;






// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';

// // PerformanceChart Component
// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   // Transform distributions data for chart
//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0,
//     date: new Date(dist.timestamp).toLocaleDateString()
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // CapitalHealthWarning Component
// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null; // Don't show warning if capital is healthy
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // AllocationWarning Component
// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   // Calculate allocation concentration
//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance || 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance || 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   // Check for risky concentration (>50% from single investor)
//   const isConcentrated = concentrationRatio > 0.5;

//   // Check for small investor base
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // DistributionPieChart Component
// const DistributionPieChart = ({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: lastDistribution.amount - lastDistribution.fees },
//     { name: 'Manager Fees', value: lastDistribution.fees }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // DistributionPerformance Component
// const DistributionPerformance = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     console.warn('DistributionPerformance: No distributions data provided');
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100
//     : 0;

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // PerformanceSummary Component
// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount || 0;
//       const fees = dist.fees || 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       console.log(`Dist ${distributions.length - index}: amount=${amount}, fees=${fees}, return=${returnValue.toFixed(2)}%`);
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     console.warn('PerformanceSummary: No distributions data provided');
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {performance.ytdReturn.toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 ? new Date(distributions[0].timestamp).toLocaleDateString() : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'Return %' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// // RecentProfitDistributions Component
// const RecentProfitDistributions = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     console.warn('RecentProfitDistributions: No distributions data provided');
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: distributions[0].amount - distributions[0].fees },
//     { name: 'Manager Fees', value: distributions[0].fees }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row) => (
//               <tr key={row.id} className="border-b border-gray-700">
//                 <td className="p-2">{new Date(row.timestamp).toLocaleDateString()}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count || 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// // PAMMManager Component
// const PAMMManager = ({ theme, userId }) => {
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const navigate = useNavigate();

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
      
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/distributions`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/performance`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/pamm/manager-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const isManager = managerRes.data.is_manager || 
//                        (statusRes.data.manager && statusRes.data.manager.user_id === userId);
//       setIsManagerInitialized(isManager);
//       setIsAdmin(managerRes.data.is_admin || false);

//       const investorCapital = statusRes.data.investors?.reduce(
//         (sum, inv) => sum + (inv.balance || 0), 0
//       ) || 0;

//       const managerCapital = statusRes.data.manager?.capital || 0;
//       const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;

//       setPammData({
//         totalFunds: statusRes.data.total_funds || 0,
//         investors: statusRes.data.investors || [],
//         managerCapital,
//         investorCapital,
//         capitalRatio
//       });

//       setDistributions(distRes.data.data || []);
//       setPerformance({
//         ytdReturn: perfRes.data.ytdReturn || 0,
//         totalFees: perfRes.data.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.response?.data?.message || 'Failed to load PAMM data', 'error');
      
//       if (error.response?.status === 401) {
//         showSnackbar('Session expired. Please log in again.', 'error');
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, showSnackbar, navigate]);

//   const handleFixDistributions = useCallback(async () => {
//     setFixingDistributions(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/fix-distributions`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showSnackbar(response.data.message || 'Historical distributions fixed successfully', 'success');
//       await fetchPAMMData(); // Refresh data to reflect changes
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || 'Failed to fix distributions';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   }, [fetchPAMMData, showSnackbar]);

//   const handleInitializeManager = async () => {
//     if (!initialCapital || isNaN(initialCapital)) {
//       showSnackbar('Please enter a valid initial capital amount', 'error');
//       return;
//     }

//     setInitLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/init-manager`,
//         { initial_capital: parseFloat(initialCapital) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || 'Failed to initialize manager', 
//         'error'
//       );
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const profitValue = parseFloat(profitAmount);
//       if (isNaN(profitValue)){
//         showSnackbar('Please enter a valid number', 'error');
//         return;
//       }
//       if (profitValue <= 0) {
//         showSnackbar('Profit amount must be positive', 'error');
//         return;
//       }

//       setIsDistributing(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/distribute`,
//         { profit: profitValue },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       showSnackbar(
//         `Success! Distributed $${profitValue.toFixed(2)} to ${response.data.investor_count} investors.`,
//         'success'
//       );
      
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
      
//     } catch (error) {
//       console.error('Distribution error:', error);
//       const errorMsg = error.response?.data?.message || 
//                      error.message || 
//                      'Failed to distribute profits';
//       showSnackbar(errorMsg, 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleAddCapital = async () => {
//     try {
//       const amount = parseFloat(boostAmount);
//       if (isNaN(amount)) {
//         throw new Error("Invalid amount");
//       }
      
//       const token = localStorage.getItem('authToken');
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/pamm/add-capital`, 
//         { amount }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       showSnackbar(`Successfully added $${amount} to manager capital`, 'success');
//       setBoostDialogOpen(false);
//       fetchPAMMData();
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchPAMMData();
//     }
//   }, [userId, fetchPAMMData]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100' : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900'}`}>
//       <h1 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${theme === 'dark' ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
//         PAMM Manager Dashboard
//       </h1>

//       {!isManagerInitialized && (
//         <div className="mb-6 text-center p-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center mx-auto mb-2"
//             onClick={() => setInitDialogOpen(true)}
//           >
//             <AccountCircle className="mr-2" />
//             Initialize Manager Account
//           </button>
//           <p className="text-gray-600 dark:text-gray-400">You must initialize your manager account before performing any operations</p>
//         </div>
//       )}

//       <CapitalHealthWarning 
//         investorCapital={pammData.investorCapital} 
//         managerCapital={pammData.managerCapital} 
//       />

//       <div className="flex justify-end mb-4">
//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
//           onClick={fetchPAMMData}
//           disabled={loading}
//         >
//           <Refresh className="mr-2" />
//           Refresh Data
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <People className="text-blue-500 dark:text-blue-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Investors</p>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 dark:text-green-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Total Funds</p>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg shadow-lg">
//           <div className="flex items-center">
//             <PieChart className="text-purple-500 dark:text-purple-400 text-4xl" />
//             <div className="ml-4">
//               <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">Capital Ratio</p>
//               <p className="text-2xl font-bold text-gray-100">{(pammData.capitalRatio * 100).toFixed(1)}%</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mb-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Capital Safety</h3>
//         <div className="flex items-center mb-2">
//           <div className="w-full mr-4">
//             <div className="h-2 bg-gray-600 rounded-full">
//               <div
//                 className={`h-2 rounded-full ${pammData.capitalRatio >= 0.2 ? 'bg-green-500' : 'bg-red-500'}`}
//                 style={{ width: `${Math.min(pammData.capitalRatio * 100, 100)}%` }}
//               ></div>
//             </div>
//           </div>
//           <p className="text-gray-100">
//             ${pammData.managerCapital.toLocaleString()} / ${pammData.investorCapital.toLocaleString()}
//           </p>
//         </div>
//         <p className="text-sm text-gray-400">
//           {pammData.capitalRatio >= 0.2 ? "✅ Meets minimum 20% requirement" : "⚠️ Below recommended capital ratio"}
//         </p>
//         {pammData.capitalRatio < 0.2 && (
//           <button
//             className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
//             onClick={() => setBoostDialogOpen(true)}
//           >
//             <AttachMoney className="mr-2" />
//             Add Capital
//           </button>
//         )}
//         <AllocationWarning investors={pammData.investors} />
//       </div>

//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mb-6">
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//           <h3 className="text-lg font-bold mb-4 text-white">Quick Actions</h3>
//           <div className="flex flex-col gap-4">
//             <button
//               className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => setOpenDistribution(true)}
//               disabled={!isManagerInitialized}
//             >
//               <Add className="mr-2" />
//               Distribute Profits
//             </button>
//             <button
//               className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => navigate('/dashboard/manager/trading')}
//               disabled={!isManagerInitialized}
//             >
//               <AccountBalance className="mr-2" />
//               Execute Managed Trades
//             </button>
//             <button
//               className={`border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2 px-4 rounded-lg ${!isManagerInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => navigate('/dashboard/manager/reports')}
//               disabled={!isManagerInitialized}
//             >
//               View Investor Reports
//             </button>
//             {isAdmin && (
//               <button
//                 className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center ${fixingDistributions ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={handleFixDistributions}
//                 disabled={fixingDistributions}
//               >
//                 <Refresh className="mr-2" />
//                 {fixingDistributions ? 'Fixing Distributions...' : 'Fix Historical Distributions'}
//               </button>
//             )}
//           </div>
//         </div>
//         <PerformanceSummary performance={performance} distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       {/* Initialize Manager Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${initDialogOpen ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Initialize Manager Account</h2>
//           <p className="text-gray-900 dark:text-white mb-4">Please set your initial manager capital (minimum 20% of investor capital recommended)</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               placeholder="Initial Capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setInitDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center ${initLoading || !initialCapital || isNaN(initialCapital) ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || isNaN(initialCapital)}
//             >
//               {initLoading ? (
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
//               ) : (
//                 'Initialize'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Distribute Profits Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${openDistribution ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Distribute Profits</h2>
//           <p className="text-gray-900 dark:text-white mb-4">Enter the total profit amount to distribute to investors. A 20% performance fee will be deducted.</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               placeholder="Profit Amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setOpenDistribution(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center ${isDistributing || !profitAmount || parseFloat(profitAmount) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || parseFloat(profitAmount) <= 0}
//             >
//               {isDistributing ? (
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
//               ) : (
//                 'Distribute'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Capital Dialog */}
//       <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${boostDialogOpen ? '' : 'hidden'}`}>
//         <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-100'} p-6 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} w-full max-w-md`}>
//           <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">Add Manager Capital</h2>
//           <p className="text-gray-900 dark:text-white mb-2">Current ratio: {(pammData.capitalRatio * 100).toFixed(1)}%</p>
//           <p className="text-gray-900 dark:text-white mb-4">Minimum required: ${(pammData.investorCapital * 0.2 - pammData.managerCapital).toFixed(2)}</p>
//           <div className="relative mb-4">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300">$</span>
//             <input
//               type="number"
//               className="w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               placeholder="Amount to Add"
//             />
//           </div>
//           <div className="flex justify-end gap-2 border-t pt-2 border-gray-300 dark:border-gray-600">
//             <button
//               className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg"
//               onClick={() => setBoostDialogOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//               onClick={handleAddCapital}
//             >
//               Add Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${snackbar.open ? '' : 'hidden'}`}>
//         <div className={`p-4 rounded-lg shadow-lg ${snackbar.severity === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center`}>
//           <span>{snackbar.message}</span>
//           <button className="ml-4 text-white" onClick={closeSnackbar}>×</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PAMMManager;





// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { useAuth } from '../Auth'; // Corrected import path
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';

// const fetchWithAuth = async (url, options = {}) => {
//   let token = localStorage.getItem('authToken');
//   const headers = {
//     ...options.headers,
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };

//   let response = await fetch(url, { ...options, headers });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//         localStorage.setItem('authToken', idToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
//         headers['Authorization'] = `Bearer ${idToken}`;
//         response = await fetch(url, { ...options, headers });
//       } else {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         // window.location.href = '/dashboard/login';
//         navigate('/dashboard/login'); 
//       }
//     } else {
//       navigate('/dashboard/login'); 
//     }
//   }

//   return response;
// };

// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0,
//     date: new Date(dist.timestamp).toLocaleDateString()
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance || 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance || 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DistributionPieChart = ({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: lastDistribution.amount - lastDistribution.fees },
//     { name: 'Manager Fees', value: lastDistribution.fees }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const DistributionPerformance = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     console.warn('DistributionPerformance: No distributions data provided');
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100
//     : 0;

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount || 0;
//       const fees = dist.fees || 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {performance.ytdReturn.toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 ? new Date(distributions[0].timestamp).toLocaleDateString() : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name === 'return' ? 'Return %' : 'Fees ($)'
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// const RecentProfitDistributions = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: distributions[0].amount - distributions[0].fees },
//     { name: 'Manager Fees', value: distributions[0].fees }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row) => (
//               <tr key={row.id} className="border-b border-gray-700">
//                 <td className="p-2">{new Date(row.timestamp).toLocaleDateString()}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count || 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const PAMMManager = ({ theme }) => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       if (!currentUser.is_manager) {
//         showSnackbar('Not authorized as a manager', 'error');
//         navigate('/dashboard');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status'),
//         fetchWithAuth('http://localhost:5000/pamm/distributions'),
//         fetchWithAuth('http://localhost:5000/pamm/performance'),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status')
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       setIsManagerInitialized(managerData.is_initialized);
//       setInitDialogOpen(!managerData.is_initialized); // Open dialog if not initialized

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors: statusData.investors || [],
//         managerCapital: managerData.manager_capital || 0,
//         investorCapital: statusData.investor_capital || 0,
//         capitalRatio: statusData.investor_capital > 0 ? (managerData.manager_capital / statusData.investor_capital) : 0
//       });

//       setDistributions(distData.data || []);

//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data', 'error');
//       navigate('/login', { state: { error: error.message } });
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/initialize', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       });

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to initialize manager');

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
//       if (!profitAmount || isNaN(profitAmount) || profitAmount <= 0) {
//         showSnackbar('Please enter a valid profit amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(profitAmount) })
//       });

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to distribute profits');

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/boost-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       });

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       });

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   const containerStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     padding: '24px',
//     position: 'relative',
//     overflow: 'hidden',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark'
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark'
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '16px',
//     boxShadow: theme === 'dark'
//       ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     backdropFilter: 'blur(10px)',
//     '&:hover': {
//       transform: 'translateY(-4px) scale(1.01)',
//       boxShadow: theme === 'dark'
//         ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.2)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
//       border: theme === 'dark'
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div style={containerStyles}>
//       <h1 className="text-3xl font-bold mb-8 text-white">PAMM Manager Dashboard</h1>

//       <CapitalHealthWarning
//         investorCapital={pammData.investorCapital}
//         managerCapital={pammData.managerCapital}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AccountBalance className="text-blue-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Total AUM</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <People className="text-indigo-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Investors</h3>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Manager Capital</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AllocationWarning investors={pammData.investors} />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <PerformanceSummary performance={performance} distributions={distributions} />
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       <div className="mt-6 flex flex-col md:flex-row gap-4">
//         <button
//           onClick={() => setOpenDistribution(true)}
//           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center"
//         >
//           <Add className="mr-2" />
//           Distribute Profits
//         </button>
//         <button
//           onClick={() => setBoostDialogOpen(true)}
//           className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center"
//         >
//           <Add className="mr-2" />
//           Boost Manager Capital
//         </button>
//         {currentUser.is_admin && (
//           <button
//             onClick={handleFixDistributions}
//             disabled={fixingDistributions}
//             className={`${
//               fixingDistributions ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
//             } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//           >
//             <Refresh className="mr-2" />
//             {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//           </button>
//         )}
//       </div>

//       <div className="mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Investor Overview</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-gray-100">
//             <thead>
//               <tr className="border-b border-gray-600">
//                 <th className="p-2">Investor</th>
//                 <th className="p-2 text-right">Balance</th>
//                 <th className="p-2 text-right">Allocation (%)</th>
//                 <th className="p-2 text-right">Drawdown Limit</th>
//                 <th className="p-2 text-right">Last Active</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pammData.investors.map((investor) => (
//                 <tr key={investor.id} className="border-b border-gray-700">
//                   <td className="p-2 flex items-center">
//                     <AccountCircle className="mr-2 text-gray-400" />
//                     {investor.name || `Investor ${investor.id}`}
//                   </td>
//                   <td className="p-2 text-right">
//                     ${investor.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </td>
//                   <td className="p-2 text-right">{(investor.allocation_pct * 100).toFixed(2)}%</td>
//                   <td className="p-2 text-right">{(investor.drawdown_limit * 100).toFixed(2)}%</td>
//                   <td className="p-2 text-right">
//                     {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           openDistribution ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Distribute Profits</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Profit Amount ($)</label>
//             <input
//               type="number"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter profit amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setOpenDistribution(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || profitAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 isDistributing || !profitAmount || profitAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {isDistributing ? 'Distributing...' : 'Distribute'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           boostDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Boost Manager Capital</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Boost Amount ($)</label>
//             <input
//               type="number"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter boost amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setBoostDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBoostCapital}
//               disabled={!boostAmount || boostAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 !boostAmount || boostAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//               } text-white font-semibold`}
//             >
//               Boost Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           initDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-bold mb-6 text-white">Initialize Manager Account</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Initial Capital ($)</label>
//             <input
//               type="number"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter initial capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setInitDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || initialCapital <= 0}
//               className={`py-2 px-4 rounded ${
//                 initLoading || !initialCapital || initialCapital <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {initLoading ? 'Initializing...' : 'Initialize Account'}
//             </button>
//           </div>
//           {snackbar.open && (
//             <div className={`mt-4 p-2 rounded ${snackbar.severity === 'success' ? 'bg-green-900' : 'bg-red-900'} text-white`}>
//               {snackbar.message}
//             </div>
//           )}
//         </div>
//       </div>

//       {snackbar.open && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
//             snackbar.severity === 'success' ? 'bg-green-900' : 'bg-red-900'
//           } text-white max-w-sm`}
//         >
//           {snackbar.message}
//           <button
//             onClick={closeSnackbar}
//             className="absolute top-1 right-2 text-gray-300 hover:text-white"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PAMMManager;


// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { useAuth } from '../Auth';
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';

// // fetchWithAuth with navigate parameter
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   let token = localStorage.getItem('authToken');
//   const headers = {
//     ...options.headers,
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };

//   let response = await fetch(url, { ...options, headers });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//         localStorage.setItem('authToken', idToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
//         headers['Authorization'] = `Bearer ${idToken}`;
//         response = await fetch(url, { ...options, headers });
//       } else {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/dashboard/login');
//       }
//     } else {
//       navigate('/dashboard/login');
//     }
//   }

//   return response;
// };

// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount || 0,
//     fees: dist.fees || 0,
//     date: new Date(dist.timestamp).toLocaleDateString()
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance || 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance || 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DistributionPieChart = ({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: lastDistribution.amount - lastDistribution.fees },
//     { name: 'Manager Fees', value: lastDistribution.fees }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const DistributionPerformance = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount || 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount || 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - distributions[1].amount) / distributions[1].amount) * 100
//     : 0;

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount || 0;
//       const fees = dist.fees || 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {performance.ytdReturn.toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${performance.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 ? new Date(distributions[0].timestamp).toLocaleDateString() : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name === 'return' ? 'Return %' : 'Fees ($)'
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// const RecentProfitDistributions = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: distributions[0].amount - distributions[0].fees },
//     { name: 'Manager Fees', value: distributions[0].fees }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row) => (
//               <tr key={row.id} className="border-b border-gray-700">
//                 <td className="p-2">{new Date(row.timestamp).toLocaleDateString()}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count || 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// const PAMMManager = ({ theme }) => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   // const fetchPAMMData = useCallback(async () => {
//   //   try {
//   //     setLoading(true);

//   //     if (!currentUser) {
//   //       showSnackbar('Please log in to continue', 'error');
//   //       navigate('/login');
//   //       return;
//   //     }

//   //     const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//   //       fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//   //       fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//   //       fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//   //       fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//   //     ]);

//   //     if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//   //     if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//   //     if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//   //     if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//   //     const statusData = await statusRes.json();
//   //     const distData = await distRes.json();
//   //     const perfData = await perfRes.json();
//   //     const managerData = await managerRes.json();

//   //     // Log the managerData to debug the response
//   //     console.log('managerData:', managerData);

//   //     // Ensure is_initialized is correctly interpreted
//   //     const isInitialized = managerData.is_initialized === true || managerData.is_initialized === 'true';
//   //     setIsManagerInitialized(isInitialized);
//   //     setInitDialogOpen(!isInitialized);

//   //     setPammData({
//   //       totalFunds: statusData.total_funds || 0,
//   //       investors: statusData.investors || [],
//   //       managerCapital: managerData.manager_capital || 0,
//   //       investorCapital: statusData.investor_capital || 0,
//   //       capitalRatio: statusData.investor_capital > 0 ? (managerData.manager_capital / statusData.investor_capital) : 0
//   //     });

//   //     const distributionData = distData.data || [];
//   //     setDistributions(distributionData);

//   //     // Notify user if no distributions are available
//   //     if (distributionData.length === 0) {
//   //       showSnackbar('No distribution data available', 'info');
//   //     }

//   //     setPerformance({
//   //       ytdReturn: perfData.ytdReturn || 0,
//   //       totalFees: perfData.totalFees || 0
//   //     });

//   //   } catch (error) {
//   //     console.error('Failed to fetch PAMM data:', error);
//   //     showSnackbar(error.message || 'Failed to load data', 'error');
//   //     navigate('/login', { state: { error: error.message } });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [currentUser, showSnackbar, navigate]);



//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);
  
//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }
  
//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//       ]);
  
//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');
  
//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();
  
//       console.log('managerData:', JSON.stringify(managerData, null, 2));
  
//       const isInitialized = managerData.is_manager === true || managerData.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);
  
//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors: statusData.investors || [],
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: statusData.investors?.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: statusData.investors?.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / statusData.investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });
  
//       const distributionData = distData.data || [];
//       setDistributions(distributionData);
  
//       if (distributionData.length === 0) {
//         showSnackbar('No distribution data available', 'info');
//       }
  
//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });
  
//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data', 'error');
//       navigate('/login', { state: { error: error.message } });
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
//       if (!profitAmount || isNaN(profitAmount) || profitAmount <= 0) {
//         showSnackbar('Please enter a valid profit amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(profitAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to distribute profits');

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/boost-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   const containerStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     padding: '24px',
//     position: 'relative',
//     overflow: 'hidden',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark'
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark'
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '16px',
//     boxShadow: theme === 'dark'
//       ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     backdropFilter: 'blur(10px)',
//     '&:hover': {
//       transform: 'translateY(-4px) scale(1.01)',
//       boxShadow: theme === 'dark'
//         ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.2)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
//       border: theme === 'dark'
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div style={containerStyles}>
//       <h1 className="text-3xl font-bold mb-8 text-white">PAMM Manager Dashboard</h1>

//       <div className="mb-6 p-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg shadow-lg">
//         <div className="flex items-center">
//           <AccountCircle className="text-blue-400 mr-3" />
//           <div>
//             <h3 className="text-lg font-semibold text-blue-100">Manager Status</h3>
//             <p className="text-blue-200">
//               {isManagerInitialized
//                 ? 'Manager account is initialized and active.'
//                 : 'Manager account is not initialized. Please initialize to proceed.'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//         />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AccountBalance className="text-blue-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Total AUM</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <People className="text-indigo-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Investors</h3>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Manager Capital</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isManagerInitialized && (
//         <AllocationWarning investors={pammData.investors} />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <PerformanceSummary performance={performance} distributions={distributions} />
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       <div className="mt-6 flex flex-col md:flex-row gap-4">
//         <button
//           onClick={() => setOpenDistribution(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Distribute Profits
//         </button>
//         <button
//           onClick={() => setBoostDialogOpen(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Boost Manager Capital
//         </button>
//         {currentUser.is_admin && (
//           <button
//             onClick={handleFixDistributions}
//             disabled={fixingDistributions || !isManagerInitialized}
//             className={`${
//               fixingDistributions || !isManagerInitialized
//                 ? 'bg-gray-600 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
//             } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//           >
//             <Refresh className="mr-2" />
//             {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//           </button>
//         )}
//       </div>

//       {isManagerInitialized && (
//         <div className="mt-6">
//           <h3 className="text-lg font-bold mb-4 text-white">Investor Overview</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-gray-100">
//               <thead>
//                 <tr className="border-b border-gray-600">
//                   <th className="p-2">Investor</th>
//                   <th className="p-2 text-right">Balance</th>
//                   <th className="p-2 text-right">Allocation (%)</th>
//                   <th className="p-2 text-right">Drawdown Limit</th>
//                   <th className="p-2 text-right">Last Active</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pammData.investors.map((investor) => (
//                   <tr key={investor.id} className="border-b border-gray-700">
//                     <td className="p-2 flex items-center">
//                       <AccountCircle className="mr-2 text-gray-400" />
//                       {investor.name || `Investor ${investor.id}`}
//                     </td>
//                     <td className="p-2 text-right">
//                       ${investor.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="p-2 text-right">{(investor.allocation_pct * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">{(investor.drawdown_limit * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">
//                       {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           openDistribution ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Distribute Profits</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Profit Amount ($)</label>
//             <input
//               type="number"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter profit amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setOpenDistribution(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || profitAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 isDistributing || !profitAmount || profitAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {isDistributing ? 'Distributing...' : 'Distribute'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           boostDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Boost Manager Capital</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Boost Amount ($)</label>
//             <input
//               type="number"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter boost amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setBoostDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBoostCapital}
//               disabled={!boostAmount || boostAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 !boostAmount || boostAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//               } text-white font-semibold`}
//             >
//               Boost Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           initDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-bold mb-6 text-white">Initialize Manager Account</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Initial Capital ($)</label>
//             <input
//               type="number"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter initial capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setInitDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || initialCapital <= 0}
//               className={`py-2 px-4 rounded ${
//                 initLoading || !initialCapital || initialCapital <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {initLoading ? 'Initializing...' : 'Initialize Account'}
//             </button>
//           </div>
//           {snackbar.open && (
//             <div className={`mt-4 p-2 rounded ${snackbar.severity === 'success' ? 'bg-green-900' : 'bg-red-900'} text-white`}>
//               {snackbar.message}
//             </div>
//           )}
//         </div>
//       </div>

//       {snackbar.open && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
//             snackbar.severity === 'success' ? 'bg-green-900' : snackbar.severity === 'info' ? 'bg-blue-900' : 'bg-red-900'
//           } text-white max-w-sm`}
//         >
//           {snackbar.message}
//           <button
//             onClick={closeSnackbar}
//             className="absolute top-1 right-2 text-gray-300 hover:text-white"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PAMMManager;








// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../Auth';
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// // import { Switch, Typography } from 'antd';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 bg-red-900 text-white rounded-lg">
//           Something went wrong: {this.state.error?.message || 'Unknown error'}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// // fetchWithAuth with navigate parameter
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   let token = localStorage.getItem('authToken');
//   const headers = {
//     ...options.headers,
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };

//   let response = await fetch(url, { ...options, headers });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//         localStorage.setItem('authToken', idToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
//         headers['Authorization'] = `Bearer ${idToken}`;
//         response = await fetch(url, { ...options, headers });
//       } else {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/dashboard/login');
//       }
//     } else {
//       navigate('/dashboard/login');
//     }
//   }

//   return response;
// };

// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount ?? 0,
//     fees: dist.fees ?? 0,
//     date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// PerformanceChart.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   if (!investorCapital || !managerCapital) {
//     return null;
//   }

//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// CapitalHealthWarning.propTypes = {
//   investorCapital: PropTypes.number.isRequired,
//   managerCapital: PropTypes.number.isRequired
// };

// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// AllocationWarning.propTypes = {
//   investors: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       balance: PropTypes.number,
//       name: PropTypes.string,
//       allocation_pct: PropTypes.number,
//       drawdown_limit: PropTypes.number,
//       last_active: PropTypes.string
//     })
//   ).isRequired
// };

// const DistributionPieChart = React.memo(({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
//     { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry) => (
//               <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// DistributionPieChart.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const DistributionPerformance = React.memo(({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount ?? 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
//     : 0;

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// });

// DistributionPerformance.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount ?? 0;
//       const fees = dist.fees ?? 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {(performance.ytdReturn ?? 0).toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 && distributions[0].timestamp
//               ? new Date(distributions[0].timestamp).toLocaleDateString()
//               : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name === 'return' ? 'Return %' : 'Fees ($)'
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// PerformanceSummary.propTypes = {
//   performance: PropTypes.shape({
//     ytdReturn: PropTypes.number,
//     totalFees: PropTypes.number,
//   }).isRequired,
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number,
//     }),
//   ).isRequired,
// };

// const RecentProfitDistributions = React.memo(({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
//     { name: 'Manager Fees', value: distributions[0].fees ?? 0 }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row, index) => (
//               <tr key={row.id ?? `distribution-${index}`} className="border-b border-gray-700">
//                 <td className="p-2">{row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count ?? 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count ?? 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// RecentProfitDistributions.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       investor_count: PropTypes.number,
//       fees: PropTypes.number,
//       liquidated_count: PropTypes.number
//     })
//   ).isRequired
// };

// const PAMMManager = ({ theme}) => {


//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       console.log('managerData:', JSON.stringify(managerData, null, 2));

//       const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);

//       const investors = statusData.investors || [];
//       console.log('Investors:', JSON.stringify(investors, null, 2));
//       console.log('Investor IDs:', investors.map(inv => inv.id));
//       const uniqueInvestorIds = new Set(investors.map(inv => inv.id));
//       console.log('Unique Investor IDs Count:', uniqueInvestorIds.size, 'Total Investors:', investors.length);
//       if (uniqueInvestorIds.size !== investors.length) {
//         console.warn('Duplicate or missing investor IDs detected');
//       }

//       const distributionData = distData.data || [];
//       console.log('Distributions:', JSON.stringify(distributionData, null, 2));
//       console.log('Distribution IDs:', distributionData.map(dist => dist.id));
//       const uniqueDistributionIds = new Set(distributionData.map(dist => dist.id));
//       console.log('Unique Distribution IDs Count:', uniqueDistributionIds.size, 'Total Distributions:', distributionData.length);
//       if (uniqueDistributionIds.size !== distributionData.length) {
//         console.warn('Duplicate or missing distribution IDs detected');
//       }

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors,
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });

//       setDistributions(distributionData);

//       if (distributionData.length === 0) {
//         showSnackbar('No distribution data available', 'info');
//       }

//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data', 'error');
//       navigate('/login', { state: { error: error.message } });
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
//       if (!profitAmount || isNaN(profitAmount) || profitAmount <= 0) {
//         showSnackbar('Please enter a valid profit amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(profitAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to distribute profits');

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser?.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   const containerStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     padding: '24px',
//     position: 'relative',
//     overflow: 'hidden',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark'
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark'
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '16px',
//     boxShadow: theme === 'dark'
//       ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     backdropFilter: 'blur(10px)',
//     '&:hover': {
//       transform: 'translateY(-4px) scale(1.01)',
//       boxShadow: theme === 'dark'
//         ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.2)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
//       border: theme === 'dark'
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

  

//   return (
//     <div style={containerStyles}>
//       <h1 className="text-3xl font-bold mb-8 text-white">PAMM Manager Dashboard</h1>

//          {/* Theme Switch */}
//          {/* <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center' }}>
//         <Typography.Text style={{ marginRight: 10, color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//           Theme
//         </Typography.Text>
//         <Switch
//           checked={theme === 'dark'}
//           onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
//         />
//       </div> */}

//       <div className="mb-6 p-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg shadow-lg">
//         <div className="flex items-center">
//           <AccountCircle className="text-blue-400 mr-3" />
//           <div>
//             <h3 className="text-lg font-semibold text-blue-100">Manager Status</h3>
//             <p className="text-blue-200">
//               {isManagerInitialized
//                 ? 'Manager account is initialized and active.'
//                 : 'Manager account is not initialized. Please initialize to proceed.'}
//             </p>
//           </div>
//         </div>
//       </div>

      

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//         />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AccountBalance className="text-blue-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Total AUM</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <People className="text-indigo-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Investors</h3>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Manager Capital</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isManagerInitialized && (
//         <AllocationWarning investors={pammData.investors} />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <PerformanceSummary performance={performance} distributions={distributions} />
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       <div className="mt-6 flex flex-col md:flex-row gap-4">
//         <button
//           onClick={() => setOpenDistribution(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Distribute Profits
//         </button>
//         <button
//           onClick={() => setBoostDialogOpen(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Boost Manager Capital
//         </button>
//         {currentUser?.is_admin && (
//           <button
//             onClick={handleFixDistributions}
//             disabled={fixingDistributions || !isManagerInitialized}
//             className={`${
//               fixingDistributions || !isManagerInitialized
//                 ? 'bg-gray-600 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
//             } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//           >
//             <Refresh className="mr-2" />
//             {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//           </button>
//         )}
//       </div>

//       {isManagerInitialized && (
//         <div className="mt-6">
//           <h3 className="text-lg font-bold mb-4 text-white">Investor Overview</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-gray-100">
//               <thead>
//                 <tr className="border-b border-gray-600">
//                   <th className="p-2">Investor</th>
//                   <th className="p-2 text-right">Balance</th>
//                   <th className="p-2 text-right">Allocation (%)</th>
//                   <th className="p-2 text-right">Drawdown Limit</th>
//                   <th className="p-2 text-right">Last Active</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pammData.investors.map((investor, index) => (
//                   <tr key={investor.id ?? `investor-${index}`} className="border-b border-gray-700">
//                     <td className="p-2 flex items-center">
//                       <AccountCircle className="mr-2 text-gray-400" />
//                       {investor.name || `Investor ${investor.id ?? index}`}
//                     </td>
//                     <td className="p-2 text-right">
//                       ${(investor.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="p-2 text-right">{((investor.allocation_pct ?? 0) * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">{((investor.drawdown_limit ?? 0) * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">
//                       {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           openDistribution ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Distribute Profits</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Profit Amount ($)</label>
//             <input
//               type="number"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter profit amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setOpenDistribution(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || profitAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 isDistributing || !profitAmount || profitAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {isDistributing ? 'Distributing...' : 'Distribute'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           boostDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Boost Manager Capital</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Boost Amount ($)</label>
//             <input
//               type="number"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter boost amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setBoostDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBoostCapital}
//               disabled={!boostAmount || boostAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 !boostAmount || boostAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//               } text-white font-semibold`}
//             >
//               Boost Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           initDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-bold mb-6 text-white">Initialize Manager Account</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Initial Capital ($)</label>
//             <input
//               type="number"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter initial capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setInitDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || initialCapital <= 0}
//               className={`py-2 px-4 rounded ${
//                 initLoading || !initialCapital || initialCapital <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {initLoading ? 'Initializing...' : 'Initialize Account'}
//             </button>
//           </div>
//           {snackbar.open && (
//             <div className={`mt-4 p-2 rounded ${snackbar.severity === 'success' ? 'bg-green-900' : 'bg-red-900'} text-white`}>
//               {snackbar.message}
//             </div>
//           )}
//         </div>
//       </div>

//       {snackbar.open && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
//             snackbar.severity === 'success' ? 'bg-green-900' : snackbar.severity === 'info' ? 'bg-blue-900' : 'bg-red-900'
//           } text-white max-w-sm`}
//         >
//           {snackbar.message}
//           <button
//             onClick={closeSnackbar}
//             className="absolute top-1 right-2 text-gray-300 hover:text-white"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// PAMMManager.propTypes = {
//   theme: PropTypes.oneOf(['light', 'dark']).isRequired
// };

// export default function WrappedPAMMManager(props) {
//   return (
//     <ErrorBoundary>
//       <PAMMManager {...props} />
//     </ErrorBoundary>
//   );
// }




// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../Auth';
// import { People, AttachMoney, Add, AccountBalance, AccountCircle, Refresh, Warning, TrendingUp, TrendingDown } from '@mui/icons-material';
// import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { Switch } from 'antd';
// // import { Brightness4, Brightness7 } from '@mui/icons-material';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 bg-red-900 text-white rounded-lg">
//           Something went wrong: {this.state.error?.message || 'Unknown error'}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// // fetchWithAuth with navigate parameter
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   let token = localStorage.getItem('authToken');
//   const headers = {
//     ...options.headers,
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };

//   let response = await fetch(url, { ...options, headers });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//         localStorage.setItem('authToken', idToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
//         headers['Authorization'] = `Bearer ${idToken}`;
//         response = await fetch(url, { ...options, headers });
//       } else {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/dashboard/login');
//       }
//     } else {
//       navigate('/dashboard/login');
//     }
//   }

//   return response;
// };

// const PerformanceChart = ({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No performance data available</span>
//       </div>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount ?? 0,
//     fees: dist.fees ?? 0,
//     date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
//   }));

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke="#94A3B8" 
//             fontSize={12}
//           />
//           <YAxis 
//             stroke="#94A3B8" 
//             fontSize={12}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: '#1E293B', 
//               border: 'none', 
//               color: '#F8FAFC',
//               borderRadius: '8px'
//             }}
//             formatter={(value, name) => [
//               `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// PerformanceChart.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const CapitalHealthWarning = ({ investorCapital, managerCapital }) => {
//   if (!investorCapital || !managerCapital) {
//     return null;
//   }

//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <div className="mb-6 p-4 bg-gradient-to-r from-red-900 to-red-800 border border-red-700 rounded-lg shadow-lg">
//       <div className="flex items-center">
//         <Warning className="text-red-400 mr-3" />
//         <div>
//           <h3 className="text-lg font-semibold text-red-100">Capital Health Warning</h3>
//           <p className="text-red-200">
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </p>
//           <p className="text-red-200 mt-1">
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// CapitalHealthWarning.propTypes = {
//   investorCapital: PropTypes.number.isRequired,
//   managerCapital: PropTypes.number.isRequired
// };

// const AllocationWarning = ({ investors }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-lg">
//       <div className="flex items-center">
//         <Warning className="text-yellow-400 mr-2" />
//         <div>
//           <h4 className="text-sm font-semibold text-yellow-100">Allocation Risks</h4>
//           <div className="text-yellow-200 text-sm">
//             {isConcentrated && (
//               <p>⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor</p>
//             )}
//             {hasSmallBase && (
//               <p>⚠️ Small investor base: Only {investors.length} active investors</p>
//             )}
//             <p className="mt-1">Consider diversifying your investor base to reduce risk.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// AllocationWarning.propTypes = {
//   investors: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       balance: PropTypes.number,
//       name: PropTypes.string,
//       allocation_pct: PropTypes.number,
//       drawdown_limit: PropTypes.number,
//       last_active: PropTypes.string
//     })
//   ).isRequired
// };

// const DistributionPieChart = React.memo(({ distributions }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//         <span>No distribution data available</span>
//       </div>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
//     { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} fontSize={14} fontWeight={500}>
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} fontSize={12}>
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="h-48">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry) => (
//               <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// DistributionPieChart.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const DistributionPerformance = React.memo(({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount ?? 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
//     : 0;

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Distribution Performance</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Total Distributed</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Average Distribution</p>
//           <p className="text-2xl font-bold text-gray-100">
//             ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-lg shadow">
//           <p className="text-sm text-gray-400 dark:text-gray-300">Last Distribution</p>
//           <div className="flex items-center">
//             <p className="text-2xl font-bold text-gray-100 mr-2">
//               ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             {distributionChange !== 0 && (
//               <>
//                 {distributionChange >= 0 ? (
//                   <TrendingUp className="text-green-500" />
//                 ) : (
//                   <TrendingDown className="text-red-500" />
//                 )}
//                 <span className={`ml-1 ${distributionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                   {Math.abs(distributionChange).toFixed(1)}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Distribution History</h4>
//           <PerformanceChart distributions={distributions} />
//         </div>
//         <div>
//           <h4 className="text-base font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//           <DistributionPieChart distributions={distributions} />
//         </div>
//       </div>
//     </div>
//   );
// });

// DistributionPerformance.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number
//     })
//   ).isRequired
// };

// const PerformanceSummary = React.memo(({ performance, distributions }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount ?? 0;
//       const fees = dist.fees ?? 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//         <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
//           <span>No performance data available</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold mb-4 text-white">Performance Summary</h3>
//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">YTD Return:</span>
//           <span className={`font-semibold ${performance.ytdReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {(performance.ytdReturn ?? 0).toFixed(2)}%
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Fees Earned:</span>
//           <span className="text-gray-100">
//             ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Total Distributions:</span>
//           <span className="text-gray-100">{distributions.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400 dark:text-gray-300">Last Distribution:</span>
//           <span className="text-gray-100">
//             {distributions.length > 0 && distributions[0].timestamp
//               ? new Date(distributions[0].timestamp).toLocaleDateString()
//               : 'Never'}
//           </span>
//         </div>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Performance Trend</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={performanceData}>
//           <XAxis dataKey="name" stroke="#94A3B8" />
//           <YAxis yAxisId="return" stroke="#94A3B8" tickFormatter={(value) => `${value.toFixed(0)}%`} />
//           <YAxis yAxisId="fees" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `$${value}`} />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }}
//             formatter={(value, name) => {
//               debouncedLog(name, value);
//               return [
//                 name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 name === 'return' ? 'Return %' : 'Fees ($)'
//               ];
//             }}
//           />
//           <Legend />
//           <Line
//             yAxisId="return"
//             type="monotone"
//             dataKey="return"
//             stroke="#8884d8"
//             name="Return %"
//             strokeWidth={2}
//           />
//           <Line
//             yAxisId="fees"
//             type="monotone"
//             dataKey="fees"
//             stroke="#82ca9d"
//             name="Fees ($)"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// PerformanceSummary.propTypes = {
//   performance: PropTypes.shape({
//     ytdReturn: PropTypes.number,
//     totalFees: PropTypes.number,
//   }).isRequired,
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       fees: PropTypes.number,
//     }),
//   ).isRequired,
// };

// const RecentProfitDistributions = React.memo(({ distributions }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//         <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//         <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
//           <span>No distribution data available</span>
//         </div>
//       </div>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
//     { name: 'Manager Fees', value: distributions[0].fees ?? 0 }
//   ];

//   return (
//     <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg mt-6">
//       <h3 className="text-lg font-bold mb-4 text-white">Recent Profit Distributions</h3>
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full text-left text-gray-100">
//           <thead>
//             <tr className="border-b border-gray-600">
//               <th className="p-2">Date</th>
//               <th className="p-2 text-right">Amount</th>
//               <th className="p-2 text-right">Investors</th>
//               <th className="p-2 text-right">Fees</th>
//               <th className="p-2 text-right">Liquidations</th>
//             </tr>
//           </thead>
//           <tbody>
//             {distributions.slice(0, 5).map((row, index) => (
//               <tr key={row.id ?? `distribution-${index}`} className="border-b border-gray-700">
//                 <td className="p-2">{row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}</td>
//                 <td className="p-2 text-right">
//                   ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.investor_count ?? 0}</td>
//                 <td className="p-2 text-right">
//                   ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td className="p-2 text-right">{row.liquidated_count ?? 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <h4 className="text-sm font-semibold mb-2 text-white">Last Distribution Breakdown</h4>
//       <ResponsiveContainer width="100%" height={200}>
//         <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//           <XAxis type="number" stroke="#94A3B8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
//           <YAxis dataKey="name" type="category" stroke="#94A3B8" />
//           <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#F8FAFC' }} />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// RecentProfitDistributions.propTypes = {
//   distributions: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string,
//       timestamp: PropTypes.string,
//       amount: PropTypes.number,
//       investor_count: PropTypes.number,
//       fees: PropTypes.number,
//       liquidated_count: PropTypes.number
//     })
//   ).isRequired
// };

// const PAMMManager = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [theme, setTheme] = useState('dark');
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       console.log('managerData:', JSON.stringify(managerData, null, 2));

//       const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);

//       const investors = statusData.investors || [];
//       console.log('Investors:', JSON.stringify(investors, null, 2));
//       console.log('Investor IDs:', investors.map(inv => inv.id));
//       const uniqueInvestorIds = new Set(investors.map(inv => inv.id));
//       console.log('Unique Investor IDs Count:', uniqueInvestorIds.size, 'Total Investors:', investors.length);
//       if (uniqueInvestorIds.size !== investors.length) {
//         console.warn('Duplicate or missing investor IDs detected');
//       }

//       const distributionData = distData.data || [];
//       console.log('Distributions:', JSON.stringify(distributionData, null, 2));
//       console.log('Distribution IDs:', distributionData.map(dist => dist.id));
//       const uniqueDistributionIds = new Set(distributionData.map(dist => dist.id));
//       console.log('Unique Distribution IDs Count:', uniqueDistributionIds.size, 'Total Distributions:', distributionData.length);
//       if (uniqueDistributionIds.size !== distributionData.length) {
//         console.warn('Duplicate or missing distribution IDs detected');
//       }

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors,
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });

//       setDistributions(distributionData);

//       if (distributionData.length === 0) {
//         showSnackbar('No distribution data available', 'info');
//       }

//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data', 'error');
//       navigate('/login', { state: { error: error.message } });
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
//       if (!profitAmount || isNaN(profitAmount) || profitAmount <= 0) {
//         showSnackbar('Please enter a valid profit amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(profitAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to distribute profits');

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser?.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   const containerStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     padding: '24px',
//     position: 'relative',
//     overflow: 'hidden',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark'
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark'
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark'
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '16px',
//     boxShadow: theme === 'dark'
//       ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     backdropFilter: 'blur(10px)',
//     '&:hover': {
//       transform: 'translateY(-4px) scale(1.01)',
//       boxShadow: theme === 'dark'
//         ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.2)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
//       border: theme === 'dark'
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div style={containerStyles}>
//       <h1 className="text-3xl font-bold mb-8 text-white">PAMM Manager Dashboard</h1>
//       <div style={{ 
//         position: 'absolute', 
//         top: 20, 
//         right: 20, 
//         display: 'flex', 
//         alignItems: 'center',
//         justifyContent: 'flex-end', // This ensures right alignment
//         width: 'auto',
//       }}>
//         <Switch
//           checked={theme === 'dark'}
//           onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
//           checkedChildren="Dark"
//           unCheckedChildren="Light"
//           className={`theme-switch ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           style={{
//             marginLeft: '8px', // Changed from marginRight for better spacing
//             backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
//           }}
//         />
//       </div>
//       <div className="mb-6 p-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg shadow-lg">
//         <div className="flex items-center">
//           <AccountCircle className="text-blue-400 mr-3" />
//           <div>
//             <h3 className="text-lg font-semibold text-blue-100">Manager Status</h3>
//             <p className="text-blue-200">
//               {isManagerInitialized
//                 ? 'Manager account is initialized and active.'
//                 : 'Manager account is not initialized. Please initialize to proceed.'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//         />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AccountBalance className="text-blue-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Total AUM</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <People className="text-indigo-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Investors</h3>
//               <p className="text-2xl font-bold text-gray-100">{pammData.investors.length}</p>
//             </div>
//           </div>
//         </div>
//         <div style={cardStyles} className="p-6">
//           <div className="flex items-center">
//             <AttachMoney className="text-green-500 mr-3" style={{ fontSize: '40px' }} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-100">Manager Capital</h3>
//               <p className="text-2xl font-bold text-gray-100">
//                 ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isManagerInitialized && (
//         <AllocationWarning investors={pammData.investors} />
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <PerformanceSummary performance={performance} distributions={distributions} />
//         <DistributionPerformance distributions={distributions} />
//       </div>

//       <RecentProfitDistributions distributions={distributions} />

//       <div className="mt-6 flex flex-col md:flex-row gap-4">
//         <button
//           onClick={() => setOpenDistribution(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Distribute Profits
//         </button>
//         <button
//           onClick={() => setBoostDialogOpen(true)}
//           disabled={!isManagerInitialized}
//           className={`${
//             !isManagerInitialized
//               ? 'bg-gray-600 cursor-not-allowed'
//               : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//           } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//         >
//           <Add className="mr-2" />
//           Boost Manager Capital
//         </button>
//         {currentUser?.is_admin && (
//           <button
//             onClick={handleFixDistributions}
//             disabled={fixingDistributions || !isManagerInitialized}
//             className={`${
//               fixingDistributions || !isManagerInitialized
//                 ? 'bg-gray-600 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
//             } text-white font-semibold py-2 px-4 rounded flex items-center justify-center`}
//           >
//             <Refresh className="mr-2" />
//             {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//           </button>
//         )}
//       </div>

//       {isManagerInitialized && (
//         <div className="mt-6">
//           <h3 className="text-lg font-bold mb-4 text-white">Investor Overview</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-gray-100">
//               <thead>
//                 <tr className="border-b border-gray-600">
//                   <th className="p-2">Investor</th>
//                   <th className="p-2 text-right">Balance</th>
//                   <th className="p-2 text-right">Allocation (%)</th>
//                   <th className="p-2 text-right">Drawdown Limit</th>
//                   <th className="p-2 text-right">Last Active</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pammData.investors.map((investor, index) => (
//                   <tr key={investor.id ?? `investor-${index}`} className="border-b border-gray-700">
//                     <td className="p-2 flex items-center">
//                       <AccountCircle className="mr-2 text-gray-400" />
//                       {investor.name || `Investor ${investor.id ?? index}`}
//                     </td>
//                     <td className="p-2 text-right">
//                       ${(investor.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="p-2 text-right">{((investor.allocation_pct ?? 0) * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">{((investor.drawdown_limit ?? 0) * 100).toFixed(2)}%</td>
//                     <td className="p-2 text-right">
//                       {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           openDistribution ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Distribute Profits</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Profit Amount ($)</label>
//             <input
//               type="number"
//               value={profitAmount}
//               onChange={(e) => setProfitAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter profit amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setOpenDistribution(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDistributeProfits}
//               disabled={isDistributing || !profitAmount || profitAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 isDistributing || !profitAmount || profitAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {isDistributing ? 'Distributing...' : 'Distribute'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           boostDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-bold mb-4 text-white">Boost Manager Capital</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Boost Amount ($)</label>
//             <input
//               type="number"
//               value={boostAmount}
//               onChange={(e) => setBoostAmount(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter boost amount"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setBoostDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBoostCapital}
//               disabled={!boostAmount || boostAmount <= 0}
//               className={`py-2 px-4 rounded ${
//                 !boostAmount || boostAmount <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
//               } text-white font-semibold`}
//             >
//               Boost Capital
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
//           initDialogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-bold mb-6 text-white">Initialize Manager Account</h2>
//           <div className="mb-4">
//             <label className="block text-gray-300 mb-2">Initial Capital ($)</label>
//             <input
//               type="number"
//               value={initialCapital}
//               onChange={(e) => setInitialCapital(e.target.value)}
//               className="w-full p-2 rounded bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter initial capital"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setInitDialogOpen(false)}
//               className="py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleInitializeManager}
//               disabled={initLoading || !initialCapital || initialCapital <= 0}
//               className={`py-2 px-4 rounded ${
//                 initLoading || !initialCapital || initialCapital <= 0
//                   ? 'bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//               } text-white font-semibold`}
//             >
//               {initLoading ? 'Initializing...' : 'Initialize Account'}
//             </button>
//           </div>
//           {snackbar.open && (
//             <div className={`mt-4 p-2 rounded ${snackbar.severity === 'success' ? 'bg-green-900' : 'bg-red-900'} text-white`}>
//               {snackbar.message}
//             </div>
//           )}
//         </div>
//       </div>

//       {snackbar.open && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
//             snackbar.severity === 'success' ? 'bg-green-900' : snackbar.severity === 'info' ? 'bg-blue-900' : 'bg-red-900'
//           } text-white max-w-sm`}
//         >
//           {snackbar.message}
//           <button
//             onClick={closeSnackbar}
//             className="absolute top-1 right-2 text-gray-300 hover:text-white"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default function WrappedPAMMManager() {
// //   return (
// //     <ErrorBoundary>
// //       <PAMMManager />
// //     </ErrorBoundary>
// //   );
// // }


// PAMMManager.propTypes = {
//   theme: PropTypes.oneOf(['dark', 'light']).isRequired,
//   setTheme: PropTypes.func.isRequired  // Add setTheme to propTypes
// };

// export default function WrappedPAMMManager(props) {
//   return (
//     <ErrorBoundary>
//       <PAMMManager {...props} />
//     </ErrorBoundary>
//   );
// }

























// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../Auth';
// import { 
//   People, AttachMoney, Add as AddIcon, AccountBalance, AccountCircle, 
//   Refresh, Warning as WarningIcon, TrendingUp, TrendingDown,  
//   ArrowUpward, ArrowDownward, PieChart as PieChartIcon,
//   Timeline, Equalizer, Money, History
// } from '@mui/icons-material';
// import { 
//   ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, 
//   Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector 
// } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { Switch } from 'antd';
// import { 
//   Box, Button, Card, CardContent, CircularProgress, 
//   Dialog, DialogActions, DialogContent, DialogTitle, 
//   Grid, LinearProgress, Paper, Snackbar, Table, 
//   TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, TextField, Typography, Alert 
// } from '@mui/material';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Alert severity="error" sx={{ m: 2 }}>
//           Something went wrong: {this.state.error?.message || 'Unknown error'}
//         </Alert>
//       );
//     }
//     return this.props.children;
//   }
// }

// ErrorBoundary.propTypes = {
//   children: PropTypes.node
// };

// // Theme Context
// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('dark');

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// ThemeProvider.propTypes = {
//   children: PropTypes.node
// };

// const useTheme = () => useContext(ThemeContext);

// // fetchWithAuth with navigate parameter
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   let token = localStorage.getItem('authToken');
//   const headers = {
//     ...options.headers,
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   };

//   let response = await fetch(url, { ...options, headers });

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//         localStorage.setItem('authToken', idToken);
//         localStorage.setItem('refreshToken', newRefreshToken);
//         headers['Authorization'] = `Bearer ${idToken}`;
//         response = await fetch(url, { ...options, headers });
//       } else {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('refreshToken');
//         navigate('/dashboard/login');
//       }
//     } else {
//       navigate('/dashboard/login');
//     }
//   }

//   return response;
// };

// // PerformanceChart component with updated styling
// const PerformanceChart = ({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No performance data available
//         </Typography>
//       </Box>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount ?? 0,
//     fees: dist.fees ?? 0,
//     date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
//   }));

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//           />
//           <YAxis 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//             formatter={(value, name) => [
//               name === 'amount' && value < 0 ? (
//                 <Box display="flex" alignItems="center">
//                   <TrendingDown sx={{ color: '#EF4444', fontSize: '1rem', mr: 0.5 }} />
//                   {`$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
//                 </Box>
//               ) : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend 
//             formatter={(value) => (
//               <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                 {value}
//               </span>
//             )}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// PerformanceChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // CapitalHealthWarning with updated styling
// const CapitalHealthWarning = ({ investorCapital, managerCapital, theme }) => {
//   if (!investorCapital || !managerCapital) {
//     return null;
//   }

//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <Box sx={{ 
//       mb: 3,
//       p: 3,
//       background: 'linear-gradient(to right, #B91C1C, #991B1B)',
//       borderRadius: '12px',
//       border: '1px solid rgba(239, 68, 68, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FECACA', mr: 2, fontSize: '2rem' }} />
//         <Box>
//           <Typography variant="h6" sx={{ color: '#FEF2F2', fontWeight: 600 }}>
//             Capital Health Warning
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// CapitalHealthWarning.propTypes = {
//   investorCapital: PropTypes.number,
//   managerCapital: PropTypes.number,
//   theme: PropTypes.string
// };

// // AllocationWarning with updated styling
// const AllocationWarning = ({ investors, theme }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <Box sx={{ 
//       mt: 2,
//       p: 2,
//       background: 'linear-gradient(to right, #B45309, #92400E)',
//       borderRadius: '12px',
//       border: '1px solid rgba(234, 88, 12, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FEF3C7', mr: 1.5 }} />
//         <Box>
//           <Typography variant="subtitle2" sx={{ color: '#FEF3C7', fontWeight: 600 }}>
//             Allocation Risks
//           </Typography>
//           <Box sx={{ color: '#FDE68A', fontSize: '0.875rem' }}>
//             {isConcentrated && (
//               <Typography variant="body2">
//                 ⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor
//               </Typography>
//             )}
//             {hasSmallBase && (
//               <Typography variant="body2">
//                 ⚠️ Small investor base: Only {investors.length} active investors
//               </Typography>
//             )}
//             <Typography variant="body2" sx={{ mt: 0.5 }}>
//               Consider diversifying your investor base to reduce risk.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// AllocationWarning.propTypes = {
//   investors: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPieChart with updated styling
// const DistributionPieChart = React.memo(({ distributions, theme }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
  
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No distribution data available
//         </Typography>
//       </Box>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
//     { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={-10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={14} 
//           fontWeight={500}
//         >
//           {payload.name}
//         </text>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={12}
//         >
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry) => (
//               <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// });

// DistributionPieChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPerformance with updated styling
// const DistributionPerformance = React.memo(({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Timeline sx={{ mr: 1 }} />
//           Distribution Performance
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount ?? 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
//     : 0;

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Timeline sx={{ mr: 1 }} />
//         Distribution Performance
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Total Distributed
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Average Distribution
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Last Distribution
//             </Typography>
//             <Box display="flex" alignItems="center">
//               <Typography variant="h5" sx={{ 
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                 fontWeight: 700,
//                 mr: 1
//               }}>
//                 ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </Typography>
//               {distributionChange !== 0 && (
//                 <>
//                   {distributionChange >= 0 ? (
//                     <ArrowUpward sx={{ color: '#10B981', fontSize: '1.2rem' }} />
//                   ) : (
//                     <ArrowDownward sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
//                   )}
//                   <Typography variant="body2" sx={{ 
//                     color: distributionChange >= 0 ? '#10B981' : '#EF4444',
//                     ml: 0.5
//                   }}>
//                     {Math.abs(distributionChange).toFixed(1)}%
//                   </Typography>
//                 </>
//               )}
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2
//           }}>
//             Distribution History
//           </Typography>
//           <PerformanceChart distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             <PieChartIcon sx={{ mr: 1 }} />
//             Last Distribution Breakdown
//           </Typography>
//           <DistributionPieChart distributions={distributions} theme={theme} />
//         </Grid>
//       </Grid>
//     </Card>
//   );
// });

// DistributionPerformance.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // PerformanceSummary with updated styling
// const PerformanceSummary = React.memo(({ performance, distributions, theme }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount ?? 0;
//       const fees = dist.fees ?? 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Equalizer sx={{ mr: 1 }} />
//           Performance Summary
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No performance data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Equalizer sx={{ mr: 1 }} />
//         Performance Summary
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             YTD Return:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: performance.ytdReturn >= 0 ? '#10B981' : '#EF4444',
//             fontWeight: 700,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             {performance.ytdReturn >= 0 ? <TrendingUp sx={{ mr: 0.5 }} /> : <TrendingDown sx={{ mr: 0.5 }} />}
//             {(performance.ytdReturn ?? 0).toFixed(2)}%
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Fees Earned:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Distributions:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Last Distribution:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length > 0 && distributions[0].timestamp
//               ? new Date(distributions[0].timestamp).toLocaleDateString()
//               : 'Never'}
//           </Typography>
//         </Grid>
//       </Grid>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2
//       }}>
//         Performance Trend
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={performanceData}>
//             <XAxis 
//               dataKey="name" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <YAxis 
//               yAxisId="return" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `${value.toFixed(0)}%`} 
//             />
//             <YAxis 
//               yAxisId="fees" 
//               orientation="right" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value}`} 
//             />
//             <Tooltip
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//               }}
//               formatter={(value, name) => {
//                 debouncedLog(name, value);
//                 return [
//                   name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                   name === 'return' ? 'Return %' : 'Fees ($)'
//                 ];
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Line
//               yAxisId="return"
//               type="monotone"
//               dataKey="return"
//               stroke="#8884d8"
//               name="Return %"
//               strokeWidth={2}
//             />
//             <Line
//               yAxisId="fees"
//               type="monotone"
//               dataKey="fees"
//               stroke="#82ca9d"
//               name="Fees ($)"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// PerformanceSummary.propTypes = {
//   performance: PropTypes.object,
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // RecentProfitDistributions with updated styling
// const RecentProfitDistributions = React.memo(({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3,
//         mt: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <History sx={{ mr: 1 }} />
//           Recent Profit Distributions
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
//     { name: 'Manager Fees', value: distributions[0].fees ?? 0 }
//   ];

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3,
//       mt: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <History sx={{ mr: 1 }} />
//         Recent Profit Distributions
//       </Typography>
      
//       <Box sx={{ mb: 3, overflowX: 'auto' }}>
//         <TableContainer 
//           component={Paper}
//           sx={{ 
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//           }}
//         >
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
//               }}>
//                 <TableCell sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Date
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Amount
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Investors
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Fees
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Liquidations
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {distributions.slice(0, 5).map((row, index) => (
//                 <TableRow key={row.id ?? `distribution-${index}`}>
//                   <TableCell sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.investor_count ?? 0}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.liquidated_count ?? 0}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2
//       }}>
//         Last Distribution Breakdown
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <XAxis 
//               type="number" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value.toLocaleString()}`} 
//             />
//             <YAxis 
//               dataKey="name" 
//               type="category" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// RecentProfitDistributions.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // Main PAMMManager component with updated styling
// const PAMMManager = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const containerStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     p: 3,
//     position: 'relative',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark' 
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark' 
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '12px',
//     boxShadow: theme === 'dark' 
//       ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     '&:hover': {
//       transform: 'translateY(-4px)',
//       boxShadow: theme === 'dark' 
//         ? '0 12px 40px rgba(0, 0, 0, 0.5)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/login');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);

//       const investors = statusData.investors || [];
//       const distributionData = distData.data || [];

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors,
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });

//       setDistributions(distributionData);
//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   // const handleDistributeProfits = async () => {
//   //   try {
//   //     setIsDistributing(true);
//   //     if (!profitAmount || isNaN(profitAmount) || profitAmount <= 0) {
//   //       showSnackbar('Please enter a valid profit amount', 'error');
//   //       return;
//   //     }

//   //     const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//   //       method: 'POST',
//   //       body: JSON.stringify({ amount: parseFloat(profitAmount) })
//   //     }, navigate);

//   //     if (!response.ok) throw new Error((await response.json()).message || 'Failed to distribute profits');

//   //     showSnackbar('Profits distributed successfully', 'success');
//   //     setOpenDistribution(false);
//   //     setProfitAmount('');
//   //     await fetchPAMMData();

//   //   } catch (error) {
//   //     console.error('Error distributing profits:', error);
//   //     showSnackbar(error.message || 'Failed to distribute profits', 'error');
//   //   } finally {
//   //     setIsDistributing(false);
//   //   }
//   // };


//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
      
//       // Convert to number and validate
//       const amount = parseFloat(profitAmount);
//       if (isNaN(amount) || amount <= 0) {
//         showSnackbar('Please enter a valid positive profit amount', 'error');
//         return;
//       }
  
//       // Round to 2 decimal places to avoid floating point precision issues
//       const roundedAmount = Math.round(amount * 100) / 100;
//       console.log('Sending profit amount:', roundedAmount);
  
//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ 
//           profit: roundedAmount  
//         })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to distribute profits');
//       }
  
//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();
  
//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser?.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   if (loading && !pammData.investors.length) {
//     return (
//       <Box sx={containerStyles}>
//         <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//           <CircularProgress />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={containerStyles}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 700,
//           fontSize: '2.5rem',
//           background: theme === 'dark' 
//             ? 'linear-gradient(135deg, #38BDF8, #A855F7)'
//             : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//           backgroundClip: 'text',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           textShadow: theme === 'dark' 
//             ? '0 4px 8px rgba(56, 189, 248, 0.3)'
//             : '0 4px 8px rgba(59, 130, 246, 0.2)',
//           zIndex: 1,
//           position: 'relative'
//         }}>
//           PAMM Manager Dashboard
//         </Typography>
//         <Switch
//           checked={theme === 'dark'}
//           onChange={toggleTheme}
//           checkedChildren="Dark"
//           unCheckedChildren="Light"
//           className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           style={{ padding: '4px', fontSize: '14px' }}
//         />
//       </Box>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center">
//           <Button
//             variant="contained"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<AddIcon />}
//             size="large"
//             sx={{
//               background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//               boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
//               borderRadius: '12px',
//               padding: '12px 32px',
//               fontSize: '1.1rem',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
//                 boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             Initialize Manager Account
//           </Button>
//         </Box>
//       )}

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//           theme={theme}
//         />
//       )}

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AccountBalance sx={{ 
//                   color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Total AUM
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <People sx={{ 
//                   color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Investors
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AttachMoney sx={{ 
//                   color: theme === 'dark' ? '#10B981' : '#059669',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Manager Capital
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

    //   {isManagerInitialized && (
    //     <AllocationWarning investors={pammData.investors} theme={theme} />
    //   )}

    //   <Grid container spacing={3} mb={4}>
    //     <Grid item xs={12} md={6}>
    //       <PerformanceSummary performance={performance} distributions={distributions} theme={theme} />
    //     </Grid>
    //     <Grid item xs={12} md={6}>
    //       <DistributionPerformance distributions={distributions} theme={theme} />
    //     </Grid>
    //   </Grid>

    //   <RecentProfitDistributions distributions={distributions} theme={theme} />

    //   <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
    //     <Button
    //       onClick={() => setOpenDistribution(true)}
    //       disabled={!isManagerInitialized}
    //       startIcon={<Money />}
    //       variant="contained"
    //       sx={{
    //         background: !isManagerInitialized
    //           ? 'rgba(100, 116, 139, 0.5)'
    //           : 'linear-gradient(to right, #3B82F6, #6366F1)',
    //         color: '#FFFFFF',
    //         fontWeight: 500,
    //         '&:hover': {
    //           background: !isManagerInitialized
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #2563EB, #4F46E5)'
    //         },
    //         textTransform: 'none',
    //         py: 1.5,
    //         borderRadius: '8px'
    //       }}
    //     >
    //       Distribute Profits
    //     </Button>
        
    //     <Button
    //       onClick={() => setBoostDialogOpen(true)}
    //       disabled={!isManagerInitialized}
    //       startIcon={<TrendingUp />}
    //       variant="contained"
    //       sx={{
    //         background: !isManagerInitialized
    //           ? 'rgba(100, 116, 139, 0.5)'
    //           : 'linear-gradient(to right, #10B981, #059669)',
    //         color: '#FFFFFF',
    //         fontWeight: 500,
    //         '&:hover': {
    //           background: !isManagerInitialized
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #059669, #047857)'
    //         },
    //         textTransform: 'none',
    //         py: 1.5,
    //         borderRadius: '8px'
    //       }}
    //     >
    //       Boost Manager Capital
    //     </Button>
        
    //     {currentUser?.is_admin && (
    //       <Button
    //         onClick={handleFixDistributions}
    //         disabled={fixingDistributions || !isManagerInitialized}
    //         startIcon={<Refresh />}
    //         variant="contained"
    //         sx={{
    //           background: fixingDistributions || !isManagerInitialized
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #8B5CF6, #7C3AED)',
    //           color: '#FFFFFF',
    //           fontWeight: 500,
    //           '&:hover': {
    //             background: fixingDistributions || !isManagerInitialized
    //               ? 'rgba(100, 116, 139, 0.5)'
    //               : 'linear-gradient(to right, #7C3AED, #6D28D9)'
    //           },
    //           textTransform: 'none',
    //           py: 1.5,
    //           borderRadius: '8px'
    //         }}
    //       >
    //         {fixingDistributions ? 'Fixing...' : 'Fix Distributions'}
    //       </Button>
    //     )}
    //   </Box>

    //   {isManagerInitialized && (
    //     <Box sx={{ mt: 4 }}>
    //       <Typography variant="h6" sx={{ 
    //         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //         fontWeight: 600,
    //         mb: 2
    //       }}>
    //         Investor Overview
    //       </Typography>
    //       <TableContainer 
    //         component={Paper}
    //         sx={{ 
    //           background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    //           border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
    //         }}
    //       >
    //         <Table>
    //           <TableHead>
    //             <TableRow sx={{ 
    //               background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
    //             }}>
    //               <TableCell sx={{ 
    //                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                 fontWeight: 600
    //               }}>
    //                 Investor
    //               </TableCell>
    //               <TableCell align="right" sx={{ 
    //                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                 fontWeight: 600
    //               }}>
    //                 Balance
    //               </TableCell>
    //               <TableCell align="right" sx={{ 
    //                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                 fontWeight: 600
    //               }}>
    //                 Allocation (%)
    //               </TableCell>
    //               <TableCell align="right" sx={{ 
    //                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                 fontWeight: 600
    //               }}>
    //                 Drawdown Limit
    //               </TableCell>
    //               <TableCell align="right" sx={{ 
    //                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                 fontWeight: 600
    //               }}>
    //                 Last Active
    //               </TableCell>
    //             </TableRow>
    //           </TableHead>
    //           <TableBody>
    //             {pammData.investors.map((investor, index) => (
    //               <TableRow key={investor.id ?? `investor-${index}`}>
    //                 <TableCell sx={{ 
    //                   color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //                   display: 'flex',
    //                   alignItems: 'center'
    //                 }}>
    //                   <AccountCircle sx={{ 
    //                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //                     mr: 1.5
    //                   }} />
    //                   {investor.name || `Investor ${investor.id ?? index}`}
    //                 </TableCell>
    //                 <TableCell align="right" sx={{ 
    //                   color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
    //                 }}>
    //                   ${(investor.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
    //                 </TableCell>
    //                 <TableCell align="right" sx={{ 
    //                   color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
    //                 }}>
    //                   {((investor.allocation_pct ?? 0) * 100).toFixed(2)}%
    //                 </TableCell>
    //                 <TableCell align="right" sx={{ 
    //                   color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
    //                 }}>
    //                   {((investor.drawdown_limit ?? 0) * 100).toFixed(2)}%
    //                 </TableCell>
    //                 <TableCell align="right" sx={{ 
    //                   color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
    //                 }}>
    //                   {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
    //                 </TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </Table>
    //       </TableContainer>
    //     </Box>
    //   )}

    //   {/* Distribute Profits Dialog */}
    //   <Dialog 
    //     open={openDistribution} 
    //     onClose={() => setOpenDistribution(false)}
    //     PaperProps={{
    //       sx: {
    //         background: theme === 'dark' 
    //           ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
    //           : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
    //         borderRadius: '12px',
    //         border: theme === 'dark' 
    //           ? '1px solid rgba(100, 116, 139, 0.5)'
    //           : '1px solid rgba(203, 213, 225, 0.7)',
    //         boxShadow: theme === 'dark' 
    //           ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
    //           : '0px 8px 24px rgba(0, 0, 0, 0.1)',
    //         minWidth: '400px'
    //       }
    //     }}
    //   >
    //     <DialogTitle sx={{ 
    //       color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //       fontWeight: 700,
    //       fontSize: '1.25rem',
    //       borderBottom: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)',
    //       padding: '16px 24px'
    //     }}>
    //       Distribute Profits
    //     </DialogTitle>
        
    //     <DialogContent sx={{ padding: '20px 24px' }}>
    //       {isDistributing && <LinearProgress sx={{ mb: 2 }} />}
    //       <TextField
    //         label="Profit Amount ($)"
    //         type="number"
    //         fullWidth
    //         value={profitAmount}
    //         onChange={(e) => setProfitAmount(e.target.value)}
    //         InputProps={{ 
    //           sx: {
    //             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //             '& .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
    //             },
    //             '&:hover .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
    //             }
    //           }
    //         }}
    //         InputLabelProps={{
    //           sx: {
    //             color: theme === 'dark' ? '#94A3B8' : '#64748B'
    //           }
    //         }}
    //         sx={{ mb: 3 }}
    //       />
          
    //       <Alert severity="info" sx={{ 
    //         backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
    //         color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //         borderColor: theme === 'dark' ? '#0EA5E9' : '#BAE6FD'
    //       }}>
    //         A 20% performance fee will be deducted from the profit amount before distribution.
    //       </Alert>
    //     </DialogContent>
        
    //     <DialogActions sx={{
    //       padding: '16px 24px',
    //       borderTop: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)'
    //     }}>
    //       <Button 
    //         onClick={() => setOpenDistribution(false)}
    //         sx={{ 
    //           color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //           fontWeight: 500,
    //           '&:hover': {
    //             backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    //           }
    //         }}
    //       >
    //         Cancel
    //       </Button>
    //       <Button 
    //         onClick={handleDistributeProfits} 
    //         variant="contained"
    //         disabled={isDistributing || !profitAmount || profitAmount <= 0}
    //         sx={{
    //           background: isDistributing || !profitAmount || profitAmount <= 0
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #3B82F6, #6366F1)',
    //           color: '#FFFFFF',
    //           fontWeight: 500,
    //           '&:hover': {
    //             background: isDistributing || !profitAmount || profitAmount <= 0
    //               ? 'rgba(100, 116, 139, 0.5)'
    //               : 'linear-gradient(to right, #2563EB, #4F46E5)'
    //           }
    //         }}
    //       >
    //         {isDistributing ? 'Distributing...' : 'Distribute'}
    //       </Button>
    //     </DialogActions>
    //   </Dialog>

    //   {/* Boost Capital Dialog */}
    //   <Dialog 
    //     open={boostDialogOpen} 
    //     onClose={() => setBoostDialogOpen(false)}
    //     PaperProps={{
    //       sx: {
    //         background: theme === 'dark' 
    //           ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
    //           : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
    //         borderRadius: '12px',
    //         border: theme === 'dark' 
    //           ? '1px solid rgba(100, 116, 139, 0.5)'
    //           : '1px solid rgba(203, 213, 225, 0.7)',
    //         boxShadow: theme === 'dark' 
    //           ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
    //           : '0px 8px 24px rgba(0, 0, 0, 0.1)',
    //         minWidth: '400px'
    //       }
    //     }}
    //   >
    //     <DialogTitle sx={{ 
    //       color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //       fontWeight: 700,
    //       fontSize: '1.25rem',
    //       borderBottom: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)',
    //       padding: '16px 24px'
    //     }}>
    //       Boost Manager Capital
    //     </DialogTitle>
        
    //     <DialogContent sx={{ padding: '20px 24px' }}>
    //       <TextField
    //         label="Boost Amount ($)"
    //         type="number"
    //         fullWidth
    //         value={boostAmount}
    //         onChange={(e) => setBoostAmount(e.target.value)}
    //         InputProps={{ 
    //           sx: {
    //             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //             '& .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
    //             },
    //             '&:hover .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
    //             }
    //           }
    //         }}
    //         InputLabelProps={{
    //           sx: {
    //             color: theme === 'dark' ? '#94A3B8' : '#64748B'
    //           }
    //         }}
    //         sx={{ mb: 3 }}
    //       />
          
    //       <Alert severity="info" sx={{ 
    //         backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
    //         color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //         borderColor: theme === 'dark' ? '#0EA5E9' : '#BAE6FD'
    //       }}>
    //         Increasing your manager capital improves your capital ratio and reduces risk for investors.
    //       </Alert>
    //     </DialogContent>
        
    //     <DialogActions sx={{
    //       padding: '16px 24px',
    //       borderTop: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)'
    //     }}>
    //       <Button 
    //         onClick={() => setBoostDialogOpen(false)}
    //         sx={{ 
    //           color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //           fontWeight: 500,
    //           '&:hover': {
    //             backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    //           }
    //         }}
    //       >
    //         Cancel
    //       </Button>
    //       <Button 
    //         onClick={handleBoostCapital} 
    //         variant="contained"
    //         disabled={!boostAmount || boostAmount <= 0}
    //         sx={{
    //           background: !boostAmount || boostAmount <= 0
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #10B981, #059669)',
    //           color: '#FFFFFF',
    //           fontWeight: 500,
    //           '&:hover': {
    //             background: !boostAmount || boostAmount <= 0
    //               ? 'rgba(100, 116, 139, 0.5)'
    //               : 'linear-gradient(to right, #059669, #047857)'
    //           }
    //         }}
    //       >
    //         Boost Capital
    //       </Button>
    //     </DialogActions>
    //   </Dialog>

    //   {/* Initialize Manager Dialog */}
    //   <Dialog 
    //     open={initDialogOpen} 
    //     onClose={() => setInitDialogOpen(false)}
    //     PaperProps={{
    //       sx: {
    //         background: theme === 'dark' 
    //           ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
    //           : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
    //         borderRadius: '12px',
    //         border: theme === 'dark' 
    //           ? '1px solid rgba(100, 116, 139, 0.5)'
    //           : '1px solid rgba(203, 213, 225, 0.7)',
    //         boxShadow: theme === 'dark' 
    //           ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
    //           : '0px 8px 24px rgba(0, 0, 0, 0.1)',
    //         minWidth: '400px'
    //       }
    //     }}
    //   >
    //     <DialogTitle sx={{ 
    //       color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //       fontWeight: 700,
    //       fontSize: '1.25rem',
    //       borderBottom: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)',
    //       padding: '16px 24px'
    //     }}>
    //       Initialize Manager Account
    //     </DialogTitle>
        
    //     <DialogContent sx={{ padding: '20px 24px' }}>
    //       {initLoading && <LinearProgress sx={{ mb: 2 }} />}
    //       <TextField
    //         label="Initial Capital ($)"
    //         type="number"
    //         fullWidth
    //         value={initialCapital}
    //         onChange={(e) => setInitialCapital(e.target.value)}
    //         InputProps={{ 
    //           sx: {
    //             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    //             '& .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
    //             },
    //             '&:hover .MuiOutlinedInput-notchedOutline': {
    //               borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
    //             }
    //           }
    //         }}
    //         InputLabelProps={{
    //           sx: {
    //             color: theme === 'dark' ? '#94A3B8' : '#64748B'
    //           }
    //         }}
    //         sx={{ mb: 3 }}
    //       />
          
    //       <Alert severity="info" sx={{ 
    //         backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
    //         color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //         borderColor: theme === 'dark' ? '#0EA5E9' : '#BAE6FD'
    //       }}>
    //         Your initial capital will be used to cover potential losses before investors' funds are affected.
    //       </Alert>
    //     </DialogContent>
        
    //     <DialogActions sx={{
    //       padding: '16px 24px',
    //       borderTop: theme === 'dark' 
    //         ? '1px solid rgba(71, 85, 105, 0.5)'
    //         : '1px solid rgba(226, 232, 240, 0.7)'
    //     }}>
    //       <Button 
    //         onClick={() => setInitDialogOpen(false)}
    //         sx={{ 
    //           color: theme === 'dark' ? '#94A3B8' : '#64748B',
    //           fontWeight: 500,
    //           '&:hover': {
    //             backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    //           }
    //         }}
    //       >
    //         Cancel
    //       </Button>
    //       <Button 
    //         onClick={handleInitializeManager} 
    //         variant="contained"
    //         disabled={initLoading || !initialCapital || initialCapital <= 0}
    //         sx={{
    //           background: initLoading || !initialCapital || initialCapital <= 0
    //             ? 'rgba(100, 116, 139, 0.5)'
    //             : 'linear-gradient(to right, #3B82F6, #6366F1)',
    //           color: '#FFFFFF',
    //           fontWeight: 500,
    //           '&:hover': {
    //             background: initLoading || !initialCapital || initialCapital <= 0
    //               ? 'rgba(100, 116, 139, 0.5)'
    //               : 'linear-gradient(to right, #2563EB, #4F46E5)'
    //           }
    //         }}
    //       >
    //         {initLoading ? 'Initializing...' : 'Initialize'}
    //       </Button>
    //     </DialogActions>
    //   </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={closeSnackbar} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// // Wrap PAMMManager with ThemeProvider
// const WrappedPAMMManager = () => (
//   <ThemeProvider>
//     <ErrorBoundary>
//       <PAMMManager />
//     </ErrorBoundary>
//   </ThemeProvider>
// );

// export default WrappedPAMMManager;




// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../Auth'; // Updated path to match your structure
// import { 
//   People, AttachMoney, Add as AddIcon, AccountBalance, AccountCircle, 
//   Refresh, Warning as WarningIcon, TrendingUp, TrendingDown,  
//   ArrowUpward, ArrowDownward, PieChart as PieChartIcon,
//   Timeline, Equalizer, Money, History
// } from '@mui/icons-material';
// import { 
//   ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, 
//   Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector 
// } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { Switch } from 'antd';
// import { 
//   Box, Button, Card, CardContent, CircularProgress, 
//   Dialog, DialogActions, DialogContent, DialogTitle, 
//   Grid, LinearProgress, Paper, Snackbar, Table, 
//   TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, TextField, Typography, Alert 
// } from '@mui/material';

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Alert severity="error" sx={{ m: 2 }}>
//           Something went wrong: {this.state.error?.message || 'Unknown error'}
//           <Button
//             onClick={() => this.setState({ hasError: false, error: null })}
//             sx={{ mt: 1 }}
//           >
//             Try Again
//           </Button>
//         </Alert>
//       );
//     }
//     return this.props.children;
//   }
// }

// ErrorBoundary.propTypes = {
//   children: PropTypes.node
// };

// // Theme Context
// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('dark');

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// ThemeProvider.propTypes = {
//   children: PropTypes.node
// };

// const useTheme = () => useContext(ThemeContext);

// // Utility for retrying failed requests
// const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (error.message.includes('Failed to fetch') || error.message.includes('network') || !navigator.onLine) {
//         if (attempt === maxRetries) {
//           throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
//         }
//         await new Promise((resolve) => setTimeout(resolve, delay * attempt));
//       } else {
//         throw error;
//       }
//     }
//   }
// };

// // fetchWithAuth with enhanced error handling
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   try {
//     let token = localStorage.getItem('authToken');
//     const headers = {
//       ...options.headers,
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };

//     if (!navigator.onLine) {
//       throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
//     }

//     let response = await withRetry(() => fetch(url, { ...options, headers }));

//     if (!response.ok) {
//       if (response.status === 401) {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           try {
//             const refreshResponse = await withRetry(() =>
//               fetch('http://localhost:5000/refresh/manager/investor', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ refreshToken }),
//               })
//             );

//             if (refreshResponse.ok) {
//               const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//               localStorage.setItem('authToken', idToken);
//               localStorage.setItem('refreshToken', newRefreshToken);
//               headers['Authorization'] = `Bearer ${idToken}`;
//               response = await withRetry(() => fetch(url, { ...options, headers }));
//             } else {
//               throw new Error('Unable to refresh token');
//             }
//           } catch (refreshError) {
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('refreshToken');
//             navigate('/dashboard/login');
//             throw new Error('Session expired. Please log in again.');
//           }
//         } else {
//           navigate('/dashboard/login');
//           throw new Error('No refresh token available. Please log in.');
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Request failed with status ${response.status}`);
//       }
//     }

//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // PerformanceChart component (unchanged)
// const PerformanceChart = ({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No performance data available
//         </Typography>
//       </Box>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount ?? 0,
//     fees: dist.fees ?? 0,
//     date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
//   }));

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//           />
//           <YAxis 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//             formatter={(value, name) => [
//               name === 'amount' && value < 0 ? (
//                 <Box display="flex" alignItems="center">
//                   <TrendingDown sx={{ color: '#EF4444', fontSize: '1rem', mr: 0.5 }} />
//                   {`$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
//                 </Box>
//               ) : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend 
//             formatter={(value) => (
//               <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                 {value}
//               </span>
//             )}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// PerformanceChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // CapitalHealthWarning (unchanged)
// const CapitalHealthWarning = ({ investorCapital, managerCapital, theme }) => {
//   if (!investorCapital || !managerCapital) {
//     return null;
//   }

//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <Box sx={{ 
//       mb: 3,
//       p: 3,
//       background: 'linear-gradient(to right, #B91C1C, #991B1B)',
//       borderRadius: '12px',
//       border: '1px solid rgba(239, 68, 68, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FECACA', mr: 2, fontSize: '2rem' }} />
//         <Box>
//           <Typography variant="h6" sx={{ color: '#FEF2F2', fontWeight: 600 }}>
//             Capital Health Warning
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// CapitalHealthWarning.propTypes = {
//   investorCapital: PropTypes.number,
//   managerCapital: PropTypes.number,
//   theme: PropTypes.string
// };

// // AllocationWarning (unchanged)
// const AllocationWarning = ({ investors, theme }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <Box sx={{ 
//       mt: 2,
//       p: 2,
//       background: 'linear-gradient(to right, #B45309, #92400E)',
//       borderRadius: '12px',
//       border: '1px solid rgba(234, 88, 12, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FEF3C7', mr: 1.5 }} />
//         <Box>
//           <Typography variant="subtitle2" sx={{ color: '#FEF3C7', fontWeight: 600 }}>
//             Allocation Risks
//           </Typography>
//           <Box sx={{ color: '#FDE68A', fontSize: '0.875rem' }}>
//             {isConcentrated && (
//               <Typography variant="body2">
//                 ⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor
//               </Typography>
//             )}
//             {hasSmallBase && (
//               <Typography variant="body2">
//                 ⚠️ Small investor base: Only {investors.length} active investors
//               </Typography>
//             )}
//             <Typography variant="body2" sx={{ mt: 0.5 }}>
//               Consider diversifying your investor base to reduce risk.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// AllocationWarning.propTypes = {
//   investors: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPieChart (unchanged)
// const DistributionPieChart = React.memo(({ distributions, theme }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
  
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No distribution data available
//         </Typography>
//       </Box>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
//     { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={-10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={14} 
//           fontWeight={500}
//         >
//           {payload.name}
//         </text>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={12}
//         >
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry) => (
//               <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// });

// DistributionPieChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPerformance (unchanged)
// const DistributionPerformance = React.memo(({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Timeline sx={{ mr: 1 }} />
//           Distribution Performance
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount ?? 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
//     : 0;

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Timeline sx={{ mr: 1 }} />
//         Distribution Performance
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Total Distributed
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Average Distribution
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Last Distribution
//             </Typography>
//             <Box display="flex" alignItems="center">
//               <Typography variant="h5" sx={{ 
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                 fontWeight: 700,
//                 mr: 1
//               }}>
//                 ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </Typography>
//               {distributionChange !== 0 && (
//                 <>
//                   {distributionChange >= 0 ? (
//                     <ArrowUpward sx={{ color: '#10B981', fontSize: '1.2rem' }} />
//                   ) : (
//                     <ArrowDownward sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
//                   )}
//                   <Typography variant="body2" sx={{ 
//                     color: distributionChange >= 0 ? '#10B981' : '#EF4444',
//                     ml: 0.5
//                   }}>
//                     {Math.abs(distributionChange).toFixed(1)}%
//                   </Typography>
//                 </>
//               )}
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2
//           }}>
//             Distribution History
//           </Typography>
//           <PerformanceChart distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             <PieChartIcon sx={{ mr: 1 }} />
//             Last Distribution Breakdown
//           </Typography>
//           <DistributionPieChart distributions={distributions} theme={theme} />
//         </Grid>
//       </Grid>
//     </Card>
//   );
// });

// DistributionPerformance.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // PerformanceSummary (unchanged)
// const PerformanceSummary = React.memo(({ performance, distributions, theme }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount ?? 0;
//       const fees = dist.fees ?? 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Equalizer sx={{ mr: 1 }} />
//           Performance Summary
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No performance data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Equalizer sx={{ mr: 1 }} />
//         Performance Summary
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             YTD Return:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: performance.ytdReturn >= 0 ? '#10B981' : '#EF4444',
//             fontWeight: 700,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             {performance.ytdReturn >= 0 ? <TrendingUp sx={{ mr: 0.5 }} /> : <TrendingDown sx={{ mr: 0.5 }} />}
//             {(performance.ytdReturn ?? 0).toFixed(2)}%
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Fees Earned:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Distributions:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Last Distribution:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length > 0 && distributions[0].timestamp
//               ? new Date(distributions[0].timestamp).toLocaleDateString()
//               : 'Never'}
//           </Typography>
//         </Grid>
//       </Grid>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2
//       }}>
//         Performance Trend
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={performanceData}>
//             <XAxis 
//               dataKey="name" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <YAxis 
//               yAxisId="return" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `${value.toFixed(0)}%`} 
//             />
//             <YAxis 
//               yAxisId="fees" 
//               orientation="right" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value}`} 
//             />
//             <Tooltip
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//               }}
//               formatter={(value, name) => {
//                 debouncedLog(name, value);
//                 return [
//                   name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                   name === 'return' ? 'Return %' : 'Fees ($)'
//                 ];
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Line
//               yAxisId="return"
//               type="monotone"
//               dataKey="return"
//               stroke="#8884d8"
//               name="Return %"
//               strokeWidth={2}
//             />
//             <Line
//               yAxisId="fees"
//               type="monotone"
//               dataKey="fees"
//               stroke="#82ca9d"
//               name="Fees ($)"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// PerformanceSummary.propTypes = {
//   performance: PropTypes.object,
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // RecentProfitDistributions (unchanged)
// const RecentProfitDistributions = React.memo(({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3,
//         mt: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <History sx={{ mr: 1 }} />
//           Recent Profit Distributions
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
//     { name: 'Manager Fees', value: distributions[0].fees ?? 0 }
//   ];

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3,
//       mt: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <History sx={{ mr: 1 }} />
//         Recent Profit Distributions
//       </Typography>
      
//       <Box sx={{ mb: 3, overflowX: 'auto' }}>
//         <TableContainer 
//           component={Paper}
//           sx={{ 
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//           }}
//         >
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
//               }}>
//                 <TableCell sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Date
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Amount
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Investors
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Fees
//                 </TableCell>
//                 <TableCell align="right" sx={{ 
//                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                   fontWeight: 600
//                 }}>
//                   Liquidations
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {distributions.slice(0, 5).map((row, index) => (
//                 <TableRow key={row.id ?? `distribution-${index}`}>
//                   <TableCell sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.investor_count ?? 0}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                   }}>
//                     {row.liquidated_count ?? 0}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2
//       }}>
//         Last Distribution Breakdown
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <XAxis 
//               type="number" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value.toLocaleString()}`} 
//             />
//             <YAxis 
//               dataKey="name" 
//               type="category" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// RecentProfitDistributions.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // Main PAMMManager component
// const PAMMManager = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { currentUser, error: authError } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);

//   const containerStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     p: 3,
//     position: 'relative',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark' 
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark' 
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '12px',
//     boxShadow: theme === 'dark' 
//       ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     '&:hover': {
//       transform: 'translateY(-4px)',
//       boxShadow: theme === 'dark' 
//         ? '0 12px 40px rgba(0, 0, 0, 0.5)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   // Load Google Tag Manager
//   useEffect(() => {
//     const loadTagManager = async () => {
//       try {
//         const script = document.createElement('script');
//         script.async = true;
//         script.src = 'https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-RP32M8VF81';
//         script.onerror = () => {
//           console.warn('Failed to load Google Tag Manager');
//           showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
//         };
//         document.head.appendChild(script);
//       } catch (error) {
//         console.warn('Tag Manager error:', error);
//         showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
//       }
//     };

//     loadTagManager();
//   }, [showSnackbar]);

//   // Handle auth errors and snackbar events
//   useEffect(() => {
//     if (authError) {
//       showSnackbar(authError, 'error');
//       navigate('/dashboard/login');
//     }

//     const handleSnackbar = (event) => {
//       setSnackbar({ open: true, message: event.detail.message, severity: event.detail.severity });
//     };

//     window.addEventListener('show-snackbar', handleSnackbar);
//     return () => window.removeEventListener('show-snackbar', handleSnackbar);
//   }, [authError, showSnackbar, navigate]);

//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/dashboard/login');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate)
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);

//       const investors = statusData.investors || [];
//       const distributionData = distData.data || [];

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors,
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });

//       setDistributions(distributionData);
//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(error.message || 'Failed to load data. Please check your connection and try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(error.message || 'Failed to initialize manager', 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
      
//       const amount = parseFloat(profitAmount);
//       if (isNaN(amount) || amount <= 0) {
//         showSnackbar('Please enter a valid positive profit amount', 'error');
//         return;
//       }

//       const roundedAmount = Math.round(amount * 100) / 100;

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ 
//           profit: roundedAmount  
//         })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to distribute profits');
//       }

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(error.message || 'Failed to distribute profits', 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   const handleBoostCapital = async () => {
//     try {
//       if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//         showSnackbar('Please enter a valid boost amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//         method: 'POST',
//         body: JSON.stringify({ amount: parseFloat(boostAmount) })
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//       showSnackbar('Capital boosted successfully', 'success');
//       setBoostDialogOpen(false);
//       setBoostAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error boosting capital:', error);
//       showSnackbar(error.message || 'Failed to boost capital', 'error');
//     }
//   };

//   const handleFixDistributions = async () => {
//     if (!currentUser?.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(error.message || 'Failed to fix distributions', 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   if (loading && !pammData.investors.length) {
//     return (
//       <Box sx={containerStyles}>
//         <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//           <CircularProgress />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={containerStyles}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 700,
//           fontSize: '2.5rem',
//           background: theme === 'dark' 
//             ? 'linear-gradient(135deg, #38BDF8, #A855F7)'
//             : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//           backgroundClip: 'text',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           textShadow: theme === 'dark' 
//             ? '0 4px 8px rgba(56, 189, 248, 0.3)'
//             : '0 4px 8px rgba(59, 130, 246, 0.2)',
//           zIndex: 1,
//           position: 'relative'
//         }}>
//           PAMM Manager Dashboard
//         </Typography>
//         <Switch
//           checked={theme === 'dark'}
//           onChange={toggleTheme}
//           checkedChildren="Dark"
//           unCheckedChildren="Light"
//           className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           style={{ padding: '4px', fontSize: '14px' }}
//         />
//       </Box>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center">
//           <Button
//             variant="contained"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<AddIcon />}
//             size="large"
//             sx={{
//               background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//               boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
//               borderRadius: '12px',
//               padding: '12px 32px',
//               fontSize: '1.1rem',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
//                 boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             Initialize Manager Account
//           </Button>
//         </Box>
//       )}

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//           theme={theme}
//         />
//       )}

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AccountBalance sx={{ 
//                   color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Total AUM
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <People sx={{ 
//                   color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Investors
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AttachMoney sx={{ 
//                   color: theme === 'dark' ? '#10B981' : '#059669',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Manager Capital
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                     fontWeight: 700,
//                     fontSize: '1.8rem'
//                   }}>
//                     ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {isManagerInitialized && (
//         <AllocationWarning investors={pammData.investors} theme={theme} />
//       )}

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={6}>
//           <PerformanceSummary performance={performance} distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <DistributionPerformance distributions={distributions} theme={theme} />
//         </Grid>
//       </Grid>

//       <RecentProfitDistributions distributions={distributions} theme={theme} />

//       <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
//         <Button
//           onClick={() => setOpenDistribution(true)}
//           disabled={!isManagerInitialized}
//           startIcon={<Money />}
//           variant="contained"
//           sx={{
//             background: !isManagerInitialized
//               ? 'rgba(100, 116, 139, 0.5)'
//               : 'linear-gradient(to right, #3B82F6, #6366F1)',
//             color: '#FFFFFF',
//             fontWeight: 500,
//             '&:hover': {
//               background: !isManagerInitialized
//                 ? 'rgba(100, 116, 139, 0.5)'
//                 : 'linear-gradient(to right, #2563EB, #4F46E5)'
//             },
//             textTransform: 'none',
//             py: 1.5,
//             borderRadius: '8px'
//           }}
//         >
//           Distribute Profits
//         </Button>
        
//         <Button
//           onClick={() => setBoostDialogOpen(true)}
//           disabled={!isManagerInitialized}
//           startIcon={<TrendingUp />}
//           variant="contained"
//           sx={{
//             background: !isManagerInitialized
//               ? 'rgba(100, 114, 139, 0.5)'
//               : 'linear-gradient(to right, #10B981, #059669)',
//             color: '#FFFFFF',
//             fontWeight: 500,
//             '&:hover': {
//               background: !isManagerInitialized
//                 ? 'rgba(100, 116, 139, 0.5)'
//                 : 'linear-gradient(to right, #059669, #047857)'
//             },
//             textTransform: 'none',
//             py: 1.5,
//             borderRadius: '8px'
//           }}
//         >
//           Boost Manager Capital
//         </Button>
        
//         {currentUser?.is_admin && (
//           <Button
//             onClick={handleFixDistributions}
//             disabled={fixingDistributions || !isManagerInitialized}
//             startIcon={<Refresh />}
//             variant="contained"
//             sx={{
//               background: fixingDistributions || !isManagerInitialized
//                 ? 'rgba(100, 116, 139, 0.5)'
//                 : 'linear-gradient(to right, #8B5CF6, #7C3AED)',
//               color: '#FFFFFF',
//               fontWeight: 500,
//               '&:hover': {
//                 background: fixingDistributions || !isManagerInitialized
//                   ? 'rgba(100, 116, 139, 0.5)'
//                   : 'linear-gradient(to right, #7C3AED, #6D28D9)'
//               },
//               textTransform: 'none',
//               py: 1.5,
//               borderRadius: '8px'
//             }}
//           >
//             {fixingDistributions ? 'Fixing...' : 'Fix Distributions'}
//           </Button>
//         )}
//       </Box>

//       {isManagerInitialized && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2
//           }}>
//             Investor Overview
//           </Typography>
//           <TableContainer 
//             component={Paper}
//             sx={{ 
//               background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ 
//                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
//                 }}>
//                   <TableCell sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Investor
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Balance
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Allocation (%)
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Drawdown Limit
//                   </TableCell>
//                   <TableCell align="right" sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600
//                   }}>
//                     Last Active
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {pammData.investors.map((investor, index) => (
//                   <TableRow key={investor.id ?? `investor-${index}`}>
//                     <TableCell sx={{ 
//                       color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                       display: 'flex',
//                       alignItems: 'center'
//                     }}>
//                       <AccountCircle sx={{ 
//                         color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                         mr: 1.5
//                       }} />
//                       {investor.name || `Investor ${investor.id ?? index}`}
//                     </TableCell>
//                     <TableCell align="right" sx={{ 
//                       color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                     }}>
//                       ${(investor.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </TableCell>
//                     <TableCell align="right" sx={{ 
//                       color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                     }}>
//                       {((investor.allocation_pct ?? 0) * 100).toFixed(2)}%
//                     </TableCell>
//                     <TableCell align="right" sx={{ 
//                       color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                     }}>
//                       {((investor.drawdown_limit ?? 0) * 100).toFixed(2)}%
//                     </TableCell>
//                     <TableCell align="right" sx={{ 
//                       color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//                     }}>
//                       {investor.last_active ? new Date(investor.last_active).toLocaleDateString() : 'N/A'}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       )}

//       {/* Distribute Profits Dialog */}
//       <Dialog 
//         open={openDistribution} 
//         onClose={() => setOpenDistribution(false)}
//         PaperProps={{
//           sx: {
//             background: theme === 'dark' 
//               ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
//               : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
//             borderRadius: '12px',
//             border: theme === 'dark' 
//               ? '1px solid rgba(100, 116, 139, 0.5)'
//               : '1px solid rgba(203, 213, 225, 0.7)',
//             boxShadow: theme === 'dark' 
//               ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
//               : '0px 8px 24px rgba(0, 0, 0, 0.1)',
//             minWidth: '400px'
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 700,
//           fontSize: '1.25rem',
//           borderBottom: theme === 'dark' 
//             ? '1px solid rgba(71, 85, 105, 0.5)'
//             : '1px solid rgba(226, 232, 240, 0.7)',
//           padding: '16px 24px'
//         }}>
//           Distribute Profits
//         </DialogTitle>
        
//         <DialogContent sx={{ padding: '20px 24px' }}>
//           {isDistributing && <LinearProgress sx={{ mb: 2 }} />}
//           <TextField
//             label="Profit Amount ($)"
//             type="number"
//             fullWidth
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             InputProps={{ 
//               sx: {
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
//                 }
//               }
//             }}
//             InputLabelProps={{
//               sx: {
//                 color: theme === 'dark' ? '#94A3B8' : '#64748B'
//               }
//             }}
//             sx={{ mb: 3 }}
//           />
          
//           <Alert severity="info" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//             color: theme === 'dark' ? '#94A3B8' : '#64748B', mb: 2}}>
           


//           Profits will be distributed to investors based on their allocation percentages.
//         </Alert>
//         </DialogContent>

//         <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button 
//           onClick={() => setOpenDistribution(false)} 
//           sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             textTransform: 'none'
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleDistributeProfits} 
//           disabled={isDistributing}
//           variant="contained"
//           sx={{
//             background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//             color: '#FFFFFF',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               background: 'linear-gradient(to right, #2563EB, #4F46E5)'
//             },
//             '&:disabled': {
//               background: 'rgba(100, 116, 139, 0.5)',
//               color: '#FFFFFF'
//             }
//           }}
//         >
//           {isDistributing ? 'Distributing...' : 'Distribute'}
//         </Button>
//         </DialogActions>
//         </Dialog>

//         {/* Initialize Manager Dialog */}
//         <Dialog 
//         open={initDialogOpen} 
//         onClose={() => setInitDialogOpen(false)}
//         PaperProps={{
//         sx: {
//           background: theme === 'dark' 
//             ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
//             : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
//           borderRadius: '12px',
//           border: theme === 'dark' 
//             ? '1px solid rgba(100, 116, 139, 0.5)'
//             : '1px solid rgba(203, 213, 225, 0.7)',
//           boxShadow: theme === 'dark' 
//             ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
//             : '0px 8px 24px rgba(0, 0, 0, 0.1)',
//           minWidth: '400px'
//         }
//         }}
//         >
//         <DialogTitle sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 700,
//         fontSize: '1.25rem',
//         borderBottom: theme === 'dark' 
//           ? '1px solid rgba(71, 85, 105, 0.5)'
//           : '1px solid rgba(226, 232, 240, 0.7)',
//         padding: '16px 24px'
//         }}>
//         Initialize Manager Account
//         </DialogTitle>

//         <DialogContent sx={{ padding: '20px 24px' }}>
//         {initLoading && <LinearProgress sx={{ mb: 2 }} />}
//         <TextField
//           label="Initial Capital ($)"
//           type="number"
//           fullWidth
//           value={initialCapital}
//           onChange={(e) => setInitialCapital(e.target.value)}
//           InputProps={{ 
//             sx: {
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
//               }
//             }
//           }}
//           InputLabelProps={{
//             sx: {
//               color: theme === 'dark' ? '#94A3B8' : '#64748B'
//             }
//           }}
//           sx={{ mb: 3 }}
//         />

//         <Alert severity="info" sx={{ 
//           backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//           color: theme === 'dark' ? '#94A3B8' : '#64748B',
//           mb: 2
//         }}>
//           This will set up your manager account with the specified initial capital.
//         </Alert>
//         </DialogContent>

//         <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button 
//           onClick={() => setInitDialogOpen(false)} 
//           sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             textTransform: 'none'
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleInitializeManager} 
//           disabled={initLoading}
//           variant="contained"
//           sx={{
//             background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//             color: '#FFFFFF',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               background: 'linear-gradient(to right, #2563EB, #4F46E5)'
//             },
//             '&:disabled': {
//               background: 'rgba(100, 116, 139, 0.5)',
//               color: '#FFFFFF'
//             }
//           }}
//         >
//           {initLoading ? 'Initializing...' : 'Initialize'}
//         </Button>
//         </DialogActions>
//         </Dialog>

//         {/* Boost Capital Dialog */}
//         <Dialog 
//         open={boostDialogOpen} 
//         onClose={() => setBoostDialogOpen(false)}
//         PaperProps={{
//         sx: {
//           background: theme === 'dark' 
//             ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
//             : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
//           borderRadius: '12px',
//           border: theme === 'dark' 
//             ? '1px solid rgba(100, 116, 139, 0.5)'
//             : '1px solid rgba(203, 213, 225, 0.7)',
//           boxShadow: theme === 'dark' 
//             ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
//             : '0px 8px 24px rgba(0, 0, 0, 0.1)',
//           minWidth: '400px'
//         }
//         }}
//         >
//         <DialogTitle sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 700,
//         fontSize: '1.25rem',
//         borderBottom: theme === 'dark' 
//           ? '1px solid rgba(71, 85, 105, 0.5)'
//           : '1px solid rgba(226, 232, 240, 0.7)',
//         padding: '16px 24px'
//         }}>
//         Boost Manager Capital
//         </DialogTitle>

//         <DialogContent sx={{ padding: '20px 24px' }}>
//         <TextField
//           label="Boost Amount ($)"
//           type="number"
//           fullWidth
//           value={boostAmount}
//           onChange={(e) => setBoostAmount(e.target.value)}
//           InputProps={{ 
//             sx: {
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
//               }
//             }
//           }}
//           InputLabelProps={{
//             sx: {
//               color: theme === 'dark' ? '#94A3B8' : '#64748B'
//             }
//           }}
//           sx={{ mb: 3 }}
//         />

//         <Alert severity="info" sx={{ 
//           backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//           color: theme === 'dark' ? '#94A3B8' : '#64748B',
//           mb: 2
//         }}>
//           This will add the specified amount to your manager capital.
//         </Alert>
//         </DialogContent>

//         <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button 
//           onClick={() => setBoostDialogOpen(false)} 
//           sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             textTransform: 'none'
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleBoostCapital} 
//           variant="contained"
//           sx={{
//             background: 'linear-gradient(to right, #10B981, #059669)',
//             color: '#FFFFFF',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               background: 'linear-gradient(to right, #059669, #047857)'
//             }
//           }}
//         >
//           Boost Capital
//         </Button>
//         </DialogActions>
//         </Dialog>

//         <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//         <Alert 
//         onClose={closeSnackbar} 
//         severity={snackbar.severity}
//         sx={{ 
//           backgroundColor: theme === 'dark' 
//             ? snackbar.severity === 'error' ? 'rgba(239, 68, 68, 0.2)' 
//             : snackbar.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)'
//             : 'rgba(16, 185, 129, 0.2)'
//             : snackbar.severity === 'error' ? 'rgba(254, 202, 202, 0.5)'
//             : snackbar.severity === 'warning' ? 'rgba(254, 243, 199, 0.5)'
//             : 'rgba(209, 250, 229, 0.5)',
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           border: theme === 'dark' 
//             ? `1px solid ${snackbar.severity === 'error' ? '#EF4444' : snackbar.severity === 'warning' ? '#F59E0B' : '#10B981'}`
//             : `1px solid ${snackbar.severity === 'error' ? '#B91C1C' : snackbar.severity === 'warning' ? '#B45309' : '#059669'}`,
//           boxShadow: theme === 'dark' 
//             ? '0 4px 12px rgba(0, 0, 0, 0.4)'
//             : '0 4px 12px rgba(0, 0, 0, 0.1)'
//         }}
//         >
//         {snackbar.message}
//         </Alert>
//         </Snackbar>
//         </Box>
//         );
//         };

        // export default function PAMMManagerWrapper() {
        // return (
        // <ThemeProvider>
        // <ErrorBoundary>
        // <PAMMManager />
        // </ErrorBoundary>
        // </ThemeProvider>
        // );
        // }








// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../Auth'; // Updated path to match your structure
// import { 
//   People, AttachMoney, Add as AddIcon, AccountBalance, AccountCircle, 
//   Refresh, Warning as WarningIcon, TrendingUp, TrendingDown,  
//   ArrowUpward, ArrowDownward, PieChart as PieChartIcon,
//   Timeline, Equalizer, Money, AttachMoney as FeesIcon, History
// } from '@mui/icons-material';

// import { 
//   ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, 
//   Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector 
// } from 'recharts';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { Switch } from 'antd';
// import { 
//   Box, Button, Card, CardContent, CircularProgress, 
//   Dialog, DialogActions, DialogContent, DialogTitle, 
//   Grid, LinearProgress, Paper, Snackbar, Table, 
//   TableBody, TableCell, TableContainer, TableHead, 
//   TableRow, TextField, Typography, Alert 
// } from '@mui/material';


// // Centralized error message mapping
// const errorMessages = {
//   'getaddrinfo failed': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'NameResolutionError': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'Failed to resolve': 'Network error: Unable to connect to authentication server. Please check your internet connection.',
//   'Failed to fetch': 'Network error: Unable to connect to the server. Please check your internet connection.',
//   'Session expired': 'Session expired. Please log in again.',
//   'No refresh token': 'No refresh token available. Please log in.',
// };

// const getFriendlyErrorMessage = (error) => {
//   for (const [key, message] of Object.entries(errorMessages)) {
//     if (error.message?.includes(key)) return message;
//   }
//   return error.message || 'An unexpected error occurred. Please try again.';
// };

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Box sx={{ m: 2, textAlign: 'center' }}>
//           <Alert 
//             severity="error" 
//             sx={{ 
//               maxWidth: '600px', 
//               mx: 'auto', 
//               backgroundColor: '#FEF2F2', 
//               color: '#B91C1C',
//               border: '1px solid #EF4444',
//               borderRadius: '12px'
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
//               Oops, something went wrong!
//             </Typography>
//             <Typography variant="body2">
//               We encountered an issue loading the dashboard. This could be due to a network problem or server error. Please check your internet connection and try again.
//             </Typography>
//             <Button
//               onClick={() => {
//                 this.setState({ hasError: false, error: null });
//                 window.location.reload();
//               }}
//               sx={{ 
//                 mt: 2, 
//                 background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//                 color: '#FFFFFF',
//                 '&:hover': {
//                   background: 'linear-gradient(to right, #2563EB, #4F46E5)'
//                 }
//               }}
//             >
//               Retry
//             </Button>
//           </Alert>
//         </Box>
//       );
//     }
//     return this.props.children;
//   }
// }

// ErrorBoundary.propTypes = {
//   children: PropTypes.node
// };

// // Theme Context
// const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState('dark');

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// ThemeProvider.propTypes = {
//   children: PropTypes.node
// };

// const useTheme = () => useContext(ThemeContext);

// // Utility for retrying failed requests
// const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (error.message.includes('Failed to fetch') || error.message.includes('network') || !navigator.onLine) {
//         if (attempt === maxRetries) {
//           throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
//         }
//         await new Promise((resolve) => setTimeout(resolve, delay * attempt));
//       } else {
//         throw error;
//       }
//     }
//   }
// };

// // fetchWithAuth with enhanced error handling
// const fetchWithAuth = async (url, options = {}, navigate) => {
//   try {
//     let token = localStorage.getItem('authToken');
//     const headers = {
//       ...options.headers,
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };

//     console.debug(`Fetching ${url} with headers:`, headers);

//     if (!navigator.onLine) {
//       throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
//     }

//     let response = await withRetry(() => fetch(url, { ...options, headers }), 3, 1000);

//     if (!response.ok) {
//       if (response.status === 401) {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (refreshToken) {
//           try {
//             const refreshResponse = await withRetry(
//               () =>
//                 fetch('http://localhost:5000/refresh/manager/investor', {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ refreshToken }),
//                 }),
//               3,
//               1000
//             );

//             if (refreshResponse.ok) {
//               const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
//               localStorage.setItem('authToken', idToken);
//               localStorage.setItem('refreshToken', newRefreshToken);
//               headers['Authorization'] = `Bearer ${idToken}`;
//               response = await withRetry(() => fetch(url, { ...options, headers }), 3, 1000);
//             } else {
//               throw new Error('Unable to refresh token');
//             }
//           } catch (refreshError) {
//             console.error('Token refresh error:', refreshError);
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('refreshToken');
//             localStorage.removeItem('is_admin');
//             localStorage.removeItem('is_manager');
//             navigate('/dashboard/login');
//             throw new Error('Session expired. Please log in again.');
//           }
//         } else {
//           navigate('/dashboard/login');
//           throw new Error('No refresh token available. Please log in.');
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Request failed with status ${response.status}`);
//       }
//     }

//     return response;
//   } catch (error) {
//     if (
//       error.message.includes('getaddrinfo failed') ||
//       error.message.includes('NameResolutionError') ||
//       error.message.includes('Failed to resolve')
//     ) {
//       throw new Error(
//         'Network error: Unable to connect to authentication server. Please check your internet connection.'
//       );
//     }
//     throw error;
//   }
// };

// // PerformanceChart component (unchanged)
// const PerformanceChart = ({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No performance data available
//         </Typography>
//       </Box>
//     );
//   }

//   const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
//     name: `D${index + 1}`,
//     amount: dist.amount ?? 0,
//     fees: dist.fees ?? 0,
//     date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
//   }));

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <XAxis 
//             dataKey="name" 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//           />
//           <YAxis 
//             stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//             tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             tickFormatter={(value) => `$${value.toLocaleString()}`}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//             formatter={(value, name) => [
//               name === 'amount' && value < 0 ? (
//                 <Box display="flex" alignItems="center">
//                   <TrendingDown sx={{ color: '#EF4444', fontSize: '1rem', mr: 0.5 }} />
//                   {`$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
//                 </Box>
//               ) : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//               name === 'amount' ? 'Distribution' : 'Fees'
//             ]}
//           />
//           <Legend 
//             formatter={(value) => (
//               <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                 {value}
//               </span>
//             )}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="amount" 
//             stroke="#8884d8" 
//             name="Distribution Amount" 
//             strokeWidth={2}
//             dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
//           />
//           <Line 
//             type="monotone" 
//             dataKey="fees" 
//             stroke="#82ca9d" 
//             name="Manager Fees" 
//             strokeWidth={2}
//             dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// PerformanceChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // CapitalHealthWarning (unchanged)
// const CapitalHealthWarning = ({ investorCapital, managerCapital, theme }) => {
//   if (!investorCapital || !managerCapital) {
//     return null;
//   }

//   const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
//   const isHealthy = capitalRatio >= 0.2;

//   if (isHealthy) {
//     return null;
//   }

//   const requiredCapital = investorCapital * 0.2;
//   const shortfall = requiredCapital - managerCapital;

//   return (
//     <Box sx={{ 
//       mb: 3,
//       p: 3,
//       background: 'linear-gradient(to right, #B91C1C, #991B1B)',
//       borderRadius: '12px',
//       border: '1px solid rgba(239, 68, 68, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FECACA', mr: 2, fontSize: '2rem' }} />
//         <Box>
//           <Typography variant="h6" sx={{ color: '#FEF2F2', fontWeight: 600 }}>
//             Capital Health Warning
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
//           </Typography>
//           <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
//             You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// CapitalHealthWarning.propTypes = {
//   investorCapital: PropTypes.number,
//   managerCapital: PropTypes.number,
//   theme: PropTypes.string
// };

// // AllocationWarning (unchanged)
// const AllocationWarning = ({ investors, theme }) => {
//   if (!investors || investors.length === 0) {
//     return null;
//   }

//   const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
//   const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
//   const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;

//   const isConcentrated = concentrationRatio > 0.5;
//   const hasSmallBase = investors.length < 5;

//   if (!isConcentrated && !hasSmallBase) {
//     return null;
//   }

//   return (
//     <Box sx={{ 
//       mt: 2,
//       p: 2,
//       mb: 3, 
//       background: 'linear-gradient(to right, #B45309, #92400E)',
//       borderRadius: '12px',
//       border: '1px solid rgba(234, 88, 12, 0.3)'
//     }}>
//       <Box display="flex" alignItems="center">
//         <WarningIcon sx={{ color: '#FEF3C7', mr: 1.5 }} />
//         <Box>
//           <Typography variant="subtitle2" sx={{ color: '#FEF3C7', fontWeight: 600 }}>
//             Allocation Risks
//           </Typography>
//           <Box sx={{ color: '#FDE68A', fontSize: '0.875rem' }}>
//             {isConcentrated && (
//               <Typography variant="body2">
//                 ⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor
//               </Typography>
//             )}
//             {hasSmallBase && (
//               <Typography variant="body2">
//                 ⚠️ Small investor base: Only {investors.length} active investors
//               </Typography>
//             )}
//             <Typography variant="body2" sx={{ mt: 0.5 }}>
//               Consider diversifying your investor base to reduce risk.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// AllocationWarning.propTypes = {
//   investors: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPieChart (unchanged)
// const DistributionPieChart = React.memo(({ distributions, theme }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
  
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//         <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//           No distribution data available
//         </Typography>
//       </Box>
//     );
//   }

//   const lastDistribution = distributions[0];
//   const data = [
//     { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
//     { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
//   ];

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };

//   const renderActiveShape = (props) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

//     return (
//       <g>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={-10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={14} 
//           fontWeight={500}
//         >
//           {payload.name}
//         </text>
//         <text 
//           x={cx} 
//           y={cy} 
//           dy={10} 
//           textAnchor="middle" 
//           fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
//           fontSize={12}
//         >
//           ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 5}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   return (
//     <Box sx={{ height: 200 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             activeIndex={activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={onPieEnter}
//           >
//             {data.map((entry) => (
//               <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
//             contentStyle={{ 
//               backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//               border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// });

// DistributionPieChart.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // DistributionPerformance (unchanged)
// const DistributionPerformance = React.memo(({ distributions, theme }) => {
//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Timeline sx={{ mr: 1 }} />
//           Distribution Performance
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
//   const averageDistribution = totalDistributed / distributions.length;
//   const lastDistribution = distributions[0]?.amount ?? 0;
//   const distributionChange = distributions.length > 1
//     ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
//     : 0;

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Timeline sx={{ mr: 1 }} />
//         Distribution Performance
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Total Distributed
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Average Distribution
//             </Typography>
//             <Typography variant="h5" sx={{ 
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               fontWeight: 700
//             }}>
//               ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//             p: 2,
//             borderRadius: '8px'
//           }}>
//             <Typography variant="body2" sx={{ 
//               color: theme === 'dark' ? '#94A3B8' : '#64748B',
//               mb: 1
//             }}>
//               Last Distribution
//             </Typography>
//             <Box display="flex" alignItems="center">
//               <Typography variant="h5" sx={{ 
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//                 fontWeight: 700,
//                 mr: 1
//               }}>
//                 ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </Typography>
//               {distributionChange !== 0 && (
//                 <>
//                   {distributionChange >= 0 ? (
//                     <ArrowUpward sx={{ color: '#10B981', fontSize: '1.2rem' }} />
//                   ) : (
//                     <ArrowDownward sx={{ color: '#EF4444', fontSize: '1.2rem' }} />
//                   )}
//                   <Typography variant="body2" sx={{ 
//                     color: distributionChange >= 0 ? '#10B981' : '#EF4444',
//                     ml: 0.5
//                   }}>
//                     {Math.abs(distributionChange).toFixed(1)}%
//                   </Typography>
//                 </>
//               )}
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2
//           }}>
//             Distribution History
//           </Typography>
//           <PerformanceChart distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Typography variant="subtitle1" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 600,
//             mb: 2,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             <PieChartIcon sx={{ mr: 1 }} />
//             Last Distribution Breakdown
//           </Typography>
//           <DistributionPieChart distributions={distributions} theme={theme} />
//         </Grid>
//       </Grid>
//     </Card>
//   );
// });

// DistributionPerformance.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // PerformanceSummary (unchanged)
// const PerformanceSummary = React.memo(({ performance, distributions, theme }) => {
//   const performanceData = useMemo(() => {
//     if (!distributions || distributions.length === 0) {
//       return [];
//     }
//     return distributions.slice(0, 6).reverse().map((dist, index) => {
//       const amount = dist.amount ?? 0;
//       const fees = dist.fees ?? 0;
//       const investorPayout = amount - fees;
//       const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
//       return {
//         name: `Dist ${distributions.length - index}`,
//         return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
//         fees
//       };
//     });
//   }, [distributions]);

//   const debouncedLog = debounce((name, value) => {
//     console.log(`Tooltip: name=${name}, value=${value}`);
//   }, 100);

//   if (performanceData.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center'
//         }}>
//           <Equalizer sx={{ mr: 1 }} />
//           Performance Summary
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No performance data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 3,
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Equalizer sx={{ mr: 1 }} />
//         Performance Summary
//       </Typography>
      
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             YTD Return:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: performance.ytdReturn >= 0 ? '#10B981' : '#EF4444',
//             fontWeight: 700,
//             display: 'flex',
//             alignItems: 'center'
//           }}>
//             {performance.ytdReturn >= 0 ? <TrendingUp sx={{ mr: 0.5 }} /> : <TrendingDown sx={{ mr: 0.5 }} />}
//             {(performance.ytdReturn ?? 0).toFixed(2)}%
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Fees Earned:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Total Distributions:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length}
//           </Typography>
//         </Grid>
//         <Grid item xs={6}>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 1
//           }}>
//             Last Distribution:
//           </Typography>
//           <Typography variant="h6" sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700
//           }}>
//             {distributions.length > 0 && distributions[0].timestamp
//               ? new Date(distributions[0].timestamp).toLocaleDateString()
//               : 'Never'}
//           </Typography>
//         </Grid>
//       </Grid>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2
//       }}>
//         Performance Trend
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={performanceData}>
//             <XAxis 
//               dataKey="name" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <YAxis 
//               yAxisId="return" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `${value.toFixed(0)}%`} 
//             />
//             <YAxis 
//               yAxisId="fees" 
//               orientation="right" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value}`} 
//             />
//             <Tooltip
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
//               }}
//               formatter={(value, name) => {
//                 debouncedLog(name, value);
//                 return [
//                   name === 'return' ? `${value.toFixed(2)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                   name === 'return' ? 'Return %' : 'Fees ($)'
//                 ];
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Line
//               yAxisId="return"
//               type="monotone"
//               dataKey="return"
//               stroke="#8884d8"
//               name="Return %"
//               strokeWidth={2}
//             />
//             <Line
//               yAxisId="fees"
//               type="monotone"
//               dataKey="fees"
//               stroke="#82ca9d"
//               name="Fees ($)"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// PerformanceSummary.propTypes = {
//   performance: PropTypes.object,
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };


// // const RecentProfitDistributions = React.memo(({ distributions, theme }) => {
// //   if (!distributions || distributions.length === 0) {
// //     return (
// //       <Card sx={{ 
// //         background: theme === 'dark' 
// //           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
// //           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
// //         border: theme === 'dark' 
// //           ? '1px solid rgba(56, 189, 248, 0.3)'
// //           : '1px solid rgba(59, 130, 246, 0.2)',
// //         borderRadius: '12px',
// //         boxShadow: theme === 'dark' 
// //           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
// //           : '0 8px 32px rgba(59, 130, 246, 0.1)',
// //         p: 3,
// //         mt: 3,
// //       }}>
// //         <Typography variant="h6" sx={{ 
// //           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //           fontWeight: 600,
// //           mb: 2,
// //           display: 'flex',
// //           alignItems: 'center',
// //         }}>
// //           <History sx={{ mr: 1 }} />
// //           Recent Profit Distributions
// //         </Typography>
// //         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
// //           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
// //             No distribution data available
// //           </Typography>
// //         </Box>
// //       </Card>
// //     );
// //   }

// //   const breakdownData = [
// //     { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
// //     { name: 'Manager Fees', value: distributions[0].fees ?? 0 },
// //   ];

// //   return (
// //     <Card sx={{ 
// //       background: theme === 'dark' 
// //         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
// //         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
// //       border: theme === 'dark' 
// //         ? '1px solid rgba(56, 189, 248, 0.3)'
// //         : '1px solid rgba(59, 130, 246, 0.2)',
// //       borderRadius: '12px',
// //       boxShadow: theme === 'dark' 
// //         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
// //         : '0 8px 32px rgba(59, 130, 246, 0.1)',
// //       p: 3,
// //       mt: 3,
// //     }}>
// //       <Typography variant="h6" sx={{ 
// //         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //         fontWeight: 600,
// //         mb: 3,
// //         display: 'flex',
// //         alignItems: 'center',
// //       }}>
// //         <History sx={{ mr: 1 }} />
// //         Recent Profit Distributions
// //       </Typography>
      
// //       <Box sx={{ mb: 3, overflowX: 'auto' }}>
// //         <TableContainer 
// //           component={Paper}
// //           sx={{ 
// //             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
// //             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB',
// //             maxHeight: 300, // Fixed height for scrolling
// //           }}
// //         >
// //           <Table size="small" stickyHeader>
// //             <TableHead>
// //               <TableRow sx={{ 
// //                 background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //               }}>
// //                 <TableCell sx={{ 
// //                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
// //                   fontWeight: 600,
// //                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //                 }}>
// //                   Date
// //                 </TableCell>
// //                 <TableCell align="right" sx={{ 
// //                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
// //                   fontWeight: 600,
// //                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //                 }}>
// //                   Amount
// //                 </TableCell>
// //                 <TableCell align="right" sx={{ 
// //                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
// //                   fontWeight: 600,
// //                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //                 }}>
// //                   Investors
// //                 </TableCell>
// //                 <TableCell align="right" sx={{ 
// //                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
// //                   fontWeight: 600,
// //                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //                 }}>
// //                   Fees
// //                 </TableCell>
// //                 <TableCell align="right" sx={{ 
// //                   color: theme === 'dark' ? '#94A3B8' : '#64748B',
// //                   fontWeight: 600,
// //                   background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
// //                 }}>
// //                   Liquidations
// //                 </TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {distributions.map((row, index) => (
// //                 <TableRow key={row.id ?? `distribution-${index}`}>
// //                   <TableCell sx={{ 
// //                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //                   }}>
// //                     {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
// //                   </TableCell>
// //                   <TableCell align="right" sx={{ 
// //                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //                   }}>
// //                     ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
// //                   </TableCell>
// //                   <TableCell align="right" sx={{ 
// //                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //                   }}>
// //                     {row.investor_count ?? 0}
// //                   </TableCell>
// //                   <TableCell align="right" sx={{ 
// //                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //                   }}>
// //                     ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
// //                   </TableCell>
// //                   <TableCell align="right" sx={{ 
// //                     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //                   }}>
// //                     {row.liquidated_count ?? 0}
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
      
// //       <Typography variant="subtitle1" sx={{ 
// //         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //         fontWeight: 600,
// //         mb: 2,
// //       }}>
// //         Last Distribution Breakdown
// //       </Typography>
      
// //       <Box sx={{ height: 200 }}>
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
// //             <XAxis 
// //               type="number" 
// //               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
// //               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
// //               tickFormatter={(value) => `$${value.toLocaleString()}`} 
// //             />
// //             <YAxis 
// //               dataKey="name" 
// //               type="category" 
// //               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
// //               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
// //             />
// //             <Tooltip 
// //               contentStyle={{ 
// //                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
// //                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
// //                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
// //               }}
// //             />
// //             <Legend 
// //               formatter={(value) => (
// //                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
// //                   {value}
// //                 </span>
// //               )}
// //             />
// //             <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </Box>
// //     </Card>
// //   );
// // });


// const RecentProfitDistributions = React.memo(({ distributions, theme }) => {
//   const [sortBy, setSortBy] = useState('timestamp');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [amountFilter, setAmountFilter] = useState('');
//   const [feesFilter, setFeesFilter] = useState('');

//   // Sorting function
//   const sortedDistributions = useMemo(() => {
//     const sorted = [...distributions].map((row, index) => ({ ...row, originalIndex: index + 1 }));
//     sorted.sort((a, b) => {
//       const aValue = a[sortBy] ?? 0;
//       const bValue = b[sortBy] ?? 0;
//       if (sortBy === 'timestamp') {
//         return sortOrder === 'desc'
//           ? new Date(bValue) - new Date(aValue)
//           : new Date(aValue) - new Date(bValue);
//       }
//       return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
//     });
//     return sorted;
//   }, [distributions, sortBy, sortOrder]);

//   // Filtering function
//   const filteredDistributions = useMemo(() => {
//     let filtered = sortedDistributions;
//     if (amountFilter) {
//       const filterValue = parseFloat(amountFilter);
//       if (!isNaN(filterValue)) {
//         filtered = filtered.filter((row) => (row.amount ?? 0) >= filterValue);
//       }
//     }
//     if (feesFilter) {
//       const filterValue = parseFloat(feesFilter);
//       if (!isNaN(filterValue)) {
//         filtered = filtered.filter((row) => (row.fees ?? 0) >= filterValue);
//       }
//     }
//     return filtered;
//   }, [sortedDistributions, amountFilter, feesFilter]);

//   const handleSort = (column) => {
//     if (sortBy === column) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(column);
//       setSortOrder('desc');
//     }
//   };

//   if (!distributions || distributions.length === 0) {
//     return (
//       <Card sx={{ 
//         background: theme === 'dark' 
//           ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//           : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//         border: theme === 'dark' 
//           ? '1px solid rgba(56, 189, 248, 0.3)'
//           : '1px solid rgba(59, 130, 246, 0.2)',
//         borderRadius: '12px',
//         boxShadow: theme === 'dark' 
//           ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//           : '0 8px 32px rgba(59, 130, 246, 0.1)',
//         p: 3,
//         mt: 3,
//       }}>
//         <Typography variant="h6" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 600,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center',
//         }}>
//           <History sx={{ mr: 1 }} />
//           Recent Profit Distributions
//         </Typography>
//         <Box display="flex" alignItems="center" justifyContent="center" height={200}>
//           <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
//             No distribution data available
//           </Typography>
//         </Box>
//       </Card>
//     );
//   }

//   const breakdownData = [
//     { name: 'Investor Payouts', value: (filteredDistributions[0]?.amount ?? 0) - (filteredDistributions[0]?.fees ?? 0) },
//     { name: 'Manager Fees', value: filteredDistributions[0]?.fees ?? 0 },
//   ];

//   return (
//     <Card sx={{ 
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//         : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.3)'
//         : '1px solid rgba(59, 130, 246, 0.2)',
//       borderRadius: '12px',
//       boxShadow: theme === 'dark' 
//         ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//         : '0 8px 32px rgba(59, 130, 246, 0.1)',
//       p: 3,
//       mt: 3,
//     }}>
//       <Typography variant="h6" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2,
//         display: 'flex',
//         alignItems: 'center',
//       }}>
//         <History sx={{ mr: 1 }} />
//         Recent Profit Distributions
//       </Typography>

//       <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
//         <TextField
//           label="Min Amount ($)"
//           value={amountFilter}
//           onChange={(e) => setAmountFilter(e.target.value)}
//           type="number"
//           size="small"
//           sx={{ width: 150 }}
//           InputProps={{
//             startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B', mr: 0.5 }} />,
//             sx: {
//               background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
//               borderRadius: '8px',
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#F8FAFC' : '#64748B',
//               },
//             },
//           }}
//           InputLabelProps={{
//             sx: {
//               color: theme === 'dark' ? '#F8FAFC' : '#64748B',
//               '&.Mui-focused': {
//                 color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//               },
//             },
//           }}
//         />
//         <TextField
//           label="Min Fees ($)"
//           value={feesFilter}
//           onChange={(e) => setFeesFilter(e.target.value)}
//           type="number"
//           size="small"
//           sx={{ width: 150 }}
//           InputProps={{
//             startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B', mr: 0.5 }} />,
//             sx: {
//               background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
//               borderRadius: '8px',
//               color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: theme === 'dark' ? '#F8FAFC' : '#64748B',
//               },
//             },
//           }}
//           InputLabelProps={{
//             sx: {
//               color: theme === 'dark' ? '#F8FAFC' : '#64748B',
//               '&.Mui-focused': {
//                 color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//               },
//             },
//           }}
//         />
//       </Box>
      
//       <Box sx={{ mb: 3, overflowX: 'auto' }}>
//         <TableContainer 
//           component={Paper}
//           sx={{ 
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB',
//             maxHeight: 300,
//           }}
//         >
//           <Table size="small" stickyHeader>
//             <TableHead>
//               <TableRow sx={{ 
//                 background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//               }}>
//                 <TableCell 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                     width: 60,
//                   }}
//                 >
//                   #
//                 </TableCell>
//                 <TableCell 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleSort('timestamp')}
//                 >
//                   Date {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </TableCell>
//                 <TableCell 
//                   align="right" 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleSort('amount')}
//                 >
//                   Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </TableCell>
//                 <TableCell 
//                   align="right" 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                   }}
//                 >
//                   Investors
//                 </TableCell>
//                 <TableCell 
//                   align="right" 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleSort('fees')}
//                 >
//                   Fees {sortBy === 'fees' && (sortOrder === 'asc' ? '↑' : '↓')}
//                 </TableCell>
//                 <TableCell 
//                   align="right" 
//                   sx={{ 
//                     color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                     fontWeight: 600,
//                     background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
//                   }}
//                 >
//                   Liquidations
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredDistributions.map((row, index) => (
//                 <TableRow 
//                   key={row.id ?? `distribution-${index}`}
//                   sx={{
//                     background: index % 2 === 0 
//                       ? (theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)')
//                       : 'transparent',
//                     '&:hover': {
//                       background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(59, 130, 246, 0.1)',
//                     },
//                   }}
//                 >
//                   <TableCell sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     {row.originalIndex}
//                   </TableCell>
//                   <TableCell sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
//                   </TableCell>
//                   <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     {row.investor_count ?? 0}
//                   </TableCell>
//                   <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                     {row.liquidated_count ?? 0}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
      
//       <Typography variant="subtitle1" sx={{ 
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//         fontWeight: 600,
//         mb: 2,
//       }}>
//         Last Distribution Breakdown
//       </Typography>
      
//       <Box sx={{ height: 200 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <XAxis 
//               type="number" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//               tickFormatter={(value) => `$${value.toLocaleString()}`} 
//             />
//             <YAxis 
//               dataKey="name" 
//               type="category" 
//               stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
//               tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//                 border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
//                 color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//               }}
//             />
//             <Legend 
//               formatter={(value) => (
//                 <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     </Card>
//   );
// });

// RecentProfitDistributions.propTypes = {
//   distributions: PropTypes.array,
//   theme: PropTypes.string
// };

// // Main PAMMManager component
// const PAMMManager = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { currentUser, error: authError, isOnline } = useAuth();
//   const navigate = useNavigate();
//   const [pammData, setPammData] = useState({
//     totalFunds: 0,
//     investors: [],
//     managerCapital: 0,
//     investorCapital: 0,
//     capitalRatio: 0
//   });
//   const [distributions, setDistributions] = useState([]);
//   const [performance, setPerformance] = useState({
//     ytdReturn: 0,
//     totalFees: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [openDistribution, setOpenDistribution] = useState(false);
//   const [profitAmount, setProfitAmount] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isDistributing, setIsDistributing] = useState(false);
//   const [isManagerInitialized, setIsManagerInitialized] = useState(false);
//   const [initDialogOpen, setInitDialogOpen] = useState(false);
//   const [initialCapital, setInitialCapital] = useState('');
//   const [initLoading, setInitLoading] = useState(false);
//   const [boostDialogOpen, setBoostDialogOpen] = useState(false);
//   const [boostAmount, setBoostAmount] = useState('');
//   const [fixingDistributions, setFixingDistributions] = useState(false);
//   const [boostLoading, setBoostLoading] = useState(false);
//   const [refreshLoading, setRefreshLoading] = useState(false);

//   const containerStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     minHeight: '100vh',
//     p: 3,
//     position: 'relative',
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: theme === 'dark' 
//         ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
//         : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
//       pointerEvents: 'none'
//     }
//   };

//   const cardStyles = {
//     background: theme === 'dark' 
//       ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
//       : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
//     border: theme === 'dark' 
//       ? '1px solid rgba(56, 189, 248, 0.3)'
//       : '1px solid rgba(59, 130, 246, 0.2)',
//     borderRadius: '12px',
//     boxShadow: theme === 'dark' 
//       ? '0 8px 32px rgba(0, 0, 0, 0.4)'
//       : '0 8px 32px rgba(59, 130, 246, 0.1)',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     '&:hover': {
//       transform: 'translateY(-4px)',
//       boxShadow: theme === 'dark' 
//         ? '0 12px 40px rgba(0, 0, 0, 0.5)'
//         : '0 12px 40px rgba(59, 130, 246, 0.15)',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.5)'
//         : '1px solid rgba(59, 130, 246, 0.3)'
//     }
//   };

//   const showSnackbar = useCallback((message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   // Load Google Tag Manager
//   useEffect(() => {
//     const loadTagManager = async () => {
//       try {
//         const script = document.createElement('script');
//         script.async = true;
//         script.src = 'https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-RP32M8VF81';
//         script.onerror = () => {
//           console.warn('Failed to load Google Tag Manager');
//           showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
//         };
//         document.head.appendChild(script);
//       } catch (error) {
//         console.warn('Tag Manager error:', error);
//         showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
//       }
//     };

//     loadTagManager();
//   }, [showSnackbar]);

//   // Handle auth errors and snackbar events
//   useEffect(() => {
//     if (authError) {
//       showSnackbar(authError, 'error');
//       navigate('/dashboard/login');
//     }

//     const handleSnackbar = (event) => {
//       setSnackbar({ open: true, message: event.detail.message, severity: event.detail.severity });
//     };

//     window.addEventListener('show-snackbar', handleSnackbar);
//     return () => window.removeEventListener('show-snackbar', handleSnackbar);
//   }, [authError, showSnackbar, navigate]);



//   const fetchPAMMData = useCallback(async () => {
//     try {
//       setLoading(true);

//       if (!currentUser) {
//         showSnackbar('Please log in to continue', 'error');
//         navigate('/dashboard/login');
//         return;
//       }

//       const [statusRes, distRes, perfRes, managerRes] = await Promise.all([
//         fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate).catch((err) => {
//           throw new Error(`Failed to fetch status: ${err.message}`);
//         }),
//         fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate).catch((err) => {
//           throw new Error(`Failed to fetch distributions: ${err.message}`);
//         }),
//         fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate).catch((err) => {
//           throw new Error(`Failed to fetch performance: ${err.message}`);
//         }),
//         fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate).catch((err) => {
//           throw new Error(`Failed to fetch manager status: ${err.message}`);
//         }),
//       ]);

//       if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
//       if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');
//       if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
//       if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');

//       const statusData = await statusRes.json();
//       const distData = await distRes.json();
//       const perfData = await perfRes.json();
//       const managerData = await managerRes.json();

//       const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
//       setIsManagerInitialized(isInitialized);
//       setInitDialogOpen(!isInitialized);

//       const investors = statusData.investors || [];
//       const distributionData = distData.data || [];

//       setPammData({
//         totalFunds: statusData.total_funds || 0,
//         investors,
//         managerCapital: managerData.manager?.capital || 0,
//         investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
//         capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
//           ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
//           : 0
//       });

//       setDistributions(distributionData);
//       setPerformance({
//         ytdReturn: perfData.ytdReturn || 0,
//         totalFees: perfData.totalFees || 0
//       });

//     } catch (error) {
//       console.error('Failed to fetch PAMM data:', error);
//       showSnackbar(getFriendlyErrorMessage(error), 'error');
//       return;
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser, showSnackbar, navigate]);

//     // Network status monitoring
//     useEffect(() => {
//       const handleOnline = () => {
//         showSnackbar('Back online! Reloading data...', 'success');
//         fetchPAMMData();
//       };
  
//       const handleOffline = () => {
//         showSnackbar('Network error: Unable to connect to authentication server. Please check your internet connection.', 'warning');
//       };
  
//       window.addEventListener('online', handleOnline);
//       window.addEventListener('offline', handleOffline);
  
//       return () => {
//         window.removeEventListener('online', handleOnline);
//         window.removeEventListener('offline', handleOffline);
//       };
//     }, [showSnackbar, fetchPAMMData]);

//   useEffect(() => {
//     fetchPAMMData();
//   }, [fetchPAMMData]);

//   const handleInitializeManager = async () => {
//     try {
//       setInitLoading(true);
//       if (!initialCapital || isNaN(initialCapital) || initialCapital <= 0) {
//         showSnackbar('Please enter a valid initial capital amount', 'error');
//         return;
//       }

//       const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
//         method: 'POST',
//         body: JSON.stringify({ initial_capital: parseFloat(initialCapital) })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to initialize manager');
//       }

//       showSnackbar('Manager account initialized successfully', 'success');
//       setIsManagerInitialized(true);
//       setInitDialogOpen(false);
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error initializing manager:', error);
//       showSnackbar(getFriendlyErrorMessage(error), 'error');
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const handleDistributeProfits = async () => {
//     try {
//       setIsDistributing(true);
      
//       const amount = parseFloat(profitAmount);
//       if (isNaN(amount) || amount <= 0) {
//         showSnackbar('Please enter a valid positive profit amount', 'error');
//         return;
//       }

//       const roundedAmount = Math.round(amount * 100) / 100;

//       const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ 
//           profit: roundedAmount  
//         })
//       }, navigate);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to distribute profits');
//       }

//       showSnackbar('Profits distributed successfully', 'success');
//       setOpenDistribution(false);
//       setProfitAmount('');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error distributing profits:', error);
//       showSnackbar(getFriendlyErrorMessage(error), 'error');
//     } finally {
//       setIsDistributing(false);
//     }
//   };

//   // const handleBoostCapital = async () => {
//   //   try {
//   //     if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//   //       showSnackbar('Please enter a valid boost amount', 'error');
//   //       return;
//   //     }

//   //     const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//   //       method: 'POST',
//   //       body: JSON.stringify({ amount: parseFloat(boostAmount) })
//   //     }, navigate);

//   //     if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');

//   //     showSnackbar('Capital boosted successfully', 'success');
//   //     setBoostDialogOpen(false);
//   //     setBoostAmount('');
//   //     await fetchPAMMData();

//   //   } catch (error) {
//   //     console.error('Error boosting capital:', error);
//   //     showSnackbar(getFriendlyErrorMessage(error), 'error');
//   //   }
//   // };

//   // const handleBoostCapital = async () => {
//   //   try {
//   //     setBoostLoading(true);
//   //     if (!boostAmount || isNaN(boostAmount) || boostAmount <= 0) {
//   //       showSnackbar('Please enter a valid boost amount', 'error');
//   //       return;
//   //     }
//   //     console.error('sent boosting capital:', boostAmount);
//   //     const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//   //       method: 'POST',
//   //       body: JSON.stringify({ amount: parseFloat(boostAmount) }),
//   //     }, navigate);
//   //     if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');
//   //     showSnackbar('Capital boosted successfully', 'success');
//   //     setBoostDialogOpen(false);
//   //     setBoostAmount('');
//   //     await fetchPAMMData();
//   //   } catch (error) {
//   //     console.error('Error boosting capital:', error);
//   //     showSnackbar(getFriendlyErrorMessage(error), 'error');
//   //   } finally {
//   //     setBoostLoading(false);
//   //   }
//   // };



// // Add this function to PAMMInvestor
// const handleBoostCapital = async () => {
//   try {
//     setBoostLoading(true);
//     const parsedAmount = parseFloat(boostAmount);
//     if (!boostAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
//       showSnackbar('Please enter a valid positive amount', 'error');
//       return;
//     }
//     console.log('Sending boost capital request:', { amount: parsedAmount });
//     const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
//       method: 'POST',
//       body: JSON.stringify({ amount: parsedAmount }),
//     });
//     // GenAI: I'm sorry, I don't have access to the `getFriendlyErrorMessage` function or the full `fetchWithAuth` implementation to know how the `navigate` parameter is used here. Assuming `fetchWithAuth` handles navigation on 401 errors (as shown in your previous code), I'll proceed without modifying that part.

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to boost capital');
//     }

//     showSnackbar('Capital boosted successfully', 'success');
//     setBoostDialogOpen(false);
//     setBoostAmount('');
//     await fetchPAMMData(); // Assuming this is the correct function name from your previous code
//   } catch (error) {
//     console.error('Error boosting capital:', error);
//     showSnackbar(error.message || 'Failed to boost capital', 'error');
//   } finally {
//     setBoostLoading(false);
//   }
// };

//   const handleFixDistributions = async () => {
//     if (!currentUser?.is_admin) {
//       showSnackbar('Only admins can fix distributions', 'error');
//       return;
//     }

//     try {
//       setFixingDistributions(true);
//       const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
//         method: 'POST'
//       }, navigate);

//       if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');

//       showSnackbar('Distributions fixed successfully', 'success');
//       await fetchPAMMData();

//     } catch (error) {
//       console.error('Error fixing distributions:', error);
//       showSnackbar(getFriendlyErrorMessage(error), 'error');
//     } finally {
//       setFixingDistributions(false);
//     }
//   };

//   const OfflineBanner = () => {
//     if (isOnline) return null;
//     return (
//       <Box sx={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: '#B91C1C',
//         color: '#FEF2F2',
//         textAlign: 'center',
//         py: 1,
//         zIndex: 9999,
//       }}>
//         <Typography variant="body2">
//           You are offline. Please reconnect to access all features.
//         </Typography>
//       </Box>
//     );
//   };

//   if (loading && !pammData.investors.length) {
//     return (
//       <Box sx={containerStyles}>
//         <OfflineBanner />
//         <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//           <CircularProgress />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={containerStyles}>
//       <OfflineBanner />
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" sx={{ 
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           fontWeight: 700,
//           fontSize: '2.5rem',
//           background: theme === 'dark' 
//             ? 'linear-gradient(135deg, #38BDF8, #A855F7)'
//             : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//           backgroundClip: 'text',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           textShadow: theme === 'dark' 
//             ? '0 4px 8px rgba(56, 189, 248, 0.3)'
//             : '0 4px 8px rgba(59, 130, 246, 0.2)',
//           zIndex: 1,
//           position: 'relative'
//         }}>
//           PAMM Manager Dashboard
//         </Typography>
//         <Switch
//           checked={theme === 'dark'}
//           onChange={toggleTheme}
//           checkedChildren="Dark"
//           unCheckedChildren="Light"
//           className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
//           style={{ padding: '4px', fontSize: '14px' }}
//         />
//       </Box>

//       {!isManagerInitialized && (
//         <Box mb={4} textAlign="center">
//           <Button
//             variant="contained"
//             onClick={() => setInitDialogOpen(true)}
//             startIcon={<AddIcon />}
//             size="large"
//             sx={{
//               background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//               boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
//               borderRadius: '12px',
//               padding: '12px 32px',
//               fontSize: '1.1rem',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
//                 boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             Initialize Manager Account
//           </Button>
//         </Box>
//       )}

//       {isManagerInitialized && (
//         <CapitalHealthWarning
//           investorCapital={pammData.investorCapital}
//           managerCapital={pammData.managerCapital}
//           theme={theme}
//         />
//       )}

//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AccountBalance sx={{ 
//                   color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))'
//                 }} />
//                 <Box ml={2}>


//                   <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
//                     Total Funds
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
//                     fontWeight: 700,
//                     mt: 1
//                   }}>
//                     ${pammData.totalFunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <People sx={{ 
//                   color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
//                     Investors
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
//                     fontWeight: 700,
//                     mt: 1
//                   }}>
//                     {pammData.investors.length}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={cardStyles}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <AccountCircle sx={{ 
//                   color: theme === 'dark' ? '#10B981' : '#059669',
//                   fontSize: '40px',
//                   filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
//                 }} />
//                 <Box ml={2}>
//                   <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
//                     Manager Capital
//                   </Typography>
//                   <Typography variant="h4" sx={{ 
//                     color: theme === 'dark' ? '#10B981' : '#059669',
//                     fontWeight: 700,
//                     mt: 1
//                   }}>
//                     ${pammData.managerCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* {isManagerInitialized && (
//         <Box mb={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
//           <Button
//             variant="contained"
//             onClick={() => setOpenDistribution(true)}
//             startIcon={<Money />}
//             disabled={loading || !isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//               color: '#FFFFFF',
//               borderRadius: '12px',
//               padding: '10px 24px',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #2563EB, #4F46E5)',
//                 boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             Distribute Profits
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => setBoostDialogOpen(true)}
//             startIcon={<AddIcon />}
//             disabled={loading || !isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #10B981, #34D399)',
//               color: '#FFFFFF',
//               borderRadius: '12px',
//               padding: '10px 24px',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #059669, #10B981)',
//                 boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             Boost Capital
//           </Button>
//           {currentUser?.is_admin && (
//             <Button
//               variant="contained"
//               onClick={handleFixDistributions}
//               startIcon={<Refresh />}
//               disabled={fixingDistributions || !isOnline}
//               sx={{
//                 background: 'linear-gradient(to right, #EC4899, #F472B6)',
//                 color: '#FFFFFF',
//                 borderRadius: '12px',
//                 padding: '10px 24px',
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 '&:hover': {
//                   background: 'linear-gradient(to right, #DB2777, #EC4899)',
//                   boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)'
//                 },
//                 '&:disabled': {
//                   background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                   color: '#D1D5DB'
//                 }
//               }}
//             >
//               {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//             </Button>
//           )}
//           <Button
//             variant="contained"
//             onClick={fetchPAMMData}
//             startIcon={<Refresh />}
//             disabled={loading || !isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//               color: '#FFFFFF',
//               borderRadius: '12px',
//               padding: '10px 24px',
//               fontWeight: 600,
//               textTransform: 'none',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #4B5563, #6B7280)',
//                 boxShadow: '0 8px 24px rgba(107, 114, 128, 0.4)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             Refresh Data
//           </Button>
//         </Box>
//       )} */}




// {isManagerInitialized && (
//   <Box mb={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
//     <Button
//       variant="contained"
//       onClick={() => setOpenDistribution(true)}
//       startIcon={isDistributing ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Money />}
//       disabled={loading || isDistributing || !isOnline}
//       sx={{
//         background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//         color: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '10px 24px',
//         fontWeight: 600,
//         textTransform: 'none',
//         '&:hover': {
//           background: 'linear-gradient(to right, #2563EB, #4F46E5)',
//           boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
//         },
//         '&:disabled': {
//           background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//           color: '#D1D5DB',
//         },
//       }}
//     >
//       {isDistributing ? 'Distributing...' : 'Distribute Profits'}
//     </Button>
//     <Button
//       variant="contained"
//       onClick={() => setBoostDialogOpen(true)}
//       startIcon={boostLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <AddIcon />}
//       disabled={loading || boostLoading || !isOnline}
//       sx={{
//         background: 'linear-gradient(to right, #10B981, #34D399)',
//         color: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '10px 24px',
//         fontWeight: 600,
//         textTransform: 'none',
//         '&:hover': {
//           background: 'linear-gradient(to right, #059669, #10B981)',
//           boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
//         },
//         '&:disabled': {
//           background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//           color: '#D1D5DB',
//         },
//       }}
//     >
//       {boostLoading ? 'Boosting...' : 'Boost Capital'}
//     </Button>
//     {currentUser?.is_admin && (
//       <Button
//         variant="contained"
//         onClick={handleFixDistributions}
//         startIcon={fixingDistributions ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Refresh />}
//         disabled={fixingDistributions || !isOnline}
//         sx={{
//           background: 'linear-gradient(to right, #EC4899, #F472B6)',
//           color: '#FFFFFF',
//           borderRadius: '12px',
//           padding: '10px 24px',
//           fontWeight: 600,
//           textTransform: 'none',
//           '&:hover': {
//             background: 'linear-gradient(to right, #DB2777, #EC4899)',
//             boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
//           },
//           '&:disabled': {
//             background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//             color: '#D1D5DB',
//           },
//         }}
//       >
//         {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
//       </Button>
//     )}
//     <Button
//       variant="contained"
//       onClick={async () => {
//         setRefreshLoading(true);
//         await fetchPAMMData();
//         setRefreshLoading(false);
//       }}
//       startIcon={refreshLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Refresh />}
//       disabled={loading || refreshLoading || !isOnline}
//       sx={{
//         background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//         color: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '10px 24px',
//         fontWeight: 600,
//         textTransform: 'none',
//         '&:hover': {
//           background: 'linear-gradient(to right, #4B5563, #6B7280)',
//           boxShadow: '0 8px 24px rgba(107, 114, 128, 0.4)',
//         },
//         '&:disabled': {
//           background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//           color: '#D1D5DB',
//         },
//       }}
//     >
//       {refreshLoading ? 'Refreshing...' : 'Refresh Data'}
//     </Button>
//   </Box>
// )}

//       <AllocationWarning investors={pammData.investors} theme={theme} />

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <DistributionPerformance distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <PerformanceSummary performance={performance} distributions={distributions} theme={theme} />
//         </Grid>
//         <Grid item xs={12}>
//           <RecentProfitDistributions distributions={distributions} theme={theme} />
//         </Grid>
//       </Grid>

//       {/* Distribute Profits Dialog */}
//       <Dialog
//         open={openDistribution}
//         onClose={() => setOpenDistribution(false)}
//         PaperProps={{
//           sx: {
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             borderRadius: '12px',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           fontWeight: 600,
//           display: 'flex',
//           alignItems: 'center',
//           color: theme === 'dark' ? '#38BDF8' : '#3B82F6'
//         }}>
//           <Money sx={{ mr: 1 }} />
//           Distribute Profits
//         </DialogTitle>
//         {/* <DialogContent>
//           <TextField
//             fullWidth
//             label="Profit Amount ($)"
//             value={profitAmount}
//             onChange={(e) => setProfitAmount(e.target.value)}
//             type="number"
//             variant="outlined"
//             margin="normal"
//             InputProps={{
//               startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }} />,
//               sx: { 
//                 background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//                 borderRadius: '8px'
//               }
//             }}
//             InputLabelProps={{
//               sx: { color: theme === 'dark' ? '#94A3B8' : '#64748B' }
//             }}
//             disabled={isDistributing || !isOnline}
//           />
//         </DialogContent> */}

// <DialogContent>
//   <TextField
//     fullWidth
//     label="Profit Amount ($)"
//     value={profitAmount}
//     onChange={(e) => setProfitAmount(e.target.value)}
//     type="number"
//     variant="outlined"
//     margin="normal"
//     InputProps={{
//       startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B' }} />,
//       sx: { 
//         background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
//         borderRadius: '8px',
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A', // Set input text color
//         '& .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
//         },
//         '&:hover .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? '#F8FAFC' : '#64748B',
//         },
//       }
//     }}
//     InputLabelProps={{
//       sx: { 
//         color: theme === 'dark' ? '#F8FAFC' : '#64748B',
//         '&.Mui-focused': {
//           color: theme === 'dark' ? '#38BDF8' : '#3B82F6', // Brighter label color when focused
//         }
//       }
//     }}
//     disabled={isDistributing || !isOnline}
//   />
// </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setOpenDistribution(false)}
//             sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             disabled={isDistributing}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDistributeProfits}
//             variant="contained"
//             disabled={isDistributing || !isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//               color: '#FFFFFF',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #2563EB, #4F46E5)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             {isDistributing ? 'Distributing...' : 'Distribute'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Initialize Manager Dialog */}
//       <Dialog
//         open={initDialogOpen}
//         onClose={() => setInitDialogOpen(false)}
//         PaperProps={{
//           sx: {
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             borderRadius: '12px',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           fontWeight: 600,
//           display: 'flex',
//           alignItems: 'center',
//           color: theme === 'dark' ? '#38BDF8' : '#3B82F6'
//         }}>
//           <AddIcon sx={{ mr: 1 }} />
//           Initialize Manager Account
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 2
//           }}>
//             Enter the initial capital to set up your manager account.
//           </Typography>
//           <TextField
//             fullWidth
//             label="Initial Capital ($)"
//             value={initialCapital}
//             onChange={(e) => setInitialCapital(e.target.value)}
//             type="number"
//             variant="outlined"
//             InputProps={{
//               startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }} />,
//               sx: { 
//                 background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//                 borderRadius: '8px'
//               }
//             }}
//             InputLabelProps={{
//               sx: { color: theme === 'dark' ? '#94A3B8' : '#64748B' }
//             }}
//             disabled={initLoading || !isOnline}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setInitDialogOpen(false)}
//             sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//             disabled={initLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleInitializeManager}
//             variant="contained"
//             disabled={initLoading || !isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #3B82F6, #6366F1)',
//               color: '#FFFFFF',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #2563EB, #4F46E5)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             {initLoading ? 'Initializing...' : 'Initialize'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Boost Capital Dialog */}
//       <Dialog
//         open={boostDialogOpen}
//         onClose={() => setBoostDialogOpen(false)}
//         PaperProps={{
//           sx: {
//             background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             borderRadius: '12px',
//             border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
//           }
//         }}
//       >
//         <DialogTitle sx={{ 
//           fontWeight: 600,
//           display: 'flex',
//           alignItems: 'center',
//           color: theme === 'dark' ? '#10B981' : '#059669'
//         }}>
//           <AddIcon sx={{ mr: 1 }} />
//           Boost Manager Capital
//         </DialogTitle>
//         {/* <DialogContent>
//           <Typography variant="body2" sx={{ 
//             color: theme === 'dark' ? '#94A3B8' : '#64748B',
//             mb: 2
//           }}>
//             Enter the amount to add to your manager capital.
//           </Typography>
//           <TextField
//             fullWidth
//             label="Boost Amount ($)"
//             value={boostAmount}
//             onChange={(e) => setBoostAmount(e.target.value)}
//             type="number"
//             variant="outlined"
//             InputProps={{
//               startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }} />,
//               sx: { 
//                 background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
//                 borderRadius: '8px'
//               }
//             }}
//             InputLabelProps={{
//               sx: { color: theme === 'dark' ? '#94A3B8' : '#64748B' }
//             }}
//             disabled={!isOnline}
//           />
//         </DialogContent> */}

// <DialogContent>
//   <Typography
//     variant="body2"
//     sx={{
//       color: theme === 'dark' ? '#F8FAFC' : '#64748B',
//       mb: 2,
//     }}
//   >
//     Enter the amount to add to your manager capital.
//   </Typography>
//   <TextField
//     fullWidth
//     label="Boost Amount ($)"
//     value={boostAmount}
//     onChange={(e) => setBoostAmount(e.target.value)}
//     type="number"
//     variant="outlined"
//     InputProps={{
//       startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B' }} />,
//       sx: {
//         background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
//         borderRadius: '8px',
//         color: theme === 'dark' ? '#F8FAFC' : '#0F172A', // Set input text color
//         '& .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
//         },
//         '&:hover .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? '#F8FAFC' : '#64748B',
//         },
//       },
//     }}
//     InputLabelProps={{
//       sx: {
//         color: theme === 'dark' ? '#F8FAFC' : '#64748B',
//         '&.Mui-focused': {
//           color: theme === 'dark' ? '#10B981' : '#059669', // Match dialog title color
//         },
//       },
//     }}
//     disabled={!isOnline}
//   />
// </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setBoostDialogOpen(false)}
//             sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleBoostCapital}
//             variant="contained"
//             disabled={!isOnline}
//             sx={{
//               background: 'linear-gradient(to right, #10B981, #34D399)',
//               color: '#FFFFFF',
//               '&:hover': {
//                 background: 'linear-gradient(to right, #059669, #10B981)'
//               },
//               '&:disabled': {
//                 background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
//                 color: '#D1D5DB'
//               }
//             }}
//           >
//             Boost Capital
//           </Button>
//         </DialogActions>
//       </Dialog>




//   <Button
//   variant="contained"
//   onClick={() => setBoostDialogOpen(true)}
//   startIcon={<AddIcon />}
//   size="medium"
//   sx={{
//     background: theme === 'dark' ? 'linear-gradient(to right, #1E40AF, #3730A3)' : 'linear-gradient(to right, #3B82F6, #6366F1)',
//     '&:hover': {
//       background: theme === 'dark' ? 'linear-gradient(to right, #1E3A8A, #312E81)' : 'linear-gradient(to right, #2563EB, #4F46E5)'
//     },
//     textTransform: 'none',
//     fontWeight: 500,
//     letterSpacing: 'normal',
//     width: '100%',
//     py: 1
//   }}
// >
//   Boost Capital
// </Button>

// <Dialog
//   open={boostDialogOpen}
//   onClose={() => setBoostDialogOpen(false)}
//   PaperProps={{
//     sx: {
//       background: theme === 'dark'
//         ? 'linear-gradient(145deg, #0F172A, #1E293B)'
//         : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
//       borderRadius: '12px',
//       border: theme === 'dark'
//         ? '1px solid rgba(100, 116, 139, 0.5)'
//         : '1px solid rgba(203, 213, 225, 0.7)',
//       boxShadow: theme === 'dark'
//         ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
//         : '0px 8px 24px rgba(0, 0, 0, 0.1)',
//       minWidth: '400px'
//     }
//   }}
// >
//   <DialogTitle sx={{
//     color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//     fontWeight: 700,
//     fontSize: '1.25rem',
//     borderBottom: theme === 'dark'
//       ? '1px solid rgba(71, 85, 105, 0.5)'
//       : '1px solid rgba(226, 232, 240, 0.7)',
//     padding: '16px 24px'
//   }}>
//     Boost Capital
//   </DialogTitle>
//   <DialogContent sx={{ padding: '20px 24px' }}>
//     <Typography variant="body1" paragraph sx={{
//       color: theme === 'dark' ? '#94A3B8' : '#64748B',
//       lineHeight: 1.6,
//       mb: 3
//     }}>
//       Add funds to your PAMM manager capital.
//     </Typography>
//     <TextField
//       label="Amount ($)"
//       type="number"
//       fullWidth
//       value={boostAmount}
//       onChange={(e) => setBoostAmount(e.target.value)}
//       inputProps={{ min: 0.01, step: 0.01 }} // Prevent negative values and allow decimals
//       InputProps={{
//         startAdornment: <FeesIcon sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B', mr: 0.5 }} />,
//         sx: {
//           color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//           '& .MuiOutlinedInput-notchedOutline': {
//             borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
//           },
//           '&:hover .MuiOutlinedInput-notchedOutline': {
//             borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
//           }
//         }
//       }}
//       InputLabelProps={{
//         sx: {
//           color: theme === 'dark' ? '#94A3B8' : '#64748B'
//         }
//       }}
//       helperText="Enter a positive amount (minimum $0.01)"
//       FormHelperTextProps={{
//         sx: {
//           color: theme === 'dark' ? '#94A3B8' : '#64748B'
//         }
//       }}
//     />
//   </DialogContent>
//   <DialogActions sx={{
//     padding: '16px 24px',
//     borderTop: theme === 'dark'
//       ? '1px solid rgba(71, 85, 105, 0.5)'
//       : '1px solid rgba(226, 232, 240, 0.7)'
//   }}>
//     <Button
//       onClick={() => setBoostDialogOpen(false)}
//       sx={{
//         color: theme === 'dark' ? '#94A3B8' : '#64748B',
//         fontWeight: 500,
//         '&:hover': {
//           backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
//         }
//       }}
//     >
//       Cancel
//     </Button>
//     <Button
//       onClick={handleBoostCapital}
//       variant="contained"
//       disabled={!boostAmount || parseFloat(boostAmount) <= 0 || boostLoading}
//       sx={{
//         background: theme === 'dark'
//           ? 'linear-gradient(to right, #3B82F6, #6366F1)'
//           : 'linear-gradient(to right, #2563EB, #4F46E5)',
//         color: '#FFFFFF',
//         fontWeight: 500,
//         '&:hover': {
//           background: theme === 'dark'
//             ? 'linear-gradient(to right, #2563EB, #4F46E5)'
//             : 'linear-gradient(to right, #1D4ED8, #3730A3)'
//         },
//         '&.Mui-disabled': {
//           background: theme === 'dark'
//             ? 'rgba(100, 116, 139, 0.5)'
//             : 'rgba(203, 213, 225, 0.5)'
//         }
//       }}
//     >
//       {boostLoading ? <CircularProgress size={24} /> : 'Add Capital'}
//     </Button>
//   </DialogActions>
// </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={closeSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={closeSnackbar}
//           severity={snackbar.severity}
//           sx={{
//             width: '100%',
//             backgroundColor: snackbar.severity === 'error' ? '#FEF2F2' : snackbar.severity === 'warning' ? '#FEF3C7' : '#ECFDF5',
//             color: snackbar.severity === 'error' ? '#B91C1C' : snackbar.severity === 'warning' ? '#B45309' : '#065F46',
//             border: snackbar.severity === 'error' ? '1px solid #EF4444' : snackbar.severity === 'warning' ? '1px solid #F59E0B' : '1px solid #10B981',
//             borderRadius: '8px'
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// // export default () => (
// //   <ThemeProvider>
// //     <ErrorBoundary>
// //       <PAMMManager />
// //     </ErrorBoundary>
// //   </ThemeProvider>
// // );


// export default function PAMMManagerWrapper() {
//   return (
//   <ThemeProvider>
//   <ErrorBoundary>
//   <PAMMManager />
//   </ErrorBoundary>
//   </ThemeProvider>
//   );
//   }








import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../Auth';

import DashboardInfoPanel from './DashboardInfoPanel'; // Adjust path as needed


import {
  People, AttachMoney, Add as AddIcon, AccountBalance, AccountCircle,
  Refresh, Warning as WarningIcon, TrendingUp, TrendingDown,
  ArrowUpward, ArrowDownward, PieChart as PieChartIcon,
  Timeline, Equalizer, Money, History,
//   ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
//   Article as ArticleIcon,
//   Assessment as AssessmentIcon,
  VisibilityOff as VisibilityOffIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';


import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis,
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Sector
} from 'recharts';


import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Switch } from 'antd';

import {
  Box, Button, Card, CardContent, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, LinearProgress, Paper, Snackbar, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, Alert, Skeleton
} from '@mui/material';



// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
  
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("ErrorBoundary caught an error", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <Alert severity="error" sx={{ m: 2 }}>
            Something went wrong: {this.state.error?.message || 'Unknown error'}
          </Alert>
        );
      }
      return this.props.children;
    }
  }
  
  ErrorBoundary.propTypes = {
    children: PropTypes.node
  };
  
  // Theme Context
  const ThemeContext = createContext();
  
  const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
  
    const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  ThemeProvider.propTypes = {
    children: PropTypes.node
  };
  
  const useTheme = () => useContext(ThemeContext);
  

const fetchWithAuth = async (url, options = {}, navigate) => {
    let token = localStorage.getItem('authToken');
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    let response = await fetch(url, { ...options, headers });
  
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch('http://localhost:5000/refresh/manager/investor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
  
        if (refreshResponse.ok) {
          const { idToken, refreshToken: newRefreshToken } = await refreshResponse.json();
          localStorage.setItem('authToken', idToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          headers['Authorization'] = `Bearer ${idToken}`;
          response = await fetch(url, { ...options, headers });
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          navigate('/dashboard/information/refreshthepage');
        }
      } else {
        navigate('/dashboard/information/refreshthepage');
      }
    }
  
    return response;
  };
  
  // PerformanceChart component with updated styling
  const PerformanceChart = ({ distributions, theme }) => {
    if (!distributions || distributions.length === 0) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" height={200}>
          <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
            No performance data available
          </Typography>
        </Box>
      );
    }
  
    const chartData = distributions.slice(0, 12).reverse().map((dist, index) => ({
      name: `D${index + 1}`,
      amount: dist.amount ?? 0,
      fees: dist.fees ?? 0,
      date: dist.timestamp ? new Date(dist.timestamp).toLocaleDateString() : 'N/A'
    }));
  
    return (
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
              tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
            />
            <YAxis 
              stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
              tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
              }}
              formatter={(value, name) => [
                name === 'amount' && value < 0 ? (
                  <Box display="flex" alignItems="center">
                    <TrendingDown sx={{ color: '#EF4444', fontSize: '1rem', mr: 0.5 }} />
                    {`$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </Box>
                ) : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                name === 'amount' ? 'Distribution' : 'Fees'
              ]}
            />
            <Legend 
              formatter={(value) => (
                <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                  {value}
                </span>
              )}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              name="Distribution Amount" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="fees" 
              stroke="#82ca9d" 
              name="Manager Fees" 
              strokeWidth={2}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };
  
  PerformanceChart.propTypes = {
    distributions: PropTypes.array,
    theme: PropTypes.string
  };
  
  // CapitalHealthWarning with updated styling
  const CapitalHealthWarning = ({ investorCapital, managerCapital, theme }) => {
    if (!investorCapital || !managerCapital) {
      return null;
    }
  
    const capitalRatio = investorCapital > 0 ? (managerCapital / investorCapital) : 0;
    const isHealthy = capitalRatio >= 0.2;
  
    if (isHealthy) {
      return null;
    }
  
    const requiredCapital = investorCapital * 0.2;
    const shortfall = requiredCapital - managerCapital;
  
    return (
      <Box sx={{ 
        mb: 3,
        p: 3,
        background: 'linear-gradient(to right, #B91C1C, #991B1B)',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      }}>
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ color: '#FECACA', mr: 2, fontSize: '2rem' }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#FEF2F2', fontWeight: 600 }}>
              Capital Health Warning
            </Typography>
            <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
              Your manager capital ratio is {(capitalRatio * 100).toFixed(1)}%, which is below the recommended 20% minimum.
            </Typography>
            <Typography variant="body2" sx={{ color: '#FECACA', mt: 1 }}>
              You need an additional ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })} to meet the minimum requirement.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };
  
  CapitalHealthWarning.propTypes = {
    investorCapital: PropTypes.number,
    managerCapital: PropTypes.number,
    theme: PropTypes.string
  };
  
  // AllocationWarning with updated styling
  const AllocationWarning = ({ investors, theme }) => {
    if (!investors || investors.length === 0) {
      return null;
    }
  
    const totalInvestment = investors.reduce((sum, inv) => sum + (inv.balance ?? 0), 0);
    const largestInvestment = Math.max(...investors.map(inv => inv.balance ?? 0));
    const concentrationRatio = totalInvestment > 0 ? (largestInvestment / totalInvestment) : 0;
  
    const isConcentrated = concentrationRatio > 0.5;
    const hasSmallBase = investors.length < 5;
  
    if (!isConcentrated && !hasSmallBase) {
      return null;
    }
  
    return (
      <Box sx={{ 
        mt: 2,
        mb: 3,
        p: 2,
        background: 'linear-gradient(to right, #B45309, #92400E)',
        borderRadius: '12px',
        border: '1px solid rgba(234, 88, 12, 0.3)'
      }}>
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ color: '#FEF3C7', mr: 1.5 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#FEF3C7', fontWeight: 600 }}>
              Allocation Risks
            </Typography>
            <Box sx={{ color: '#FDE68A', fontSize: '0.875rem' }}>
              {isConcentrated && (
                <Typography variant="body2">
                  ⚠️ High concentration: {(concentrationRatio * 100).toFixed(1)}% from single investor
                </Typography>
              )}
              {hasSmallBase && (
                <Typography variant="body2">
                  ⚠️ Small investor base: Only {investors.length} active investors
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Consider diversifying your investor base to reduce risk.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };
  
  AllocationWarning.propTypes = {
    investors: PropTypes.array,
    theme: PropTypes.string
  };
  
  // DistributionPieChart with updated styling
  const DistributionPieChart = React.memo(({ distributions, theme }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    if (!distributions || distributions.length === 0) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" height={200}>
          <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
            No distribution data available
          </Typography>
        </Box>
      );
    }
  
    const lastDistribution = distributions[0];
    const data = [
      { name: 'Investor Payouts', value: (lastDistribution.amount ?? 0) - (lastDistribution.fees ?? 0) },
      { name: 'Manager Fees', value: lastDistribution.fees ?? 0 }
    ];
  
    const onPieEnter = (_, index) => {
      setActiveIndex(index);
    };
  
    const renderActiveShape = (props) => {
      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  
      return (
        <g>
          <text 
            x={cx} 
            y={cy} 
            dy={-10} 
            textAnchor="middle" 
            fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
            fontSize={14} 
            fontWeight={500}
          >
            {payload.name}
          </text>
          <text 
            x={cx} 
            y={cy} 
            dy={10} 
            textAnchor="middle" 
            fill={theme === 'dark' ? '#F8FAFC' : '#0F172A'} 
            fontSize={12}
          >
            ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 5}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
        </g>
      );
    };
  
    return (
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.name === 'Investor Payouts' ? '#8884d8' : '#82ca9d'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  });
  
  DistributionPieChart.propTypes = {
    distributions: PropTypes.array,
    theme: PropTypes.string
  };
  

// DistributionPerformance with updated professional styling
const DistributionPerformance = React.memo(({ distributions, theme }) => {
    if (!distributions || distributions.length === 0) {
      return (
        <Card sx={{ 
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(56, 189, 248, 0.3)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
          boxShadow: theme === 'dark' 
            ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
            : '0 10px 40px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.05)',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: theme === 'dark' 
              ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
          }
        }}>
          <Typography variant="h6" sx={{ 
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            <Timeline sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            Distribution Performance
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={200}
            sx={{
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.3)'
                : 'rgba(248, 250, 252, 0.5)',
              borderRadius: '12px',
              border: theme === 'dark' 
                ? '1px dashed rgba(148, 163, 184, 0.3)'
                : '1px dashed rgba(100, 116, 139, 0.3)',
            }}
          >
            <Typography variant="body2" sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textAlign: 'center'
            }}>
              No distribution data available
            </Typography>
          </Box>
        </Card>
      );
    }
  
    const totalDistributed = distributions.reduce((sum, dist) => sum + (dist.amount ?? 0), 0);
    const averageDistribution = totalDistributed / distributions.length;
    const lastDistribution = distributions[0]?.amount ?? 0;
    const distributionChange = distributions.length > 1
      ? ((lastDistribution - (distributions[1].amount ?? 0)) / (distributions[1].amount ?? 1)) * 100
      : 0;
  
    return (
      <Card sx={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        border: theme === 'dark' 
          ? '1px solid rgba(56, 189, 248, 0.3)'
          : '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
        boxShadow: theme === 'dark' 
          ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
          : '0 10px 40px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.05)',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: theme === 'dark' 
            ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        }
      }}>
        <Typography variant="h6" sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600,
          mb: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          <Timeline sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          Distribution Performance
        </Typography>
        
        <Grid container spacing={{ xs: 1.5, sm: 2 }} mb={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)',
              p: { xs: 1.5, sm: 2 },
              borderRadius: '12px',
              boxShadow: theme === 'dark' 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(59, 130, 246, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme === 'dark' 
                  ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                  : '0 8px 30px rgba(59, 130, 246, 0.12)',
              }
            }}>
              <Typography variant="body2" sx={{ 
                color: theme === 'dark' ? '#94A3B8' : '#64748B',
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Total Distributed
              </Typography>
              <Typography variant="h5" sx={{ 
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                lineHeight: 1.2,
                wordBreak: 'break-all',
                display: 'flex',
                alignItems: 'center',
                minHeight: { xs: '32px', sm: '40px' }
              }}>
                ${totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)',
              p: { xs: 1.5, sm: 2 },
              borderRadius: '12px',
              boxShadow: theme === 'dark' 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(59, 130, 246, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme === 'dark' 
                  ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                  : '0 8px 30px rgba(59, 130, 246, 0.12)',
              }
            }}>
              <Typography variant="body2" sx={{ 
                color: theme === 'dark' ? '#94A3B8' : '#64748B',
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Average Distribution
              </Typography>
              <Typography variant="h5" sx={{ 
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                lineHeight: 1.2,
                wordBreak: 'break-all',
                display: 'flex',
                alignItems: 'center',
                minHeight: { xs: '32px', sm: '40px' }
              }}>
                ${averageDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.8)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)',
              p: { xs: 1.5, sm: 2 },
              borderRadius: '12px',
              boxShadow: theme === 'dark' 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(59, 130, 246, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme === 'dark' 
                  ? '0 8px 30px rgba(0, 0, 0, 0.4)'
                  : '0 8px 30px rgba(59, 130, 246, 0.12)',
              }
            }}>
              <Typography variant="body2" sx={{ 
                color: theme === 'dark' ? '#94A3B8' : '#64748B',
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Last Distribution
              </Typography>
              <Box 
                display="flex" 
                alignItems="center" 
                flexWrap="wrap"
                gap={1}
                minHeight={{ xs: '32px', sm: '40px' }}
              >
                <Typography variant="h5" sx={{ 
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  lineHeight: 1.2,
                  wordBreak: 'break-all',
                  flex: '1 1 auto',
                  minWidth: 0
                }}>
                  ${lastDistribution.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
                {distributionChange !== 0 && (
                  <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                    {distributionChange >= 0 ? (
                      <ArrowUpward sx={{ 
                        color: '#10B981', 
                        fontSize: { xs: '1rem', sm: '1.2rem' }
                      }} />
                    ) : (
                      <ArrowDownward sx={{ 
                        color: '#EF4444', 
                        fontSize: { xs: '1rem', sm: '1.2rem' }
                      }} />
                    )}
                    <Typography variant="body2" sx={{ 
                      color: distributionChange >= 0 ? '#10B981' : '#EF4444',
                      ml: 0.5,
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                      {Math.abs(distributionChange).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ 
              color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              display: 'flex',
              alignItems: 'center'
            }}>
              <Timeline sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
              Distribution History
            </Typography>
            <Box sx={{
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.5)'
                : 'rgba(248, 250, 252, 0.7)',
              borderRadius: '12px',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)',
              p: { xs: 1, sm: 2 },
              minHeight: { xs: '200px', sm: '250px' }
            }}>
              <PerformanceChart distributions={distributions} theme={theme} />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ 
              color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              display: 'flex',
              alignItems: 'center'
            }}>
              <PieChartIcon sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
              Last Distribution Breakdown
            </Typography>
            <Box sx={{
              background: theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.5)'
                : 'rgba(248, 250, 252, 0.7)',
              borderRadius: '12px',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)',
              p: { xs: 1, sm: 2 },
              minHeight: { xs: '200px', sm: '250px' }
            }}>
              <DistributionPieChart distributions={distributions} theme={theme} />
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  });
  
  DistributionPerformance.propTypes = {
    distributions: PropTypes.array,
    theme: PropTypes.string
  };
  
  // PerformanceSummary with updated styling
  const PerformanceSummary = React.memo(({ performance, distributions, theme }) => {
    const performanceData = useMemo(() => {
      if (!distributions || distributions.length === 0) {
        return [];
      }
      return distributions.slice(0, 6).reverse().map((dist, index) => {
        const amount = dist.amount ?? 0;
        const fees = dist.fees ?? 0;
        const investorPayout = amount - fees;
        const returnValue = amount > 0 ? (investorPayout / amount) * 100 : 0;
        return {
          name: `Dist ${distributions.length - index}`,
          return: isNaN(returnValue) ? 0 : Number(returnValue.toFixed(2)),
          fees
        };
      });
    }, [distributions]);
  
    const debouncedLog = debounce((name, value) => {
      console.log(`Tooltip: name=${name}, value=${value}`);
    }, 100);
  
    if (performanceData.length === 0) {
      return (
        <Card sx={{ 
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(56, 189, 248, 0.3)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(59, 130, 246, 0.1)',
          p: 3
        }}>
          <Typography variant="h6" sx={{ 
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Equalizer sx={{ mr: 1 }} />
            Performance Summary
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height={200}>
            <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
              No performance data available
            </Typography>
          </Box>
        </Card>
      );
    }
  
    return (
      <Card sx={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        border: theme === 'dark' 
          ? '1px solid rgba(56, 189, 248, 0.3)'
          : '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        boxShadow: theme === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)'
          : '0 8px 32px rgba(59, 130, 246, 0.1)',
        p: 3
      }}>
        <Typography variant="h6" sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Equalizer sx={{ mr: 1 }} />
          Performance Summary
        </Typography>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              mb: 1
            }}>
              YTD Return:
            </Typography>
            <Typography variant="h6" sx={{ 
              color: performance.ytdReturn >= 0 ? '#10B981' : '#EF4444',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}>
              {performance.ytdReturn >= 0 ? <TrendingUp sx={{ mr: 0.5 }} /> : <TrendingDown sx={{ mr: 0.5 }} />}
              {(performance.ytdReturn ?? 0).toFixed(2)}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              mb: 1
            }}>
              Total Fees Earned:
            </Typography>
            <Typography variant="h6" sx={{ 
              color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
              fontWeight: 700
            }}>
              ${(performance.totalFees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              mb: 1
            }}>
              Total Distributions:
            </Typography>
            <Typography variant="h6" sx={{ 
              color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
              fontWeight: 700
            }}>
              {distributions.length}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              mb: 1
            }}>
              Last Distribution:
            </Typography>
            <Typography variant="h6" sx={{ 
              color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
              fontWeight: 700
            }}>
              {distributions.length > 0 && distributions[0].timestamp
                ? new Date(distributions[0].timestamp).toLocaleDateString()
                : 'Never'}
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600,
          mb: 2
        }}>
          Performance Trend
        </Typography>
        
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis 
                dataKey="name" 
                stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
              />
              <YAxis 
                yAxisId="return" 
                stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                tickFormatter={(value) => `${value.toFixed(0)}%`} 
              />
              <YAxis 
                yAxisId="fees" 
                orientation="right" 
                stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                }}
                formatter={(value, name) => {
                  debouncedLog(name, value);
                  return [
                    name === 'return' ? `%${value.toFixed(2)}` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    name === 'return' ? 'Return %' : 'Fees ($)'
                  ];
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                    {value}
                  </span>
                )}
              />
              <Line
                yAxisId="return"
                type="monotone"
                dataKey="return"
                stroke="#8884d8"
                name="Return %"
                strokeWidth={2}
              />
              <Line
                yAxisId="fees"
                type="monotone"
                dataKey="fees"
                stroke="#82ca9d"
                name="Fees ($)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    );
  });
  
  PerformanceSummary.propTypes = {
    performance: PropTypes.object,
    distributions: PropTypes.array,
    theme: PropTypes.string
  };
  
  // RecentProfitDistributions with updated styling
  const RecentProfitDistributions = React.memo(({ distributions, theme }) => {
    if (!distributions || distributions.length === 0) {
      return (
        <Card sx={{ 
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(56, 189, 248, 0.3)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(59, 130, 246, 0.1)',
          p: 3,
          mt: 3
        }}>
          <Typography variant="h6" sx={{ 
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <History sx={{ mr: 1 }} />
            Recent Profit Distributions
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height={200}>
            <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}>
              No distribution data available
            </Typography>
          </Box>
        </Card>
      );
    }
  
    const breakdownData = [
      { name: 'Investor Payouts', value: (distributions[0].amount ?? 0) - (distributions[0].fees ?? 0) },
      { name: 'Manager Fees', value: distributions[0].fees ?? 0 }
    ];
  
    return (
      <Card sx={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        border: theme === 'dark' 
          ? '1px solid rgba(56, 189, 248, 0.3)'
          : '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        boxShadow: theme === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)'
          : '0 8px 32px rgba(59, 130, 246, 0.1)',
        p: 3,
        mt: 3
      }}>
        <Typography variant="h6" sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <History sx={{ mr: 1 }} />
          Recent Profit Distributions
        </Typography>
        
        <Box sx={{ mb: 3, overflowX: 'auto' }}>
          <TableContainer 
            component={Paper}
            sx={{ 
              background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ 
                  background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
                }}>
                  <TableCell sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Date
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Investors
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Fees
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Liquidations
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distributions.slice(0, 5).map((row, index) => (
                  <TableRow key={row.id ?? `distribution-${index}`}>
                    <TableCell sx={{ 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                    }}>
                      {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                    }}>
                      ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                    }}>
                      {row.investor_count ?? 0}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                    }}>
                      ${(row.fees ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                    }}>
                      {row.liquidated_count ?? 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Typography variant="subtitle1" sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600,
          mb: 2
        }}>
          Last Distribution Breakdown
        </Typography>
        
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={breakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                type="number" 
                stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke={theme === 'dark' ? '#94A3B8' : '#64748B'}
                tick={{ fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="value" fill="#8884d8" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    );
  });
  
  RecentProfitDistributions.propTypes = {
    distributions: PropTypes.array,
    theme: PropTypes.string
  };

// Main PAMMManager component
const PAMMManager = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, error: authError, isOnline } = useAuth();
  const navigate = useNavigate();
  const [pammData, setPammData] = useState({
    totalFunds: null,
    investors: null,
    managerCapital: null,
    investorCapital: null,
    capitalRatio: null
  });
  const [distributions, setDistributions] = useState(null);
  const [performance, setPerformance] = useState({
    ytdReturn: null,
    totalFees: null
  });
  const [loadingStates, setLoadingStates] = useState({
    critical: true, // For manager status and total funds
    distributions: true,
    performance: true
  });
  const [openDistribution, setOpenDistribution] = useState(false);
  const [profitAmount, setProfitAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isDistributing, setIsDistributing] = useState(false);
  const [isManagerInitialized, setIsManagerInitialized] = useState(null);
  const [initDialogOpen, setInitDialogOpen] = useState(false);
  const [initialCapital, setInitialCapital] = useState('');
  const [initLoading, setInitLoading] = useState(false);
  const [boostDialogOpen, setBoostDialogOpen] = useState(false);
  const [boostAmount, setBoostAmount] = useState('');
  const [fixingDistributions, setFixingDistributions] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [openTrade, setOpenTrade] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const containerStyles = {
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #020617 0%, #0F172A 25%, #1E293B 75%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 25%, #F1F5F9 75%, #E2E8F0 100%)',
    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    minHeight: '100vh',
    p: 3,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme === 'dark'
        ? 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
      pointerEvents: 'none'
    }
  };

  const cardStyles = {
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
    border: theme === 'dark'
      ? '1px solid rgba(56, 189, 248, 0.3)'
      : '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    boxShadow: theme === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(59, 130, 246, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 40px rgba(59, 130, 246, 0.15)',
      border: theme === 'dark'
        ? '1px solid rgba(56, 189, 248, 0.5)'
        : '1px solid rgba(59, 130, 246, 0.3)'
    }
  };

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Load Google Tag Manager (unchanged)
  useEffect(() => {
    const loadTagManager = async () => {
      try {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?l=dataLayer&id=G-RP32M8VF81';
        script.onerror = () => {
          console.warn('Failed to load Google Tag Manager');
          showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Tag Manager error:', error);
        showSnackbar('Analytics could not be loaded. Some features may be limited.', 'warning');
      }
    };

    loadTagManager();
  }, [showSnackbar]);

  // Handle auth errors and snackbar events (unchanged)
  useEffect(() => {
    if (authError) {
      showSnackbar(authError, 'error');
      navigate('/dashboard/information/refreshthepage');
    }

    const handleSnackbar = (event) => {
      setSnackbar({ open: true, message: event.detail.message, severity: event.detail.severity });
    };

    window.addEventListener('show-snackbar', handleSnackbar);
    return () => window.removeEventListener('show-snackbar', handleSnackbar);
  }, [authError, showSnackbar, navigate]);

  // Optimized fetchPAMMData with prioritized and incremental fetching
  const fetchPAMMData = useCallback(async () => {
    if (!currentUser) {
      showSnackbar('Please log in to continue', 'error');
      navigate('/dashboard/information/refreshthepage');
      return;
    }

    try {
      // Step 1: Fetch critical data (manager status and total funds) first
      setLoadingStates(prev => ({ ...prev, critical: true }));
      const [managerRes, statusRes] = await Promise.all([
        fetchWithAuth('http://localhost:5000/pamm/manager-status', {}, navigate).catch((err) => {
          throw new Error(`Failed to fetch manager status: ${err.message}`);
        }),
        fetchWithAuth('http://localhost:5000/pamm/status', {}, navigate).catch((err) => {
          throw new Error(`Failed to fetch status: ${err.message}`);
        })
      ]);

      if (!managerRes.ok) throw new Error((await managerRes.json()).message || 'Failed to fetch manager status');
      if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');

      const managerData = await managerRes.json();
      const statusData = await statusRes.json();

      const isInitialized = managerData.manager?.is_manager === true || managerData.manager?.is_manager === 'true';
      setIsManagerInitialized(isInitialized);
      setInitDialogOpen(!isInitialized);

      const investors = statusData.investors || [];
      setPammData({
        totalFunds: statusData.total_funds || 0,
        investors,
        managerCapital: managerData.manager?.capital || 0,
        investorCapital: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) || 0,
        capitalRatio: investors.reduce((sum, inv) => sum + (inv.balance || 0), 0) > 0
          ? (managerData.manager?.capital || 0) / investors.reduce((sum, inv) => sum + (inv.balance || 0), 0)
          : 0
      });

      setLoadingStates(prev => ({ ...prev, critical: false }));

      // Step 2: Fetch non-critical data (distributions and performance) in the background
      setLoadingStates(prev => ({ ...prev, distributions: true, performance: true }));

      const [distRes, perfRes] = await Promise.all([
        fetchWithAuth('http://localhost:5000/pamm/distributions', {}, navigate).catch((err) => {
          console.error(`Failed to fetch distributions: ${err.message}`);
          showSnackbar('Failed to load distribution data', 'warning');
          return null;
        }),
        fetchWithAuth('http://localhost:5000/pamm/performance', {}, navigate).catch((err) => {
          console.error(`Failed to fetch performance: ${err.message}`);
          showSnackbar('Failed to load performance data', 'warning');
          return null;
        })
      ]);

      if (distRes && distRes.ok) {
        const distData = await distRes.json();
        setDistributions(distData.data || []);
      }
      setLoadingStates(prev => ({ ...prev, distributions: false }));

      if (perfRes && perfRes.ok) {
        const perfData = await perfRes.json();
        setPerformance({
          ytdReturn: perfData.ytdReturn || 0,
          totalFees: perfData.totalFees || 0
        });
      }
      setLoadingStates(prev => ({ ...prev, performance: false }));

    } catch (error) {
      console.error('Failed to fetch PAMM data:', error);
      showSnackbar(getFriendlyErrorMessage(error), 'error');
      setLoadingStates({
        critical: false,
        distributions: false,
        performance: false
      });
    }
  }, [currentUser, showSnackbar, navigate]);

  // Network status monitoring (unchanged)
  useEffect(() => {
    const handleOnline = () => {
      showSnackbar('Back online! Reloading data...', 'success');
      fetchPAMMData();
    };

    const handleOffline = () => {
      showSnackbar('Network error: Unable to connect to authentication server. Please check your internet connection.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSnackbar, fetchPAMMData]);

  useEffect(() => {
    fetchPAMMData();
  }, [fetchPAMMData]);

  // ... (handleInitializeManager, handleDistributeProfits, handleBoostCapital, handleFixDistributions unchanged)


// Utility function to map error messages to user-friendly versions
const getFriendlyErrorMessage = (error) => {
    const message = error.message?.toLowerCase() || '';
    if (message.includes('initial capital must be positive')) {
      return 'Please enter a valid, positive initial capital amount.';
    } else if (message.includes('insufficient funds')) {
      return 'Not enough funds in your main balance to initialize the account.';
    } else if (message.includes('network error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    } else if (message.includes('unauthorized') || message.includes('401')) {
      return 'Authentication failed. Please log in again.';
    } else if (message.includes('forbidden') || message.includes('403')) {
      return 'You do not have permission to perform this action.';
    } else if (message.includes('not found') || message.includes('404')) {
      return 'Requested resource not found. Please try again later.';
    } else if (message.includes('server error') || message.includes('500')) {
      return 'Server error occurred. Please try again later.';
    } else if (message.includes('manager already initialized')) {
      return 'Your manager account is already initialized.';
    }
    return error.message || 'An unexpected error occurred. Please try again.';
  };
  
  // Handle initializing manager account
  const handleInitializeManager = async () => {
    const parsedCapital = parseFloat(initialCapital);
    if (!initialCapital || isNaN(parsedCapital) || parsedCapital <= 0) {
      showSnackbar('Please enter a valid, positive initial capital amount', 'error');
      return;
    }
  
    setInitLoading(true);
    try {
      console.log('Submitting initialCapital:', initialCapital); // Debug log
      const response = await fetchWithAuth('http://localhost:5000/pamm/init-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_capital: parsedCapital }) // Match backend key
      }, navigate);
  
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to initialize manager account');
  
      setIsManagerInitialized(true);
      setInitDialogOpen(false);
      setInitialCapital('');
      showSnackbar('Manager account initialized successfully', 'success');
      await fetchPAMMData();
    } catch (error) {
      console.error('Initialization error:', error);
      showSnackbar(getFriendlyErrorMessage(error), 'error');
    } finally {
      setInitLoading(false);
    }
  };
  


// Handle distributing profits
// Handle distributing profits
const handleDistributeProfits = async () => {
  const trimmedProfitAmount = profitAmount?.trim() || ''; // Ensure non-null, trim whitespace
  const parsedProfit = parseFloat(trimmedProfitAmount);

  // Log input for debugging
  console.log('Profit amount input:', {
    raw: profitAmount,
    trimmed: trimmedProfitAmount,
    parsed: parsedProfit,
    isValid: !isNaN(parsedProfit) && parsedProfit > 0
  });

  if (!trimmedProfitAmount || isNaN(parsedProfit) || parsedProfit <= 0) {
    showSnackbar('Please enter a valid, positive profit amount greater than 0', 'error');
    return;
  }

  if (isDistributing) {
    console.log('Distribution already in progress, ignoring request');
    return; // Prevent multiple submissions
  }

  const profit = Math.round(parsedProfit * 100) / 100; // Round to 2 decimal places
  setIsDistributing(true);
  try {
    const response = await fetchWithAuth('http://localhost:5000/pamm/distribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profit }) // Use rounded profit value
    }, navigate);

    const data = await response.json();
    if (!response.ok) {
      console.error('API response:', data);
      throw new Error(data.message || 'Failed to distribute profits');
    }

    setOpenDistribution(false);
    setProfitAmount('');
    showSnackbar(data.message || 'Profits distributed successfully', 'success');
    await fetchPAMMData();
  } catch (error) {
    console.error('Distribution error:', error.message, { profitAmount, parsedProfit });
    showSnackbar(getFriendlyErrorMessage(error), 'error');
  } finally {
    setIsDistributing(false);
  }
};
  
  // Handle boosting manager capital
  const handleBoostCapital = async () => {
    const parsedBoost = parseFloat(boostAmount);
    if (!boostAmount || isNaN(parsedBoost) || parsedBoost <= 0) {
      showSnackbar('Please enter a valid, positive boost amount', 'error');
      return;
    }
  
    setBoostLoading(true);
    try {
      const response = await fetchWithAuth('http://localhost:5000/pamm/add-capital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsedBoost })
      }, navigate);
  
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to boost capital');
  
      setBoostDialogOpen(false);
      setBoostAmount('');
      showSnackbar('Capital boosted successfully', 'success');
      await fetchPAMMData();
    } catch (error) {
      console.error('Boost capital error:', error);
      showSnackbar(getFriendlyErrorMessage(error), 'error');
    } finally {
      setBoostLoading(false);
    }
  };
  
  // Handle fixing distributions (admin only)
  const handleFixDistributions = async () => {
    if (!currentUser?.is_admin) {
      showSnackbar('Unauthorized: Admin access required', 'error');
      return;
    }
  
    setFixingDistributions(true);
    try {
      const response = await fetchWithAuth('http://localhost:5000/pamm/fix-distributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, navigate);
  
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to fix distributions');
  
      showSnackbar('Distributions fixed successfully', 'success');
      await fetchPAMMData();
    } catch (error) {
      console.error('Fix distributions error:', error);
      showSnackbar(getFriendlyErrorMessage(error), 'error');
    } finally {
      setFixingDistributions(false);
    }
  };


  
  // Handle trade panel navigation
  const handleOpenTrade = () => {
    setOpenTrade(true);
    navigate('/dashboard/trade');
    setTimeout(() => {
      setOpenTrade(false); // Reset loading state after navigation
    }, 1000); // Simulate async operation
  };

  const OfflineBanner = () => {
    if (isOnline) return null;
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#B91C1C',
        color: '#FEF2F2',
        textAlign: 'center',
        py: 1,
        zIndex: 9999,
      }}>
        <Typography variant="body2">
          You are offline. Please reconnect to access all features.
        </Typography>
      </Box>
    );
  };

  // Skeleton loading for cards
  const renderCardSkeleton = () => (
    <Card sx={cardStyles}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box width="100%">
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Skeleton loading for charts and tables
  const renderChartSkeleton = () => (
    <Card sx={cardStyles}>
      <CardContent>
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '8px' }} />
      </CardContent>
    </Card>
  );

  // Skeleton loading for table
  const renderTableSkeleton = () => (
    <Card sx={{ ...cardStyles, mt: 3 }}>
      <CardContent>
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '8px' }} />
      </CardContent>
    </Card>
  );

  if (loadingStates.critical && !pammData.totalFunds && !pammData.investors && !pammData.managerCapital) {
    return (
      <Box sx={containerStyles}>
        <OfflineBanner />
        <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={containerStyles}>
      <OfflineBanner />
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
         <Typography
            variant="h4" sx={{
            color: theme === 'dark' ? 'rgba(224, 242, 254, 0.95)' : 'rgba(15, 23, 42, 0.95)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: '"Inter", -apple-system, sans-serif',
            position: 'relative',
            mb: 1,
            background: theme === 'dark' 
            ? 'linear-gradient(135deg, #38BDF8, #8B5CF6)'
            : 'linear-gradient(135deg, #2563EB, #7C3AED)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: 0,
            width: '80px',
            height: '3px',
            background: theme === 'dark' 
                ? 'linear-gradient(90deg, #38BDF8, #8B5CF6)'
                : 'linear-gradient(90deg, #2563EB, #7C3AED)',
            borderRadius: '3px'
            }
        }}>
            PAMM MANAGER DASHBOARD
        </Typography>

          <Button 
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            variant="outlined"
            size="small"
            startIcon={showInfoPanel ? <VisibilityOffIcon /> : <InfoIcon />}
            endIcon={<KeyboardArrowDownIcon sx={{ 
                transform: showInfoPanel ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />}
            sx={{
                ml: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                position: 'relative',
                overflow: 'hidden',
                background: showInfoPanel 
                ? (theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.1))'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))')
                : (theme === 'dark' 
                    ? 'rgba(30, 41, 59, 0.6)'
                    : 'rgba(248, 250, 252, 0.8)'),
                borderColor: showInfoPanel
                ? (theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(59, 130, 246, 0.3)')
                : (theme === 'dark' ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.5)'),
                color: showInfoPanel
                ? (theme === 'dark' ? '#38BDF8' : '#2563EB')
                : (theme === 'dark' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(51, 65, 85, 0.9)'),
                backdropFilter: 'blur(8px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: showInfoPanel
                ? (theme === 'dark' 
                    ? '0 8px 32px -4px rgba(56, 189, 248, 0.2), inset 0 0 0 1px rgba(56, 189, 248, 0.1)'
                    : '0 8px 32px -4px rgba(59, 130, 246, 0.15), inset 0 0 0 1px rgba(59, 130, 246, 0.1)')
                : (theme === 'dark' 
                    ? '0 4px 16px -2px rgba(0, 0, 0, 0.2)'
                    : '0 4px 16px -2px rgba(0, 0, 0, 0.08)'),
                '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: theme === 'dark' 
                    ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), transparent)',
                transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '&:hover': {
                borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(59, 130, 246, 0.5)',
                background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.15))'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08))',
                color: theme === 'dark' ? '#38BDF8' : '#2563EB',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: theme === 'dark' 
                    ? '0 12px 40px -4px rgba(56, 189, 248, 0.3), inset 0 0 0 1px rgba(56, 189, 248, 0.2)'
                    : '0 12px 40px -4px rgba(59, 130, 246, 0.2), inset 0 0 0 1px rgba(59, 130, 246, 0.2)',
                '&::before': {
                    left: '100%',
                }
                },
                '&:active': {
                transform: 'translateY(-1px) scale(1.01)',
                },
                // Ripple effect
                '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '0',
                height: '0',
                borderRadius: '50%',
                background: theme === 'dark' 
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(59, 130, 246, 0.2)',
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
                opacity: 0,
                },
                '&:focus::after': {
                width: '120px',
                height: '120px',
                opacity: 1,
                }
            }}
            >
            {showInfoPanel ? 'Hide Dashboard Info' : 'Show Dashboard Info'}
            </Button>

        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          style={{ padding: '4px', fontSize: '14px' }}
        />
      </Box> */}


<Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: 2,
    mb: 4,
  }}
>
  {/* Title */}
  <Typography
  variant="h4"
  sx={{
    fontSize: {
      xs: '1.25rem', // ~20px on mobile
      sm: '1.5rem',  // ~24px on small screens
      md: '2rem',    // ~32px on medium+
    },
    color: theme === 'dark' ? 'rgba(224, 242, 254, 0.95)' : 'rgba(15, 23, 42, 0.95)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    fontFamily: '"Inter", -apple-system, sans-serif',
    position: 'relative',
    mb: { xs: 1, sm: 0 },
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #38BDF8, #8B5CF6)'
      : 'linear-gradient(135deg, #2563EB, #7C3AED)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -12,
      left: 0,
      width: '80px',
      height: '3px',
      background: theme === 'dark'
        ? 'linear-gradient(90deg, #38BDF8, #8B5CF6)'
        : 'linear-gradient(90deg, #2563EB, #7C3AED)',
      borderRadius: '3px',
    },
  }}
>
  PAMM MANAGER DASHBOARD
</Typography>


  {/* Controls (Button + Switch) */}
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
    <Button
      onClick={() => setShowInfoPanel(!showInfoPanel)}
      variant="outlined"
      size="small"
      startIcon={showInfoPanel ? <VisibilityOffIcon /> : <InfoIcon />}
      endIcon={
        <KeyboardArrowDownIcon
          sx={{
            transform: showInfoPanel ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      }
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 500,
        px: 3,
        py: 1.5,
        position: 'relative',
        overflow: 'hidden',
        background: showInfoPanel
          ? theme === 'dark'
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))'
          : theme === 'dark'
          ? 'rgba(30, 41, 59, 0.6)'
          : 'rgba(248, 250, 252, 0.8)',
        borderColor: showInfoPanel
          ? theme === 'dark'
            ? 'rgba(56, 189, 248, 0.4)'
            : 'rgba(59, 130, 246, 0.3)'
          : theme === 'dark'
          ? 'rgba(71, 85, 105, 0.4)'
          : 'rgba(203, 213, 225, 0.5)',
        color: showInfoPanel
          ? theme === 'dark'
            ? '#38BDF8'
            : '#2563EB'
          : theme === 'dark'
          ? 'rgba(226, 232, 240, 0.9)'
          : 'rgba(51, 65, 85, 0.9)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(59, 130, 246, 0.5)',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.15))'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08))',
          color: theme === 'dark' ? '#38BDF8' : '#2563EB',
          transform: 'translateY(-2px) scale(1.02)',
        },
        '&:active': {
          transform: 'translateY(-1px) scale(1.01)',
        },
      }}
    >
      {showInfoPanel ? 'Hide Dashboard Info' : 'Show Dashboard Info'}
    </Button>

    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      checkedChildren="Dark"
      unCheckedChildren="Light"
      className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
      style={{ padding: '4px', fontSize: '14px' }}
    />
  </Box>
</Box>



      {showInfoPanel && (
        <DashboardInfoPanel 
            theme={theme} 
            onClose={() => setShowInfoPanel(false)} 
        />
        )}

      {isManagerInitialized === null ? (
        <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: '12px', mx: 'auto', mb: 4 }} />
      ) : !isManagerInitialized ? (
        <Box mb={4} textAlign="center">
          <Button
            variant="contained"
            onClick={() => setInitDialogOpen(true)}
            startIcon={<AddIcon />}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Initialize Manager Account
          </Button>
        </Box>
      ) : (
        <CapitalHealthWarning
          investorCapital={pammData.investorCapital}
          managerCapital={pammData.managerCapital}
          theme={theme}
        />
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          {loadingStates.critical ? renderCardSkeleton() : (
            <Card sx={cardStyles}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalance sx={{
                    color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                    fontSize: '40px',
                    filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))'
                  }} />
                  <Box ml={2}>
                    <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
                      Total Funds
                    </Typography>
                    <Typography variant="h4" sx={{
                      color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                      fontWeight: 700,
                      mt: 1
                    }}>
                      ${pammData.totalFunds?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {loadingStates.critical ? renderCardSkeleton() : (
            <Card sx={cardStyles}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People sx={{
                    color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
                    fontSize: '40px',
                    filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
                  }} />
                  <Box ml={2}>
                    <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
                      Investors
                    </Typography>
                    <Typography variant="h4" sx={{
                      color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
                      fontWeight: 700,
                      mt: 1
                    }}>
                      {pammData.investors?.length ?? 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {loadingStates.critical ? renderCardSkeleton() : (
            <Card sx={cardStyles}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountCircle sx={{
                    color: theme === 'dark' ? '#10B981' : '#059669',
                    fontSize: '40px',
                    filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
                  }} />
                  <Box ml={2}>
                    <Typography variant="h6" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 600 }}>
                      Manager Capital
                    </Typography>
                    <Typography variant="h4" sx={{
                      color: theme === 'dark' ? '#10B981' : '#059669',
                      fontWeight: 700,
                      mt: 1
                    }}>
                      ${pammData.managerCapital?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {isManagerInitialized && (
        <Box mb={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
             <Button
            variant="contained"
            onClick={handleOpenTrade}
            startIcon={openTrade ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Money />}
            disabled={loadingStates.critical || openTrade || !isOnline}
            sx={{
              background: 'linear-gradient(to right, #3B82F6, #6366F1)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB',
              },
            }}
          >
            {openTrade ? 'Opening Trade...' : 'Execute Trade'}
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDistribution(true)}
            startIcon={isDistributing ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Money />}
            disabled={loadingStates.critical || isDistributing || !isOnline}
            sx={{
              background: 'linear-gradient(to right, #3B82F6, #6366F1)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB',
              },
            }}
          >
            {isDistributing ? 'Distributing...' : 'Distribute Profits'}
          </Button>
          <Button
            variant="contained"
            onClick={() => setBoostDialogOpen(true)}
            startIcon={boostLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <AddIcon />}
            disabled={loadingStates.critical || boostLoading || !isOnline}
            sx={{
              background: 'linear-gradient(to right, #10B981, #34D399)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #059669, #10B981)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB',
              },
            }}
          >
            {boostLoading ? 'Boosting...' : 'Boost Capital'}
          </Button>
          {currentUser?.is_admin && (
            <Button
              variant="contained"
              onClick={handleFixDistributions}
              startIcon={fixingDistributions ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Refresh />}
              disabled={fixingDistributions || !isOnline}
              sx={{
                background: 'linear-gradient(to right, #EC4899, #F472B6)',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(to right, #DB2777, #EC4899)',
                  boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                  color: '#D1D5DB',
                },
              }}
            >
              {fixingDistributions ? 'Fixing Distributions...' : 'Fix Distributions'}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={async () => {
              setRefreshLoading(true);
              await fetchPAMMData();
              setRefreshLoading(false);
            }}
            startIcon={refreshLoading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <Refresh />}
            disabled={loadingStates.critical || refreshLoading || !isOnline}
            sx={{
              background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 24px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(to right, #4B5563, #6B7280)',
                boxShadow: '0 8px 24px rgba(107, 114, 128, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB',
              },
            }}
          >
            {refreshLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
      )}

      {pammData.investors && (
        <AllocationWarning investors={pammData.investors} theme={theme} />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {loadingStates.distributions ? renderChartSkeleton() : (
            <DistributionPerformance distributions={distributions || []} theme={theme} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loadingStates.performance ? renderChartSkeleton() : (
            <PerformanceSummary performance={performance} distributions={distributions || []} theme={theme} />
          )}
        </Grid>
        <Grid item xs={12}>
          {loadingStates.distributions ? renderTableSkeleton() : (
            <RecentProfitDistributions distributions={distributions || []} theme={theme} />
          )}
        </Grid>
      </Grid>



<Dialog 
  open={openDistribution} 
  onClose={() => setOpenDistribution(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '12px',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
      boxShadow: theme === 'dark' 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
    }
  }}
>
  <DialogTitle
    sx={{
      pb: 1,
      px: 3,
      pt: 3,
      fontSize: '1.5rem',
      fontWeight: 600,
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      background: 'transparent',
      borderBottom: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <AttachMoney 
      sx={{ 
        color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
        fontSize: '1.75rem' 
      }} 
    />
    Distribute Profits
  </DialogTitle>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      const parsed = parseFloat(profitAmount?.trim());
      if (isNaN(parsed) || parsed <= 0) {
        showSnackbar('Please enter a valid profit amount greater than $0.00', 'error');
        return;
      }
      handleDistributeProfits();
    }}
  >
    <DialogContent sx={{ px: 3, py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: theme === 'dark' ? '#CBD5E1' : '#475569',
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          Enter the total profit amount to be distributed among stakeholders according to their ownership percentages.
        </Typography>
  

        <TextField
        fullWidth
        label="Profit Amount"
        value={profitAmount}
        onChange={(e) => {
            const value = e.target.value;
            if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
            setProfitAmount(value);
            }
        }}
        type="number"
        variant="outlined"
        required
        placeholder="0.00"
        inputProps={{ 
            min: 0.01, 
            step: 0.01,
            'aria-label': 'Profit amount in dollars'
        }}
        InputProps={{
            startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B', fontSize: '1.25rem' }} />,
            sx: {
            background: theme === 'dark' 
                ? 'rgba(30, 41, 59, 0.6)' 
                : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 500,
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            transition: 'all 0.2s ease-in-out',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' 
                ? 'rgba(148, 163, 184, 0.3)' 
                : 'rgba(100, 116, 139, 0.3)',
                borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                borderWidth: '2px',
            },
            '&.Muifocused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                borderWidth: '2px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? '#EF4444' : '#DC2626',
                borderWidth: '2px',
            },
            }
        }}
        InputLabelProps={{
            sx: {
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            fontWeight: 500,
            '&.Mui-focused': {
                color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
            },
            '&.Mui-error': {
                color: theme === 'dark' ? '#EF4444' : '#DC2626',
            },
            }
        }}
        disabled={isDistributing || !isOnline}
        error={!!profitAmount && parseFloat(profitAmount) <= 0}
        helperText={
            !!profitAmount && parseFloat(profitAmount) <= 0
            ? 'Amount must be greater than $0.00'
            : isDistributing
            ? 'Processing distribution...'
            : !isOnline
            ? 'No internet connection'
            : ''
        }
        // FormHelperTextProps={{
        //     sx: {
        //     color: !!profitAmount && parseFloat(profitAmount) <= 0
        //         ? (theme === 'dark' ? '#EF4444' : '#DC2626')
        //         : (theme === 'dark' ? '#94A3B8' : '#64748B'),
        //     fontSize: '0.875rem',
        //     mt: 1,
        //     }
        // }}
        slotProps={{
            formHelperText: {
              sx: {
                color: !!profitAmount && parseFloat(profitAmount) <= 0
                  ? (theme === 'dark' ? '#EF4444' : '#DC2626')
                  : (theme === 'dark' ? '#94A3B8' : '#64748B'),
                fontSize: '0.875rem',
                mt: 1,
              }
            }
          }}
        />
      </Box>
    </DialogContent>



    <DialogActions 
      sx={{ 
        px: 3, 
        py: 2,
        gap: 2,
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
      }}
    >
      <Button 
        onClick={() => setOpenDistribution(false)} 
        disabled={isDistributing}
        variant="outlined"
        sx={{
          px: 3,
          py: 1,
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          color: theme === 'dark' ? '#CBD5E1' : '#475569',
          borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)',
          '&:hover': {
            borderColor: theme === 'dark' ? '#CBD5E1' : '#475569',
            background: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)',
          },
          '&:disabled': {
            color: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
            borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)',
          },
        }}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        variant="contained"
        disabled={
          isDistributing ||
          !profitAmount?.trim() ||
          parseFloat(profitAmount) <= 0 ||
          !isOnline
        }
        sx={{
          px: 4,
          py: 1,
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          color: '#FFFFFF',
          boxShadow: theme === 'dark'
            ? '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
            : '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
          '&:hover': {
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: theme === 'dark'
              ? '0 6px 20px 0 rgba(59, 130, 246, 0.5)'
              : '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: theme === 'dark' 
              ? 'rgba(100, 116, 139, 0.3)' 
              : 'rgba(148, 163, 184, 0.3)',
            color: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
            boxShadow: 'none',
            transform: 'none',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {isDistributing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
            Processing...
          </Box>
        ) : (
          'Distribute Profits'
        )}
      </Button>
    </DialogActions>
  </form>
</Dialog>






      <Dialog
        open={initDialogOpen}
        onClose={() => setInitDialogOpen(false)}
        PaperProps={{
          sx: {
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          color: theme === 'dark' ? '#38BDF8' : '#3B82F6'
        }}>
          <AddIcon sx={{ mr: 1 }} />
          Initialize Manager Account
        </DialogTitle>
        {/* <DialogContent>
          <Typography variant="body2" sx={{
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            mb: 2
          }}>
            Enter the initial capital to set up your manager account.
          </Typography>
          <TextField
            fullWidth
            label="Initial Capital ($)"
            value={initialCapital}
            onChange={(e) => setInitialCapital(e.target.value)}
            type="number"
            variant="outlined"
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }} />,
              sx: {
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px'
              }
            }}
            InputLabelProps={{
              sx: { color: theme === 'dark' ? '#94A3B8' : '#64748B' }
            }}
            disabled={initLoading || !isOnline}
          />
        </DialogContent> */}

<DialogContent>
  <Typography variant="body2" sx={{
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    mb: 2
  }}>
    Enter the initial capital to set up your manager account.
  </Typography>
  <TextField
    fullWidth
    label="Initial Capital ($)"
    value={initialCapital}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only numbers and decimals, prevent negative or empty values
      if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
        setInitialCapital(value);
      }
    }}
    type="number"
    variant="outlined"
    inputProps={{ min: 0.01, step: 0.01 }} // Enforce positive numbers
    InputProps={{
      startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }} />,
      sx: {
        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        borderRadius: '8px'
      }
    }}
    InputLabelProps={{
      sx: { color: theme === 'dark' ? '#94A3B8' : '#64748B' }
    }}
    disabled={initLoading || !isOnline}
  />
</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setInitDialogOpen(false)}
            sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}
            disabled={initLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInitializeManager}
            variant="contained"
            disabled={initLoading || !isOnline}
            sx={{
              background: 'linear-gradient(to right, #3B82F6, #6366F1)',
              color: '#FFFFFF',
              '&:hover': {
                background: 'linear-gradient(to right, #2563EB, #4F46E5)'
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB'
              }
            }}
          >
            {initLoading ? 'Initializing...' : 'Initialize'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={boostDialogOpen}
        onClose={() => setBoostDialogOpen(false)}
        PaperProps={{
          sx: {
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            borderRadius: '12px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          color: theme === 'dark' ? '#10B981' : '#059669'
        }}>
          <AddIcon sx={{ mr: 1 }} />
          Boost Manager Capital
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: theme === 'dark' ? '#F8FAFC' : '#64748B',
              mb: 2,
            }}
          >
            Enter the amount to add to your manager capital.
          </Typography>
          <TextField
            fullWidth
            label="Boost Amount ($)"
            value={boostAmount}
            onChange={(e) => setBoostAmount(e.target.value)}
            type="number"
            variant="outlined"
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B' }} />,
              sx: {
                background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#F8FAFC' : '#64748B',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: theme === 'dark' ? '#F8FAFC' : '#64748B',
                '&.Mui-focused': {
                  color: theme === 'dark' ? '#10B981' : '#059669',
                },
              },
            }}
            disabled={!isOnline}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBoostDialogOpen(false)}
            sx={{ color: theme === 'dark' ? '#94A3B8' : '#64748B' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBoostCapital}
            variant="contained"
            disabled={!isOnline}
            sx={{
              background: 'linear-gradient(to right, #10B981, #34D399)',
              color: '#FFFFFF',
              '&:hover': {
                background: 'linear-gradient(to right, #059669, #10B981)'
              },
              '&:disabled': {
                background: 'linear-gradient(to right, #6B7280, #9CA3AF)',
                color: '#D1D5DB'
              }
            }}
          >
            Boost Capital
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: snackbar.severity === 'error' ? '#FEF2F2' : snackbar.severity === 'warning' ? '#FEF3C7' : '#ECFDF5',
            color: snackbar.severity === 'error' ? '#B91C1C' : snackbar.severity === 'warning' ? '#B45309' : '#065F46',
            border: snackbar.severity === 'error' ? '1px solid #EF4444' : snackbar.severity === 'warning' ? '1px solid #F59E0B' : '1px solid #10B981',
            borderRadius: '8px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// PropTypes and export remain unchanged
PAMMManager.propTypes = {};

export default function PAMMManagerWrapper() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <PAMMManager />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

