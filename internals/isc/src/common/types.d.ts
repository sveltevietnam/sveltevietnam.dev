export type CommonResponseDTO<Data = undefined> =
	| CommonErrorResponseDTO
	| CommonSuccessResponseDTO<Data>;

export type CommonErrorResponseDTO = {
	success: false;
	code: string;
};

export type CommonSuccessResponseDTO<Data = undefined> = undefined extends Data
	? {
			success: true;
	  }
	: {
			success: true;
			data: Data;
	  };

export type CommonRequestConfig<HasToken extends boolean = false> = {
	serviceURL: string;
	clientID: string;
	clientSecret: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
} & (true extends HasToken ? { token: string } : {});

export type ErrorSpecs = {
	code: string;
	status: number;
};

export type CommonRequestFactory<Data, HasToken extends boolean = false> = (
	data: Data,
	config: CommonRequestConfig<HasToken> | 'internal',
) => Promise<Request>;

export type CommonGetRequestFactory<HasToken extends boolean = false> = (
	config: CommonRequestConfig<HasToken> | 'internal',
) => Promise<Request>;
