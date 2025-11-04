/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#d4dbf9',  // Example custom color
         customblue :"#698aed",
         custombluq :"#556ee6",
      },
      screens: {
        'sm': '320px',    // Set small screen breakpoint at 500px
        'md': '750px',    // Set medium screen breakpoint at 750px
        'lg': '1024px',   // Set large screen breakpoint at 1024px
        'xl': '1400px',   // Custom extra-large breakpoint at 1400px
        '2xl': '2560px'   // Custom 2X large breakpoint at 1600px
      },
    },
  },
  plugins: [],
}

