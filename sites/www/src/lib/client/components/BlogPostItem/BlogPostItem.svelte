<script lang="ts">
  import { FallbackImage } from '$client/components/FallbackImage';
  import { localizePost, type Post } from '$shared/data/blog';
  import type { Language } from '$shared/services/i18n';
  import { BLOG_PATH } from '$shared/services/navigation';
  import { formateDateForBlog } from '$shared/utils/datetime';

  export let alwaysVertical = false;
  export let post: Post;
  export let lang: Language;
  let cls = '';
  export { cls as class };

  $: tPost = localizePost(lang, post);

  const titleClass = 'tp-h4 font-bold c-link c-link--preserved';
</script>

<article class={cls} class:always-vertical={alwaysVertical}>
  <div>
    {#if tPost.ogImage}
      <img
        src={tPost.ogImage}
        alt={tPost.title}
        width="540"
        height="300"
        class="w-full h-auto object-cover object-center"
      />
    {:else}
      <div class="fallback-thumbnail">
        <FallbackImage />
      </div>
    {/if}
  </div>
  <div class="content">
    <a href="{BLOG_PATH}/{tPost.slug}" class="block w-fit">
      <slot name="title" class={titleClass} text={tPost.title}>
        <span class={titleClass}>{tPost.title}</span>
      </slot>
    </a>
    <ul class="flex items-center flex-wrap gap-2">
      {#each tPost?.tags ?? [] as tag}
        <li class="c-tag">{tag}</li>
      {/each}
    </ul>
    <p>{tPost.description}</p>
    <div class="flex items-center justify-between">
      <p class="font-medium">{tPost.authors.map((a) => a.name).join(', ')}</p>
      <p class="text-design-neutral-2">{formateDateForBlog(lang, tPost.date)}</p>
    </div>
  </div>
</article>

<style lang="postcss">
  article {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 32px;

    @screen tb {
      &:not(.always-vertical) {
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr;
        gap: 24px;
      }
    }
  }

  .fallback-thumbnail {
    width: 100%;
    height: 200px;

    @screen tb {
      article.always-vertical & {
        height: 300px;
      }

      article:not(.always-vertical) & {
        width: 200px;
      }
    }
  }

  .content {
    @space-y 16px;

    @screen tb {
      article:not(.always-vertical) & {
        @space-y 12px;
      }
    }
  }
</style>
