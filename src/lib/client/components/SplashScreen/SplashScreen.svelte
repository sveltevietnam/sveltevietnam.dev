<script context="module" lang="ts">
  import type { ComponentProps } from 'svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { readonly, writable } from 'svelte/store';

  import type { SplashScreen } from '$client/components/SplashScreen';

  export function randomVariant(): ComponentProps<SplashScreen>['variant'] {
    const random = Math.random();
    if (random < 0.55) return 1;
    return 2;
  }

  export type Splash = {
    variant: ComponentProps<SplashScreen>['variant'];
    duration: {
      in: number;
      out: number;
    };
    done: boolean;
  };

  const splashStore = writable<Splash | undefined>();
  export const splash = readonly(splashStore);
</script>

<script lang="ts">
  export let variant: 1 | 2;

  let inDuration = variant === 1 ? 600 : 2000;
  const outDuration = 1000;
  const dispatch = createEventDispatcher<{ splashed: Omit<Splash, 'done'> }>();

  let iSplash: Splash = {
    variant,
    duration: {
      in: inDuration,
      out: outDuration,
    },
    done: false,
  };
  onMount(() => {
    splashStore.set(iSplash);
  });

  function onAnimationEnd() {
    iSplash = { ...iSplash, done: true };
    dispatch('splashed', iSplash);
    splashStore.set(iSplash);
    document.documentElement.classList.toggle('splashed', true);
  }
</script>

<div
  class="splash splash--{variant}"
  style="
    --animation-in-duration: {inDuration}ms;
    --animation-out-duration: {outDuration}ms;
  "
  aria-disabled
  on:animationend|self={onAnimationEnd}
