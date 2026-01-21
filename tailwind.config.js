/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Putt Tempo カラーパレット（mockデザイン準拠）
        primary: '#2a73ea',
        'primary-light': '#3b82f6',
        
        // 背景・サーフェス
        background: {
          DEFAULT: '#050505',
          light: '#f5f5f5',
        },
        surface: {
          DEFAULT: '#121212',
          dark: '#161616',
          lighter: '#222222',
          card: '#1A1A1A',
        },
        
        // ボーダー
        border: {
          DEFAULT: '#2d343d',
          dark: '#1f1f1f',
          light: '#333333',
        },
        
        // プレミアム・アクセント
        premium: '#F59E0B',
        'premium-gold': '#F59E0B',
        'accent-gold': '#F59E0B',
        
        // テキスト
        text: {
          DEFAULT: '#ffffff',
          muted: '#888888',
          hint: '#666666',
        },
        
        // フィードバック
        success: '#22c55e',
        error: '#ef4444',
        warning: '#F59E0B',
        info: '#2a73ea',
      },
      fontFamily: {
        display: ['Manrope', 'Noto Sans JP', 'sans-serif'],
        sans: ['Noto Sans JP', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
