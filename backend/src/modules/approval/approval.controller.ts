import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../../config/db";
import {
  decideResponseVersion,
  decideTaskSubmission,
  getParticipantPoints,
  listPendingForReviewer,
} from "./approval.service";

const isAdmin = (req: Request) => req.user!.role === Role.ADMIN;

export async function pending(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listPendingForReviewer(req.user!.userId, isAdmin(req));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function decideResponse(req: Request, res: Response, next: NextFunction) {
  try {
    const version = await decideResponseVersion(
      req.params.versionId,
      req.user!.userId,
      isAdmin(req),
      req.body.status
    );
    res.status(200).json({ version });
  } catch (err) {
    next(err);
  }
}

export async function decideTask(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await decideTaskSubmission(
      req.params.submissionId,
      req.user!.userId,
      isAdmin(req),
      req.body.status,
      req.body.score
    );
    res.status(200).json({ submission });
  } catch (err) {
    next(err);
  }
}

// The logged-in participant's own point total.
export async function myPoints(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await prisma.participantProfile.findUnique({
      where: { userId: req.user!.userId },
      select: { id: true },
    });
    if (!profile) {
      return res.status(200).json({ points: 0, pending: 0 });
    }
    res.status(200).json(await getParticipantPoints(profile.id));
  } catch (err) {
    next(err);
  }
}
