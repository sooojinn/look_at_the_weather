export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'weather-light-gradient': 'linear-gradient(118.17deg, #F5AF16 -4.95%, #FFEA73 101.98%)',
        'weather-normal-gradient': 'linear-gradient(118.17deg, #29ACFF -4.95%, #BAE1FA 101.98%)',
        'weather-dark-gradient': 'linear-gradient(118.17deg, #0E3363 -4.95%, #4484D9 101.98%)',
        'weather-error-gradient': 'linear-gradient(120.34deg, #063F80 -4.79%, #130B59 43.81%, #390F5F 90.11%)',
      },
      colors: {
        black: '#000000',
        lightBlack: '#171719',
        darkGray: '#47484c',
        gray: '#858588',
        lightGray: '#c7c8c9',
        white: '#ffffff',
        disabled: '#dfdfe0',

        background: {
          white: '#FFFFFF',
          light: '#f7f7f8',
          gray: 'rgb(243 244 246)',
        },
        interactive: {
          default: '#989ba2',
          disabled: '#f4f4f5',
        },
        status: {
          success: '#00bf40',
          warning: '#ff9200',
          error: '#ff4242',
        },
        dimmer: {
          bg: 'rgba(23, 23, 25, 0.52)', // 171719 with 52% opacity
        },
        line: {
          lightest: '#f4f4f5',
          lighter: '#e8e8ea',
          light: '#e0e0e2',
          black: '#171719',
        },
        primary: {
          main: '#1769ff',
          logo: '#000000',
        },
      },
      fontSize: {
        xs: '12px',
        s: '13px',
        m: '14px',
        l: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
      },
      fontWeight: {
        regular: '400',
        bold: '700',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  mode: 'jit',
  plugins: [require('tailwind-scrollbar-hide')],
};
