import subscriptionSuccessEn from './subscription-success-en.html?raw';
import subscriptionSuccessVi from './subscription-success-vi.html?raw';

export type MailTemplate = {
  subject: string;
  html: string;
  from: {
    email: string;
    name: string;
  };
};

export const NO_REPLY_EMAIL = 'no-reply@sveltevietnam.dev';

export const EMAIL_TEMPLATES: Record<string, Record<'en' | 'vi', MailTemplate>> = {
  SUBSCRIPTION_SUCCESS: {
    vi: {
      subject: 'Cảm ơn bạn đã đăng kí tại Svelte Vietnam!',
      html: subscriptionSuccessVi,
      from: {
        email: NO_REPLY_EMAIL,
        name: 'Svelte Việt Nam',
      },
    },
    en: {
      subject: 'Thank you for subscribing to Svelte Vietnam!',
      html: subscriptionSuccessEn,
      from: {
        email: NO_REPLY_EMAIL,
        name: 'Svelte Vietnam',
      },
    },
  },
};
