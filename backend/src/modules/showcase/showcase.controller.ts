import { NextFunction, Request, Response } from "express";
import {
  getAdminShowcaseList,
  getPublicShowcase,
  renameCategory,
  setFeatured,
  setFinalist,
  setWinner,
} from "./showcase.service";

export async function adminShowcaseHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAdminShowcaseList();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function renameCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { oldName, newName } = req.body;
    await renameCategory(oldName, newName);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function featuredHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await setFeatured(req.params.participantId, req.body);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function finalistHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await setFinalist(req.params.participantId, req.body);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function winnerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await setWinner(req.params.participantId, req.body);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function publicShowcaseHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await getPublicShowcase());
  } catch (err) {
    next(err);
  }
}
