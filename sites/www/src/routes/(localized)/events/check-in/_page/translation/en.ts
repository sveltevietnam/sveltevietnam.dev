export const en = {
	title: 'Event Check-in',
	upcoming:
		'\
		Excited for the event? We are too. But it is a bit too early, would you agree?<br>\
		You can check in from <strong>two hours before the event starts</strong> until <strong>two hours after it ends</strong>.<br>\
		In the meantime, why not check out the <a class="c-link" href="/en/blog">Svelte Vietnam Blog</a>!\
	',
	past: '\
		The event has ended. Thank you for stopping by. Be sure to \
		<a class="c-link" href="/en/events#mail">register for notification</a> to \
		not miss future events.<br>\
		See you soon!\
	',
	timer: {
		countdown: 'Countdown to Event',
		elapsed: 'Event Elapsed Time',
	},
	checkin: {
		or: 'or',
		qr: {
			cta: 'Scan QR Code',
			modal: {
				title: 'Scan QR Code',
				description: 'Additional permissions might be required to access your camera.',
			},
		},
		form: 'Please fill out the information below and submit to complete check-in.',
		success: {
			ok: 'You are checked in. Enjoy the event!',
			already: 'You have already checked in. Thank you!',
		},
		error: {
			missing: 'Please fill out required info before submitting. Thank you!',
			invalidQR:
				'QR is not valid. Make sure to use the QR code attached in your event registration confirmation email.',
		},
	},
} satisfies typeof import('./vi').vi;
