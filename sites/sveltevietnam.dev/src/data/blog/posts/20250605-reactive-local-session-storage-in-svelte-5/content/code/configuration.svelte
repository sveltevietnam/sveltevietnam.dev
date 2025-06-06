<fieldset class="not-prose overflow-auto border border-outline p-4">
	<legend>Configuration</legend>
	<table class="border-collapse max-w-full c-text-body-sm w-full">
		<thead>
			<tr class="bg-surface-subtle">
				<th class="w-20" scope="col">Key</th>
				<th scope="col">Prefix</th>
				<th scope="col">Type</th>
				<th scope="col">Storage Area</th>
				<th class="whitespace-nowrap" scope="col">Initial Value</th>
			</tr>
		</thead>
		<tbody>
			<!-- str -->
			<tr>
				<th scope="row">str</th>
				<td>app:</td>
				<td>String</td>
				<td>SessionStorage</td>
				<td>null</td>
			</tr>

			<!-- num -->
			<tr>
				<th scope="row">num</th>
				<td>app:</td>
				<td>Number</td>
				<td>LocalStorage</td>
				<td>0</td>
			</tr>

			<!-- bool -->
			<tr>
				<th scope="row">bool</th>
				<td>special:</td>
				<td>Boolean</td>
				<td>LocalStorage</td>
				<td>null</td>
			</tr>

			<!-- obj -->
			<tr>
				<th scope="row">obj</th>
				<td>app:</td>
				<td>Object</td>
				<td>LocalStorage</td>
				<td>null</td>
			</tr>
		</tbody>
	</table>
</fieldset>

<style lang="postcss">
	td, th {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-outline);
		vertical-align: middle;
	}
</style>
