import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import * as service from "./leaderboard.service";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ boards: await service.listBoards() });
  } catch (err) {
    next(err);
  }
}

export async function listPublished(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ boards: await service.listPublishedBoards() });
  } catch (err) {
    next(err);
  }
}

export async function ranking(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.getRanking(req.params.leaderboardId));
  } catch (err) {
    next(err);
  }
}

export async function publicRanking(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.getPublicRanking(req.params.leaderboardId));
  } catch (err) {
    next(err);
  }
}

export async function createBoard(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(201).json(await service.createCustomBoard(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

export async function deleteBoard(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteCustomBoard(req.params.leaderboardId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function scoreEntry(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    const entry = await service.setEntryScore(req.params.leaderboardId, req.user.userId, req.body);
    res.status(200).json(entry);
  } catch (err) {
    next(err);
  }
}

export async function publish(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.setPublished(req.params.leaderboardId, req.body.published));
  } catch (err) {
    next(err);
  }
}

export async function mySummary(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    const profile = await prisma.participantProfile.findUnique({
      where: { userId: req.user.userId },
      select: { id: true },
    });
    if (!profile) return res.status(200).json({ boards: [] });
    res.status(200).json({ boards: await service.getParticipantSummary(profile.id) });
  } catch (err) {
    next(err);
  }
}

export async function forParticipant(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ boards: await service.getParticipantSummary(req.params.participantId) });
  } catch (err) {
    next(err);
  }
}

export async function participantsForScoring(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ participants: await service.listParticipantsForScoring() });
  } catch (err) {
    next(err);
  }
}
