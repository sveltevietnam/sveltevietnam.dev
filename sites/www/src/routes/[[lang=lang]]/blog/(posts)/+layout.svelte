<script lang="ts">
  import Avatar from '@svelte-put/avatar/Avatar.svelte';
  import { copy } from '@svelte-put/copy';
  import { toc, toclink, createTocStore } from '@svelte-put/toc';

  import { page } from '$app/stores';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import { FallbackImage } from '$client/components/FallbackImage';
  import MailRegistrationForm from '$client/components/MailRegistrationForm/MailRegistrationForm.svelte';
  import { noti } from '$client/notifications';
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
  $: tMail = data.translations.mail;

  function onCopiedCanonical() {
    noti.info(t.urlCopyNotice);
  }
  const tocStore = createTocStore();
  $: tocItems = Object.values($tocStore.items);
</script>

<main class="c-container-design">
  <Breadcrumbs {breadcrumbs} class="mt-6" />
  <article class="mt-8 pb-[120px] tb:pb-[200px] tb:mt-[60px]">
    {#if isLangNotSupported}
      <p class="mb-[60px] p-4 border rounded-lg border-design-neutral-1">
        {@html t.unsupportedLanguage}
      </p>
    {/if}
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
                  <a
                    href={author.link}
                    rel="noreferrer"
                    target="_blank"
                    class="c-link c-link--preserved"
                  >
                    {author.name}
                  </a>
                </p>
                <p class="tp-cap1">{author.title}</p>
              </div>
            </li>
          {/each}
        </ul>
        <div class="separator" />
      </div>
      <div class="flex justify-between text-design-neutral-2 mt-2 tp-cap1">
        {#if post?.readMinutes}
          <p class="shrink-0">
            {post.readMinutes}
            {t.readMinutes}
          </p>
        {/if}
        {#if post?.date}
          <p class="text-right flex-1 shrink-0">
            {formateDateForBlog(data.language, post?.date)}
          </p>
        {/if}
      </div>
    </section>

    <div class="grid grid-cols-[3fr,1fr] gap-[60px] mt-[60px]">
      <section
        class="post-content prose dark:prose-invert max-w-full rose-svelte-vn"
        use:toc={{
          store: tocStore,
          selector: ':where(h2,h3,h4,h5,h6)',
          observe: true,
        }}
      >
        <slot />
      </section>

      <aside class="space-y-[60px]">
        <ul class="flex items-center gap-4">
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
              target="_blank"
              rel="noreferrer"
            >
              <svg inline-src="simpleicon/facebook" width="20" height="20" />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/intent/tweet?url={encodedCanonical}&text={encodedTitle}"
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              target="_blank"
              rel="noreferrer"
            >
              <svg inline-src="simpleicon/twitter" width="20" height="20" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/shareArticle?mini=true&url={encodedCanonical}&title={encodedTitle}"
              class="p-[10px] block w-fit c-link-neutral border border-current rounded-full"
              target="_blank"
              rel="noreferrer"
            >
              <svg inline-src="simpleicon/linkedin" width="20" height="20" />
            </a>
          </li>
        </ul>

        <nav aria-label={t.tableOfContents.title} class="toc">
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
                  class="c-link c-link--preserved inline-block data-current:text-primary my-2"
                  class:ml-4={level === '3'}
                  class:ml-8={level === '4'}
                  class:ml-12={level === '5'}
                  class:ml-16={level === '6'}
                >
                  {tocItem.text}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </aside>
    </div>
    <section
      class="mt-[160px] grid grid-cols-[2fr,1fr] p-10 border border-current rounded-[20px] gap-10"
    >
      <p class="tp-h2 font-medium">{t.mailingListCall}</p>
      <MailRegistrationForm
        t={tMail}
        language={data.language}
        colorScheme={data.colorScheme}
        superValidated={data.mailForm}
      />
    </section>
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

  .toc {
    position: sticky;
    top: calc(var(--header-height) + 60px);
  }
</style>
