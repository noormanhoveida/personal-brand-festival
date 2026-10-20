import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import { env } from "../../config/env";
import * as service from "./challenge.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(201).json(await service.createChallenge(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.updateChallenge(req.params.challengeId, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteChallenge(req.params.challengeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const onlyActive = req.user?.role === "PARTICIPANT";
    res.status(200).json({ challenges: await service.listChallenges(onlyActive) });
  } catch (err) {
    next(err);
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.getChallenge(req.params.challengeId));
  } catch (err) {
    next(err);
  }
}

export async function mySubmission(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json(await service.getMySubmission(req.params.challengeId, req.user.userId));
  } catch (err) {
    next(err);
  }
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    const submission = await service.submitWork(req.params.challengeId, req.user.userId, req.body);
    res.status(200).json(submission);
  } catch (err) {
    next(err);
  }
}

export async function uploadAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError("فایلی ارسال نشده است.", 400);
    res.status(201).json({ url: `${env.backendUrl}/uploads/${req.file.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function submissions(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ submissions: await service.listSubmissionsForChallenge(req.params.challengeId) });
  } catch (err) {
    next(err);
  }
}

export async function sendToInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.sendSubmissionToInstructor(req.params.submissionId));
  } catch (err) {
    next(err);
  }
}
