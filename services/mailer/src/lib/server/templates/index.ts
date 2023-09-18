import subscriptionSuccess from './subscription-success.html?raw';

// TODO: support i18n (en & vi)

export type MailTemplate = {
  subject: string;
  html: string;
  from: {
    email: string;
    name: string;
  };
};

export const NO_REPLY_EMAIL = 'no-reply@sveltevietnam.dev';

export const EMAIL_TEMPLATES: Record<string, MailTemplate> = {
  SUBSCRIPTION_SUCCESS: {
    subject: 'Thank you for subscribing to Svelte Vietnam!',
    html: subscriptionSuccess,
    from: {
      email: NO_REPLY_EMAIL,
      name: 'Svelte Vietnam',
    },
  },
};
