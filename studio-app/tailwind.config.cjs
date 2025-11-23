module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F3D6D8',
        'primary-600': '#E7BFC1',
        nude: '#E9DCCF'
      },
      fontFamily: {
        serifLogo: ['Playfair Display', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
