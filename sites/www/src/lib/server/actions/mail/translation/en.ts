import type { vi } from './vi';

export const en = {
  name: 'Name',
  cta: 'Notify me',
  validation: {
    error: {
      email: {
        required: 'Email is required',
        invalid: 'Email is invalid',
      },
      name: {
        required: 'Name is required',
        invalid: 'Name is invalid',
      },
      captcha: {
        required: 'Cloudflare turnstile response is required',
        unknown: 'Unknown cloudflare turnstile error',
      },
    },
    success: 'Registered successfully',
  },
} satisfies typeof vi;
