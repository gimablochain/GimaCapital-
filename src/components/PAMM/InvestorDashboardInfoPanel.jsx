
// import React, { useState } from 'react';
// import { CardContent, Card, Box,Typography, IconButton, Button, Chip, Dialog, DialogTitle,
//     DialogContent,   DialogActions, Alert
// } from '@mui/material';

// import {
//   Close as CloseIcon,
//   TrendingUp as TrendingUpIcon,
//   PieChart as PieChartIcon,
//   Receipt as ReceiptIcon,
//   Warning as WarningIcon,
//   KeyboardArrowRight as ArrowRightIcon,
//   Security as SecurityIcon,
//   Analytics as AnalyticsIcon,
//   AccountBalance as AccountBalanceIcon
// } from '@mui/icons-material';


// const InvestordashboardInfoPanel = ({ theme, onClose }) => {
//   const [openDialog, setOpenDialog] = useState(null);

//   const handleOpenDialog = (dialogType) => {
//     setOpenDialog(dialogType);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(null);
//   };

//   const dialogContent = {
//     analytics: {
//       title: "Performance Analytics",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Dive into comprehensive performance metrics to track your investment success:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "Sharpe Ratio Analysis: Measure risk-adjusted returns",
//               "Alpha/Beta Metrics: Evaluate market outperformance",
//               "Volatility Tracking: Monitor price fluctuations",
//               "Drawdown Analysis: Assess potential losses"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="info" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Real-time data updates every 5 minutes. Access detailed charts in the main dashboard.
//           </Alert>
//         </>
//       )
//     },
//     risk: {
//       title: "Risk Monitoring",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Stay informed with our advanced risk monitoring system:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "Real-time Risk Scoring: Continuous risk assessment",
//               "Automated Alerts: Instant notifications for risk thresholds",
//               "Margin Monitoring: Track margin requirements",
//               "Volatility Analysis: Understand market fluctuations"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="warning" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Set custom risk thresholds in your account settings for personalized monitoring.
//           </Alert>
//         </>
//       )
//     },
//     allocation: {
//       title: "Allocation Breakdown",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Understand your portfolio distribution with detailed insights:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "Asset Allocation: View distribution across asset classes",
//               "Geographic Distribution: See regional investment spread",
//               "Sector Analysis: Monitor industry exposure",
//               "Rebalancing Alerts: Get notified for optimal portfolio adjustments"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="info" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Interactive charts available in the main dashboard for real-time allocation tracking.
//           </Alert>
//         </>
//       )
//     },
//     ledger: {
//       title: "Distribution Ledger",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Access your complete transaction history:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "Payout History: Track all distributions",
//               "Fee Breakdown: Transparent fee calculations",
//               "Tax Reporting: Exportable reports for tax purposes",
//               "Auto-scheduling: Automated distribution schedules"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="info" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Download detailed transaction logs from the main dashboard.
//           </Alert>
//         </>
//       )
//     },
//     terms: {
//       title: "Terms & Conditions",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Key terms of the PAMM system:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "20% performance fee on net profits above high-water mark",
//               "Automatic liquidation at drawdown limit breach",
//               "Monthly distribution schedule",
//               "Minimum investment period of 3 months"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="warning" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Past performance is not indicative of future results. Please review full terms before investing.
//           </Alert>
//         </>
//       )
//     },
//     riskAssessment: {
//       title: "Risk Assessment",
//       content: (
//         <>
//           <Typography variant="body1" paragraph sx={{ 
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             lineHeight: 1.7,
//             mb: 2
//           }}>
//             Understand the risks associated with PAMM investments:
//           </Typography>
//           <Box component="ul" sx={{ pl: 2, mb: 2 }}>
//             {[
//               "Market Risk: Potential for loss due to market fluctuations",
//               "Liquidity Risk: Possible delays in fund withdrawal",
//               "Manager Risk: Dependence on manager performance",
//               "Systemic Risk: Impact from broader market events"
//             ].map((item, index) => (
//               <Typography key={index} component="li" variant="body2" sx={{
//                 color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                 mb: 1
//               }}>
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//           <Alert severity="info" sx={{ 
//             backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)'
//           }}>
//             Complete risk assessment available in account settings for personalized risk profiling.
//           </Alert>
//         </>
//       )
//     }
//   };

