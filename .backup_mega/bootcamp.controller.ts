import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import { env } from "../../config/env";
import {
  addQuestion,
  attachQuestionToBootcamp,
  createBootcamp,
  getBootcampById,
  listBootcamps,
  setBootcampStatus,
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
    const bootcamp = await getBootcampById(req.params.id);
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
