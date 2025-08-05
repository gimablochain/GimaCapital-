// import React, { useState } from 'react';
// import { CheckCircle, XCircle, Database, Loader2, Play } from 'lucide-react';

// const Test = () => {
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [documentId, setDocumentId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const testFirebaseConnection = async () => {
//     setIsLoading(true);
//     try {
//       // Simulating axios call - replace with your actual endpoint
//       const response = await fetch('http://10.2.0.2:5000/test-firebase');
//       const data = await response.json();
      
//       if (!response.ok) throw new Error(data.message || 'Connection failed');
      
//       setResult(data);
//       setDocumentId(data.document_id);
//       setError(null);
//     } catch (err) {
//       setError(err.message || 'An error occurred');
//       setResult(null);
//       setDocumentId(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
//             <Database className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
//             Firebase Connection Test
//           </h1>
//           <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//             Test your Firebase connection and validate database operations with real-time feedback
//           </p>
//         </div>

//         {/* Test Button */}
//         <div className="flex justify-center mb-8">
//           <button
//             onClick={testFirebaseConnection}
//             disabled={isLoading}
//             className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg"
//           >
//             <div className="flex items-center space-x-3">
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//               )}
//               <span>{isLoading ? 'Testing Connection...' : 'Run Connection Test'}</span>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
//           </button>
//         </div>

//         {/* Results Section */}
//         <div className="space-y-6">
//           {/* Success Result */}
//           {result && (
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
//               <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="w-6 h-6 text-white" />
//                   <h2 className="text-xl font-semibold text-white">Connection Successful</h2>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 {documentId && (
//                   <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Database className="w-5 h-5 text-green-600" />
//                       <span className="font-semibold text-green-800">Document Created</span>
//                     </div>
//                     <p className="text-green-700 font-mono text-sm bg-white/50 px-3 py-2 rounded-lg">
//                       ID: {documentId}
//                     </p>
//                   </div>
//                 )}
                
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
//                     <span>Response Data</span>
//                   </h3>
//                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
//                     <pre className="text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
//                       {JSON.stringify(result, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Result */}
//           {error && (
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
//               <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
//                 <div className="flex items-center space-x-3">
//                   <XCircle className="w-6 h-6 text-white" />
//                   <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-slate-800">Error Details</h3>
//                   <div className="bg-red-50 rounded-xl p-4 border border-red-200">
//                     <pre className="text-sm text-red-700 overflow-x-auto whitespace-pre-wrap font-mono">
//                       {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Status Indicators */}
//         {(result || error || isLoading) && (
//           <div className="mt-8 flex justify-center">
//             <div className="flex items-center space-x-4 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
//               <div className={`w-3 h-3 rounded-full ${
//                 isLoading ? 'bg-yellow-400 animate-pulse' :
//                 result ? 'bg-green-400' : 
//                 error ? 'bg-red-400' : 'bg-gray-300'
//               }`}></div>
//               <span className="text-sm font-medium text-slate-700">
//                 {isLoading ? 'Testing...' : 
//                  result ? 'Connected' : 
//                  error ? 'Failed' : 'Ready'}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Test;




// import React, { useState } from 'react';
// import { CheckCircle, XCircle, Database, Loader2, Play } from 'lucide-react';

// const Test = () => {
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [documentId, setDocumentId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const testFirebaseConnection = async () => {
//     setIsLoading(true);
//     try {
//       // Simulating axios call - replace with your actual endpoint
//       const response = await fetch('http://10.2.0.2:5000/test-firebase');
//       const data = await response.json();
      
//       if (!response.ok) throw new Error(data.message || 'Connection failed');
      
//       setResult(data);
//       setDocumentId(data.document_id);
//       setError(null);
//     } catch (err) {
//       setError(err.message || 'An error occurred');
//       setResult(null);
//       setDocumentId(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
//       <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 to-transparent rounded-full blur-3xl"></div>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
      
//       <div className="max-w-4xl mx-auto relative z-10">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
//             <Database className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 mb-4">
//             Network Connection Test
//           </h1>
//           <p className="text-gray-300 text-lg max-w-2xl mx-auto">
//             Test your connection and validate your data operations with real-time feedback
//           </p>
//         </div>

//         {/* Test Button */}
//         <div className="flex justify-center mb-8">
//           <button
//             onClick={testFirebaseConnection}
//             disabled={isLoading}
//             className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg overflow-hidden"
//           >
//             {/* Animated button background */}
//             <div 
//               className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-pulse"
//               style={{
//                 animation: isLoading ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
//               }}
//             />
            
//             <div className="flex items-center space-x-3 relative z-10">
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//               )}
//               <span>{isLoading ? 'Testing Connection...' : 'Run Connection Test'}</span>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
//           </button>
//         </div>

//         {/* Results Section */}
//         <div className="space-y-6">
//           {/* Success Result */}
//           {result && (
//             <div className="backdrop-blur-xl bg-gradient-to-br from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.2)] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
//               <div className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 backdrop-blur-sm px-6 py-4 border-b border-[rgba(255,255,255,0.1)]">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle className="w-6 h-6 text-white" />
//                   <h2 className="text-xl font-semibold text-white">Connection Successful</h2>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 {documentId && (
//                   <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 backdrop-blur-sm">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Database className="w-5 h-5 text-green-400" />
//                       <span className="font-semibold text-green-300">Document Created</span>
//                     </div>
//                     <p className="text-green-200 font-mono text-sm bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.1)]">
//                       ID: {documentId}
//                     </p>
//                   </div>
//                 )}
                
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-gray-200 flex items-center space-x-2">
//                     <span>Response Data</span>
//                   </h3>
//                   <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-xl p-4 border border-[rgba(255,255,255,0.1)]">
//                     <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono">
//                       {JSON.stringify(result, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Result */}
//           {error && (
//             <div className="backdrop-blur-xl bg-gradient-to-br from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.2)] rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
//               <div className="bg-gradient-to-r from-red-500/80 to-rose-500/80 backdrop-blur-sm px-6 py-4 border-b border-[rgba(255,255,255,0.1)]">
//                 <div className="flex items-center space-x-3">
//                   <XCircle className="w-6 h-6 text-white" />
//                   <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 <div className="space-y-3">
//                   <h3 className="font-semibold text-gray-200">Error Details</h3>
//                   <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-400/20">
//                     <pre className="text-sm text-red-300 overflow-x-auto whitespace-pre-wrap font-mono">
//                       {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Status Indicators */}
//         {(result || error || isLoading) && (
//           <div className="mt-8 flex justify-center">
//             <div className="flex items-center space-x-4 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
//               <div className={`w-3 h-3 rounded-full ${
//                 isLoading ? 'bg-cyan-400 animate-pulse' :
//                 result ? 'bg-green-400' : 
//                 error ? 'bg-red-400' : 'bg-gray-400'
//               }`}></div>
//               <span className="text-sm font-medium text-gray-300">
//                 {isLoading ? 'Testing...' : 
//                  result ? 'Connected' : 
//                  error ? 'Failed' : 'Ready'}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Test;





import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Database, Loader2, Play } from 'lucide-react';

const Test = ({ isDarkMode = true }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Theme styles configuration
  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      textPrimary: 'text-gray-300',
      textSecondary: 'text-gray-400',
      textAccent: 'text-cyan-300',
      cardBg: 'bg-gradient-to-br from-white/[0.12] to-white/[0.04]',
      cardBorder: 'border-white/20',
      buttonPrimary: 'bg-gradient-to-r from-cyan-600 to-blue-600',
      buttonHover: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      successBg: 'bg-gradient-to-r from-green-500/80 to-emerald-500/80',
      successBorder: 'border-green-400/20',
      successText: 'text-green-300',
      errorBg: 'bg-gradient-to-r from-red-500/80 to-rose-500/80',
      errorBorder: 'border-red-400/20',
      errorText: 'text-red-300',
      statusBg: 'bg-gradient-to-r from-white/[0.1] to-white/[0.05]',
      statusBorder: 'border-white/20',
      shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
    },
    light: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textAccent: 'text-cyan-600',
      cardBg: 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
      cardBorder: 'border-gray-200',
      buttonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      buttonHover: 'bg-gradient-to-r from-cyan-300 to-blue-400',
      successBg: 'bg-gradient-to-r from-green-400/80 to-emerald-400/80',
      successBorder: 'border-green-300/20',
      successText: 'text-green-600',
      errorBg: 'bg-gradient-to-r from-red-400/80 to-rose-400/80',
      errorBorder: 'border-red-300/20',
      errorText: 'text-red-600',
      statusBg: 'bg-gradient-to-r from-gray-100/10 to-gray-50/10',
      statusBorder: 'border-gray-200/20',
      shadow: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
    }
  };

  // Map isDarkMode to theme key
  const themeKey = isDarkMode ? 'dark' : 'light';
  const currentTheme = themeStyles[themeKey] || themeStyles.dark;

  // Debug theme prop
  useEffect(() => {
    console.log("Test component isDarkMode:", isDarkMode);
  }, [isDarkMode]);

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    try {
      // Simulating axios call - replace with your actual endpoint
      const response = await fetch('http://10.2.0.2:5000/test-firebase');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Connection failed');
      
      setResult(data);
      setDocumentId(data.document_id);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setResult(null);
      setDocumentId(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} p-6 relative overflow-hidden transition-colors duration-300`}>
      {/* Animated background elements */}
      <div className={`absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isDarkMode ? 'from-cyan-500/20 to-transparent' : 'from-cyan-200/20 to-transparent'} rounded-full blur-3xl`}></div>
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isDarkMode ? 'from-indigo-600/20 to-transparent' : 'from-indigo-200/20 to-transparent'} rounded-full blur-3xl`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isDarkMode ? 'from-blue-500/10 to-transparent' : 'from-blue-200/10 to-transparent'} rounded-full blur-2xl`}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${currentTheme.buttonPrimary} rounded-2xl mb-6 shadow-lg`}>
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold ${currentTheme.textAccent} bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-white to-cyan-200' : 'from-gray-800 to-cyan-600'} mb-4`}>
            Network Connection Test
          </h1>
          <p className={`${currentTheme.textPrimary} text-lg max-w-2xl mx-auto`}>
            Test your connection and validate your data operations with real-time feedback
          </p>
        </div>

        {/* Test Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={testFirebaseConnection}
            disabled={isLoading}
            className={`group relative px-8 py-4 ${currentTheme.buttonPrimary} text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg overflow-hidden`}
          >
            <div 
              className={`absolute inset-0 ${currentTheme.buttonHover} animate-pulse ${isLoading ? '' : 'opacity-0 group-hover:opacity-100'}`}
              style={{ animation: isLoading ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}
            />
            <div className="flex items-center space-x-3 relative z-10">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
              <span>{isLoading ? 'Testing Connection...' : 'Run Connection Test'}</span>
            </div>
            <div className={`absolute inset-0 ${currentTheme.buttonHover} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Success Result */}
          {result && (
            <div className={`backdrop-blur-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl ${currentTheme.shadow} overflow-hidden animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`${currentTheme.successBg} backdrop-blur-sm px-6 py-4 border-b ${currentTheme.successBorder}`}>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Connection Successful</h2>
                </div>
              </div>
              <div className="p-6">
                {documentId && (
                  <div className={`mb-6 p-4 bg-gradient-to-r ${isDarkMode ? 'from-green-500/10 to-emerald-500/10' : 'from-green-400/10 to-emerald-400/10'} rounded-xl border ${currentTheme.successBorder} backdrop-blur-sm`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className={`w-5 h-5 ${currentTheme.successText}`} />
                      <span className={`font-semibold ${currentTheme.successText}`}>Document Created</span>
                    </div>
                    <p className={`${currentTheme.successText} font-mono text-sm bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg border ${currentTheme.cardBorder}`}>
                      ID: {documentId}
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className={`font-semibold ${currentTheme.textSecondary} flex items-center space-x-2`}>
                    <span>Response Data</span>
                  </h3>
                  <div className={`${currentTheme.cardBg} backdrop-blur-sm rounded-xl p-4 border ${currentTheme.cardBorder}`}>
                    <pre className={`text-sm ${currentTheme.textPrimary} overflow-x-auto whitespace-pre-wrap font-mono`}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Result */}
          {error && (
            <div className={`backdrop-blur-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl ${currentTheme.shadow} overflow-hidden animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`${currentTheme.errorBg} backdrop-blur-sm px-6 py-4 border-b ${currentTheme.errorBorder}`}>
                <div className="flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <h3 className={`font-semibold ${currentTheme.textSecondary}`}>Error Details</h3>
                  <div className={`bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border ${currentTheme.errorBorder}`}>
                    <pre className={`text-sm ${currentTheme.errorText} overflow-x-auto whitespace-pre-wrap font-mono`}>
                      {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {(result || error || isLoading) && (
          <div className="mt-8 flex justify-center">
            <div className={`flex items-center space-x-4 px-6 py-3 backdrop-blur-xl ${currentTheme.statusBg} border ${currentTheme.statusBorder} rounded-full ${currentTheme.shadow}`}>
              <div className={`w-3 h-3 rounded-full ${
                isLoading ? 'bg-cyan-400 animate-pulse' :
                result ? 'bg-green-400' : 
                error ? 'bg-red-400' : 'bg-gray-400'
              }`}></div>
              <span className={`text-sm font-medium ${currentTheme.textPrimary}`}>
                {isLoading ? 'Testing...' : 
                 result ? 'Connected' : 
                 error ? 'Failed' : 'Ready'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;