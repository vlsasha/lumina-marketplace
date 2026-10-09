/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vana-primary': '#4141FC',
        'vana-primary-light': '#8B8BFE',
        'vana-dark': '#0C0C10',
        'vana-card': '#141418',
        'vana-card-hover': '#1C1C22',
        'vana-border': 'rgba(255,255,255,0.07)',
        'vana-border-hover': 'rgba(255,255,255,0.15)',
        'vana-text': 'rgba(240,240,250,1)',
        'vana-text-secondary': 'rgba(240,240,250,0.6)',
        'vana-text-muted': 'rgba(240,240,250,0.35)',
        'vana-green': '#22C55E',
        'vana-amber': '#F59E0B',
        'vana-red': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'D-DIN', 'Arial', 'Verdana', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(65,65,252,0.2), 0 0 20px rgba(65,65,252,0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(65,65,252,0.4), 0 0 40px rgba(65,65,252,0.2)' },
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
