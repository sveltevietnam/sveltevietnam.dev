<script lang="ts">
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import dark from '@sveltevietnam/kit/assets/images/logos/monotone-dark.base64?raw';
	import { SOCIAL_LINKS } from '@sveltevietnam/kit/constants';
</script>

<main
	class="max-w-pad desktop:py-20 min-h-dvh space-y-10 overflow-auto py-10 text-left text-2xl
	leading-normal text-white"
>
	<h1>:)</h1>
	<p>
		Oh nice. You have reached the "Blue Screen of Death". The application is absolutely fine; as is
		your computer. We are definitely, 100%, not collecting any personal information (~_^).
	</p>
	<p>As with anything, try turning it off and on again.</p>
	<div class="flex items-center gap-6">
		<a
			class="contents"
			href={SOCIAL_LINKS.DISCORD} data-external
			data-umami-event="click-social-link"
			data-umami-event-source="discord"
			data-umami-event-position="pages.bsod"
		>
			<QR
				class="h-32 w-32"
				data={SOCIAL_LINKS.DISCORD}
				logo={dark}
				shape="circle"
				width="128"
				height="128"
			/>
		</a>
		<div class="space-y-2 text-base">
			<p>While you are at it, join our discord for fun, yeah?</p>
			<p class="text-xs">(We won't be able to fix YOUR error anyway)</p>
		</div>
	</div>
</main>

<style lang="postcss">
	main {
		background-color: #0078d7;
	}

	h1 {
		font-size: 5rem;
	}
</style>
