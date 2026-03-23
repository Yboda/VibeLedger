/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // VibeLedger 테마 색상들
      colors: {
        navy: '#1e293b',
        coral: '#F97354',
        yellow: '#FBBF24',
        slate: '#64748b',
        'slate-light': '#f1f5f9',
      },
    },
  },
  plugins: [],
  // Tailwind CSS v4 호환성
  corePlugins: {
    preflight: false,
  },
}
