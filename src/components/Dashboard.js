

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut } from "lucide-react";
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { 
  ChevronRight, Activity, TrendingUp, Clock, DollarSign, PlusCircle, MinusCircle,  
  BarChart3, PieChart, Bell, Search, Menu, X, Wallet, History,
  Target,  ArrowUp, ArrowDown, RefreshCw, Eye, EyeOff, Home, Zap,
  AlertCircle, CheckCircle, Sun, Moon, Download, ChevronLeft, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp
 
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { useAuth } from './Auth';
import MarketData from './MarketData';
import TradePanel from './TradePanel';
import TransactionHistory from './TransactionHistory';
import ProfitTracker from './ProfitTracker';
import MarketOverview from './MarketOverview';
import FirestoreQuery from './FirestoreQuery';
import { PAMMManager, PAMMInvestor } from './PAMM';
import AdminDashboard from './AdminDashboard';
import PAMMTradePanel from './PAMM/PAMMTradePanel';

import NetworkStatus from './networkstatus'; // FIXED
import Deposit from './Deposit';
import Withdraw from './Withdraw';
// import { ArrowBack } from '@mui/icons-material';

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -300, opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const modalTitles = {
  portfolio: "Total Portfolio Breakdown",
  pl: "Today's P&L Analysis",
  trades: "Trade History",
  success: "Performance Analytics",
  zap: "System Status & Alerts",
};

const DashboardWelcomeModalContent = ({ modalType, theme, timeframe, setTimeframe, tradeFilter, setTradeFilter, alertFilter, setAlertFilter, tradeHistory, successfulTrades, totalTrades, portfolioChartRef, plChartRef, tradesChartRef, successChartRef, navigate, triggerAlert, balance, holdings, profit }) => { 
  DashboardWelcomeModalContent.propTypes = {
    modalType: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
    setTimeframe: PropTypes.func.isRequired,
    tradeFilter: PropTypes.string.isRequired,
    setTradeFilter: PropTypes.func.isRequired,
    alertFilter: PropTypes.string.isRequired,
    setAlertFilter: PropTypes.func.isRequired,
    tradeHistory: PropTypes.array.isRequired,
    successfulTrades: PropTypes.number.isRequired,
    totalTrades: PropTypes.number.isRequired,
    portfolioChartRef: PropTypes.object.isRequired,
    plChartRef: PropTypes.object.isRequired,
    tradesChartRef: PropTypes.object.isRequired,
    successChartRef: PropTypes.object.isRequired,
    navigate: PropTypes.func.isRequired,
    triggerAlert: PropTypes.func.isRequired,
    balance: PropTypes.number.isRequired,
    holdings: PropTypes.number.isRequired,
    profit: PropTypes.number.isRequired,
  };

  // Portfolio chart
  useEffect(() => {
    if (modalType !== 'portfolio' || !portfolioChartRef.current) return;
    
    const ctx = portfolioChartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Cash (XLM)', 'Holdings'],
        datasets: [{
          data: [balance, holdings],
          backgroundColor: ['#3B82F6', '#10B981']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: theme === 'dark' ? '#FFF' : '#000' } } }
      }
    });

    return () => chart.destroy();
  }, [modalType, balance, holdings, theme, portfolioChartRef]);

  // PL chart
  useEffect(() => {
    if (modalType !== 'pl' || !plChartRef.current) return;
    
    const ctx = plChartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeframe === '1D' ? Array(24).fill().map((_, i) => `${i}h`) : timeframe === '1W' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : Array(30).fill().map((_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'P&L (XLM)',
          data: Array(24).fill().map(() => profit * 0.3 * (0.8 + Math.random() * 0.4)),
          borderColor: '#10B981',
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.2)'
        }]
      },
      options: {
        plugins: { legend: { labels: { color: theme === 'dark' ? '#FFF' : '#000' } } },
        scales: { y: { ticks: { color: theme === 'dark' ? '#FFF' : '#000' } }, x: { ticks: { color: theme === 'dark' ? '#FFF' : '#000' } } }
      }
    });

    return () => chart.destroy();
  }, [modalType, timeframe, profit, theme, plChartRef]);

  // Trades chart
  useEffect(() => {
    if (modalType !== 'trades' || !tradesChartRef.current) return;
    
    const ctx = tradesChartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: timeframe === '1D' ? ['0-6h', '6-12h', '12-18h', '18-24h'] : timeframe === '1W' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : Array(30).fill().map((_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Trades',
          data: timeframe === '1D' ? [3, 5, 2, 4] : timeframe === '1W' ? [10, 15, 12, 18, 14, 16, 20] : Array(30).fill().map(() => Math.floor(Math.random() * 20)),
          backgroundColor: '#8B5CF6'
        }]
      },
      options: {
        plugins: { legend: { labels: { color: theme === 'dark' ? '#FFF' : '#000' } } },
        scales: { y: { ticks: { color: theme === 'dark' ? '#FFF' : '#000' } }, x: { ticks: { color: theme === 'dark' ? '#FFF' : '#000' } } }
      }
    });

    return () => chart.destroy();
  }, [modalType, timeframe, theme, tradesChartRef]);

  // Success chart
  useEffect(() => {
    if (modalType !== 'success' || !successChartRef.current) return;
    
    const ctx = successChartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Wins', 'Losses'],
        datasets: [{
          data: [successfulTrades, totalTrades - successfulTrades],
          backgroundColor: ['#10B981', '#EF4444']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: theme === 'dark' ? '#FFF' : '#000' } } }
      }
    });

    return () => chart.destroy();
  }, [modalType, successfulTrades, totalTrades, theme, successChartRef]);

  const modalConfigs = {
    portfolio: {
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['1D', '1W', '1M'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-none min-w-0 transition-colors ${
                  timeframe === tf 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : theme === 'dark' 
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="w-full min-h-[200px] flex items-center justify-center">
              <canvas 
                ref={portfolioChartRef} 
                className="w-full h-auto max-w-full" 
                style={{ minHeight: '200px' }}
              />
            </div>
            <div className="w-full min-h-[200px] flex items-center justify-center">
              <canvas 
                id="portfolioLineChart" 
                className="w-full h-auto max-w-full" 
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/dashboard/trade/panel')} 
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Trade Now
            </button>
            <button 
              onClick={() => navigate('/dashboard/deposit')} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Deposit Funds
            </button>
            <button 
              onClick={() => navigate('/dashboard/withdraw')} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Withdraw Funds
            </button>
            <button 
              onClick={() => triggerAlert('View detailed portfolio', 'success')} 
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      )
    },
    pl: {
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['1D', '1W', '1M'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-none min-w-0 transition-colors ${
                  timeframe === tf 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : theme === 'dark' 
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="w-full min-h-[250px] flex items-center justify-center">
            <canvas 
              ref={plChartRef} 
              className="w-full h-auto max-w-full" 
              style={{ minHeight: '250px' }}
            />
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-600'}`}>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium">Trade</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-2 sm:px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-2 sm:px-4 py-3 text-right font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory && tradeHistory.length > 0 ? (
                    tradeHistory.slice(0, 5).map(trade => (
                      <tr 
                        key={trade.id} 
                        className={`border-b ${theme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-100 text-gray-900'}`}
                      >
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-2 sm:px-4 py-3 capitalize text-xs sm:text-sm">
                          {trade.action}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">
                          ${trade.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className={`px-2 sm:px-4 py-3 text-right text-xs sm:text-sm ${
                          (trade.profit || 0) > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          ${trade.profit?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan="4" 
                        className={`px-4 py-8 text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}
                      >
                        No trade history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/dashboard/Transaction/History')} 
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              View Trade History
            </button>
            <button 
              onClick={() => navigate('/dashboard/profit/tracker')} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Analyze Trades
            </button>
          </div>
        </div>
      )
    },
    trades: {
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex gap-2 flex-1">
              {['1D', '1W', '1M'].map(tf => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-none transition-colors ${
                    timeframe === tf 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                      : theme === 'dark' 
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <select
              value={tradeFilter}
              onChange={e => setTradeFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium w-full sm:w-auto border transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-white border-slate-700 hover:border-slate-600' 
                  : 'bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="all">All Trades</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          
          <div className="w-full min-h-[250px] flex items-center justify-center">
            <canvas 
              ref={tradesChartRef} 
              className="w-full h-auto max-w-full" 
              style={{ minHeight: '250px' }}
            />
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-600'}`}>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-2 sm:px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory && tradeHistory.length > 0 ? (
                    tradeHistory
                      .filter(trade => tradeFilter === 'all' || trade.action === tradeFilter)
                      .slice(0, 5)
                      .map(trade => (
                        <tr 
                          key={trade.id} 
                          className={`border-b ${theme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-100 text-gray-900'}`}
                        >
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                            {new Date(trade.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-4 py-3 capitalize text-xs sm:text-sm">
                            {trade.action}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm">
                            ${trade.amount?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td 
                        colSpan="3" 
                        className={`px-4 py-8 text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}
                      >
                        No trade history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => triggerAlert('Trades exported successfully!', 'success')} 
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center text-sm font-medium"
            >
              <Download size={16} className="mr-2" /> Export Trades
            </button>
            <button 
              onClick={() => navigate('/dashboard/Transaction-History')} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
      )
    },
    success: {
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['1D', '1W', '1M'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-none min-w-0 transition-colors ${
                  timeframe === tf 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : theme === 'dark' 
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                }`}  
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="w-full min-h-[250px] flex items-center justify-center">
              <canvas 
                ref={successChartRef} 
                className="w-full h-auto max-w-full" 
                style={{ minHeight: '250px' }}
              />
            </div>
            <div className="space-y-4 flex flex-col justify-center min-h-[250px]">
              <div className="text-center lg:text-left">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Success Rate
                </p>
                <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {totalTrades > 0 ? ((successfulTrades / totalTrades) * 100).toFixed(1) : 0}%
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  {successfulTrades} of {totalTrades} trades successful
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => triggerAlert('Comparing timeframes', 'success')} 
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Compare Timeframes
            </button>
            <button 
              onClick={() => navigate('/dashboard/profit-tracker')} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              View Profit Tracker
            </button>
          </div>
        </div>
      )
    },
    zap: {
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['all', 'system', 'market', 'trade'].map(type => (
              <button 
                key={type}
                onClick={() => setAlertFilter(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize flex-1 sm:flex-none min-w-0 transition-colors ${
                  alertFilter === type 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : theme === 'dark' 
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
            {[
              { id: 1, type: 'system', message: 'System maintenance scheduled at 2 AM', timestamp: new Date().toISOString() },
              { id: 2, type: 'market', message: 'BTC/USD volatility alert', timestamp: new Date().toISOString() },
              { id: 3, type: 'trade', message: 'Trade executed successfully', timestamp: new Date().toISOString() }
            ]
              .filter(alert => alertFilter === 'all' || alert.type === alertFilter)
              .map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 sm:p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {alert.message}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => triggerAlert('Alerts cleared', 'success')} 
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Clear Alerts
            </button>
            <button 
              onClick={() => triggerAlert('Viewing system logs', 'success')} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              View Logs
            </button>
          </div>
        </div>
      )
    }
  };

  const config = modalConfigs[modalType] || { content: null };
  return config.content;
};


const Modal1 = ({ isOpen, onClose, children, theme, title }) => {
  const [renderModal, setRenderModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!renderModal) return null;

  return (
    <AnimatePresence onExitComplete={() => setRenderModal(false)}>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={onClose}
        >
          {/* <motion.div
            key="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
            className={`rounded-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-700/50' : 'bg-white border border-gray-200'
            }`}
            onClick={e => e.stopPropagation()}
            // onAnimationComplete={handleAnimationComplete}
          >
            <div className={`flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 z-10 ${ 
              theme === 'dark' 
                ? 'border-slate-700 bg-slate-900' 
                : 'border-gray-200 bg-white' 
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold truncate pr-4 ${ 
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title || 'Modal'}
              </h2>
              <button 
                onClick={onClose} 
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${ 
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900' 
                }`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div> 
            
            <div className="overflow-y-auto p-4 sm:p-6" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {children}
            </div>
          </motion.div> */}
          <motion.div
            key="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
            className={`rounded-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900 border border-slate-700/50' : 'bg-white border border-gray-200'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 z-10 ${ 
              theme === 'dark' 
                ? 'border-slate-700 bg-slate-900' 
                : 'border-gray-200 bg-white' 
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold truncate pr-4 ${ 
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title || 'Modal'}
              </h2>
              <button 
                onClick={onClose} 
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${ 
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900' 
                }`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div> 
            <div className="overflow-y-auto p-3 sm:p-4" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



const Dashboard = ({ user }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState(0);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [profit, setProfit] = useState(0);
  const [target, setTarget] = useState(0);
  const [isBalanceUpdated, setIsBalanceUpdated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(null);
  const modalMounted = useRef(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  const portfolioChartRef = useRef(null);
  const plChartRef = useRef(null);
  const tradesChartRef = useRef(null);
  const successChartRef = useRef(null);
  const successfulTrades = useMemo(() => tradeHistory.filter(trade => trade.action === 'sell').length, [tradeHistory]);
  const totalTrades = useMemo(() => tradeHistory.length, [tradeHistory]);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const locationPathname = useMemo(() => location.pathname, [location.pathname]);

  const stableUser = useMemo(() => ({
    uid: user?.uid,
    displayName: user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
    is_admin: user?.is_admin || false
  }), [user?.uid, user?.displayName, user?.email, user?.photoURL, user?.is_admin ]);



  // Add this useEffect to log the user ID whenever it changes
  useEffect(() => {
    if (stableUser.uid) {
      console.log('Current User ID:', stableUser.uid);
      // You can also log the entire stableUser object if needed
      console.log('User Object:', stableUser);
    }
  }, [stableUser, stableUser.uid]); // This will run whenever stableUser or stableUser.uid changes

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const triggerAlert = useCallback((message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  }, []);

  useEffect(() => {
    modalMounted.current = true;
    return () => {
      modalMounted.current = false;
    };
  }, []);


  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (isBalanceUpdated) {
      const timer = setTimeout(() => setIsBalanceUpdated(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isBalanceUpdated]);

  useEffect(() => {
    setModalOpen(null);
  }, [location.pathname]);

  const fetchTransactionsWithRetry = useCallback(async (retryCount = 3) => {
    for (let i = 0; i < retryCount; i++) {
      try {
        const transactionsResponse = await fetch(`http://localhost:5000/transactions/${stableUser.uid}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const transactionsResult = await transactionsResponse.json();
        if (transactionsResult.status === 'success') {
          setTradeHistory((transactionsResult.trades || []).map(t => ({ ...t, type: 'trade' })));
          setDeposits((transactionsResult.deposits || []).map(t => ({ ...t, type: 'deposit' })));
          setWithdrawals((transactionsResult.withdrawals || []).map(t => ({ ...t, type: 'withdrawal' })));
          return true;
        } else {
          throw new Error(transactionsResult.message || 'Failed to fetch transactions');
        }
      } catch (error) {
        console.error(`Transaction fetch attempt ${i + 1} failed:`, error);
        if (i === retryCount - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }, [stableUser.uid]);

  useEffect(() => {
    const fetchUserData = async (retryCount = 3) => {
      if (!stableUser.uid) {
        setError('No user ID provided');
        triggerAlert('No user ID provided', 'error');
        setIsLoading(false);
        return;
      }

      for (let i = 0; i < retryCount; i++) {
        try {
          const response = await fetch(`http://localhost:5000/users/${stableUser.uid}`, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 404) throw new Error('User not found');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          if (result.status === 'success') {
            setBalance(result.user.balance || 0);
            setHoldings(result.user.holdings || 0);
            setProfit(result.user.profit || 0);
            setTarget(result.user.target || 0);
            user.is_admin = result.user.is_admin || false;
          } else {
            throw new Error(result.message || 'Failed to fetch user data');
          }

          await fetchTransactionsWithRetry();
          setError(null);
          triggerAlert(`Welcome ${stableUser.displayName?.split(' ')[0] || 'back to your Dashboard!'}!`, 'success');
          break;
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error.message);
          triggerAlert(error.message, 'error');
          if (i === retryCount - 1) break;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [stableUser.uid, user, stableUser.displayName, triggerAlert, fetchTransactionsWithRetry]);

  const handleDeposit = async (newBalance) => {
    setBalance(newBalance);
    setIsBalanceUpdated(true);
    triggerAlert('Deposit successful', 'success');
    await fetchTransactionsWithRetry();
  };


    // Add this withdrawal handler
    const handleProfitWithdraw = (amount) => {
      // Update local state
      setProfit(prev => prev - amount);
      setBalance(prev => prev + amount);
      
      // Show success notification
      triggerAlert(`Successfully withdrew $${amount.toFixed(2)} from profits!`, 'success');
    };

  const handleWithdraw = async (newBalance) => {
    setBalance(newBalance);
    setIsBalanceUpdated(true);
    triggerAlert(`Successfully withdrew ${(balance - newBalance).toFixed(2)} XLM`, 'success');
    await fetchTransactionsWithRetry();
  };

  const handleTradeExecution = async (action, amount, user = currentUser) => {
 
    try {
      if (!user) throw new Error('User not authenticated');
      // const token = await user.getIdToken();
      const token = user.token;
      const response = await fetch('http://localhost:5000/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: stableUser.uid, action, amount })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setBalance(result.newBalance);
        setHoldings(result.newHoldings);
        setProfit(result.newProfit);
        setIsBalanceUpdated(true);

        const newTrade = {
          id: result.tradeId,
          timestamp: new Date().toISOString(),
          action,
          amount,
          balance: result.newBalance,
          holdings: result.newHoldings,
          profit: action === 'sell' ? amount * 0.05 : 0,
          type: 'trade'
        };
        setTradeHistory(prev => [newTrade, ...prev]);

        await fetchTransactionsWithRetry();
        triggerAlert(`Successfully ${action}ed $${amount.toFixed(2)}`, 'success');
      } else {
        throw new Error(result.message || 'Trade failed');
      }
    } catch (error) {
      console.error('Trade execution error:', error);
      triggerAlert(`Trade failed: ${error.message}`, 'error');
    }
  };

  const handleModalNavigation = (path) => {
    if (modalOpen) {
      setModalOpen(null);
      setTimeout(() => navigate(path), 300);
    } else {
      navigate(path);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Zap size={40} className="text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'} flex h-screen overflow-hidden`}>
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        currentPath={locationPathname}
        theme={theme}
        user={stableUser}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${
                alertType === 'error' 
                  ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500' 
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500'
              } text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {alertType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  <span className="font-medium text-sm">{alertMessage}</span>
                </div>
                <button 
                  onClick={() => setShowAlert(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {error && (
          <div className="p-6">
            <div className="p-4 bg-red-900/50 text-red-400 rounded-lg">
              <p>Error: {error}</p>
              {error.includes('index') && (
                <p className="mt-2">
                  Please create the required Firestore index in the{' '}
                  <a
                    href="https://console.firebase.google.com/v1/r/project/gmxtrade-538a2/firestore/indexes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400"
                  >
                    Firebase Console
                  </a>.
                </p>
              )}
            </div>
          </div>
        )}

       <TopNavigation 
          onMenuToggle={() => setSidebarOpen(true)}
          balance={balance}
          holdings={holdings}
          isBalanceUpdated={isBalanceUpdated}
          theme={theme}
          toggleTheme={toggleTheme}
          user={stableUser}
        />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route 
              index 
              element={
                <motion.div key="dashboard" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                  <DashboardWelcome 
                    balance={balance} 
                    holdings={holdings} 
                    profit={profit} 
                    tradeHistory={tradeHistory} 
                    theme={theme}
                    toggleTheme={toggleTheme}
                    user={stableUser}
                    triggerAlert={triggerAlert}
                    openModal={setModalOpen}
                    navigate={handleModalNavigation}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    tradeFilter={tradeFilter}
                    setTradeFilter={setTradeFilter}
                    alertFilter={alertFilter}
                    setAlertFilter={setAlertFilter}
                    portfolioChartRef={portfolioChartRef}
                    plChartRef={plChartRef}
                    tradesChartRef={tradesChartRef}
                    successChartRef={successChartRef}
                    successfulTrades={successfulTrades}
                    totalTrades={totalTrades}
                  />
                </motion.div>
              } 
            />
            <Route path="market/data" element={<motion.div key="market/data" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><MarketData isDarkMode={theme === 'dark'}/></motion.div>} />
            <Route path="trade/panel" element={<motion.div key="trade/panel" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><TradePanel onTrade={handleTradeExecution} balance={balance} holdings={holdings}  isDarkMode={theme === 'dark'} /></motion.div>} />
            <Route path="Transaction/History" element={<motion.div key="Transactio/History" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><TransactionHistory trades={tradeHistory} deposits={deposits} withdrawals={withdrawals} isDarkMode={theme === 'dark'} /></motion.div>} />
            <Route path="profit/tracker" element={<motion.div key="profit/tracker" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><ProfitTracker profit={profit}  onWithdraw={handleProfitWithdraw}  target={target} onTargetChange={setTarget} isDarkMode={theme === 'dark'} userId={stableUser.uid} user={user}/></motion.div>} />
            <Route path="deposit" element={<motion.div key="deposit" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><Deposit onDeposit={handleDeposit} userId={stableUser.uid} isDarkMode={theme === 'dark'} /></motion.div>} />
            <Route path="firestore/query" element={<motion.div key="firestore/query" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}> <FirestoreQuery theme={theme} userEmail={stableUser.email} userId={stableUser.uid} isDarkMode={theme === 'dark'}/></motion.div>} />
            <Route path="network/status" element={<motion.div key="network/status" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><NetworkStatus isDarkMode={theme === 'dark'} /></motion.div>} />
            <Route path="withdraw" element={<motion.div key="withdraw" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={` rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><Withdraw onWithdraw={handleWithdraw} balance={balance} userId={stableUser.uid} isDarkMode={theme === 'dark'}/></motion.div>} />
            <Route path="pamm/manager" element={<motion.div key="pamm/manager" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><PAMMManager theme={theme} userId={stableUser.uid} isDarkMode={theme === 'dark'}/></motion.div>} />
            <Route path="pamm/investor" element={<motion.div key="pamm/investor" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><PAMMInvestor theme={theme} userId={stableUser.uid} isDarkMode={theme === 'dark'}/></motion.div>}/>
            <Route path="manager/trading" element={<motion.div key="pamm/trading" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><PAMMTradePanel userId={stableUser.uid} theme={theme} isDarkMode={theme === 'dark'}/></motion.div>}/>
            <Route path="admin" element={<motion.div key="admin" variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className={`rounded-xl ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}><AdminDashboard theme={theme} toggleTheme={toggleTheme} isDarkMode={theme === 'dark'}/></motion.div>} />
          </Routes>
        </div>
        {modalOpen && (
          <Modal1
            key={modalOpen} 
            isOpen={!!modalOpen}
            onClose={() => setModalOpen(null)}
            theme={theme}
            title={modalTitles[modalOpen]}
          >
            <DashboardWelcomeModalContent
              modalType={modalOpen}
              theme={theme}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              tradeFilter={tradeFilter}
              setTradeFilter={setTradeFilter}
              alertFilter={alertFilter}
              setAlertFilter={setAlertFilter}
              tradeHistory={tradeHistory}
              successfulTrades={successfulTrades}
              totalTrades={totalTrades}
              portfolioChartRef={portfolioChartRef}
              plChartRef={plChartRef}
              tradesChartRef={tradesChartRef}
              successChartRef={successChartRef}
              navigate={handleModalNavigation}
              triggerAlert={triggerAlert}
              balance={balance}
              holdings={holdings}
              profit={profit}
            />
          </Modal1>
        )}
      </div>
    </div>
  );
};


const DashboardWelcome = ({ 
  balance, 
  holdings, 
  profit, 
  tradeHistory, 
  theme, 
  toggleTheme, 
  user, 
  triggerAlert, 
  openModal, 
  successfulTrades, 
  totalTrades 
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const [isRecentActivityModalOpen, setIsRecentActivityModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const prevValuesRef = useRef({
    portfolioValue: 0,
    profit: 0,
    totalTrades: 0,
    successRate: 0
  });

  // // Sorting handler
  // const handleSort = (key) => {
  //   setSortConfig(prev => ({
  //     key,
  //     direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  //   }));
  // };

  // Filter handler
  const handleFilter = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  // Apply sorting and filtering to trade history
  const processedTradeHistory = useMemo(() => {
    let filtered = [...tradeHistory];
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(trade => trade.action === filterType);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortConfig.key === 'timestamp') {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      } else if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? (a.amount - b.amount) 
          : (b.amount - a.amount);
      }
      return 0;
    });
  }, [tradeHistory, filterType, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedTradeHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = processedTradeHistory.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  // Format numbers for display
  const formatUnits = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    if (num < 0.0001) return num.toFixed(8);
    if (num < 1) return num.toFixed(6);
    if (num < 100) return num.toFixed(4);
    return num.toFixed(2);
  };

  // Calculate percentage change with direction indicator
  const getChangePercent = (current, previous) => {
    if (previous === 0) return { value: '+0.0%', isPositive: true };
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? '+' : ''}${Math.abs(change).toFixed(1)}%`,
      isPositive
    };
  };

  // Calculate trade count change with direction indicator
  const getTradeChange = (current, previous) => {
    const change = current - previous;
    const isPositive = change >= 0;
    
    if (change > 0) return { value: `+${change} today`, isPositive };
    if (change < 0) return { value: `${change} today`, isPositive };
    return { value: 'No change', isPositive: true };
  };

  // Current values
  const portfolioValue = balance + holdings;
  const successRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;
  
  // Get previous values for comparison
  const prevValues = prevValuesRef.current;
  
  // Prepare stats with dynamic values and change indicators
  const stats = [
    {
      label: 'Total Portfolio Value',
      value: hideBalance ? '••••••' : `${formatUnits(portfolioValue)} XLM`,
      change: getChangePercent(portfolioValue, prevValues.portfolioValue),
      icon: <Wallet size={20} className="text-emerald-400" />,
      modal: 'portfolio'
    },
    {
      label: "Today's P&L",
      value: hideBalance ? '••••••' : `${formatUnits(profit * 0.3)} XLM`,
      change: getChangePercent(profit, prevValues.profit),
      icon: <TrendingUp size={20} className="text-blue-400" />,
      modal: 'pl'
    },
    {
      label: 'Total Trades',
      value: totalTrades.toString(),
      change: getTradeChange(totalTrades, prevValues.totalTrades),
      icon: <Activity size={20} className="text-purple-400" />,
      modal: 'trades'
    },
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      change: getChangePercent(successRate, prevValues.successRate),
      icon: <Target size={20} className="text-amber-400" />,
      modal: 'success'
    },
    {
      label: 'Zap',
      value: 'Active',
      change: { value: 'Stable', isPositive: true },
      icon: <Zap size={20} className="text-yellow-400" />,
      modal: 'zap'
    }
  ];

  // Update previous values after render
  useEffect(() => {
    prevValuesRef.current = {
      portfolioValue,
      profit,
      totalTrades,
      successRate
    };
  });

  return (
    <div className={`relative w-full min-h-screen p-4 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}> 
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6 }} 
    className="space-y-6 max-w-7xl mx-auto"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Trader'}!
        </h1>
        <p className="mt-1 flex items-center text-sm">
          {user?.email ? `Logged in as ${user.email}` : "Here's what's happening with your portfolio today."}
          <ChevronRight size={16} className="ml-2" />
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setHideBalance(!hideBalance)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          title={hideBalance ? "Show balance" : "Hide balance"}
        >
          {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <button
          onClick={() => triggerAlert('Balance refreshed!', 'success')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          title="Refresh Balance"
        >
          <RefreshCw size={20} />
        </button>
        {/* <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}
      </div>
    </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-6 rounded-xl shadow-2xl border cursor-pointer group ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              onClick={() => openModal(stat.modal)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`mb-1 text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    {stat.label}
                  </p>
                  <p className={`mb-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.change.isPositive ? (
                      <div className="flex items-center text-emerald-500">
                        <ArrowUp size={16} className="mr-1" />
                        <span className="text-sm font-medium text-emerald-400">
                          {stat.change.value}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <ArrowDown size={16} className="mr-1" />
                        <span className="text-sm font-medium text-red-400">
                          {stat.change.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-xl transition-colors group-hover:bg-emerald-500/20 ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 text-emerald-400' 
                    : 'bg-gray-100 text-emerald-600'
                }`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`rounded-xl p-6 shadow-2xl border ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`mb-4 flex items-center text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 size={20} className="mr-2 text-blue-400" /> 
              Market Overview
            </h3>
            <MarketOverview theme={theme} />
          </motion.div>
          
          {/* Recent Activity Card with Sorting/Filtering */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.6 }} 
            className={`rounded-xl p-6 shadow-2xl border cursor-pointer ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
                : 'bg-white border-gray-200'
            }`}
            onClick={() => setIsRecentActivityModalOpen(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`flex items-center text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock size={20} className="mr-2 text-purple-400" /> 
                Recent Activity
              </h3>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                {tradeHistory.length} total trades
              </span>
            </div>

            {/* Sorting/Filtering Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Filter buttons */}
              <div className="flex space-x-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleFilter('all'); }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterType === 'all' 
                      ? theme === 'dark' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 text-purple-700'
                      : theme === 'dark' 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleFilter('buy'); }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterType === 'buy' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : theme === 'dark' 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buys
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleFilter('sell'); }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterType === 'sell' 
                      ? 'bg-red-500/20 text-red-400' 
                      : theme === 'dark' 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sells
                </button>
              </div>
              
              {/* Sorting dropdown */}
              <select
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  e.stopPropagation();
                  const [key, direction] = e.target.value.split('-');
                  setSortConfig({ key, direction });
                }}
                className={`text-xs rounded-full px-3 py-1 ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-slate-300 border-slate-700' 
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border focus:outline-none`}
                onClick={e => e.stopPropagation()}
              >
                <option value="timestamp-desc">Newest First</option>
                <option value="timestamp-asc">Oldest First</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>

            {/* Trade List */}
            <div className="space-y-3 mb-4">
              {currentTrades.length > 0 ? (
                currentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        trade.action === 'buy' 
                          ? 'bg-emerald-900/50 text-emerald-400' 
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {trade.action === 'buy' 
                          ? <ArrowUp size={16} /> 
                          : <ArrowDown size={16} />}
                      </div>
                      <div>
                        <p className="capitalize text-sm font-medium">{trade.action}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                          {new Date(trade.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      ${trade.amount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                ))
              ) : (
                <div className={`text-center py-4 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                  No trades to display
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                  Showing {startIndex + 1}-{Math.min(endIndex, processedTradeHistory.length)} of {processedTradeHistory.length}
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* First Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); goToFirstPage(); }}
                    disabled={currentPage === 1}
                    className={`p-1 rounded transition-colors ${
                      currentPage === 1 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : theme === 'dark' 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronsLeft size={16} />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
                    disabled={currentPage === 1}
                    className={`p-1 rounded transition-colors ${
                      currentPage === 1 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : theme === 'dark' 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsis = index > 0 && array[index - 1] < page - 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className={`px-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                              ...
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); goToPage(page); }}
                            className={`px-2 py-1 text-sm rounded transition-colors ${
                              currentPage === page 
                                ? theme === 'dark' 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-purple-100 text-purple-700'
                                : theme === 'dark' 
                                  ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  {/* Next Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded transition-colors ${
                      currentPage === totalPages 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : theme === 'dark' 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={(e) => { e.stopPropagation(); goToLastPage(); }}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded transition-colors ${
                      currentPage === totalPages 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : theme === 'dark' 
                          ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Portfolio Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.7 }}
            className={`relative rounded-2xl p-6 shadow-xl border transition-all duration-300 hover:shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/30' 
                : 'bg-white border-gray-200/50'
            }`}
           >
            <h3 className={`mb-5 flex items-center text-xl font-semibold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <PieChart size={22} className="mr-2 text-amber-400" /> 
              Portfolio Allocation
            </h3>
            <div className="space-y-4">
              {/* Cash Section */}
              <div className="flex items-center justify-between group hover:bg-slate-800/10 p-2 rounded-lg transition-all duration-200">
                <span className={`font-medium text-sm tracking-wide ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Cash (XLM)
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-3 rounded-full bg-slate-300/30 overflow-hidden">
                    <motion.div 
                      className="h-3 rounded-full bg-blue-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${(balance / portfolioValue) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className={`font-medium text-sm w-28 text-right ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {((balance / portfolioValue) * 100).toFixed(0)}% 
                    <span className={`ml-1 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      ({formatUnits(balance)} XLM)
                    </span>
                  </span>
                </div>
              </div>
              
              {/* Holdings Section */}
              <div className="flex items-center justify-between group hover:bg-slate-800/10 p-2 rounded-lg transition-all duration-200">
                <span className={`font-medium text-sm tracking-wide ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Holdings
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-3 rounded-full bg-slate-300/30 overflow-hidden">
                    <motion.div 
                      className="h-3 rounded-full bg-emerald-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${(holdings / portfolioValue) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className={`font-medium text-sm w-28 text-right ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {((holdings / portfolioValue) * 100).toFixed(0)}% 
                    <span className={`ml-1 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      (${formatUnits(holdings)})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trade History Modal */}
      {isRecentActivityModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsRecentActivityModalOpen(false)}
        >
          <div 
            className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } border`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Trade History</h3>
                <button 
                  onClick={() => setIsRecentActivityModalOpen(false)}
                  className={`p-2 rounded-full ${
                    theme === 'dark' 
                      ? 'hover:bg-slate-700 text-slate-400' 
                      : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Sorting/Filtering in Modal */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Filter buttons */}
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterType === 'all' 
                        ? theme === 'dark' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-700'
                        : theme === 'dark' 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => handleFilter('buy')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterType === 'buy' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : theme === 'dark' 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Buys
                  </button>
                  <button 
                    onClick={() => handleFilter('sell')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterType === 'sell' 
                        ? 'bg-red-500/20 text-red-400' 
                        : theme === 'dark' 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Sells
                  </button>
                </div>
                
                {/* Sorting dropdown */}
                <select
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split('-');
                    setSortConfig({ key, direction });
                  }}
                  className={`text-xs rounded-full px-3 py-1 ${
                    theme === 'dark' 
                      ? 'bg-slate-800 text-slate-300 border-slate-700' 
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  } border focus:outline-none`}
                >
                  <option value="timestamp-desc">Newest First</option>
                  <option value="timestamp-asc">Oldest First</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="amount-asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>
            
            {/* Scrollable Trade List */}
            <div className="overflow-y-auto flex-1 p-4">
              <div className="space-y-3">
                {processedTradeHistory.length > 0 ? (
                  processedTradeHistory.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 hover:bg-slate-800/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          trade.action === 'buy' 
                            ? 'bg-emerald-900/50 text-emerald-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {trade.action === 'buy' 
                            ? <ArrowUp size={18} /> 
                            : <ArrowDown size={18} />}
                        </div>
                        <div>
                          <p className="capitalize font-medium">{trade.action}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                            {new Date(trade.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          ${trade.amount?.toFixed(2) || '0.00'}
                        </p>
                        <p className={`text-sm ${trade.action === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.action === 'buy' ? '+' : '-'}{trade.quantity} {trade.asset}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    No trade history available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// const Sidebar = ({ isOpen, onClose, currentPath, theme, user }) => {
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     setImageError(false);
//   }, [user?.photoURL]);

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//     const navigationItems = [
//       { path: '/dashboard', label: 'Dashboard', icon: Home },
//       { path: '/dashboard/market-data', label: 'Market Data', icon: Activity },
//       { path: '/dashboard/trade-panel', label: 'Trade Panel', icon: TrendingUp },
//       { path: '/dashboard/Transaction-History', label: 'Transaction History', icon: History },
//       { path: '/dashboard/profit-tracker', label: 'Profit Tracker', icon: DollarSign }, 
//       { path: '/dashboard/network-status', label: 'Test Button', icon: Settings },
//       { path: '/dashboard/firestore-query', label: 'User Data Query', icon: Search },
//       { path: '/dashboard/admin', label: 'Admin Dashboard', icon: Settings, adminOnly: true }, // New admin route
//     ];
   
//      const [isPAMMOpen, setIsPAMMOpen] = useState(false);
  
//     const PAMMManagerItem = [
//       { path: '/dashboard/pamm-manager', label: 'PAMM Manager', icon: PieChart }, // New PAMM route
//       { path: '/dashboard/pamm-investor', label: 'PAMM Investor', icon: BarChart3 }, // New PAMM route
//     ];

//   const fundingItems = [
//     { path: '/dashboard/deposit', label: 'Deposit Funds', icon: PlusCircle },
//     { path: '/dashboard/withdraw', label: 'Withdraw Funds', icon: MinusCircle },
//   ];


// // In your Sidebar component

// // const AdminavigationItems = [
// //   // ... existing items
// //   ...(user?.is_admin ? [
// //     { path: '/dashboard/admin-dashboard', label: 'Admin Dashboard', icon: Settings }
// //   ] : [])
// // ];



//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && !isDesktop && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           />
//         )}
//       </AnimatePresence>
//       <motion.div
//         variants={sidebarVariants}
//         initial={isDesktop ? "open" : "closed"}
//         animate={isDesktop || isOpen ? "open" : "closed"}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className={`fixed left-0 top-0 h-full w-80 shadow-xl z-50 lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-700/50 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
//       >
//         <div className="flex flex-col h-full">
//           <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'}`}>
//             <div className="flex items-center space-x-3">
//               <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-gradient-to-r from-emerald-400 to-blue-400'}`}>
//                 <TrendingUp size={24} className="text-white" />
//               </div>
//               <div>
//                 <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>GimaFund</h2>
//                 <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Trading Dashboard</p>
//               </div>
//             </div>
//             <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg lg:hidden text-slate-400 hover:text-white" aria-label="Close sidebar">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4">
//             <nav className="space-y-2">
//               <div className="mb-6">
//                 <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>Navigation</h3>
//                 {navigationItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={onClose}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
//                       currentPath === item.path
//                         ? (theme === 'dark' ? 'bg-slate-800 text-white border-r-2 border-emerald-500' : 'bg-gray-200 text-black border-r-2 border-emerald-500')
//                         : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black')
//                     }`}
//                   >
//                     <item.icon size={20} />
//                     <span>{item.label}</span>
//                   </Link>
//                 ))}
//               </div>
//               {/* Professional Portfolio Management nav */}
//               <div className="mb-6">
//               <div 
//                 className={`
//                   group relative overflow-hidden
//                   flex items-center justify-between 
//                   px-5 py-4 rounded-2xl cursor-pointer 
//                   transition-all duration-300 ease-out
//                   ${theme === 'dark' 
//                     ? 'bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800/80 border border-slate-700/40 hover:border-slate-600/60' 
//                     : 'bg-white/80 backdrop-blur-sm hover:bg-gray-50/90 border border-gray-200/60 hover:border-gray-300/80'
//                   }
//                   hover:shadow-xl hover:shadow-slate-900/10 transform hover:-translate-y-0.5
//                 `}
//                 onClick={() => setIsPAMMOpen(!isPAMMOpen)}
//               >
//                 {/* Professional gradient overlay */}
//                 <div className={`
//                   absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
//                   ${theme === 'dark' 
//                     ? 'bg-gradient-to-r from-slate-800/30 via-gray-800/40 to-slate-700/30' 
//                     : 'bg-gradient-to-r from-gray-50/60 via-slate-50/40 to-gray-100/60'
//                   }
//                 `} />
                
//                 <div className="flex items-center relative z-10">
//                   <div className={`
//                     p-3 rounded-xl mr-4 transition-all duration-300 ease-out
//                     ${theme === 'dark' 
//                       ? 'bg-slate-800/60 group-hover:bg-gray-700/50 border border-slate-700/50' 
//                       : 'bg-slate-100/80 group-hover:bg-gray-200/80 border border-slate-200/60'
//                     }
//                     group-hover:scale-105 group-hover:rotate-3
//                   `}>
//                     <PieChart 
//                       size={18} 
//                       className={`
//                         transition-all duration-300 ease-out
//                         ${theme === 'dark' 
//                           ? 'text-slate-400 group-hover:text-gray-300' 
//                           : 'text-slate-600 group-hover:text-gray-700'
//                         }
//                         group-hover:scale-110
//                       `} 
//                     />
//                   </div>
//                   <h3 className={`
//                     text-sm font-medium tracking-wide transition-all duration-300
//                     ${theme === 'dark' 
//                       ? 'text-slate-300 group-hover:text-slate-100' 
//                       : 'text-slate-700 group-hover:text-slate-900'
//                     }
//                   `}>
//                     Portfolio Management
//                   </h3>
//                 </div>
                
//                 <div className={`
//                   p-2 rounded-lg transition-all duration-300 ease-out relative z-10
//                   ${theme === 'dark' 
//                     ? 'group-hover:bg-slate-700/40' 
//                     : 'group-hover:bg-slate-200/60'
//                   }
//                   group-hover:scale-110
//                 `}>
//                   {isPAMMOpen ? (
//                     <ChevronUp 
//                       size={16} 
//                       className={`
//                         transition-all duration-300 ease-out
//                         ${theme === 'dark' 
//                           ? 'text-slate-400 group-hover:text-slate-200' 
//                           : 'text-slate-500 group-hover:text-slate-700'
//                         }
//                         group-hover:rotate-180
//                       `} 
//                     />
//                   ) : (
//                     <ChevronDown 
//                       size={16} 
//                       className={`
//                         transition-all duration-300 ease-out
//                         ${theme === 'dark' 
//                           ? 'text-slate-400 group-hover:text-slate-200' 
//                           : 'text-slate-500 group-hover:text-slate-700'
//                         }
//                         group-hover:rotate-180
//                       `} 
//                     />
//                   )}
//                 </div>
//               </div>
              
//               {/* Professional dropdown with staggered animations */}
//               <div className={`
//                 overflow-hidden transition-all duration-500 ease-out
//                 ${isPAMMOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
//               `}>
//                 <div className="ml-6 mt-4 space-y-2">
//                   {PAMMManagerItem.map((item, index) => (
//                     <Link
//                       key={item.path}
//                       to={item.path}
//                       onClick={onClose}
//                       className={`
//                         group relative overflow-hidden
//                         flex items-center space-x-4 px-5 py-3.5 rounded-xl 
//                         text-sm font-medium transition-all duration-300 ease-out
//                         transform hover:translate-x-2
//                         ${currentPath === item.path
//                           ? (theme === 'dark' 
//                               ? 'bg-gradient-to-r from-slate-700/90 to-gray-800/90 text-white shadow-lg border border-slate-600/50 backdrop-blur-sm' 
//                               : 'bg-gradient-to-r from-slate-600/90 to-gray-700/90 text-white shadow-lg border border-slate-500/60 backdrop-blur-sm')
//                           : (theme === 'dark' 
//                               ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/40' 
//                               : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent hover:border-slate-300/50')
//                         }
//                         hover:shadow-lg hover:shadow-slate-900/10
//                       `}
//                       style={{
//                         animationDelay: `${index * 50}ms`,
//                         animation: isPAMMOpen ? 'slideInFade 400ms ease-out forwards' : 'none'
//                       }}
//                     >
//                       {/* Professional hover effect */}
//                       <div className={`
//                         absolute inset-0 opacity-0 group-hover:opacity-100 
//                         bg-gradient-to-r from-slate-500/10 to-gray-500/10
//                         transition-opacity duration-300 ease-out
//                       `} />
                      
//                       {/* Active state indicator */}
//                       {currentPath === item.path && (
//                         <div className={`
//                           absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full
//                           bg-gradient-to-b from-white/80 to-white/60
//                           shadow-sm
//                         `} />
//                       )}
                      
//                       {/* Icon container */}
//                       <div className={`
//                         p-1.5 rounded-lg transition-all duration-300 ease-out
//                         ${currentPath === item.path
//                           ? 'bg-white/20'
//                           : (theme === 'dark' 
//                               ? 'bg-slate-700/40 group-hover:bg-slate-600/60' 
//                               : 'bg-slate-200/60 group-hover:bg-slate-300/80')
//                         }
//                         group-hover:scale-105
//                       `}>
//                         <item.icon 
//                           size={16} 
//                           className="transition-all duration-300 ease-out relative z-10 group-hover:scale-110" 
//                         />
//                       </div>
                      
//                       <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
//                         {item.label}
//                       </span>
                      
//                       {/* Subtle arrow indicator */}
//                       <div className={`
//                         ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out
//                         transform translate-x-2 group-hover:translate-x-0
//                       `}>
//                         <ChevronRight size={14} className="text-current opacity-60" />
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>


//               <div className="mb-6">
//                 <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>Account</h3>
//                 {fundingItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={onClose}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-colors ${
//                       currentPath === item.path
//                         ? (theme === 'dark' ? 'bg-slate-800 text-white border-r-2 border-emerald-500' : 'bg-gray-200 text-black border-r-2 border-emerald-500')
//                         : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black')
//                     }`}
//                   >
//                     <item.icon size={20} />
//                     <span>{item.label}</span>
//                   </Link>
//                 ))}
//               </div>
             
//             </nav>
//           </div>
//           <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'}`}>
//             <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
//               {user?.photoURL && !imageError ?  (
//                 <img 
//                   src={user.photoURL} 
//                   alt="Profile" 
//                   // className="w-8 h-8 rounded-full object-cover" 
//                   className="w-10 h-10 rounded-full object-cover"
//                   onError={() => setImageError(true)} 
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
//                   {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm font-medium text-white">{user?.displayName || user?.email?.split(' ')[0] || 'User'}</p>
//                 <p className="text-xs text-gray-400">{user?.email || 'Premium'}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </>
//   );
// };


const Sidebar = React.memo(({ isOpen, onClose, currentPath, theme, user }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [imageError, setImageError] = useState(false);
  const [isPAMMOpen, setIsPAMMOpen] = useState(false);
  const [prevUser, setPrevUser] = useState(null);
  
  useEffect(() => {
    if (user && JSON.stringify(user) !== JSON.stringify(prevUser)) {
      console.log('Sidebar user:', user);
      setPrevUser(user);
    }
  }, [user, prevUser]);


  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsDesktop(window.innerWidth >= 1024), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // console.log('Sidebar user:', user);

  const navigationItems = useMemo(() => [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/dashboard/market/data', label: 'Initialize GIMA Algorithm', icon: Activity, badge: 'Live' },
    { path: '/dashboard/trade/panel', label: 'Algorithmic Trading', icon: TrendingUp },
    { path: '/dashboard/Transaction/History', label: 'Transaction History', icon: History},
    { path: '/dashboard/profit/tracker', label: 'Performance Analytics', icon: DollarSign }, 
    { path: '/dashboard/network/status', label: 'System Health', icon: Settings },
    { path: '/dashboard/firestore/query', label: 'Data Explorer', icon: Search },
    { path: '/dashboard/admin', label: 'Admin Console', icon: Settings, adminOnly: true },
  ], []);

  const PAMMManagerItem = useMemo(() => [
    { path: '/dashboard/pamm/manager', label: 'Fund Manager', icon: PieChart },
    { path: '/dashboard/pamm/investor', label: 'Investor Portal', icon: BarChart3 },
  ], []);

  const fundingItems = useMemo(() => [
    { path: '/dashboard/deposit', label: 'Add Funds', icon: PlusCircle },
    { path: '/dashboard/withdraw', label: 'Withdraw', icon: MinusCircle },
  ], []);

  return (
    <>
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      <motion.div
        variants={sidebarVariants}
        initial={isDesktop ? "open" : "closed"}
        animate={isDesktop || isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full w-80 shadow-xl z-50 lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-700/50 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-gradient-to-r from-emerald-400 to-blue-400'}`}>
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>  
                

                <Link to="/" className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold hover:underline`}>
                  GimaCapital
                </Link>


                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Trading Dashboard</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg lg:hidden text-slate-400 hover:text-white" aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              <div className="mb-6">
                <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>Navigation</h3>
                {navigationItems.map((item) => (
                  (!item.adminOnly || user.is_admin) && (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        currentPath === item.path
                          ? (theme === 'dark' ? 'bg-slate-800 text-white border-r-2 border-emerald-500' : 'bg-gray-200 text-black border-r-2 border-emerald-500')
                          : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black')
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  )
                ))}
              </div>
              <div className="mb-6">
                <div 
                  className={`
                    group relative overflow-hidden
                    flex items-center justify-between 
                    px-5 py-4 rounded-2xl cursor-pointer 
                    transition-all duration-300 ease-out
                    ${theme === 'dark' 
                      ? 'bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800/80 border border-slate-700/40 hover:border-slate-600/60' 
                      : 'bg-white/80 backdrop-blur-sm hover:bg-gray-50/90 border border-gray-200/60 hover:border-gray-300/80'
                    }
                    hover:shadow-xl hover:shadow-slate-900/10 transform hover:-translate-y-0.5
                  `}
                  onClick={() => setIsPAMMOpen(!isPAMMOpen)}
                >
                  <div className="flex items-center relative z-10">
                    <div className={`
                      p-3 rounded-xl mr-4 transition-all duration-300 ease-out
                      ${theme === 'dark' 
                        ? 'bg-slate-800/60 group-hover:bg-gray-700/50 border border-slate-700/50' 
                        : 'bg-slate-100/80 group-hover:bg-gray-200/80 border border-slate-200/60'
                      }
                      group-hover:scale-105 group-hover:rotate-3
                    `}>
                      <PieChart 
                        size={18} 
                        className={`
                          transition-all duration-300 ease-out
                          ${theme === 'dark' 
                            ? 'text-slate-400 group-hover:text-gray-300' 
                            : 'text-slate-600 group-hover:text-gray-700'
                          }
                          group-hover:scale-110
                        `} 
                      />
                    </div>
                    <h3 className={`
                      text-sm font-medium tracking-wide transition-all duration-300
                      ${theme === 'dark' 
                        ? 'text-slate-300 group-hover:text-slate-100' 
                        : 'text-slate-700 group-hover:text-slate-900'
                      }
                    `}>
                      Portfolio Management
                    </h3>
                  </div>
                  <div className={`
                    p-2 rounded-lg transition-all duration-300 ease-out relative z-10
                    ${theme === 'dark' 
                      ? 'group-hover:bg-slate-700/40' 
                      : 'group-hover:bg-slate-200/60'
                    }
                    group-hover:scale-110
                  `}>
                    {isPAMMOpen ? (
                      <ChevronUp 
                        size={16} 
                        className={`
                          transition-all duration-300 ease-out
                          ${theme === 'dark' 
                            ? 'text-slate-400 group-hover:text-slate-200' 
                            : 'text-slate-500 group-hover:text-slate-700'
                          }
                          group-hover:rotate-180
                        `} 
                      />
                    ) : (
                      <ChevronDown 
                        size={16} 
                        className={`
                          transition-all duration-300 ease-out
                          ${theme === 'dark' 
                            ? 'text-slate-400 group-hover:text-slate-200' 
                            : 'text-slate-500 group-hover:text-slate-700'
                          }
                          group-hover:rotate-180
                        `} 
                      />
                    )}
                  </div>
                </div>
                <div className={`
                  overflow-hidden transition-all duration-500 ease-out
                  ${isPAMMOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="ml-6 mt-4 space-y-2">
                    {PAMMManagerItem.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`
                          group relative overflow-hidden
                          flex items-center space-x-4 px-5 py-3.5 rounded-xl 
                          text-sm font-medium transition-all duration-300 ease-out
                          transform hover:translate-x-2
                          ${currentPath === item.path
                            ? (theme === 'dark' 
                                ? 'bg-gradient-to-r from-slate-700/90 to-gray-800/90 text-white shadow-lg border border-slate-600/50 backdrop-blur-sm' 
                                : 'bg-gradient-to-r from-slate-600/90 to-gray-700/90 text-white shadow-lg border border-slate-500/60 backdrop-blur-sm')
                            : (theme === 'dark' 
                                ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/40' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent hover:border-slate-300/50')
                          }
                          hover:shadow-lg hover:shadow-slate-900/10
                        `}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: isPAMMOpen ? 'slideInFade 400ms ease-out forwards' : 'none'
                        }}
                      >
                        <div className={`
                          absolute inset-0 opacity-0 group-hover:opacity-100 
                          bg-gradient-to-r from-slate-500/10 to-gray-500/10
                          transition-opacity duration-300 ease-out
                        `} />
                        {currentPath === item.path && (
                          <div className={`
                            absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full
                            bg-gradient-to-b from-white/80 to-white/60
                            shadow-sm
                          `} />
                        )}
                        <div className={`
                          p-1.5 rounded-lg transition-all duration-300 ease-out
                          ${currentPath === item.path
                            ? 'bg-white/20'
                            : (theme === 'dark' 
                                ? 'bg-slate-700/40 group-hover:bg-slate-600/60' 
                                : 'bg-slate-200/60 group-hover:bg-slate-300/80')
                          }
                          group-hover:scale-105
                        `}>
                          <item.icon 
                            size={16} 
                            className="transition-all duration-300 ease-out relative z-10 group-hover:scale-110" 
                          />
                        </div>
                        <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
                          {item.label}
                        </span>
                        <div className={`
                          ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out
                          transform translate-x-2 group-hover:translate-x-0
                        `}>
                          <ChevronRight size={14} className="text-current opacity-60" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>Account</h3>
                {fundingItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-colors ${
                      currentPath === item.path
                        ? (theme === 'dark' ? 'bg-slate-800 text-white border-r-2 border-emerald-500' : 'bg-gray-200 text-black border-r-2 border-emerald-500')
                        : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black')
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
              {user?.photoURL && !imageError ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={() => setImageError(true)} 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{user?.displayName || user?.email?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'Premium'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

const TopNavigation = ({ onMenuToggle, balance, holdings, isBalanceUpdated, toggleTheme, theme, user }) => {
    // Add these two new ones:
    const [isPrimeModalOpen, setIsPrimeModalOpen] = useState(false);
    const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    // Handle clicks outside the modal to close it
    const handleModalClose = (e) => {
      if (e.target === e.currentTarget) {
        setShowSettingsModal(false);
      }
    };
  
    // Handle Escape key to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSettingsModal(false);
      }
    };
    

  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  const UserSettingsDropdown = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const handleLogout = async () => {
      navigate('/logout');
      setIsDropdownOpen(false);
    };
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
    
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg transition-colors text-slate-400 dark:text-slate-200 hover:text-white"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
    
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowSettingsModal(true);
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2" size={16} />
                  Logout
                </div>
              </button>
            </div>
          )}
    
          {showSettingsModal && (
            <>
              <div
                className="fixed inset-0 bg-black/60 z-40"
                onClick={handleModalClose}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              />
              <div
                className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm rounded-xl shadow-xl transition-all duration-300 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                role="dialog"
                aria-modal="true"
                aria-label="Settings Work in Progress"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  We are working on the settings feature. Stay tuned for updates!
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm border-b border-slate-700/50 px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuToggle} className="p-2 hover:bg-gray-800 rounded-lg lg:hidden text-gray-400 hover:text-white" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search markets, trades..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div
            className={` ${isBalanceUpdated ? 'border-blue-500/50 bg-blue-900/20' : (theme === 'dark' ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-300 bg-gray-100')}`}
            animate={
              isBalanceUpdated
                ? {
                    borderColor: ['#3498db', theme === 'dark' ? '#334155' : '#D3D3D3'],
                    backgroundColor: ['#1e3a8a', theme === 'dark' ? '#1E293B' : '#F9FAFB'],
                  }
                : {}
            }
            transition={{ duration: 1 }}
          >
          <>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-between">
            {/* Prime Reserve Button */}
            <button 
              className={`${theme === 'dark' ? 'bg-emerald-900/20 border-emerald-500/30 hover:bg-emerald-900/40' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'} 
                          border rounded-lg px-3 py-2 w-[48%] sm:w-auto flex-1 sm:flex-none 
                          relative overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer`}
              onClick={() => setIsPrimeModalOpen(true)}
            >
              <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-400/10 rounded-full -translate-y-2 translate-x-2"></div>
              
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className={`${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} text-xs font-medium leading-tight`}>
                  Prime<br/>Reserve
                </p>
                <div className={`${theme === 'dark' ? 'text-emerald-400/40' : 'text-emerald-600/40'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                  </svg>
                </div>
              </div>
            </button>

            {/* Smart Fund Button */}
            <button 
              className={`${theme === 'dark' ? 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/40' : 'bg-purple-50 border-purple-200 hover:bg-purple-100'} 
                          border rounded-lg px-3 py-2 w-[48%] sm:w-auto flex-1 sm:flex-none 
                          relative overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer`}
              onClick={() => setIsSmartModalOpen(true)}
            >
              <div className="absolute top-0 right-0 w-5 h-5 bg-purple-400/20 rounded rotate-12 -translate-y-1 translate-x-1"></div>
              
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-sm"></div>
                <p className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'} text-xs font-medium`}>
                  Smart<br/>Fund
                </p>
                <div className={`${theme === 'dark' ? 'text-purple-400/40' : 'text-purple-600/40'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Prime Reserve Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className={`${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'} text-xl font-bold`}>
                  Prime Reserve
                </span>
              </div>
            }
            open={isPrimeModalOpen}
            onCancel={() => setIsPrimeModalOpen(false)}
            footer={null}
            width={400}
            centered
            className={theme === 'dark' ? 'dark-modal' : ''}
            styles={{
              content: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  border: 'none',
                })
              },
              header: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  borderBottom: '1px solid rgb(55, 65, 81)',
                  color: 'white',
                })
              },
              body: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  color: 'white',
                })
              },
              mask: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                })
              }
            }}
            closeIcon={
              theme === 'dark' ? (
                <div className="group relative w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-300 hover:scale-110 cursor-pointer border border-gray-600/30 hover:border-gray-500/50">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgb(209, 213, 219)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="relative z-10 group-hover:stroke-white transition-all duration-200 group-hover:rotate-90"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" className="origin-center transition-transform duration-200 group-hover:scale-110"></line>
                    <line x1="6" y1="6" x2="18" y2="18" className="origin-center transition-transform duration-200 group-hover:scale-110"></line>
                  </svg>
                  <div className="absolute inset-0 rounded-full border border-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
              ) : undefined
            }

          >
            <div className={`${theme === 'dark' ? 'bg-emerald-900/30 border border-emerald-800/30' : 'bg-emerald-50'} rounded-lg p-4 mb-4`}>
              <p className={`${theme === 'dark' ? 'text-emerald-400/60' : 'text-emerald-600/60'} text-sm mb-2`}>
                Current Balance
              </p>
              <motion.p
                className="text-emerald-400 text-3xl font-bold mb-2"
                initial={{ scale: isBalanceUpdated ? 1.1 : 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {balance.toFixed(2)} XLM
              </motion.p>
              <p className={`${theme === 'dark' ? 'text-emerald-400/60' : 'text-emerald-600/60'} text-sm`}>
                Secure Holdings • Main Account
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Account Type:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Primary Wallet</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </Modal>

          {/* Smart Fund Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-sm animate-bounce"></div>
                <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'} text-xl font-bold`}>
                  Smart Fund
                </span>
              </div>
            }
            open={isSmartModalOpen}
            onCancel={() => setIsSmartModalOpen(false)}
            footer={null}
            width={400}
            centered
            className={theme === 'dark' ? 'dark-modal' : ''}
            styles={{
              content: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  border: 'none',
                })
              },
              header: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  borderBottom: '1px solid rgb(55, 65, 81)',
                  color: 'white',
                })
              },
              body: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgb(17, 24, 39)',
                  color: 'white',
                })
              },
              mask: {
                ...(theme === 'dark' && {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                })
              }
            }}
            closeIcon={
              theme === 'dark' ? (
                <div className="group relative w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-300 hover:scale-110 cursor-pointer border border-gray-600/30 hover:border-gray-500/50">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgb(209, 213, 219)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="relative z-10 group-hover:stroke-white transition-all duration-200 group-hover:rotate-90"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" className="origin-center transition-transform duration-200 group-hover:scale-110"></line>
                    <line x1="6" y1="6" x2="18" y2="18" className="origin-center transition-transform duration-200 group-hover:scale-110"></line>
                  </svg>
                  <div className="absolute inset-0 rounded-full border border-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
              ) : undefined
            }

          >
            <div className={`${theme === 'dark' ? 'bg-purple-900/30 border border-purple-800/30' : 'bg-purple-50'} rounded-lg p-4 mb-4`}>
              <p className={`${theme === 'dark' ? 'text-purple-400/60' : 'text-purple-600/60'} text-sm mb-2`}>
                Current Value
              </p>
              <motion.p
                className="text-purple-500 text-3xl font-bold mb-2"
                initial={{ scale: isBalanceUpdated ? 1.1 : 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ${holdings.toFixed(2)}
              </motion.p>
              <p className={`${theme === 'dark' ? 'text-purple-400/60' : 'text-purple-600/60'} text-sm`}>
                AI Trading • Automated Portfolio
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Trading Bot:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Advanced AI</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                <span className="text-purple-500">Trading Active</span>
              </div>
            </div>
          </Modal>
            </>

          </motion.div>
          {user?.photoURL && !imageError ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <button className="relative p-2 hover:bg-blue-200 rounded-circle text-blue-500 hover:text-blue-600" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <UserSettingsDropdown />
        </div>
      </div>
    </motion.div>
  );
};
export default Dashboard;