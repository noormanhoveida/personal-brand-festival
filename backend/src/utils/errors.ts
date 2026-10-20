export class AppError extends Error {
  status: number;
  // Optional extra fields merged into the JSON error response — used
  // sparingly, e.g. login's 403 needing to tell the frontend WHY
  // (needsVerification) rather than just that it failed.
  extra?: Record<string, unknown>;
  constructor(message: string, status = 400, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}
