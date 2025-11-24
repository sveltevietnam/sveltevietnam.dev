```ts title="$lib/loading.svelte.ts"
import { setContext, getContext } from 'svelte';

type Trigger: () => (Promise<any> | null | undefined)[];

export class LoadingContext {
	static GLOBAL_KEY = Symbol('loading');

  #auto: Trigger = () => [];

  // :::highlight
  done = $derived(Promise.all(this.#auto().filter(Boolean)));
  // :::

  constructor(auto: Trigger) {
    this.auto = auto;
  }

  static setGlobal(auto: Trigger) {
    return setContext(LoadingContext.GLOBAL_KEY, new LoadingContext(auto));
  }

  static getGlobal() {
    return getContext(LoadingContext.GLOBAL_KEY);
  }
}
```
