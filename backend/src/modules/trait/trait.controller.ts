import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/errors";
import {
  generateSituationalQuestions,
  importFromExcel,
  listAllTraits,
  listQuestionBank,
  listTraitsForSituation,
} from "./trait.service";

export async function listForSituation(req: Request, res: Response, next: NextFunction) {
  try {
    const traits = await listTraitsForSituation(req.params.situationId);
    res.status(200).json({ traits });
  } catch (err) {
    next(err);
  }
}

export async function listAll(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ traits: await listAllTraits() });
  } catch (err) {
    next(err);
  }
}

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError("فایل اکسل ارسال نشده است.", 400);
    }
    const result = await importFromExcel(req.file.buffer);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function generateQuestions(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await generateSituationalQuestions();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function questionBank(req: Request, res: Response, next: NextFunction) {
  try {
    const questions = await listQuestionBank({
      situationId: req.query.situationId as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.status(200).json({ questions });
  } catch (err) {
    next(err);
  }
}
