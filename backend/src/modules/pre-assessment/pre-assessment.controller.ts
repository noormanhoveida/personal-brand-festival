import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import * as service from "./pre-assessment.service";

export async function status(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json(await service.getStatus(req.user.userId));
  } catch (err) {
    next(err);
  }
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(201).json(await service.submit(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

export async function mine(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json(await service.getMine(req.user.userId));
  } catch (err) {
    next(err);
  }
}

export async function forParticipant(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.getForParticipant(req.params.participantId));
  } catch (err) {
    next(err);
  }
}

export async function updateCoordinatorNote(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await service.setCoordinatorNote(req.params.participantId, req.body.coordinatorNote);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function listAll(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ participants: await service.listAllForAdmin() });
  } catch (err) {
    next(err);
  }
}
