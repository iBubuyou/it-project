/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'text': '2px 2px 4px rgba(0, 0, 0, 0.7)', // เงาตัวอักษร
      },
      textShadow: {
        // เพิ่มการตั้งค่าสำหรับเงาตัวอักษร
        'md': '3px 3px 5px rgba(0, 0, 0, 0.9)', // เงากลางที่เข้มขึ้น
        'lg': '5px 5px 10px rgba(0, 0, 0, 0.9)', // เงาขนาดใหญ่ที่เข้มขึ้น
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
