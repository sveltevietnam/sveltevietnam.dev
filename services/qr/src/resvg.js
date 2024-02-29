import { Resvg, initWasm } from '@resvg/resvg-wasm';
import wasm from '@resvg/resvg-wasm/index_bg.wasm';

export async function initResgWasm() {
	try {
		await initWasm(wasm);
		return Resvg;
	} catch (err) {
		if (err instanceof Error && err.message.includes('Already initialized')) {
			return Resvg;
		}
		throw err;
	}
}
