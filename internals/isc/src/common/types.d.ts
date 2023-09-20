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
} & (true extends HasToken ? { token: string } : Record<string, never>);

export type ErrorSpecs = {
  code: string;
  status: number;
};

export type CommonRequestFactory<Data, HasToken extends boolean = false> = (
  data: Data,
  config: CommonRequestConfig<HasToken> | 'internal',
) => Promise<Request>;
