import { NextFunction, Request, Response } from "express";
import {
  addResponseVersion,
  createResponse,
  getResponseHistory,
  listOwnResponses,
  listParticipantResponsesForAdmin,
  setSelfTransformationScore,
  setReviewerScore,
} from "./response.service";
import { scoreSelfSchema, scoreReviewerSchema } from "./response.validator";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const responses = await listOwnResponses(req.user!.userId);
    res.status(200).json({ responses });
  } catch (err) {
    next(err);
  }
}

export async function history(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await getResponseHistory(req.user!.userId, req.params.id);
    res.status(200).json({ response });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await createResponse(req.user!.userId, req.body);
    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
}

// Semantically an "update", but implemented as append-only: it adds a
// new ResponseVersion and never mutates or deletes prior versions.
export async function addVersion(req: Request, res: Response, next: NextFunction) {
  try {
    const version = await addResponseVersion(
      req.user!.userId,
      req.params.id,
      req.body
    );
    res.status(201).json({ version });
  } catch (err) {
    next(err);
  }
}

export async function listForParticipantAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const responses = await listParticipantResponsesForAdmin(req.params.participantId);
    res.status(200).json({ responses });
  } catch (err) {
    next(err);
  }
}

export async function scoreSelf(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = scoreSelfSchema.parse(req.body);
    const updated = await setSelfTransformationScore(req.user!.userId, req.params.id, parsed.score);
    res.json({ response: updated });
  } catch (err) {
    next(err);
  }
}

export async function scoreReviewer(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = scoreReviewerSchema.parse(req.body);
    const updated = await setReviewerScore(req.params.id, parsed.score, parsed.feedback);
    res.json({ response: updated });
  } catch (err) {
    next(err);
  }
}
