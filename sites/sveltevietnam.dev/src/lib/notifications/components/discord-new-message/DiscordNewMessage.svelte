<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { Avatar } from '$lib/components/avatar';
	import BaseNotification, {
		type BaseNotificationProps,
	} from '$lib/notifications/components/BaseNotification.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		name,
		avatarURL,
		...rest
	}: BaseNotificationProps & {
		avatarURL?: string;
		name: string;
	} = $props();

	const settings = SettingsContext.get();
</script>

<BaseNotification
	{...rest}
	title={m['notifications.discord_new_message.title'](settings.language)}
	status="info"
>
	{#snippet icon()}
		<Avatar class="h-6 w-6 shrink-0" src={avatarURL} alt="" {name} />
	{/snippet}
	<p><T message={m['notifications.discord_new_message.message']} {name} /></p>
</BaseNotification>
