import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#003D32',
          50: '#E8F1EE',
          100: '#CBE1DA',
          200: '#9EC8BC',
          300: '#6BAA9C',
          400: '#3D887A',
          500: '#075548',
          600: '#064C41',
          700: '#003D32',
          800: '#002E26',
          900: '#001F1A',
        },
        cream: '#F4F1E7',
        warm: '#FAF9F4',
        sage: '#DDE6D5',
        mist: '#F5F5F1',
        ink: '#17231F',
        muted: '#66716B',
        line: '#E7E7DF',
        gold: '#D8B44A',
        sale: '#E56F73',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,35,31,0.04), 0 6px 20px rgba(23,35,31,0.06)',
        'card-hover': '0 4px 8px rgba(23,35,31,0.06), 0 16px 40px rgba(23,35,31,0.12)',
        drawer: '-12px 0 48px rgba(23,35,31,0.16)',
        soft: '0 2px 12px rgba(23,35,31,0.06)',
        badge: '0 2px 8px rgba(23,35,31,0.10)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(0,61,50,0.28)' },
          '100%': { boxShadow: '0 0 0 12px rgba(0,61,50,0)' },
        },
        grow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
        fadeIn: 'fadeIn 0.3s ease-out both',
        slideInRight: 'slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) both',
        slideInLeft: 'slideInLeft 0.32s cubic-bezier(0.22,1,0.36,1) both',
        scaleIn: 'scaleIn 0.24s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
        toastIn: 'toastIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 36s linear infinite',
        pulseRing: 'pulseRing 1.6s ease-out infinite',
        'progress-fill': 'grow 6s linear forwards',
      },
      maxWidth: {
        shell: '1360px',
      },
    },
  },
  plugins: [],
};

export default config;
