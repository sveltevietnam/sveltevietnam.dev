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
    notImplemented: 'Feature will be implemented soon. Please come back later!',
    success: 'Registered successfully. Thank you!',
  },
} satisfies typeof vi;
