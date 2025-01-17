function stamp() {
	document.documentElement.setAttribute('data-splashed-at', new Date().toISOString());
}

const splashEl = document.getElementById('splash');
if (!splashEl || splashEl.getAttribute('data-splash-skip') === 'true') {
	stamp();
} else {
	splashEl.addEventListener('animationend', (e) => {
		if (!splashEl.isSameNode(/** @type {Node} */ (e.target))) return;
		stamp();
	});
}
