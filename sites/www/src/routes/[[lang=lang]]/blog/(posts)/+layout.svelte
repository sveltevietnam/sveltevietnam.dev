<script lang="ts">
  import Avatar from '@svelte-put/avatar/Avatar.svelte';
  import { copy } from '@svelte-put/copy';
  import { toc, toclink, createTocStore } from '@svelte-put/toc';

  import { page } from '$app/stores';
  import { BlogPostItem } from '$client/components/BlogPostItem';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import ExternalBlogPostItem from '$client/components/ExternalBlogPostItem/ExternalBlogPostItem.svelte';
  import { FallbackImage } from '$client/components/FallbackImage';
  import { noti } from '$client/notifications';
  import { textTip } from '$client/tooltips';
  import type { Breadcrumb } from '$shared/services/navigation';
  import { formateDateForBlog } from '$shared/utils/datetime';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: meta = $page.data.meta;
  $: post = $page.data.post;
  $: isLangNotSupported = !$page.data.supportedLanguages?.includes($page.data.language);
  $: breadcrumbs = [...data.breadcrumbs, { label: post?.title ?? '' }] satisfies Breadcrumb[];

  $: encodedCanonical = encodeURIComponent(meta?.canonical ?? '');
  $: encodedTitle = encodeURIComponent(post?.title ?? '');

  $: t = data.translations.layout;

  function onCopiedCanonical() {
    noti.info(t.urlCopyNotice);
  }
  const tocStore = createTocStore();
  $: tocItems = Object.values($tocStore.items);
</script>

