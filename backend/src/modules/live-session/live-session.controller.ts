import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import { broadcastGrouping, broadcastSessionClosed } from "../../realtime/socket";
import * as service from "./live-session.service";

export async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await service.startSession(req.params.bootcampId);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
}

export async function activeForBootcamp(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await service.getActiveSessionForBootcamp(req.params.bootcampId);
    res.status(200).json({ session });
  } catch (err) {
    next(err);
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.getSession(req.params.sessionId));
  } catch (err) {
    next(err);
  }
}

export async function presences(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ presences: await service.listPresences(req.params.sessionId) });
  } catch (err) {
    next(err);
  }
}

export async function confirmGrouping(req: Request, res: Response, next: NextFunction) {
  try {
    const { groups, taskBrief } = req.body;
    const created = await service.confirmGrouping(req.params.sessionId, groups, taskBrief);
    broadcastGrouping(req.params.sessionId, created, taskBrief);
    res.status(200).json({ groups: created });
  } catch (err) {
    next(err);
  }
}

export async function close(req: Request, res: Response, next: NextFunction) {
  try {
    const closed = await service.closeSession(req.params.sessionId);
    broadcastSessionClosed(req.params.sessionId);
    res.status(200).json(closed);
  } catch (err) {
    next(err);
  }
}

export async function myGroup(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json({ group: await service.getMyGroup(req.params.sessionId, req.user.userId) });
  } catch (err) {
    next(err);
  }
}

export async function groupMessages(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      messages: await service.listGroupMessages(req.params.sessionId, req.params.groupId),
    });
  } catch (err) {
    next(err);
  }
}

export async function myReceivedMessages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json({ messages: await service.listReceivedPersonalMessages(req.user.userId) });
  } catch (err) {
    next(err);
  }
}

export async function myGroupArchive(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("احراز هویت لازم است.", 401);
    res.status(200).json({ groups: await service.listMyGroupArchive(req.user.userId) });
  } catch (err) {
    next(err);
  }
}

export async function adminLog(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupId, participantId, from, to } = req.query as Record<string, string | undefined>;
    const result = await service.adminSessionLog(req.params.sessionId, {
      groupId,
      participantId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
