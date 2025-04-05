<script lang="ts">
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';

	let {
		class: cls,
		...rest
	}: HTMLAttributes<HTMLElement> = $props();
</script>

<div
	class={[
		'bg-surface border-onehalf shadow-brutal-lg tablet:grid-cols-2 grid grid-cols-1 gap-6 border-current p-6',
		'tablet:p-8 tablet:gap-8',
		'desktop:p-10 desktop:gap-10',
		cls,
	]}
	{...rest}
>
	<div class="space-y-6">
		<p class="c-text-heading-md"><T message={m['components.blog_newsletter.heading']} /></p>
		<p><T message={m['components.blog_newsletter.desc']} /></p>
		<svg
			class="text-surface-variant h-22.5 desktop:h-31.25 w-auto max-w-full"
			width="295"
			height="90"
			viewBox="0 0 295 90"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M45.524 0.376465C54.4185 0.376465 63.1129 2.98635 70.5077 7.87605C77.903 12.7658 83.6672 19.7157 87.0704 27.8471C90.4742 35.9784 91.3646 44.9259 89.6297 53.558C87.8943 62.1901 83.6114 70.1191 77.3224 76.3429C71.0334 82.5662 63.0208 86.8044 54.2971 88.5216C45.5739 90.2384 36.5322 89.3574 28.3151 85.9891C20.098 82.6209 13.0747 76.9174 8.1334 69.5993C3.1921 62.2813 0.554688 53.6777 0.554688 44.8765H45.524V0.376465Z"
				fill="currentcolor"
			/>
			<path
				d="M143.558 89.3766C143.558 83.4158 142.371 77.5133 140.066 72.0064C137.761 66.4996 134.382 61.496 130.123 57.2809C125.864 53.0663 120.807 49.7226 115.242 47.4416C109.677 45.1605 103.712 43.9866 97.6887 43.9866V89.3766H143.558Z"
				fill="currentcolor"
			/>
			<path
				d="M222.704 18.1765H150.753V89.3765H186.728V53.7765H222.704V18.1765Z"
				fill="currentcolor"
			/>
			<path d="M294.775 53.7764H258.8V89.3764H294.775V53.7764Z" fill="currentcolor" />
			<path d="M223.603 89.3764H243.39L223.603 57.3364V89.3764Z" fill="currentcolor" />
			<path d="M221.805 57.3364L202.018 89.3764H221.805V57.3364Z" fill="currentcolor" />
		</svg>
	</div>

	<form class="space-y-6">
		<div class="space-y-4">
			<div class="space-y-1">
				<label class="c-text-body-sm block" for="name">
					<T message={m['forms.name']} />:
				</label>
				<input
					class="c-text-input w-full"
					type="text"
					name="name"
					id="name"
					placeholder="Văn Vũ / Phương Phạm / ..."
				/>
			</div>
			<div class="space-y-1">
				<label class="c-text-body-sm block" for="email">Email:</label>
				<input
					class="c-text-input w-full"
					type="email"
					name="email"
					id="email"
					placeholder="email@example.com"
				/>
			</div>
			<div class="space-y-1">
				<p class="c-text-body-sm"><T message={m['forms.turnstile.desc']} />:</p>
				<div
					class="turnstile"
					use:turnstile
					turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
					turnstile-size="flexible"
				>
					<!-- injected by @svelte-put/cloudflare-turnstile -->
				</div>
			</div>
		</div>
		<button class="c-btn c-btn--pop px-4" type="submit">
			<span><T message={m['forms.register']} /></span>
		</button>
	</form>
</div>
