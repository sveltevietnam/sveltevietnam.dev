export * from './types';
export * from './helpers';

// eslint-disable-next-line import/order
import type { ExternalPost, Post } from '$shared/data/blog';

import { post as post_20231009_behind_the_screen_a_yes_code_blog_of_svelte_vietnam } from '$routes/[[lang=lang]]/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/data';
import { post as post_20231012_svelte_vietnam_from_local_to_global } from '$routes/[[lang=lang]]/blog/(posts)/20231012-svelte-vietnam-from-local-to-global/_page/data';
import { post as post_20231020_lets_write_a_simple_svelte_preprocessor } from '$routes/[[lang=lang]]/blog/(posts)/20231020-lets-write-a-simple-svelte-preprocessor/_page/data';
import { post as post_20231110_behind_the_screen_dark_mode_with_sveltekit_tailwindcss_and_postcss } from '$routes/[[lang=lang]]/blog/(posts)/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss/_page/data';
// HYGEN MARKER - IMPORT [DO NOT REMOVE]

export const INTERNAL_POSTS: Post[] = [
	// HYGEN MARKER - POST [DO NOT REMOVE]
	post_20231110_behind_the_screen_dark_mode_with_sveltekit_tailwindcss_and_postcss,
	post_20231012_svelte_vietnam_from_local_to_global,
	post_20231009_behind_the_screen_a_yes_code_blog_of_svelte_vietnam,
	post_20231020_lets_write_a_simple_svelte_preprocessor,
];

export const EXTERNAL_POSTS: ExternalPost[] = [];