//   return (
//     <Card sx={{
//       background: theme === 'dark' 
//         ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.99))'
//         : 'linear-gradient(135deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.98))',
//       border: theme === 'dark' 
//         ? '1px solid rgba(56, 189, 248, 0.18)'
//         : '1px solid rgba(59, 130, 246, 0.12)',
//       borderRadius: '16px',
//       boxShadow: theme === 'dark' 
//         ? '0 20px 40px -8px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(148, 163, 184, 0.12)'
//         : '0 20px 40px -8px rgba(0, 107, 194, 0.12), inset 0 0 0 1px rgba(203, 213, 225, 0.35)',
//       mb: 4,
//       position: 'relative',
//       backdropFilter: 'blur(16px)',
//       overflow: 'hidden',
//       '&::before': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         height: '2px',
//         background: theme === 'dark' 
//           ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)'
//           : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
//       },
//       '&::after': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: theme === 'dark' 
//           ? 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.03), transparent 50%)'
//           : 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.02), transparent 50%)',
//         pointerEvents: 'none'
//       }
//     }}>
//       <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
//           <Typography variant="h5" sx={{
//             color: theme === 'dark' ? 'rgba(224, 242, 254, 0.95)' : 'rgba(23, 37, 84, 0.95)',
//             fontWeight: 700,
//             letterSpacing: '0.03em',
//             fontFamily: '"Inter", -apple-system, sans-serif',
//             fontSize: '1.35rem',
//             position: 'relative',
//             textShadow: theme === 'dark' 
//               ? '0 2px 8px rgba(0, 0, 0, 0.3)'
//               : '0 2px 8px rgba(0, 107, 194, 0.08)',
//             '&::after': {
//               content: '""',
//               position: 'absolute',
//               bottom: -10,
//               left: 0,
//               width: '60px',
//               height: '3px',
//               background: theme === 'dark' 
//                 ? 'linear-gradient(90deg, #38BDF8, rgba(56, 189, 248, 0.4), transparent)'
//                 : 'linear-gradient(90deg, #3B82F6, rgba(59, 130, 246, 0.4), transparent)',
//               borderRadius: '2px',
//               boxShadow: theme === 'dark' 
//                 ? '0 0 12px rgba(56, 189, 248, 0.4)'
//                 : '0 0 12px rgba(59, 130, 246, 0.3)'
//             }
//           }}>
//             about
//           </Typography>
//           <IconButton 
//             onClick={onClose}
//             size="small"
//             sx={{
//               color: theme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
//               borderRadius: '8px',
//               backdropFilter: 'blur(8px)',
//               background: theme === 'dark' 
//                 ? 'rgba(30, 41, 59, 0.5)'
//                 : 'rgba(248, 250, 252, 0.8)',
//               border: theme === 'dark' 
//                 ? '1px solid rgba(56, 189, 248, 0.1)'
//                 : '1px solid rgba(59, 130, 246, 0.08)',
//               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               '&:hover': {
//                 color: theme === 'dark' ? '#38BDF8' : '#2563EB',
//                 background: theme === 'dark' 
//                   ? 'rgba(30, 41, 59, 0.8)'
//                   : 'rgba(248, 250, 252, 0.95)',
//                 borderColor: theme === 'dark' 
//                   ? 'rgba(56, 189, 248, 0.25)'
//                   : 'rgba(59, 130, 246, 0.15)',
//                 transform: 'scale(1.05)',
//                 boxShadow: theme === 'dark' 
//                   ? '0 4px 16px rgba(0, 0, 0, 0.25)'
//                   : '0 4px 16px rgba(0, 107, 194, 0.1)'
//               }
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
        
//         <Typography variant="subtitle1" paragraph sx={{
//           color: theme === 'dark' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(30, 41, 59, 0.92)',
//           fontWeight: 500,
//           lineHeight: 1.8,
//           letterSpacing: '0.015em',
//           fontFamily: '"Inter", -apple-system, sans-serif',
//           fontSize: '1rem',
//           mb: 3.5,
//           position: 'relative',
//           pl: 2,
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             left: 0,
//             top: 0,
//             bottom: 0,
//             width: '3px',
//             background: theme === 'dark' 
//               ? 'linear-gradient(180deg, #38BDF8, rgba(56, 189, 248, 0.3))'
//               : 'linear-gradient(180deg, #3B82F6, rgba(59, 130, 246, 0.3))',
//             borderRadius: '2px'
//           }
//         }}>
//            <Box component="span" sx={{ 
//             fontWeight: 700,
//             background: theme === 'dark' 
//               ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)'
//               : 'linear-gradient(135deg, #3B82F6, #2563EB)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             backgroundClip: 'text'
//           }}>Percentage Allocation Management Module</Box> delivers institutional-grade investment management through an automated allocation system. This dashboard provides comprehensive oversight of your capital deployment and sophisticated performance metrics.
//         </Typography>
        
