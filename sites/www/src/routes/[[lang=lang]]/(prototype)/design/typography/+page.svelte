<script lang="ts">
  const TYPOGRAPHY = [
    {
      name: 'H1',
      class: 'typo-h1',
      fontFamily: 'Lora',
      fontSize: '64px',
      lineHeight: '82px',
      letterSpacing: '6%',
      paragraphSpacing: '0px',
      example: 'Heading 1',
    },
    {
      name: 'H2',
      class: 'typo-h2',
      fontFamily: 'Lora',
      fontSize: '48px',
      lineHeight: '61px',
      letterSpacing: '4%',
      paragraphSpacing: '8px',
      example: 'Heading 2',
    },
    {
      name: 'H3',
      class: 'typo-h3',
      fontFamily: 'Lora',
      fontSize: '32px',
      lineHeight: '41px',
      letterSpacing: '4%',
      paragraphSpacing: '0px',
      example: 'Heading 3',
    },
    {
      name: 'H4',
      class: 'typo-h4',
      fontFamily: 'Inter',
      fontSize: '24px',
      lineHeight: '24px',
      letterSpacing: '0%',
      paragraphSpacing: '8px',
      example: 'Heading 4',
    },
    {
      name: 'H5',
      class: 'typo-h5',
      fontFamily: 'Inter',
      fontSize: '18px',
      lineHeight: '22px',
      letterSpacing: '0%',
      paragraphSpacing: '12px',
      example: 'Heading 5',
    },
    {
      name: 'Body 1',
      class: 'typo-body1',
      fontFamily: 'Inter',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0%',
      paragraphSpacing: '12px',
      example: 'Body 1',
    },
    {
      name: 'Body 2',
      class: 'typo-body2',
      fontFamily: 'Inter',
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '0%',
      paragraphSpacing: '12px',
      example: 'Body 2',
    },
    {
      name: 'Caption 1',
      class: 'typo-caption1',
      fontFamily: 'Inter',
      fontSize: '14px',
      lineHeight: '22px',
      letterSpacing: '0%',
      paragraphSpacing: '0%',
      example: 'Caption 1',
    },
    {
      name: 'Caption 2',
      class: 'typo-caption2',
      fontFamily: 'Inter',
      fontSize: '12px',
      lineHeight: '22px',
      letterSpacing: '0%',
      paragraphSpacing: '0%',
      example: 'Caption 2',
    },
    {
      name: 'Link',
      class: 'typo-link underline',
      fontFamily: 'Inter',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0%',
      paragraphSpacing: '12px',
      example: 'Link',
    },
  ];
</script>

<main>
  <div class="c-container-design heading-container">
    <h1 class="typo-h1 font-bold">Typography</h1>
  </div>
  <div class="pt-20 py-40 c-container-design">
    {#each TYPOGRAPHY as typo, i (typo.name)}
      {#if i > 0}
        <div class="bg-black/20 h-px w-full my-12" />
      {/if}
      <section>
        <h2 class="sr-only">{typo.name}</h2>
        <ul class="typo-body1 space-y-0.5">
          <li class="font-medium">{typo.name}</li>
          <li class="font-medium">{typo.fontFamily}</li>
          <li class="font-medium">{typo.fontSize}</li>
          <li>Line height {typo.lineHeight}</li>
          <li>Letter spacing {typo.letterSpacing}</li>
          <li>Paragraph spacing {typo.paragraphSpacing}</li>
        </ul>
        <ul class="{typo.class} sp:text-right">
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
    padding-top: calc(theme('spacing.header') + 80px);
    padding-bottom: 80px;
    background: theme('colors.design.bg.2');
  }

  section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: center;

    @screen sp {
      grid-template-rows: auto auto;
    }

    @screen tb {
      grid-template-columns: auto 1fr;
      gap: 120px;
    }

    @screen pc {
      gap: 320px;
    }
  }
</style>
