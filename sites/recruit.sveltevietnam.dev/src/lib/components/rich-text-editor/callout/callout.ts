import type { API, BlockTool, OutputBlockData, PasteConfig } from '@editorjs/editorjs';
import type { MenuConfigItem, PasteEvent } from '@editorjs/editorjs/types/tools';
import { STATUSES, type Status } from '@sveltevietnam/kit/constants';

import './callout.css';

const SVGS: Record<Status, string> = {
	info: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentcolor" viewBox="0 0 256 256"><path d="M128 24A104 104 0 10232 128 104.1 104.1 0 00128 24Zm0 192a88 88 0 1188-88 88.1 88.1 0 01-88 88Zm16-40a8 8 0 01-8 8 16 16 0 01-16-16V128a8 8 0 010-16 16 16 0 0116 16v40a8 8 0 018 8ZM112 84a12 12 0 1112 12A12 12 0 01112 84Z"></path></svg>',
	success:
		'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentcolor" viewBox="0 0 256 256"><path d="M216 128a88.1 88.1 0 01-88 88 88 88 0 1188-88Zm16 0A104.1 104.1 0 00128 24 104 104 0 10232 128ZM173.7 98.3a8 8 0 00-11.4-0L112 148.7 93.7 130.3A8 8 0 0082.4 141.6l24 24a8 8 0 0011.3 0l56-56a8 8 0 000-11.3Z"></path></svg>',
	warning:
		'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentcolor" viewBox="0 0 256 256"><path d="M140 180a12 12 0 00-12-12 12 12 0 1012 12Zm-20-36a8 8 0 0016 0V104a8 8 0 00-16 0v40Zm102.9 59.8a7.6 7.6 0 00.1-7.7L135.5 44.2a8.8 8.8 0 00-15 0L33 196.1a7.6 7.6 0 000 7.7 8.5 8.5 0 007.5 4.2H215.4a8.5 8.5 0 007.5-4.2Zm13.9-15.7a23.5 23.5 0 01-.1 23.7A24.4 24.4 0 01215.4 224H40.5A24.4 24.4 0 0119.2 211.8a23.5 23.5 0 010-23.7L106.6 36.2a24.8 24.8 0 0142.7 0l87.5 151.9Z"></path></svg>',
	error:
		'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentcolor" viewBox="0 0 256 256"><path d="M128 160a12 12 0 0112 12 12 12 0 11-12-12Zm88 4.4L164.4 216H91.5L40 164.4V91.5L91.5 40h72.9L216 91.5Zm16-72.9a15.9 15.9 0 00-4.8-11.3L175.7 28.7A15.9 15.9 0 00164.4 24H91.5A15.9 15.9 0 0080.2 28.7L28.7 80.2A15.9 15.9 0 0024 91.5v72.9a15.9 15.9 0 004.7 11.4l51.5 51.5A15.9 15.9 0 0091.5 232h72.9a15.9 15.9 0 0011.4-4.8l51.5-51.5a15.9 15.9 0 004.7-11.3V91.5ZM120 136a8 8 0 0016 0V80a8 8 0 00-16 0v56Z"></path></svg>',
};

const CLASSES: Record<Status, string> = {
	info: 'c-callout--info',
	success: 'c-callout--success',
	warning: 'c-callout--warning',
	error: 'c-callout--error',
};

export interface CalloutData {
	content: string;
	status: Status;
}

export interface CalloutConfig {
	/** Block's placeholder */
	placeholder: string;
	/** Allowed statuses */
	status: Status[];
	/** Default level */
	defaultStatus: Status;
}

export interface CalloutInit {
	/** Previously saved data */
	data?: Partial<CalloutData>;
	config?: Partial<CalloutConfig>;
	/** Editor.js API */
	api: API;
	/** Read-only mode flag */
	readOnly: boolean;
}

/**
 * Callout block for {@link https://editorjs.io/ | Editor.js }
 */
