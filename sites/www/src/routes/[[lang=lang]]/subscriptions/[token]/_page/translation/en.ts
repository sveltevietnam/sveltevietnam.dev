export const en = {
  title: 'Your Subscription Preferences',
  form: {
    emails: {
      description: 'Select the emails you want to receive',
      job: 'Receive emails about frontend and Svelte jobs',
      event: 'Receive emails about Svelte Vietnam events',
    },
    submit: 'Update my preferences',
  },
  errors: {
    unknown: 'An error has occurred. Please try again later!',
  },
  success: 'Updated successfully. Thank you!',
} satisfies typeof import('./vi').vi;
