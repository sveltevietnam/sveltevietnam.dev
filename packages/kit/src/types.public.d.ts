import {
	IncomingRequestCfProperties,
	ExecutionContext,
	CacheStorage,
	Cache,
} from '@cloudflare/workers-types';
import type { Language } from '@sveltevietnam/i18n';
import type { Thing } from 'schema-dts';

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

export type PageMetadata = {
	title?: string;
	description?: string;
	keywords?: string;
	canonical?: string;
	structured?: Thing[] | Thing; // Structured Data LD+JSON
	og?: {
		title?: string;
		site_name?: string;
		description?: string;
		type?: 'website' | 'article' | 'profile';
		image?: string;
		imageAlt?: string;
		url?: string;
	};
	twitter?: {
		title?: string;
		description?: string;
		card?: string;
		image?: string;
		imageAlt?: string;
		site?: string;
		creator?: string;
	};
};
