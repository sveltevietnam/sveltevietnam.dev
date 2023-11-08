<script>
  import { page } from '$app/stores';
</script>

<main class="grid h-screen w-screen place-items-center text-center">
  <section>
    <h1 class="tp-h1 font-bold">{$page.status}</h1>
    <p>Oops, {$page.error?.message}</p>
  </section>
</main>
