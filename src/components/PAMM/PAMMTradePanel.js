// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Divider,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Autocomplete,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';
// import {
//   PlayArrow as ExecuteIcon,
//   History as HistoryIcon,
//   AccountBalanceWallet as BalanceIcon,
//   TrendingUp as PerformanceIcon,
//   AttachMoney as ProfitIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import ErrorBoundary from './ErrorBoundary'; // Ensure this file exists in src/components/PAMM

// // WebSocket Client for real-time price updates

// const createWebSocketClient = (symbol) => {
//   const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
//   ws.onopen = () => {
//     ws.send(JSON.stringify({
//       op: 'subscribe',
//       args: [`tickers.${symbol}`],
//     }));
//   };
//   return ws;
// };

// // Reusable Components
// const TradeForm = ({ formData, availableSymbols, symbolsLoading, handleInputChange, handleExecuteTrade, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <ExecuteIcon sx={{ mr: 1 }} />
//         New Managed Trade
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <Autocomplete
//               options={availableSymbols}
//               value={formData.symbol}
//               onChange={(e, newValue) => handleInputChange(null, newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Symbol"
//                   aria-label="Select trading symbol"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {symbolsLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               disabled={symbolsLoading || availableSymbols.length === 0}
//               noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
//             />
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="action-label">Action</InputLabel>
//             <Select
//               labelId="action-label"
//               name="action"
//               value={formData.action}
//               onChange={handleInputChange}
//               label="Action"
//               aria-label="Select trade action"
//             >
//               <MenuItem value="buy">Buy</MenuItem>
//               <MenuItem value="sell">Sell</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="amount"
//             label="Amount (USD)"
//             type="number"
//             value={formData.amount}
//             onChange={handleInputChange}
//             InputProps={{ startAdornment: '$' }}
//             aria-label="Enter trade amount in USD"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="leverage-label">Leverage</InputLabel>
//             <Select
//               labelId="leverage-label"
//               name="leverage"
//               value={formData.leverage}
//               onChange={handleInputChange}
//               label="Leverage"
//               aria-label="Select leverage"
//             >
//               {[1, 2, 3, 5, 10].map((lev) => (
//                 <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <Tooltip title="Enable profit sharing for PAMM managed trades">
//             <FormControlLabel
//               control={
//                 <Switch
//                   name="isManaged"
//                   checked={formData.isManaged}
//                   onChange={handleInputChange}
//                   color="primary"
//                   aria-label="Toggle PAMM managed trade"
//                 />
//               }
//               label="PAMM Managed Trade (Profit Sharing)"
//             />
//           </Tooltip>
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             startIcon={<ExecuteIcon />}
//             onClick={handleExecuteTrade}
//             disabled={loading || symbolsLoading || availableSymbols.length === 0}
//             fullWidth
//             sx={{ py: 2 }}
//             aria-label="Execute trade"
//           >
//             {loading ? <CircularProgress size={24} /> : 'Execute Managed Trade'}
//           </Button>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// // const TradeHistoryTable = ({ tradeHistory }) => (
// //   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
// //     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
// //       <HistoryIcon sx={{ mr: 1 }} />
// //       Recent Managed Trades
// //     </Typography>
// //     <TableContainer component={Paper}>
// //       <Table size="small" aria-label="Trade history table">
// //         <TableHead>
// //           <TableRow>
// //             <TableCell>Date</TableCell>
// //             <TableCell>Symbol</TableCell>
// //             <TableCell align="right">Amount</TableCell>
// //             <TableCell>Type</TableCell>
// //             <TableCell align="right">Leverage</TableCell>
// //             <TableCell align="right">Profit</TableCell>
// //             <TableCell align="right">Bybit Order ID</TableCell>
// //           </TableRow>
// //         </TableHead>
// //         <TableBody>
// //           {tradeHistory.slice(0, 5).map((trade) => (
// //             <TableRow key={trade.id}>
// //               <TableCell>{trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}</TableCell>
// //               <TableCell>{trade.symbol}</TableCell>
// //               <TableCell align="right">${trade.amount.toFixed(2)}</TableCell>
// //               <TableCell
// //                 sx={{
// //                   color: trade.action === 'buy' ? 'success.main' : 'error.main',
// //                   textTransform: 'capitalize',
// //                 }}
// //               >
// //                 {trade.action}
// //               </TableCell>
// //               <TableCell align="right">{trade.leverage}x</TableCell>
// //               <TableCell
// //                 align="right"
// //                 sx={{
// //                   color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
// //                 }}
// //               >
// //                 {trade.profit ? `$${trade.profit.toFixed(2)}` : '-'}
// //               </TableCell>
// //               <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// //     </TableContainer>
// //   </Paper>
// // );

// const TradeHistoryTable = ({ tradeHistory }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <HistoryIcon sx={{ mr: 1 }} />
//       Recent Managed Trades
//     </Typography>
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="Trade history table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Symbol</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell align="right">Leverage</TableCell>
//             <TableCell align="right">Profit</TableCell>
//             <TableCell align="right">Bybit Order ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tradeHistory.slice(0, 100).map((trade) => (
//             <TableRow key={trade.tradeId || trade.bybitOrderId || Math.random()}>
//               <TableCell>
//                 {trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}
//               </TableCell>
//               <TableCell>{trade.symbol || '-'}</TableCell>
//               <TableCell align="right">
//                 {trade.executedAmount ? `$${Number(trade.executedAmount).toFixed(2)}` : '-'}
//               </TableCell>
//               <TableCell
//                 sx={{
//                   color: trade.action === 'buy' ? 'success.main' : 'error.main',
//                   textTransform: 'capitalize',
//                 }}
//               >
//                 {trade.action || '-'}
//               </TableCell>
//               <TableCell align="right">
//                 {trade.leverage ? `${Number(trade.leverage)}x` : '-'}
//               </TableCell>
//               <TableCell
//                 align="right"
//                 sx={{
//                   color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
//                 }}
//               >
//                 {trade.profit ? `$${Number(trade.profit).toFixed(2)}` : '-'}
//               </TableCell>
//               <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </Paper>
// );

// const MarketDataCard = ({ priceData, formData }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <PerformanceIcon sx={{ mr: 1 }} />
//         Market Data
//       </Typography>
//       {priceData ? (
//         <Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Last Price:</Typography>
//             <Typography fontWeight="bold">
//               ${priceData.last.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Bid:</Typography>
//             <Typography color="error">
//               ${priceData.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography>Ask:</Typography>
//             <Typography color="success.main">
//               ${priceData.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           {formData.amount && parseFloat(formData.amount) > 0 && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Trade Estimation
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Quantity:</Typography>
//                 <Typography>
//                   {(parseFloat(formData.amount) * formData.leverage / priceData.last).toFixed(6)}{' '}
//                   {formData.symbol.replace('USDT', '')}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Margin Required:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Position Size:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount) * formData.leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//             </>
//           )}
//         </Box>
//       ) : (
//         <Typography>Select a symbol to view market data</Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const AccountSummary = ({ balance, todayPnl }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <ProfitIcon sx={{ mr: 1 }} />
//       Account Summary
//     </Typography>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Available Balance:</Typography>
//       <Typography fontWeight="bold">
//         ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Investor Funds:</Typography>
//       <Typography>
//         ${(balance * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Your Allocation:</Typography>
//       <Typography>
//         ${(balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography>Today's P&L:</Typography>
//       <Typography color={todayPnl >= 0 ? 'success.main' : 'error.main'}>
//         {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//   </Paper>
// );

