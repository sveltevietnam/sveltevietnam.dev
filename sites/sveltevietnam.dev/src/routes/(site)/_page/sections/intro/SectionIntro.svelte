<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
</script>

<section class="max-w-pad -mt-header tablet:py-50 desktop:py-70 relative py-40">
	<div class="tablet:space-y-15 desktop:space-y-20 space-y-10">
		<h1 class="relative mx-auto w-fit">
			<svg
				class="z-1 h-26 tablet:h-50 desktop:h-75 relative mx-auto w-auto"
				inline-src="./images/title"
			></svg>
			<span class="sr-only"><T message={m['pages.home.intro.heading']} /></span>

			<!-- absolute ornaments -->
			<svg
				class="tablet:-left-18 tablet:-top-24 desktop:-left-24 desktop:-top-28 tablet:h-48
				desktop:h-61 absolute -left-11 -top-14 z-0 h-28 w-auto"
				inline-src="./images/rect-washer"
			></svg>
			<svg
				class="tablet:-top-6 tablet:h-34.5 tablet:-right-28 desktop:-right-40 desktop:h-50 absolute -right-12 -top-3 z-0 h-20 w-auto"
				inline-src="./images/cone"
			></svg>
		</h1>

		<div class="flex items-center justify-center gap-4">
			<svg class="h-15 tablet:h-20 desktop:h-25 w-auto shrink-0" inline-src="./images/pyramid"
			></svg>
			<p
				class="font-lora tablet:text-2xl desktop:text-3xl text-center text-lg font-medium leading-tight"
			>
				<T message={m['pages.home.intro.subtitle']} />
			</p>
			<svg class="h-15 tablet:h-20 desktop:h-25 w-auto shrink-0" inline-src="./images/disk"></svg>
		</div>
	</div>

	<div class="-z-px absolute inset-0 max-w-full overflow-hidden">
		<svg class="-translate-1/2 absolute left-1/2 top-1/2 opacity-40" inline-src="./images/mesh"
		></svg>
		<div
			class="w-100 h-100 tablet:w-150 tablet:h-150 desktop:w-200 desktop:h-200 bg-radial from-surface absolute left-0 top-1/2
			-translate-x-1/2 -translate-y-1/2 rounded-full to-transparent"
		>
			<!-- left gradient circle -->
		</div>
		<div
			class="w-100 h-100 tablet:w-150 tablet:h-150 bg-radial from-surface absolute right-0 top-1/2
			-translate-y-1/2 translate-x-1/2 rounded-full to-transparent"
		>
			<!-- left gradient circle -->
		</div>
		<div class="h-50 from-surface to-transprent absolute inset-x-0 bottom-0 bg-gradient-to-t"></div>
	</div>
</section>
