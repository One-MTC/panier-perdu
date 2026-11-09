import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marine: "#12263F",
        moutarde: "#F4C20D",
        papier: "#F7F7F4",
        gris: "#5B6572",
      },
      fontFamily: {
        titre: ["var(--font-titre)", "system-ui", "sans-serif"],
        texte: ["var(--font-texte)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
