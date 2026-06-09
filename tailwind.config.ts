import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f4ee",
        ink: "#292725",
        muted: "#726a61",
        line: "#ded6ca",
        sage: "#78866b",
        clay: "#b86f52",
        marine: "#31546b",
        butter: "#f0c76a"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(41, 39, 37, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
