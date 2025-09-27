<script lang="ts" module>
	import Delimiter from '@editorjs/delimiter';
	import type { OutputData } from '@editorjs/editorjs';
	import type { HeaderConfig } from '@editorjs/header';
	import Header from '@editorjs/header';
	import List from '@editorjs/list';
	import Quote from '@editorjs/quote';
	import type { Message } from '@sveltevietnam/i18n/runtime';

	import { Callout } from './callout';

	export interface RichTextEditorProps {
		/** @bindable */
		output?: OutputData;
		lang: string;
		i18n: {
			placeholder: Message<'string', never>;
		};
		cache?: [area: 'session' | 'local', key: string];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let { lang, i18n, output = $bindable(), cache }: RichTextEditorProps = $props();

	let holder: HTMLElement;
	let editor: import('@editorjs/editorjs').default;

	async function init() {
		const EditorJS = await import('@editorjs/editorjs').then((mod) => mod.default);
		editor = new EditorJS({
			data: $state.snapshot(output),
			holder,
			tools: {
				callout: {
					class: Callout,
					inlineToolbar: true,
				},
				delimiter: Delimiter,
				header: {
					// @ts-expect-error unsupported type issue from EditorJS
					class: Header,
					config: {
						levels: [3, 4, 5],
						defaultLevel: 3,
					} as HeaderConfig,
				},
				list: List,
				quote: Quote,
			},
			placeholder: i18n.placeholder(lang).toString(),
			async onReady() {
				if (cache && !output?.blocks.length) {
					const [area, key] = cache;
					const storage = area === 'local' ? localStorage : sessionStorage;
					const cached = storage.getItem(key);
					if (cached) {
						try {
							editor.render(JSON.parse(cached) as OutputData);
						} catch {
							// ignore error
						}
					}
				}
			},
			async onChange(api) {
				const saved = await api.saver.save();
				output = saved.blocks.length ? saved : undefined;
				if (cache) {
					const [area, key] = cache;
					const storage = area === 'local' ? localStorage : sessionStorage;
					storage.setItem(key, JSON.stringify(output));
				}
			},
		});
	}

	onMount(() => {
		init();
		return function () {
			editor?.destroy();
		};
	});
</script>

<div
	class="border-onehalf prose tablet:px-8 min-h-80 max-w-full border-current px-4 py-1"
	bind:this={holder}
	{lang}
></div>

<style lang="postcss">
	div {
		:global {
			& .ce-block__content,
			& .ce-toolbar__content {
				max-width: 100%;
			}

			& .cdx-list {
				display: block;
			}

			& a {
				text-decoration: unset;
			}

			& .ce-delimiter::before {
				content: '🞵🞵🞵';
			}
		}
	}
</style>