// const PAMMTradePanel = ({ userId, theme }) => {
//   const [formData, setFormData] = useState({
//     symbol: '',
//     action: 'buy',
//     amount: '',
//     isManaged: true,
//     leverage: 1,
//   });
//   const [availableSymbols, setAvailableSymbols] = useState([]);
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [symbolsLoading, setSymbolsLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [balance, setBalance] = useState(0);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [todayPnl, setTodayPnl] = useState(0);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const navigate = useNavigate();
//   const wsRef = useRef(null);

//   const debouncedFetchPrice = useMemo(
//     () =>
//       debounce(async (symbol) => {
//         if (!symbol) return;
//         try {
//           const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${symbol}`);
//           setPriceData(res.data);
//         } catch (error) {
//           console.error('Error fetching price:', {
//             symbol,
//             message: error.message,
//             response: error.response?.data,
//           });
//           setSnackbar({
//             open: true,
//             message: error.response?.data?.message || 'Failed to fetch price data',
//             severity: 'error',
//           });
//         }
//       }, 500),
//     []
//   );

//   const fetchData = useCallback(
//     async (retries = 3, delay = 1000) => {
//       setSymbolsLoading(true);
//       for (let i = 0; i < retries; i++) {
//         try {
//           const [balanceRes, symbolsRes, historyRes, pnlRes] = await Promise.all([
//             axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`),
//             axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols`),
//             axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm`),
//             axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/pnl`),
//           ]);
//           setBalance(balanceRes.data.balance || 0);
//           const symbols = symbolsRes.data.data || [];
//           setAvailableSymbols(symbols);
//           if (symbols.length === 0) {
//             setSnackbar({
//               open: true,
//               message: 'No trading symbols available. Please try again later.',
//               severity: 'warning',
//             });
//           } else if (!formData.symbol || !symbols.includes(formData.symbol)) {
//             setFormData((prev) => ({ ...prev, symbol: symbols[0] || '' }));
//             if (symbols[0]) debouncedFetchPrice(symbols[0]);
//           }
//           setTradeHistory(historyRes.data.data || []);
//           setTodayPnl(pnlRes.data.pnl || 0);
//           setSymbolsLoading(false);
//           return;
//         } catch (error) {
//           console.error(`Fetch attempt ${i + 1} failed:`, {
//             message: error.message,
//             response: error.response?.data,
//             status: error.response?.status,
//             url: error.config?.url,
//           });
//           if (i < retries - 1) {
//             await new Promise((res) => setTimeout(res, delay * (i + 1)));
//           } else {
//             setSnackbar({
//               open: true,
//               message: error.response?.data?.message || 'Failed to load data. Please try again.',
//               severity: 'error',
//             });
//             setSymbolsLoading(false);
//           }
//         }
//       }
//     },
//     [userId, setBalance, setAvailableSymbols, setTradeHistory, setTodayPnl, setSnackbar, setSymbolsLoading, debouncedFetchPrice, formData.symbol]
//   );

//   useEffect(() => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       setSymbolsLoading(false);
//       return;
//     }
//     fetchData();
//   }, [userId, fetchData]);

//   useEffect(() => {
//     if (!formData.symbol) return;
//     wsRef.current = createWebSocketClient(formData.symbol);
//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.topic === `tickers.${formData.symbol}` && data.data) {
//         setPriceData({
//           bid: parseFloat(data.data.bidPrice),
//           ask: parseFloat(data.data.askPrice),
//           last: parseFloat(data.data.lastPrice),
//         });
//       }
//     };
//     wsRef.current.onerror = () => {
//       setSnackbar({
//         open: true,
//         message: 'WebSocket connection failed. Falling back to HTTP polling.',
//         severity: 'warning',
//       });
//       debouncedFetchPrice(formData.symbol);
//     };
//     return () => {
//       wsRef.current?.close();
//     };
//   }, [formData.symbol, debouncedFetchPrice]);

//   const handleInputChange = (e, newValue) => {
//     if (e && e.target) {
//       const { name, value, type, checked } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     } else if (newValue) {
//       setFormData((prev) => ({ ...prev, symbol: newValue }));
//       debouncedFetchPrice(newValue);
//     }
//   };

//   const executeTrade = async () => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.symbol) {
//       setSnackbar({
//         open: true,
//         message: 'Please select a valid symbol',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please enter a valid amount',
//         severity: 'error',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       console.log('Executing trade with payload:', {
//         userId,
//         symbol: formData.symbol,
//         action: formData.action,
//         amount: parseFloat(formData.amount),
//         isManaged: formData.isManaged,
//         leverage: parseInt(formData.leverage.toString()),
//       });
//       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trade-pamm`, {
//         userId,
//         symbol: formData.symbol,
//         action: formData.action,
//         amount: parseFloat(formData.amount),
//         isManaged: formData.isManaged,
//         leverage: parseInt(formData.leverage.toString()),
//       });
//       setSnackbar({
//         open: true,
//         message: `Trade executed successfully! ID: ${response.data.tradeId} (Bybit: ${response.data.bybitOrderId})`,
//         severity: 'success',
//       });
//       const [balanceRes, historyRes] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm`),
//       ]);
//       setBalance(balanceRes.data.balance || 0);
//       setTradeHistory(historyRes.data.data || []);
//     } catch (error) {
//       console.error('Error executing trade:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         request: error.config,
//       });
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Trade execution failed',
//         severity: 'error',
//       });
//     } finally {
//       setLoading(false);
//       setConfirmDialogOpen(false);
//     }
//   };

//   const handleExecuteTrade = () => {
//     setConfirmDialogOpen(true);
//   };

//   return (
//     <ErrorBoundary>
//       <Box sx={{ p: 3 }} role="main" aria-label="PAMM Trading Portal">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: theme === 'dark'
//               ? 'linear-gradient(to right, #1a3a72, #0d1b3a)'
//               : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
//             PAMM Managed Trading Portal (mainnet)
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Execute trades on Bybit mainnet with profit sharing
//           </Typography>
//         </Paper>
//         {!userId || userId === 'undefined' ? (
//           <Typography color="error" role="alert">
//             Error: Invalid user ID. Please log in or provide a valid user ID.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={8}>
//               <TradeForm
//                 formData={formData}
//                 availableSymbols={availableSymbols}
//                 symbolsLoading={symbolsLoading}
//                 handleInputChange={handleInputChange}
//                 handleExecuteTrade={handleExecuteTrade}
//                 loading={loading}
//               />
//               {availableSymbols.length === 0 && !symbolsLoading && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchData()}
//                   sx={{ mt: 1 }}
//                   aria-label="Retry fetching symbols"
//                 >
//                   Retry Fetching Symbols
//                 </Button>
//               )}
//               <TradeHistoryTable tradeHistory={tradeHistory} />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <MarketDataCard priceData={priceData} formData={formData} />
//               <AccountSummary balance={balance} todayPnl={todayPnl} />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mt: 3, py: 2 }}
//                 startIcon={<HistoryIcon />}
//                 onClick={() => navigate('/dashboard/pamm-manager')}
//                 aria-label="Back to PAMM Dashboard"
//               >
//                 Back to PAMM Dashboard
//               </Button>
//             </Grid>
//           </Grid>
//         )}
//         <Dialog
//           open={confirmDialogOpen}
//           onClose={() => setConfirmDialogOpen(false)}
//           aria-labelledby="confirm-trade-dialog"
//         >
//           <DialogTitle id="confirm-trade-dialog">Confirm Trade</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Execute {formData.action} order for ${formData.amount} of {formData.symbol} with {formData.leverage}x leverage?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" aria-label="Cancel trade">
//               Cancel
//             </Button>
//             <Button onClick={executeTrade} color="primary" aria-label="Confirm trade">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           aria-live="polite"
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default PAMMTradePanel;



// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Divider,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Autocomplete,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   LinearProgress,
// } from '@mui/material';
// import {
//   PlayArrow as ExecuteIcon,
//   History as HistoryIcon,
//   AccountBalanceWallet as BalanceIcon,
//   TrendingUp as PerformanceIcon,
//   AttachMoney as ProfitIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import ErrorBoundary from './ErrorBoundary';

// // WebSocket Client with reconnection logic
// const createWebSocketClient = (symbol) => {
//   const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
//   let reconnectAttempts = 0;
//   const maxReconnectAttempts = 5;

//   ws.onopen = () => {
//     reconnectAttempts = 0;
//     ws.send(JSON.stringify({
//       op: 'subscribe',
//       args: [`tickers.${symbol}`],
//     }));
//   };

//   ws.onerror = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   ws.onclose = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   return ws;
// };

// // Reusable Components
// const TradeForm = ({ formData, availableSymbols, symbolsLoading, handleInputChange, handleExecuteTrade, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <ExecuteIcon sx={{ mr: 1 }} />
//         New Managed Trade
//       </Typography>
//       {symbolsLoading && <LinearProgress sx={{ mb: 2 }} />}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <Autocomplete
//               options={availableSymbols}
//               value={formData.symbol}
//               onChange={(e, newValue) => handleInputChange(null, newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Symbol"
//                   aria-label="Select trading symbol"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {symbolsLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               disabled={symbolsLoading || availableSymbols.length === 0}
//               noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
//             />
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="action-label">Action</InputLabel>
//             <Select
//               labelId="action-label"
//               name="action"
//               value={formData.action}
//               onChange={handleInputChange}
//               label="Action"
//               aria-label="Select trade action"
//             >
//               <MenuItem value="buy">Buy</MenuItem>
//               <MenuItem value="sell">Sell</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="amount"
//             label="Amount (USD)"
//             type="number"
//             value={formData.amount}
//             onChange={handleInputChange}
//             InputProps={{ startAdornment: '$' }}
//             aria-label="Enter trade amount in USD"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="leverage-label">Leverage</InputLabel>
//             <Select
//               labelId="leverage-label"
//               name="leverage"
//               value={formData.leverage}
//               onChange={handleInputChange}
//               label="Leverage"
//               aria-label="Select leverage"
//             >
//               {[1, 2, 3, 5, 10].map((lev) => (
//                 <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <Tooltip title="Enable profit sharing for PAMM managed trades">
//             <FormControlLabel
//               control={
//                 <Switch
//                   name="isManaged"
//                   checked={formData.isManaged}
//                   onChange={handleInputChange}
//                   color="primary"
//                   aria-label="Toggle PAMM managed trade"
//                 />
//               }
//               label="PAMM Managed Trade (Profit Sharing)"
//             />
//           </Tooltip>
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             startIcon={<ExecuteIcon />}
//             onClick={handleExecuteTrade}
//             disabled={loading || symbolsLoading || availableSymbols.length === 0}
//             fullWidth
//             sx={{ py: 2 }}
//             aria-label="Execute trade"
//           >
//             {loading ? <CircularProgress size={24} /> : 'Execute Managed Trade'}
//           </Button>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// const TradeHistoryTable = React.memo(({ tradeHistory, page, handlePageChange, pageSize, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <HistoryIcon sx={{ mr: 1 }} />
//       Recent Managed Trades
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="Trade history table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Symbol</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell align="right">Leverage</TableCell>
//             <TableCell align="right">Profit</TableCell>
//             <TableCell align="right">Bybit Order ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tradeHistory.length === 0 && !loading ? (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No trades found
//               </TableCell>
//             </TableRow>
//           ) : (
//             tradeHistory.map((trade) => (
//               <TableRow key={trade.tradeId || trade.bybitOrderId || Math.random()}>
//                 <TableCell>
//                   {trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}
//                 </TableCell>
//                 <TableCell>{trade.symbol || '-'}</TableCell>
//                 <TableCell align="right">
//                   {trade.executedAmount ? `$${Number(trade.executedAmount).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     color: trade.action === 'buy' ? 'success.main' : 'error.main',
//                     textTransform: 'capitalize',
//                   }}
//                 >
//                   {trade.action || '-'}
//                 </TableCell>
//                 <TableCell align="right">
//                   {trade.leverage ? `${Number(trade.leverage)}x` : '-'}
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
//                   }}
//                 >
//                   {trade.profit ? `$${Number(trade.profit).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <Pagination
//       count={Math.ceil(100 / pageSize)} // Assume max 100 trades for simplicity
//       page={page}
//       onChange={handlePageChange}
//       sx={{ mt: 2 }}
//       aria-label="Trade history pagination"
//       disabled={loading}
//     />
//   </Paper>
// ));

// const MarketDataCard = ({ priceData, formData, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <PerformanceIcon sx={{ mr: 1 }} />
//         Market Data
//       </Typography>
//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {priceData ? (
//         <Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Last Price:</Typography>
//             <Typography fontWeight="bold">
//               ${priceData.last.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Bid:</Typography>
//             <Typography color="error">
//               ${priceData.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography>Ask:</Typography>
//             <Typography color="success.main">
//               ${priceData.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           {formData.amount && parseFloat(formData.amount) > 0 && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Trade Estimation
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Quantity:</Typography>
//                 <Typography>
//                   {(parseFloat(formData.amount) * formData.leverage / priceData.last).toFixed(6)}{' '}
//                   {formData.symbol.replace('USDT', '')}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Margin Required:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Position Size:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount) * formData.leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//             </>
//           )}
//         </Box>
//       ) : (
//         <Typography>Select a symbol to view market data</Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const AccountSummary = ({ balance, todayPnl, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <ProfitIcon sx={{ mr: 1 }} />
//       Account Summary
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Available Balance:</Typography>
//       <Typography fontWeight="bold">
//         ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Investor Funds:</Typography>
//       <Typography>
//         ${(balance * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Your Allocation:</Typography>
//       <Typography>
//         ${(balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography>Today's P&L:</Typography>
//       <Typography color={todayPnl >= 0 ? 'success.main' : 'error.main'}>
//         {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//   </Paper>
// );

// const PAMMTradePanel = ({ userId, theme }) => {
//   const [formData, setFormData] = useState({
//     symbol: '',
//     action: 'buy',
//     amount: '',
//     isManaged: true,
//     leverage: 1,
//   });
//   const [availableSymbols, setAvailableSymbols] = useState([]);
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [symbolsLoading, setSymbolsLoading] = useState(true);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [balance, setBalance] = useState(0);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [todayPnl, setTodayPnl] = useState(0);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const navigate = useNavigate();
//   const wsRef = useRef(null);

//   const debouncedFetchPrice = useMemo(
//     () => debounce(async (symbol) => {
//       if (!symbol) return;
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${symbol}`);
//         setPriceData(res.data);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to fetch price data',
//           severity: 'error',
//         });
//       }
//     }, 1000),
//     []
//   );

//   const fetchData = useCallback(
//     async (currentPage = 1) => {
//       setDataLoading(true);
//       try {
//         // Stagger API calls to avoid overloading
//         const symbolsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols`);
//         const symbols = symbolsRes.data.data || [];
//         setAvailableSymbols(symbols);
//         if (symbols.length === 0) {
//           setSnackbar({
//             open: true,
//             message: 'No trading symbols available. Please try again later.',
//             severity: 'warning',
//           });
//         } else if (!formData.symbol || !symbols.includes(formData.symbol)) {
//           setFormData((prev) => ({ ...prev, symbol: symbols[0] || '' }));
//           if (symbols[0]) debouncedFetchPrice(symbols[0]);
//         }
//         setSymbolsLoading(false);

//         // Fetch balance, trades, and P&L sequentially
//         const balanceRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`);
//         setBalance(balanceRes.data.balance || 0);

//         const historyRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm&page=${currentPage}&page_size=${pageSize}`);
//         setTradeHistory(historyRes.data.data || []);

//         const pnlRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/pnl`);
//         setTodayPnl(pnlRes.data.pnl || 0);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to load data. Please try again.',
//           severity: 'error',
//         });
//       } finally {
//         setDataLoading(false);
//       }
//     },
//     [userId, debouncedFetchPrice, formData.symbol, pageSize]
//   );

