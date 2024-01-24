---
to: <%= baseDir %>/+page.svelte
unless_exists: true
---
<script lang="ts">
  import { localizeBlogContent } from '$lib/data/blog';
	import { getLangContext } from '$lib/contexts/lang';

  import { content } from './_page/data';

	const { lang } = getLangContext();
	$: component = localizeBlogContent($lang, content);
</script>

<svelte:component this={component} />
