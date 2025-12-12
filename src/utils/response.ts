import { Response } from "express";
import { ZodError } from "zod";

export function sendResponse<T>(
  res: Response,
  data: T | null,
  message: string,
  success = true,
  status = 200,
  
) {
  res.status(status).json({ success, data, message });
}


export function sendErrorResponse(
  res: Response,
  error: unknown,
  status = 500,
  manualMessage: string | null = null,
) {

  let message;
  if (error instanceof ZodError) message = error.issues[0].message;
  else if (error instanceof Error) message = error.message.replace(/\n/g, ' ');
  else message = String(error);
  
  manualMessage && (message = manualMessage);

  res.status(status).json({ success: false, data: error, message });
}