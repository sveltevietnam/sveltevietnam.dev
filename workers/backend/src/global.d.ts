declare global {
	namespace Queue {
		declare type MessageSendMail = {
			type: 'send-mail';
		};
		declare type Message = MessageSendMail;
	}

	interface Env {
		d1: import('@cloudflare/workers-types').D1Database;
		queue: import('@cloudflare/workers-types').Queue<Queue.Message>;
	}
}

export {};
