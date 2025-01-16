export default function () {
	const logo = document.getElementById('header-logo') as SVGElement | null;
	if (!logo) return;
	logo.style.overflow = 'visible';

	const hat = Array.from(logo.getElementsByClassName('hat'))[0] as SVGGElement | undefined;
	if (!hat) return;

	let clickCount = 0;
	const onClick = () => {
		clickCount++;
		if (clickCount === 12) {
			hat.style.transformOrigin = 'bottom left';
			logo.animate(
				[
					{
						transform: 'translate(-6px, -6px)',
					},
				],
				{
					duration: 500,
					fill: 'forwards',
				},
			);
			hat.animate(
				[
					{
						transform: 'rotate(-45deg)',
						opacity: 0,
					},
				],
				{
					duration: 500,
					fill: 'forwards',
				},
			);
			logo.style.cursor = 'pointer';
		} else if (clickCount > 12) {
			window.open('https://svelte.dev');
		}
	};
	logo.addEventListener('click', onClick);
}

