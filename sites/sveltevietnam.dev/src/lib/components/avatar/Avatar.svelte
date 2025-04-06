<script lang="ts">
	import { uiAvatar } from '@svelte-put/avatar';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	let {
		name,
		src,
		class: cls,
		border = 'circle',
		...rest
	}: Omit<HTMLImgAttributes, 'src'> & {
		name: string;
		src?: Picture | string;
		border?: 'circle' | 'ellipse';
	} = $props();
</script>

{#if src}
	<enhanced:img class={['avatar', cls]} data-border={border} {src} alt="" {...rest} />
{:else}
	<img class={['avatar', cls]} data-border={border} src={uiAvatar(name)} alt="" {...rest} />
{/if}

<style lang="postcss">
	@layer components {
		.avatar {
			&[data-border='circle'] {
				border-radius: 50%;
			}

			&[data-border='ellipse'] {
				clip-path: polygon(
					89.348% 57.037%,
					89.348% 57.037%,
					93.286% 52.517%,
					96.254% 47.814%,
					98.289% 42.986%,
					99.425% 38.094%,
					99.698% 33.195%,
					99.143% 28.349%,
					97.796% 23.616%,
					95.69% 19.055%,
					92.863% 14.724%,
					89.348% 10.683%,
					89.348% 10.683%,
					85.279% 7.195%,
					80.827% 4.482%,
					76.088% 2.544%,
					71.159% 1.381%,
					66.133% 0.994%,
					61.108% 1.381%,
					56.178% 2.544%,
					51.44% 4.482%,
					46.988% 7.195%,
					42.918% 10.683%,
					11.501% 42.343%,
					11.501% 42.343%,
					8.039% 46.444%,
					5.347% 50.93%,
					3.424% 55.705%,
					2.27% 60.672%,
					1.885% 65.736%,
					2.27% 70.8%,
					3.424% 75.768%,
					5.347% 80.543%,
					8.039% 85.029%,
					11.501% 89.13%,
					11.501% 89.13%,
					15.571% 92.618%,
					20.022% 95.331%,
					24.761% 97.269%,
					29.691% 98.432%,
					34.716% 98.82%,
					39.741% 98.432%,
					44.671% 97.269%,
					49.41% 95.331%,
					53.861% 92.618%,
					57.931% 89.13%,
					89.348% 57.037%
				);
			}
		}
	}
</style>
