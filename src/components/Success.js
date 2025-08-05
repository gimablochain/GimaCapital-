import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        const response = await fetch('http://localhost:5000/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ sessionId })
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        const data = await response.json();
        console.log('Payment verified:', data);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/dashboard/deposit', { state: { error: 'Payment verification failed' } });
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      navigate('/dashboard');
    }
  }, [navigate, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">Thank you for your deposit.</p>
      <p className="text-gray-500">You will be redirected to your dashboard shortly.</p>
    </div>
  );
}

export default Success;




// {
//   "name": "buildmoney",
//   "version": "0.1.0",
//   "private": true,
//   "dependencies": {
//     "@emotion/react": "^11.14.0",
//     "@emotion/styled": "^11.14.0",
//     "@mui/icons-material": "^6.4.0",
//     "@mui/material": "^6.3.0",
//     "@stripe/stripe-js": "^7.3.1",
//     "@testing-library/react": "^13.4.0",
//     "axios": "^1.7.9",
//     "cra-template": "1.2.0",
//     "firebase": "^11.8.1",
//     "framer-motion": "^12.12.1",
//     "lucide-react": "^0.511.0",
//     "react": "^18.3.1",
//     "react-dom": "^18.3.1",
//     "react-firebase-hooks": "^5.1.1",
//     "react-icons": "^5.4.0",
//     "react-router-dom": "^7.1.1",
//     "react-scripts": "^5.0.1",
//     "web-vitals": "^4.2.4"
//   },
//   "scripts": {
//     "start": "react-scripts start",
//     "build": "react-scripts build",
//     "test": "react-scripts test",
//     "eject": "react-scripts eject"
//   },
//   "eslintConfig": {
//     "extends": [
//       "react-app",
//       "react-app/jest"
//     ]
//   },
//   "browserslist": {
//     "production": [
//       ">0.2%",
//       "not dead",
//       "not op_mini all"
//     ],
//     "development": [
//       "last 1 chrome version",
//       "last 1 firefox version",
//       "last 1 safari version"
//     ]
//   },
//   "devDependencies": {
//     "autoprefixer": "^10.4.20",
//     "eslint": "^8.57.1",
//     "postcss": "^8.4.49",
//     "tailwindcss": "^3.4.17"
//   }
// }