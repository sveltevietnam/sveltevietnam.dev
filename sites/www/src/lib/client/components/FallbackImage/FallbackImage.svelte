<script lang="ts">
  let cls = '';
  export { cls as class };
</script>

<div class="fallback-image {cls}">
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 27.5L5 40L20 52.5"
      stroke="white"
      stroke-opacity="0.4"
      stroke-width="4"
      stroke-linecap="square"
    />
    <path
      d="M60 27.5L75 40L60 52.5"
      stroke="white"
      stroke-opacity="0.4"
      stroke-width="4"
      stroke-linecap="square"
    />
    <path
      d="M50 12.5L30 67.5"
      stroke="white"
      stroke-opacity="0.4"
      stroke-width="4"
      stroke-linecap="square"
    />
  </svg>
</div>

<style lang="postcss">
  :global(:where(.fallback-image)) {
    display: grid;
    flex: 1;
    place-items: center;

    width: 100%;
    height: 100%;

    background-color: #707070;
    border-radius: 8px;
  }
</style>
