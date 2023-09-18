export type CommonResponseDTO<Data = undefined> =
  | CommonErrorResponseDTO
  | CommonSuccessResponseDTO<Data>;

export type CommonErrorResponseDTO = {
  success: false;
  code: string;
  errors: string[];
};

export type CommonSuccessResponseDTO<Data = undefined> = undefined extends Data
  ? {
      success: true;
    }
  : {
      success: true;
      data: Data;
    };

export type CommonRequestConfig = {
  serviceURL: string;
  clientID: string;
  clientSecret: string;
};

export type ErrorSpecs = {
  code: string;
  status: number;
};

export type CommonRequestFactory<Data> = (
  data: Data,
  config: CommonRequestConfig | 'internal',
) => Promise<Request>;
