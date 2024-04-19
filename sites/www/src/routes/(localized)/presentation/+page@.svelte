<script lang="ts">
	import Reveal from 'reveal.js';
	import { onMount } from 'svelte';

	import imgSveltePreprocessor from './_page/images/svelte-preprocessor.png';
	import imgPreprocessBlog from './_page/images/preprocess-blog.png';
  import { options } from './_page/reveal.config';
	import './_page/reveal.css';

	onMount(async () => {
		const deck = new Reveal(options);

		deck.on( 'fragmentshown', event => {
			if ('fragment' in event) {
				(event.fragment as HTMLElement).dispatchEvent(new CustomEvent('revealin'));
			}
		});

		deck.on( 'fragmenthidden', event => {
			if ('fragment' in event) {
				(event.fragment as HTMLElement).dispatchEvent(new CustomEvent('revealout'));
			}
		});

		deck.initialize();
	});
</script>

<main class="reveal">
	<div class="slides">
		<section class="slide" data-transition="fade" data-auto-animate>
			<p class="text-svelte">Svelte</p>
		</section>

		<section class="slide" data-auto-animate data-transition="fade">
			<p class="text-svelte">Svelte</p>
			<p>
				is a framework for building user interface on the web
			</p>
		</section>

		<section class="slide" data-transition="slide">
			<svg inline-src="./_page/images/svelte-and-kit-version-timeline.svg" class="mx-auto" />
		</section>

		<section class="slide" data-transition="slide">
			<p>
				A result of
				<span class="fragment fade-up">
					more than <strong class="text-svelte">13 500</strong> commits,
				</span>
				<span class="fragment fade-up">
					<strong class="text-svelte">500</strong> contributors,
				</span>
				<span class="fragment fade-up">
					and <strong class="text-svelte">1 million</strong> weekly downloads.
				</span>
			</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>
				Today, Svelte is used by these companies:
			</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>
				Today, Svelte is used by these companies:
			</p>
			<p>Apple, Yelp, New York Times, IKEA, Spotify, Cloudflare, Brave </p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p class="text-lg">
				People use Svelte because they like Svelte
			</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p class="text-lg">
				People use Svelte because they like Svelte
			</p>
			<p class="text-lg">
				We're not trying to be the most popular framework.
			</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p class="text-lg">
				People use Svelte because they like Svelte
			</p>
			<p class="text-lg">
				We're not trying to be the most popular framework.
			</p>
			<p class="text-lg">
				Instead of striving to be the fastest or smallest or whateverest, we explicitly aim to be the framework with the <strong class="text-svelte">best vibes</strong>.
			</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p class="text-lg">
				People use Svelte because they like Svelte
			</p>
			<p class="text-lg">
				We're not trying to be the most popular framework.
			</p>
			<p class="text-lg">
				Instead of striving to be the fastest or smallest or whateverest, we explicitly aim to be the framework with the <strong class="text-svelte">best vibes</strong>.
			</p>
			<p class="text-right text-base">- Rich Harris, discussing Svelte Tenets in Svelte London meetup, January 2024</p>
		</section>

		<section class="slide" data-transition="fade" data-auto-animate>
			<p>Why should you <span class="text-svelte">use</span> Svelte?</p>
		</section>
		<section class="slide" data-transition="fade" data-auto-animate>
			<p>Why should you <span class="text-svelte line-through">use</span> Svelte?</p>
		</section>
		<section class="slide" data-transition="fade">
			<p>What can you <span class="text-svelte">learn</span> from Svelte?</p>
		</section>

		<section class="slide" data-transition="slide">
			<p class="text-svelte">Come for Svelte, stay for the Web</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Mission 1: </p>
			</div>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Mission 1: </p>
				<p>implement a "clickoutside" feature</p>
			</div>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Mission 1: </p>
				<p>implement a "clickoutside" feature</p>
			</div>
			<iframe class="w-full h-[500px]" data-src="https://www.sveltevietnam.dev/vi/blog/20240420-den-voi-web-thong-qua-svelte" data-preload></iframe>
		</section>

		<section class="slide" data-transition="slide">
			<p>How would you do that in vanilla Javascript?</p>
		</section>

		<section class="slide" data-transition="slide">
{@html `
<pre class="p-4 shiki shiki-themes light-plus dark-plus" style="background-color: rgb(255, 255, 255); --shiki-dark-bg: #1E1E1E; color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;" data-lang="javascript" data-num-lines="7"><code><span class="line" data-line="1"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">export</span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;"> function</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;"> clickoutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">) {</span></span>
<span class="line" data-line="2"><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">  window</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">addEventLister</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;">'click'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">, (</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">event</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">) </span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">=&gt;</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> {</span></span>
<span class="line" data-line="3"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">    if</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> (!</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">contains</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">event</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">target</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">)) {</span></span>
<span class="line" data-line="4"><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">      node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">dispatchEvent</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">new</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;"> CustomEvent</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;">'clickoutside'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">));</span></span>
<span class="line" data-line="5"><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">    }</span></span>
<span class="line" data-line="6"><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">  });</span></span>
<span class="line" data-line="7"><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">}</span></span></code></pre>
`}
		</section>

		<section class="slide" data-transition="slide">
{@html `
<pre class="p-4 shiki shiki-themes light-plus dark-plus" style="background-color: rgb(255, 255, 255); --shiki-dark-bg: #1E1E1E; color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;" data-lang="html" data-num-lines="14"><code><span class="line" data-line="1"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">script</span><span style="color: rgb(229, 0, 0); --shiki-dark: #9CDCFE;"> type</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">=</span><span style="color: rgb(0, 0, 255); --shiki-dark: #CE9178;">"module"</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span>
<span class="line" data-line="2"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">  import</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> { </span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">clickoutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> } </span><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">from</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;"> 'clickoutside.js'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">;</span></span>
<span class="line" data-line="3"></span>
<span class="line" data-line="4"><span style="color: rgb(0, 128, 0); --shiki-dark: #6A9955;">  // tham chiếu đến phần tử cần thiết</span></span>
<span class="line" data-line="5"><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">  const</span><span style="color: rgb(0, 112, 193); --shiki-dark: #4FC1FF;"> node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> =</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;"> document</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">getElementById</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;">'my-element'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">);</span></span>
<span class="line" data-line="6"></span>
<span class="line" data-line="7"><span style="color: rgb(0, 128, 0); --shiki-dark: #6A9955;">  // thiết lập sự kiện clickoutside</span></span>
<span class="line" data-line="8"><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">  clickoutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">);</span></span>
<span class="line" data-line="9"></span>
<span class="line" data-focus="" data-line="10"><span style="color: rgb(0, 128, 0); --shiki-dark: #6A9955;">  // thao tác khi clickoutside xảy ra</span></span>
<span class="line" data-focus="" data-line="11"><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">  node</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">.</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;">addEventListner</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">(</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;">'clickoutside'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">, () </span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">=&gt;</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> { </span><span style="color: rgb(0, 128, 0); --shiki-dark: #6A9955;">/* ... */</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> });</span></span>
<span class="line" data-line="12"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;/</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">script</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span>
<span class="line" data-line="13"></span>
<span class="line" data-line="14"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">div</span><span style="color: rgb(229, 0, 0); --shiki-dark: #9CDCFE;"> id</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">=</span><span style="color: rgb(0, 0, 255); --shiki-dark: #CE9178;">"my-element"</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">...</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;/</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">div</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span></code></pre>
`}
		</section>

		<section class="slide" data-transition="slide">
			<p>Now how would you do that in your favorite framework?</p>
		</section>

		<section class="slide" data-transition="slide">
			<p>Svelte:</p>
{@html `
<pre class="p-4 shiki shiki-themes light-plus dark-plus" style="background-color: rgb(255, 255, 255); --shiki-dark-bg: #1E1E1E; color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;" data-lang="svelte" data-num-lines="11"><code><span class="line" data-line="1"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">script</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span>
<span class="line" data-line="2"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">  import</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> { </span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">clickoutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> } </span><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">from</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;"> 'clickoutside.js'</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">;</span></span>
<span class="line" data-line="3"></span>
<span class="line" data-line="4"><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">  const</span><span style="color: rgb(121, 94, 38); --shiki-dark: #DCDCAA;"> handleClickOutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> =</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> () </span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">=&gt;</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> { </span><span style="color: rgb(0, 128, 0); --shiki-dark: #6A9955;">/* ... */</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;"> };</span></span>
<span class="line" data-line="5"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;/</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">script</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span>
<span class="line" data-line="6"></span>
<span class="line" data-focus="" data-line="7"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">div</span></span>
<span class="line" data-focus="" data-line="8"><span style="color: rgb(229, 0, 0); --shiki-dark: #9CDCFE;">  id</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">=</span><span style="color: rgb(163, 21, 21); --shiki-dark: #CE9178;">"my-element"</span></span>
<span class="line" data-focus="" data-line="9"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">  use</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">:</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">clickoutside</span></span>
<span class="line" data-focus="" data-line="10"><span style="color: rgb(175, 0, 219); --shiki-dark: #C586C0;">  on</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">:</span><span style="color: rgb(38, 127, 153); --shiki-dark: #4EC9B0;">clickoutside</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">=</span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">{</span><span style="color: rgb(0, 16, 128); --shiki-dark: #9CDCFE;">handleClickOutside</span><span style="color: rgb(0, 0, 255); --shiki-dark: #569CD6;">}</span></span>
<span class="line" data-focus="" data-line="11"><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span><span style="color: rgb(0, 0, 0); --shiki-dark: #D4D4D4;">...</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&lt;/</span><span style="color: rgb(128, 0, 0); --shiki-dark: #569CD6;">div</span><span style="color: rgb(128, 0, 0); --shiki-dark: #808080;">&gt;</span></span>
</code></pre>
`}
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>What about React or Vue?</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>What about React or Vue?</p>
			<iframe class="w-full h-[500px]" data-src="http://localhost:5005/vi/blog/20240420-den-voi-web-thong-qua-svelte#so-s%C3%A1nh-v%E1%BB%9Bi-vue-v%C3%A0-react" data-preload></iframe>
		</section>

		<section class="slide" data-transition="slide">
			<p class="text-svelte">Web is the framework!</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Mission 2: </p>
			</div>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Mission 2: </p>
				<p>implement the Svelte Vietnam Blog (markdown)</p>
			</div>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Strategy:</p>
			</div>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<div class="flex gap-2 justify-center">
				<p>Strategy:</p>
				<p>Svelte preprocessor</p>
			</div>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>What is a preprocessor?</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>What is a preprocessor?</p>
			<p>A function that takes in source code and returns source code, transformed in some way</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>What is a preprocessor?</p>
			<p>A function that takes in source code and returns source code, transformed in some way</p>
			<img src={imgSveltePreprocessor} alt="n" />
		</section>

		<section class="slide">
			<p>Demo time</p>
		</section>

		<section class="slide">
			<img src={imgPreprocessBlog} alt="n" />
		</section>

		<section class="slide">
			<p class="text-svelte">Compiler is the new framework</p>
		</section>

		<section class="slide">
			<p>Important: code me wrote. You too can</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Recap:</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Recap:</p>
			<p>At runtime: Svelte is very much HTML, CSS, and JS</p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Recap:</p>
			<p>At runtime: Svelte is very much HTML, CSS, and JS</p>
			<p>At compile time: Svelte is highly customizable</p>
		</section>

		<section class="slide">
			<p>Svelte builds upon the web</p>
		</section>

		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Come for the <span class="text-svelte">hype</span>, stay for the <span class="text-svelte">drama</span></p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Come for the <span class="text-svelte line-through">hype</span>, stay for the <span class="text-svelte line-through">drama</span></p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Come for the <span class="text-svelte">ideas</span>, stay for the <span class="text-svelte">fundamentals</span></p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Come for the <span class="text-svelte">vibes</span></p>
		</section>
		<section class="slide" data-transition="slide" data-auto-animate>
			<p>Come for <span class="text-svelte">Svelte</span>, stay for the <span class="text-svelte">Web</span></p>
		</section>
	</div>
</main>
