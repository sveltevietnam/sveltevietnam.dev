/**
 * get page number from url
 * @param {URL} url
 * @param {number} [perPageFallback]
 * @returns {{ per: number; current: number }}
 */
export function getPaginationFromUrl(url, perPageFallback = 10) {
	let page = parseInt(url.searchParams.get('page') ?? '');
	if (Number.isNaN(page)) page = 1;

	let perPage = parseInt(url.searchParams.get('per_page') ?? '');
	if (Number.isNaN(perPage)) perPage = perPageFallback;

	return { per: perPage, current: page };
}
