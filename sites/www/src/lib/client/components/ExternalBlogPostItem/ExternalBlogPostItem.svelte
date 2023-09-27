<script lang="ts">
  import { localizeExternalPost, type ExternalPost } from '$shared/data/blog';
  import type { Language } from '$shared/services/i18n';

  export let lang: Language;
  export let post: ExternalPost;
  let cls = '';
  export { cls as class };

  $: tPost = localizeExternalPost(lang, post);

  const titleClass = 'tp-h4 font-bold c-link c-link--preserved';
</script>

<article class="space-y-3 {cls}">
  <a href={tPost.href} rel="noreferrer" target="_blank" class="block w-fit">
    <slot name="title" class={titleClass} text={tPost.title}>
      <span class={titleClass}>{tPost.title}</span>
    </slot>
    <svg inline-src="icon/external-link" class="inline-block mb-2 ml-2" />
  </a>
  <p>{tPost.description}</p>
  <p class="font-medium">{tPost.author}</p>
</article>
