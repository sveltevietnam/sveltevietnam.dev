<script lang="ts">
	import { storage } from './storage';

	function increment(step: number = 1) {
		if (storage.num === null) {
			storage.num = 0;
		} else {
			storage.num += step;
		}
	}

	function randomObj() {
		storage.obj = {
			str: Math.random().toString(36).substring(2, 15),
			num: Math.floor(Math.random() * 100),
			bool: Math.random() > 0.5,
		};
	}
</script>

<fieldset class="not-prose border-outline max-w-full min-w-0 overflow-auto border p-4">
	<legend>Interactive Playground</legend>
	<table class="c-text-body-sm w-full border-collapse">
		<thead>
			<tr class="bg-surface-subtle">
				<th class="w-20" scope="col">Key</th>
				<th scope="col">
					<div class="flex items-center justify-between gap-2">
						<span class="flex-1">Current Value</span>
						<button class="c-btn px-2 py-0" onclick={storage.reset}>
							<span>Reset all</span>
						</button>
					</div>
				</th>
				<th class="w-40" scope="col">Action</th>
			</tr>
		</thead>
		<tbody>
			<!-- str -->
			<tr>
				<th scope="row">str</th>
				<td>"{storage.str}"</td>
				<td>
					<input
						class="c-text-input px-2 py-1"
						type="text"
						placeholder="Type something..."
						bind:value={storage.str}
					/>
				</td>
			</tr>

			<!-- num -->
			<tr>
				<th scope="row">num</th>
				<td>{storage.num}</td>
				<td>
					<button class="c-btn c-text-body-sm px-2 py-1" onclick={() => increment(1)}>
						<span>Increment</span>
					</button>
					<button class="c-btn c-text-body-sm px-2 py-1" onclick={() => increment(-1)}>
						<span>Decrement</span>
					</button>
				</td>
			</tr>

			<!-- bool -->
			<tr>
				<th scope="row">bool</th>
				<td>{storage.bool}</td>
				<td>
					<label class="flex cursor-pointer items-center gap-2">
						<input class="c-checkbox" type="checkbox" bind:checked={storage.bool} />
						<span>Toggle</span>
					</label>
				</td>
			</tr>

			<!-- obj -->
			<tr>
				<th scope="row">obj</th>
				<td>{JSON.stringify(storage.obj)}</td>
				<td>
					<button class="c-btn c-text-body-sm px-2 py-1" onclick={randomObj}>
						<span>Randomize</span>
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</fieldset>

<style lang="postcss">
	td,
	th {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-outline);
		vertical-align: middle;
	}
</style>
