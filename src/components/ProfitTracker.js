





import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, Target, Moon, Sun, Edit3, Check, Loader2, X, PieChart } from 'lucide-react';
import { useAuth } from './Auth';
import { toast } from 'react-toastify';

const ProfitTracker = ({ 
  previousProfit = 0,
  target: initialTarget = 0,
  onTargetChange = () => {},
  revenue = 25000,
  expenses = 10000,
  isDarkMode: externalDarkMode = true,
  userId,
  user,
  holdings = 0,
  onWithdraw
}) => {
  // State management
  useAuth(); // Keep useAuth for context
  const [isDarkMode, setIsDarkMode] = useState(externalDarkMode);
  const [profit, setProfit] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [currentTarget, setCurrentTarget] = useState(initialTarget);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(initialTarget.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Animation function
  const animateValue = useCallback((start, end, duration, setter) => {
    const startTime = Date.now();
    const difference = end - start;

    if (difference === 0) {
      setter(end);
      return;
    }

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = start + (difference * easeOutCubic);

      setter(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  // Fetch latest profit from backend with 3-second spinner delay
  const fetchProfit = useCallback(async () => {
    if (!userId || !user || !user.token) {
      toast.error('User not authenticated or invalid user data');
      setProfit(0);
      setShowSpinner(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowSpinner(true);

    try {
      const startTime = Date.now();
      const response = await fetch(`http://localhost:5000/user/profit?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      const result = await response.json();

      // Ensure 3-second spinner delay
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (result.status === 'success') {
        const fetchedProfit = result.profit || 0;
        setProfit(fetchedProfit);
        setIsVisible(true);
        animateValue(0, fetchedProfit, 2000, setAnimatedProfit);
      } else {
        toast.error(result.message || 'Failed to fetch profit');
        setProfit(0);
      }
    } catch (error) {
      console.error('[ERROR] Failed to fetch profit:', error);
      toast.error(`Failed to fetch profit: ${error.message}`);
      setProfit(0);
    } finally {
      setShowSpinner(false);
      setIsLoading(false);
    }
  }, [userId, user, animateValue]);

  useEffect(() => {
    fetchProfit();
  }, [fetchProfit]);

  // Derived values
  const profitChange = profit - previousProfit;
  const profitChangePercent = previousProfit > 0 ? ((profitChange / previousProfit) * 100).toFixed(2) : '0.00';
  const targetProgress = currentTarget > 0 ? (profit / currentTarget) * 100 : 0;
  const isPositiveChange = profitChange >= 0;
  const growthRate = previousProfit > 0 ? ((profitChange / previousProfit) * 100).toFixed(1) : '0.0';
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';

  // Sync with parent target changes
  useEffect(() => {
    if (!isEditingTarget) {
      setCurrentTarget(initialTarget);
      setTempTarget(initialTarget.toString());
    }
  }, [initialTarget, isEditingTarget]);

  // Target editing handlers
  const handleTargetEdit = useCallback(() => {
    setTempTarget(currentTarget.toString());
    setIsEditingTarget(true);
    setSaveSuccess(false);
  }, [currentTarget]);

  const handleTargetSave = useCallback(async () => {
    setIsSaving(true);
    const newTarget = parseFloat(tempTarget);
    if (!isNaN(newTarget)) {
      const validatedTarget = Math.max(newTarget, 0);
      if (!user || !user.token) {
        toast.error('User not authenticated');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/target/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ target: validatedTarget })
        });
        const result = await response.json();
        if (result.status === 'success') {
          setCurrentTarget(validatedTarget);
          onTargetChange(validatedTarget);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
          setIsEditingTarget(false);
          setIsSaving(false);
        } else {
          toast.error(result.message || 'Failed to save target');
        }
      } catch (error) {
        toast.error(`Failed to save target: ${error.message}`);
      }
    } else {
      toast.error('Please enter a valid number');
    }
  }, [tempTarget, onTargetChange, userId, user]);

  const handleTargetCancel = useCallback(() => {
    setTempTarget(currentTarget.toString());
    setIsEditingTarget(false);
    setSaveSuccess(false);
  }, [currentTarget]);

  const handleTargetKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleTargetSave();
    if (e.key === 'Escape') handleTargetCancel();
  }, [handleTargetSave, handleTargetCancel]);

  const handleTargetInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setTempTarget(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) setCurrentTarget(Math.max(numValue, 0));
      else if (value === '') setCurrentTarget(0);
    }
  }, []);

  // Withdrawal handler
  const handleWithdraw = useCallback(async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > profit) {
      toast.error('Withdrawal amount exceeds available profit');
      return;
    }

    if (!user || !user.token) {
      toast.error('User not authenticated');
      return;
    }

    setIsWithdrawing(true);
    try {
      const response = await fetch('http://localhost:5000/withdraw/profit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          userId,
          amount
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        // Refresh profit after withdrawal
        await fetchProfit();
        if (onWithdraw) {
          onWithdraw(amount);
        }
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        toast.success('Withdrawal successful!');
      } else {
        toast.error(result.message || 'Withdrawal failed');
      }
    } catch (error) {
      toast.error(`Withdrawal error: ${error.message}`);
    } finally {
      setIsWithdrawing(false);
    }
  }, [profit, user, userId, onWithdraw, fetchProfit, withdrawAmount]);

  // Theme configuration
  const themeClasses = {
    background: isDarkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    cardBg: isDarkMode ? 'bg-gradient-to-br from-black via-gray-800 to-emerald-900' : 'bg-gradient-to-br from-white via-gray-50 to-emerald-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    cardBorder: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200',
    statCard: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50/80 border-gray-200/60',
    button: isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600',
    secondaryButton: isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-gray-100 hover:bg-gray-200 border-gray-300',
    input: isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    skeleton: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
  };

  // Render loading state
  if (isLoading) {
    if (showSpinner) {
      return (
        <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center transition-all duration-300`}>
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className={`${themeClasses.text} text-lg font-semibold`}>Loading profit data...</span>
          </div>
        </div>
      );
    }

    // Skeleton UI
    return (
      <div className={`min-h-screen ${themeClasses.background} transition-all duration-500 pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}>
        <button
          className={`fixed top-6 right-6 z-50 p-3 rounded-full ${themeClasses.secondaryButton} shadow-lg transition-all duration-300 hover:scale-110 border backdrop-blur-sm`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Profit Card Skeleton */}
          <div className="lg:col-span-2">
            <div className={`relative overflow-hidden rounded-3xl ${themeClasses.cardBg} shadow-2xl border ${themeClasses.cardBorder} p-6 sm:p-8`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-full ${themeClasses.skeleton} animate-pulse`}></div>
                  <div>
                    <div className={`h-6 w-32 ${themeClasses.skeleton} rounded animate-pulse mb-2`}></div>
                    <div className={`h-4 w-24 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className={`h-4 w-20 ${themeClasses.skeleton} rounded animate-pulse mb-1`}></div>
                  <div className={`h-4 w-16 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                </div>
              </div>
              <div className="text-center mb-6 sm:mb-8">
                <div className={`h-4 w-32 mx-auto ${themeClasses.skeleton} rounded animate-pulse mb-2`}></div>
                <div className={`h-10 w-48 mx-auto ${themeClasses.skeleton} rounded animate-pulse mb-4`}></div>
                <div className={`h-6 w-28 mx-auto ${themeClasses.skeleton} rounded animate-pulse`}></div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className={`h-4 w-24 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                  <div className={`h-4 w-12 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                </div>
                <div className={`w-full h-3 ${themeClasses.skeleton} rounded-full animate-pulse`}></div>
                <div className={`h-3 w-20 mt-1 ${themeClasses.skeleton} rounded animate-pulse`}></div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className={`flex-1 h-12 ${themeClasses.skeleton} rounded-xl animate-pulse`}></div>
                <div className={`flex-1 h-12 ${themeClasses.skeleton} rounded-xl animate-pulse`}></div>
                <div className={`flex-1 h-12 ${themeClasses.skeleton} rounded-xl animate-pulse`}></div>
              </div>
            </div>
          </div>
          {/* Stats Sidebar Skeleton */}
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-5 h-5 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                  <div className={`h-4 w-20 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                </div>
                <div className={`h-6 w-24 ${themeClasses.skeleton} rounded animate-pulse`}></div>
              </div>
            ))}
          </div>
        </div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-5 h-5 ${themeClasses.skeleton} rounded animate-pulse`}></div>
                <div className={`h-4 w-12 ${themeClasses.skeleton} rounded animate-pulse`}></div>
              </div>
              <div className={`h-4 w-16 ${themeClasses.skeleton} rounded animate-pulse mb-1`}></div>
              <div className={`h-5 w-20 ${themeClasses.skeleton} rounded animate-pulse`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} transition-all duration-500`}>
      {/* Success notification */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          ✓ Target saved successfully!
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowWithdrawModal(false)}
          />
          <div 
            className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm rounded-xl shadow-xl transition-all duration-300 p-6 ${
              isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Withdraw Profits</h3>
            <div className="mb-4">
              <label className={`block mb-2 ${themeClasses.textMuted}`}>
                Amount to Withdraw (max: ${profit.toLocaleString('en-US')})
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className={`w-full py-3 px-4 rounded-md border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-lg font-semibold`}
                placeholder="Enter amount"
                min="0"
                max={profit}
                step="0.01"
                aria-label="Withdrawal amount"
              />
            </div>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className={`flex-1 ${themeClasses.secondaryButton} ${themeClasses.text} py-3 px-6 rounded-md transition-colors border flex items-center justify-center space-x-2 transform hover:scale-105 font-semibold`}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 font-semibold shadow-lg disabled:opacity-70"
              >
                {isWithdrawing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    <span>Withdraw</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${themeClasses.secondaryButton} shadow-lg transition-all duration-300 hover:scale-110 border backdrop-blur-sm`}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      <div className="pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Main Profit Card */}
            <div className="lg:col-span-2">
              <div className={`relative overflow-hidden rounded-3xl ${themeClasses.cardBg} shadow-2xl border ${themeClasses.cardBorder} transition-all duration-500`}>
                <div className="relative z-10 p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                      <div className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Profit Tracker</h2>
                        <p className={`${themeClasses.textMuted} text-sm`}>Real-time Performance</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className={`text-sm ${themeClasses.textMuted}`}>Last Updated</div>
                      <div className={`${themeClasses.text} font-medium`}>Just now</div>
                    </div>
                  </div>

                  {/* Profit Display */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`text-sm ${themeClasses.textMuted} mb-2 uppercase tracking-wider`}>Total Smart Fund Profit</div>
                    <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-4`}>
                      ${animatedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                      isPositiveChange ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {isPositiveChange ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-semibold text-sm sm:text-base">
                        {isPositiveChange ? '+' : '-'}${Math.abs(profitChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs sm:text-sm opacity-80">
                        ({isPositiveChange ? '+' : ''}{profitChangePercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Target Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${themeClasses.textMuted}`}>Target Progress</span>
                      <span className={`text-sm font-medium transition-all duration-300 ${
                        targetProgress >= 100 ? 'text-emerald-400' : 
                        targetProgress >= 75 ? 'text-yellow-400' : 
                        'text-blue-400'
                      }`}>
                        {targetProgress.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out shadow-lg ${
                          targetProgress >= 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          targetProgress >= 75 ? 'bg-gradient-to-r from-yellow-500 to-emerald-500' :
                          'bg-gradient-to-r from-blue-500 to-emerald-500'
                        }`}
                        style={{ width: `${Math.min(targetProgress, 100)}%` }}
                      />
                    </div>
                    <div className={`text-xs ${themeClasses.textMuted} mt-1 transition-all duration-300`}>
                      {currentTarget > 0 ? (
                        currentTarget > profit ? 
                          `$${(currentTarget - profit).toLocaleString('en-US')} remaining` :
                          targetProgress >= 100 ? '🎉 Target achieved!' : 'Target in progress'
                      ) : (
                        'No target set'
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button className={`flex-1 ${themeClasses.button} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}>
                      View Details
                    </button>
                    <button 
                      onClick={handleTargetEdit}
                      className={`flex-1 ${themeClasses.secondaryButton} ${themeClasses.text} font-semibold py-3 px-6 rounded-xl transition-all duration-200 border backdrop-blur-sm flex items-center justify-center space-x-2 hover:scale-105`}
                    >
                      <Target className="w-4 h-4" />
                      <span>Set Target</span>
                    </button>
                    {profit > 0 && (
                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className={`flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2`}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Withdraw Profits</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Previous Period */}
              <div className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className={`w-5 h-5 ${themeClasses.textMuted}`} />
                  <span className={`${themeClasses.textMuted} text-sm`}>Previous Period</span>
                </div>
                <div className={`text-2xl font-semibold ${themeClasses.text}`}>
                  ${previousProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Holdings */}
              <div className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
                <div className="flex items-center space-x-3 mb-3">
                  <PieChart className={`w-5 h-5 ${themeClasses.textMuted}`} />
                  <span className={`${themeClasses.textMuted} text-sm`}>Holdings</span>
                </div>
                <div className={`text-2xl font-semibold ${themeClasses.text}`}>
                  ${holdings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Target Card */}
              <div className={`relative ${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Target className={`w-5 h-5 ${themeClasses.textMuted}`} />
                    <span className={`${themeClasses.textMuted} text-sm`}>Target</span>
                  </div>
                  {!isEditingTarget && (
                    <button
                      onClick={handleTargetEdit}
                      className={`p-1 rounded-md ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                      title="Edit target"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {!isEditingTarget && (
                  <div className={`text-2xl font-semibold ${themeClasses.text} transition-all duration-300`}>
                    {currentTarget > 0 ? `$${currentTarget.toLocaleString('en-US')}` : 'No target set'}
                  </div>
                )}
              </div>

              {/* Progress Card */}
              <div className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500`}>
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart3 className={`w-5 h-5 ${themeClasses.textMuted}`} />
                  <span className={`${themeClasses.textMuted} text-sm`}>Progress</span>
                </div>
                <div className={`text-2xl font-semibold transition-all duration-300 ${
                  targetProgress >= 100 ? 'text-emerald-400' : 
                  targetProgress >= 75 ? 'text-yellow-400' : 
                  themeClasses.text
                }`}>
                  {targetProgress.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Revenue', 
                value: `$${revenue.toLocaleString('en-US')}`, 
                change: previousProfit > 0 ? `+${((revenue - previousProfit) / previousProfit * 100).toFixed(1)}%` : '0.0%', 
                icon: DollarSign 
              },
              { 
                title: 'Expenses', 
                value: `$${expenses.toLocaleString('en-US')}`, 
                change: previousProfit > 0 && (revenue - profit) > 0 ? `${((expenses - (revenue - profit)) / (revenue - profit) * 100).toFixed(1)}%` : '0.0%', 
                icon: TrendingDown 
              },
              { 
                title: 'Growth', 
                value: `${Math.abs(parseFloat(growthRate))}%`, 
                change: `${growthRate >= 0 ? '+' : ''}${growthRate}%`, 
                icon: TrendingUp 
              },
              { 
                title: 'Margin', 
                value: `${profitMargin}%`, 
                change: `+${(parseFloat(profitMargin) * 0.1).toFixed(1)}%`, 
                icon: BarChart3 
              }
            ].map((item, index) => (
              <div key={index} className={`${themeClasses.statCard} rounded-xl p-6 border backdrop-blur-sm transition-all duration-500 hover:scale-105`}>
                <div className="flex items-center justify-between mb-3">
                  <item.icon className={`w-5 h-5 ${themeClasses.textMuted}`} />
                  <span className={`text-xs ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'} font-medium`}>
                    {item.change}
                  </span>
                </div>
                <div className={`${themeClasses.textMuted} text-sm mb-1`}>{item.title}</div>
                <div className={`text-xl font-semibold ${themeClasses.text}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Overlay & Modal Content */}
      {isEditingTarget && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40"
            onClick={handleTargetCancel}
          />
          <div 
            className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm rounded-xl shadow-xl transition-all duration-300 p-6 ${
              isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Set Your Target</h3>
            <div className="relative mb-6">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} text-sm`}>$</span>
              <input
                type="number"
                value={tempTarget}
                onChange={handleTargetInputChange}
                onKeyDown={handleTargetKeyPress}
                className={`w-full pl-8 pr-3 py-3 rounded-md border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 text-lg font-semibold`}
                placeholder="0"
                autoFocus
                min="0"
                step="0.01"
                aria-label="Target amount input"
              />
            </div>
            <div className="flex space-x-4 justify-end">
            <button 
        onClick={handleTargetCancel}
        className={`flex-1 ${themeClasses.secondaryButton} ${themeClasses.text} py-3 px-6 rounded-md transition-colors border flex items-center justify-center space-x-2 transform hover:scale-105 font-semibold`}
      >
        <X className="w-5 h-5" />
        <span>Cancel</span>
      </button>

      <button
        onClick={handleTargetSave}
        disabled={isSaving}
        className={`flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 font-semibold shadow-lg ${
          isSaving ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            <span>Save</span>
          </>
        )}
      </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfitTracker;

