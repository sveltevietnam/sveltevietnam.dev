import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema } from '$lib/utils/schemas';

import { extendBlogPostMetadata, ids, loadBlogPostMetadata } from '../entries';
import type * as t from '../types';

const MAX_IN_SERIES_COUNT = 3;

const GetAdjacentPostsFromSameSeriesSchema = v.object({
	postId: v.string(),
	lang: v.optional(LanguageSchema),
});

/**
 * Search for at most 3 posts in the same series with the following algorithm:
 * - 1 is the latest post in the same series, if any,
 * - 2 is the post that comes right after the target post that is not 1, if any.
 * In case none is found, switch to 3, if any.
 * - 3 is the post that comes right before the target post, if any. If same as 2, take the next one, if any.
 *
 * If multiple series, return an array of at most 3 posts for each series
 */
export const getAdjacentPostsFromSameSeries = query(
	GetAdjacentPostsFromSameSeriesSchema,
	async (input) => {
		const { locals } = getRequestEvent();
		const lang = input.lang ?? locals.language;

		const post = await loadBlogPostMetadata(input.postId, lang);
		if (!post) {
			// TODO: assign a unique code to this error
			error(404, { message: 'Post not found', code: 'SV000' });
		}

		const seriesIds = post.series;
		if (!seriesIds?.length) return [];

		const posts = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
			Boolean,
		);

		let remainingPosts = [...posts];
		let indexOfPost = remainingPosts.findIndex((p) => p.id === input.postId);
		if (indexOfPost === -1) return [];

		const postsInSameSeries: t.BlogPostMetadata[] = [];
		let matchedPosts: t.BlogPostMetadata[] = [];
		for (const series of seriesIds) {
			let left = indexOfPost - 1;
			let right = indexOfPost + 1;

			const leftBound = remainingPosts.findIndex((p) => p.series?.some((s) => s === series));
			if (leftBound !== -1) {
				const latestPostInSeries = remainingPosts[leftBound];
				if (latestPostInSeries.id !== input.postId) {
					matchedPosts.push(latestPostInSeries);
				}
			}

			while (left > leftBound || right < remainingPosts.length) {
				if (left > leftBound) {
					const leftPost = remainingPosts[left];
					if (leftPost?.series?.some((s) => s === series)) {
						matchedPosts.push(leftPost);
						if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
					}
					left--;
				}

				if (right < remainingPosts.length) {
					const rightPost = remainingPosts[right];

					if (rightPost?.series?.some((s) => s === series)) {
						matchedPosts.push(rightPost);
						if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
					}

					right++;
				}
			}

			if (matchedPosts.length) {
				postsInSameSeries.push(...matchedPosts);
				remainingPosts = remainingPosts.filter((p) => !matchedPosts.some((_p) => _p.id === p.id));
				indexOfPost = remainingPosts.findIndex((p) => p.id === input.postId);
				matchedPosts = [];
			}
		}

		return await Promise.all(
			postsInSameSeries.map((metadata) => extendBlogPostMetadata(metadata, lang)),
		);
	},
);
