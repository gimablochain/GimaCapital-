
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};









// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   darkMode: 'class', // Ensures dark mode is toggled via class (e.g., 'dark' on documentElement)
//   theme: {
//     extend: {
//       colors: {
//         // Light theme colors
//         light: {
//           background: '#F9FAFB', // Light grayish-white background
//           text: '#1F2937',       // Dark gray text
//           primary: '#3B82F6',    // Blue for buttons, links, etc.
//           secondary: '#6B7280',  // Gray for secondary elements
//           accent: '#10B981',     // Green for highlights
//         },
//         // Dark theme colors
//         dark: {
//           background: '#1F2937', // Dark gray background
//           text: '#D1D5DB',       // Light gray text
//           primary: '#2DD4BF',    // Teal for buttons, links, etc.
//           secondary: '#9CA3AF',  // Gray for secondary elements
//           accent: '#34D399',     // Lighter green for highlights
//         },
//       },
//     },
//   },
//   plugins: [],
// };