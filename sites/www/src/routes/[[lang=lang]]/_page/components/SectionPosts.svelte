<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { BlogPostItem } from '$client/components/BlogPostItem';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import ExternalBlogPostItem from '$client/components/ExternalBlogPostItem/ExternalBlogPostItem.svelte';
  import { SplitText } from '$client/components/SplitText';
  import type { ExternalPost, Post } from '$shared/data/blog';
  import type { Language } from '$shared/services/i18n';
  import { BLOG_PATH } from '$shared/services/navigation';

  import { translations } from '../translation';

  export let lang: Language;
  export let posts: Post[];
  export let externalPost: ExternalPost | undefined;

  $: t = translations[lang].posts;
</script>

<section class="c-container-design mt-[80px] tb:mt-[120px]">
  <ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
    <a href={BLOG_PATH} title={t.title} class="section-title-container">
      <h2 class=" tp-h2 uppercase">
        <SplitText text={t.title} />
      </h2>
      <AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
    </a>
  </ConsecutiveFadeUpIntro>
  <p class="section-desc mt-6" use:intersect>{@html t.description}</p>

  <div class="flex upto-tb:flex-col gap-10 tb:gap-[60px] mt-10 tb:mt-[60px]">
    <div class="flex-1">
      {#if posts[0]}
        <div use:intersect>
          <BlogPostItem {lang} post={posts[0]} alwaysVertical />
        </div>
      {/if}
    </div>
    <div class="space-y-10 flex-1">
      {#each posts.slice(1) as post}
        <div use:intersect class="tb:before:hidden before:separator before:mb-10">
          <BlogPostItem {lang} {post} />
        </div>
      {/each}
      {#if externalPost}
        <div use:intersect class="before:separator before:mb-10">
          <ExternalBlogPostItem {lang} post={externalPost} />
        </div>
      {/if}
    </div>
  </div>
</section>