>
  <div class="icon">
    <svg inline-src="sveltevietnam-grayscale" width="90" height="94" class="logo-grayscale" />
  </div>
  <div class="title">
    <svg
      width="148"
      height="66"
      viewBox="0 0 148 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4505 6.4377C15.3074 5.22964 14.7272 4.2918 13.7099 3.62419C12.6926 2.95658 11.4448 2.62277 9.96652 2.62277C8.88562 2.62277 7.93983 2.79762 7.12916 3.14732C6.32643 3.49702 5.69856 3.97786 5.24554 4.58984C4.80046 5.20182 4.57792 5.89725 4.57792 6.67614C4.57792 7.32785 4.7329 7.88817 5.04287 8.35709C5.36078 8.81806 5.76612 9.20353 6.25888 9.51349C6.75164 9.81551 7.26825 10.0659 7.8087 10.2646C8.34914 10.4553 8.84588 10.6103 9.2989 10.7295L11.7786 11.3971C12.4144 11.564 13.1218 11.7945 13.9007 12.0886C14.6875 12.3826 15.4386 12.784 16.1539 13.2927C16.8771 13.7934 17.4732 14.4371 17.9421 15.224C18.411 16.0108 18.6455 16.9765 18.6455 18.1209C18.6455 19.4403 18.2998 20.6324 17.6083 21.6974C16.9248 22.7624 15.9234 23.6089 14.604 24.2368C13.2927 24.8646 11.6991 25.1786 9.82346 25.1786C8.07495 25.1786 6.56089 24.8964 5.2813 24.3321C4.00966 23.7678 3.00824 22.981 2.27704 21.9716C1.55379 20.9623 1.14448 19.79 1.04911 18.4548H4.10106C4.18053 19.3767 4.4905 20.1397 5.03095 20.7437C5.57934 21.3398 6.2708 21.7849 7.10532 22.0789C7.94778 22.3651 8.85383 22.5081 9.82346 22.5081C10.952 22.5081 11.9654 22.3253 12.8635 21.9597C13.7616 21.5862 14.4729 21.0696 14.9975 20.4099C15.522 19.7423 15.7843 18.9634 15.7843 18.0733C15.7843 17.2626 15.5578 16.6029 15.1048 16.0943C14.6517 15.5856 14.0557 15.1723 13.3165 14.8544C12.5774 14.5365 11.7786 14.2583 10.9203 14.0199L7.91599 13.1615C6.00852 12.6131 4.49844 11.8303 3.38575 10.813C2.27307 9.79564 1.71672 8.46439 1.71672 6.8192C1.71672 5.45218 2.08629 4.26001 2.82544 3.2427C3.57253 2.21743 4.57395 1.42265 5.8297 0.858361C7.0934 0.28612 8.50413 0 10.0619 0C11.6356 0 13.0344 0.282146 14.2583 0.846439C15.4823 1.40278 16.4519 2.16577 17.1672 3.1354C17.8905 4.10503 18.2719 5.2058 18.3117 6.4377H15.4505Z"
        fill="currentcolor"
      />
      <path
        d="M24.508 0.333807L31.7564 20.8868H32.0425L39.2909 0.333807H42.3905L33.4254 24.7494H30.3734L21.4083 0.333807H24.508Z"
        fill="currentcolor"
      />
      <path
        d="M46.1935 24.7494V0.333807H60.9287V2.95657H49.1501V11.2064H60.1657V13.8291H49.1501V22.1266H61.1194V24.7494H46.1935Z"
        fill="currentcolor"
      />
      <path
        d="M66.2577 24.7494V0.333807H69.2142V22.1266H80.5637V24.7494H66.2577Z"
        fill="currentcolor"
      />
      <path
        d="M80.5607 2.95657V0.333807H98.8724V2.95657H91.1948V24.7494H88.2383V2.95657H80.5607Z"
        fill="currentcolor"
      />
      <path
        d="M103.435 24.7494V0.333807H118.171V2.95657H106.392V11.2064H117.408V13.8291H106.392V22.1266H118.361V24.7494H103.435Z"
        fill="currentcolor"
      />
      <path
        d="M3.09964 41.3338L10.348 61.8868H10.6341L17.8825 41.3338H20.9821L12.017 65.7494H8.9651L0 41.3338H3.09964Z"
        fill="currentcolor"
      />
      <path d="M27.7417 41.3338V65.7494H24.7852V41.3338H27.7417Z" fill="currentcolor" />
      <path
        d="M33.6698 65.7494V41.3338H48.405V43.9566H36.6264V52.2064H47.642V54.8291H36.6264V63.1266H48.5957V65.7494H33.6698Z"
        fill="currentcolor"
      />
      <path
        d="M52.3987 43.9566V41.3338H70.7104V43.9566H63.0329V65.7494H60.0763V43.9566H52.3987Z"
        fill="currentcolor"
      />
      <path
        d="M94.6342 41.3338V65.7494H91.773L78.4684 46.5793H78.23V65.7494H75.2734V41.3338H78.1346L91.4869 60.5515H91.7253V41.3338H94.6342Z"
        fill="currentcolor"
      />
      <path
        d="M101.552 65.7494H98.4521L107.417 41.3338H110.469L119.434 65.7494H116.335L109.039 45.1964H108.848L101.552 65.7494ZM102.696 56.2121H115.19V58.8348H102.696V56.2121Z"
        fill="currentcolor"
      />
      <path
        d="M123.237 41.3338H126.766L135.064 61.6007H135.35L143.647 41.3338H147.176V65.7494H144.41V47.1993H144.172L136.542 65.7494H133.871L126.242 47.1993H126.003V65.7494H123.237V41.3338Z"
        fill="currentcolor"
      />
    </svg>
  </div>
</div>

