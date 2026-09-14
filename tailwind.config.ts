import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        evi: {
          deep: '#18283a',
          navy: '#1f334a',
          petrol: '#2b425b',
          accent: '#728699',
          silver: '#b8c7d6',
          'silver-bright': '#e2e8f0',
          'silver-glow': '#cbd5e1',
          soft: '#f1f4f6',
          light: '#f8fafc',
          card: '#ffffff',
          border: '#dde4ec',
          text: '#1a2332',
          'text-light': '#52657a',
          'text-muted': '#7c90a6',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'evi-card': '0 4px 20px rgba(24, 40, 58, 0.06)',
        'evi-hover': '0 12px 32px rgba(24, 40, 58, 0.12)',
        'evi-glow': '0 0 25px rgba(184, 199, 214, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
