import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export interface ErrorResponse {
  success: false;
  message: string;
  error?: unknown;
  stack?: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", {
    url: req.url,
    method: req.method,
    message: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  let appError: AppError;

  /* ===================== ZOD ===================== */
  if (err instanceof ZodError) {
    const message = err.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    appError = new AppError(message || "Validation failed", 400);
  }

  /* ===================== PRISMA ===================== */
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        appError = new AppError("Duplicate field value entered", 400);
        break;
      case "P2025":
        appError = new AppError("Record not found", 404);
        break;
      case "P2003":
        appError = new AppError("Foreign key constraint failed", 400);
        break;
      default:
        appError = new AppError("Database error occurred", 500);
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    appError = new AppError("Database connection error", 503);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    appError = new AppError("Invalid data provided", 400);
  }

  /* ===================== AUTH ===================== */
  else if (err instanceof Error && err.name === "JsonWebTokenError") {
    appError = new AppError("Invalid token", 401);
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    appError = new AppError("Token expired", 401);
  }

  /* ===================== MONGOOSE (legacy safety) ===================== */
  else if (
    err instanceof Error &&
    err.name === "ValidationError"
  ) {
    appError = new AppError(err.message, 400);
  } else if (
    err instanceof Error &&
    err.name === "CastError"
  ) {
    appError = new AppError("Resource not found", 404);
  }

  /* ===================== CUSTOM ===================== */
  else if (err instanceof AppError) {
    appError = err;
  }

  /* ===================== FALLBACK ===================== */
  else {
    appError = new AppError("Internal Server Error", 500);
  }

  const response: ErrorResponse = {
    success: false,
    message: appError.message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack =
      err instanceof Error ? err.stack : undefined;
    response.error = err;
  }

  return res.status(appError.statusCode).json(response);
};
