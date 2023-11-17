import { createSignedGetRequestFactory, createSignedRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonGetRequestFactory<true>}
 */
export const createGetSubscriptionRequest = createSignedGetRequestFactory('/subscriptions', {
	token: true,
});

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').CreateSubscriptionRequestDTO>}
 */
export const createSubscriptionRequest = createSignedRequestFactory('/subscriptions');

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').UpdateDomainSubscriptionRequestDTO, true>}
 */
export const createUpdateDomainSubscriptionRequest = createSignedRequestFactory('/subscriptions', {
	method: 'PATCH',
	token: true,
});
