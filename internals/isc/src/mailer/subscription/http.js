import { createRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').CreateSubscriptionRequestDTO>}
 */
export const createSubscriptionRequest = createRequestFactory('/subscription');
