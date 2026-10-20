import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import { env } from "../../config/env";
import {
  addQuestion,
  attachQuestionToBootcamp,
  createBootcamp,
  getBootcampById,
  getBootcampParticipantsAccess,
  listBootcamps,
  setBootcampStatus,
  toggleParticipantAccess,
  updateBootcamp,
} from "./bootcamp.service";

export async function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError("فایلی ارسال نشده است.", 400);
    res.status(201).json({ url: `${env.backendUrl}/uploads/${req.file.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const bootcamps = await listBootcamps();
    res.status(200).json({ bootcamps });
  } catch (err) {
    next(err);
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;
    const bootcamp = await getBootcampById(req.params.id, userId);
    res.status(200).json({ bootcamp });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const bootcamp = await createBootcamp(req.body);
    res.status(201).json({ bootcamp });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const bootcamp = await updateBootcamp(req.params.id, req.body);
    res.status(200).json({ bootcamp });
  } catch (err) {
    next(err);
  }
}

export async function changeStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const bootcamp = await setBootcampStatus(req.params.id, req.body.status);
    res.status(200).json({ bootcamp });
  } catch (err) {
    next(err);
  }
}

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const question = await addQuestion(req.params.id, req.body);
    res.status(201).json({ question });
  } catch (err) {
    next(err);
  }
}

export async function attachQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const question = await attachQuestionToBootcamp(req.params.id, req.body.questionId);
    res.status(200).json({ question });
  } catch (err) {
    next(err);
  }
}

export async function listAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const participants = await getBootcampParticipantsAccess(req.params.id);
    res.status(200).json({ participants });
  } catch (err) {
    next(err);
  }
}

export async function updateAccess(req: Request, res: Response, next: NextFunction) {
    console.log("[UPDATE-ACCESS-PAYLOAD]", { params: req.params, body: req.body, headers: req.headers["content-type"] });
  try {
    const { userId, participantId, hasAccess } = req.body;
    const targetUserId = userId || participantId;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "شناسه کاربر (userId) ارسال نشده است.",
      });
    }

    await toggleParticipantAccess(req.params.id, targetUserId, hasAccess);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
