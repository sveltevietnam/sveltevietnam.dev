<script lang="ts">
	let { children, class: cls, ...rest }: import('.').TBAProps = $props();
</script>

<div
	class={[
		'border-onehalf bg-surface drop-shadow-brutal relative space-y-2 border-current px-10 py-6',
		cls,
	]}
	{...rest}
>
	<svg
		class="-translate-1/2 absolute left-0 top-0 h-7 w-7"
		width="28"
		height="28"
		viewBox="0 0 28 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0.5 0.500001L27.5 0.5V27.5L0.5 27.5L0.5 0.500001Z"
			fill="var(--color-primary)"
			stroke="currentcolor"
		/>
	</svg>
	<svg
		class="absolute right-0 top-0 h-8 w-8 -translate-y-1/2 translate-x-1/2"
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="16" cy="16" r="15.5" fill="var(--color-secondary)" stroke="currentcolor" />
	</svg>
	<svg
		class="translate-1/2 absolute bottom-0 right-0 h-7 w-8"
		width="32"
		height="28"
		viewBox="0 0 32 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0.86159 27.5L16 1.00778L31.1384 27.5H0.86159Z"
			fill="var(--color-tertiary)"
			stroke="currentcolor"
		/>
	</svg>

	{@render children?.()}
</div>
