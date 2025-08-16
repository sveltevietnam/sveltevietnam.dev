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
	/** LD+JSON structured data */
	structured?: Thing[] | Thing;
	paths?: {
		default: string;
		alternate: Record<string, string>;
	};
	og?: {
		type?: 'website' | 'article' | 'profile';
		title?: string;
		description?: string;
		siteName?: string;
		url?: string;
		locale?: {
			current?: string;
			alternate?: string[];
		};
		image?: {
			src?: string;
			alt?: string;
			width?: number;
			height?: number;
			type?: string;
		};
	};
	twitter?: {
		title?: string;
		description?: string;
		card?: string;
		image?: {
			src?: string;
			alt?: string;
		};
		site?: string;
		creator?: string;
	};
};
