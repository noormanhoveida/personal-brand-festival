import { NextFunction, Request, Response } from "express";
import {
  createFeedbackRequest,
  getRequestInfo,
  listOwnFeedbackRequests,
  listReceivedFeedback,
  submitFeedback,
  submitFeedbackBySlug,
} from "./feedback.service";

export async function createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const request = await createFeedbackRequest(req.user!.userId, req.body);
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const [requests, received] = await Promise.all([
      listOwnFeedbackRequests(req.user!.userId),
      listReceivedFeedback(req.user!.userId),
    ]);
    res.status(200).json({ requests, received });
  } catch (err) {
    next(err);
  }
}

// Public — no auth required. attachUserIfPresent (mounted on the route)
// links the response to the submitter's participant profile if they
// happen to be logged in, without requiring it.
export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await submitFeedback(req.body, req.user?.userId);
    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. Used from the public profile page's built-in
// feedback form, so visitors never need a private link/token.
export async function submitBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await submitFeedbackBySlug(
      req.params.slug,
      req.body,
      req.user?.userId
    );
    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. Resolves a link token to who it belongs to.
export async function linkInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const requester = await getRequestInfo(req.params.token);
    res.status(200).json({ requester });
  } catch (err) {
    next(err);
  }
}
