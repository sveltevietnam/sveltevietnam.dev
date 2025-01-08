/**
 * get page number from url
 * @param {URL} url
 * @param {number} total
 */
export function getPageFromUrl(url, total) {
	let page = parseInt(url.searchParams.get("page") ?? '');
	if (Number.isNaN(page)) {
		page = 1;
	}
	if (page > total) {
		page = total;
	}

	return page;
}
