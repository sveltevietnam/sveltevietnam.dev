import type { D1Database } from '@cloudflare/workers-types';
import type { SubscriptionDomain } from '@internals/isc/mailer';

const TABLE_NAME = 'subscriptions';

export type DomainSubscription = {
  job: boolean;
  event: boolean;
  blog: boolean;
};

export type Subscription = DomainSubscription & {
  email: string; // primary key
  name: string;
  created_at: string;
  updated_at: string;
};

export function getSubscriptionByEmail(d1: D1Database, email: string) {
  return d1
    .prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?`)
    .bind(email)
    .first<Subscription>();
}

export function upsertSubscription(
  d1: D1Database,
  domain: SubscriptionDomain,
  subscription: Pick<Subscription, 'email' | 'name'>,
) {
  return d1
    .prepare(
      `
      INSERT INTO
        ${TABLE_NAME} (email,name,${domain},created_at)
      VALUES(?1,?2,1,?3)
      ON CONFLICT (email) DO UPDATE SET
        name=?2,
        ${domain}=1,
        updated_at=?3
    `,
    )
    .bind(subscription.email, subscription.name, new Date().toISOString())
    .run();
}

export function updateDomainSubscription(
  d1: D1Database,
  email: string,
  subscription: DomainSubscription,
) {
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
