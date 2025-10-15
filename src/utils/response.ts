import { Response } from "express";

export interface ResponseParams {
  message: string;
  [key: string]: any;
}

const sendResponse = (
  res: Response,
  code: number,
  status: boolean,
  params: ResponseParams
) => res.status(code).json({ status, code, ...params });

const makeResponse =
  (code: number, status: boolean) => (res: Response, params: ResponseParams) =>
    sendResponse(res, code, status, params);

export const response200 = makeResponse(200, true);
export const response400 = makeResponse(400, false);
export const response401 = makeResponse(401, false);
export const response404 = makeResponse(404, false);
export const response409 = makeResponse(409, false);
export const response500 = makeResponse(500, false);
