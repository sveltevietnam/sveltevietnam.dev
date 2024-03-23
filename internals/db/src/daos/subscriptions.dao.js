const TABLE_NAME = 'subscriptions';

/** @typedef {'job' | 'event' | 'blog'} SubscriptionDomain */

/** @typedef {Record<SubscriptionDomain, boolean>} DomainSubscription */
/** @typedef {DomainSubscription & {
 *  email: string;
 *  name: string;
 *  created_at: string;
 *  updated_at: string;
 * }} Subscription
 */

/**
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} email
 * @returns {Promise<Subscription | null>}
 */
export function getSubscriptionByEmail(d1, email) {
	return d1.prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?`).bind(email).first();
}

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {Pick<Subscription, 'email' | 'name'>} subscription
 * @param {SubscriptionDomain} [domain]
 * @returns {Promise<import('@cloudflare/workers-types').D1Response>}
 */
export function upsertSubscription(d1, subscription, domain) {
	return d1
		.prepare(
			domain
				? `
				INSERT INTO
					${TABLE_NAME} (email,name,${domain},created_at)
				VALUES(?1,?2,1,?3)
				ON CONFLICT (email) DO UPDATE SET
					name=?2,
					${domain}=1,
					updated_at=?3
			`
				: `
				INSERT INTO
					${TABLE_NAME} (email,name,created_at)
				VALUES(?1,?2,?3)
				ON CONFLICT (email) DO UPDATE SET
					name=?2,
					updated_at=?3
			`,
		)
		.bind(subscription.email, subscription.name, new Date().toISOString())
		.run();
}

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} email
 * @param {DomainSubscription} subscription
 * @returns {Promise<import('@cloudflare/workers-types').D1Response>}
 */
export function updateDomainSubscription(d1, email, subscription) {
	return d1
		.prepare(
			`
    UPDATE subscriptions
        SET event = ?1,
            job = ?2,
            blog = ?3,
            updated_at = ?4
        WHERE email = ?5
    `,
		)
		.bind(
			/* ?1 */ Number(subscription.event),
			/* ?2 */ Number(subscription.job),
			/* ?3 */ Number(subscription.blog),
			/* ?4 */ new Date().toISOString(),
			/* ?5 */ email,
		)
		.run();
}
