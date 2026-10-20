import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import {
  assignEvaluator,
  createCriterion,
  createEvaluation,
  getEvaluationForRequester,
  getParticipantReviewBundle,
  listAssignedParticipants,
  listCriteria,
  saveDraft,
  submitEvaluation,
  updateCriterion,
} from "./evaluation.service";

const isAdmin = (req: Request) => req.user!.role === Role.ADMIN;

export async function listCriteriaHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ criteria: await listCriteria() });
  } catch (err) {
    next(err);
  }
}

export async function createCriterionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ criterion: await createCriterion(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateCriterionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .status(200)
      .json({ criterion: await updateCriterion(req.params.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function assignHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ assignment: await assignEvaluator(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function assignedHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const assignments = await listAssignedParticipants(req.user!.userId);
    res.status(200).json({ assignments });
  } catch (err) {
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluation = await createEvaluation(
      req.user!.userId,
      req.body.participantId,
      isAdmin(req)
    );
    res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluation = await getEvaluationForRequester(
      req.params.id,
      req.user!.userId,
      isAdmin(req)
    );
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

export async function saveDraftHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluation = await saveDraft(
      req.params.id,
      req.user!.userId,
      isAdmin(req),
      req.body
    );
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

export async function submitHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluation = await submitEvaluation(
      req.params.id,
      req.user!.userId,
      isAdmin(req)
    );
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

export async function reviewBundleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const bundle = await getParticipantReviewBundle(
      req.user!.userId,
      req.params.participantId,
      isAdmin(req)
    );
    res.status(200).json(bundle);
  } catch (err) {
    next(err);
  }
}
