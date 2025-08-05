import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';

import {
  AttachMoney,
 Warning as WarningIcon,
  Timeline, Equalizer,   Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  Article as ArticleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';


const DashboardInfoPanel = ({ theme, onClose }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);

  const handleOpenDialog = (dialogType) => {
    setOpenDialog(dialogType);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const dialogContent = {
    performance: {
      title: "Performance Analytics",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Monitor your investment performance with advanced analytics:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Sharpe Ratio Analysis: Risk-adjusted return metrics",
              "Alpha/Beta Calculations: Market performance comparison",
              "Drawdown Metrics: Track potential losses",
              "Rolling Returns: Historical performance analysis"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            Access detailed performance charts in the analytics dashboard.
          </Alert>
        </>
      )
    },
    risk: {
      title: "Risk Monitoring",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Comprehensive risk management system includes:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Capital Health Ratios: Monitor financial stability",
              "Concentration Analysis: Track asset concentration",
              "VaR Calculations: Assess potential losses",
              "Stress Testing: Evaluate portfolio resilience"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="warning" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            Configure custom risk alerts in the dashboard settings.
          </Alert>
        </>
      )
    },
    allocation: {
      title: "Portfolio Allocation",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Optimize your portfolio with:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Dynamic Rebalancing: Automatic portfolio adjustments",
              "Liquidity Management: Ensure optimal cash flow",
              "Investor Tracking: Monitor capital allocation",
              "Capital Flows: Track investment movements"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            View interactive allocation charts in the main dashboard.
          </Alert>
        </>
      )
    },
    distribution: {
      title: "Profit Distribution",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Manage profit distribution with:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Performance Fees: Automated fee calculations",
              "Tax Optimization: Tax-efficient distribution",
              "Distribution History: Complete transaction records",
              "Transparent Reporting: Clear financial statements"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            Download detailed transaction reports from the dashboard.
          </Alert>
        </>
      )
    },
    terms: {
      title: "Terms & Conditions",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Key terms for the PAMM system:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "20% performance fee on distributed profits",
              "Minimum 20% manager capital ratio",
              "Automated liquidation at risk thresholds",
              "Quarterly performance reviews"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="warning" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            Review full terms before participating in the PAMM system.
          </Alert>
        </>
      )
    },
    riskAssessment: {
      title: "Risk Assessment",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2
          }}>
            Understand the risks involved:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Market Risk: Potential for market-driven losses",
              "Liquidity Risk: Possible withdrawal delays",
              "Operational Risk: System or process failures",
              "Regulatory Risk: Compliance-related issues"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
          }}>
            Complete risk assessment available in your profile settings.
          </Alert>
        </>
      )
    }
  };

  const sections = [
    {
      id: 'performance',
      icon: <Timeline sx={{ fontSize: 20 }} />,
      title: "Performance Analytics",
      subtitle: "Advanced Metrics & Insights",
      description: "Real-time performance tracking with institutional-grade analytics including risk-adjusted returns, volatility analysis, and benchmark comparisons.",
      features: ["Sharpe Ratio Analysis", "Alpha/Beta Calculations", "Drawdown Metrics", "Rolling Returns"],
      color: {
        primary: '#10B981',
        secondary: '#059669',
        bg: 'rgba(16, 185, 129, 0.1)',
        hover: 'rgba(16, 185, 129, 0.15)'
      },
      action: "View Analytics",
      dialogType: "performance"
    },
    {
      id: 'risk',
      icon: <WarningIcon sx={{ fontSize: 32 }} />,
      title: "Risk Monitoring",
      subtitle: "Capital Protection & Oversight",
      description: "Comprehensive risk management with real-time monitoring of capital ratios, concentration limits, and regulatory compliance metrics.",
      features: ["Capital Health Ratios", "Concentration Analysis", "VaR Calculations", "Stress Testing"],
      color: {
        primary: '#EF4444',
        secondary: '#DC2626',
        bg: 'rgba(239, 68, 68, 0.1)',
        hover: 'rgba(239, 68, 68, 0.15)'
      },
      action: "Risk Dashboard",
      dialogType: "risk"
    },
    {
      id: 'allocation',
      icon: <Equalizer sx={{ fontSize: 32 }} />,
      title: "Portfolio Allocation",
      subtitle: "Dynamic Fund Management",
      description: "Sophisticated allocation engine managing investor capital distribution with automated rebalancing and liquidity management.",
      features: ["Dynamic Rebalancing", "Liquidity Management", "Investor Tracking", "Capital Flows"],
      color: {
        primary: '#8B5CF6',
        secondary: '#7C3AED',
        bg: 'rgba(139, 92, 246, 0.1)',
        hover: 'rgba(139, 92, 246, 0.15)'
      },
      action: "View Allocation",
      dialogType: "allocation"
    },
    {
      id: 'distribution',
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      title: "Profit Distribution",
      subtitle: "Automated Fee Management",
      description: "Streamlined profit distribution system with automated performance fee calculations, tax optimization, and transparent reporting.",
      features: ["Performance Fees", "Tax Optimization", "Distribution History", "Transparent Reporting"],
      color: {
        primary: '#F59E0B',
        secondary: '#D97706',
        bg: 'rgba(245, 158, 11, 0.1)',
        hover: 'rgba(245, 158, 11, 0.15)'
      },
      action: "Transaction Log",
      dialogType: "distribution"
    }
  ];

  return (
    <Card sx={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.92))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.92))',
      border: theme === 'dark' 
        ? '1px solid rgba(56, 189, 248, 0.2)'
        : '1px solid rgba(59, 130, 246, 0.15)',
      borderRadius: '20px',
      boxShadow: theme === 'dark' 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(148, 163, 184, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.05)'
        : '0 25px 50px -12px rgba(59, 130, 246, 0.15), inset 0 0 0 1px rgba(203, 213, 225, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      mb: 4,
      position: 'relative',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: theme === 'dark' 
          ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), rgba(139, 92, 246, 0.4), rgba(16, 185, 129, 0.5), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.3), rgba(16, 185, 129, 0.4), transparent)',
        animation: 'shimmer 3s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme === 'dark' 
          ? 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none'
      },
      '@keyframes shimmer': {
        '0%, 100%': { opacity: 0.5, transform: 'translateX(-100%)' },
        '50%': { opacity: 1, transform: 'translateX(100%)' }
      }
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
  {/* Left spacer (or content if any) */}
   <Box sx={{ flex: 1 }} />

  {/* Right side: Title and Close button */}
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: theme === 'dark' ? 'rgba(224, 242, 254, 0.95)' : 'rgba(15, 23, 42, 0.95)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontFamily: '"Inter", -apple-system, sans-serif',
          position: 'relative',
          mb: 2,
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
        }}
      >
        about
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          color: theme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          mt: 1,
        }}
      >
        Professional Asset Management Suite
      </Typography>
    </Box>

    <IconButton
      onClick={onClose}
      size="medium"
      sx={{
        color: theme === 'dark' ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)',
        background: theme === 'dark'
          ? 'rgba(30, 41, 59, 0.3)'
          : 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(8px)',
        border: theme === 'dark'
          ? '1px solid rgba(71, 85, 105, 0.3)'
          : '1px solid rgba(203, 213, 225, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          color: theme === 'dark' ? '#38BDF8' : '#2563EB',
          background: theme === 'dark'
            ? 'rgba(56, 189, 248, 0.1)'
            : 'rgba(59, 130, 246, 0.1)',
          transform: 'scale(1.05)',
          borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(59, 130, 246, 0.3)'
        }
      }}
    >
      <CloseIcon />
    </IconButton>
  </Box>
