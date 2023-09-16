import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'subscriptions';

export type Subscription = {
  email: string; // primary key
  name: string;
  job: boolean;
  event: boolean;
  created_at: string;
  updated_at: string;
};

export const SUBSCRIPTION_DOMAINS = ['job', 'event'] as const;
export type SubscriptionDomain = (typeof SUBSCRIPTION_DOMAINS)[number];

export function getSubscriptionByEmail(d1: D1Database, email: string) {
  return d1
    .prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?`)
    .bind(email)
    .first<Subscription>();
}

export function upsertSubscription<D extends SubscriptionDomain>(
  d1: D1Database,
  domain: D,
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