//   useEffect(() => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       setSymbolsLoading(false);
//       setDataLoading(false);
//       return;
//     }
//     fetchData(page);
//   }, [userId, fetchData, page]);

//   useEffect(() => {
//     if (!formData.symbol) return;
//     wsRef.current = createWebSocketClient(formData.symbol);
//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.topic === `tickers.${formData.symbol}` && data.data) {
//         setPriceData({
//           bid: parseFloat(data.data.bidPrice),
//           ask: parseFloat(data.data.askPrice),
//           last: parseFloat(data.data.lastPrice),
//         });
//       }
//     };
//     wsRef.current.onerror = () => {
//       setSnackbar({
//         open: true,
//         message: 'WebSocket connection failed. Falling back to HTTP polling.',
//         severity: 'warning',
//       });
//       debouncedFetchPrice(formData.symbol);
//     };
//     return () => {
//       wsRef.current?.close();
//     };
//   }, [formData.symbol, debouncedFetchPrice]);

//   const handleInputChange = (e, newValue) => {
//     if (e && e.target) {
//       const { name, value, type, checked } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     } else if (newValue) {
//       setFormData((prev) => ({ ...prev, symbol: newValue }));
//       debouncedFetchPrice(newValue);
//     }
//   };

//   const executeTrade = async () => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.symbol) {
//       setSnackbar({
//         open: true,
//         message: 'Please select a valid symbol',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please enter a valid amount',
//         severity: 'error',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trade-pamm`, {
//         userId,
//         symbol: formData.symbol,
//         action: formData.action,
//         amount: parseFloat(formData.amount),
//         isManaged: formData.isManaged,
//         leverage: parseInt(formData.leverage.toString()),
//       });
//       setSnackbar({
//         open: true,
//         message: `Trade executed successfully! ID: ${response.data.data.tradeId} (Bybit: ${response.data.data.bybitOrderId})`,
//         severity: 'success',
//       });
//       await fetchData(1); // Refresh data after trade
//       setPage(1); // Reset to first page
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Trade execution failed',
//         severity: 'error',
//       });
//     } finally {
//       setLoading(false);
//       setConfirmDialogOpen(false);
//     }
//   };

//   const handleExecuteTrade = () => {
//     setConfirmDialogOpen(true);
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     fetchData(newPage);
//   };

//   return (
//     <ErrorBoundary>
//       <Box sx={{ p: 3 }} role="main" aria-label="PAMM Trading Portal">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: theme === 'dark'
//               ? 'linear-gradient(to right, #1a3a72, #0d1b3a)'
//               : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
//             PAMM Managed Trading Portal (mainnet)
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Execute trades on Bybit mainnet with profit sharing
//           </Typography>
//         </Paper>
//         {!userId || userId === 'undefined' ? (
//           <Typography color="error" role="alert">
//             Error: Invalid user ID. Please log in or provide a valid user ID.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={8}>
//               <TradeForm
//                 formData={formData}
//                 availableSymbols={availableSymbols}
//                 symbolsLoading={symbolsLoading}
//                 handleInputChange={handleInputChange}
//                 handleExecuteTrade={handleExecuteTrade}
//                 loading={loading}
//               />
//               {availableSymbols.length === 0 && !symbolsLoading && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchData(page)}
//                   sx={{ mt: 1 }}
//                   aria-label="Retry fetching symbols"
//                 >
//                   Retry Fetching Symbols
//                 </Button>
//               )}
//               <TradeHistoryTable
//                 tradeHistory={tradeHistory}
//                 page={page}
//                 handlePageChange={handlePageChange}
//                 pageSize={pageSize}
//                 loading={dataLoading}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <MarketDataCard priceData={priceData} formData={formData} loading={dataLoading} />
//               <AccountSummary balance={balance} todayPnl={todayPnl} loading={dataLoading} />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mt: 3, py: 2 }}
//                 startIcon={<HistoryIcon />}
//                 onClick={() => navigate('/dashboard/pamm-manager')}
//                 aria-label="Back to PAMM Dashboard"
//               >
//                 Back to PAMM Dashboard
//               </Button>
//             </Grid>
//           </Grid>
//         )}
//         <Dialog
//           open={confirmDialogOpen}
//           onClose={() => setConfirmDialogOpen(false)}
//           aria-labelledby="confirm-trade-dialog"
//         >
//           <DialogTitle id="confirm-trade-dialog">Confirm Trade</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Execute {formData.action} order for ${formData.amount} of {formData.symbol} with {formData.leverage}x leverage?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" aria-label="Cancel trade">
//               Cancel
//             </Button>
//             <Button onClick={executeTrade} color="primary" aria-label="Confirm trade">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           aria-live="polite"
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default PAMMTradePanel;




// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Divider,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Autocomplete,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   LinearProgress,
// } from '@mui/material';
// import {
//   PlayArrow as ExecuteIcon,
//   History as HistoryIcon,
//   AccountBalanceWallet as BalanceIcon,
//   TrendingUp as PerformanceIcon,
//   AttachMoney as ProfitIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import ErrorBoundary from './ErrorBoundary';

// // Configure axios-retry
// axiosRetry(axios, {
//   retries: 5,
//   retryDelay: (retryCount) => Math.min(1000 * (2 ** retryCount), 5000), // Cap at 5s
//   retryCondition: (error) => {
//     return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
//            error.code === 'ECONNRESET' || 
//            error.code === 'ECONNREFUSED';
//   },
// });

// // Delay function for staggering API calls
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // WebSocket Client with reconnection logic
// const createWebSocketClient = (symbol) => {
//   const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
//   let reconnectAttempts = 0;
//   const maxReconnectAttempts = 5;

//   ws.onopen = () => {
//     reconnectAttempts = 0;
//     ws.send(JSON.stringify({
//       op: 'subscribe',
//       args: [`tickers.${symbol}`],
//     }));
//   };

//   ws.onerror = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   ws.onclose = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   return ws;
// };

// // Reusable Components
// const TradeForm = ({ formData, availableSymbols, symbolsLoading, handleInputChange, handleExecuteTrade, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <ExecuteIcon sx={{ mr: 1 }} />
//         New Managed Trade
//       </Typography>
//       {symbolsLoading && <LinearProgress sx={{ mb: 2 }} />}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <Autocomplete
//               options={availableSymbols}
//               value={formData.symbol}
//               onChange={(e, newValue) => handleInputChange(null, newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Symbol"
//                   aria-label="Select trading symbol"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {symbolsLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               disabled={symbolsLoading || availableSymbols.length === 0}
//               noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
//             />
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="action-label">Action</InputLabel>
//             <Select
//               labelId="action-label"
//               name="action"
//               value={formData.action}
//               onChange={handleInputChange}
//               label="Action"
//               aria-label="Select trade action"
//             >
//               <MenuItem value="buy">Buy</MenuItem>
//               <MenuItem value="sell">Sell</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="amount"
//             label="Amount (USD)"
//             type="number"
//             value={formData.amount}
//             onChange={handleInputChange}
//             InputProps={{ startAdornment: '$' }}
//             aria-label="Enter trade amount in USD"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="leverage-label">Leverage</InputLabel>
//             <Select
//               labelId="leverage-label"
//               name="leverage"
//               value={formData.leverage}
//               onChange={handleInputChange}
//               label="Leverage"
//               aria-label="Select leverage"
//             >
//               {[1, 2, 3, 5, 10].map((lev) => (
//                 <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <Tooltip title="Enable profit sharing for PAMM managed trades">
//             <FormControlLabel
//               control={
//                 <Switch
//                   name="isManaged"
//                   checked={formData.isManaged}
//                   onChange={handleInputChange}
//                   color="primary"
//                   aria-label="Toggle PAMM managed trade"
//                 />
//               }
//               label="PAMM Managed Trade (Profit Sharing)"
//             />
//           </Tooltip>
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             startIcon={<ExecuteIcon />}
//             onClick={handleExecuteTrade}
//             disabled={loading || symbolsLoading || availableSymbols.length === 0}
//             fullWidth
//             sx={{ py: 2 }}
//             aria-label="Execute trade"
//           >
//             {loading ? <CircularProgress size={24} /> : 'Execute Managed Trade'}
//           </Button>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// const TradeHistoryTable = React.memo(({ tradeHistory, page, handlePageChange, pageSize, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <HistoryIcon sx={{ mr: 1 }} />
//       Recent Managed Trades
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="Trade history table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Symbol</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell align="right">Leverage</TableCell>
//             <TableCell align="right">Profit</TableCell>
//             <TableCell align="right">Bybit Order ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tradeHistory.length === 0 && !loading ? (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No trades found
//               </TableCell>
//             </TableRow>
//           ) : (
//             tradeHistory.map((trade) => (
//               <TableRow key={trade.tradeId || trade.bybitOrderId || Math.random()}>
//                 <TableCell>
//                   {trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}
//                 </TableCell>
//                 <TableCell>{trade.symbol || '-'}</TableCell>
//                 <TableCell align="right">
//                   {trade.executedAmount ? `$${Number(trade.executedAmount).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     color: trade.action === 'buy' ? 'success.main' : 'error.main',
//                     textTransform: 'capitalize',
//                   }}
//                 >
//                   {trade.action || '-'}
//                 </TableCell>
//                 <TableCell align="right">
//                   {trade.leverage ? `${Number(trade.leverage)}x` : '-'}
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
//                   }}
//                 >
//                   {trade.profit ? `$${Number(trade.profit).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <Pagination
//       count={Math.ceil(100 / pageSize)} // Assume max 100 trades
//       page={page}
//       onChange={handlePageChange}
//       sx={{ mt: 2 }}
//       aria-label="Trade history pagination"
//       disabled={loading}
//     />
//   </Paper>
// ));

// const MarketDataCard = ({ priceData, formData, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <PerformanceIcon sx={{ mr: 1 }} />
//         Market Data
//       </Typography>
//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {priceData ? (
//         <Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Last Price:</Typography>
//             <Typography fontWeight="bold">
//               ${priceData.last.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Bid:</Typography>
//             <Typography color="error">
//               ${priceData.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography>Ask:</Typography>
//             <Typography color="success.main">
//               ${priceData.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           {formData.amount && parseFloat(formData.amount) > 0 && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Trade Estimation
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Quantity:</Typography>
//                 <Typography>
//                   {(parseFloat(formData.amount) * formData.leverage / priceData.last).toFixed(6)}{' '}
//                   {formData.symbol.replace('USDT', '')}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Margin Required:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Position Size:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount) * formData.leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//             </>
//           )}
//         </Box>
//       ) : (
//         <Typography>Select a symbol to view market data</Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const AccountSummary = ({ balance, todayPnl, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <ProfitIcon sx={{ mr: 1 }} />
//       Account Summary
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Available Balance:</Typography>
//       <Typography fontWeight="bold">
//         ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Investor Funds:</Typography>
//       <Typography>
//         ${(balance * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Your Allocation:</Typography>
//       <Typography>
//         ${(balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography>Today's P&L:</Typography>
//       <Typography color={todayPnl >= 0 ? 'success.main' : 'error.main'}>
//         {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//   </Paper>
// );

// const PAMMTradePanel = ({ userId, theme }) => {
//   const [formData, setFormData] = useState({
//     symbol: '',
//     action: 'buy',
//     amount: '',
//     isManaged: true,
//     leverage: 1,
//   });
//   const [availableSymbols, setAvailableSymbols] = useState([]);
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [symbolsLoading, setSymbolsLoading] = useState(true);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [connectionError, setConnectionError] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [balance, setBalance] = useState(0);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [todayPnl, setTodayPnl] = useState(0);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const navigate = useNavigate();
//   const wsRef = useRef(null);

