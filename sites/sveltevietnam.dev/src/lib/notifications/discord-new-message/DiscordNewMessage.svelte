<script lang="ts">
	import { Context, T } from '@sveltevietnam/i18n';
	import { BaseNotification, type BaseNotificationProps } from '@sveltevietnam/kit/notifications';

	import { Avatar } from '$lib/components/avatar';

	let {
		name,
		avatarURL,
		...rest
	}: BaseNotificationProps & {
		avatarURL?: string;
		name: string;
	} = $props();

	const { t } = Context.get();
</script>

<BaseNotification
	{...rest}
	title={t({ key: 'notifications.discord_new_message.title' })}
	status="info"
>
	{#snippet icon()}
		<Avatar class="h-6 w-6 shrink-0" src={avatarURL} alt="" {name} height="24" width="24" />
	{/snippet}
	<p><T key="notifications.discord_new_message.message" params={{ name }} /></p>
</BaseNotification>
