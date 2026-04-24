/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === DEFAULT: BLACK + GREEN THEME ===
        'brand-green': {
          DEFAULT: '#00FF00',    // bright green (primary)
          dark: '#00CC00',      // hover/active
          light: '#80FF80',     // light variant
        },
        'brand-gold': {
          DEFAULT: '#FFD700',    // gold (primary - toggled)
          dark: '#B38600',      // deep gold
          light: '#F5C200',     // light gold
        },
        // Backgrounds
        'bg-dark': '#000000',      // pure black (main bg)
        'bg-surface': '#0A0A0A',   // surface cards
        'bg-elevated': '#1A1A1A', // elevated panels
        'bg-border': '#243050',    // borders (from Betfox navy.700)
        // Text
        'text-primary': 'rgba(255, 255, 255, 0.88)',
        'text-secondary': 'rgba(255, 255, 255, 0.60)',
        'text-muted': '#999999',
        // Semantic
        'live': '#00FF00',         // green for live indicator
        'live-alt': '#FF6A00',     // orange for live badge (from spec)
        'win': '#10B981',          // emerald for wins
        'loss': '#DC2626',        // red for losses
        'warning': '#FFC107',
        'error': '#DC2626',
        'success': '#10B981',
      },
      fontFamily: {
        'body': ['Inter', 'sans-serif'],
        'display': ['Oswald', 'sans-serif'],
        'mono': ['tabular-nums', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-gentle': 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 0, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'xl': '0.5rem',
        '2xl': '1rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        'header': '100',
        'drawer': '200',
        'modal': '300',
        'tooltip': '400',
      },
    },
  },
  plugins: [],
}