//   const debouncedFetchPrice = useMemo(
//     () => debounce(async (symbol) => {
//       if (!symbol) return;
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${symbol}`);
//         setPriceData(res.data);
//         setConnectionError(false);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to fetch price data. Please check your connection.',
//           severity: 'error',
//         });
//         setConnectionError(true);
//       }
//     }, 1000),
//     []
//   );

//   const fetchData = useCallback(
//     async (currentPage = 1) => {
//       setDataLoading(true);
//       setConnectionError(false);
//       try {
//         // Stagger API calls to reduce server load
//         const symbolsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols`);
//         const symbols = symbolsRes.data.data || [];
//         setAvailableSymbols(symbols);
//         if (symbols.length === 0) {
//           setSnackbar({
//             open: true,
//             message: 'No trading symbols available. Please try again later.',
//             severity: 'warning',
//           });
//         } else if (!formData.symbol || !symbols.includes(formData.symbol)) {
//           setFormData((prev) => ({ ...prev, symbol: symbols[0] || '' }));
//           if (symbols[0]) debouncedFetchPrice(symbols[0]);
//         }
//         setSymbolsLoading(false);

//         await delay(500); // Delay before next call
//         const balanceRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`);
//         setBalance(balanceRes.data.balance || 0);

//         await delay(500); // Delay before next call
//         const historyRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm&page=${currentPage}&page_size=${pageSize}`);
//         setTradeHistory(historyRes.data.data || []);

//         await delay(500); // Delay before next call
//         const pnlRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/pnl`);
//         setTodayPnl(pnlRes.data.pnl || 0);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to connect to server. Please check if the server is running.',
//           severity: 'error',
//         });
//         setConnectionError(true);
//       } finally {
//         setDataLoading(false);
//       }
//     },
//     [userId, debouncedFetchPrice, formData.symbol, pageSize]
//   );

//   useEffect(() => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       setSymbolsLoading(false);
//       setDataLoading(false);
//       return;
//     }
//     fetchData(page);
//   }, [userId, fetchData, page]);

//   useEffect(() => {
//     if (!formData.symbol) return;
//     wsRef.current = createWebSocketClient(formData.symbol);
//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.topic === `tickers.${formData.symbol}` && data.data) {
//         setPriceData({
//           bid: parseFloat(data.data.bidPrice),
//           ask: parseFloat(data.data.askPrice),
//           last: parseFloat(data.data.lastPrice),
//         });
//         setConnectionError(false);
//       }
//     };
//     wsRef.current.onerror = () => {
//       setSnackbar({
//         open: true,
//         message: 'WebSocket connection failed. Falling back to HTTP polling.',
//         severity: 'warning',
//       });
//       debouncedFetchPrice(formData.symbol);
//     };
//     return () => {
//       wsRef.current?.close();
//     };
//   }, [formData.symbol, debouncedFetchPrice]);

//   const handleInputChange = (e, newValue) => {
//     if (e && e.target) {
//       const { name, value, type, checked } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     } else if (newValue) {
//       setFormData((prev) => ({ ...prev, symbol: newValue }));
//       debouncedFetchPrice(newValue);
//     }
//   };

//   const executeTrade = async () => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.symbol) {
//       setSnackbar({
//         open: true,
//         message: 'Please select a valid symbol',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please enter a valid amount',
//         severity: 'error',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trade-pamm`, {
//         userId,
//         symbol: formData.symbol,
//         action: formData.action,
//         amount: parseFloat(formData.amount),
//         isManaged: formData.isManaged,
//         leverage: parseInt(formData.leverage.toString()),
//       });
//       setSnackbar({
//         open: true,
//         message: `Trade executed successfully! ID: ${response.data.data.tradeId} (Bybit: ${response.data.data.bybitOrderId})`,
//         severity: 'success',
//       });
//       await fetchData(1); // Refresh data after trade
//       setPage(1); // Reset to first page
//       setConnectionError(false);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || 'Trade execution failed. Please check server connection.',
//         severity: 'error',
//       });
//       setConnectionError(true);
//     } finally {
//       setLoading(false);
//       setConfirmDialogOpen(false);
//     }
//   };

//   const handleExecuteTrade = () => {
//     setConfirmDialogOpen(true);
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     fetchData(newPage);
//   };

//   const handleRetry = () => {
//     setConnectionError(false);
//     fetchData(page);
//   };

//   return (
//     <ErrorBoundary>
//       <Box sx={{ p: 3 }} role="main" aria-label="PAMM Trading Portal">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: theme === 'dark'
//               ? 'linear-gradient(to right, #1a3a72, #0d1b3a)'
//               : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
//             PAMM Managed Trading Portal (mainnet)
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Execute trades on Bybit mainnet with profit sharing
//           </Typography>
//         </Paper>
//         {connectionError && (
//           <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'error.light' }}>
//             <Typography color="error" role="alert">
//               Unable to connect to the server. Please ensure the backend is running on http://localhost:5000 and try again.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<RefreshIcon />}
//               onClick={handleRetry}
//               sx={{ mt: 2 }}
//               aria-label="Retry connecting to server"
//             >
//               Retry
//             </Button>
//           </Paper>
//         )}
//         {!userId || userId === 'undefined' ? (
//           <Typography color="error" role="alert">
//             Error: Invalid user ID. Please log in or provide a valid user ID.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={8}>
//               <TradeForm
//                 formData={formData}
//                 availableSymbols={availableSymbols}
//                 symbolsLoading={symbolsLoading}
//                 handleInputChange={handleInputChange}
//                 handleExecuteTrade={handleExecuteTrade}
//                 loading={loading}
//               />
//               {availableSymbols.length === 0 && !symbolsLoading && !connectionError && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchData(page)}
//                   sx={{ mt: 1 }}
//                   aria-label="Retry fetching symbols"
//                 >
//                   Retry Fetching Symbols
//                 </Button>
//               )}
//               <TradeHistoryTable
//                 tradeHistory={tradeHistory}
//                 page={page}
//                 handlePageChange={handlePageChange}
//                 pageSize={pageSize}
//                 loading={dataLoading}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <MarketDataCard priceData={priceData} formData={formData} loading={dataLoading} />
//               <AccountSummary balance={balance} todayPnl={todayPnl} loading={dataLoading} />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mt: 3, py: 2 }}
//                 startIcon={<HistoryIcon />}
//                 onClick={() => navigate('/dashboard/pamm-manager')}
//                 aria-label="Back to PAMM Dashboard"
//               >
//                 Back to PAMM Dashboard
//               </Button>
//             </Grid>
//           </Grid>
//         )}
//         <Dialog
//           open={confirmDialogOpen}
//           onClose={() => setConfirmDialogOpen(false)}
//           aria-labelledby="confirm-trade-dialog"
//         >
//           <DialogTitle id="confirm-trade-dialog">Confirm Trade</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Execute {formData.action} order for ${formData.amount} of {formData.symbol} with {formData.leverage}x leverage?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" aria-label="Cancel trade">
//               Cancel
//             </Button>
//             <Button onClick={executeTrade} color="primary" aria-label="Confirm trade" disabled={connectionError}>
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           aria-live="polite"
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default PAMMTradePanel;





// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Divider,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableRow,
//   Autocomplete,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   LinearProgress,
// } from '@mui/material';
// import {
//   PlayArrow as ExecuteIcon,
//   History as HistoryIcon,
//   AccountBalanceWallet as BalanceIcon,
//   TrendingUp as PerformanceIcon,
//   AttachMoney as ProfitIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import ErrorBoundary from './ErrorBoundary';

// // Configure axios-retry
// axiosRetry(axios, {
//   retries: 5,
//   retryDelay: (retryCount) => Math.min(1000 * (2 ** retryCount), 5000), // Cap at 5s
//   retryCondition: (error) => {
//     return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
//            error.code === 'ECONNRESET' || 
//            error.code === 'ECONNREFUSED';
//   },
// });

// // Delay function for staggering API calls
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // WebSocket Client with reconnection logic
// const createWebSocketClient = (symbol) => {
//   const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
//   let reconnectAttempts = 0;
//   const maxReconnectAttempts = 5;

//   ws.onopen = () => {
//     reconnectAttempts = 0;
//     ws.send(JSON.stringify({
//       op: 'subscribe',
//       args: [`tickers.${symbol}`],
//     }));
//   };

//   ws.onerror = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   ws.onclose = () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         createWebSocketClient(symbol);
//       }, 1000 * (reconnectAttempts + 1));
//     }
//   };

//   return ws;
// };

// // Reusable Components
// const TradeForm = ({ formData, availableSymbols, symbolsLoading, handleInputChange, handleExecuteTrade, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <ExecuteIcon sx={{ mr: 1 }} />
//         New Managed Trade
//       </Typography>
//       {symbolsLoading && <LinearProgress sx={{ mb: 2 }} />}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <Autocomplete
//               options={availableSymbols}
//               value={formData.symbol}
//               onChange={(e, newValue) => handleInputChange(null, newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Symbol"
//                   aria-label="Select trading symbol"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {symbolsLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               disabled={symbolsLoading || availableSymbols.length === 0}
//               noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
//             />
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="action-label">Action</InputLabel>
//             <Select
//               labelId="action-label"
//               name="action"
//               value={formData.action}
//               onChange={handleInputChange}
//               label="Action"
//               aria-label="Select trade action"
//             >
//               <MenuItem value="buy">Buy</MenuItem>
//               <MenuItem value="sell">Sell</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="amount"
//             label="Amount (USD)"
//             type="number"
//             value={formData.amount}
//             onChange={handleInputChange}
//             InputProps={{ startAdornment: '$' }}
//             aria-label="Enter trade amount in USD"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="leverage-label">Leverage</InputLabel>
//             <Select
//               labelId="leverage-label"
//               name="leverage"
//               value={formData.leverage}
//               onChange={handleInputChange}
//               label="Leverage"
//               aria-label="Select leverage"
//             >
//               {[1, 2, 3, 5, 10].map((lev) => (
//                 <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <Tooltip title="Enable profit sharing for PAMM managed trades">
//             <FormControlLabel
//               control={
//                 <Switch
//                   name="isManaged"
//                   checked={formData.isManaged}
//                   onChange={handleInputChange}
//                   color="primary"
//                   aria-label="Toggle PAMM managed trade"
//                 />
//               }
//               label="PAMM Managed Trade (Profit Sharing)"
//             />
//           </Tooltip>
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             startIcon={<ExecuteIcon />}
//             onClick={handleExecuteTrade}
//             disabled={loading || symbolsLoading || availableSymbols.length === 0}
//             fullWidth
//             sx={{ py: 2 }}
//             aria-label="Execute trade"
//           >
//             {loading ? <CircularProgress size={24} /> : 'Execute Managed Trade'}
//           </Button>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// const TradeHistoryTable = React.memo(({ tradeHistory, page, handlePageChange, pageSize, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <HistoryIcon sx={{ mr: 1 }} />
//       Recent Managed Trades
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="Trade history table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Symbol</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell align="right">Leverage</TableCell>
//             <TableCell align="right">Profit</TableCell>
//             <TableCell align="right">Bybit Order ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tradeHistory.length === 0 && !loading ? (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No trades found
//               </TableCell>
//             </TableRow>
//           ) : (
//             tradeHistory.map((trade) => (
//               <TableRow key={trade.tradeId || trade.bybitOrderId || Math.random()}>
//                 <TableCell>
//                   {trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}
//                 </TableCell>
//                 <TableCell>{trade.symbol || '-'}</TableCell>
//                 <TableCell align="right">
//                   {trade.executedAmount ? `$${Number(trade.executedAmount).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     color: trade.action === 'buy' ? 'success.main' : 'error.main',
//                     textTransform: 'capitalize',
//                   }}
//                 >
//                   {trade.action || '-'}
//                 </TableCell>
//                 <TableCell align="right">
//                   {trade.leverage ? `${Number(trade.leverage)}x` : '-'}
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
//                   }}
//                 >
//                   {trade.profit ? `$${Number(trade.profit).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <Pagination
//       count={Math.ceil(100 / pageSize)} // Assume max 100 trades
//       page={page}
//       onChange={handlePageChange}
//       sx={{ mt: 2 }}
//       aria-label="Trade history pagination"
//       disabled={loading}
//     />
//   </Paper>
// ));

