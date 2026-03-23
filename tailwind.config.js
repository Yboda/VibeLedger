/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 반응형 breakpoints (Tailwind 기본값과 동일, 명시적 선언)
    screens: {
      sm: '640px', // 모바일 가로
      md: '768px', // 태블릿
      lg: '1024px', // 라틐🥕 데스크탑
      xl: '1280px', // 데스크탑
      '2xl': '1536px', // 와이드스크린
    },
    extend: {
      colors: {
        // VibeLedger 브랜드 코어 컴러
        brand: {
          coral: '#F97354',
          'coral-light': '#FDBA74',
          yellow: '#FBBF24',
          'yellow-light': '#FEF3C7',
          navy: '#1e293b',
          'navy-light': '#334155',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      zIndex: {
        above: '10',
        dropdown: '100',
        sticky: '200',
        overlay: '300',
        modal: '400',
        notification: '500',
        tooltip: '600',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        float: '0 8px 30px rgb(0 0 0 / 0.12)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};
