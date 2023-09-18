import { createRequestFactory } from '../../common/http.js';

/**
 * @type {import('../../common/types.js').CommonRequestFactory<import('./dto.js').SendRequestDTO>}
 */
export const createSendRequest = createRequestFactory('/send');
