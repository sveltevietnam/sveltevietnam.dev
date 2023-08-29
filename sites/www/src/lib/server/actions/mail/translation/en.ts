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
      unknown: 'An error has occurred. Please try again later!',
      dbNotAvailable: 'Connection to database is not available. Please try again later!',
    },
    alreadyRegister: 'You have already registered. Thank you!',
    success: 'Registered successfully. Thank you!',
  },
} satisfies typeof import('./vi').vi;
