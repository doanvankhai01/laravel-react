const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],
  safelist: [{ pattern: /col-span-/, variants: ['sm'] }],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
      serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1280px',
    },
    extend: {
      colors: {
        primary: 'oklab(var(--p)/<alpha-value>)',
        'primary-content': 'oklab(var(--pc)/<alpha-value>)',
        secondary: 'oklab(var(--s)/<alpha-value>)',
        'secondary-content': 'oklab(var(--sc)/<alpha-value>)',

        'base-100': 'oklab(var(--b1)/<alpha-value>)',
        'base-200': 'oklab(var(--b2)/<alpha-value>)',
        'base-300': 'oklab(var(--b3)/<alpha-value>)',
        'base-content': 'oklab(var(--bc)/<alpha-value>)',

        info: 'oklab(var(--in)/<alpha-value>)',
        'info-content': 'oklab(var(--inc)/<alpha-value>)',

        success: 'oklab(var(--su)/<alpha-value>)',
        'success-content': 'oklab(var(--suc)/<alpha-value>)',

        warning: 'oklab(var(--wa)/<alpha-value>)',
        'warning-content': 'oklab(var(--wac)/<alpha-value>)',

        error: 'oklab(var(--er)/<alpha-value>)',
        'error-content': 'oklab(var(--erc)/<alpha-value>)',
      },
      fontSize: {
        xs: ['.6875rem', '.9375rem'],
        sm: ['.8125rem', '1.1875rem'],
      },
      keyframes: {
        shine: {
          '100%': { left: '125%' },
        },
        burgerHover: {
          '0%': { width: '100%' },
          '50%': { width: '50%' },
          '100%': { width: '100%' },
        },
        introXAnimation: {
          to: {
            opacity: '1',
            transform: 'translateX(0px)',
          },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        shine: 'shine 0.8s',
        'intro-x-animation': 'introXAnimation .4s ease-in-out forwards .33333s',
        'burger-hover-2': 'burgerHover 1s infinite ease-in-out alternate forwards 200ms',
        'burger-hover-4': 'burgerHover 1s infinite ease-in-out alternate forwards 400ms',
        'burger-hover-6': 'burgerHover 1s infinite ease-in-out alternate forwards 600ms',
        'caret-blink': 'caret-blink 1.2s ease-out infinite',
      },
    },
  },
};
