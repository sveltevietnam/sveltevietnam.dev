/// <reference types="vite/client" />

declare global {
	declare module '*&imagetools' {
		export default import('vite-imagetools').Picture;
	}
}

export {};
