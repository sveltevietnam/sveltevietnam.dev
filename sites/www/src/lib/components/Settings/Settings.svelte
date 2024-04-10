<script context="module" lang="ts">
	export const translations = {
		vi: {
			accessibility: {
				title: 'Hỗ trợ tiếp cận',
				reduceMotion: 'Giảm hiệu ứng động',
			},
			splashScreen: {
				title: 'Màn hình chờ',
				description:
					'\
					Màn hình chờ là giao diện xuất hiện ban đầu khi bạn ghé thăm sveltevietnam.dev. \
					Bạn có thể sử dụng giả lập dưới đây để chạy thử màn hình chờ mẫu (trình duyệt cần bật Javascript), \
					hoặc xem qua bài viết "<a class="c-link" href="/vi/blog/20231220-behind-the-screen-man-hinh-cho-voi-nang-cao-tang-dan">Màn hình chờ với nâng cao tăng dần</a>" để tìm hiểu thêm.\
				',
				random: 'Ngẫu nhiên',
				short: 'Ngắn',
				long: 'Dài',
				disabled: 'Tắt',
			},
			actions: {
				save: 'Lưu',
				default: 'Mặc định',
			},
			notification: {
				reset: 'Tùy chỉnh đã được đại lại về mặc định!',
				success: 'Tùy chỉnh đã được cập nhật thành công!',
				error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
			},
			resetConfirmation: {
				title: 'Xác nhận',
				description: 'Bạn có chắc chắn muốn đặt lại tất cả tùy chỉnh về mặc định?',
			},
			unsavedChanges: {
				title: 'Unsaved Changes',
				description:
					'Some changes made to settings have not been saved. Are you sure you want to leave?',
			},
		},
		en: {
			accessibility: {
				title: 'Accessibility',
				description: '',
				reduceMotion: 'Reduce Motion',
			},
			splashScreen: {
				title: 'Splash Screen',
				description:
					'\
					Splash screen is the first scene upon your visit at sveltevietnam.dev. \
					You may use the playground below to test run a sample splash screen (Javascript must be enabled in browser), \
					or read the blog post "<a class="c-link" href="/en/blog/20231220-behind-the-screen-progressive-splashscreen">Progressive Splash Screen</a>" for more information.\
				',
				random: 'Random',
				short: 'Short',
				long: 'Long',
				disabled: 'Disabled',
			},
			actions: {
				save: 'Save',
				default: 'Default',
			},
			notification: {
				reset: 'Settings have been reset to defaults!',
				success: 'Settings have been successfully updated!',
				error: 'An error has occurred. Please try again later!',
			},
			resetConfirmation: {
				title: 'Irreversible Action',
				description: 'Are you sure you want to reset all settings to defaults?',
			},
			unsavedChanges: {
				title: 'Xác nhận',
				description:
					'Một số thay đổi đã được thực hiện trong cài đặt nhưng chưa được lưu. Bạn có chắc chắn muốn thoát không?',
			},
		},
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { enhance } from '$app/forms';
	import { beforeNavigate, goto } from '$app/navigation';
	import { createDirtyFormStore, dirtyform } from '$lib/actions/dirtyform';
	import { getLangContext } from '$lib/contexts/lang';
	import { getSettingsContext } from '$lib/contexts/settings';
	import { modalStore } from '$lib/modals';
	import { Confirmation } from '$lib/modals/Confirmation';
	import { getNotificationContext } from '$lib/notifications';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import SplashPlayground from '../SplashPlayground/SplashPlayground.svelte';

	import ColorSchemeSkeleton from './ColorSchemeSkeleton.svelte';

	export let variant: 'page' | 'modal' = 'page';
	export let dirty = createDirtyFormStore();

	let cls = '';
	export { cls as class };

	const { t: tGlobal } = getLangContext();
	const { routes } = getRoutingContext();
	const { colorScheme, language, splash } = getSettingsContext();
	const { helpers } = getNotificationContext();

	$: t = translations[$language];

	$: iColorScheme = $colorScheme;
	$: iLang = $language;
	$: iSplash = $splash;
	// CAUTION: $ not working here for some reason, find workaround later
	// let iAccessibilityReduceMotion = $accessibility.reduceMotion;

	let resetBtnElement: HTMLButtonElement;
	async function confirmReset(event: MouseEvent) {
		event.preventDefault();
		const pushed = modalStore.push({
			component: (await import('$lib/modals/Confirmation')).Confirmation,
			props: {
				title: t.resetConfirmation.title,
				description: t.resetConfirmation.description,
			},
		});
		const { confirmed } = await pushed.resolve();
		if (confirmed) {
			resetBtnElement.removeEventListener('click', confirmReset);
			resetBtnElement.click();
		}
	}

	onMount(() => {
		resetBtnElement.addEventListener('click', confirmReset);
		return () => {
			resetBtnElement.removeEventListener('click', confirmReset);
		};
	});

	let confirmedLeaving = false;
	beforeNavigate(({ cancel, to, willUnload }) => {
		if (confirmedLeaving || !$dirty) return;
		cancel();
		if (willUnload) return;
		const pushed = modalStore.push({
			component: Confirmation,
			props: {
				title: t.unsavedChanges.title,
				description: t.unsavedChanges.description,
			},
		});
		pushed.resolve().then(({ confirmed }) => {
			if (confirmed && to?.url) {
				confirmedLeaving = true;
				goto(to?.url);
			}
		});
	});
</script>

<form
	class={cls}
	method="POST"
	action="{$routes.settings.path}?/update"
	use:enhance={() => {
		dirty.reset();
		return ({ update, result, action }) => {
			update({ reset: false });
			if (result.status === 400) {
				helpers.success(t.notification.error);
			} else if (action.search.includes('reset')) {
				helpers.success(t.notification.reset);
				resetBtnElement.addEventListener('click', confirmReset);
			} else {
				helpers.success(t.notification.success);
			}
		};
	}}
	use:dirtyform={dirty}
>
	<div class="space-y-16 {variant === 'modal' ? 'px-6 pt-6 tb:px-8 tb:pt-8' : ''}">
		<!-- TODO: https://github.com/sveltevietnam/sveltevietnam.dev/issues/68 -->
		<!-- <section class="space-y-8">
			<h2 class="c-text-h3">{t.accessibility.title}</h2>
			<label class="flex w-fit items-center gap-6">
				<p>{t.accessibility.reduceMotion}</p>
				<input
					class="c-input"
					type="checkbox"
					name="accessibilityReduceMotion"
					bind:checked={iAccessibilityReduceMotion}
				/>
			</label>
		</section> -->
		<section class="space-y-8">
			<h2 class="c-text-h3">{$tGlobal.common.colorSchemes.title}</h2>

			<div class="flex flex-wrap gap-6 sp:justify-center">
				<div class="basis-56 space-y-0.5">
					<label>
						<input
							class="c-input c-input--radio-labeled"
							type="radio"
							name="colorScheme"
							value="light"
							bind:group={iColorScheme}
						/>
						<ColorSchemeSkeleton scheme="light" />
					</label>
					<p class="text-center">{$tGlobal.common.colorSchemes.light}</p>
				</div>

				<div class="basis-56 space-y-0.5">
					<label>
						<input
							class="c-input c-input--radio-labeled"
							type="radio"
							name="colorScheme"
							value="dark"
							bind:group={iColorScheme}
						/>
						<ColorSchemeSkeleton scheme="dark" />
					</label>
					<p class="text-center">{$tGlobal.common.colorSchemes.dark}</p>
				</div>

				<div class="basis-56 space-y-0.5">
					<label>
						<input
							class="c-input c-input--radio-labeled"
							type="radio"
							name="colorScheme"
							value="system"
							bind:group={iColorScheme}
						/>
						<ColorSchemeSkeleton scheme="system" />
					</label>
					<p class="text-center">{$tGlobal.common.colorSchemes.system}</p>
				</div>
			</div>
		</section>

		<section class="space-y-8">
			<h2 class="c-text-h3">{$tGlobal.common.language}</h2>

			<div class="flex flex-wrap items-center gap-6">
				<label class="flex items-center gap-4 p-3">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="language"
						value="en"
						bind:group={iLang}
					/>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="50" height="30">
						<clipPath id="t">
							<path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z" />
						</clipPath>
						<path d="M0,0v30h50v-30z" fill="#012169" />
						<path d="M0,0 50,30M50,0 0,30" stroke="#fff" stroke-width="6" />
						<path d="M0,0 50,30M50,0 0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4" />
						<path
							d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z"
							fill="#C8102E"
							stroke="#FFF"
							stroke-width="2"
						/>
					</svg>
					<p>English</p>
				</label>

				<label class="flex items-center gap-4 p-3">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="language"
						value="vi"
						bind:group={iLang}
					/>
					<svg
						width="45"
						height="30"
						viewBox="0 0 30 20"
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
					>
						<rect width="30" height="20" fill="#da251d" />
						<polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#ff0" />
					</svg>
					<p>Tiếng Việt</p>
				</label>
			</div>
		</section>

		<section class="space-y-8">
			<h2 class="c-text-h3">{t.splashScreen.title}</h2>

			<div class="flex flex-wrap items-center gap-6">
				<label class="basis-20 p-3 text-center tb:basis-32">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="splash"
						value="random"
						bind:group={iSplash}
					/>
					<p class="whitespace-nowrap">{t.splashScreen.random}</p>
				</label>
				<label class="basis-20 p-3 text-center tb:basis-32">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="splash"
						value="short"
						bind:group={iSplash}
					/>
					<p>{t.splashScreen.short}</p>
				</label>
				<label class="basis-20 p-3 text-center tb:basis-32">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="splash"
						value="long"
						bind:group={iSplash}
					/>
					<p>{t.splashScreen.long}</p>
				</label>
				<label class="basis-20 p-3 text-center tb:basis-32">
					<input
						class="c-input c-input--radio-labeled"
						type="radio"
						name="splash"
						value="disabled"
						bind:group={iSplash}
					/>
					<p>{t.splashScreen.disabled}</p>
				</label>
			</div>

			<div class="space-y-6">
				<p>{@html t.splashScreen.description}</p>
				<SplashPlayground />
			</div>
		</section>
	</div>

	<section
		class="sticky bottom-0 mt-10 flex flex-wrap justify-end gap-8 border-t bg-bg pb-6 pt-6 tb:pb-8 tb:pt-8 {variant ===
		'modal'
			? 'px-6 tb:px-8'
			: ''}"
	>
		<button
			class="c-btn c-btn--outlined basis-32"
			type="submit"
			formaction="{$routes.settings.path}?/reset"
			bind:this={resetBtnElement}>{t.actions.default}</button
		>
		<button class="c-btn basis-32" type="submit">{t.actions.save}</button>
	</section>
</form>
