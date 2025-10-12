import jwt, { JwtPayload as JwtPayload } from '@tsndr/cloudflare-worker-jwt';
import { RpcTarget } from 'cloudflare:workers';

export class JwtService extends RpcTarget {
	#env: Env;
	constructor(env: Env) {
		super();
		this.#env = env;
	}

	async #getSecret(): Promise<string> {
		// Workaround for this https://github.com/cloudflare/workers-sdk/issues/9006
		return !this.#env.LOCAL ? await this.#env.secret_jwt.get() : 'secret';
	}

	async verify<Payload>(token: string): Promise<JwtVerificationResult<Payload>> {
		try {
			const secret = await this.#getSecret();
			const verifiedToken = await jwt.verify<Payload>(token, secret, { throwError: true });
			if (!verifiedToken || !verifiedToken.payload)
				return {
					success: false,
					error: 'UNKNOWN',
				};
			return {
				success: true,
				payload: verifiedToken.payload,
			};
		} catch (e) {
			if (TOKEN_VERIFICATION_ERRORS.includes((e as Error).message)) {
				return {
					success: false,
					error: (e as Error).message,
				};
			}
			throw e;
		}
	}

	async sign<Payload>(payload: JwtPayload<Payload>): Promise<string> {
		const secret = await this.#getSecret();
		return jwt.sign(
			{
				iss: 'backend.sveltevietnam.dev',
				...payload,
			},
			secret,
		);
	}
}

export const TOKEN_VERIFICATION_ERRORS = [
	'ALG_MISMATCH',
	'NOT_YET_VALID',
	'EXPIRED',
	'INVALID_SIGNATURE',
];

export type JwtVerificationResult<Payload> =
	| {
			success: true;
			payload: JwtPayload<Payload>;
	  }
	| {
			success: false;
			error: string;
	  };
