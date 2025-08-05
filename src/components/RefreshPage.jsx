// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Container, Typography, Box, Alert } from '@mui/material';

// const RefreshPage = () => {
//   const navigate = useNavigate();
//   const [stage, setStage] = useState(localStorage.getItem('hasRefreshed') ? 'postRefresh' : 'initial');
//   const [countdown, setCountdown] = useState(5); // Countdown for initial and tokenExpired stages

//   // Handle timed messages and refresh
//   useEffect(() => {
//     console.log('RefreshPage useEffect: stage=', stage, 'hasRefreshed=', localStorage.getItem('hasRefreshed'));
//     const hasRefreshed = localStorage.getItem('hasRefreshed');
//     if (hasRefreshed && stage !== 'postRefresh') {
//       console.log('Instantly setting stage to postRefresh');
//       setStage('postRefresh');
//       localStorage.removeItem('hasRefreshed'); // Clear for next session
//       return;
//     }

//     if (!hasRefreshed && stage !== 'postRefresh') {
//       if (stage === 'initial') {
//         const interval = setInterval(() => {
//           setCountdown((prev) => {
//             if (prev <= 1) {
//               setStage('tokenExpired');
//               setCountdown(4);
//               return 4;
//             }
//             return prev - 1;
//           });
//         }, 1000);
//         return () => {
//           console.log('Clearing initial interval');
//           clearInterval(interval);
//         };
//       } else if (stage === 'tokenExpired') {
//         const interval = setInterval(() => {
//           setCountdown((prev) => {
//             if (prev <= 1) {
//               console.log('Triggering page reload');
//               localStorage.setItem('hasRefreshed', 'true');
//               window.location.reload();
//               return 0;
//             }
//             return prev - 1;
//           });
//         }, 1000);
//         const timer = setTimeout(() => {
//           console.log('Triggering page reload (timeout)');
//           localStorage.setItem('hasRefreshed', 'true');
//           window.location.reload();
//         }, 4000);
//         return () => {
//           console.log('Clearing tokenExpired timers');
//           clearInterval(interval);
//           clearTimeout(timer);
//         };
//       }
//     }
//   }, [stage]);

//   // Unified message for all stages
//   const getMessage = () => {
//     if (stage === 'initial') {
//       return {
//         message: 'Please wait while we investigate the cause of the issue.',
//         severity: 'info',
//       };
//     } else if (stage === 'tokenExpired') {
//       return {
//         message: 'The issue was caused by an expired session token. Please wait while we reset your session and token.',
//         severity: 'warning',
//       };
//     } else if (stage === 'postRefresh') {
//       return {
//         message: 'Your session has been reset. Click "Return to Dashboard" to sign in and resume your activities, or "Go to Landing Page" to explore the application.',
//         severity: 'info',
//       };
//     }
//     return {
//       message: 'An unexpected error occurred. Please try again or contact support.',
//       severity: 'error',
//     };
//   };

//   const { message, severity } = getMessage();

//   const handleGoToDashboard = () => {
//     console.log('Navigating to /dashboard');
//     navigate('/dashboard');
//   };

//   const handleGoToLanding = () => {
//     console.log('Navigating to /');
//     navigate('/');
//   };

//   return (
//     <Container
//       maxWidth="md"
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         textAlign: 'center',
//         py: 4,
//       }}
//     >
//       <Box sx={{ maxWidth: 600 }}>
//         <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
//           Session Expired
//         </Typography>
//         <Alert severity={severity} sx={{ mb: 3, textAlign: 'center' }}>
//           {message}
//         </Alert>
//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           {stage === 'initial' && `Please wait ${countdown} second${countdown !== 1 ? 's' : ''} while we diagnose the issue.`}
//           {stage === 'tokenExpired' && `Please wait ${countdown} second${countdown !== 1 ? 's' : ''} while we reset your session.`}
//           {stage === 'postRefresh' && 'Please choose an option below to proceed.'}
//         </Typography>
//         {stage === 'postRefresh' && (
//           <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleGoToDashboard}
//               size="large"
//               sx={{ py: 1.5 }}
//             >
//               Return to Dashboard
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleGoToLanding}
//               size="large"
//               sx={{ py: 1.5 }}
//             >
//               Go to Landing Page
//             </Button>
//           </Box>
//         )}
//         <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
//           If the issue persists, please contact support at <a href="mailto:support@yourapp.com">support@yourapp.com</a>.
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default RefreshPage;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert,
  Paper,
  CircularProgress,
  Chip,
  useTheme
} from '@mui/material';
import { 
  RefreshRounded, 
  DashboardRounded, 
  HomeRounded, 
  AccessTimeRounded,
  SecurityRounded,
  CheckCircleRounded
} from '@mui/icons-material';

const RefreshPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stage, setStage] = useState(localStorage.getItem('hasRefreshed') ? 'postRefresh' : 'initial');
  const [countdown, setCountdown] = useState(5);

  // Handle timed messages and refresh
  useEffect(() => {
    console.log('RefreshPage useEffect: stage=', stage, 'hasRefreshed=', localStorage.getItem('hasRefreshed'));
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    if (hasRefreshed && stage !== 'postRefresh') {
      console.log('Instantly setting stage to postRefresh');
      setStage('postRefresh');
      localStorage.removeItem('hasRefreshed');
      return;
    }

    if (!hasRefreshed && stage !== 'postRefresh') {
      if (stage === 'initial') {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setStage('tokenExpired');
              setCountdown(4);
              return 4;
            }
            return prev - 1;
          });
        }, 1000);
        return () => {
          console.log('Clearing initial interval');
          clearInterval(interval);
        };
      } else if (stage === 'tokenExpired') {
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              console.log('Triggering page reload');
              localStorage.setItem('hasRefreshed', 'true');
              window.location.reload();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        const timer = setTimeout(() => {
          console.log('Triggering page reload (timeout)');
          localStorage.setItem('hasRefreshed', 'true');
          window.location.reload();
        }, 4000);
        return () => {
          console.log('Clearing tokenExpired timers');
          clearInterval(interval);
          clearTimeout(timer);
        };
      }
    }
  }, [stage]);

  // Get stage-specific content
  const getStageContent = () => {
    switch (stage) {
      case 'initial':
        return {
          icon: <RefreshRounded sx={{ fontSize: '4rem', color: '#3B82F6' }} />,
          title: 'Investigating Issue',
          message: 'Please wait while we investigate the cause of the issue.',
          severity: 'info',
          statusColor: '#3B82F6',
          statusText: 'Diagnosing',
          showProgress: true
        };
      case 'tokenExpired':
        return {
          icon: <SecurityRounded sx={{ fontSize: '4rem', color: '#F59E0B' }} />,
          title: 'Session Expired',
          message: 'The issue was caused by an expired session token. Please wait while we reset your session and token.',
          severity: 'warning',
          statusColor: '#F59E0B',
          statusText: 'Resetting Session',
          showProgress: true
        };
      case 'postRefresh':
        return {
          icon: <CheckCircleRounded sx={{ fontSize: '4rem', color: '#10B981' }} />,
          title: 'Session Reset Complete',
          message: 'Your session has been reset. Click "Return to Dashboard" to sign in and resume your activities, or "Go to Landing Page" to explore the application.',
          severity: 'success',
          statusColor: '#10B981',
          statusText: 'Ready',
          showProgress: false
        };
      default:
        return {
          icon: <RefreshRounded sx={{ fontSize: '4rem', color: '#EF4444' }} />,
          title: 'Unexpected Error',
          message: 'An unexpected error occurred. Please try again or contact support.',
          severity: 'error',
          statusColor: '#EF4444',
          statusText: 'Error',
          showProgress: false
        };
    }
  };

  const { icon, title, message, severity, statusColor, statusText, showProgress } = getStageContent();

  const handleGoToDashboard = () => {
    console.log('Navigating to /dashboard with refresh');
    localStorage.setItem('forceDashboardRefresh', 'true'); // Flag to trigger refresh
    navigate('/dashboard');
    // Use a slight delay to ensure navigation happens before reload
    setTimeout(() => {
      if (window.location.pathname === '/dashboard') {
        window.location.reload();
      }
    }, 100);
  };

  const handleGoToLanding = () => {
    console.log('Navigating to /');
    navigate('/');
  };

  // Optional: Detect dashboard navigation to clear the flag
  useEffect(() => {
    if (window.location.pathname === '/dashboard' && localStorage.getItem('forceDashboardRefresh')) {
      localStorage.removeItem('forceDashboardRefresh');
    }
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          p: { xs: 3, sm: 4 },
          mx: 'auto',
        }}
      >
          {/* Status Chip */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip
              icon={showProgress ? <CircularProgress size={12} sx={{ color: '#FFFFFF' }} /> : null}
              label={statusText}
              size="small"
              sx={{
                background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}CC 100%)`,
                color: '#FFFFFF',
                fontWeight: 600,
                px: 1.5,
                fontSize: '0.8rem',
                borderRadius: '8px',
                '& .MuiChip-icon': {
                  color: '#FFFFFF',
                  ml: 0.5,
                }
              }}
            />
          </Box>

          {/* Main Icon */}
          <Box sx={{ mb: 2 }}>
            {React.cloneElement(icon, { sx: { fontSize: '2.5rem', color: statusColor } })}
          </Box>

          {/* Title */}
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? '#F8FAFC' : '#0F172A',
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* Alert Message */}
          <Alert 
            severity={severity} 
            sx={{ 
              mb: 2,
              borderRadius: '8px',
              fontSize: '0.9rem',
              '& .MuiAlert-icon': {
                fontSize: '1.2rem',
              },
              '& .MuiAlert-message': {
                fontSize: '0.9rem',
                lineHeight: 1.4,
              }
            }}
          >
            {message}
          </Alert>

          {/* Countdown Display */}
          {(stage === 'initial' || stage === 'tokenExpired') && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#CBD5E1' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  fontSize: '0.9rem',
                }}
              >
                <AccessTimeRounded sx={{ fontSize: '1rem' }} />
                {stage === 'initial' && `Diagnosing in ${countdown}s`}
                {stage === 'tokenExpired' && `Resetting in ${countdown}s`}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          {stage === 'postRefresh' && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="contained"
                  onClick={handleGoToDashboard}
                  startIcon={<DashboardRounded />}
                  sx={{
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Return to Dashboard
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleGoToLanding}
                  startIcon={<HomeRounded />}
                  sx={{
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#F8FAFC' : '#475569',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(248, 250, 252, 0.3)' : 'rgba(71, 85, 105, 0.3)',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? '#F8FAFC' : '#475569',
                      background: theme.palette.mode === 'dark' ? 'rgba(248, 250, 252, 0.1)' : 'rgba(71, 85, 105, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Go to Landing Page
                </Button>
              </Box>
            </Box>
          )}

          {/* Support Contact */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B',
              fontSize: '0.8rem',
              display: 'block',
              '& a': {
                color: theme.palette.mode === 'dark' ? '#38BDF8' : '#3B82F6',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                }
              }
            }}
          >
            If the issue persists, contact{' '}
            <a href="mailto:support@yourapp.com">support@yourapp.com</a>
          </Typography>
      </Paper>
    </Container>
  );
};

export default RefreshPage;