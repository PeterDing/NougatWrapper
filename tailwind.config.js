/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],

  // Dynamically change className
  // https://itnext.io/tailwind-bundle-and-dynamic-class-names-2f1725ba590e
  safelist: [
    // for components/settings.tsx
    { pattern: /(bg|text|ring|border)-\w+-\d+/, variants: ["focus"] },
  ],
};
