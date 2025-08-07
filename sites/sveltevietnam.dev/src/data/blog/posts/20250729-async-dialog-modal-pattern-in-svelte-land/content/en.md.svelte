<script>
  import Layout from '../example/layout.svelte';
  import Usage from '../example/usage.svelte';
</script>

I always try to avoid dialog / modal (from now on will be referred together as just dialog) in web
projects due to their complexity, lack of shareable URLs, and notorious difficulty in meeting
accessibility requirements if not careful. For example, a dialog containing a form to create a new
resource (e.g. new user creation) can often be replaced with a dedicated page.

With that being said, there are cases where dialog still makes sense in terms of user experience.
One typical example is *confirmation dialog* before an important action is performed.
This post demonstrate this exact example and introduce one possible setup for dialog in Svelte.

## Comprehensive Example

Below is a working example. The source code for the example is provided in the "[Feed me code](#feed-me-code)" section.

<fieldset class="not-prose border border-outline p-4">
<legend>Playground</legend>
<Layout />
<Usage
  buttonMessage="Trigger dialog"
  messageOnConfirm="Confirmed"
  messageOnCancel="Cancelled"
  title="Do you want to proceed?"
  desc="Some disclaimer, information, or note about the action to be performed..."
  cancel="Cancel"
  confirm="Confirm"
/>
<p class="mt-4 c-text-body-sm">Note: playground requires Javascript to function properly</p>
</fieldset>

## Async Dialog

The term "async dialog" in this post refers to a dialog that is triggered via Javascript and whose
result can be **awaited** in the same declarative execution context, for example:

```ts title="Async Dialog"
import ConfirmationDialog from './ConfirmationDialog.svelte';

function doSomething() {
  const confirmed = await triggerAndWaitFor(ConfirmationDialog);
  if (confirmed) {
    // proceed with the confirmed action
  }
}
```

...instead of combining multiple contexts (the rather common solution), for example, one context to
trigger the dialog, and another context to receive the result:

```svelte title="Non-Async Dialog"
<script lang="ts">
  import ConfirmationDialog from './ConfirmationDialog.svelte';

  let dialog: typeof ConfirmationDialog;

  function doSomething() {
    // (1) Activate the dialog
    dialog.open();
  }

  function handleDialogOutput(confirmed: boolean) {
    // (2) Receive the result
    if (confirmed) {
      // proceed with the confirmed action
    }
  }
</script>

<ConfirmationDialog bind:this={dialog} onoutput={handleDialogOutput} />
```

## Feed me code!

<div class="c-callout c-callout--info c-callout--icon-bulb">

It is recommended you use a non-mobile device to view the following source code for the best
experience.

</div>

The setup:

<enhanced-code-block group display="files">

```svelte title="+layout.svelte" src="../example/layout.svelte"
```

```ts title="dialog.ts" src="../example/dialog.ts"
```

```css title="c-dialog.css" src="../../../../../../../../packages/css/src/components/c-dialog.css"
```

</enhanced-code-block>

A usage example, as seen in the "[Comprehensive Example](#comprehensive-example)":

<enhanced-code-block group display="files">

```svelte title="usage.svelte" src="../example/usage.svelte"
```

```svelte title="confirmation-dialog.svelte" src="../example/confirmation-dialog.svelte"
```

</enhanced-code-block>

<div class="c-callout c-callout--warning">

The source code above has some dependencies that is specific to the Svelte Vietnam project
that may need to be modified in order to run in your own settings.

</div>

## Overview

Similarly to other posts in the [Mini Snippet](/en/blog/series/mini-snippet) series, I will not
explain the above source code line-by-line, but only discuss some notable points as follows.

### `@svelte-put/async-stack`

The solution presented here uses the
[@svelte-put/async-stack](https://svelte-put.vnphanquang.com/docs/async-stack) library (which I wrote).
This library is designed **only to handle logic** (headless - not concerned with UI) for portalling
components to a centralized DOM parent. It can also be used for a notification/toast system.

```ts title="async-stack"
import { stack } from '@svelte-put/async-stack';
export const dialogOrNotificationStack = stack().build();
```

### Activating and Rendering

Dialog is activated by pushing a component onto the stack with the necessary props in a type-safe
manner:

```ts title="activation"
const pushed = dialogStack.push('custom', {
  component: ConfirmationDialog,
  props: confirmDialogProps, // <- type should be inferred / checked
})
```

The associated component is rendered as seen in `+layout.svelte` (the portal), and is automatically
ejected with the help of the stack upon a corresponding user interaction. Such setup also allows
[dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
for the component, better optimizing the application at runtime:

```ts
const component = (await import('./ConfirmationDialog.svelte')).default;
```

### Awaiting for Result

Right after the dialog is activated, we may access [certain methods on the stack
element](https://svelte-put.vnphanquang.com/docs/async-stack#component), including awaiting for
the resolution of the dialog (i.e. output / result)

```ts
output = await pushed.resolution; // <- type should also be inferred / checked
```

As discussed earlier, this permits a single encapsulated execution flow, without having to listen
for the result through a separate data stream such as a callback or event listener, which often
involves a boolean flag for rendering the result and bubbling variables to a shared context.

### Using HTML Dialog

This solution is also designed to work in tandem with [HTML
dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), leveraging
its built-in features to ensure accessibility and minimize the need for custom Javascript.

As such, `@svelte-put/async-stack` provides a `enhanceDialog` helper to adds the following features
to `dialog`:

1. automatically calls
   [showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal),
2. closes the dialog when the user clicks on the backdrop (clickoutside),
3. supports automatic result return when integrated with `<form method="dialog>`,
   as in the example, reducing the dependency on Javascript for simple use cases.

<div class="c-callout c-callout--info">

At the time of this writing, `enhanceDialog` is an experimental feature and may change in the
future.

</div>

## Extension

To ensure encapsulation and testability, I often wrap the created stack within a
[Svelte context](https://svelte.dev/docs/svelte/context):

```ts title="dialog-context.svelte.ts" src="../../../../../lib/dialogs/context.svelte.ts"
```

The solution can also be extended to support additional features. For example, the search dialog
on sveltevietnam.dev uses
[@svelte-put/lockscroll](https://svelte-put.vnphanquang.com/docs/lockscroll) to lock the scrollbar.
You can trigger the dialog (by pressing <kbd>Ctrl/Cmd</kbd><kbd>K</kbd>, or from the toolbar) and
observe said behavior.

## Closing

Today, while HTML dialog is widely supported and more convenient than ever, I
often find myself still needing more than just a vanilla setup. Currently, I am quite satisfied with
the solution presented here, and have used it in many projects. However, as discussed in the opening,
I always try to avoid using dialogs as much as possible.

If you have any suggestions or questions, you can find me at [vnphanquang on
Bluesky](https://bsky.app/profile/vnphanquang.com) or at the [Svelte Vietnam
Discord](https://discord.sveltevietnam.dev). Thank you for reading!