// const MarketDataCard = ({ priceData, formData, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <PerformanceIcon sx={{ mr: 1 }} />
//         Market Data
//       </Typography>
//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {priceData ? (
//         <Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Last Price:</Typography>
//             <Typography fontWeight="bold">
//               ${priceData.last.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Bid:</Typography>
//             <Typography color="error">
//               ${priceData.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography>Ask:</Typography>
//             <Typography color="success.main">
//               ${priceData.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </Typography>
//           </Box>
//           {formData.amount && parseFloat(formData.amount) > 0 && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Trade Estimation
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Quantity:</Typography>
//                 <Typography>
//                   {(parseFloat(formData.amount) * formData.leverage / priceData.last).toFixed(6)}{' '}
//                   {formData.symbol.replace('USDT', '')}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Margin Required:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Position Size:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount) * formData.leverage).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//             </>
//           )}
//         </Box>
//       ) : (
//         <Typography>Select a symbol to view market data</Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const AccountSummary = ({ balance, todayPnl, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <ProfitIcon sx={{ mr: 1 }} />
//       Account Summary
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Available Balance:</Typography>
//       <Typography fontWeight="bold">
//         ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Investor Funds:</Typography>
//       <Typography>
//         ${(balance * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Your Allocation:</Typography>
//       <Typography>
//         ${(balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography>Today's P&L:</Typography>
//       <Typography color={todayPnl >= 0 ? 'success.main' : 'error.main'}>
//         {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//   </Paper>
// );

// const PAMMTradePanel = ({ userId, theme, currentUser }) => {
//   const [formData, setFormData] = useState({
//     symbol: '',
//     action: 'buy',
//     amount: '',
//     isManaged: true,
//     leverage: 1,
//   });
//   const [availableSymbols, setAvailableSymbols] = useState([]);
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [symbolsLoading, setSymbolsLoading] = useState(true);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [connectionError, setConnectionError] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [balance, setBalance] = useState(0);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [todayPnl, setTodayPnl] = useState(0);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const navigate = useNavigate();
//   const wsRef = useRef(null);

//   const debouncedFetchPrice = useMemo(
//     () => debounce(async (symbol) => {
//       if (!symbol) return;
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${symbol}`);
//         setPriceData(res.data);
//         setConnectionError(false);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to fetch price data. Please check your connection.',
//           severity: 'error',
//         });
//         setConnectionError(true);
//       }
//     }, 1000),
//     []
//   );

//   const fetchData = useCallback(
//     async (currentPage = 1) => {
//       setDataLoading(true);
//       setConnectionError(false);
//       try {
//         // Stagger API calls to reduce server load
//         const symbolsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols`);
//         const symbols = symbolsRes.data.data || [];
//         setAvailableSymbols(symbols);
//         if (symbols.length === 0) {
//           setSnackbar({
//             open: true,
//             message: 'No trading symbols available. Please try again later.',
//             severity: 'warning',
//           });
//         } else if (!formData.symbol || !symbols.includes(formData.symbol)) {
//           setFormData((prev) => ({ ...prev, symbol: symbols[0] || '' }));
//           if (symbols[0]) debouncedFetchPrice(symbols[0]);
//         }
//         setSymbolsLoading(false);

//         await delay(500); // Delay before next call
//         const balanceRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`);
//         setBalance(balanceRes.data.balance || 0);

//         await delay(500); // Delay before next call
//         const historyRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm&page=${currentPage}&page_size=${pageSize}`);
//         setTradeHistory(historyRes.data.data || []);

//         await delay(500); // Delay before next call
//         const pnlRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/pnl`);
//         setTodayPnl(pnlRes.data.pnl || 0);
//       } catch (error) {
//         setSnackbar({
//           open: true,
//           message: error.response?.data?.message || 'Failed to connect to server. Please check if the server is running.',
//           severity: 'error',
//         });
//         setConnectionError(true);
//       } finally {
//         setDataLoading(false);
//       }
//     },
//     [userId, debouncedFetchPrice, formData.symbol, pageSize]
//   );

//   useEffect(() => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       setSymbolsLoading(false);
//       setDataLoading(false);
//       return;
//     }
//     fetchData(page);
//   }, [userId, fetchData, page]);

//   useEffect(() => {
//     if (!formData.symbol) return;
//     wsRef.current = createWebSocketClient(formData.symbol);
//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.topic === `tickers.${formData.symbol}` && data.data) {
//         setPriceData({
//           bid: parseFloat(data.data.bidPrice),
//           ask: parseFloat(data.data.askPrice),
//           last: parseFloat(data.data.lastPrice),
//         });
//         setConnectionError(false);
//       }
//     };
//     wsRef.current.onerror = () => {
//       setSnackbar({
//         open: true,
//         message: 'WebSocket connection failed. Falling back to HTTP polling.',
//         severity: 'warning',
//       });
//       debouncedFetchPrice(formData.symbol);
//     };
//     return () => {
//       wsRef.current?.close();
//     };
//   }, [formData.symbol, debouncedFetchPrice]);

//   const handleInputChange = (e, newValue) => {
//     if (e && e.target) {
//       const { name, value, type, checked } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     } else if (newValue) {
//       setFormData((prev) => ({ ...prev, symbol: newValue }));
//       debouncedFetchPrice(newValue);
//     }
//   };

//   const executeTrade = async () => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.symbol) {
//       setSnackbar({
//         open: true,
//         message: 'Please select a valid symbol',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please enter a valid amount',
//         severity: 'error',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/trade-pamm`,
//         {
//           userId,
//           symbol: formData.symbol,
//           action: formData.action,
//           amount: parseFloat(formData.amount),
//           isManaged: formData.isManaged,
//           leverage: parseInt(formData.leverage.toString()),
//         },
//         {
//           timeout: 30000,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${currentUser?.token}`, // Remove if JWT not used
//           },
//         }
//       );
//       setSnackbar({
//         open: true,
//         message: `Trade executed successfully! ID: ${response.data.data.tradeId} (Bybit: ${response.data.data.bybitOrderId})`,
//         severity: 'success',
//       });
//       await fetchData(1); // Refresh data after trade
//       setPage(1); // Reset to first page
//       setConnectionError(false);
//     } catch (error) {
//       let errorMessage = 'Trade execution failed. Please check server connection.';
//       if (error.response?.status === 400) {
//         errorMessage = error.response.data.message || 'Invalid trade parameters.';
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Unauthorized. Please log in again.';
//         navigate('/login'); // Redirect to login if unauthorized
//       } else if (error.response?.status === 404) {
//         errorMessage = 'User or symbol not found.';
//       } else if (error.response?.status === 503) {
//         errorMessage = 'Exchange service unavailable. Please try again later.';
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: 'error',
//       });
//       setConnectionError(true);
//     } finally {
//       setLoading(false);
//       setConfirmDialogOpen(false);
//     }
//   };

//   const handleExecuteTrade = () => {
//     setConfirmDialogOpen(true);
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     fetchData(newPage);
//   };

//   const handleRetry = () => {
//     setConnectionError(false);
//     fetchData(page);
//   };

//   return (
//     <ErrorBoundary>
//       <Box sx={{ p: 3 }} role="main" aria-label="PAMM Trading Portal">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: theme === 'dark'
//               ? 'linear-gradient(to right, #1a3a72, #0d1b3a)'
//               : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
//             PAMM Managed Trading Portal (mainnet)
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Execute trades on Bybit mainnet with profit sharing
//           </Typography>
//         </Paper>
//         {connectionError && (
//           <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'error.light' }}>
//             <Typography color="error" role="alert">
//               Unable to connect to the server. Please ensure the backend is running on http://localhost:5000 and try again.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<RefreshIcon />}
//               onClick={handleRetry}
//               sx={{ mt: 2 }}
//               aria-label="Retry connecting to server"
//             >
//               Retry
//             </Button>
//           </Paper>
//         )}
//         {!userId || userId === 'undefined' ? (
//           <Typography color="error" role="alert">
//             Error: Invalid user ID. Please log in or provide a valid user ID.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={8}>
//               <TradeForm
//                 formData={formData}
//                 availableSymbols={availableSymbols}
//                 symbolsLoading={symbolsLoading}
//                 handleInputChange={handleInputChange}
//                 handleExecuteTrade={handleExecuteTrade} 
//                 loading={loading}
               
//               />
//               {availableSymbols.length === 0 && !symbolsLoading && !connectionError && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchData(page)}
//                   sx={{ mt: 1 }}
//                   aria-label="Retry fetching symbols"
//                 >
//                   Retry Fetching Symbols
//                 </Button>
//               )}
//               <TradeHistoryTable
//                 tradeHistory={tradeHistory}
//                 page={page}
//                 handlePageChange={handlePageChange}
//                 pageSize={pageSize}
//                 loading={dataLoading}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <MarketDataCard priceData={priceData} formData={formData} loading={dataLoading} />
//               <AccountSummary balance={balance} todayPnl={todayPnl} loading={dataLoading} />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mt: 3, py: 2 }}
//                 startIcon={<HistoryIcon />}
//                 onClick={() => navigate('/dashboard/pamm-manager')}
//                 aria-label="Back to PAMM Dashboard"
//               >
//                 Back to PAMM Dashboard
//               </Button>
//             </Grid>
//           </Grid>
//         )}
//         <Dialog
//           open={confirmDialogOpen}
//           onClose={() => setConfirmDialogOpen(false)}
//           aria-labelledby="confirm-trade-dialog"
//         >
//           <DialogTitle id="confirm-trade-dialog">Confirm Trade</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Execute {formData.action} order for ${formData.amount} of {formData.symbol} with {formData.leverage}x leverage?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" aria-label="Cancel trade">
//               Cancel
//             </Button>
//             <Button onClick={executeTrade} color="primary" aria-label="Confirm trade" disabled={connectionError}>
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           aria-live="polite"
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default PAMMTradePanel;


















// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Divider,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableRow,
//   Autocomplete,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Pagination,
//   LinearProgress,
// } from '@mui/material';
// import {
//   PlayArrow as ExecuteIcon,
//   History as HistoryIcon,
//   AccountBalanceWallet as BalanceIcon,
//   TrendingUp as PerformanceIcon,
//   AttachMoney as ProfitIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import ErrorBoundary from './ErrorBoundary';

// // Configure axios-retry with exponential backoff
// axiosRetry(axios, {
//   retries: 5,
//   retryDelay: (retryCount) => Math.min(1000 * 2 ** retryCount, 5000),
//   retryCondition: (error) =>
//     axiosRetry.isNetworkOrIdempotentRequestError(error) ||
//     error.code === 'ECONNRESET' ||
//     error.code === 'ECONNREFUSED' ||
//     error.response?.status === 429 ||
//     error.response?.status === 503,
// });

