import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      rmTeal: '#01B4C6',
      rmLightBlue: '#BEE5FD',
      rmYellow: '#FFF874',
      rmGreen: '#97ce4c',
      rmPink: '#F675DA'
    }
  },
  plugins: [],
}

export default config;
