declare global {
	declare module '*.mjml' {
		const html: string;
		export default html;
	}

	namespace Queue {
		declare type MessageSendMail<T extends import('$/mjml/templates').TemplateId> = {
			type: 'send-mail';
			input: import('$/data/mails').SendMailInput<T>;
		};
		declare type Message = MessageSendMail<import('$/mjml/templates').TemplateId>;
	}

	interface Env {
		// environment variables
		MODE: string;
		ORIGIN: string;
		SITE_URL: string;
		RECRUIT_URL: string;
		AWS_REGION: string;

		// Cloudflare bindings
		r2: import('@cloudflare/workers-types').R2Bucket;
		d1: import('@cloudflare/workers-types').D1Database;
		queue: import('@cloudflare/workers-types').Queue<Queue.Message>;
		kv_mails: import('@cloudflare/workers-types').KVNamespace;
		secret_jwt: import('@cloudflare/workers-types').SecretsStoreSecret;
		secret_ses_access_key: import('@cloudflare/workers-types').SecretsStoreSecret;
		secret_ses_access_secret: import('@cloudflare/workers-types').SecretsStoreSecret;
		secret_recruit_better_auth: import('@cloudflare/workers-types').SecretsStoreSecret;
	}
}

export {};
