<script context="module">
	import { getContext, setContext, hasContext } from 'svelte';

	/**
	 * @typedef EnhancedCodeBlockGroupContext
	 * @property {string} id
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
	export let id;

	setEnhancedBlockGroupContext({ id });
</script>

<div class="codeblock-group" style="--cols: {cols};">
	<!-- <label class="codeblock-tab">
		<span>pnpm</span>
		<input type="radio" name="<generated_id>" checked />
	</label>
	<EnhancedCodeBlock /> -->
	<slot />
</div>

<style>
	.codeblock-group {
		display: grid;
		grid-template-columns: repeat(var(--cols), auto) 1fr;
		grid-template-rows: auto 1fr;
		margin-block: 24px;
	}
</style>
