export const SUBSCRIPTION_CHANNELS = ['event', 'job', 'blog'] as const;
export type SubscriptionChannel = (typeof SUBSCRIPTION_CHANNELS)[number];

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
 * Converts a bitmask to an array of subscription channels.
 */
export function maskToChannels(mask: number): SubscriptionChannel[] {
	const channels: SubscriptionChannel[] = [];

	for (const [channel, channelMask] of Object.entries(MASKS)) {
		if (mask & channelMask) {
			channels.push(channel as SubscriptionChannel);
		}
	}

	return channels;
}

/**
 * Converts an array of subscription channels to a bitmask.
 */
export function channelsToMask(channels: SubscriptionChannel[]): number {
	let mask = 0;

	for (const channel of channels) {
		const channelMask = MASKS[channel];
		if (channelMask) {
			mask |= channelMask;
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