// // Delay function for staggering API calls
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // WebSocket Client with reconnection logic and timeout
// const createWebSocketClient = (symbol, wsRef, setPriceData, setConnectionError, setSnackbar, debouncedFetchPrice) => {
//   if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//     wsRef.current.close();
//   }

//   const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
//   let reconnectAttempts = 0;
//   const maxReconnectAttempts = 5;
//   const connectionTimeout = setTimeout(() => {
//     if (ws.readyState !== WebSocket.OPEN) {
//       console.error(`WebSocket connection timeout for ${symbol} after 10s`);
//       ws.close();
//     }
//   }, 10000);

//   ws.onopen = () => {
//     clearTimeout(connectionTimeout);
//     reconnectAttempts = 0;
//     ws.send(
//       JSON.stringify({
//         op: 'subscribe',
//         args: [`tickers.${symbol}`],
//       })
//     );
//   };

//   // Debounce snackbar notifications to prevent spam
//   const debouncedSetSnackbar = debounce(
//     (message, severity) => {
//       setSnackbar({
//         open: true,
//         message,
//         severity,
//       });
//     },
//     5000,
//     { leading: true, trailing: false }
//   );

//   ws.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       if (data.topic === `tickers.${symbol}` && data.data) {
//         // Log full data for debugging
//         console.debug(`WebSocket data for ${symbol}:`, data.data);
//         // Use correct field names from Bybit WebSocket API
//         const bid = parseFloat(data.data.bid1Price);
//         const ask = parseFloat(data.data.ask1Price);
//         const last = parseFloat(data.data.lastPrice);
//         // Allow partial updates if at least one price is valid
//         if (!isNaN(last) || !isNaN(bid) || !isNaN(ask)) {
//           setPriceData((prev) => ({
//             bid: !isNaN(bid) ? bid : prev?.bid,
//             ask: !isNaN(ask) ? ask : prev?.ask,
//             last: !isNaN(last) ? last : prev?.last,
//           }));
//           setConnectionError(false);
//         } else {
//           throw new Error(
//             `Incomplete price data for ${symbol}: bid=${data.data.bid1Price}, ask=${data.data.ask1Price}, last=${data.data.lastPrice}`
//           );
//         }
//       }
//     } catch (error) {
//       console.error(`WebSocket data error for ${symbol}: ${error.message}`, { eventData: event.data });
//       debouncedSetSnackbar(`Incomplete price data received from WebSocket for ${symbol}`, 'warning');
//       debouncedFetchPrice(symbol);
//     }
//   };

//   ws.onerror = () => {
//     clearTimeout(connectionTimeout);
//     debouncedSetSnackbar('WebSocket connection failed. Falling back to HTTP polling.', 'warning');
//     debouncedFetchPrice(symbol);
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         wsRef.current = createWebSocketClient(symbol, wsRef, setPriceData, setConnectionError, setSnackbar, debouncedFetchPrice);
//       }, 2000 * 2 ** reconnectAttempts);
//     } else {
//       console.error(`Max WebSocket reconnection attempts reached for ${symbol}`);
//     }
//   };

//   ws.onclose = () => {
//     clearTimeout(connectionTimeout);
//     if (reconnectAttempts < maxReconnectAttempts) {
//       setTimeout(() => {
//         reconnectAttempts++;
//         wsRef.current = createWebSocketClient(symbol, wsRef, setPriceData, setConnectionError, setSnackbar, debouncedFetchPrice);
//       }, 2000 * 2 ** reconnectAttempts);
//     }
//   };

//   return ws;
// };

