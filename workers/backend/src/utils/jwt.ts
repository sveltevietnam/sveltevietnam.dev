export const TOKEN_VERIFICATION_ERRORS = [
	'ALG_MISMATCH',
	'NOT_YET_VALID',
	'EXPIRED',
	'INVALID_SIGNATURE',
];

export type JwtPayload = {
	sub: string;
	iat: number;
	iss: 'backend.sveltevietnam.dev';
	exp: number;
};

export type JwtVerificationResult =
	| {
			success: true;
			payload: JwtPayload;
	  }
	| {
			success: false;
			error: string;
	  };
