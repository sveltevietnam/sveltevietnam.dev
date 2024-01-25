<script>
  import BaseNotification from '$lib/notifications/BaseNotification.svelte';
  import DiscordNotification from '$lib/notifications/DiscordNotification.svelte';
  import notificationHoverImage from './images/notification-hover-en.gif';
  import fallbackAvatar from '$lib/assets/images/fallback/default.jpg?w=60&imagetools';
  import devToolsSlow3gImage from './images/devtools-slow-3g.jpg?format=webp&imagetools';
  import disableJavascriptImage from './images/disable-javascript.png?format=webp&imagetools';
  import notFoundPageImage from './images/not-found-page.png?format=webp&imagetools';
  import blueScreenOfDeathImage from './images/blue-screen-of-death.png?format=webp&imagetools';
  import asciiPhoImage from './images/ascii-pho.jpg?format=webp&imagetools';
  import emailImage from './images/email-en.jpg?format=webp&imagetools';
</script>

:::div c-callout c-callout--info
This is a supplementary post to a [video with the same title](https://youtu.be/BaoljjKpLIU) (in Vietnamese), streamed at the recent "[Online Meetup Year-End 2023](/en/events/202312-year-end-online-meetup)" event. It is also part three of the "Behind the Screen" series, where I share my experience and lessons learned while building *sveltevietnam.dev*. You can find the previous part at "[Productive Dark Mode with SvelteKit, PostCSS, and TailwindCSS](/en/blog/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss)".
:::

## Push Notification

Perhaps you have encountered a system notification while visiting *sveltevietnam.dev*, something like this:

:::div not-prose
<BaseNotification intent="info">
  <p>A system notification, appearing and automatically dismissed after a moment at the top right corner of the page</p>
</BaseNotification>
:::

There is nothing so surprising about this: push notification is a common part of web applications. Push notification of *sveltevietnam.dev* has four variants, corresponding to four popular status or intent: `info`, `success`, `warning`, and `error`. You can see example for each variant at the [Design | Colors](/en/design/colors#status) page.

By default, each notification has an internal timer: it will automatically be dismissed upon timeout. However, if you hover over the notification (or touch and hold on touch devices), its timer will pause so that you have time to read or interact, for example copying content or choosing the appropriate action. You can test this right now by clicking on the link copy icon button in the [Share](#share) section of this blog post.

<img src={notificationHoverImage} alt="trigger notification with share button, then hover over it to see timer pauses" width="2155" height="1343" class="max-w-full border" />

The notification service is set up with the [@svelte-put/noti](https://svelte-put.vnphanquang.com/docs/noti) library (which I wrote). Please feel free to take a look if you happen to be looking for a solution to push notification. Now, let's go through a few specific interesting notifications used at *sveltevietnam.dev*.

### Notification about New Version

When there is a successful deployment to the server, the web page will display the following notification:

:::div not-prose
<BaseNotification intent="info">
  <p>A new version of the site was released. Please reload the page at your convenience for the best experience.</p>
</BaseNotification>
:::

We all want our users to access the latest and greatest version. This is typical and sometimes even mandatory for mobile apps, but less so on the web. A web page can be cached by multiple layers; we also cannot reliably force users to reload (those cannot use Javascript, for example). Even if there is a reliable method, we should not do so: imagine you are reading this and the page reloads all of a sudden - not a good experience, yeah? In short, a web page can exist in multiple versions at the same time on different machines. *sveltevietnam.dev* chooses to communicate this fact and let users reloads at their own convenience.

### Notification about Conversations in Discord

Staying long enough on the page, you will see this message:

:::div not-prose
<DiscordNotification name="Nguyễn Văn A" avatarURL={fallbackAvatar} />
:::

This notification happens when someone sends a message at Discord. It does not bring any immediate and materialized improvement for UX, but helps create a more dynamic space, an atmosphere where something else is also happening rather than just one user having an isolated experience. Apart from that, the notification also encourages people to join Discord, which is the main communication platform for the Svelte Vietnam community.

### Notification about Unstable Network Connection

When you open the web page in devices or places that are limited in network connectivity (namely 3G), you might see this:

:::div not-prose
<BaseNotification intent="info">
  <p>Interrupt has been detected due to unstable network. We are sorry for this inconvenience!</p>
</BaseNotification>
:::

To simulate this scenario, you can select the "Slow 3G" option from devtool configuration in the "Network" tab.

<img src={devToolsSlow3gImage} alt="screenshot at the Network tab, selection at slow 3G" width="400" height="432" class="mx-auto max-w-full h-auto" />

So, how does one detect slow network? *sveltevietnam.dev* inspects the difference between two timestamps: `SplashScreen` and "[hydration](https://en.wikipedia.org/wiki/Hydration_(web_development))". Hydration is quite a popular technique nowadays in the frontend world; it uses Javascript to turn a static page dynamic, providing necessary environment for its associated framework to execute DOM update based on user interactions and system changes. `SplashScreen`, on the other hand, is a welcome screen with fairly simple and swift animation, appearing right at the beginning when user opens the application. Besides creating an inviting and captivating scene, `SplashScreen` is also a subtle distraction during which the system should be fetching necessary resources and completing environment setup.

These two timestamps are critical for our problem at hand. After `SplashScreen`, user expects the web page to be usable immediately. When network is stable, this goes as expected: during the time `SplashScreen` is running, resources have been fetched, and hydration should have finished. When network is unstable, however, resource fetching is delayed, and in turn hydration. We can conclude, therefore, that if hydration completes a few seconds after `SplashScreen`, we know that something is not right, most likely due to slow network. When this happens, there will be a flash at a few components, so it makes sense, at the very least, to notify user and give them a polite apology (even though the fault is not entirely of our application).

`SplashScreen` is a fun and lengthy topic. We will discuss more in a future post!

## No Javascript? No Cry

If I tell you that over 90% of *sveltevietnam.dev* is still usable without Javascript (JS), you might as well say: that is stupid, why not use JS? The fact is, some people indeed cannot access JS due to security concerns; some others choose to turn it off to protect their privacy and improve performance (I sometimes do, and you too should try). I can hear you say: these users account for a very small percentage. True, but what is more important is to acknowledge that any user can potentially be without JS. I recommend giving [this diagram](https://www.kryogenix.org/code/browser/everyonehasjs.html) a read; it will lead you to many wonderful resources to convince you of this argument. All in all, supporting no-JS scenario means we value user experience regardless of their context.

Implementing this is no easy task, especially if one is used to relying on JS and developing single page applications (SPA). Fortunately, Svelte and SvelteKit provide a lot of tools for this task. The web platform and its standard APIs have aslo matured over the years and are becoming less and less dependent of JS. "Progressive enhancement" is a term often implies the capability to support non-JS users.

When you turn off JS at *sveltevietnam.dev*:

- the content is still available as it has already been server-rendered with SvelteKit,
- `SplashScreen` works because its animation is written entirely in CSS,
- navigation works, including language switching and caching, because at its core is just plain HTML anchor tags with a little help from the server,
- switching between light and dark mode works, because this component fallbacks to server navigation via HTML form and query param. The dropdown menu open-close animation also works as it does not use JS (some might find that surprising, but thanks to a CSS trick, indeed no JS is needed!),
- header menu on mobile works - this component is written, again, with just HTML and CSS.

To turn off JS, you can open devtool, press "Ctrl + Shift + P" (which triggers the command palette), type "Disable Javascript", and press enter. To turn it back on, do the same but change the command to "Enable Javascript".

<img src={disableJavascriptImage} class="max-w-full" width="1582" height="619" alt="screenshot of devtool with the text Disable Javascript typed into the command palette" />

I have spent quite some time testing and experimenting with these features, especially those with animation, to make sure they are compatible and can transition seamlessly from when there is no JS to when there is. Of course, achieving 100% is not realistic, and we cannot deny that JS is necessary to enhance user experience. Currently, the features that unfortunately only work with JS are:

- some animation such as those found in section titles or the intro section of the home page,
- tooltip,
- push notification,
- table of contents in blog posts,
- mail list registration forms at [Sự kiện](/en/events), [Việc làm](/en/jobs), and [Blog](/en/blog) pages - these forms rely on [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) which only works when JS is enabled.

The above sections are quite technical and tedious, aren't they? Let's switch gear and look and a few things that are lots more fun!

## ASCII Phở

Since we mentioned the devtool above, if you look at the "Console" window, something appears:

<img src={asciiPhoImage} class="mx-auto max-w-full" width="512" height="486" alt="a bolw of phở drawn in ascii texts" />

Why? Because I think it is fun. That's all.

## The Svelte Vietnam Newsletter

When you subscribe to the Svelte Vietnam newsletter through the forms at the [Events](/en/events), [Jobs](/en/jobs), and [Blog](/en/blog) pages, you will receive an email that looks like this:

<img src={emailImage} class="border mx-auto max-w-full" width="1415" height="950" alt="screenshot of registration confirmation email" />

The email template is inspired by popular services such as Google, Cloudflare, Vercel, ..., attempting to stay minimal and content-focused. Pay attention to the bottom of the email, the *"View on web"* link allows you to view the email as a standalone web page, while *"Manage subscription"* allows you to customize what type of content Svelte Vietnam should notify you about.

:::div c-callout c-callout--warning
You should not share links in the above email with anyone as it might contain your personal information!
:::

## Roadmap Illustrations

When visiting the [Roadmap](/en/roadmap) page, you should see a few images in the background. The first is:

<svg inline-src="../../../../roadmap/_page/images/au-lac.svg" class="w-full h-auto opacity-20" />

This is [chim Lạc](https://vi.wikipedia.org/wiki/Chim_L%E1%BA%A1c), a popular mythical bird in Vietnamese culture from the era of Văn Lang-Âu Lạc. It matches the name of the "Âu Lạc" milestone, a period of early development for the Svelte Vietnam project, with many plans and ideas waiting to be realized.

---

Next, at the "Tự" milestone, you see some rather old characters:

:::div flex w-full gap-4 tb:gap-10 opacity-20 my-6 tb:my-10
<svg inline-src="../../../../roadmap/_page/images/tu_chu.svg" class="h-auto" />
<svg inline-src="../../../../roadmap/_page/images/tu_nom.svg" class="h-auto" />
:::

This is "Chữ Nôm" written in [chữ Nôm](https://vi.wikipedia.org/wiki/Ch%E1%BB%AF_N%C3%B4m), the logographic writing system of the Vietnamese language from the 13th to 20th century. During this milestone, the Svelte Vietnam project focuses on its *content* such as the [Blog](/en/blog) page to share information, or the [Events](/en/events) page to prepare for upcoming events. The blog post you are reading is also written during this milestone.

---

Finally, we see an ancient coin at the "Đồng" milestone:

<svg inline-src="../../../../roadmap/_page/images/dong.svg" class="w-full opacity-20 my-6 tb:my-10" />

This is the "Thiên Phúc trấn bảo" coin, made in the early Lê dynasty as one of the first coin of Vietnam. In this milestone, continuing the role of Svelte Vietnam administrator, I plan to focus on development of the [Jobs](/en/jobs) page with the hope of finding a solution to collect job listings from popular recruitment channels into a single place, making job searching easier for community members. Besides, I also want to create a sustainable co-development between business and community. Instead of paying for recruitment platforms, companies can [sponsor](/en/sponsor) us to post jobs directly on the [Jobs](/en/jobs) page. The sponsorship money will be used to organize community events. Businesses invest in community, community provides quality human resources for businesses. Both sides benefit and grow from this mutualistic relationship.

:::div c-callout c-callout--info
This co-development model has existed in developed countries but is still rare in Vietnam. I mentioned this in a previous post "[Svelte Vietnam: from Local to Global
](/en/blog/20231012-svelte-vietnam-from-local-to-global)". You can read it to better understand the identity Svelte Vietnam and what it tries to be.
:::

## Blue Screen

At the moment, we do not yet have a design for the [404 page](https://www.sveltevietnam.dev/giberrish). However if you happen upon this page, you will see a rather interesting message:

<img src={notFoundPageImage} class="max-w-full border" width="1024" height="576" alt="404 page showing a interesting message" />

If you are reading this in the future, the 404 page might have changed, but hopefully you will see a similar message. Clicking on "Would you like a blue screen?", you will be greeted with the renowned Blue Screen of Death (should be familiar to those born in the 80s and 90s):

<img src={blueScreenOfDeathImage} class="max-w-full border" width="1024" height="658" alt="sveltevietnam.dev version of the Blue Screen of Death" />

## Homework: A Svelte Vietnam Logo

At the top left corner of *sveltevietnam.dev* is, most of the time, a Svelte Vietnam logo. When you are not on the home page, clicking on the logo will redirect you back to the home page. When you are on the home page, however, you will feel like the logo is not clickable. But try clicking on the logo **twelve times** and see what happens (hint: it is better if you are on desktop instead of mobile)!

## Closing

Above are a few tiny details through which I hope you can understand more about how *sveltevietnam.dev* is designed and built. Fun is a must-have here. For any application, the first user is us developers; if we feel joy using it, perhaps that is already a success. Whether you are writing React or Svelte, HTMX or Astro, Golang or Rust, have a bit of fun, however tiny it might be, yeah?

:::div c-callout c-callout--info
In the next part of the "Behind the Screen" post series, I explain in more details how Svelte Vietnam's splash screen is implemented. You can find the post at "[Progressive Splash Screen](/en/blog/20231220-behind-the-screen-progressive-splashscreen)".
:::
