/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leo: {
          black: '#0A0A0A',
          charcoal: '#181818',
          dark: '#141414',
          card: '#1F1F1F',
          border: '#E8E5DF',
          borderDark: '#2C2C2C',
          cream: '#FAF9F5',
          warmWhite: '#F7F5F0',
          sand: '#EAE6DF',
          taupe: '#C5B9AC',
          champagne: '#C5A880',
          champagneLight: '#E8DCB8',
          muted: '#767676',
          mutedLight: '#A3A3A3',
        },
        velora: {
          black: '#0A0A0A',
          charcoal: '#181818',
          dark: '#141414',
          card: '#1F1F1F',
          border: '#E8E5DF',
          borderDark: '#2C2C2C',
          cream: '#FAF9F5',
          warmWhite: '#F7F5F0',
          sand: '#EAE6DF',
          taupe: '#C5B9AC',
          champagne: '#C5A880',
          champagneLight: '#E8DCB8',
          muted: '#767676',
          mutedLight: '#A3A3A3',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'widest-plus': '0.35em',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
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
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
