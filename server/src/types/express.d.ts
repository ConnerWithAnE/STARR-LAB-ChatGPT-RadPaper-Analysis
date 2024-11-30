import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type as needed, e.g., `Record<string, any>` or a custom User type
    }
  }
}
