// // src/components/Logout.js
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// const Logout = ({ onLogout }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const performLogout = async () => {
//       try {
//         await signOut(auth);
//         localStorage.removeItem('authToken');
//         if (onLogout) onLogout();
//         navigate('/login');
//       } catch (error) {
//         console.error('Logout error:', error);
//       }
//     };
    
//     performLogout();
//   }, [navigate, onLogout]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
//         <p className="text-lg font-medium">Signing out...</p>
//       </div>
//     </div>
//   );
// };

// export default Logout;

import { auth } from '../firebase'; // Verify path
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Logout.js: auth:', auth); // Debug
    const performLogout = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem('authToken');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('is_manager');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    performLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-lg font-medium">Signing out...</p>
      </div>
    </div>
  );
};

export default Logout;