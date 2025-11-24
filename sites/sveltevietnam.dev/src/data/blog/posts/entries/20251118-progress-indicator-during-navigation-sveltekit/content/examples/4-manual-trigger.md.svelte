```ts title="$lib/loading.svelte.ts"
import { getContext, setContext } from 'svelte';

type Trigger: () => (Promise<any> | null | undefined)[];

export class LoadingContext {
	static GLOBAL_KEY = Symbol('loading');

  #auto: Trigger = () => [];
  // :::diff +
  #manual: Promise<void> = $state(Promise.resolve());
  // :::

  // :::diff -
  done = $derived(Promise.all(this.#auto().filter(Boolean)));
  // :::
  // :::diff +
  done = $derived(Promise.all([...this.#auto().filter(Boolean), this.#manual]));
  // :::

  constructor(auto: Trigger) {
    this.auto = auto;
  }

  // :::diff +
  load(): () => void {
    let finish: () => void | undefined = undefined;
    this.#manual = new Promise<void>((resolve) => {
      finish = resolve;
    });
    return () => {
      finish?.();
      this.#manual = Promise.resolve();
    };
  }
  // :::

  static setGlobal(auto: Trigger) {
    return setContext(LoadingContext.GLOBAL_KEY, new LoadingContext(auto));
  }

  static getGlobal() {
    return getContext(LoadingContext.GLOBAL_KEY);
  }
}
```
