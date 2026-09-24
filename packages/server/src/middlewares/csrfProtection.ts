import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.ts";

const CSRF_COOKIE_NAME = "csrf_token" as const;
const CSRF_HEADER_NAME = "x-csrf-token" as const;
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;

const ALLOWED_ORIGINS: string[] = [process.env.BASE_URL!];
if (process.env.NODE_ENV !== "production") {
  ALLOWED_ORIGINS.push("http://localhost:5173");
}

function getOriginFromReferer(referer: string | undefined): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function timingSafeEqual(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  let cookieToken: string | undefined = req.cookies?.[CSRF_COOKIE_NAME];
  if (!cookieToken) {
    cookieToken = crypto.randomBytes(32).toString("hex");
    res.cookie(CSRF_COOKIE_NAME, cookieToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    if (req.cookies) {
      req.cookies[CSRF_COOKIE_NAME] = cookieToken;
    }
  }

  const method = req.method.toUpperCase() as (typeof MUTATING_METHODS)[number];
  if (!MUTATING_METHODS.includes(method)) {
    return next();
  }

  // 1. Origin / Referer 驗證
  const origin = req.headers["origin"];
  const referer = req.headers["referer"];
  const requestOrigin = origin || getOriginFromReferer(referer);

  if (!requestOrigin) {
    throw new ApiError(403, {
      code: "CSRF_ORIGIN_MISSING",
      message: "無法驗證請求來源",
      path: req.path,
    });
    return;
  }

  if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
    throw new ApiError(403, {
      code: "CSRF_ORIGIN_INVALID",
      message: "請求來源驗證失敗",
      path: req.path,
    });
    return;
  }

  // 2. Double submit token 驗證
  const headerToken = req.headers[CSRF_HEADER_NAME];
  const headerTokenValue = Array.isArray(headerToken)
    ? headerToken[0]
    : headerToken;

  if (!timingSafeEqual(cookieToken, headerTokenValue)) {
    throw new ApiError(403, {
      code: "CSRF_TOKEN_MISMATCH",
      message: "CSRF token 驗證失敗",
      path: req.path,
    });
    return;
  }

  return next();
}

export default csrfProtection;
