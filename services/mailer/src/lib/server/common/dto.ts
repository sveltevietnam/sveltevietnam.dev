export type CommonResponseDTO<Data = undefined> =
  | CommonResponseErrorDTO
  | CommonResponseSuccessDTO<Data>;

export type CommonResponseErrorDTO = {
  success: false;
  code: string;
  errors: string[];
};

export type CommonResponseSuccessDTO<Data = undefined> = undefined extends Data
  ? {
      success: true;
    }
  : {
      success: true;
      data: Data;
    };
