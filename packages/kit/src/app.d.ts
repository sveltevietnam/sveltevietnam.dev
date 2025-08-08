import { AppLocals, AppPlatform } from './types.public';

declare global {
	namespace App {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Locals extends AppLocals {}

		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Platform extends AppPlatform {}
	}
}

export {};
