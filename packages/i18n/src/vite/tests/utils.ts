import defu from 'defu';
import { type UserConfig, defineConfig } from 'vite';
export function defineTestConfig(adhoc: UserConfig): UserConfig {
	return defu(
		adhoc,
		defineConfig({
			build: {
				write: false,
			},
		}),
	);
}
