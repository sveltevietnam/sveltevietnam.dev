<script lang="ts">
  import { onMount } from 'svelte';

  import { gsap, Back } from '$3rd/gsap';
  import { browser } from '$app/environment';

  import { splash } from '../SplashScreen';

  export let text: string;
  export let animated = true;

  let container: HTMLDivElement;

  let observer: IntersectionObserver | null = null;
  let chars: HTMLElement[] = [];
  let intersected = false;

  onMount(() => {
    if (animated) {
      chars = Array.from(container.querySelectorAll('.split-char'));
      gsap.set(chars, { opacity: 0, y: 50, rotate: 15 });

      observer = new IntersectionObserver(
        (entries, observer) => {
          if (entries.some((e) => !!e.intersectionRatio)) {
            intersected = true;
            observer?.unobserve(container);
          }
        },
        { threshold: 1 },
      );
      observer.observe(container);
    }
    return {
      destroy() {
        observer?.unobserve(container);
      },
    };
  });

  $: if ($splash?.done && animated && intersected) {
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotate: 0,
      duration: 0.5,
      ease: Back.easeOut.config(1.4),
      stagger: 0.05,
    });
  }
</script>

<san class="split-text-container" bind:this={container}>
  {#if browser && animated}
    {#each text as char}
      <span class="split-char">{char}</span>
    {/each}
  {:else}
    {text}
  {/if}
</san>

<style lang="postcss">
  .split-text-container {
    overflow: hidden;
    display: inline-block;
  }

  .split-char {
    position: relative;
    overflow: hidden;
    display: inline-block;
    white-space: pre;
  }
</style>
