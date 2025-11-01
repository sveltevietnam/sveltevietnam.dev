<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	const STATUSES = {
		Info: 'c-callout--info',
		Success: 'c-callout--success',
		Warning: 'c-callout--warning',
		Error: 'c-callout--error',
	};
	const ICONS = {
		Bulb: 'c-callout--icon-bulb',
		Confetti: 'c-callout--icon-confetti',
		Megaphone: 'c-callout--icon-megaphone',
		Question: 'c-callout--icon-question',
		Trophy: 'c-callout--icon-trophy',
	};

	let status = $state<keyof typeof STATUSES>('Info');
	let icon = $state<keyof typeof ICONS | undefined>(undefined);
</script>

<div class="flex flex-wrap">
	<fieldset class="tablet:p-6 w-full min-w-40 border border-current p-4 sm:max-w-60">
		<legend class="font-bold">
			<T key="components.callout_playground.input" />
		</legend>

		<div class="space-y-4">
			<fieldset>
				<legend>
					<T key="components.callout_playground.legends.status" />:
				</legend>
				<select class="c-select w-full" bind:value={status}>
					{#each Object.keys(STATUSES) as key (key)}
						<option value={key}>{key}</option>
					{/each}
				</select>
			</fieldset>

			<fieldset>
				<legend>
					<T key="components.callout_playground.legends.icon" />:
				</legend>
				<select class="c-select w-full" bind:value={icon}>
					<option value={undefined}>None</option>
					{#each Object.keys(ICONS) as key (key)}
						<option value={key}>{key}</option>
					{/each}
				</select>
			</fieldset>
		</div>
	</fieldset>

	<fieldset class="tablet:p-6 tablet:pb-10 min-w-80 flex-1 border border-current p-4 pb-8">
		<legend class="ml-auto font-bold">
			<T key="components.callout_playground.output" />
		</legend>

		<p class="prose mt-0!">
			=> <T key="components.callout_playground.class" />:
			<code>
				c-callout
				{STATUSES[status]}
				{#if icon}
					{ICONS[icon]}
				{/if}
			</code>.
		</p>
		<p class={['not-prose c-callout', STATUSES[status], icon && ICONS[icon]]}>
			<T key="components.callout_playground.sample" />
		</p>
	</fieldset>
</div>
