declare global {
	declare module '*.mjml' {
		const html: string;
		export default html;
	}

	declare interface ImportMetaEnv {
		readonly VITE_BACKEND_URL: string;
		readonly VITE_SITE_URL: string;
		readonly VITE_AWS_REGION: string;
	}

	namespace Queue {
		declare type MessageSendMail<T extends import('$/mjml/templates').TemplateId> = {
			type: 'send-mail';
			input: import('$/data/mails').SendMailInput<T>;
		};
		declare type Message = MessageSendMail<import('$/mjml/templates').TemplateId>;
	}

	interface Env {
		d1: import('@cloudflare/workers-types').D1Database;
		queue: import('@cloudflare/workers-types').Queue<Queue.Message>;
		kv_mails: import('@cloudflare/workers-types').KVNamespace;
		secret_jwt: import('@cloudflare/workers-types').SecretsStoreSecret;
		secret_ses_access_key: import('@cloudflare/workers-types').SecretsStoreSecret;
		secret_ses_access_secret: import('@cloudflare/workers-types').SecretsStoreSecret;
	}
}

export {};
