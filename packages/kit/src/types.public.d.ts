import {
	IncomingRequestCfProperties,
	ExecutionContext,
	CacheStorage,
	Cache,
} from '@cloudflare/workers-types';
import type { Language } from '@sveltevietnam/i18n';

import type { ColorScheme, SplashOption } from './constants';

export interface AppLocals {
	internalReferer?: URL;
	language: Language;
	colorScheme: ColorScheme;
	splash: SplashOption;
}

export interface AppPlatform {
	cf?: IncomingRequestCfProperties;
	context?: ExecutionContext;
	caches?: CacheStorage & { default: Cache };
}
