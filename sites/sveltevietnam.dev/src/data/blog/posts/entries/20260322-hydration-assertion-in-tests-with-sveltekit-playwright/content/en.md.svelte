Lately, I have been getting more involved in software QA/QC.
Beyond its importance, writing tests can actually be a lot of fun.
Yet, one of the most frustrating things is watching my test cases pass with flying colours,
but only most of the time, while still failing just enough times without any clear reason - *flakiness*, as it's known.

In this post, I'd like to share how I check for hydration in E2E/UAT tests using
Playwright in the context of a SvelteKit app. In my limited experience, hydration is sometimes the
cause of flaky tests, but it can also be used as an early indicator of runtime problems.

## Just Give Me Code

Add to app code a signal for hydration:

```svelte title="+layout.svelte"
<script>
  import { onMount } from 'svelte';

  // :::highlight
  // :::focus
  onMount(() => {
    document.documentElement.toggleAttribute('hydrated', true);
  });
  // :::
  // :::
</script>
```

Wait for hydration in tests:

```ts title="suite.test.ts"
import { test, expect } from '@playwright/test';

test('...', async ({ page }) => {
  // Wait for hydration
  // :::highlight
  // :::focus
  await expect(page.locator(':root')).toHaveAttribute('hydrated');
  // :::
  // :::

  // whatever else
});
```

## What is Hydration?

To avoid being repetitive, here is a quote from [Svelte Documentation > Page Options](https://svelte.dev/docs/kit/page-options):

> By default, SvelteKit will render (or prerender) any component first on the server and send it to the client as HTML. It will then render the component again in the browser to make it interactive in a process called hydration.

## Cause of Flakiness

For any runtime logic to be usable, hydration must first finish. Typical examples include
interactive elements without progressive enhancement support, such as a clickable button with explicit
`onclick` handler. The time it takes for hydration to complete depends on how much JavaScript needs to be loaded
(and the network speed, which may not be relevant in local test environment).

In an automated context, instructions can sometimes be executed a little too quickly before hydration.
In most cases, this shouldn't be a problem thanks to Playwright's [auto-waiting](https://playwright.dev/docs/actionability) feature.
However, discrepancies can still happen for a whole host of reasons. An example is shown below.

```ts title="suite.test.ts"
import { test, expect } from '@playwright/test';

test('flaky counter test due to hydration', async ({ page }) => {
  await page.goto('/counter');

  // The button is rendered by the server and visible.
  // Playwright clicks it IMMEDIATELY.
  // If hydration hasn't finished, the count stays at 0.
  const incrementBtn = page.getByRole('button', { name: 'Increment' });
  await incrementBtn.click();

  // This might fail intermittently
  await expect(page.getByText('Count is 1')).toBeVisible();
});
```

The test object could be:

```svelte title="+page.svelte"
<script>
  let count = $state(0);
  // some other expensive 💩 that causes hydration to take just a little too long

  function increment() {
    count += 1;
  }
</script>

<p>Count is {count}</p>
<button on:click={increment}>Increment</button>
```

<div class="c-callout c-callout--info c-callout--icon-bulb">

Flaky tests often surface when run in parallel with others, or repeated multiple times. The `--repeat-each` and `--workers` CLI options may be helpful here.
See Playwright's [Parallelism](https://playwright.dev/docs/test-parallel) and [CLI](https://playwright.dev/docs/test-cli) docs for more
information. For example:

```bash
pnpm playwright test -g "UAT-001" --repeat-each 10 --workers 2 # run the UAT-001 test case 10 times across 2 parallel workers
```

</div>

## Hydration Assertion in Test

To avoid the aforementioned flakiness, I often just tell Playwright to wait for hydration to complete
before executing the actual test case. There isn't yet a SvelteKit-native way to signal hydration
completion, however, so we can get pretty creative here. The first thing I tried was [waiting until there is no network activity](https://playwright.dev/docs/api/class-page#page-wait-for-load-state):

```ts
page.waitForLoadState('networkidle');
```

The method, however, is discouraged by Playwright, and in fact didn't work very well for me. Plus,
it can potentially increase the elapsed time of the test case and obviously won't work if I have any kind of polling.
I went on to try several other routes, trying to be clever, but eventually landed on a more direct
approach, which is shown in the [Just Give me Code](#just-give-me-code) section above, truncated here
for brevity.

```ts title="Hydration signal"
// in app
document.documentElement.toggleAttribute('hydrated', true);

// in test
await expect(page.locator(':root')).toHaveAttribute('hydrated');
```

This works because JS in `onMount` is effectively client-only and Svelte-specific (lives in Svelte
context rather than, say, in a native script tag in the HTML), meaning it will only run after hydration.
Whether this is the best place for it is up for debate.

The proposed solution does add a tiny bit of overhead to the application code, but so far is
better for me than any other workaround. It also has the benefit of letting me see
hydration status in the browser dev tools, which can be helpful when it comes to manual debugging.

<div class="c-callout c-callout--info c-callout--icon-bulb">

Alternatively, the attribute can be a timestamp instead of just a boolean. In some cases, this can help
detect if hydration is taking longer than a certain threshold (e.g. on slow mobile network),
in which case further actions can be taken. See the blog post
"[Progressive Splash Screen](/en/blog/20231220-behind-the-screen-progressive-splashscreen#slow-network)"
for a demonstration of this idea.

</div>

If you have any critique or suggestions for improvement, please let me know!

### Wait everywhere, every time

I use the [Page Object Model](https://playwright.dev/docs/pom) pattern ("inheritance, yuck!" - I
hear you!). And it's quite helpful to add some global abstraction for this hydration assertion.
Here is how I'm doing it:

```ts title="CommonPageObjectModel.ts"
export class CommonPageObjectModel {
	public readonly page: Page;

  // call this method (remember to `await`) on your poms after any navigation
	public hydrated() {
		return expect(this.page.locator(':root')).toHaveAttribute('hydrated');
	}
}
```

This helps guard against not only hydration failure in the initial page load, but also any
subsequent problematic navigation.

<div class="c-callout c-callout--info">

Here I don't have any concrete proof, but as far as I can tell, during
client-side navigation between pages, if the hydration of the next page breaks, SvelteKit will revert
to a full-page load, in which case we'll need to check hydration again.

</div>

## Early Defect Detection

Sometimes, hydration breaks, either because of an unstable development environment, or some strange
bugs that happen at runtime in production. In any case, the error messages emitted from a failing test case may
not be helpful at all, because whatever is being reported may just be an after-effect of a hydration
failure, a masked symptom if I may. Having a hydration assertion can help pinpoint the defect more accurately.

This is especially true when an application properly implements progressive enhancement, for
example, a form that works even when there is no Javascript (no need for hydration). When hydration
breaks, the application still functions, but it may be a little off. For example, a JS-fired
toast notification or some custom JS validation does not work. Catching such problem early before
the application hits production may be critical to ensure a good user experience.

<div class="c-callout c-callout--warning">

I've experienced quite a few hydration issues when using the currently experimental [Async Svelte](https://svelte.dev/docs/svelte/await-expressions)
and [SvelteKit Remote Function](https://svelte.dev/docs/kit/remote-functions) features.

</div>

## Closing

The idea discussed in this post is simple: wait for hydration before doing anything else in Playwright
tests against a SvelteKit app. It is important to note that I am not a test automation expert, so
any peer review is much welcome and appreciated. You can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or via the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Thanks for reading, and happy testing!

