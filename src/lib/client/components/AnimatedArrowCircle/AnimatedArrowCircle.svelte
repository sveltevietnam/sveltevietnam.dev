<script context="module" lang="ts">
  import { onMount } from 'svelte';

  export const ANIMATED_ARROW_HANDLE_CLASS = 'animated-arrow-circle-handle';
</script>

<script lang="ts">
  export let width = 64;
  export let height = 64;
  export let animated = false;
  export let handle: 'self' | 'parent' | 'none' | `#${string}` = 'none';
  let cls = '';
  export { cls as class };

  let node: SVGElement;
  onMount(() => {
    let handleNode: HTMLElement | null = null;

    function mouseenter() {
      node.dataset.animated = 'true';
    }
    function mouseleave() {
      node.dataset.animated = 'false';
    }

    if (handle === 'self') {
      node.classList.toggle(ANIMATED_ARROW_HANDLE_CLASS, true);
    } else if (handle === 'parent') {
      node.parentElement?.classList.toggle(ANIMATED_ARROW_HANDLE_CLASS, true);
    } else if (handle !== 'none') {
      handleNode = node?.parentElement;
      handleNode = document.getElementById(handle.slice(1));
      if (handleNode) {
        handleNode.addEventListener('mouseenter', mouseenter);
        handleNode.addEventListener('mouseleave', mouseleave);
      }
    }

    return () => {
      if (handle === 'parent') {
        node.parentElement?.classList.toggle(ANIMATED_ARROW_HANDLE_CLASS, false);
      } else if (handleNode) {
        handleNode.removeEventListener('mouseenter', mouseenter);
        handleNode.removeEventListener('mouseleave', mouseleave);
      }
    };
  });
</script>

<svg
  {width}
  {height}
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-animated={animated}
  data-handle={handle}
  class={cls}
  bind:this={node}
>
  <circle cx="32" cy="32" r="24" fill="currentColor" class="circle" />
  <path
    d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
    stroke="currentcolor"
    stroke-width="2"
    stroke-miterlimit="10"
  />
  <g class="arrow">
    <path
      d="M33.5254 40.4734L42.0004 31.9984L33.5254 23.5234"
      stroke="currentcolor"
      stroke-width="2"
      stroke-linecap="square"
    />
    <path
      d="M21.9998 32H39.9998"
      stroke="currentcolor"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round"
    />
  </g>
</svg>

<style lang="postcss">
  svg {
    --animation-duration: 400ms;
    --animation-timing-function: cubic-bezier(0.13, -0.27, 0.48, 1.54);
    --animated-color: currentcolor;

    transition: color 200ms ease-out;

    & .circle,
    & .arrow {
      animation-duration: var(--animation-duration);
      animation-fill-mode: forwards;
    }

    & .circle {
      transform-origin: center;
      animation-name: circle-animate-out;
      animation-duration: calc(var(--animation-duration));
      animation-timing-function: var(--animation-timing-function);
    }

    & .arrow {
      animation-name: arrow-animate-out;
      animation-timing-function: var(--animation-timing-function);
    }
  }

  svg[data-animated='true'] {
    color: var(--animated-color);

    & .circle {
      animation-name: circle-animate-in;
    }

    & .arrow {
      animation-name: arrow-animate-in;
    }
  }

  :global(.animated-arrow-circle-handle:hover) {
    & svg {
      color: var(--animated-color);
    }

    & .circle {
      animation-name: circle-animate-in;
    }

    & .arrow {
      animation-name: arrow-animate-in;
    }
  }

  @keyframes circle-animate-in {
    from {
      transform: scale(0);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes circle-animate-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes arrow-animate-in {
    0% {
      transform: translate(0);
      color: theme('colors.design.fg.1');
      opacity: 1;
    }

    50% {
      transform: translate(100%);
      color: theme('colors.design.fg.1');
      opacity: 0;
    }

    51% {
      transform: translate(-100%);
      color: theme('colors.design.bg.1');
      opacity: 0;
    }

    100% {
      transform: translate(0);
      color: theme('colors.design.bg.1');
      opacity: 1;
    }
  }

  @keyframes arrow-animate-out {
    0% {
      transform: translate(0);
      color: theme('colors.design.bg.1');
      opacity: 1;
    }

    50% {
      transform: translate(100%);
      color: theme('colors.design.bg.1');
      opacity: 0;
    }

    51% {
      transform: translate(-100%);
      color: theme('colors.design.fg.1');
      opacity: 0;
    }

    100% {
      transform: translate(0);
      color: theme('colors.design.fg.1');
      opacity: 1;
    }
  }
</style>
