const TABLE_NAME = 'isc_clients';

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} clientId
 * @returns {Promise<string | undefined>}
 */
export async function getSecretFromClientId(d1, clientId) {
	/**
	 * @type {{ secret: string } | null}
	 */
	const result = await d1
		.prepare(`SELECT secret FROM ${TABLE_NAME} WHERE id = ?`)
		.bind(clientId)
		.first();
	return result?.secret;
}
