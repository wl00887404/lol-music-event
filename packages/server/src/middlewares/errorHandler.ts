import { type Request, type Response, type NextFunction } from "express";

export class ApiError {
  status = 500;
  body = {
    code: "UNKNOWN_ERROR",
    message: "發生未知的錯誤",
  };

  constructor(status?: number, body?: any) {
    if (status) this.status = status;
    if (body) this.body = body;
  }

  toString() {
    return `ApiError status=${this.status} body=${JSON.stringify(this.body)} `;
  }
}

function handleError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    console.error(err.toString());
  } else {
    console.error(err);
  }

  const output = err instanceof ApiError ? err : new ApiError();

  return res.status(output.status).send(output.body);
}

export default handleError;
