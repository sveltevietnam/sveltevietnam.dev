/**
 * Attempt to determine the platform the code is running on,
 * return `server` if outside browser context
 * @returns {'server' | 'apple' | 'windows' | 'linux' | 'unknown'}
 */
export function platform() {
	if (!('window' in globalThis)) {
		return 'server';
	} else {
		let platform = /** @type {any} */ (window.navigator).userAgentData?.platform;
		if (!platform) platform = window.navigator.platform;
		platform = platform.toLowerCase();
		if (['mac', 'darwin', 'ios', 'iphone', 'ipad'].some((p) => platform.includes(p))) {
			return 'apple';
		} else if (platform.includes('win')) {
			return 'windows';
		} else if (platform.includes('linux')) {
			return 'linux';
		}
		return 'unknown';
	}
}
