import { QR_ERRORS } from '@internals/isc/qr';
import { createSVG } from '@svelte-put/qr';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { initResgWasm } from './resvg.js';

/**
 * @param {keyof typeof QR_ERRORS} key
 * @param {string} [message]
 * @return {Response}
 */
function createErrorResponse(key, message) {
	const error = QR_ERRORS[key];
	return new Response(JSON.stringify({ code: error.code, message }), { status: error.status });
}

/**
 * @typedef {{ JWT_SECRET: string }} Env
 */

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 */
	async fetch(request, env) {
		const url = new URL(request.url);

		const token = url.searchParams.get('token');
		if (!token)
			return createErrorResponse('QR_GET_NO_TOKEN', 'Expect nonempty "token" query param');

		// TODO: rotate JWT_SECRT after 2024.04.20 (meetup event)
		const isValid = await jwt.verify(token, env.JWT_SECRET);
		if (!isValid) return createErrorResponse('QR_GET_INVALID_TOKEN', 'Token is invalid');

		const { payload } = jwt.decode(token);
		if (!payload?.data)
			return createErrorResponse('QR_GET_NO_DATA', 'Expect "data" in decoded token');

		const size = payload?.size || 500;
		const colorScheme = payload?.colorScheme || 'light';
		const fill = colorScheme === 'dark' ? 'white' : 'black';
		const logo =
			colorScheme === 'dark'
				? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1MCA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOS45Mjk3IDE1LjA4MzZDMzUuNTc5NyAxMS40NzM2IDQzLjQwOTcgMTMuMTUzNiA0Ny4zNjk3IDE4Ljg0MzZDNDguMzA5NyAyMC4xNjM2IDQ4Ljk2OTcgMjEuNjYzNiA0OS4zMjk3IDIzLjI0MzZDNDkuNjg5NyAyNC44MjM2IDQ5LjcxOTcgMjYuNDYzNiA0OS40Mzk3IDI4LjA2MzZDNDkuMjI5NyAyOS4yMjM2IDQ4LjgzOTcgMzAuMzMzNiA0OC4yOTk3IDMxLjM3MzZDNDcuOTc5NyAzMS45ODM2IDQ3LjkzOTcgMzIuNjkzNiA0OC4xOTk3IDMzLjMzMzZDNDkuMDc5NyAzNS40NTM2IDQ5LjMyOTcgMzcuNzkzNiA0OC45MTk3IDQwLjA2MzZDNDguNjM5NyA0MS42MjM2IDQ4LjAzOTcgNDMuMTEzNiA0Ny4xNDk3IDQ0LjQzMzZDNDYuMjU5NyA0NS43NDM2IDQ1LjEwOTcgNDYuODYzNiA0My43Njk3IDQ3LjcxMzZMMzMuODI5NyA1NC4wNjM2QzI4LjE3OTcgNTcuNjczNiAyMC4zNDk3IDU1Ljk5MzYgMTYuMzg5NyA1MC4zMDM2QzE1LjQ0OTcgNDguOTgzNiAxNC43ODk3IDQ3LjQ4MzYgMTQuNDI5NyA0NS45MDM2QzE0LjA2OTcgNDQuMzIzNiAxNC4wMzk3IDQyLjY4MzYgMTQuMzE5NyA0MS4wODM2QzE0LjUyOTcgMzkuOTIzNiAxNC45MTk3IDM4LjgxMzYgMTUuNDU5NyAzNy43NzM2QzE1Ljc3OTcgMzcuMTYzNiAxNS44MTk3IDM2LjQ1MzYgMTUuNTU5NyAzNS44MTM2QzE0LjY3OTcgMzMuNjkzNiAxNC40Mjk3IDMxLjM1MzYgMTQuODM5NyAyOS4wODM2QzE1LjExOTcgMjcuNTIzNiAxNS43MTk3IDI2LjAzMzYgMTYuNjA5NyAyNC43MTM2QzE3LjQ5OTcgMjMuNDAzNiAxOC42NDk3IDIyLjI4MzYgMTkuOTg5NyAyMS40MzM2TDI5LjkyOTcgMTUuMDgzNlpNMjQuMjI5OCA1MC42MTM2QzI1Ljc0OTggNTEuMTczNiAyNy4zOTk4IDUxLjI2MzYgMjguOTU5OCA1MC44NTM2TDI4Ljk2OTggNTAuODYzNkMyOS42ODk4IDUwLjY3MzYgMzAuMzY5OCA1MC4zNzM2IDMwLjk4OTggNDkuOTczNkw0MC45Mjk4IDQzLjYyMzZDNDEuNzI5OCA0My4xMTM2IDQyLjQyOTggNDIuNDMzNiA0Mi45NTk4IDQxLjY0MzZDNDMuNDg5OCA0MC44NTM2IDQzLjg0OTggMzkuOTUzNiA0NC4wMTk4IDM5LjAxMzZDNDQuMTg5OCAzOC4wNTM2IDQ0LjE1OTggMzcuMDYzNiA0My45NDk4IDM2LjExMzZDNDMuNzM5OCAzNS4xNjM2IDQzLjMzOTggMzQuMjYzNiA0Mi43Njk4IDMzLjQ3MzZDNDEuODQ5OCAzMi4xNDM2IDQwLjUzOTggMzEuMTIzNiAzOS4wMjk4IDMwLjU2MzZDMzcuNTA5OCAzMC4wMDM2IDM1Ljg1OTggMjkuOTEzNiAzNC4yOTk4IDMwLjMyMzZDMzMuNTc5OCAzMC41MTM2IDMyLjg5OTggMzAuODEzNiAzMi4yNzk4IDMxLjIxMzZMMjguNDg5OCAzMy42MzM2QzI4LjI5OTggMzMuNzUzNiAyOC4wOTk4IDMzLjg0MzYgMjcuODc5OCAzMy45MDM2QzI3LjQwOTggMzQuMDMzNiAyNi45MTk4IDM0LjAwMzYgMjYuNDU5OCAzMy44MzM2QzI1Ljk5OTggMzMuNjYzNiAyNS42MDk4IDMzLjM1MzYgMjUuMzI5OCAzMi45NTM2QzI1LjE1OTggMzIuNzEzNiAyNS4wMjk4IDMyLjQ0MzYgMjQuOTY5OCAzMi4xNTM2QzI0LjkwOTggMzEuODczNiAyNC44OTk4IDMxLjU3MzYgMjQuOTQ5OCAzMS4yODM2QzI0Ljk5OTggMzEuMDAzNiAyNS4xMDk4IDMwLjczMzYgMjUuMjY5OCAzMC40OTM2QzI1LjQyOTggMzAuMjYzNiAyNS42Mzk4IDMwLjA1MzYgMjUuODc5OCAyOS45MDM2TDM1LjgxOTggMjMuNTUzNkMzNi4wMDk4IDIzLjQzMzYgMzYuMjA5OCAyMy4zNDM2IDM2LjQyOTggMjMuMjgzNkMzNi44OTk4IDIzLjE1MzYgMzcuMzg5OCAyMy4xODM2IDM3Ljg0OTggMjMuMzUzNkMzOC4zMDk4IDIzLjUyMzYgMzguNjk5OCAyMy44MzM2IDM4Ljk3OTggMjQuMjMzNkMzOS4yNzk4IDI0LjY2MzYgMzkuNDE5OCAyNS4xODM2IDM5LjM3OTggMjUuNzEzNkwzOS4zNDk4IDI2LjA4MzZDNDAuOTg5OCAyNi41ODM2IDQyLjUzOTggMjcuMzUzNiA0My45MTk4IDI4LjM3MzZMNDQuMTA5OCAyOC41MTM2TDQ0LjI5OTggMjcuOTQzNkM0NC4zOTk4IDI3LjY0MzYgNDQuNDc5OCAyNy4zMzM2IDQ0LjUzOTggMjcuMDEzNkM0NC43MDk4IDI2LjA1MzYgNDQuNjc5OCAyNS4wNjM2IDQ0LjQ2OTggMjQuMTEzNkM0NC4yNTk4IDIzLjE2MzYgNDMuODU5OCAyMi4yNjM2IDQzLjI4OTggMjEuNDczNkM0Mi4zNjk4IDIwLjE0MzYgNDEuMDU5OCAxOS4xMjM2IDM5LjU0OTggMTguNTYzNkMzOC4wMjk4IDE4LjAwMzYgMzYuMzc5OCAxNy45MTM2IDM0LjgxOTggMTguMzIzNkMzNC4wOTk4IDE4LjUxMzYgMzMuNDE5OCAxOC44MTM2IDMyLjc5OTggMTkuMjEzNkwyMi44NTk4IDI1LjU2MzZDMjIuMDU5OCAyNi4wNjM2IDIxLjM1OTggMjYuNzQzNiAyMC44Mjk4IDI3LjUzMzZDMjAuMjk5OCAyOC4zMjM2IDE5LjkzOTggMjkuMjIzNiAxOS43Njk4IDMwLjE2MzZDMTkuNTk5OCAzMS4xMjM2IDE5LjYyOTggMzIuMTEzNiAxOS44Mzk4IDMzLjA2MzZDMjAuMDQ5OCAzNC4wMTM2IDIwLjQ0OTggMzQuOTEzNiAyMS4wMTk4IDM1LjcwMzZDMjEuOTM5OCAzNy4wMzM2IDIzLjI0OTggMzguMDUzNiAyNC43NTk4IDM4LjYxMzZDMjYuMjc5OCAzOS4xNzM2IDI3LjkyOTggMzkuMjYzNiAyOS40ODk4IDM4Ljg1MzZDMzAuMjA5OCAzOC42NjM2IDMwLjg4OTggMzguMzYzNiAzMS41MDk4IDM3Ljk2MzZMMzUuMjk5OCAzNS41NDM2QzM1LjQ4OTggMzUuNDIzNiAzNS42ODk4IDM1LjMzMzYgMzUuOTA5OCAzNS4yNzM2QzM2LjM3OTggMzUuMTQzNiAzNi44Njk4IDM1LjE3MzYgMzcuMzI5OCAzNS4zNDM2QzM3Ljc4OTggMzUuNTEzNiAzOC4xNzk4IDM1LjgyMzYgMzguNDU5OCAzNi4yMjM2QzM4LjYyOTggMzYuNDYzNiAzOC43NTk4IDM2LjczMzYgMzguODE5OCAzNy4wMjM2QzM4Ljg3OTggMzcuMzAzNiAzOC44ODk4IDM3LjYwMzYgMzguODM5OCAzNy44OTM2QzM4Ljc4OTggMzguMTczNiAzOC42Nzk4IDM4LjQ0MzYgMzguNTE5OCAzOC42ODM2QzM4LjM1OTggMzguOTIzNiAzOC4xNDk4IDM5LjEzMzYgMzcuOTA5OCAzOS4yODM2TDI3Ljk2OTggNDUuNjMzNkMyNy43Nzk4IDQ1Ljc1MzYgMjcuNTc5OCA0NS44NDM2IDI3LjM1OTggNDUuOTAzNkMyNi44ODk4IDQ2LjAzMzYgMjYuMzk5OCA0Ni4wMDM2IDI1LjkzOTggNDUuODMzNkMyNS40Nzk4IDQ1LjY2MzYgMjUuMDg5OCA0NS4zNTM2IDI0LjgwOTggNDQuOTUzNkMyNC41MDk4IDQ0LjUyMzYgMjQuMzU5OCA0NC4wMDM2IDI0LjQwOTggNDMuNDczNkwyNC40Mzk4IDQzLjEwMzZDMjIuNzg5OCA0Mi42MDM2IDIxLjIzOTggNDEuODIzNiAxOS44NTk4IDQwLjgwMzZMMTkuNjY5OCA0MC42NjM2TDE5LjQ3OTggNDEuMjMzNkMxOS4zNzk4IDQxLjUzMzYgMTkuMjk5OCA0MS44NDM2IDE5LjIzOTggNDIuMTYzNkMxOS4wNjk4IDQzLjEyMzYgMTkuMDk5OCA0NC4xMTM2IDE5LjMwOTggNDUuMDYzNkMxOS41MTk4IDQ2LjAxMzYgMTkuOTE5OCA0Ni45MTM2IDIwLjQ4OTggNDcuNzAzNkMyMS40MDk4IDQ5LjAzMzYgMjIuNzE5OCA1MC4wNTM2IDI0LjIyOTggNTAuNjEzNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zOS42MyAxMi40MjM3QzQwLjU2IDEyLjgxMzcgNDEuNjMgMTIuNTczNyA0Mi4yMSAxMS43NDM3QzQzLjg5IDkuMzEzNzEgNDYuNzMgNC44MDM3MSA0NS41NiAzLjYzMzcxQzQ0LjY2IDIuNzIzNzEgMzguMzggNi41NTM3MSAzMy4xIDEwLjA0MzdDMzEuOTYgMTAuNzkzNyAzMi42OSAxMi41NzM3IDM0LjAzIDEyLjMxMzdDMzYuMSAxMS45MDM3IDM4LjE1IDExLjgxMzcgMzkuNjMgMTIuNDMzN1YxMi40MjM3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQuNTc5OTYgNDEuNTgzOEM1LjcwOTk2IDQzLjA4MzggOS4yMjk5NiA0MS40ODM4IDExLjQxIDQwLjI3MzhDMTIuNDEgMzkuNzEzOCAxMi44OSAzOC41OTM4IDEyLjU3IDM3LjU2MzhDMTIuMDQgMzUuODQzOCAxMS40OCAzMi45MDM4IDEyLjI5IDI5LjQwMzhDMTIuNDQgMjguNzQzOCAxMS41NiAyOC4zNTM4IDExLjExIDI4Ljg4MzhDNy45OTk5NiAzMi41MjM4IDIuNzk5OTYgMzkuMjMzOCA0LjU4OTk2IDQxLjU5MzhMNC41Nzk5NiA0MS41ODM4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOS42OCAxOC4zNTM3QzI4LjUgMTAuNjgzNyAzOC43MSA0LjYyMzczIDQ0Ljk1IDIuNDYzNzNDNDUuMzYgMi4zMjM3MyA0NS4yOSAxLjc1MzczIDQ0Ljg1IDEuNzMzNzNDMzYuNSAxLjMzMzczIDYuOTggMC4wMDM3Mjk3IDYuOTggMC4wMDM3Mjk3QzQuMyAtMC4xMDYyNyAxLjYyIDIuMjMzNzMgMS41NCA0Ljc5MzczTDAgNDEuNTUzN0MwLjAyIDQ0LjgyMzcgMy4yOCA0Ni4wOTM3IDYuOTkgNDQuNjkzN0MxMCA0My41NTM3IDE0LjA0IDQwLjU0MzcgMTMuODIgNDAuMjkzN0MxMy43Nzc5IDQwLjI0OTYgMTMuNCA0MC40NTcyIDEyLjgwMDYgNDAuNzg2NEMxMC41NTA3IDQyLjAyMjQgNS4xODAwMSA0NC45NzI2IDIuNzQgNDIuNzUzN0MwLjE1IDQwLjQwMzcgNi45NCAyOS40MzM3IDE5LjY4IDE4LjM1MzdaTTkuMzE5NzMgNy44NzM0Nkw2Ljc3OTczIDYuNTQzNDZMNy4yNjk3MyA5LjM2MzQ2TDUuMjE5NzMgMTEuMzYzNUw4LjA0OTczIDExLjc3MzVMOS4zMTk3MyAxNC4zNDM1TDEwLjU4OTcgMTEuNzczNUwxMy40MTk3IDExLjM2MzVMMTEuMzY5NyA5LjM2MzQ2TDExLjg0OTcgNi41NDM0Nkw5LjMxOTczIDcuODczNDZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
				: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1MCA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOS45Mjk3IDE1LjA4MzZDMzUuNTc5NyAxMS40NzM2IDQzLjQwOTcgMTMuMTUzNiA0Ny4zNjk3IDE4Ljg0MzZDNDguMzA5NyAyMC4xNjM2IDQ4Ljk2OTcgMjEuNjYzNiA0OS4zMjk3IDIzLjI0MzZDNDkuNjg5NyAyNC44MjM2IDQ5LjcxOTcgMjYuNDYzNiA0OS40Mzk3IDI4LjA2MzZDNDkuMjI5NyAyOS4yMjM2IDQ4LjgzOTcgMzAuMzMzNiA0OC4yOTk3IDMxLjM3MzZDNDcuOTc5NyAzMS45ODM2IDQ3LjkzOTcgMzIuNjkzNiA0OC4xOTk3IDMzLjMzMzZDNDkuMDc5NyAzNS40NTM2IDQ5LjMyOTcgMzcuNzkzNiA0OC45MTk3IDQwLjA2MzZDNDguNjM5NyA0MS42MjM2IDQ4LjAzOTcgNDMuMTEzNiA0Ny4xNDk3IDQ0LjQzMzZDNDYuMjU5NyA0NS43NDM2IDQ1LjEwOTcgNDYuODYzNiA0My43Njk3IDQ3LjcxMzZMMzMuODI5NyA1NC4wNjM2QzI4LjE3OTcgNTcuNjczNiAyMC4zNDk3IDU1Ljk5MzYgMTYuMzg5NyA1MC4zMDM2QzE1LjQ0OTcgNDguOTgzNiAxNC43ODk3IDQ3LjQ4MzYgMTQuNDI5NyA0NS45MDM2QzE0LjA2OTcgNDQuMzIzNiAxNC4wMzk3IDQyLjY4MzYgMTQuMzE5NyA0MS4wODM2QzE0LjUyOTcgMzkuOTIzNiAxNC45MTk3IDM4LjgxMzYgMTUuNDU5NyAzNy43NzM2QzE1Ljc3OTcgMzcuMTYzNiAxNS44MTk3IDM2LjQ1MzYgMTUuNTU5NyAzNS44MTM2QzE0LjY3OTcgMzMuNjkzNiAxNC40Mjk3IDMxLjM1MzYgMTQuODM5NyAyOS4wODM2QzE1LjExOTcgMjcuNTIzNiAxNS43MTk3IDI2LjAzMzYgMTYuNjA5NyAyNC43MTM2QzE3LjQ5OTcgMjMuNDAzNiAxOC42NDk3IDIyLjI4MzYgMTkuOTg5NyAyMS40MzM2TDI5LjkyOTcgMTUuMDgzNlpNMjQuMjI5OCA1MC42MTM2QzI1Ljc0OTggNTEuMTczNiAyNy4zOTk4IDUxLjI2MzYgMjguOTU5OCA1MC44NTM2TDI4Ljk2OTggNTAuODYzNkMyOS42ODk4IDUwLjY3MzYgMzAuMzY5OCA1MC4zNzM2IDMwLjk4OTggNDkuOTczNkw0MC45Mjk4IDQzLjYyMzZDNDEuNzI5OCA0My4xMTM2IDQyLjQyOTggNDIuNDMzNiA0Mi45NTk4IDQxLjY0MzZDNDMuNDg5OCA0MC44NTM2IDQzLjg0OTggMzkuOTUzNiA0NC4wMTk4IDM5LjAxMzZDNDQuMTg5OCAzOC4wNTM2IDQ0LjE1OTggMzcuMDYzNiA0My45NDk4IDM2LjExMzZDNDMuNzM5OCAzNS4xNjM2IDQzLjMzOTggMzQuMjYzNiA0Mi43Njk4IDMzLjQ3MzZDNDEuODQ5OCAzMi4xNDM2IDQwLjUzOTggMzEuMTIzNiAzOS4wMjk4IDMwLjU2MzZDMzcuNTA5OCAzMC4wMDM2IDM1Ljg1OTggMjkuOTEzNiAzNC4yOTk4IDMwLjMyMzZDMzMuNTc5OCAzMC41MTM2IDMyLjg5OTggMzAuODEzNiAzMi4yNzk4IDMxLjIxMzZMMjguNDg5OCAzMy42MzM2QzI4LjI5OTggMzMuNzUzNiAyOC4wOTk4IDMzLjg0MzYgMjcuODc5OCAzMy45MDM2QzI3LjQwOTggMzQuMDMzNiAyNi45MTk4IDM0LjAwMzYgMjYuNDU5OCAzMy44MzM2QzI1Ljk5OTggMzMuNjYzNiAyNS42MDk4IDMzLjM1MzYgMjUuMzI5OCAzMi45NTM2QzI1LjE1OTggMzIuNzEzNiAyNS4wMjk4IDMyLjQ0MzYgMjQuOTY5OCAzMi4xNTM2QzI0LjkwOTggMzEuODczNiAyNC44OTk4IDMxLjU3MzYgMjQuOTQ5OCAzMS4yODM2QzI0Ljk5OTggMzEuMDAzNiAyNS4xMDk4IDMwLjczMzYgMjUuMjY5OCAzMC40OTM2QzI1LjQyOTggMzAuMjYzNiAyNS42Mzk4IDMwLjA1MzYgMjUuODc5OCAyOS45MDM2TDM1LjgxOTggMjMuNTUzNkMzNi4wMDk4IDIzLjQzMzYgMzYuMjA5OCAyMy4zNDM2IDM2LjQyOTggMjMuMjgzNkMzNi44OTk4IDIzLjE1MzYgMzcuMzg5OCAyMy4xODM2IDM3Ljg0OTggMjMuMzUzNkMzOC4zMDk4IDIzLjUyMzYgMzguNjk5OCAyMy44MzM2IDM4Ljk3OTggMjQuMjMzNkMzOS4yNzk4IDI0LjY2MzYgMzkuNDE5OCAyNS4xODM2IDM5LjM3OTggMjUuNzEzNkwzOS4zNDk4IDI2LjA4MzZDNDAuOTg5OCAyNi41ODM2IDQyLjUzOTggMjcuMzUzNiA0My45MTk4IDI4LjM3MzZMNDQuMTA5OCAyOC41MTM2TDQ0LjI5OTggMjcuOTQzNkM0NC4zOTk4IDI3LjY0MzYgNDQuNDc5OCAyNy4zMzM2IDQ0LjUzOTggMjcuMDEzNkM0NC43MDk4IDI2LjA1MzYgNDQuNjc5OCAyNS4wNjM2IDQ0LjQ2OTggMjQuMTEzNkM0NC4yNTk4IDIzLjE2MzYgNDMuODU5OCAyMi4yNjM2IDQzLjI4OTggMjEuNDczNkM0Mi4zNjk4IDIwLjE0MzYgNDEuMDU5OCAxOS4xMjM2IDM5LjU0OTggMTguNTYzNkMzOC4wMjk4IDE4LjAwMzYgMzYuMzc5OCAxNy45MTM2IDM0LjgxOTggMTguMzIzNkMzNC4wOTk4IDE4LjUxMzYgMzMuNDE5OCAxOC44MTM2IDMyLjc5OTggMTkuMjEzNkwyMi44NTk4IDI1LjU2MzZDMjIuMDU5OCAyNi4wNjM2IDIxLjM1OTggMjYuNzQzNiAyMC44Mjk4IDI3LjUzMzZDMjAuMjk5OCAyOC4zMjM2IDE5LjkzOTggMjkuMjIzNiAxOS43Njk4IDMwLjE2MzZDMTkuNTk5OCAzMS4xMjM2IDE5LjYyOTggMzIuMTEzNiAxOS44Mzk4IDMzLjA2MzZDMjAuMDQ5OCAzNC4wMTM2IDIwLjQ0OTggMzQuOTEzNiAyMS4wMTk4IDM1LjcwMzZDMjEuOTM5OCAzNy4wMzM2IDIzLjI0OTggMzguMDUzNiAyNC43NTk4IDM4LjYxMzZDMjYuMjc5OCAzOS4xNzM2IDI3LjkyOTggMzkuMjYzNiAyOS40ODk4IDM4Ljg1MzZDMzAuMjA5OCAzOC42NjM2IDMwLjg4OTggMzguMzYzNiAzMS41MDk4IDM3Ljk2MzZMMzUuMjk5OCAzNS41NDM2QzM1LjQ4OTggMzUuNDIzNiAzNS42ODk4IDM1LjMzMzYgMzUuOTA5OCAzNS4yNzM2QzM2LjM3OTggMzUuMTQzNiAzNi44Njk4IDM1LjE3MzYgMzcuMzI5OCAzNS4zNDM2QzM3Ljc4OTggMzUuNTEzNiAzOC4xNzk4IDM1LjgyMzYgMzguNDU5OCAzNi4yMjM2QzM4LjYyOTggMzYuNDYzNiAzOC43NTk4IDM2LjczMzYgMzguODE5OCAzNy4wMjM2QzM4Ljg3OTggMzcuMzAzNiAzOC44ODk4IDM3LjYwMzYgMzguODM5OCAzNy44OTM2QzM4Ljc4OTggMzguMTczNiAzOC42Nzk4IDM4LjQ0MzYgMzguNTE5OCAzOC42ODM2QzM4LjM1OTggMzguOTIzNiAzOC4xNDk4IDM5LjEzMzYgMzcuOTA5OCAzOS4yODM2TDI3Ljk2OTggNDUuNjMzNkMyNy43Nzk4IDQ1Ljc1MzYgMjcuNTc5OCA0NS44NDM2IDI3LjM1OTggNDUuOTAzNkMyNi44ODk4IDQ2LjAzMzYgMjYuMzk5OCA0Ni4wMDM2IDI1LjkzOTggNDUuODMzNkMyNS40Nzk4IDQ1LjY2MzYgMjUuMDg5OCA0NS4zNTM2IDI0LjgwOTggNDQuOTUzNkMyNC41MDk4IDQ0LjUyMzYgMjQuMzU5OCA0NC4wMDM2IDI0LjQwOTggNDMuNDczNkwyNC40Mzk4IDQzLjEwMzZDMjIuNzg5OCA0Mi42MDM2IDIxLjIzOTggNDEuODIzNiAxOS44NTk4IDQwLjgwMzZMMTkuNjY5OCA0MC42NjM2TDE5LjQ3OTggNDEuMjMzNkMxOS4zNzk4IDQxLjUzMzYgMTkuMjk5OCA0MS44NDM2IDE5LjIzOTggNDIuMTYzNkMxOS4wNjk4IDQzLjEyMzYgMTkuMDk5OCA0NC4xMTM2IDE5LjMwOTggNDUuMDYzNkMxOS41MTk4IDQ2LjAxMzYgMTkuOTE5OCA0Ni45MTM2IDIwLjQ4OTggNDcuNzAzNkMyMS40MDk4IDQ5LjAzMzYgMjIuNzE5OCA1MC4wNTM2IDI0LjIyOTggNTAuNjEzNloiIGZpbGw9IiMxMjEyMTIiLz4KPHBhdGggZD0iTTM5LjYzIDEyLjQyMzdDNDAuNTYgMTIuODEzNyA0MS42MyAxMi41NzM3IDQyLjIxIDExLjc0MzdDNDMuODkgOS4zMTM3MSA0Ni43MyA0LjgwMzcxIDQ1LjU2IDMuNjMzNzFDNDQuNjYgMi43MjM3MSAzOC4zOCA2LjU1MzcxIDMzLjEgMTAuMDQzN0MzMS45NiAxMC43OTM3IDMyLjY5IDEyLjU3MzcgMzQuMDMgMTIuMzEzN0MzNi4xIDExLjkwMzcgMzguMTUgMTEuODEzNyAzOS42MyAxMi40MzM3VjEyLjQyMzdaIiBmaWxsPSIjMTIxMjEyIi8+CjxwYXRoIGQ9Ik00LjU3OTk2IDQxLjU4MzhDNS43MDk5NiA0My4wODM4IDkuMjI5OTYgNDEuNDgzOCAxMS40MSA0MC4yNzM4QzEyLjQxIDM5LjcxMzggMTIuODkgMzguNTkzOCAxMi41NyAzNy41NjM4QzEyLjA0IDM1Ljg0MzggMTEuNDggMzIuOTAzOCAxMi4yOSAyOS40MDM4QzEyLjQ0IDI4Ljc0MzggMTEuNTYgMjguMzUzOCAxMS4xMSAyOC44ODM4QzcuOTk5OTYgMzIuNTIzOCAyLjc5OTk2IDM5LjIzMzggNC41ODk5NiA0MS41OTM4TDQuNTc5OTYgNDEuNTgzOFoiIGZpbGw9IiMxMjEyMTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOS42OCAxOC4zNTM3QzI4LjUgMTAuNjgzNyAzOC43MSA0LjYyMzczIDQ0Ljk1IDIuNDYzNzNDNDUuMzYgMi4zMjM3MyA0NS4yOSAxLjc1MzczIDQ0Ljg1IDEuNzMzNzNDMzYuNSAxLjMzMzczIDYuOTggMC4wMDM3Mjk3IDYuOTggMC4wMDM3Mjk3QzQuMyAtMC4xMDYyNyAxLjYyIDIuMjMzNzMgMS41NCA0Ljc5MzczTDAgNDEuNTUzN0MwLjAyIDQ0LjgyMzcgMy4yOCA0Ni4wOTM3IDYuOTkgNDQuNjkzN0MxMCA0My41NTM3IDE0LjA0IDQwLjU0MzcgMTMuODIgNDAuMjkzN0MxMy43Nzc5IDQwLjI0OTYgMTMuNCA0MC40NTcyIDEyLjgwMDYgNDAuNzg2NEMxMC41NTA3IDQyLjAyMjQgNS4xODAwMSA0NC45NzI2IDIuNzQgNDIuNzUzN0MwLjE1IDQwLjQwMzcgNi45NCAyOS40MzM3IDE5LjY4IDE4LjM1MzdaTTkuMzE5NzMgNy44NzM0Nkw2Ljc3OTczIDYuNTQzNDZMNy4yNjk3MyA5LjM2MzQ2TDUuMjE5NzMgMTEuMzYzNUw4LjA0OTczIDExLjc3MzVMOS4zMTk3MyAxNC4zNDM1TDEwLjU4OTcgMTEuNzczNUwxMy40MTk3IDExLjM2MzVMMTEuMzY5NyA5LjM2MzQ2TDExLjg0OTcgNi41NDM0Nkw5LjMxOTczIDcuODczNDZaIiBmaWxsPSIjMTIxMjEyIi8+Cjwvc3ZnPgo=';

		const svg = createSVG({
			data: payload.data,
			shape: 'circle',
			logo,
			logoRatio: 89 / 100,
			anchorInnerFill: fill,
			anchorOuterFill: fill,
			moduleFill: fill,
		});

		const Resvg = await initResgWasm();
		const png = new Resvg(svg, {
			fitTo: {
				mode: 'height',
				value: size,
			},
		})
			.render()
			.asPng();

		const headers = {
			'Cache-Control': 'public, immutable, no-transform, max-age=604800',
			'Content-Type': 'image/png',
		};
		return new Response(png, { headers });
	},
};
