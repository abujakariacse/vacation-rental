/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  // add daisyUI plugin
  plugins: [require("daisyui")],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          primary: "#F43F5E",
          secondary: "#FD7792",
          accent: "#F3F4F7",
          neutral: "#272727",
          "base-100": "#ffffff",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
        }
      },
      {
        dark: {
          primary: "#F43F5E",
          secondary: "#FD7792",
          accent: "#0B1220",
          neutral: "#E5E7EB",
          "base-100": "#0F172A",
          "base-200": "#111827",
          "base-300": "#0B1220",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}