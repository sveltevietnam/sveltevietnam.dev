import type { Reroute } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';
import { getLangFromUrl } from '@sveltevietnam/i18n/utils';

import { createReroute } from '$data/routes/generated/reroute';

export const reroute: Reroute = createReroute((event) => getLangFromUrl(event.url, LANGUAGES));