//         <Box sx={{ 
//           mb: 3.5,
//           pl: 0,
//           borderLeft: theme === 'dark' 
//             ? '2px solid rgba(56, 189, 248, 0.25)' 
//             : '2px solid rgba(59, 130, 246, 0.2)',
//           borderRadius: '0 0 0 4px',
//           background: theme === 'dark' 
//             ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.03), transparent 40%)'
//             : 'linear-gradient(90deg, rgba(59, 130, 246, 0.02), transparent 40%)',
//           p: 2
//         }}>
//           {[
//             {
//               icon: <TrendingUpIcon fontSize="medium" />,
//               title: "Performance Analytics",
//               subtitle: "Advanced Metrics & Reporting",
//               text: "Real-time tracking of returns with waterfall visualization of profit components and advanced risk-adjusted metrics. Features include Sharpe ratio calculations, alpha/beta measurements, and volatility-adjusted performance indicators.",
//               features: ["Sharpe Ratio Analysis", "Alpha/Beta Metrics", "Volatility Tracking", "Drawdown Analysis"],
//               buttonText: "View Analytics",
//               color: "#10B981",
//               bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
//               dialogType: "analytics"
//             },
//             {
//               icon: <SecurityIcon fontSize="medium" />,
//               title: "Risk Monitoring",
//               subtitle: "Dynamic Risk Assessment",
//               text: "Dynamic drawdown indicators with multi-level alert thresholds and sophisticated volatility analysis. Real-time risk exposure monitoring with automated protection protocols and margin call alerts.",
//               features: ["Real-time Risk Scoring", "Automated Alerts", "Margin Monitoring", "Volatility Analysis"],
//               buttonText: "Risk Dashboard",
//               color: "#EF4444",
//               bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))",
//               dialogType: "risk"
//             },
//             {
//               icon: <PieChartIcon fontSize="medium" />,
//               title: "Allocation Breakdown",
//               subtitle: "Portfolio Distribution",
//               text: "Precisely calibrated percentage ownership of the managed pool with transparent fee attribution. Interactive charts showing asset allocation, geographic distribution, and sector exposure with real-time rebalancing indicators.",
//               features: ["Asset Allocation", "Geographic Distribution", "Sector Analysis", "Rebalancing Alerts"],
//               buttonText: "View Allocation",
//               color: "#8B5CF6",
//               bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))",
//               dialogType: "allocation"
//             },
//             {
//               icon: <ReceiptIcon fontSize="medium" />,
//               title: "Distribution Ledger",
//               subtitle: "Transaction History",
//               text: "Complete historical record of all payouts, fee structures, and performance-based distributions. Detailed transaction logs with tax reporting capabilities and automated distribution scheduling.",
//               features: ["Payout History", "Fee Breakdown", "Tax Reporting", "Auto-scheduling"],
//               buttonText: "Transaction Log",
//               color: "#F59E0B",
//               bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))",
//               dialogType: "ledger"
//             }
//           ].map((item, index) => (
//             <Box key={index} sx={{ 
//               display: 'flex', 
//               flexDirection: {
//                 xs: 'column-reverse', // on mobile, stack with icon on top
//                 sm: 'row'             // on larger screens, default horizontal layout
//               },
//               mb: 4,
//               p: 3,
//               borderRadius: '16px',
//               background: theme === 'dark' 
//                 ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
//                 : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
//               border: theme === 'dark' 
//                 ? '1px solid rgba(56, 189, 248, 0.12)'
//                 : '1px solid rgba(59, 130, 246, 0.08)',
//               backdropFilter: 'blur(12px)',
//               transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//               position: 'relative',
//               overflow: 'hidden',
//               '&:last-child': { mb: 0 },
//               '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: '2px',
//                 background: item.bgGradient,
//                 transition: 'opacity 0.3s ease'
//               },
//               '&:hover': {
//                 background: theme === 'dark' 
//                   ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))'
//                   : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
//                 borderColor: theme === 'dark' 
//                   ? 'rgba(56, 189, 248, 0.2)'
//                   : 'rgba(59, 130, 246, 0.15)',
//                 transform: 'translateY(-4px)',
//                 boxShadow: theme === 'dark' 
//                   ? '0 16px 32px rgba(0, 0, 0, 0.25)'
//                   : '0 16px 32px rgba(0, 107, 194, 0.1)'
//               }
//             }}>
//              <Box sx={{
//                 flexShrink: 0,
//                 mr: { xs: 0, sm: 3 },
//                 mb: { xs: 2, sm: 0 },
//                 mt: { xs: 0, sm: 0.5 },
//                                 borderRadius: '12px',
//                 background: item.bgGradient,
//                 color: item.color,
//                 boxShadow: `0 8px 24px ${item.color}20`,
//                 border: `1px solid ${item.color}30`,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '60px',
//                 height: '60px'
//               }}>
//                 {item.icon}
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <Typography variant="h6" sx={{
//                     color: theme === 'dark' ? 'rgba(226, 232, 240, 0.95)' : 'rgba(30, 41, 59, 0.98)',
//                     fontWeight: 700,
//                     letterSpacing: '0.02em',
//                     fontSize: '1.1rem',
//                     fontFamily: '"Inter", -apple-system, sans-serif',
//                     mr: 2
//                   }}>
//                     {item.title}
//                   </Typography>
//                   <Chip 
//                     label={item.subtitle}
//                     size="small"
//                     sx={{
//                       background: theme === 'dark' 
//                         ? 'rgba(56, 189, 248, 0.1)'
//                         : 'rgba(59, 130, 246, 0.08)',
//                       color: theme === 'dark' ? '#38BDF8' : '#2563EB',
//                       fontWeight: 500,
//                       fontSize: '0.7rem',
//                       height: '24px',
//                       border: theme === 'dark' 
//                         ? '1px solid rgba(56, 189, 248, 0.2)'
//                         : '1px solid rgba(59, 130, 246, 0.15)',
//                       '& .MuiChip-label': {
//                         px: 1.5
//                       }
//                     }}
//                   />
//                 </Box>
//                 <Typography variant="body2" sx={{
//                   color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//                   fontWeight: 400,
//                   lineHeight: 1.7,
//                   letterSpacing: '0.015em',
//                   fontSize: '0.9rem',
//                   fontFamily: '"Inter", -apple-system, sans-serif',
//                   mb: 2
//                 }}>
//                   {item.text}
//                 </Typography>
                
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
//                   {item.features.map((feature, fIndex) => (
//                     <Chip
//                       key={fIndex}
//                       label={feature}
//                       size="small"
//                       sx={{
//                         background: theme === 'dark' 
//                           ? 'rgba(30, 41, 59, 0.6)'
//                           : 'rgba(248, 250, 252, 0.8)',
//                         color: theme === 'dark' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.8)',
//                         border: theme === 'dark' 
//                           ? '1px solid rgba(56, 189, 248, 0.1)'
//                           : '1px solid rgba(59, 130, 246, 0.08)',
//                         fontSize: '0.75rem',
//                         fontWeight: 500,
//                         height: '28px',
//                         '&:hover': {
//                           background: theme === 'dark' 
//                             ? 'rgba(30, 41, 59, 0.8)'
//                             : 'rgba(248, 250, 252, 0.95)',
//                           borderColor: theme === 'dark' 
//                             ? 'rgba(56, 189, 248, 0.2)'
//                             : 'rgba(59, 130, 246, 0.15)'
//                         }
//                       }}
//                     />
//                   ))}
//                 </Box>

//                 <Button
//                   variant="outlined"
//                   size="small"
//                   endIcon={<ArrowRightIcon />}
//                   onClick={() => handleOpenDialog(item.dialogType)}
//                   sx={{
//                     borderColor: item.color,
//                     color: item.color,
//                     fontWeight: 600,
//                     fontSize: '0.8rem',
//                     textTransform: 'none',
//                     letterSpacing: '0.02em',
//                     px: 2,
//                     py: 1,
//                     borderRadius: '8px',
//                     background: theme === 'dark' 
//                       ? 'rgba(30, 41, 59, 0.4)'
//                       : 'rgba(255, 255, 255, 0.8)',
//                     backdropFilter: 'blur(8px)',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       borderColor: item.color,
//                       background: `${item.color}10`,
//                       transform: 'translateX(4px)',
//                       boxShadow: `0 4px 16px ${item.color}30`
//                     }
//                   }}
//                 >
//                   {item.buttonText}
//                 </Button>
//               </Box>
//             </Box>
//           ))}
//         </Box>
        
//         <Box sx={{
//           mt: 4,
//           pt: 4,
//           borderTop: theme === 'dark' 
//             ? '1px solid rgba(71, 85, 105, 0.4)' 
//             : '1px solid rgba(203, 213, 225, 0.6)',
//           background: theme === 'dark' 
//             ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
//             : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
//           borderRadius: '16px',
//           p: 4,
//           position: 'relative',
//           backdropFilter: 'blur(12px)',
//           border: theme === 'dark' 
//             ? '1px solid rgba(56, 189, 248, 0.15)'
//             : '1px solid rgba(59, 130, 246, 0.12)',
//           overflow: 'hidden',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '2px',
//             background: theme === 'dark' 
//               ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent)'
//               : 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent)'
//           }
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: '10px',
//               background: theme === 'dark' 
//                 ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))'
//                 : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.05))',
//               color: theme === 'dark' ? '#EF4444' : '#DC2626',
//               mr: 2,
//               boxShadow: theme === 'dark' 
//                 ? '0 4px 12px rgba(239, 68, 68, 0.2)'
//                 : '0 4px 12px rgba(220, 38, 38, 0.15)'
//             }}>
//               <WarningIcon fontSize="medium" />
//             </Box>
//             <Typography variant="h6" sx={{
//               color: theme === 'dark' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)',
//               fontWeight: 700,
//               letterSpacing: '0.02em',
//               fontSize: '1.1rem',
//               fontFamily: '"Inter", -apple-system, sans-serif',
//               textTransform: 'uppercase'
//             }}>
//               Risk Disclosure & Terms
//             </Typography>
//           </Box>
          
//           <Typography variant="body2" sx={{
//             color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
//             fontWeight: 400,
//             letterSpacing: '0.015em',
//             fontSize: '0.9rem',
//             fontFamily: '"Inter", -apple-system, sans-serif',
//             lineHeight: 1.7,
//             mb: 3
//           }}>
//             <Box component="span" sx={{ fontWeight: 600, color: theme === 'dark' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)' }}>
//               IMPORTANT NOTICE:
//             </Box> The PAMM system employs a 20% performance fee structure, calculated exclusively on net profits above your established high-water mark. Drawdown limits trigger automatic liquidation protocols when breached. Past performance does not guarantee future results.
//           </Typography>

//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<AccountBalanceIcon />}
//               onClick={() => handleOpenDialog('terms')}
//               sx={{
//                 borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.5)',
//                 color: theme === 'dark' ? '#EF4444' : '#DC2626',
//                 fontWeight: 600,
//                 fontSize: '0.8rem',
//                 textTransform: 'none',
//                 letterSpacing: '0.02em',
//                 px: 2,
//                 py: 1,
//                 borderRadius: '8px',
//                 background: theme === 'dark' 
//                   ? 'rgba(15, 23, 42, 0.6)'
//                   : 'rgba(255, 255, 255, 0.8)',
//                 backdropFilter: 'blur(8px)',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   borderColor: theme === 'dark' ? '#EF4444' : '#DC2626',
//                   background: theme === 'dark' 
//                     ? 'rgba(239, 68, 68, 0.1)'
//                     : 'rgba(220, 38, 38, 0.05)',
//                   transform: 'translateY(-2px)',
//                   boxShadow: theme === 'dark' 
//                     ? '0 4px 16px rgba(239, 68, 68, 0.3)'
//                     : '0 4px 16px rgba(220, 38, 38, 0.2)'
//                 }
//               }}
//             >
//               View Terms & Conditions
//             </Button>
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<AnalyticsIcon />}
//               onClick={() => handleOpenDialog('riskAssessment')}
//               sx={{
//                 borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(59, 130, 246, 0.5)',
//                 color: theme === 'dark' ? '#38BDF8' : '#2563EB',
//                 fontWeight: 600,
//                 fontSize: '0.8rem',
//                 textTransform: 'none',
//                 letterSpacing: '0.02em',
//                 px: 2,
//                 py: 1,
//                 borderRadius: '8px',
//                 background: theme === 'dark' 
//                   ? 'rgba(15, 23, 42, 0.6)'
//                   : 'rgba(255, 255, 255, 0.8)',
//                 backdropFilter: 'blur(8px)',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   borderColor: theme === 'dark' ? '#38BDF8' : '#2563EB',
//                   background: theme === 'dark' 
//                     ? 'rgba(56, 189, 248, 0.1)'
//                     : 'rgba(59, 130, 246, 0.05)',
//                   transform: 'translateY(-2px)',
//                   boxShadow: theme === 'dark' 
//                     ? '0 4px 16px rgba(56, 189, 248, 0.3)'
//                     : '0 4px 16px rgba(59, 130, 246, 0.2)'
//                 }
//               }}
//             >
//               Risk Assessment
//             </Button>
//           </Box>
//         </Box>

//         <Dialog
//           open={!!openDialog}
//           onClose={handleCloseDialog}
//           PaperProps={{
//             sx: {
//               background: theme === 'dark' 
//                 ? 'linear-gradient(145deg, #0F172A, #1E293B)' 
//                 : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
//               borderRadius: '12px',
//               border: theme === 'dark' 
//                 ? '1px solid rgba(100, 116, 139, 0.5)'
//                 : '1px solid rgba(203, 213, 225, 0.7)',
//               boxShadow: theme === 'dark' 
//                 ? '0px 8px 24px rgba(0, 0, 0, 0.5)'
//                 : '0px 8px 24px rgba(0, 0, 0, 0.1)',
//               minWidth: '400px'
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
//             fontWeight: 700,
//             fontSize: '1.25rem',
//             borderBottom: theme === 'dark' 
//               ? '1px solid rgba(71, 85, 105, 0.5)'
//               : '1px solid rgba(226, 232, 240, 0.7)',
//             padding: '16px 24px'
//           }}>
//             {openDialog && dialogContent[openDialog].title}
//           </DialogTitle>
//           <DialogContent sx={{ padding: '20px 24px' }}>
//             {openDialog && dialogContent[openDialog].content}
//           </DialogContent>
//           <DialogActions sx={{
//             padding: '16px 24px',
//             borderTop: theme === 'dark' 
//               ? '1px solid rgba(71, 85, 105, 0.5)'
//               : '1px solid rgba(226, 232, 240, 0.7)'
//           }}>
//             <Button 
//               onClick={handleCloseDialog}
//               sx={{ 
//                 color: theme === 'dark' ? '#94A3B8' : '#64748B',
//                 fontWeight: 500,
//                 '&:hover': {
//                   backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
//                 }
//               }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };
// export default InvestordashboardInfoPanel;





import React, { useState } from 'react';
import {
  CardContent, Card, Box, Typography, IconButton, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

const InvestordashboardInfoPanel = ({ theme, onClose }) => {
  const [openDialog, setOpenDialog] = useState(null);

  const handleOpenDialog = (dialogType) => {
    setOpenDialog(dialogType);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const dialogContent = {
    analytics: {
      title: "Performance Analytics",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Dive into comprehensive performance metrics to track your investment success:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Sharpe Ratio Analysis: Measure risk-adjusted returns",
              "Alpha/Beta Metrics: Evaluate market outperformance",
              "Volatility Tracking: Monitor price fluctuations",
              "Drawdown Analysis: Assess potential losses"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Real-time data updates every 5 minutes. Access detailed charts in the main dashboard.
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
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Stay informed with our advanced risk monitoring system:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Real-time Risk Scoring: Continuous risk assessment",
              "Automated Alerts: Instant notifications for risk thresholds",
              "Margin Monitoring: Track margin requirements",
              "Volatility Analysis: Understand market fluctuations"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="warning" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Set custom risk thresholds in your account settings for personalized monitoring.
          </Alert>
        </>
      )
    },
    allocation: {
      title: "Allocation Breakdown",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Understand your portfolio distribution with detailed insights:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Asset Allocation: View distribution across asset classes",
              "Geographic Distribution: See regional investment spread",
              "Sector Analysis: Monitor industry exposure",
              "Rebalancing Alerts: Get notified for optimal portfolio adjustments"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Interactive charts available in the main dashboard for real-time allocation tracking.
          </Alert>
        </>
      )
    },
    ledger: {
      title: "Distribution Ledger",
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ 
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            lineHeight: 1.7,
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Access your complete transaction history:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Payout History: Track all distributions",
              "Fee Breakdown: Transparent fee calculations",
              "Tax Reporting: Exportable reports for tax purposes",
              "Auto-scheduling: Automated distribution schedules"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Download detailed transaction logs from the main dashboard.
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
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Key terms of the PAMM system:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "20% performance fee on net profits above high-water mark",
              "Automatic liquidation at drawdown limit breach",
              "Monthly distribution schedule",
              "Minimum investment period of 3 months"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="warning" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Past performance is not indicative of future results. Please review full terms before investing.
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
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Understand the risks associated with PAMM investments:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            {[
              "Market Risk: Potential for loss due to market fluctuations",
              "Liquidity Risk: Possible delays in fund withdrawal",
              "Manager Risk: Dependence on manager performance",
              "Systemic Risk: Impact from broader market events"
            ].map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{
                color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Alert severity="info" sx={{ 
            backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}>
            Complete risk assessment available in account settings for personalized risk profiling.
          </Alert>
        </>
      )
    }
  };

  return (
    <Card sx={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.99))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.98))',
      border: theme === 'dark' 
        ? '1px solid rgba(56, 189, 248, 0.18)'
        : '1px solid rgba(59, 130, 246, 0.12)',
      borderRadius: '16px',
      boxShadow: theme === 'dark' 
        ? '0 20px 40px -8px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(148, 163, 184, 0.12)'
        : '0 20px 40px -8px rgba(0, 107, 194, 0.12), inset 0 0 0 1px rgba(203, 213, 225, 0.35)',
      mb: 4,
      position: 'relative',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: theme === 'dark' 
          ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme === 'dark' 
          ? 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.03), transparent 50%)'
          : 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.02), transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 4 }, position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={{ xs: 2, sm: 4 }}>
          <Typography variant="h5" sx={{
            color: theme === 'dark' ? 'rgba(224, 242, 254, 0.95)' : 'rgba(23, 37, 84, 0.95)',
            fontWeight: 700,
            letterSpacing: '0.03em',
            fontFamily: '"Inter", -apple-system, sans-serif',
            fontSize: { xs: '1.1rem', sm: '1.35rem' },
            position: 'relative',
            textShadow: theme === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 107, 194, 0.08)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: '60px',
              height: '3px',
              background: theme === 'dark' 
                ? 'linear-gradient(90deg, #38BDF8, rgba(56, 189, 248, 0.4), transparent)'
                : 'linear-gradient(90deg, #3B82F6, rgba(59, 130, 246, 0.4), transparent)',
              borderRadius: '2px',
              boxShadow: theme === 'dark' 
                ? '0 0 12px rgba(56, 189, 248, 0.4)'
                : '0 0 12px rgba(59, 130, 246, 0.3)'
            }
          }}>
            about
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{
              color: theme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
              borderRadius: '8px',
              backdropFilter: 'blur(8px)',
              background: theme === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(248, 250, 252, 0.8)',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.1)'
                : '1px solid rgba(59, 130, 246, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              p: 1.5,
              '&:hover': {
                color: theme === 'dark' ? '#38BDF8' : '#2563EB',
                background: theme === 'dark' 
                  ? 'rgba(30, 41, 59, 0.8)'
                  : 'rgba(248, 250, 252, 0.95)',
                borderColor: theme === 'dark' 
                  ? 'rgba(56, 189, 248, 0.25)'
                  : 'rgba(59, 130, 246, 0.15)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="subtitle1" paragraph sx={{
          color: theme === 'dark' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(30, 41, 59, 0.92)',
          fontWeight: 500,
          lineHeight: 1.8,
          letterSpacing: '0.015em',
          fontFamily: '"Inter", -apple-system, sans-serif',
          fontSize: { xs: '0.9rem', sm: '1rem' },
          mb: { xs: 2, sm: 3.5 },
          pl: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: theme === 'dark' 
              ? 'linear-gradient(180deg, #38BDF8, rgba(56, 189, 248, 0.3))'
              : 'linear-gradient(180deg, #3B82F6, rgba(59, 130, 246, 0.3))',
            borderRadius: '2px'
          }
        }}>
          <Box component="span" sx={{ 
            fontWeight: 700,
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)'
              : 'linear-gradient(135deg, #3B82F6, #2563EB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Percentage Allocation Management Module</Box> delivers institutional-grade investment management through an automated allocation system. This dashboard provides comprehensive oversight of your capital deployment and sophisticated performance metrics.
        </Typography>
        
        <Box sx={{ 
          mb: { xs: 2, sm: 3.5 },
          pl: 0,
          borderLeft: theme === 'dark' 
            ? '2px solid rgba(56, 189, 248, 0.25)' 
            : '2px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '0 0 0 4px',
          background: theme === 'dark' 
            ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.03), transparent 40%)'
            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.02), transparent 40%)',
          p: { xs: 1.5, sm: 2 }
        }}>
          {[
            {
              icon: <TrendingUpIcon fontSize="medium" />,
              title: "Performance Analytics",
              subtitle: "Advanced Metrics & Reporting",
              text: "Real-time tracking of returns with waterfall visualization of profit components and advanced risk-adjusted metrics. Features include Sharpe ratio calculations, alpha/beta measurements, and volatility-adjusted performance indicators.",
              features: ["Sharpe Ratio Analysis", "Alpha/Beta Metrics", "Volatility Tracking", "Drawdown Analysis"],
              buttonText: "View Analytics",
              color: "#10B981",
              bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))",
              dialogType: "analytics"
            },
            {
              icon: <SecurityIcon fontSize="medium" />,
              title: "Risk Monitoring",
              subtitle: "Dynamic Risk Assessment",
              text: "Dynamic drawdown indicators with multi-level alert thresholds and sophisticated volatility analysis. Real-time risk exposure monitoring with automated protection protocols and margin call alerts.",
              features: ["Real-time Risk Scoring", "Automated Alerts", "Margin Monitoring", "Volatility Analysis"],
              buttonText: "Risk Dashboard",
              color: "#EF4444",
              bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))",
              dialogType: "risk"
            },
            {
              icon: <PieChartIcon fontSize="medium" />,
              title: "Allocation Breakdown",
              subtitle: "Portfolio Distribution",
              text: "Precisely calibrated percentage ownership of the managed pool with transparent fee attribution. Interactive charts showing asset allocation, geographic distribution, and sector exposure with real-time rebalancing indicators.",
              features: ["Asset Allocation", "Geographic Distribution", "Sector Analysis", "Rebalancing Alerts"],
              buttonText: "View Allocation",
              color: "#8B5CF6",
              bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))",
              dialogType: "allocation"
            },
            {
              icon: <ReceiptIcon fontSize="medium" />,
              title: "Distribution Ledger",
              subtitle: "Transaction History",
              text: "Complete historical record of all payouts, fee structures, and performance-based distributions. Detailed transaction logs with tax reporting capabilities and automated distribution scheduling.",
              features: ["Payout History", "Fee Breakdown", "Tax Reporting", "Auto-scheduling"],
              buttonText: "Transaction Log",
              color: "#F59E0B",
              bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))",
              dialogType: "ledger"
            }
          ].map((item, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              mb: { xs: 2, sm: 4 },
              p: { xs: 1.5, sm: 3 },
              borderRadius: '16px',
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
              border: theme === 'dark' 
                ? '1px solid rgba(56, 189, 248, 0.12)'
                : '1px solid rgba(59, 130, 246, 0.08)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&:last-child': { mb: 0 },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: item.bgGradient,
                transition: 'opacity 0.3s ease'
              }
            }}>
              <Box sx={{
                flexShrink: 0,
                mr: { xs: 0, sm: 3 },
                mb: { xs: 2, sm: 0 },
                mt: { xs: 0, sm: 0.5 },
                borderRadius: '12px',
                background: item.bgGradient,
                color: item.color,
                boxShadow: `0 8px 24px ${item.color}20`,
                border: `1px solid ${item.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '2.5rem', sm: '3.75rem' },
                height: { xs: '2.5rem', sm: '3.75rem' }
              }}>
                {item.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{
                    color: theme === 'dark' ? 'rgba(226, 232, 240, 0.95)' : 'rgba(30, 41, 59, 0.98)',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontFamily: '"Inter", -apple-system, sans-serif',
                    mr: 2
                  }}>
                    {item.title}
                  </Typography>
                  <Chip 
                    label={item.subtitle}
                    size="small"
                    sx={{
                      background: theme === 'dark' 
                        ? 'rgba(56, 189, 248, 0.1)'
                        : 'rgba(59, 130, 246, 0.08)',
                      color: theme === 'dark' ? '#38BDF8' : '#2563EB',
                      fontWeight: 500,
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      height: { xs: '22px', sm: '24px' },
                      border: theme === 'dark' 
                        ? '1px solid rgba(56, 189, 248, 0.2)'
                        : '1px solid rgba(59, 130, 246, 0.15)',
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{
                  color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  letterSpacing: '0.015em',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontFamily: '"Inter", -apple-system, sans-serif',
                  mb: 2
                }}>
                  {item.text}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: 2 }}>
                  {item.features.map((feature, fIndex) => (
                    <Chip
                      key={fIndex}
                      label={feature}
                      size="small"
                      sx={{
                        background: theme === 'dark' 
                          ? 'rgba(30, 41, 59, 0.6)'
                          : 'rgba(248, 250, 252, 0.8)',
                        color: theme === 'dark' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                        border: theme === 'dark' 
                          ? '1px solid rgba(56, 189, 248, 0.1)'
                          : '1px solid rgba(59, 130, 246, 0.08)',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 500,
                        height: { xs: '26px', sm: '28px' },
                        '&:hover': {
                          background: theme === 'dark' 
                            ? 'rgba(30, 41, 59, 0.8)'
                            : 'rgba(248, 250, 252, 0.95)',
                          borderColor: theme === 'dark' 
                            ? 'rgba(56, 189, 248, 0.2)'
                            : 'rgba(59, 130, 246, 0.15)'
                        }
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowRightIcon />}
                  onClick={() => handleOpenDialog(item.dialogType)}
                  sx={{
                    borderColor: item.color,
                    color: item.color,
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    textTransform: 'none',
                    letterSpacing: '0.02em',
                    px: 2.5,
                    py: 1.5,
                    borderRadius: '8px',
                    background: theme === 'dark' 
                      ? 'rgba(30, 41, 59, 0.4)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: item.color,
                      background: `${item.color}10`
                    }
                  }}
                >
                  {item.buttonText}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box sx={{
          mt: { xs: 2, sm: 4 },
          pt: { xs: 2, sm: 4 },
          borderTop: theme === 'dark' 
            ? '1px solid rgba(71, 85, 105, 0.4)' 
            : '1px solid rgba(203, 213, 225, 0.6)',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
          borderRadius: '16px',
          p: { xs: 2, sm: 4 },
          position: 'relative',
          backdropFilter: 'blur(12px)',
          border: theme === 'dark' 
            ? '1px solid rgba(56, 189, 248, 0.15)'
            : '1px solid rgba(59, 130, 246, 0.12)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: theme === 'dark' 
              ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent)'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: '10px',
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.05))',
              color: theme === 'dark' ? '#EF4444' : '#DC2626',
              mr: 2,
              boxShadow: theme === 'dark' 
                ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                : '0 4px 12px rgba(220, 38, 38, 0.15)'
            }}>
              <WarningIcon fontSize="medium" />
            </Box>
            <Typography variant="h6" sx={{
              color: theme === 'dark' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontFamily: '"Inter", -apple-system, sans-serif',
              textTransform: 'uppercase'
            }}>
              Risk Disclosure & Terms
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{
            color: theme === 'dark' ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 85, 105, 0.9)',
            fontWeight: 400,
            letterSpacing: '0.015em',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            fontFamily: '"Inter", -apple-system, sans-serif',
            lineHeight: 1.7,
            mb: 2
          }}>
            <Box component="span" sx={{ fontWeight: 600, color: theme === 'dark' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)' }}>
              IMPORTANT NOTICE:
            </Box> The PAMM system employs a 20% performance fee structure, calculated exclusively on net profits above your established high-water mark. Drawdown limits trigger automatic liquidation protocols when breached. Past performance does not guarantee future results.
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AccountBalanceIcon />}
              onClick={() => handleOpenDialog('terms')}
              sx={{
                borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.5)',
                color: theme === 'dark' ? '#EF4444' : '#DC2626',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                textTransform: 'none',
                letterSpacing: '0.02em',
                px: 2.5,
                py: 1.5,
                borderRadius: '8px',
                background: theme === 'dark' 
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme === 'dark' ? '#EF4444' : '#DC2626',
                  background: theme === 'dark' 
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(220, 38, 38, 0.05)'
                }
              }}
            >
              View Terms & Conditions
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AnalyticsIcon />}
              onClick={() => handleOpenDialog('riskAssessment')}
              sx={{
                borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                color: theme === 'dark' ? '#38BDF8' : '#2563EB',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                textTransform: 'none',
                letterSpacing: '0.02em',
                px: 2.5,
                py: 1.5,
                borderRadius: '8px',
                background: theme === 'dark' 
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme === 'dark' ? '#38BDF8' : '#2563EB',
                  background: theme === 'dark' 
                    ? 'rgba(56, 189, 248, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)'
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
          maxWidth="sm"
          sx={{ '& .MuiDialog-paper': { width: '90%' } }}
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
                : '0px 8px 24px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            borderBottom: theme === 'dark' 
              ? '1px solid rgba(71, 85, 105, 0.5)'
              : '1px solid rgba(226, 232, 240, 0.7)',
            padding: { xs: '12px 20px', sm: '16px 24px' }
          }}>
            {openDialog && dialogContent[openDialog].title}
          </DialogTitle>
          <DialogContent sx={{ padding: { xs: '16px 20px', sm: '20px 24px' } }}>
            {openDialog && dialogContent[openDialog].content}
          </DialogContent>
          <DialogActions sx={{
            padding: { xs: '12px 20px', sm: '16px 24px' },
            borderTop: theme === 'dark' 
              ? '1px solid rgba(71, 85, 105, 0.5)'
              : '1px solid rgba(226, 232, 240, 0.7)'
          }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                color: theme === 'dark' ? '#94A3B8' : '#64748B',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                px: 2.5,
                py: 1.5,
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

export default InvestordashboardInfoPanel;