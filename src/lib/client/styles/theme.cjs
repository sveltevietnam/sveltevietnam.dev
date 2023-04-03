/** @type {import('tailwindcss').Config['theme']} */
const theme = {
  extend: {
    screens: {
      pc: {
        // desktop
        min: '1024px',
      },
      tb: {
        // tablet
        min: '768px',
      },
      sp: {
        // smart phone
        max: '767px',
      },
    },
    fontSize: {
      '2xs': '0.625rem',
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      lora: ['Lora', 'serif'],
    },
    spacing: {
      header: 'var(--header-height)',
    },
    colors: {
      status: {
        info: '#3ABFF8',
        success: '#36D399',
        warning: '#FBBD23',
        error: '#F87272',
      },
      grayscale: {
        light: {
          100: '#ffffff',
          200: '#E5E5E5',
          300: '#999999',
          400: '#4C4C4C',
        },
        dark: {
          100: '#1C1C1C',
          200: '#585757',
          300: '#969696',
          400: '#E8E8E8',
        },
      },
      fg: {
        100: 'var(--color-fg-100)',
        200: 'var(--color-fg-200)',
        300: 'var(--color-fg-300)',
        400: 'var(--color-fg-400)',
      },
      bg: {
        100: 'var(--color-bg-100)',
        200: 'var(--color-bg-200)',
        300: 'var(--color-bg-300)',
        400: 'var(--color-bg-400)',
      },
      primary: '#ef4623',
      svelte: '#ef4623',
      // FIXME temporary, refactor once there is a consistent color palette
      design: {
        link: 'var(--color-link)',
        border: {
          1: 'var(--color-border-1)',
        },
        fg: {
          1: 'var(--color-fg-1)',
        },
        bg: {
          1: 'var(--color-bg-1)',
          2: 'var(--color-bg-2)',
        },
        neutral: {
          1: 'var(--color-neutral-1)',
          2: 'var(--color-neutral-2)',
        },
      },
    },
    zIndex: {
      px: '1',
      header: '50', // root header
      modal: '80', // a modal/dialog
      // sidebar: '92', // sidebar
      // float: '100', // floating buttons and such
      popup: '120', // tooltip, dropdown, popover etc
      overlay: '150', // a full screen overlay
      // command: '200', // command palette
      // notification: '300', // notification
    },
  },
};

module.exports = { theme };
