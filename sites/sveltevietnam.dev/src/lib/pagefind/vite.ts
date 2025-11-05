import child_process from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { LANGUAGES } from '@sveltevietnam/kit/constants';
import { XMLParser } from 'fast-xml-parser';
import * as lib from 'pagefind';
import pico from 'picocolors';
import { preview } from 'vite';

import { createLogger } from './logger';

export type PagefindViteConfig = {
	verbose?: boolean;
	logfile?: string;
};

const EXCLUDE_PATHS = [
	'pagefind-highlight.js',
	'pagefind-modular-ui.css',
	'pagefind-modular-ui.js',
	'pagefind-ui.css',
	'pagefind-ui.js',
];

async function generate(
	outdir: string | string[],
	logfile: string,
	indexer?: (index: lib.PagefindIndex) => Promise<void>,
) {
	// 1. create index
	const { index } = await lib.createIndex({ logfile });
	if (!index) {
		throw new Error('Failed to create Pagefind index');
	}

	// 2. call user-defined indexer function if provided
	await indexer?.(index);

	// 3. write index to output directory
	const outdirs = Array.isArray(outdir) ? outdir : [outdir];
	await Promise.all(
		outdirs.map(async (dir) => {
			await fs.rm(dir, { recursive: true, force: true });
			const written = await index.writeFiles({ outputPath: dir });
			if (written.errors.length > 0) {
				throw new Error('Errors writing Pagefind files', { cause: written.errors });
			}
			await Promise.all(EXCLUDE_PATHS.map((filepath) => fs.rm(path.join(dir, filepath))));
		}),
	);
}

async function fetchHTMLs(url: string, paths: string[]): Promise<[string, string][]> {
	// split into chunks of 10 to avoid too many concurrent requests
	const chunks: string[][] = [];
	for (let i = 0; i < paths.length; i += 10) {
		chunks.push(paths.slice(i, i + 10));
	}
	const results: [string, string][] = [];
	for (const chunk of chunks) {
		await Promise.all(
			chunk.map(async (path) => {
				const response = await fetch((url.endsWith('/') ? url.slice(0, -1) : url) + path);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
				}
				const html = await response.text();
				results.push([path, html]);
			}),
		);
	}
	return results;
}

/**
 * ## Intentions
 * during development, generate the index to the public directory
 * if not already, so that runtime pagefind is available,
 * otherwise site will crash on init
 */
function pagefind_dev(pluginConfig: PagefindViteConfig = {}): import('vite').Plugin {
	const { logfile = 'pagefind.log' } = pluginConfig;
	const logger = createLogger();
	return {
		name: 'sveltevietnam-pagefind:dev',
		apply: 'serve',
		async configResolved(config) {
			const pagefindDir = path.join(config.publicDir, 'pagefind');
			try {
				await fs.lstat(pagefindDir);
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
					await generate(pagefindDir, path.resolve(config.root, logfile));
					logger.info(
						`Generated empty pagefind index to ${pico.yellow(path.relative(config.root, pagefindDir))}`,
					);
				} else {
					throw error;
				}
			}
		},
	};
}

/**
 * ## Intentions
 * 1. Capture the last hook when files have already been written,
 *		start the preview server, fetch all relevant HTMLs,
 *		and generate the pagefind index to the output directory
 * 2. Update the dev public directory with the latest built index
 *
 * ## Assumptions
 * 1. Intermediate SvelteKit output directory is `.svelte-kit/output`,
 *		that is, the output before distribution is copied to the SvelteKit adapter target outdir.
 *		`.svelte-kit/output` is also the directory where preview server serves the files from.
 * 2. Static files are copied during the 'client' environment build.
 * 3. build order is: 'client' environment, then 'ssr' environment.
 */
function pagefind_build(pluginConfig: PagefindViteConfig = {}): import('vite').Plugin {
	const { verbose, logfile = 'pagefind.log' } = pluginConfig;
	let rConfig: import('vite').ResolvedConfig;
	const logger = createLogger();

	return {
		name: 'sveltevietnam-pagefind:build',
		apply: 'build',
		async configResolved(config) {
			rConfig = config;
		},
		closeBundle: {
			sequential: true,
			order: 'pre',
			async handler(error) {
				if (this.environment.name !== 'ssr') return;
				if (error) {
					logger.warn('There was some error during the build, skipping Pagefind indexing');
					return;
				}
				const startTimestamp = Date.now();
				// const children: child_process.ChildProcess[] = [];
				// process.on('exit', () => {
				// 	if (verbose) {
				// 		logger.info('Cleaning up resources by vite-plugin-pagefind...');
				// 	}
				// 	for (const child of children) {
				// 		if (child.exitCode === null) {
				// 			const ok = process.kill(child.pid!);
				// 			if (!ok) {
				// 				logger.error('Failed to terminate preview server, please terminate it manually.');
				// 			}
				// 		}
				// 	}
				// });
				if (verbose) {
					logger.info('Starting preview server...');
				}
				const server = await preview();
				const url = `http://localhost:${server.config.preview.port}/`;
				if (verbose) {
					logger.info(`Preview server started at ${pico.yellow(url)}`);
				}

				const outdirs = [
					path.resolve(rConfig.root, './.svelte-kit/output/client/pagefind'), // build output
					path.resolve(rConfig.publicDir, 'pagefind'), // dev public directory
				];
				await generate(outdirs, logfile, async (index) => {
					const htmls = (
						await Promise.all(
							LANGUAGES.map(async (lang) => {
								const response = await fetch(`${url}${lang}/sitemap.xml`);
								if (!response.ok) {
									throw new Error(`Failed to fetch sitemap for ${lang}: ${response.statusText}`);
								}

								// fetch paths from sitemap.xml
								if (verbose) {
									logger.info(`Fetching sitemap for ${pico.yellow(lang)}...`);
								}
								const xml = await response.text();
								const parser = new XMLParser({
									htmlEntities: true,
								});
								const root = parser.parse(xml);
								const paths = root.urlset.url.map(
									(url: { loc: string }) => new URL(url.loc).pathname,
								);

								// fetch HTML files for each path
								if (verbose) {
									logger.info(`Fetching HTML files for ${pico.yellow(lang)}...`);
								}
								return await fetchHTMLs(url, paths);
							}),
						)
					).flat();

					for (const [path, html] of htmls) {
						if (verbose) {
							logger.info(`Indexing ${pico.yellow(path)}...`);
						}
						const added = await index.addHTMLFile({ url: path, content: html });
						if (added.errors.length > 0) {
							for (const error of added.errors) {
								logger.internal.error(`- ${pico.red(error)}`);
							}
							throw new Error('Errors indexing HTML file');
						}
					}
					if (verbose) {
						logger.info(
							`Writing pagefind indexes to\n\t- ${outdirs.map((d) => pico.yellow(path.relative(rConfig.root, d))).join('\n\t- ')}`,
						);
					}
				});
				logger.success(`Pagefind indexed in ${pico.yellow(Date.now() - startTimestamp + 'ms')}`);

				// FIXME: force kill process on preview port, temporary workaround because server.close hangs
				child_process.execSync(`kill -9 $(lsof -t -i:${server.config.preview.port})`);
				// await server.close();
			},
		},
	};
}

export function pagefind(config: PagefindViteConfig = {}): import('vite').Plugin[] {
	return [pagefind_dev(), pagefind_build(config)];
}
