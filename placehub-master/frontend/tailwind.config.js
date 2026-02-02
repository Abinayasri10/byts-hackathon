/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep Navy - Great for text or headers
        primary: '#071952', 
        // Deep Teal - Perfect for buttons and primary actions
        secondary: '#088395',
        // Bright Cyan/Teal - Ideal for highlights or icons
        accent: '#37B7C3',
        // Soft Ice Blue - Best for backgrounds and sections
        background: '#EBF4F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}