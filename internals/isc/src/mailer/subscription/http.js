import { createSignedRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').CreateSubscriptionRequestDTO>}
 */
export const createSubscriptionRequest = createSignedRequestFactory('/subscription');

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').UpdateDomainSubscriptionRequestDTO, true>}
 */
export const createUpdateDomainSubscriptionRequest = createSignedRequestFactory('/subscription', {
  method: 'PATCH',
  token: true,
});
