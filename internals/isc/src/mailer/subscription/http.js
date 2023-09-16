import { createRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').SubscriptionRequestDTO>}
 */
export const createSubscriptionRequest = createRequestFactory('/subscribe');