</Box>

        
        {/* Introduction */}
        <Box sx={{ 
          mb: 4,
          p: 3,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(51, 65, 85, 0.2))'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
          borderRadius: '16px',
          border: theme === 'dark' 
            ? '1px solid rgba(71, 85, 105, 0.3)'
            : '1px solid rgba(203, 213, 225, 0.4)',
          backdropFilter: 'blur(8px)'
        }}>
          <Typography variant="body1" sx={{
            color: theme === 'dark' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(30, 41, 59, 0.95)',
            fontWeight: 400,
            lineHeight: 1.8,
            letterSpacing: '0.01em',
            fontFamily: '"Inter", -apple-system, sans-serif',
            fontSize: '1.05rem'
          }}>
            The <Box component="span" sx={{ 
              fontWeight: 600, 
              color: theme === 'dark' ? '#38BDF8' : '#2563EB' 
            }}>Percentage Allocation Management Module</Box> provides institutional-grade fund management capabilities with comprehensive oversight, advanced analytics, and automated profit distribution systems designed for professional asset managers.
          </Typography>
        </Box>
        
        {/* Feature Sections */}
        <Box sx={{ mb: 4 }}>
          {sections.map((section, index) => (
            <Card
              key={section.id}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              sx={{
                mb: 3,
                p: 3,
                background: hoveredSection === section.id
                  ? (theme === 'dark' 
                      ? `linear-gradient(135deg, ${section.color.bg}, rgba(30, 41, 59, 0.8))`
                      : `linear-gradient(135deg, ${section.color.bg}, rgba(248, 250, 252, 0.9))`)
                  : (theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.4))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))'),
                border: hoveredSection === section.id
                  ? `1px solid ${section.color.primary}40`
                  : (theme === 'dark' 
                      ? '1px solid rgba(71, 85, 105, 0.3)'
                      : '1px solid rgba(203, 213, 225, 0.4)'),
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredSection === section.id ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredSection === section.id
                  ? `0 20px 40px -8px ${section.color.primary}20, 0 0 0 1px ${section.color.primary}20`
                  : (theme === 'dark' 
                      ? '0 4px 16px -2px rgba(0, 0, 0, 0.2)'
                      : '0 4px 16px -2px rgba(0, 0, 0, 0.08)'),
                backdropFilter: 'blur(12px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: hoveredSection === section.id
                    ? `linear-gradient(90deg, ${section.color.primary}, ${section.color.secondary})`
                    : 'transparent',
                  borderRadius: '16px 16px 0 0',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 3,
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Box sx={{
                  p: 2,
                  borderRadius: '12px',
                  background: hoveredSection === section.id
                    ? `linear-gradient(135deg, ${section.color.primary}, ${section.color.secondary})`
                    : (theme === 'dark' 
                        ? 'rgba(71, 85, 105, 0.4)'
                        : 'rgba(248, 250, 252, 0.8)'),
                  color: hoveredSection === section.id
                    ? '#FFFFFF'
                    : section.color.primary,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredSection === section.id ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                  mb: { xs: 2, sm: 0 }
                }}>
                  {section.icon}
                </Box>
                
                <Box sx={{width: { xs: '100%', sm: 'auto' }, flex: 1}}>
                  <Box display="flex" alignItems="center" gap={2} mb={1} justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Typography variant="h6" sx={{
                      color: theme === 'dark' ? 'rgba(226, 232, 240, 0.95)' : 'rgba(15, 23, 42, 0.95)',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}>
                      {section.title}
                    </Typography>
                    <Chip
                      label={section.subtitle}
                      size="small"
                      sx={{
                        background: hoveredSection === section.id
                          ? `${section.color.primary}20`
                          : (theme === 'dark' ? 'rgba(71, 85, 105, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                        color: hoveredSection === section.id
                          ? section.color.primary
                          : (theme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)'),
                        border: `1px solid ${hoveredSection === section.id ? section.color.primary + '30' : 'transparent'}`,
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{
                    color: theme === 'dark' ? 'rgba(203, 213, 225, 0.8)' : 'rgba(71, 85, 105, 0.8)',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    mb: 2
                  }}>
                    {section.description}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    {section.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: hoveredSection === section.id 
                            ? `${section.color.primary}50`
                            : (theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.6)'),
                          color: hoveredSection === section.id
                            ? section.color.primary
                            : (theme === 'dark' ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)'),
                          fontSize: '0.65rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: section.color.primary,
                            color: section.color.primary,
                            transform: 'translateY(-1px)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleOpenDialog(section.dialogType)}
                    sx={{
                      background: hoveredSection === section.id
                        ? `linear-gradient(135deg, ${section.color.primary}, ${section.color.secondary})`
                        : (theme === 'dark' 
                            ? 'rgba(71, 85, 105, 0.4)'
                            : 'rgba(248, 250, 252, 0.8)'),
                      color: hoveredSection === section.id
                        ? '#FFFFFF'
                        : (theme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)'),
                      border: `1px solid ${hoveredSection === section.id ? 'transparent' : (theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)')}`,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${section.color.primary}, ${section.color.secondary})`,
                        color: '#FFFFFF',
                        transform: 'translateX(4px)',
                        boxShadow: `0 8px 24px -4px ${section.color.primary}40`
                      },
                      '& .MuiButton-endIcon': {
                        transition: 'transform 0.3s ease',
                        transform: hoveredSection === section.id ? 'translateX(2px)' : 'translateX(0px)'
                      }
                    }}
                  >
                    {section.action}
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
        
        {/* Enhanced Risk Disclosure */}
        <Box sx={{
          p: 3,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(30, 41, 59, 0.8))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.03), rgba(248, 250, 252, 0.9))',
          borderRadius: '16px',
          border: theme === 'dark' 
            ? '1px solid rgba(239, 68, 68, 0.2)'
            : '1px solid rgba(239, 68, 68, 0.15)',
          backdropFilter: 'blur(8px)'
        }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box sx={{
              p: 1.5,
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444'
            }}>
              <InfoIcon />
            </Box>
            <Typography variant="h6" sx={{
              color: theme === 'dark' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(15, 23, 42, 0.9)',
              fontWeight: 600
            }}>
              Risk Disclosure & Compliance
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.8)' : 'rgba(71, 85, 105, 0.8)',
            fontWeight: 400,
            lineHeight: 1.7,
            mb: 3
          }}>
            The PAMM system employs a <Box component="span" sx={{ fontWeight: 600, color: '#EF4444' }}>20% performance fee</Box> structure on all distributed profits. Manager capital must maintain a minimum <Box component="span" sx={{ fontWeight: 600, color: '#EF4444' }}>20% ratio</Box> of investor capital to ensure adequate risk coverage and regulatory compliance.
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArticleIcon />}
              onClick={() => handleOpenDialog('terms')}
              sx={{
                borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                '&:hover': {
                  borderColor: '#EF4444',
                  background: 'rgba(239, 68, 68, 0.1)'
                }
              }}
            >
              View Terms & Conditions
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AssessmentIcon />}
              onClick={() => handleOpenDialog('riskAssessment')}
              sx={{
                borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                '&:hover': {
                  borderColor: '#EF4444',
                  background: 'rgba(239, 68, 68, 0.1)'
                }
              }}
            >
              Risk Assessment
            </Button>
          </Box>
        </Box>

        <Dialog
          open={!!openDialog}
          onClose={handleCloseDialog}
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
            {openDialog && dialogContent[openDialog].title}
          </DialogTitle>
          <DialogContent sx={{ padding: '20px 24px' }}>
            {openDialog && dialogContent[openDialog].content}
          </DialogContent>
          <DialogActions sx={{
            padding: '16px 24px',
            borderTop: theme === 'dark' 
              ? '1px solid rgba(71, 85, 105, 0.5)'
              : '1px solid rgba(226, 232, 240, 0.7)'
          }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                color: theme === 'dark' ? '#94A3B8' : '#64748B',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DashboardInfoPanel;

















