<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { BlogPostItem } from '$client/components/BlogPostItem';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { ExternalBlogPostItem } from '$client/components/ExternalBlogPostItem';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { SplitText } from '$client/components/SplitText';
  import ToBeAnnounced from '$client/components/ToBeAnnounced/ToBeAnnounced.svelte';

  import type { PageData } from './$types';

  export let data: PageData;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;

  const ISSUE_TEMPLATE_LINK = {
    vi: {
      proposePost:
        'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=vi_blog_post_proposal.yaml&title=%C4%90%E1%BB%81+ngh%E1%BB%8B+%C4%91%C4%83ng+b%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E',
      requestExternalPost:
        'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=vi_external_blog_post_link_request.yaml&title=Li%C3%AAn+k%E1%BA%BFt+b%C3%A0i+vi%E1%BA%BFt+ngo%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E',
    },
    en: {
      proposePost:
        'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=en_blog_post_proposal.yaml&title=Blog+Post+Proposal%3A+%3Cshort+title+of+blog+post%3E',
      requestExternalPost:
        'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=en_external_blog_post_link_request.yaml&title=External+Blog+Post+Link+Request%3A+%3Cshort+title+of+blog+post%3E',
    },
  } as const;

  function splitPosts(posts: typeof data.posts) {
    const { internal, external } = posts;
    return {
      topPosts: internal.slice(0, 2),
      otherPosts: internal.slice(2),
      topExternalPost: external.at(0),
      otherExternalPosts: external.slice(1),
    };
  }
  $: ({ topPosts, otherPosts, topExternalPost, otherExternalPosts } = splitPosts(data.posts));
</script>

<main class="c-container-design">
  <div class="mt-6" use:intersect>
    <Breadcrumbs breadcrumbs={data.breadcrumbs} />
  </div>
  <div class="space-y-[60px] tb:space-y-[120px] pb-[120px] tb:pb-40 mt-8">
    <section class="tb:flex tb:justify-between tb:flex-row" use:intersect>
      <div class="">
        <h1 class="tp-h1 uppercase">{t.title}</h1>
        <p class="tp-h4 mt-6 tb:mt-8">{t.subtitle}</p>
      </div>
      <div class="sp:mt-8">
        <!-- <img
          src={keyVisuals}
          alt=""
          width="548"
          height="547"
          class="w-full h-auto max-w-[548px]"
        /> -->
      </div>
    </section>

    {#if topPosts.length || topExternalPost}
      <section class="flex upto-tb:flex-col gap-6 tb:gap-10">
        <h2 class="sr-only">{t.recent.title}</h2>
        <div class="flex-1">
          {#if topPosts[0]}
            <div use:intersect>
              <BlogPostItem lang={data.language} post={topPosts[0]} alwaysVertical />
            </div>
          {/if}
        </div>
        <div class="space-y-6 flex-1">
          {#if topPosts[1]}
            <div use:intersect class="tb:before:hidden before:separator before:mb-6">
              <BlogPostItem lang={data.language} post={topPosts[1]} />
            </div>
          {/if}
          {#if topExternalPost}
            <div use:intersect class="before:separator before:mb-6">
              <ExternalBlogPostItem lang={data.language} post={topExternalPost} />
            </div>
          {/if}
        </div>
      </section>
    {/if}

    <div class="grid grid-cols-1 pc:grid-cols-2 gap-[60px] tb:gap-[40px]">
      <section>
        <ConsecutiveFadeUpIntro selector=".char">
          <h2 class="tp-h2 uppercase">
            <SplitText text={t.introduction.title} />
          </h2>
        </ConsecutiveFadeUpIntro>
        <div class="mt-6 space-y-4" use:intersect>
          {#each t.introduction.description as p}
            <p>{@html p}</p>
          {/each}
        </div>
      </section>
      <section>
        <ConsecutiveFadeUpIntro selector=".char">
          <h2 class="tp-h2 uppercase">
            <SplitText text={t.contribute.title} />
          </h2>
        </ConsecutiveFadeUpIntro>
        <p use:intersect class="mt-6">{t.contribute.description}</p>
        <ul class="divider-border divide-y font-medium mt-4 max-w-[548px]" use:intersect>
          <li>
            <a
              href={ISSUE_TEMPLATE_LINK[data.language].proposePost}
              class="c-link-box"
              target="_blank"
              rel="noreferrer"
            >
              <span>{t.contribute.links.proposePost}</span>
              <svg inline-src="icon/external-link" />
            </a>
          </li>
          <li>
            <a
              href={ISSUE_TEMPLATE_LINK[data.language].requestExternalPost}
              class="c-link-box"
              target="_blank"
              rel="noreferrer"
            >
              <span>{t.contribute.links.requestExternalPost}</span>
              <svg inline-src="icon/external-link" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md"
              class="c-link-box"
              target="_blank"
              rel="noreferrer"
            >
              <span>{t.contribute.links.readCodeGuidelines}</span>
              <svg inline-src="icon/external-link" />
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div class="grid grid-cols-1 tb:grid-cols-[2fr,1fr] gap-[60px] tb:gap-10">
      <section>
        <ConsecutiveFadeUpIntro selector=".char">
          <h2 class="tp-h2 uppercase after:mt-2 after:separator">
            <SplitText text={t.posts.title} />
          </h2>
        </ConsecutiveFadeUpIntro>
        {#if otherPosts.length}
          <ul class="space-y-6 mt-6">
            {#each otherPosts as post}
              <li class="first-of-type:before:hidden before:mb-6 before:separator" use:intersect>
                <BlogPostItem lang={data.language} {post} />
              </li>
            {/each}
          </ul>
        {:else}
          <div use:intersect class="mt-6">
            <ToBeAnnounced>
              <p class="text-center">
                {t.posts.tba.description}
                <a
                  href={ISSUE_TEMPLATE_LINK[data.language].proposePost}
                  class="c-link"
                  target="_blank"
                  rel="noreferrer">{t.posts.tba.cta}</a
                >.
              </p>
            </ToBeAnnounced>
          </div>
        {/if}
      </section>
      <div>
        <section>
          <ConsecutiveFadeUpIntro selector=".char">
            <h2 class="tp-h2 uppercase after:mt-2 after:separator">
              <SplitText text={t.externalPosts.title} />
            </h2>
          </ConsecutiveFadeUpIntro>
          {#if otherExternalPosts.length}
            <ul class="space-y-6 mt-6">
              {#each otherExternalPosts as post}
                <li class="first-of-type:before:hidden before:mb-6 before:separator" use:intersect>
                  <ExternalBlogPostItem lang={data.language} {post} />
                </li>
              {/each}
            </ul>
          {:else}
            <div use:intersect class="mt-6">
              <ToBeAnnounced>
                <p class="text-center">
                  {t.externalPosts.tba.description}
                  <a
                    href={ISSUE_TEMPLATE_LINK[data.language].requestExternalPost}
                    class="c-link"
                    target="_blank"
                    rel="noreferrer">{t.externalPosts.tba.cta}</a
                  >.
                </p>
              </ToBeAnnounced>
            </div>
          {/if}
        </section>
        <div
          class="border-current border rounded-[20px] p-6 tb:mx-6 mt-[60px] tb:sticky tb:top-[calc(var(--header-height)+60px)]"
          use:intersect
        >
          <p>{t.mail.description}</p>
          <MailRegistrationForm
            t={tMail}
            language={data.language}
            colorScheme={data.colorScheme}
            superValidated={data.mailForm}
            class="mt-6"
          />
        </div>
      </div>
    </div>
  </div>
</main>
