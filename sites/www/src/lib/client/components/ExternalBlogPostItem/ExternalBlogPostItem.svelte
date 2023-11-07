<script lang="ts">
  import { getLangContext } from '$client/contexts/lang';
  import { localizeExternalPost, type ExternalPost } from '$shared/data/blog';

  export let post: ExternalPost;
  let cls = '';
  export { cls as class };

  const langStore = getLangContext();
  $: lang = $langStore;

  $: tPost = localizeExternalPost(lang, post);

  const titleClass = 'tp-h4 font-bold c-link c-link--preserved';
</script>

<article class="space-y-3 {cls}">
  <a href={tPost.href} class="block w-fit" external>
    <svg inline-src="icon/external-link" class="inline-block mb-2 mr-2" />
    <slot name="title" class={titleClass} text={tPost.title}>
      <span class={titleClass}>{tPost.title}</span>
    </slot>
  </a>
  <p>{tPost.description}</p>
  <p class="font-medium">{tPost.author}</p>
</article>