export class Callout implements BlockTool {
	private api: API;
	private readonly: boolean;
	private config: CalloutConfig;
	private data: CalloutData;

	private element: HTMLParagraphElement;

	static get toolbox() {
		return {
			icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentcolor" viewBox="0 0 256 256"><path d="M248 120a48 48 0 00-48-48H160.2c-2.9-.2-53.6-3.7-101.9-44.2A16 16 0 0032 40V200a16 16 0 0026.3 12.3c37.8-31.7 77-40.8 93.7-43.3v31.7a16 16 0 007.1 13.3l11 7.3a16 16 0 0024.4-9.3l11.8-44.4A48.1 48.1 0 00248 120ZM48 199.9V40c42.8 35.9 86.6 45 104 47.2v65.5c-17.3 2.3-61.2 11.4-104 47.2Zm131 8v.1l-11-7.3V168h21.6ZM200 152H168V88h32a32 32 0 110 64Z"></path></svg>',
			title: 'Callout',
		};
	}

	static get pasteConfig(): PasteConfig {
		return { tags: ['P'] };
	}

	static get sanitize() {
		return {
			status: false,
			content: {},
		};
	}

	static get conversionConfig() {
		return {
			export: 'content',
			import: 'content',
		};
	}

	static get isReadOnlySupported() {
		return true;
	}

	constructor(init: CalloutInit) {
		this.api = init.api;
		this.readonly = init.readOnly;
		this.config = {
			...init.config,
			placeholder: init.config?.placeholder || 'Something to call out...',
			status: init.config?.status || [...STATUSES],
			defaultStatus: init.config?.defaultStatus || 'info',
		};
		this.data = {
			content: init.data?.content || '',
			status: init.data?.status ?? this.config.defaultStatus,
		};

		this.element = this.initElement();
	}

	private initElement(): HTMLParagraphElement {
		this.element = document.createElement('p');

		// set classes
		this.element.classList.add('c-callout');
		this.setStatus(this.data.status);

		// set contenteditable
		this.element.contentEditable = String(!this.readonly);

		// set placeholder
		this.element.dataset.placeholder = this.api.i18n.t(this.config.placeholder);

		// set content
		this.element.innerHTML = this.data.content;

		return this.element;
	}

	setStatus(status: Status) {
		this.data.status = status;
		this.element.classList.remove(...Object.values(CLASSES));
		this.element.classList.add(CLASSES[this.data.status]);
	}

	render(): HTMLParagraphElement {
		return this.element;
	}

	save(element: HTMLParagraphElement): CalloutData {
		return {
			content: element.innerHTML,
			status: this.data.status,
		};
	}

	validate(savedData: CalloutData): boolean {
		return !!savedData.content?.trim();
	}

	merge(data: CalloutData): void {
		this.element.insertAdjacentHTML('beforeend', data.content);
	}

	renderSettings(): MenuConfigItem[] {
		return this.config.status.map(
			(status) =>
				({
					icon: SVGS[status],
					label: this.api.i18n.t(`${status.at(0)?.toUpperCase()}${status.slice(1)} Callout`),
					onActivate: () => this.setStatus(status),
					closeOnActivate: true,
					isActive: this.data.status === status,
				}) satisfies MenuConfigItem,
		);
	}

	onPaste(event: PasteEvent): void {
		const detail = event.detail;

		if ('data' in detail) {
			const element = detail.data as HTMLElement;

			// parse status
			let status: Status = 'info';
			for (const [key, className] of Object.entries(CLASSES) as [Status, string][]) {
				if (element.classList.contains(className)) {
					status = key;
					break;
				}
			}

			this.data = {
				content: element.innerHTML,
				status,
			};
			this.element.innerHTML = this.data.content;
			this.setStatus(this.data.status);
		}
	}
}

export const parseCalloutToHtml = (output: OutputBlockData) => {
	if (output.type !== 'callout') return {};
	const data = output.data as CalloutData;
	return `<p class="c-callout ${CLASSES[data.status]}">${data.content}</p>`;
};
