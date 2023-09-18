// import type { RequestHandler } from './$types';

// export const POST: RequestHandler = async ({ request, locals }) => {
//   notify user
//   const body = {
//     personalizations: [
//       {
//         to: [
//           {
//             email: form.data.email,
//             name: form.data.name,
//           },
//         ],
//         dkim_domain: DKIM_DOMAIN,
//         dkim_selector: DKIM_SELECTOR,
//         dkim_private_key: DKIM_PRIVATE_KEY,
//       },
//     ],
//     from: {
//       email: 'no-reply@sveltevietnam.dev',
//       name: 'Svelte Vietnam',
//     },
//     // TODO: i18n
//     subject: 'Svelte Vietnam: Registration Confirmation',
//     content: [
//       {
//         type: 'text/plain',
//         value: `Thank you for registering for ${domain}!`,
//       },
//     ],
//   };
//   const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify(body),
//   });
// TODO: add error capturing
//   const text = await resp.text();
//   console.log(`Turbo ~ file: mail.server.ts:109 ~ text:`, resp.status, resp.statusText, text);
// };
