
// // src/App.js
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { auth } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import LandingPage from './components/LandingPage';
// // import Auth from './components/Auth';
// import { Auth } from './components/Auth';
// import Dashboard from './components/Dashboard';
// import Logout from './components/Logout';
// import './App.css';


// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={setUser} />} />
//         <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={setUser} />} />
//         <Route path="/dashboard/*" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
//         <Route path="/logout" element={<Logout onLogout={() => setUser(null)} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;




// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './components/Auth';
// import LandingPage from './components/LandingPage';
// import AboutUs from './components/AboutUs';
// import Pricing from './components/Pricing';
// import Contact from './components/Contact';
// import GimaLiveStats from './components/GimaLiveStats';
// import ValuationOverview from './components/ValuationOverview';
// import InvestmentStructure from './components/InvestmentStructure';
// import InvestmentPaymentSystem from './components/InvestmentPaymentSystem';
// import { Auth } from './components/Auth';
// import Dashboard from './components/Dashboard';
// import Logout from './components/Logout';
// import RefreshPage from './components/RefreshPage';
// import PAMMTradePanel from './components/PAMM/PAMMTradePanel';
// import './App.css';
// import 'antd/dist/reset.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {
//   const { currentUser, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
//         <div className="text-lg font-medium ml-4">loading...</div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/pricing" element={<Pricing />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/ValuationOverview" element={<ValuationOverview />} /> {/* Explicitly included Platform route */}
//         <Route path="/investment-structure" element={<InvestmentStructure />} />
//          <Route path="/Investment/Payment/System/Processing" element={<InvestmentPaymentSystem />} />
//         <Route path="/gima-live-stats" element={<GimaLiveStats />} />
//         <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} />
//         <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} />
//         <Route path="/dashboard/*" element={currentUser ? <Dashboard user={currentUser} /> : <Navigate to="/login" />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/dashboard/information/refreshthepage" element={<RefreshPage />} />
//         <Route path="/dashboard/trade" element={currentUser ? <PAMMTradePanel userId={currentUser.uid} theme="light" /> : <Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;





import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/Auth';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import GimaLiveStats from './components/GimaLiveStats';
import ValuationOverview from './components/ValuationOverview';
import EquityStructure from './components/EquityStructure';
import InvestorLogin from './components/InvestorLogin';
import InvestorDashboard from './components/InvestorDashboard';
import InvestmentPaymentSystem from './components/InvestmentPaymentSystem';
import { Auth } from './components/Auth';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import RefreshPage from './components/RefreshPage';
import PAMMTradePanel from './components/PAMM/PAMMTradePanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'antd/dist/reset.css';
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again.</h1>;
    }
    return this.props.children;
  }
}

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <div className="text-lg font-medium ml-4">loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ValuationOverview" element={<ValuationOverview />} />
        <Route path="/Equity-structure" element={<EquityStructure />} />
        <Route path="/investor-login" element={<InvestorLogin />} />
        <Route path="/Investor-Dashboard" element={<InvestorDashboard />} />
        <Route
          path="/Investment/Payment/System/Processing"
          element={
            <ErrorBoundary>
              <InvestmentPaymentSystem />
            </ErrorBoundary>
          }
        />
        <Route path="/gima-live-stats" element={<GimaLiveStats />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard/*" element={currentUser ? <Dashboard user={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard/information/refreshthepage" element={<RefreshPage />} />
        <Route path="/dashboard/trade" element={currentUser ? <PAMMTradePanel userId={currentUser.uid} theme="light" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;