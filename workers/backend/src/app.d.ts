declare global {
	declare module '*.mjml' {
		const html: string;
		export default html;
	}

	namespace Queue {
		declare type MessageSendMail<T extends import('./mjml/templates').TemplateId> = {
			type: 'send-mail';
			templateId: T;
			input: import('./data/mails').SendMailInput<T>;
		};
		declare type Message = MessageSendMail<import('./mjml/templates').TemplateId>;
	}

	// environment variables
	interface Env {
		/** 'development' | 'test' | 'production' */
		MODE: string;
		/** whether this environment runs on local machine or deployed to the cloud  */
		LOCAL: boolean;
		/** in seconds */
		MAIL_TOKEN_TTL: number;
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
	}
}

export {};
