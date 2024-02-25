<script context="module">
	import { getContext, setContext, hasContext } from 'svelte';

	/**
	 * @typedef EnhancedCodeBlockGroupContext
	 * @property {string} name - name for the code block group, mapped to the checkbox input `name` field
	 * @property {'files' | 'tabs'} display - display mode of the code block group
	 * @property {string} initial - initial code block identifier to display
	 * @property {(current: string) => void} onSelect - callback when a code block is selected
	 */

	const ENHANCED_CODE_BLOCK_GROUP_CONTEXT = 'enhanced:codeblock:group';

	/**
	 * @return {EnhancedCodeBlockGroupContext | null}
	 */
	export function getEnhancedCodeBlockGroupContext() {
		if (!hasContext(ENHANCED_CODE_BLOCK_GROUP_CONTEXT)) return null;
		return getContext(ENHANCED_CODE_BLOCK_GROUP_CONTEXT);
	}

	/**
	 * @param {EnhancedCodeBlockGroupContext} value
	 */
	function setEnhancedBlockGroupContext(value) {
		setContext(ENHANCED_CODE_BLOCK_GROUP_CONTEXT, value);
	}
</script>

<script>
	/** @type {number} */
	export let cols;
	/** @type {string}*/
	export let name;
	/** @type {EnhancedCodeBlockGroupContext['display']}*/
	export let display = 'files';
	/** @type {string} */
	export let initial = '';
	/** @type {string} */
	export let current = '';

	/** @type {EnhancedCodeBlockGroupContext['onSelect']} */
	const onSelect = (_current) => {
		current = _current;
	};

	setEnhancedBlockGroupContext({ name, display, initial, onSelect });
</script>

<div class="codeblock-group codeblock-group--{display}" style="--cols: {cols};">
	<!-- <label class="codeblock-tab">
		<span>pnpm</span>
		<input type="radio" name="<generated_id>" checked />
	</label>
	<EnhancedCodeBlock /> -->
	<slot />
	<div class="first-row-last-col-fill" />
</div>

<style>
	.first-row-last-col-fill {
		position: relative;
		bottom: -1px;

		grid-column: -2;

		border-color: theme('colors.outline.DEFAULT');
		border-style: solid;
		border-top-right-radius: 4px;
	}

	:where(.codeblock-group) {
		display: grid;
		grid-template-columns: repeat(var(--cols), auto) 1fr;
		grid-template-rows: auto 1fr;
		margin-block: 24px;

		&:where(.codeblock-group--files) {
			position: relative;

			& .first-row-last-col-fill {
				border-width: 1px 1px 0 0;
			}
		}
	}
</style>
