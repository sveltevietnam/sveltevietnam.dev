<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { type Message, type MessageString } from '@sveltevietnam/i18n/runtime';

	import { Avatar } from '$lib/components/avatar';
	import BaseNotification, { type BaseNotificationProps } from '$lib/notifications/components/BaseNotification.svelte';

	let {
		name,
		avatarURL,
		locale,
		...rest
	}: BaseNotificationProps & {
		avatarURL?: string;
		name: string;
		locale: {
			title: MessageString;
			description: Message<'name'>;
		};
	} = $props();
</script>

<BaseNotification {...rest} title={locale.title} status="info">
	{#snippet icon()}
		<Avatar class="h-6 w-6 shrink-0" src={avatarURL} alt="" {name} />
	{/snippet}
	<p><T message={locale.description} {name} /></p>
</BaseNotification>
