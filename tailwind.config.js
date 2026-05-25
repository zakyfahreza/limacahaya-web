/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: {
          DEFAULT: '#0F3D2E',
          light: '#1a5c45',
          dark: '#082618',
          50: '#f0f9f4',
          100: '#dcf0e5',
          200: '#bce0cc',
          300: '#8bc8aa',
          400: '#57ab82',
          500: '#348f65',
          600: '#257350',
          700: '#1e5c41',
          800: '#1a4a35',
          900: '#0F3D2E',
          950: '#082618',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          100: '#111827',
          200: '#1f2937',
          300: '#374151',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-emerald': 'linear-gradient(135deg, #0F3D2E 0%, #10B981 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F3D2E 0%, #1a5c45 50%, #082618 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(15,61,46,0.8) 0%, rgba(16,185,129,0.1) 100%)',
      },
      boxShadow: {
        'emerald': '0 0 40px rgba(16,185,129,0.2)',
        'emerald-lg': '0 0 60px rgba(16,185,129,0.3)',
        'card': '0 20px 60px rgba(0,0,0,0.15)',
        'card-hover': '0 30px 80px rgba(0,0,0,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
