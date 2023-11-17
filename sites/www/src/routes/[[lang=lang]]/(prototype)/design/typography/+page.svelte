<script lang="ts">
  import { Breadcrumbs } from '$client/components/Breadcrumbs';

  import type { PageData } from './$types';

  export let data: PageData;

  const TYPOGRAPHY = [
    {
      name: 'H1',
      class: 'tp-h1',
      fontFamily: 'Lora',
      sp: {
        class: 'tp-h1@sp',
        fontSize: '3rem',
        lineHeight: '1.25',
        letterSpacing: '4%',
      },
      pc: {
        class: 'tp-h1@pc',
        fontSize: '4rem',
        lineHeight: '1.2813',
        letterSpacing: '6%',
      },
      example: 'Heading 1',
    },
    {
      name: 'H2',
      class: 'tp-h2',
      fontFamily: 'Lora',
      sp: {
        class: 'tp-h2@sp',
        fontSize: '2rem',
        lineHeight: '1.2813',
        letterSpacing: '4%',
      },
      pc: {
        class: 'tp-h2@pc',
        fontSize: '3rem',
        lineHeight: '1.25',
        letterSpacing: '4%',
      },
      example: 'Heading 2',
    },
    {
      name: 'H3',
      class: 'tp-h3',
      fontFamily: 'Lora',
      sp: {
        class: 'tp-h3@sp',
        fontSize: '1.4rem',
        lineHeight: '1.5',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-h3@pc',
        fontSize: '2rem',
        lineHeight: '1.2813',
        letterSpacing: '4%',
      },
      example: 'Heading 3',
    },
    {
      name: 'H4',
      class: 'tp-h4',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-h4@sp',
        fontSize: '1.25rem',
        lineHeight: '1.2',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-h4@pc',
        fontSize: '1.5rem',
        lineHeight: '1.292',
        letterSpacing: '0%',
      },
      example: 'Heading 4',
    },
    {
      name: 'H5',
      class: 'tp-h5',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-h5@sp',
        fontSize: '1.125rem',
        lineHeight: '1.333',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-h5@pc',
        fontSize: '1.125rem',
        lineHeight: '1.333',
        letterSpacing: '0%',
      },
      example: 'Heading 5',
    },
    {
      name: 'Body 1',
      class: 'tp-body1',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-body1@sp',
        fontSize: '1rem',
        lineHeight: '1.5',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-body1@pc',
        fontSize: '1rem',
        lineHeight: '1.5',
        letterSpacing: '0%',
      },
      example: 'Body 1',
    },
    {
      name: 'Body 2',
      class: 'tp-body2',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-body2@sp',
        fontSize: '0.875rem',
        lineHeight: '1.714',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-body2@pc',
        fontSize: '0.875rem',
        lineHeight: '1.714',
        letterSpacing: '0%',
      },
      example: 'Body 2',
    },
    {
      name: 'Caption 1',
      class: 'tp-cap1',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-cap1@sp',
        fontSize: '0.875rem',
        lineHeight: '1.571',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-cap1@pc',
        fontSize: '0.875rem',
        lineHeight: '1.571',
        letterSpacing: '0%',
      },
      example: 'Caption 1',
    },
    {
      name: 'Caption 2',
      class: 'tp-cap2',
      fontFamily: 'Inter',
      sp: {
        class: 'tp-cap2@sp',
        fontSize: '0.75rem',
        lineHeight: '1.833',
        letterSpacing: '0%',
      },
      pc: {
        class: 'tp-cap2@pc',
        fontSize: '0.75rem',
        lineHeight: '1.833',
        letterSpacing: '0%',
      },
      example: 'Caption 2',
    },
  ];

  $: t = data.translations.page;
</script>

<main class="tp-body1">
  <div class="c-container-design heading-container">
    <Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
    <h1 class="tp-h2@sp tb:tp-h1@pc font-medium uppercase">{t.title}</h1>
  </div>
  <div class="pt-20 pb-40 c-container-design">
    {#each TYPOGRAPHY as typo, i (typo.name)}
      {#if i > 0}
        <div class="bg-design-border-1 h-px w-full my-12" />
      {/if}
      <section>
        <div class="grid grid-cols-[1fr,auto,auto] gap-x-8 gap-y-1">
          <div class="contents">
            <p class="font-medium">Name</p>
            <h2 class="col-span-2 font-bold text-right">{typo.name}</h2>
          </div>
          <div class="contents">
            <p class="font-medium">Font family</p>
            <p class="col-span-2 text-right">{typo.fontFamily}</p>
          </div>
          <div class="contents">
            <p class="font-medium">Reactive CSS</p>
            <p class="col-span-2 text-right"><code>{typo.class}</code></p>
          </div>
          <div class="col-span-3 flex justify-between font-bold"></div>
          <div class="contents font-medium">
            <div class="font-bold mt-4"></div>
            <p class="mt-4">Desktop</p>
            <p class="text-right mt-4">Mobile</p>
          </div>
          <div class="contents">
            <p class="font-medium">Specific CSS</p>
            <p><code>{typo.pc.class}</code></p>
            <p><code>{typo.sp.class}</code></p>
          </div>
          <div class="contents">
            <p class="font-medium">Font size</p>
            <p>{typo.pc.fontSize}</p>
            <p class="text-right">{typo.sp.fontSize}</p>
          </div>
          <div class="contents">
            <p class="font-medium">Line height</p>
            <p>{typo.pc.lineHeight}</p>
            <p class="text-right">{typo.sp.lineHeight}</p>
          </div>
          <div class="contents">
            <p class="font-medium">Letter spacing</p>
            <p>{typo.pc.letterSpacing}</p>
            <p class="text-right">{typo.sp.letterSpacing}</p>
          </div>
        </div>
        <ul
          class="{typo.class} text-right tb:text-center border border-design-border-1 h-full flex items-center justify-center flex-col p-4"
        >
          {#each ['font-bold', 'font-medium', 'font-normal'] as weight}
            <li class={weight}>{typo.example}</li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</main>

<style lang="postcss">
  .heading-container {
    margin-top: calc(-1 * theme('spacing.header'));
    padding-top: calc(theme('spacing.header') + 20px);
    padding-bottom: 80px;
    background: theme('colors.design.bg.2');
  }

  section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: flex-start;

    @screen sp {
      grid-template-rows: auto auto;
    }

    @screen tb {
      grid-template-columns: 400px 1fr;
      gap: 80px;
    }

    @screen pc {
      gap: 100px;
    }
  }
</style>
