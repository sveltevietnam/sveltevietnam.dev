import sveltevietnam from './src/lib/css/tailwind';

/** @type {Omit<import("tailwindcss").Config, 'content'>} */
export default {
	presets: [...sveltevietnam],
};