<style lang="postcss">
  .splash {
    --animation-in-duration: 500ms;
    --animation-out-duration: 250ms;

    position: fixed;
    z-index: theme('zIndex.overlay');
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: theme('colors.design.bg.1');

    animation-name: splash-out;
    animation-duration: calc(var(--animation-out-duration) * 0.6);
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    animation-delay: calc(var(--animation-in-duration) + var(--animation-out-duration) * 0.4);
  }

  @keyframes splash-out {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(-100vh);
    }
  }

  .icon,
  .title {
    position: relative;
  }

  .title {
    display: flex;
    align-items: center;

    height: 100%;

    font-size: 34px;
    text-transform: uppercase;

    background-color: theme('colors.design.bg.1');
  }

  .splash--1 {
    & .icon,
    & .title {
      animation-name: splash-in-1;
      animation-duration: var(--animation-in-duration);
      animation-timing-function: cubic-bezier(0.55, 2.12, 0.19, 0.57);
    }

    & .icon {
      --translate-x: 30px;

      z-index: 2;
    }

    & .title {
      --translate-x: -30px;

      z-index: 1;
      padding-left: 6px;
    }
  }

  @keyframes splash-in-1 {
    from {
      transform: translateX(var(--translate-x));
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .splash--2 {
    --animation-timing-function-1: cubic-bezier(1, 1.85, 0.44, 0.7);
    --animation-timing-function-2: cubic-bezier(0.55, 2.12, 0.19, 0.57);
    --step-1-duration: calc(0.4 * var(--animation-in-duration));
    --step-2-duration: calc(0.3 * var(--animation-in-duration));
    --step-3-duration: calc(0.2 * var(--animation-in-duration));
    --step-rest: calc(0.1 * var(--animation-in-duration));
    --step-2-delay: calc(var(--step-1-duration) + var(--step-rest));
    --step-3-delay: calc(var(--step-2-delay) + var(--step-2-duration) + var(--step-rest));

    & .icon,
    & .title {
      position: relative;
    }

    & .icon {
      z-index: 1;
      transform: translateX(6px);

      overflow: hidden;

      animation-name: splash-in-2-step-2-icon-container;
      animation-duration: var(--step-2-duration);
      animation-timing-function: var(--animation-timing-function-1);
      animation-fill-mode: forwards;
      animation-delay: var(--step-2-delay);

      & svg {
        transform: translateX(70%);

        animation-name: splash-in-2-step-1-icon, splash-in-2-step-2-icon, splash-in-2-step-3-icon;
        animation-duration: var(--step-1-duration), var(--step-2-duration), var(--step-3-duration);
        animation-timing-function: var(--animation-timing-function-1),
          var(--animation-timing-function-1), var(--animation-timing-function-2);
        animation-fill-mode: forwards;
        animation-delay: 0ms, var(--step-2-delay), var(--step-3-delay);
      }
    }

    & .title {
      z-index: 2;
      overflow: hidden;
      padding-left: 6px;

      &::after {
        content: '';

        position: absolute;
        inset: 0 -2px 0 0;
        transform-origin: right;
        transform: scaleX(1);

        background-color: theme('colors.design.bg.1');

        animation-name: splash-in-2-step-1-title-overlay, splash-in-2-step-2-title-overlay,
          splash-in-2-step-3-title-overlay;
        animation-duration: var(--step-1-duration), var(--step-2-duration), var(--step-3-duration);
        animation-timing-function: var(--animation-timing-function-1),
          var(--animation-timing-function-1), var(--animation-timing-function-2);
        animation-fill-mode: forwards;
        animation-delay: 0ms, var(--step-2-delay), var(--step-3-delay);
      }

      & svg {
        transform-origin: left;
        transform: translateX(-20%);

        animation-name: splash-in-2-step-1-title, splash-in-2-step-3-title;
        animation-duration: var(--step-1-duration), var(--step-3-duration);
        animation-timing-function: var(--animation-timing-function-1),
          var(--animation-timing-function-2);
        animation-fill-mode: forwards;
        animation-delay: 0ms, var(--step-3-delay);
      }
    }
  }

  /* step 1 */
  @keyframes splash-in-2-step-1-icon {
    to {
      transform: translateX(45%);
    }
  }

  @keyframes splash-in-2-step-1-title {
    to {
      transform: translateX(5%);
    }
  }

  @keyframes splash-in-2-step-1-title-overlay {
    to {
      transform: scaleX(0.5);
    }
  }

  /* step 2 */
  @keyframes splash-in-2-step-2-icon {
    to {
      transform: translateX(10%);
    }
  }

  @keyframes splash-in-2-step-2-icon-container {
    to {
      transform: translateX(0);
    }
  }

  @keyframes splash-in-2-step-2-title-overlay {
    to {
      transform: scaleX(0.2);
    }
  }

  /* step 3 */
  @keyframes splash-in-2-step-3-icon {
    to {
      transform: translateX(0);
    }
  }

  @keyframes splash-in-2-step-3-title-overlay {
    to {
      transform: scaleX(0);
    }
  }

  @keyframes splash-in-2-step-3-title {
    to {
      transform: translateX(0);
    }
  }
</style>
