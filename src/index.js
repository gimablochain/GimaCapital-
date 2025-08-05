// // src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Note the '/client' import for React 18
// import './index.css';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// // Remove React.StrictMode to prevent double rendering in development
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <App />
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './components/Auth';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

