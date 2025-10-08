import recruitWranglerConfig from '../wrangler.json' with { type: 'json' };

export function getWranglerVars() {
	return recruitWranglerConfig.env.test.vars;
}
