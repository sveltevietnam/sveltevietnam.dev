import type { Component } from 'svelte';

import type { PageMetadata as Metadata } from '@sveltevietnam/kit';

export interface PageMetadataProps {
	/** current site ISO language code */
	lang: string;
	/** site origin */
	origin: string;
	/** page-specific data  */
	metadata?: Metadata;
	/** fallback data */
	defaults?: Omit<Metadata, 'paths'>;
	/** site/app version, usually contain git hash of build commit */
	version?: string;
	/** add BreadcrumbList structured dgs if provided */
	breadcrumbs?: { path: string; name: string }[];
}

/** Headless component for setting up page metadata head tags */
export const PageMetadata: Component<PageMetadataProps>;
