import recruitWranglerConfig from '../wrangler.json' with { type: 'json' };

export function getWranglerVars() {
	return recruitWranglerConfig.env.test.vars;
}

export function generateTimestampedEmail(): string {
	const timestamp = Date.now();
	return `e2e+${timestamp}@example.com`;
}
