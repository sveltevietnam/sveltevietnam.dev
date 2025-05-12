export const SUBSCRIPTION_DOMAINS = ['event', 'job', 'blog'] as const;
export type SubscriptionDomain = (typeof SUBSCRIPTION_DOMAINS)[number];

/*
 * 0b000
 *   ┆┆┆
 *   ┆┆└─── 0b001 = event
 *   ┆└──── 0b010 = job
 *   └───── 0b100 = blog
 */

const MASKS = {
	event: 0b001,
	job: 0b010,
	blog: 0b100,
};

/**
 * Converts a bitmask to an array of subscription domains.
 */
export function maskToDomains(mask: number): SubscriptionDomain[] {
	const domains: SubscriptionDomain[] = [];

	for (const [domain, domainMask] of Object.entries(MASKS)) {
		if (mask & domainMask) {
			domains.push(domain as SubscriptionDomain);
		}
	}

	return domains;
}

/**
 * Converts an array of subscription domains to a bitmask.
 */
export function domainsToMask(domains: SubscriptionDomain[]): number {
	let mask = 0;

	for (const domain of domains) {
		const domainMask = MASKS[domain];
		if (domainMask) {
			mask |= domainMask;
		}
	}

	return mask;
}

/**
 * Merges two bitmasks into one.
 */
export function mergeMasks(mask1: number, mask2: number): number {
	return mask1 | mask2;
}
