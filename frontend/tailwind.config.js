/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand: deep indigo ink + warm marigold accent (NovaMarket identity)
        ink: {
          50: '#F1F2F8',
          100: '#DFE1EF',
          200: '#B8BCDD',
          300: '#8B90C2',
          400: '#565C9C',
          500: '#323875',
          600: '#242A5C',
          700: '#1D2B53',
          800: '#161C3E',
          900: '#12131A',
          950: '#0B0C11',
        },
        marigold: {
          50: '#FEF7EC',
          100: '#FDEBCB',
          200: '#FBD592',
          300: '#F7BE5E',
          400: '#F2A93B',
          500: '#E38F1C',
          600: '#C06F14',
          700: '#985215',
          800: '#7A4118',
          900: '#653818',
        },
        canvas: {
          light: '#F5F6FA',
          dark: '#0F1016',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#171923',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 19, 26, 0.06), 0 8px 24px -8px rgba(18, 19, 26, 0.12)',
        'card-hover': '0 4px 12px rgba(18, 19, 26, 0.08), 0 16px 40px -12px rgba(18, 19, 26, 0.22)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        slideUp: 'slideUp 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        pop: 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
