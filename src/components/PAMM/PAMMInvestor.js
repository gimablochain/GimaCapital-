import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../Auth';
import {
  Alert, Box, Button, Card, CardContent, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Grid, LinearProgress,
  Paper, Snackbar, Table, TableContainer, TableBody, TableCell, TableHead,
  TableRow, TextField, Typography
} from '@mui/material';


import { AccountBalance as BalanceIcon, Add as AddIcon, AttachMoney as FeesIcon, Event as CalendarIcon, History as HistoryIcon, People as InvestorsIcon, PieChart as AllocationIcon, Remove as RemoveIcon, TrendingUp as PerformanceIcon} from '@mui/icons-material';
import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';


import { Warning as WarningIcon} from '@mui/icons-material';
 
import InvestordashboardInfoPanel from './InvestorDashboardInfoPanel'; 





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

const useTheme = () => useContext(ThemeContext);

const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('authToken');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
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
        window.location.href = '/dashboard/information/refreshthepage';
      }
    } else {
      window.location.href = '/dashboard/information/refreshthepage';
    }
  }

  return response;
};

const RiskIndicator = ({ currentBalance, initialBalance, drawdownLimit, theme }) => {
  const rawDrawdown = initialBalance > 0 
    ? ((initialBalance - currentBalance) / initialBalance) * 100 
    : 0;
  
  const normalizedDrawdown = Math.min(Math.abs(rawDrawdown), 100);
  const isProfit = currentBalance > initialBalance;

  const severity = isProfit ? 'success' : 
                  normalizedDrawdown >= drawdownLimit ? 'error' : 
                  normalizedDrawdown > drawdownLimit * 0.8 ? 'warning' : 'success';

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{
        color: theme === 'dark' ? '#F8FAFC' : '#0F172A'
      }}>
        Risk Status: 
        <Box component="span" color={`${severity}.main`} sx={{ ml: 1 }}>
          {isProfit 
            ? `+${((currentBalance - initialBalance)/initialBalance * 100).toFixed(2)}% Profit`
            : `${normalizedDrawdown.toFixed(2)}% Drawdown`}
        </Box>
      </Typography>
      {!isProfit && (
        <>
          <LinearProgress
            variant="determinate"
            value={normalizedDrawdown}
            sx={{
              height: 10,
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${severity}.main`
              }
            }}
          />
          <Typography variant="caption" sx={{
            color: theme === 'dark' ? '#94A3B8' : '#64748B'
          }}>
            {normalizedDrawdown >= drawdownLimit 
              ? "⚠️ You've hit your drawdown limit"
              : `Liquidation triggers at ${drawdownLimit}%`}
          </Typography>
        </>
      )}
    </Box>
  );
};

const PerformanceWaterfallChart = ({ initial, current, fees, theme }) => {
  const profit = current - initial - fees;
  const data = [
    { name: 'Initial', value: initial, color: '#00D4FF' },
    { name: 'Profits', value: profit > 0 ? profit : 0, color: '#00FF94' },
    { name: 'Fees', value: -fees, color: '#FF6B35' }
  ];

  return (
    <Box sx={{ 
      height: 200, 
      mt: 2,
      background: 'transparent'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#F8FAFC' : '#374151'}
            tick={{ fill: theme === 'dark' ? '#F8FAFC' : '#374151' }}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#F8FAFC' : '#374151'}
            tick={{ fill: theme === 'dark' ? '#F8FAFC' : '#374151' }}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
            labelFormatter={(label) => `${label} Balance`}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
              color: theme === 'dark' ? '#F8FAFC' : '#374151'
            }}
          />
          <elijk
            formatter={(value) => (
              <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#374151' }}>
                {value}
              </span>
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const ReturnTrendChart = ({ distributions, allocationPct, theme }) => {
  const chartData = distributions.slice(0, 6).reverse().map((dist, index) => ({
    name: `Dist ${distributions.length - index}`,
    return: dist.amount ? (dist.amount * allocationPct) : 0,
    fees: dist.fees ? (dist.fees * allocationPct) : 0
  }));

  if (chartData.length === 0) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={100}>
        <Typography variant="body2" sx={{
          color: theme === 'dark' ? '#94A3B8' : '#64748B'
        }}>
          No distribution data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 200, background: 'transparent' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke={theme === 'dark' ? '#F8FAFC' : '#374151'}
            tick={{ fill: theme === 'dark' ? '#F8FAFC' : '#374151' }}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#F8FAFC' : '#374151'}
            tick={{ fill: theme === 'dark' ? '#F8FAFC' : '#374151' }}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Amount']}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
              color: theme === 'dark' ? '#F8FAFC' : '#374151'
            }}
          />
          <Legend 
            formatter={(value) => (
              <span style={{ color: theme === 'dark' ? '#F8FAFC' : '#374151' }}>
                {value}
              </span>
            )}
          />
          <Line 
            type="monotone" 
            dataKey="return" 
            stroke="#00D4FF" 
            name="Your Returns" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#00D4FF' }}
          />
          <Line 
            type="monotone" 
            dataKey="fees" 
            stroke="#FF6B35" 
            name="Your Fees" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#FF6B35' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const AllocationPieChart = ({ allocationPct, theme }) => {
  const data = [
    { name: 'Your Allocation', value: allocationPct * 100 },
    { name: 'Other Investors', value: 100 - (allocationPct * 100) }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

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
          fill={theme === 'dark' ? '#F8FAFC' : '#374151'} 
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
          fill={theme === 'dark' ? '#F8FAFC' : '#374151'} 
          fontSize={12}
        >
          {`${value.toFixed(2)}%`}
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
    <Box sx={{ height: 200, background: 'transparent' }}>
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
            fill="#00D4FF"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#00D4FF' : '#00FF94'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value.toFixed(2)}%`, 'Allocation']}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#E5E7EB'}`,
              color: theme === 'dark' ? '#F8FAFC' : '#374151'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const RecentDistributions = React.memo(({ distributions, theme, cardStyles, formatDate }) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [amountFilter, setAmountFilter] = useState('');
  const [netReceivedFilter, setNetReceivedFilter] = useState('');

  // Sorting function
  const sortedDistributions = useMemo(() => {
    const sorted = [...distributions].map((row, index) => ({ ...row, originalIndex: index + 1 }));
    sorted.sort((a, b) => {
      const aValue = sortBy === 'netReceived' ? ((a.amount ?? 0) * 0.8) : (a[sortBy] ?? 0);
      const bValue = sortBy === 'netReceived' ? ((b.amount ?? 0) * 0.8) : (b[sortBy] ?? 0);
      if (sortBy === 'timestamp') {
        return sortOrder === 'desc'
          ? new Date(bValue).getTime() - new Date(aValue).getTime()
          : new Date(aValue).getTime() - new Date(bValue).getTime();
      }
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    return sorted;
  }, [distributions, sortBy, sortOrder]);

  // Filtering function
  const filteredDistributions = useMemo(() => {
    let filtered = sortedDistributions;
    if (amountFilter) {
      const filterValue = parseFloat(amountFilter);
      if (!isNaN(filterValue)) {
        filtered = filtered.filter((row) => (row.amount ?? 0) >= filterValue);
      }
    }
    if (netReceivedFilter) {
      const filterValue = parseFloat(netReceivedFilter);
      if (!isNaN(filterValue)) {
        filtered = filtered.filter((row) => ((row.amount ?? 0) * 0.8) >= filterValue);
      }
    }
    return filtered;
  }, [sortedDistributions, amountFilter, netReceivedFilter]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 600
        }}>
          Recent Distributions
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <TextField
            label="Min Amount ($)"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            type="number"
            size="small"
            sx={{ width: 150 }}
            InputProps={{
              startAdornment: <FeesIcon sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B', mr: 0.5 }} />,
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
                  color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                },
              },
            }}
          />
          <TextField
            label="Min Net Received ($)"
            value={netReceivedFilter}
            onChange={(e) => setNetReceivedFilter(e.target.value)}
            type="number"
            size="small"
            sx={{ width: 150 }}
            InputProps={{
              startAdornment: <FeesIcon sx={{ color: theme === 'dark' ? '#F8FAFC' : '#64748B', mr: 0.5 }} />,
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
                  color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                },
              },
            }}
          />
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid #E5E7EB',
            maxHeight: 300,
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{
                background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB'
              }}>
                <TableCell
                  sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600,
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
                    width: 60,
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600,
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSort('timestamp')}
                >
                  Date {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600,
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSort('amount')}
                >
                  Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600,
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#F9FAFB',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSort('netReceived')}
                >
                  Net Received {sortBy === 'netReceived' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDistributions.length > 0 ? (
                filteredDistributions.map((row, index) => (
                  <TableRow
                    key={row.id ?? `distribution-${index}`}
                    sx={{
                      background: index % 2 === 0
                        ? (theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)')
                        : 'transparent',
                      '&:hover': {
                        background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      },
                    }}
                  >
                    <TableCell sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                      {row.originalIndex}
                    </TableCell>
                    <TableCell sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                      {formatDate(row.timestamp ?? new Date())}
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                      ${(row.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme === 'dark' ? '#F8FAFC' : '#0F172A' }}>
                      ${((row.amount ?? 0) * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B'
                  }}>
                    No distributions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
});

const PAMMInvestor = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [investorData, setInvestorData] = useState(null);
  const [pammStatus, setPammStatus] = useState({
    totalFunds: 0,
    investorCount: 0
  });
  const [distributions, setDistributions] = useState([]);
  const [performance, setPerformance] = useState({
    ytdReturn: 0,
    totalFees: 0,
    initialBalance: 0,
    currentBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [allocation, setAllocation] = useState('');
  const [drawdownLimit, setDrawdownLimit] = useState(20);
  const [isInvestor, setIsInvestor] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const cardStyles = {
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
    border: theme === 'dark' 
      ? '1px solid rgba(56, 189, 248, 0.3)'
      : '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    boxShadow: theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)'
      : '0 8px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.01)',
      boxShadow: theme === 'dark' 
        ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.2)'
        : '0 12px 40px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
      border: theme === 'dark' 
        ? '1px solid rgba(56, 189, 248, 0.5)'
        : '1px solid rgba(59, 130, 246, 0.3)'
    }
  };

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

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchInvestorData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        showSnackbar('Please log in to continue', 'error');
        navigate('/dashboard/information/refreshthepage');
        return;
      }

      const [statusRes, perfRes, distRes] = await Promise.all([
        fetchWithAuth('http://localhost:5000/pamm/status'),
        fetchWithAuth('http://localhost:5000/pamm/performance'),
        fetchWithAuth('http://localhost:5000/pamm/distributions')
      ]);

      if (!statusRes.ok) throw new Error((await statusRes.json()).message || 'Failed to fetch status');
      if (!perfRes.ok) throw new Error((await perfRes.json()).message || 'Failed to fetch performance');
      if (!distRes.ok) throw new Error((await distRes.json()).message || 'Failed to fetch distributions');

      const statusData = await statusRes.json();
      const perfData = await perfRes.json();
      const distData = await distRes.json();

      const isInvestor = !!statusData.investor;
      setIsInvestor(isInvestor);
      setInvestorData(statusData.investor || null);
      setDrawdownLimit(statusData.investor ? (statusData.investor.drawdown_limit || 0.2) * 100 : 20);

      setPammStatus({
        totalFunds: statusData.total_funds || 0,
        investorCount: statusData.investors ? statusData.investors.length : 0
      });

      setPerformance({
        ytdReturn: perfData.ytdReturn || 0,
        totalFees: perfData.totalFees || 0,
        initialBalance: perfData.initialBalance || 0,
        currentBalance: perfData.currentBalance || 0
      });

      setDistributions(distData.data || []);

    } catch (error) {
      console.error('Failed to fetch investor data:', error);
      setError(error.message || 'Failed to load data');
      navigate('/dashboard/information/refreshthepage', { state: { error: error.message } });
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSnackbar, navigate]);

  useEffect(() => {
    fetchInvestorData();
  }, [fetchInvestorData]);

  useEffect(() => {
    if (investorData?.balance && performance.initialBalance) {
      const drawdown = ((performance.initialBalance - investorData.balance) / performance.initialBalance);
      if (drawdown >= (investorData.drawdown_limit || 0.2)) {
        showSnackbar(
          'Your account has been liquidated due to drawdown limit breach', 
          'error'
        );
      }
    }
  }, [investorData, performance, showSnackbar]);

  const handleJoinPAMM = async () => {
    try {
      if (!allocation || isNaN(allocation) || allocation <= 0 || allocation > 100) {
        showSnackbar('Please enter a valid allocation between 1-100%', 'error');
        return;
      }

      if (isNaN(drawdownLimit) || drawdownLimit <= 0 || drawdownLimit > 100) {
        showSnackbar('Please enter a valid drawdown limit between 1-100%', 'error');
        return;
      }

      const response = await fetchWithAuth('http://localhost:5000/pamm/join', {
        method: 'POST',
        body: JSON.stringify({
          allocation: parseFloat(allocation) / 100,
          drawdown_limit: parseFloat(drawdownLimit) / 100
        })
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Failed to join PAMM');

      showSnackbar(
        `Successfully joined PAMM with ${drawdownLimit}% drawdown protection`, 
        'success'
      );
      setJoinDialogOpen(false);
      setIsInvestor(true);
      await fetchInvestorData();

    } catch (error) {
      console.error('Error joining PAMM:', error);
      showSnackbar(
        error.message || 'Failed to join PAMM system',
        'error'
      );
    }
  };

  const handleDeposit = () => navigate('/dashboard/deposit');
  const handleWithdraw = () => navigate('/dashboard/withdraw');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !investorData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchInvestorData}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const profit = (investorData?.balance || 0) - performance.initialBalance;
  const progressValue = performance.initialBalance > 0 
    ? ((investorData?.balance || 0) / performance.initialBalance * 100) 
    : 0;

  return (
    <Box sx={containerStyles}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: '1.25rem', // mobile ~20px
            sm: '1.75rem', // tablets ~28px
            md: '2.5rem',  // desktop ~40px
          },
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 700,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #38BDF8, #A855F7)'
            : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: theme === 'dark' 
            ? '0 4px 8px rgba(56, 189, 248, 0.3)'
            : '0 4px 8px rgba(59, 130, 246, 0.2)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        PAMM Investor Dashboard
      </Typography>

        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          style={{ padding: '4px', fontSize: '14px' }}
        />
      </Box>

      <Button 
        onClick={() => setShowInfoPanel(!showInfoPanel)}
        variant="outlined"
        size="small"
        sx={{
          ml: 2,
          mb: 2,
          borderRadius: '8px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme === 'dark' 
            ? 'rgba(56, 189, 248, 0.25)' 
            : 'rgba(59, 130, 246, 0.2)',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
          color: theme === 'dark' 
            ? 'rgba(226, 232, 240, 0.9)' 
            : 'rgba(30, 41, 59, 0.9)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          fontFamily: '"Inter", -apple-system, sans-serif',
          fontSize: '0.8rem',
          textTransform: 'none',
          px: 2,
          py: 0.8,
          backdropFilter: 'blur(8px)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: theme === 'dark' 
            ? '0 2px 8px -2px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(148, 163, 184, 0.1)'
            : '0 2px 8px -2px rgba(0, 107, 194, 0.08), inset 0 0 0 1px rgba(203, 213, 225, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: theme === 'dark' 
              ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.25), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          },
          '&:hover': {
            borderColor: theme === 'dark' 
              ? 'rgba(56, 189, 248, 0.4)' 
              : 'rgba(59, 130, 246, 0.35)',
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
            color: theme === 'dark' 
              ? 'rgba(226, 232, 240, 1)' 
              : 'rgba(30, 41, 59, 1)',
            boxShadow: theme === 'dark' 
              ? '0 4px 16px -4px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(56, 189, 248, 0.2)'
              : '0 4px 16px -4px rgba(0, 107, 194, 0.15), inset 0 0 0 1px rgba(59, 130, 246, 0.25)',
            transform: 'translateY(-1px)',
            '&::before': {
              opacity: 1
            }
          },
          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: theme === 'dark' 
              ? '0 2px 8px -2px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(56, 189, 248, 0.25)'
              : '0 2px 8px -2px rgba(0, 107, 194, 0.12), inset 0 0 0 1px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.1s ease'
          }
        }}
      >
        <Box component="span" sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box component="span" sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: theme === 'dark' 
              ? 'linear-gradient(45deg, #38BDF8, #0EA5E9)'
              : 'linear-gradient(45deg, #3B82F6, #2563EB)',
            opacity: showInfoPanel ? 1 : 0.6,
            transition: 'all 0.2s ease',
            boxShadow: showInfoPanel 
              ? (theme === 'dark' 
                ? '0 0 8px rgba(56, 189, 248, 0.5)' 
                : '0 0 8px rgba(59, 130, 246, 0.4)')
              : 'none'
          }} />
          {showInfoPanel ? 'HIDE OVERVIEW' : 'SHOW OVERVIEW'}
        </Box>
      </Button>

      {showInfoPanel && (
          <InvestordashboardInfoPanel 
            theme={theme} 
            onClose={() => setShowInfoPanel(false)} 
          />
        )}

        

      {!isInvestor && (
        <Box mb={4} textAlign="center">
          <Button
            variant="contained"
            onClick={() => setJoinDialogOpen(true)}
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
            Join PAMM System
          </Button>
        </Box>
      )}

      {isInvestor && investorData && (
        <RiskIndicator 
          currentBalance={investorData.balance}
          initialBalance={performance.initialBalance}
          drawdownLimit={(investorData.drawdown_limit || 0.2) * 100}
          theme={theme}
        />
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BalanceIcon sx={{ 
                  color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                  fontSize: '40px',
                  filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.3))'
                }} />
                <Box ml={2}>
                  <Typography variant="h6" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Your Investment
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    fontWeight: 700,
                    fontSize: '1.8rem'
                  }}>
                    ${(investorData?.balance || 0).toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PerformanceIcon 
                  sx={{ 
                    color: performance.ytdReturn >= 0 
                      ? (theme === 'dark' ? '#00FF94' : '#10B981')
                      : (theme === 'dark' ? '#FF4757' : '#EF4444'),
                    fontSize: '40px',
                    filter: `drop-shadow(0 4px 8px ${
                      performance.ytdReturn >= 0 
                        ? 'rgba(0, 255, 148, 0.3)' 
                        : 'rgba(255, 71, 87, 0.3)'
                    })`
                  }} 
                />
                <Box ml={2}>
                  <Typography variant="h6" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    YTD Return
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      color: performance.ytdReturn >= 0 
                        ? (theme === 'dark' ? '#00FF94' : '#10B981')
                        : (theme === 'dark' ? '#FF4757' : '#EF4444'),
                      fontWeight: 700,
                      fontSize: '1.8rem',
                      textShadow: performance.ytdReturn >= 0 
                        ? '0 2px 4px rgba(0, 255, 148, 0.2)'
                        : '0 2px 4px rgba(255, 71, 87, 0.2)'
                    }}
                  >
                    {performance.ytdReturn.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AllocationIcon sx={{ 
                  color: theme === 'dark' ? '#A855F7' : '#8B5CF6',
                  fontSize: '40px',
                  filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
                }} />
                <Box ml={2}>
                  <Typography variant="h6" sx={{ 
                    color: theme === 'dark' ? '#94A3B8' : '#64748B',
                    fontWeight: 600
                  }}>
                    Your Allocation
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                    fontWeight: 700,
                    fontSize: '1.8rem'
                  }}>
                    {investorData ? `${(investorData.allocation_pct * 100).toFixed(2)}%` : '0.00%'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 700,
                fontSize: '1.3rem'
              }}>
                Investment Performance
              </Typography>
              <Box mb={2}>
                <Typography gutterBottom sx={{
                  color: theme === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 600
                }}>
                  Current Value: ${(investorData?.balance || 0).toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    backgroundColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: profit >= 0 ? '#00FF94' : '#FF4757',
                      borderRadius: 6,
                      boxShadow: profit >= 0 
                        ? '0 0 8px rgba(0, 255, 148, 0.4)'
                        : '0 0 8px rgba(255, 71, 87, 0.4)'
                    }
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{
                  color: theme === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 600
                }}>
                  Initial: ${performance.initialBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  })}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{
                    color: profit >= 0 
                      ? (theme === 'dark' ? '#00FF94' : '#10B981')
                      : (theme === 'dark' ? '#FF4757' : '#EF4444'),
                    fontWeight: 700
                  }}
                >
                  {profit >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(profit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                  })}
                </Typography>
              </Box>
              <PerformanceWaterfallChart 
                initial={performance.initialBalance}
                current={investorData?.balance || 0}
                fees={performance.totalFees}
                theme={theme}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 700,
                fontSize: '1.3rem'
              }}>
                PAMM Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeesIcon sx={{ 
                      color: theme === 'dark' ? '#FF6B35' : '#F97316',
                      filter: 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))'
                    }} />
                    <Box ml={2}>
                      <Typography sx={{
                        color: theme === 'dark' ? '#94A3B8' : '#64748B',
                        fontWeight: 600
                      }}>
                        Total Fees Paid
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                        fontWeight: 700
                      }}>
                        ${performance.totalFees.toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <InvestorsIcon sx={{ 
                      color: theme === 'dark' ? '#38BDF8' : '#3B82F6',
                      filter: 'drop-shadow(0 2px 4px rgba(56, 189, 248, 0.3))'
                    }} />
                    <Box ml={2}>
                      <Typography sx={{
                        color: theme === 'dark' ? '#94A3B8' : '#64748B',
                        fontWeight: 600
                      }}>
                        Total Investors
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                        fontWeight: 600
                      }}>
                        {pammStatus.investorCount}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mt={2}>
                    <CalendarIcon sx={{ 
                      color: theme === 'dark' ? '#818CF8' : '#4F46E5'
                    }} />
                    <Box ml={2}>
                      <Typography sx={{
                        color: theme === 'dark' ? '#94A3B8' : '#64748B'
                      }}>
                        Last Distribution
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                        fontWeight: 600
                      }}>
                        {distributions.length > 0 ? 
                          formatDate(distributions[0].timestamp) : 
                          'Never'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" align="center" gutterBottom sx={{
                    color: theme === 'dark' ? '#94A3B8' : '#64748B'
                  }}>
                    Your Allocation Share
                  </Typography>
                  {investorData ? (
                    <AllocationPieChart allocationPct={investorData.allocation_pct} theme={theme} />
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height={180}>
                      <Typography variant="body2" sx={{
                        color: theme === 'dark' ? '#94A3B8' : '#64748B'
                      }}>
                        Not currently invested
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <RecentDistributions 
            distributions={distributions}
            theme={theme}
            cardStyles={cardStyles}
            formatDate={formatDate}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 600
              }}>
                Your Return Trend
              </Typography>
              <Box sx={{ height: 200 }}>
                {investorData ? (
                  <ReturnTrendChart 
                    distributions={distributions} 
                    allocationPct={investorData.allocation_pct} 
                    theme={theme}
                  />
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Typography variant="body2" sx={{
                      color: theme === 'dark' ? '#94A3B8' : '#64748B'
                    }}>
                      Not currently invested
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end">
        <Grid item xs={12} md={5}>
          <Card sx={{ 
            ...cardStyles,
            mb: 3,
            width: '100%' 
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 600
                }}>
                  Quick Actions
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  onClick={handleDeposit}
                  startIcon={<AddIcon />}
                  size="medium" 
                  sx={{
                    background: theme === 'dark' ? 'linear-gradient(to right, #1E40AF, #3730A3)' : 'linear-gradient(to right, #3B82F6, #6366F1)',
                    '&:hover': {
                      background: theme === 'dark' ? 'linear-gradient(to right, #1E3A8A, #312E81)' : 'linear-gradient(to right, #2563EB, #4F46E5)'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    letterSpacing: 'normal',
                    width: '100%',
                    py: 1 
                  }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  onClick={handleWithdraw}
                  startIcon={<RemoveIcon />}
                  size="medium"
                  disabled={!isInvestor}
                  sx={{
                    background: theme === 'dark' ? 'linear-gradient(to right, #9D174D, #831843)' : 'linear-gradient(to right, #EC4899, #F43F5E)',
                    '&:hover': {
                      background: theme === 'dark' ? 'linear-gradient(to right, #831843, #6B21A8)' : 'linear-gradient(to right, #DB2777, #E11D48)'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    letterSpacing: 'normal',
                    width: '100%',
                    py: 1
                  }}
                >
                  Withdraw Funds
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  size="medium"
                  sx={{
                    borderColor: theme === 'dark' ? '#3B82F6' : '#2563EB',
                    color: theme === 'dark' ? '#3B82F6' : '#2563EB',
                    '&:hover': {
                      borderColor: theme === 'dark' ? '#2563EB' : '#1E40AF',
                      backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    letterSpacing: 'normal',
                    width: '100%',
                    py: 1
                  }}
                >
                  View History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog 
        open={joinDialogOpen} 
        onClose={() => setJoinDialogOpen(false)}
        PaperProps={{
          sx: {
            background: theme === 'dark' 
              ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
              : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
            borderRadius: '12px',
            border: theme === 'dark' 
              ? '1px solid rgba(100, 116, 139, 0.5)'
              : '1px solid rgba(203, 213, 225, 0.7)',
            boxShadow: theme === 'dark' 
              ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
              : '0px 8px 24px rgba(0, 0, 0, 0.1)',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 700,
          fontSize: '1.25rem',
          borderBottom: theme === 'dark' 
            ? '1px solid rgba(71, 85, 105, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.7)',
          padding: '16px 24px'
        }}>
          Join PAMM System
        </DialogTitle>
        
        <DialogContent sx={{ padding: '20px 24px' }}>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            lineHeight: 1.6,
            mb: 3
          }}>
            Allocate a percentage of your funds to be managed by our PAMM system.
            We charge a 20% performance fee only on profits above your high water mark.
          </Typography>
          
          <TextField
            label="Allocation Percentage"
            type="number"
            fullWidth
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
            InputProps={{ 
              endAdornment: '%',
              sx: {
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
                }
              }
            }}
            InputLabelProps={{
              sx: {
                color: theme === 'dark' ? '#94A3B8' : '#64748B'
              }
            }}
            sx={{ mb: 3 }}
            helperText="Enter a value between 1-100%"
            FormHelperTextProps={{
              sx: {
                color: theme === 'dark' ? '#94A3B8' : '#64748B'
              }
            }}
          />
          
          <TextField
            label="Max Drawdown Limit"
            type="number"
            fullWidth
            value={drawdownLimit}
            onChange={(e) => setDrawdownLimit(e.target.value)}
            InputProps={{ 
              endAdornment: '%',
              sx: {
                color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#334155' : '#CBD5E1'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#475569' : '#94A3B8'
                }
              }
            }}
            InputLabelProps={{
              sx: {
                color: theme === 'dark' ? '#94A3B8' : '#64748B'
              }
            }}
            helperText="Auto-liquidates if losses exceed this %"
            FormHelperTextProps={{
              sx: {
                color: theme === 'dark' ? '#94A3B8' : '#64748B'
              }
            }}
          />

          <Alert severity="info" sx={{ 
            mt: 3,
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            borderColor: theme === 'dark' ? '#0EA5E9' : '#BAE6FD'
          }}>
            <WarningIcon fontSize="inherit" sx={{ 
              color: theme === 'dark' ? '#38BDF8' : '#0EA5E9' 
            }} />
            Recommended drawdown limit: 10-30%. Lower values mean stricter protection.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{
          padding: '16px 24px',
          borderTop: theme === 'dark' 
            ? '1px solid rgba(71, 85, 105, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.7)'
        }}>
          <Button 
            onClick={() => setJoinDialogOpen(false)}
            sx={{ 
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleJoinPAMM} 
            variant="contained"
            disabled={!allocation || allocation > 100 || !drawdownLimit || drawdownLimit > 100}
            sx={{
              background: theme === 'dark' 
                ? 'linear-gradient(to right, #3B82F6, #6366F1)'
                : 'linear-gradient(to right, #2563EB, #4F46E5)',
              color: '#FFFFFF',
              fontWeight: 500,
              '&:hover': {
                background: theme === 'dark' 
                  ? 'linear-gradient(to right, #2563EB, #4F46E5)'
                  : 'linear-gradient(to right, #1D4ED8, #3730A3)'
              },
              '&.Mui-disabled': {
                background: theme === 'dark' 
                  ? 'rgba(100, 116, 139, 0.5)'
                  : 'rgba(203, 213, 225, 0.5)'
              }
            }}
          >
            Join PAMM
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Wrap PAMMInvestor with ThemeProvider
const WrappedPAMMInvestor = () => (
  <ThemeProvider>
    <PAMMInvestor />
  </ThemeProvider>
);

export default WrappedPAMMInvestor;