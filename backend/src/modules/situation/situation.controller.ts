import { NextFunction, Request, Response } from "express";
import { createSituation, listSituations } from "./situation.service";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ situations: await listSituations() });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ situation: await createSituation(req.body) });
  } catch (err) {
    next(err);
  }
}
