<script lang="ts">
  export let text = '';

  $: words = text.split(' ');
</script>

{#each words as word, i}
  <span class="word inline-block relative">
    {#each word as char}
      <span class="char inline-block relative">{char}</span>
    {/each}
  </span>
  {#if i < words.length - 1}
    <span> </span>
  {/if}
{/each}
