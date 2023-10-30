/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          700: "#00438B",
          500: "#3082D4",
          300: "#60A5FA",
          200: "#89C8FF",
          100: "#FFF1E6",
          DEFAULT: "#3082D4",
          foreground: "hsl(var(--primary-foreground))",
        },
        dark: {
          100: "#000000",
          200: "#0F1117",
          300: "#151821",
          400: "#212734",
          500: "#101012",
        },
        light: {
          900: "#FFFFFF",
          800: "#F4F6F8",
          850: "#FDFDFD",
          700: "#DCE3F1",
          500: "#7B8EC8",
          400: "#858EAD",
        },
        "accent-blue": "#1DA1F2",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        fontFamily: {
          inter: ["var(--font-inter)"],
          spaceGrotesk: ["var(--font-spaceGrotesk)"],
          roboto: ["var(--font-roboto)"],
        },
        boxShadow: {
          "light-100":
            "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
          "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
          "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
          "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
          "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
        },
        backgroundImage: {
          "auth-dark": "url('/assets/images/auth-dark.png')",
          "auth-light": "url('/assets/images/auth-light.png')",
        },
        screens: {
          xs: "420px",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
