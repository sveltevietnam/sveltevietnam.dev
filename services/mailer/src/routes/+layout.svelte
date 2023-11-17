<script lang="ts">
	import { PUBLIC_MODE } from '$env/static/public';

	import '../lib/client/styles/app.css';
</script>

<svelte:head>
	<title>Mailer Service | Svelte Vietnam</title>
	<meta name="description" content="Internal mailer service of Svelte Vietnam" />
	<meta name="keywords" content="mail, email, subscription, internal, service" />
	<meta name="mode" content={PUBLIC_MODE} />
</svelte:head>

<slot />
