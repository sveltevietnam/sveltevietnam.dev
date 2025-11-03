<script lang="ts">
	import { T, Provider } from '@sveltevietnam/i18n';
	import type { Language } from '@sveltevietnam/i18n/generated';
	import { langs } from '@sveltevietnam/i18n/generated/constants';
	import * as m from '@sveltevietnam/i18n/generated/messages';

	let lang = $state<Language>('en');
	let languageNames = $derived(new Intl.DisplayNames([lang], { type: 'language' }));
</script>

<Provider {lang}>
	<fieldset>
		<label for="select-lang">
			<T key="select_language" />:
		</label>
		<select bind:value={lang} id="select-lang" data-testid="select-lang">
			{#each langs as lang (lang)}
				<option value={lang}>{languageNames.of(lang)}</option>
			{/each}
		</select>
	</fieldset>

	<table>
		<thead>
			<tr>
				<th scope="col" data-testid="key"><T key="key" /></th>
				<th scope="col" data-testid="translation"><T key="translation" /></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">{m['components.welcome.greet'].$k}</th>
				<td data-testid={m['components.welcome.greet'].$k}>
					<T key="components.welcome.greet" params={{ name: 'Hoàng' }} />
				</td>
			</tr>
			<tr>
				<th scope="row">{m['goodbye'].$k}</th>
				<td data-testid={m['goodbye'].$k}><T key="goodbye" /></td>
			</tr>
		</tbody>
	</table>
</Provider>
