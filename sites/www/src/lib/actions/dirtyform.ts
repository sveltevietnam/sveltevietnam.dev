import type { ActionReturn } from 'svelte/action';
import { writable } from 'svelte/store';

export function createDirtyFormStore() {
	const { subscribe, set } = writable(false);

	let form: HTMLFormElement;
	let initialFormData: FormData;
	let changedFields = new Set<string>();

	function onChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target) return;
		const { name, value } = target;
		if (initialFormData.get(name) !== value) {
			changedFields.add(name);
		} else {
			changedFields.delete(name);
		}
		set(changedFields.size !== 0);
	}
	return {
		subscribe,
		reset() {
			changedFields = new Set();
			initialFormData = new FormData(form);
			set(false);
		},
		$setup(_form: HTMLFormElement) {
			form = _form;
			initialFormData = new FormData(form);
			form.addEventListener('change', onChange);
		},
		$cleanup() {
			form.removeEventListener('change', onChange);
		},
	};
}

export type DirtyFormStore = ReturnType<typeof createDirtyFormStore>;

export function dirtyform(form: HTMLFormElement, store: DirtyFormStore): ActionReturn {
	store.$setup(form);
	return {
		destroy() {
			store.$cleanup();
		},
	};
}
