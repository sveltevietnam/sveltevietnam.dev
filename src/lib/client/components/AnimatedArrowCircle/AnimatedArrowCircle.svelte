<script context="module" lang="ts">
  export const animatedArrowCircleContainerClass = 'animated-arrow-circle-container';
</script>

<script lang="ts">
  let cls = '';
  export { cls as class };
</script>

<svg
  width="64"
  height="64"
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={cls}
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

  :global(.animated-arrow-circle-container:hover) {
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
