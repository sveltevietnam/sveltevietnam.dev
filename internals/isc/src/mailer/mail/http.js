import { createSignedRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').SendRequestDTO>}
 */
export const createSendRequest = createSignedRequestFactory('/send');
