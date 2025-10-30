import type { Reroute } from '@sveltejs/kit';
import { getLangFromUrl } from '@sveltevietnam/i18n/utils';
import { LANGUAGES } from '@sveltevietnam/kit/constants';

import { createReroute } from '$data/routes/generated/reroute';

export const reroute: Reroute = createReroute((event) => getLangFromUrl(event.url, LANGUAGES));