<main class="c-container-design">
  <Breadcrumbs {breadcrumbs} class="mt-6" />
  <article class="mt-8 tb:mt-[60px]">
    <section>
      {#if post?.ogImage}
        <img
          src={post?.ogImage}
          alt={post?.title}
          width="1000"
          height="500"
          class="w-full h-auto"
        />
      {:else}
        <FallbackImage class="h-[500px] w-auto" />
      {/if}
      <div class="space-y-6 mt-8">
        <h1 class="tp-h1 font-bold">{post?.title}</h1>
        <ul class="flex items-center flex-wrap gap-2">
          {#each post?.tags ?? [] as tag}
            <li class="c-tag">{tag}</li>
          {/each}
        </ul>
        <!-- <div class="separator" /> -->
        <ul class="flex items-start gap-6">
          {#each post?.authors ?? [] as author}
            <li class="flex items-center gap-3">
              <!-- extract into global avatar component -->
              <Avatar
                class="rounded-full"
                src={author.avatarUrl}
                uiAvatar={author.name}
                size={40}
              />
              <div>
                <p class="font-medium">
                  <a href={author.link} class="c-link c-link--preserved" external>
                    {author.name}
                  </a>
                </p>
                <p class="tp-cap1">{author.title}</p>
              </div>
            </li>
          {/each}
        </ul>
        <div class="tp-cap1 text-design-neutral-2">
          <div class="separator mb-2" />
          <div class="flex justify-between text-design-neutral-2 tp-cap1">
            <div class="shrink-0">
              {#if !isLangNotSupported}
                {@const text =
                  data.language === post?.originalLang
                    ? t.language.original
                    : t.language.translated}
                {#key data.language}
                  <p>
                    {text.label}
                    <svg
                      inline-src="google/info"
                      class="inline-block fill-current align-text-top ml-1 cursor-help"
                      height="16"
                      width="16"
                      use:textTip={{ content: text.description }}
                    />
                  </p>
                {/key}
              {/if}
              {#if post?.readMinutes}
                <p class="mt-1">
                  {post.readMinutes}
                  {t.readMinutes}
                </p>
              {/if}
            </div>
            {#if post?.date}
              <p class="text-right flex-1 shrink-0">
                {formateDateForBlog(data.language, post?.date)}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </section>

    {#if isLangNotSupported}
      <p class="mt-[60px] p-4 border rounded-lg border-design-neutral-1">
        {@html t.language.unsupported}
      </p>
    {/if}

    <div class="post-grid mt-[60px]">
      {#key data.language}
        <section
          class="post-content prose dark:prose-invert max-w-full rose-svelte-vn"
          use:toc={{
            store: tocStore,
            selector: ':where(h2,h3,h4,h5,h6)',
            observe: true,
          }}
        >
          <slot />
          <p>
            {t.editLink.intro}
            <a href={post?.githubUrl} external>{t.editLink.label}</a>
          </p>
        </section>
      {/key}

      <section class="post-others">
        <h2 class="tp-h3 after:mt-2 after:separator">{t.more}</h2>
        <ul class="mt-8 space-y-8">
          {#each data.more.external as post}
            <li class="before:mb-8 before:separator first-of-type:before:hidden">
              <BlogPostItem {post} lang={data.language} alwaysVertical />
            </li>
          {/each}
          {#each data.more.internal as post}
            <li class="before:mb-8 before:separator">
              <ExternalBlogPostItem {post} lang={data.language} />
            </li>
          {/each}
        </ul>
      </section>

      <section class="post-share">
        <h2 class="tp-h3 after:mt-2 after:separator">{t.share}</h2>
        <ul class="flex items-center gap-4 mt-8">
          <li>
            <button
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              on:copied={onCopiedCanonical}
              use:copy={{ text: meta?.canonical ?? '' }}
            >
              <svg inline-src="google/share" width="20" height="20" />
            </button>
          </li>
          <li>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u={encodedCanonical}"
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              external
            >
              <svg inline-src="simpleicon/facebook" width="20" height="20" />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/intent/tweet?url={encodedCanonical}&text={encodedTitle}"
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              external
            >
              <svg inline-src="simpleicon/twitter" width="20" height="20" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/shareArticle?mini=true&url={encodedCanonical}&title={encodedTitle}"
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              external
            >
              <svg inline-src="simpleicon/linkedin" width="20" height="20" />
            </a>
          </li>
        </ul>
      </section>

      <section class="post-toc">
        <nav aria-label={t.tableOfContents.title}>
          <h2 class="tp-h3 font-medium after:mt-2 after:separator">{t.tableOfContents.title}</h2>
          <ul class="mt-8">
            {#each tocItems as tocItem (tocItem.id)}
              {@const level = tocItem.element.tagName.slice(1)}
              <li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                  use:toclink={{
                    tocItem,
                    store: tocStore,
                    observe: {
                      attribute: 'data-current',
                    },
                  }}
                  class="tb:data-current:text-primary my-2 block"
                  class:ml-4={level === '3'}
                  class:ml-8={level === '4'}
                  class:ml-12={level === '5'}
                  class:ml-16={level === '6'}
                >
                  <span class="c-link c-link--preserved">
                    {tocItem.text}
                  </span>
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </section>
    </div>
  </article>
</main>

<style lang="postcss">
  :global(:where(h2, h3, h4, h5, h6)) {
    position: relative;

    & :global(.heading-anchor) {
      position: absolute;
      top: 0;
      right: 100%;
      bottom: 0;

      margin-right: 8px;

      font-weight: inherit;
      text-decoration: none;

      opacity: 0;

      transition: opacity 200ms theme('transitionTimingFunction.DEFAULT');
    }

    &:hover :global(.heading-anchor) {
      opacity: 1;
    }
  }

  .post-grid {
    position: relative;

    display: grid;
    grid-template-areas:
      'toc'
      'content'
      'share'
      'others';
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    row-gap: 60px;

    @screen tb {
      grid-template-areas:
        'content share'
        'content toc'
        'content others';
      grid-template-columns: 3fr 1fr;
      grid-template-rows: auto 1fr auto;
      column-gap: 60px;
    }
  }

  .post-content {
    grid-area: content;
  }

  .post-share {
    grid-area: share;
    height: fit-content;
  }

  .post-others {
    grid-area: others;
    height: fit-content;
  }

  .post-toc {
    grid-area: toc;

    & nav {
      @screen tb {
        position: sticky;
        top: calc(var(--header-height) + 60px);
      }
    }
  }
</style>
