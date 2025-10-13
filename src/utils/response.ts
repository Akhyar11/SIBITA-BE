export interface ResponseParams {
  message: string;
  [key: string]: any;
}

export const response200 = (params: ResponseParams) => {
  return { status: true, code: 200, ...params };
};

export const response400 = (params: ResponseParams) => {
  return { status: false, code: 400, ...params };
};

export const response401 = (params: ResponseParams) => {
  return { status: false, code: 401, ...params };
};

export const response409 = (params: ResponseParams) => {
  return { status: false, code: 409, ...params };
};

export const response500 = (params: ResponseParams) => {
  return { status: false, code: 500, ...params };
};