// // Reusable Components
// const TradeForm = ({ formData, availableSymbols, symbolsLoading, handleInputChange, handleExecuteTrade, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <ExecuteIcon sx={{ mr: 1 }} />
//         New Managed Trade
//       </Typography>
//       {symbolsLoading && <LinearProgress sx={{ mb: 2 }} />}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <Autocomplete
//               options={availableSymbols}
//               value={formData.symbol}
//               onChange={(e, newValue) => handleInputChange(null, newValue)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Symbol"
//                   aria-label="Select trading symbol"
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {symbolsLoading ? <CircularProgress size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               disabled={symbolsLoading || availableSymbols.length === 0}
//               noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
//             />
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="action-label">Action</InputLabel>
//             <Select
//               labelId="action-label"
//               name="action"
//               value={formData.action}
//               onChange={handleInputChange}
//               label="Action"
//               aria-label="Select trade action"
//             >
//               <MenuItem value="buy">Buy</MenuItem>
//               <MenuItem value="sell">Sell</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="amount"
//             label="Amount (USD)"
//             type="number"
//             value={formData.amount}
//             onChange={handleInputChange}
//             InputProps={{ startAdornment: '$' }}
//             aria-label="Enter trade amount in USD"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth>
//             <InputLabel id="leverage-label">Leverage</InputLabel>
//             <Select
//               labelId="leverage-label"
//               name="leverage"
//               value={formData.leverage}
//               onChange={handleInputChange}
//               label="Leverage"
//               aria-label="Select leverage"
//             >
//               {[1, 2, 3, 5, 10].map((lev) => (
//                 <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12}>
//           <Tooltip title="Enable profit sharing for PAMM managed trades">
//             <FormControlLabel
//               control={
//                 <Switch
//                   name="isManaged"
//                   checked={formData.isManaged}
//                   onChange={handleInputChange}
//                   color="primary"
//                   aria-label="Toggle PAMM managed trade"
//                 />
//               }
//               label="PAMM Managed Trade (Profit Sharing)"
//             />
//           </Tooltip>
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             startIcon={<ExecuteIcon />}
//             onClick={handleExecuteTrade}
//             disabled={loading || symbolsLoading || availableSymbols.length === 0}
//             fullWidth
//             sx={{ py: 2 }}
//             aria-label="Execute trade"
//           >
//             {loading ? <CircularProgress size={24} /> : 'Execute Managed Trade'}
//           </Button>
//         </Grid>
//       </Grid>
//     </CardContent>
//   </Card>
// );

// const TradeHistoryTable = React.memo(({ tradeHistory, page, handlePageChange, pageSize, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <HistoryIcon sx={{ mr: 1 }} />
//       Recent Managed Trades
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <TableContainer component={Paper}>
//       <Table size="small" aria-label="Trade history table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Symbol</TableCell>
//             <TableCell align="right">Amount</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell align="right">Leverage</TableCell>
//             <TableCell align="right">Profit</TableCell>
//             <TableCell align="right">Bybit Order ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {tradeHistory.length === 0 && !loading ? (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No trades found
//               </TableCell>
//             </TableRow>
//           ) : (
//             tradeHistory.map((trade) => (
//               <TableRow key={trade.tradeId || trade.bybitOrderId || Math.random()}>
//                 <TableCell>{trade.timestamp ? new Date(trade.timestamp).toLocaleString() : '-'}</TableCell>
//                 <TableCell>{trade.symbol || '-'}</TableCell>
//                 <TableCell align="right">
//                   {trade.executedAmount ? `$${Number(trade.executedAmount).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     color: trade.action === 'buy' ? 'success.main' : 'error.main',
//                     textTransform: 'capitalize',
//                   }}
//                 >
//                   {trade.action || '-'}
//                 </TableCell>
//                 <TableCell align="right">{trade.leverage ? `${Number(trade.leverage)}x` : '-'}</TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: trade.profit && trade.profit > 0 ? 'success.main' : 'error.main',
//                   }}
//                 >
//                   {trade.profit ? `$${Number(trade.profit).toFixed(2)}` : '-'}
//                 </TableCell>
//                 <TableCell align="right">{trade.bybitOrderId || '-'}</TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <Pagination
//       count={Math.ceil(100 / pageSize)}
//       page={page}
//       onChange={handlePageChange}
//       sx={{ mt: 2 }}
//       aria-label="Trade history pagination"
//       disabled={loading}
//     />
//   </Paper>
// ));

// const MarketDataCard = ({ priceData, formData, loading }) => (
//   <Card>
//     <CardContent>
//       <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//         <PerformanceIcon sx={{ mr: 1 }} />
//         Market Data
//       </Typography>
//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {priceData && (!isNaN(priceData.bid) || !isNaN(priceData.ask) || !isNaN(priceData.last)) ? (
//         <Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Last Price:</Typography>
//             <Typography fontWeight="bold">
//               {priceData.last ? `$${priceData.last.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography>Bid:</Typography>
//             <Typography color="error">
//               {priceData.bid ? `$${priceData.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//             <Typography>Ask:</Typography>
//             <Typography color="success.main">
//               {priceData.ask ? `$${priceData.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
//             </Typography>
//           </Box>
//           {formData.amount && parseFloat(formData.amount) > 0 && priceData.last && (
//             <>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Trade Estimation
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Quantity:</Typography>
//                 <Typography>
//                   {(parseFloat(formData.amount) * formData.leverage / priceData.last).toFixed(6)}{' '}
//                   {formData.symbol.replace('USDT', '')}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography>Margin Required:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Position Size:</Typography>
//                 <Typography>
//                   ${(parseFloat(formData.amount) * formData.leverage).toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                   })}
//                 </Typography>
//               </Box>
//             </>
//           )}
//         </Box>
//       ) : (
//         <Typography>Select a symbol or wait for market data to load</Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const AccountSummary = ({ balance, todayPnl, loading }) => (
//   <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
//     <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//       <ProfitIcon sx={{ mr: 1 }} />
//       Account Summary
//     </Typography>
//     {loading && <LinearProgress sx={{ mb: 2 }} />}
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Available Balance:</Typography>
//       <Typography fontWeight="bold">
//         ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Investor Funds:</Typography>
//       <Typography>${(balance * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//       <Typography>Your Allocation:</Typography>
//       <Typography>${(balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography>Today's P&L:</Typography>
//       <Typography color={todayPnl >= 0 ? 'success.main' : 'error.main'}>
//         {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </Typography>
//     </Box>
//   </Paper>
// );

// const PAMMTradePanel = ({ userId, theme, currentUser }) => {
//   const [formData, setFormData] = useState({
//     symbol: '',
//     action: 'buy',
//     amount: '',
//     isManaged: true,
//     leverage: 1,
//   });
//   const [availableSymbols, setAvailableSymbols] = useState([]);
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [symbolsLoading, setSymbolsLoading] = useState(true);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [connectionError, setConnectionError] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [balance, setBalance] = useState(0);
//   const [tradeHistory, setTradeHistory] = useState([]);
//   const [todayPnl, setTodayPnl] = useState(0);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const navigate = useNavigate();
//   const wsRef = useRef(null);



//   const debouncedFetchPrice = useMemo(
//     () =>
//       debounce(async (symbol) => {
//         if (!symbol) return;
//         try {
//           const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${symbol}`, {
//             timeout: 15000,
//           });
//           const { bid, ask, last } = res.data;
//           // Allow partial updates if at least one price is valid
//           if (bid != null || ask != null || last != null) {
//             setPriceData((prev) => ({
//               bid: bid != null ? bid : prev?.bid,
//               ask: ask != null ? ask : prev?.ask,
//               last: last != null ? last : prev?.last,
//             }));
//             setConnectionError(false);
//           } else {
//             throw new Error(`Invalid HTTP price data: bid=${bid}, ask=${ask}, last=${last}`);
//           }
//         } catch (error) {
//           console.error(`HTTP price fetch error for ${symbol}: ${error.message}`);
//           setSnackbar({
//             open: true,
//             message: error.response?.data?.message || 'Failed to fetch price data. Please check your connection.',
//             severity: 'error',
//           });
//           setConnectionError(true);
//         }
//       }, 5000),
//     []
//   );



//   const fetchData = useCallback(
//     async (currentPage = 1, retryCount = 3) => {
//       setDataLoading(true);
//       setConnectionError(false);
//       try {
//         let symbols = [];
//         for (let attempt = 0; attempt <= retryCount; attempt++) {
//           try {
//             const symbolsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols?limit=20`, {
//               timeout: 15000,
//             });
//             symbols = symbolsRes.data.data || [];
//             break;
//           } catch (error) {
//             if (attempt < retryCount) {
//               await delay(1000 * 2 ** attempt);
//               continue;
//             }
//             throw new Error(`Failed to fetch symbols: ${error.message}`);
//           }
//         }
//         setAvailableSymbols(symbols);
//         if (symbols.length === 0) {
//           setSnackbar({
//             open: true,
//             message: 'No trading symbols available. Please try again later.',
//             severity: 'warning',
//           });
//         } else if (!formData.symbol || !symbols.includes(formData.symbol)) {
//           setFormData((prev) => ({ ...prev, symbol: symbols[0] || '' }));
//           if (symbols[0]) debouncedFetchPrice(symbols[0]);
//         }
//         setSymbolsLoading(false);
  
//         await delay(1000);
//         let balanceRes;
//         try {
//           balanceRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`, {
//             timeout: 15000,
//           });
//           setBalance(balanceRes.data.balance || 0);
//         } catch (error) {
//           throw new Error(`Failed to fetch balance: ${error.message}`);
//         }
  
//         await delay(1000);
//         let historyRes;
//         let trades = [];
//         for (let attempt = 0; attempt <= retryCount; attempt++) {
//           try {
//             historyRes = await axios.get(
//               `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?type=pamm&page=${currentPage}&page_size=${pageSize}`,
//               {
//                 timeout: 30000,
//               }
//             );
//             trades = historyRes.data.data || [];
//             break;
//           } catch (error) {
//             if (attempt < retryCount) {
//               console.warn(`Retry ${attempt + 1}/${retryCount} for trade history fetch: ${error.message}`);
//               await delay(2000 * 2 ** attempt);
//               continue;
//             }
//             console.error(`Failed to fetch trade history after ${retryCount} retries: ${error.message}`);
//             setTradeHistory([]);
//             setSnackbar({
//               open: true,
//               message: 'Failed to fetch trade history. Displaying cached or empty data.',
//               severity: 'warning',
//             });
//             break;
//           }
//         }
//         setTradeHistory(trades);
  
//         await delay(1000);
//         let pnlRes;
//         for (let attempt = 0; attempt <= retryCount; attempt++) {
//           try {
//             pnlRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/pnl`, {
//               timeout: 15000,
//             });
//             setTodayPnl(pnlRes.data.pnl || 0);
//             break;
//           } catch (error) {
//             if (attempt < retryCount) {
//               console.warn(`Retry ${attempt + 1}/${retryCount} for P&L fetch: ${error.message}`);
//               await delay(2000 * 2 ** attempt);
//               continue;
//             }
//             console.error(`Failed to fetch P&L after ${retryCount} retries: ${error.message}`);
//             setTodayPnl(0); // Fallback to 0
//             setSnackbar({
//               open: true,
//               message: 'Failed to fetch P&L. Displaying default value of 0.',
//               severity: 'warning',
//             });
//             break;
//           }
//         }
//       } catch (error) {
//         console.error(`Fetch data error: ${error.message}`);
//         setSnackbar({
//           open: true,
//           message: error.message || 'Failed to connect to server. Please check if the server is running.',
//           severity: 'error',
//         });
//         setConnectionError(true);
//       } finally {
//         setDataLoading(false);
//       }
//     },
//     [userId, debouncedFetchPrice, pageSize, formData.symbol]
//   );



//   useEffect(() => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       setSymbolsLoading(false);
//       setDataLoading(false);
//       return;
//     }
//     fetchData(page, 3);
//   }, [userId, fetchData, page]);

//   useEffect(() => {
//     if (!formData.symbol) return;
//     wsRef.current = createWebSocketClient(formData.symbol, wsRef, setPriceData, setConnectionError, setSnackbar, debouncedFetchPrice);
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//     };
//   }, [formData.symbol, debouncedFetchPrice, setPriceData, setConnectionError, setSnackbar]);

//   const handleInputChange = (e, newValue) => {
//     if (e && e.target) {
//       const { name, value, type, checked } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     } else if (newValue) {
//       setFormData((prev) => ({ ...prev, symbol: newValue }));
//       debouncedFetchPrice(newValue);
//     }
//   };

//   const executeTrade = async () => {
//     if (!userId || userId === 'undefined') {
//       setSnackbar({
//         open: true,
//         message: 'Invalid user ID. Please log in or provide a valid user ID.',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.symbol) {
//       setSnackbar({
//         open: true,
//         message: 'Please select a valid symbol',
//         severity: 'error',
//       });
//       return;
//     }
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setSnackbar({
//         open: true,
//         message: 'Please enter a valid amount',
//         severity: 'error',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/trade-pamm`,
//         {
//           userId,
//           symbol: formData.symbol,
//           action: formData.action,
//           amount: parseFloat(formData.amount),
//           isManaged: formData.isManaged,
//           leverage: parseInt(formData.leverage.toString()),
//         },
//         {
//           timeout: 30000,
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${currentUser?.token}`,
//           },
//         }
//       );
//       setSnackbar({
//         open: true,
//         message: `Trade executed successfully! ID: ${response.data.data.tradeId} (Bybit: ${response.data.data.bybitOrderId})`,
//         severity: 'success',
//       });
//       await fetchData(1);
//       setPage(1);
//       setConnectionError(false);
//     } catch (error) {
//       let errorMessage = 'Trade execution failed. Please check server connection.';
//       if (error.response?.status === 400) {
//         errorMessage = error.response.data.message || 'Invalid trade parameters.';
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Unauthorized. Please log in again.';
//         navigate('/login');
//       } else if (error.response?.status === 404) {
//         errorMessage = 'User or symbol not found.';
//       } else if (error.response?.status === 503) {
//         errorMessage = 'Exchange service unavailable. Please try again later.';
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: 'error',
//       });
//       setConnectionError(true);
//     } finally {
//       setLoading(false);
//       setConfirmDialogOpen(false);
//     }
//   };

//   const handleExecuteTrade = () => {
//     setConfirmDialogOpen(true);
//   };

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     fetchData(newPage);
//   };

//   const handleRetry = () => {
//     setConnectionError(false);
//     fetchData(page);
//   };

//   return (
//     <ErrorBoundary>
//       <Box sx={{ p: 3 }} role="main" aria-label="PAMM Trading Portal">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: theme === 'dark' ? 'linear-gradient(to right, #1a3a72, #0d1b3a)' : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//             <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
//             PAMM Managed Trading Portal (mainnet)
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Execute trades on Bybit mainnet with profit sharing
//           </Typography>
//         </Paper>
//         {connectionError && (
//           <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'error.light' }}>
//             <Typography color="error" role="alert">
//               Unable to connect to the server. Please ensure the backend is running on http://localhost:5000 and try again.
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<RefreshIcon />}
//               onClick={handleRetry}
//               sx={{ mt: 2 }}
//               aria-label="Retry connecting to server"
//             >
//               Retry
//             </Button>
//           </Paper>
//         )}
//         {!userId || userId === 'undefined' ? (
//           <Typography color="error" role="alert">
//             Error: Invalid user ID. Please log in or provide a valid user ID.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={8}>
//               <TradeForm
//                 formData={formData}
//                 availableSymbols={availableSymbols}
//                 symbolsLoading={symbolsLoading}
//                 handleInputChange={handleInputChange}
//                 handleExecuteTrade={handleExecuteTrade}
//                 loading={loading}
//               />
//               {availableSymbols.length === 0 && !symbolsLoading && !connectionError && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchData(page)}
//                   sx={{ mt: 1 }}
//                   aria-label="Retry fetching symbols"
//                 >
//                   Retry Fetching Symbols
//                 </Button>
//               )}
//               <TradeHistoryTable
//                 tradeHistory={tradeHistory}
//                 page={page}
//                 handlePageChange={handlePageChange}
//                 pageSize={pageSize}
//                 loading={dataLoading}
//               />
//             </Grid>
          //   <Grid item xs={12} md={4}>
          //     <MarketDataCard priceData={priceData} formData={formData} loading={dataLoading} />
          //     <AccountSummary balance={balance} todayPnl={todayPnl} loading={dataLoading} />
          //     <Button
          //       variant="contained"
          //       color="secondary"
          //       fullWidth
          //       sx={{ mt: 3, py: 2 }}
          //       startIcon={<HistoryIcon />}
          //       onClick={() => navigate('/dashboard/pamm-manager')}
          //       aria-label="Back to PAMM Dashboard"
          //     >
          //       Back to PAMM Dashboard
          //     </Button>
          //   </Grid>
          // </Grid>
//         )}
//         <Dialog
//           open={confirmDialogOpen}
//           onClose={() => setConfirmDialogOpen(false)}
//           aria-labelledby="confirm-trade-dialog"
//         >
//           <DialogTitle id="confirm-trade-dialog">Confirm Trade</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Execute {formData.action} order for ${formData.amount} of {formData.symbol} with {formData.leverage}x
//               leverage?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" aria-label="Cancel trade">
//               Cancel
//             </Button>
//             <Button onClick={executeTrade} color="primary" aria-label="Confirm trade" disabled={connectionError}>
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           aria-live="polite"
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </ErrorBoundary>
//   );
// };

// export default PAMMTradePanel;







import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
  styled
} from '@mui/material';
import { PlayArrow as ExecuteIcon, AccountBalanceWallet as BalanceIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import axiosRetry from 'axios-retry';




// Custom styled button component
const PremiumButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.75, 5),
  marginBottom:'30px',
  width: 'fit-content',
  minWidth: '200px',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  letterSpacing: '0.05em',
  color: '#F8FAFC',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
  boxShadow: `
    0 6px 24px rgba(59, 130, 246, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.2)
  `,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(139, 92, 246, 1) 100%)',
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: `
      0 10px 30px rgba(59, 130, 246, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.3)
    `,
    '& .shine': {
      transform: 'translateX(150%) skewX(-15deg)',
    },
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
    boxShadow: `
      0 4px 16px rgba(59, 130, 246, 0.2),
      0 2px 6px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.2)
    `,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'transform 0.6s ease',
    transform: 'translateX(-100%) skewX(-15deg)',
  },
  '&:hover::before': {
    transform: 'translateX(150%) skewX(-15deg)',
  },
  animation: 'pulse 4s infinite ease-in-out',
  '@keyframes pulse': {
    '0%': {
      boxShadow: `
        0 6px 24px rgba(59, 130, 246, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.2)
      `,
    },
    '50%': {
      boxShadow: `
        0 8px 28px rgba(59, 130, 246, 0.4),
        0 3px 10px rgba(0, 0, 0, 0.25),
        inset 0 1px 1px rgba(255, 255, 255, 0.25)
      `,
    },
    '100%': {
      boxShadow: `
        0 6px 24px rgba(59, 130, 246, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.2)
      `,
    },
  },
  '&:focus-visible': {
    outline: '2px solid #3B82F6',
    outlineOffset: '2px',
  },
}));

const EnhancedButton = ({ navigate }) => {
  return (
    <Grid item xs={12} md={4}>
      <PremiumButton
        variant="contained"
        onClick={() => navigate('/dashboard/pamm-manager')}
        aria-label="Back to PAMM Dashboard"
      >
        ← PAMM Dashboard
      </PremiumButton>
    </Grid>
  );
};

// Configure axios-retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => 1000 * 2 ** retryCount,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429 ||
    error.response?.status === 503,
});

// Styled components
const GradientHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(to right, #1a3a72, #0d1b3a)' 
    : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
  color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
}));

const TradeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const RecentTradesCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderLeft: `4px solid ${theme.palette.secondary.main}`,
}));

const ExecuteButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  boxShadow: theme.shadows[2],
  minWidth: 'auto',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? '#2e7d32' : '#4caf50',
  color: '#fff',
  '&:hover': {
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.mode === 'dark' ? '#388e3c' : '#66bb6a',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

// TradeForm component
const TradeForm = ({
  formData,
  availableSymbols,
  symbolsLoading,
  handleInputChange,
  handleExecuteTrade,
  loading,
  balance,
  currentPrice,
  quantity,
  errors,
}) => {
  const theme = useTheme();
  
  return (
    <TradeCard>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ExecuteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          New Futures Trade
        </Typography>
        
        {balance !== null && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Available Balance: <strong>${balance.toFixed(2)}</strong>
          </Typography>
        )}
        
        {currentPrice && formData.symbol && (
          <Box sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            p: 1.5,
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2" component="div">
              Current <strong>{formData.symbol}</strong> Price: <strong>${currentPrice.toFixed(2)}</strong>
            </Typography>
            <Typography variant="body2" component="div">
              Est. Quantity: <strong>{quantity.toFixed(6)} {formData.symbol.replace('USDT', '')}</strong>
            </Typography>
          </Box>
        )}
        
        {symbolsLoading && <CircularProgress sx={{ mb: 2 }} />}
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.symbol}>
              <Autocomplete
                options={availableSymbols}
                value={formData.symbol}
                onChange={(e, newValue) => handleInputChange(null, newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Symbol"
                    error={!!errors.symbol}
                    helperText={errors.symbol || (symbolsLoading ? 'Loading symbols...' : '')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {symbolsLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                disabled={symbolsLoading || availableSymbols.length === 0}
                noOptionsText={symbolsLoading ? 'Loading symbols...' : 'No symbols available'}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="action-label">Action</InputLabel>
              <Select
                labelId="action-label"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                label="Action"
              >
                <MenuItem value="buy">Buy/Long</MenuItem>
                <MenuItem value="sell">Sell/Short</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="amount"
              label="Amount (USD)"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              InputProps={{ startAdornment: '$' }}
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="leverage-label">Leverage</InputLabel>
              <Select
                labelId="leverage-label"
                name="leverage"
                value={formData.leverage}
                onChange={handleInputChange}
                label="Leverage"
              >
                {[1, 5, 10, 20, 50, 100].map((lev) => (
                  <MenuItem key={lev} value={lev}>{lev}x</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="isManaged"
                  checked={formData.isManaged}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>PAMM Managed Trade</Typography>
                  <Tooltip title="Let our algorithm manage your position for optimal profits">
                    <Typography 
                      sx={{ 
                        ml: 1,
                        fontSize: '0.75rem',
                        color: theme.palette.text.secondary
                      }}
                    >
                      (What's this?)
                    </Typography>
                  </Tooltip>
                </Box>
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <Tooltip title="Execute your futures trade with the selected parameters">
              <span>
                <ExecuteButton
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ExecuteIcon />}
                  onClick={handleExecuteTrade}
                  disabled={loading || symbolsLoading || availableSymbols.length === 0 || Object.keys(errors).length > 0}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Execute Trade'}
                </ExecuteButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </TradeCard>
  );
};

// RecentTrades component
const RecentTrades = ({ trades, tradesLoading, fetchSymbols, fetchBalance, fetchTrades, symbolsLoading, loading }) => {
  const theme = useTheme();
  
  const handleRefresh = async () => {
    try {
      await Promise.all([fetchSymbols(), fetchBalance(), fetchTrades()]);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <RecentTradesCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Trades</Typography>
          <Tooltip title="Refresh trades, balance, and symbols">
            <span>
              <RefreshButton
                onClick={handleRefresh}
                disabled={tradesLoading || symbolsLoading || loading}
                size="small"
                startIcon={<RefreshIcon />}
                aria-label="Refresh trades, balance, and symbols"
              >
                Refresh
              </RefreshButton>
            </span>
          </Tooltip>
        </Box>
        
        {tradesLoading && <CircularProgress sx={{ mb: 2 }} />}
        
        {trades.length === 0 && !tradesLoading ? (
          <Typography variant="body2" color="text.secondary">
            No recent trades found.
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Trade ID</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow 
                    key={trade.tradeId}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.03)' 
                        } 
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace' }}>
                      {trade.tradeId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <strong>{trade.symbol}</strong>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        color={trade.action === 'buy' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {trade.action.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>${trade.executedAmount.toFixed(2)}</TableCell>
                    <TableCell>${trade.executionPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(trade.timestamp).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

      </CardContent>
    </RecentTradesCard>
    
  );
};

// Main component
const PAMMTradePanel = ({ userId, currentUser }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    symbol: '',
    action: 'buy',
    amount: '10',
    isManaged: true,
    leverage: 1,
  });
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [symbolsLoading, setSymbolsLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [trades, setTrades] = useState([]);
  const [tradesLoading, setTradesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchSymbols = useCallback(async () => {
    setSymbolsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/symbols?limit=20`, {
        timeout: 10000,
      });
      const symbols = response.data.data || [];
      setAvailableSymbols(symbols);
      if (symbols.length > 0 && !formData.symbol) {
        setFormData((prev) => ({ ...prev, symbol: symbols[0] }));
      }
      if (symbols.length === 0) {
        setSnackbar({
          open: true,
          message: 'No trading symbols available. Please try again later.',
          severity: 'warning',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch symbols. Please try again.',
        severity: 'error',
      });
    } finally {
      setSymbolsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!userId || userId === 'undefined') return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/balance`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setBalance(response.data.balance);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch balance.',
        severity: 'error',
      });
    }
  }, [userId, currentUser]);

  const fetchPrice = useCallback(async () => {
    if (!formData.symbol) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/market/price?symbol=${formData.symbol}`, {
        timeout: 10000,
      });
      setCurrentPrice(response.data.last);
    } catch (error) {
      setCurrentPrice(null);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || `Failed to fetch price for ${formData.symbol}.`,
        severity: 'error',
      });
    }
  }, [formData.symbol]);

  const fetchTrades = useCallback(async () => {
    if (!userId || userId === 'undefined') return;
    setTradesLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/trades?page=1&page_size=5`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setTrades(response.data.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch recent trades.',
        severity: 'error',
      });
    } finally {
      setTradesLoading(false);
    }
  }, [userId, currentUser]);

  useEffect(() => {
    if (!userId || userId === 'undefined') {
      setSnackbar({
        open: true,
        message: 'Invalid user ID. Please log in.',
        severity: 'error',
      });
      setSymbolsLoading(false);
      setTradesLoading(false);
      navigate('/login');
      return;
    }
    fetchSymbols();
    fetchBalance();
    fetchTrades();
  }, [userId, fetchSymbols, fetchBalance, fetchTrades, navigate]);

  useEffect(() => {
    if (availableSymbols.length > 0 && !formData.symbol) {
      setFormData((prev) => ({ ...prev, symbol: availableSymbols[0] }));
    }
  }, [availableSymbols, formData.symbol]);

  useEffect(() => {
    fetchPrice();
  }, [formData.symbol, fetchPrice]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.symbol) {
      newErrors.symbol = 'Please select a symbol.';
    }
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    } else if (amount < 10) {
      newErrors.amount = 'Minimum trade amount is $10.';
    } else if (balance !== null && formData.action === 'buy') {
      const marginRequired = amount / formData.leverage;
      if (marginRequired > balance) {
        newErrors.amount = `Insufficient balance. Required: $${marginRequired.toFixed(2)}, Available: $${balance.toFixed(2)}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, balance]);

  useEffect(() => {
    validateForm();
  }, [formData, balance, validateForm]);

  const handleInputChange = (e, newValue) => {
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else if (newValue) {
      setFormData((prev) => ({ ...prev, symbol: newValue }));
    }
  };

  const handleExecuteTrade = () => {
    if (validateForm()) {
      setConfirmDialogOpen(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
    }
  };

  const executeTrade = async () => {
    if (!userId || userId === 'undefined') {
      setSnackbar({
        open: true,
        message: 'Invalid user ID. Please log in.',
        severity: 'error',
      });
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/trade-pamm`,
        {
          userId,
          symbol: formData.symbol,
          action: formData.action,
          amount: parseFloat(formData.amount),
          isManaged: formData.isManaged,
          leverage: parseInt(formData.leverage.toString()),
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: `Trade executed successfully! ID: ${response.data.data.tradeId}`,
        severity: 'success',
      });
      setFormData((prev) => ({ ...prev, amount: '10' }));
      fetchBalance();
      fetchTrades();
    } catch (error) {
      let errorMessage = 'Trade execution failed.';
      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Invalid trade parameters.';
        if (error.response.data.required && error.response.data.available) {
          errorMessage = `${errorMessage} Required: $${error.response.data.required.toFixed(2)}, Available: $${error.response.data.available.toFixed(2)}`;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
        navigate('/login');
      } else if (error.response?.status === 403) {
        errorMessage = error.response.data.message || 'Trade failed: Insufficient API permissions.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User or symbol not found.';
      } else if (error.response?.status === 503) {
        errorMessage = 'Exchange service unavailable. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const quantity = currentPrice && formData.amount ? parseFloat(formData.amount) / currentPrice : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }} role="main" aria-label="PAMM Trading Portal">
      <GradientHeader elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <BalanceIcon sx={{ mr: 1, fontSize: '2rem' }} />
          PAMM Futures Trading Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Execute futures trades on Bybit with profit sharing
        </Typography>
      </GradientHeader>

      
      {/* <Grid item xs={12} md={4}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3, py: 2 }}
          onClick={() => navigate('/dashboard/pamm-manager')}
          aria-label="Back to PAMM Dashboard"
        >
          Back to PAMM Dashboard
        </Button>
      </Grid> */}



     <EnhancedButton navigate={navigate} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TradeForm
            formData={formData}
            availableSymbols={availableSymbols}
            symbolsLoading={symbolsLoading}
            handleInputChange={handleInputChange}
            handleExecuteTrade={handleExecuteTrade}
            loading={loading}
            balance={balance}
            currentPrice={currentPrice}
            quantity={quantity}
            errors={errors}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <RecentTrades 
            trades={trades} 
            tradesLoading={tradesLoading}
            fetchSymbols={fetchSymbols}
            fetchBalance={fetchBalance}
            fetchTrades={fetchTrades}
            symbolsLoading={symbolsLoading}
            loading={loading}
          />
        </Grid>
      </Grid>

      
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            background: theme.palette.background.paper,
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          Confirm Trade
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" gutterBottom>
            You are about to execute a <strong>{formData.action === 'buy' ? 'BUY/LONG' : 'SELL/SHORT'}</strong> order:
          </Typography>
          <Box sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            p: 2,
            borderRadius: 1,
            my: 2
          }}>
            <Typography variant="body1" component="div">
              <strong>Symbol:</strong> {formData.symbol}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Amount:</strong> ${formData.amount}
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Leverage:</strong> {formData.leverage}x
            </Typography>
            <Typography variant="body1" component="div">
              <strong>Est. Quantity:</strong> {quantity.toFixed(6)} {formData.symbol.replace('USDT', '')}
            </Typography>
            {formData.isManaged && (
              <Typography variant="body1" component="div" color="primary.main">
                <strong>PAMM Managed:</strong> Yes
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. Please confirm your trade details.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeTrade} 
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Trade'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PAMMTradePanel;