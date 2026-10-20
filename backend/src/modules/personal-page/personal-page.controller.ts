import { NextFunction, Request, Response } from "express";
import {
  getOwnPersonalPage,
  getPublicPageBySlug,
  listPublicDirectory,
  publishPage,
  unpublishPage,
  upsertPersonalPage,
} from "./personal-page.service";

export async function getOwn(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await getOwnPersonalPage(req.user!.userId);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function edit(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await upsertPersonalPage(req.user!.userId, req.body);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function publish(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await publishPage(req.user!.userId);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

export async function unpublish(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await unpublishPage(req.user!.userId);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. Mounted at GET /public/:slug per spec §34.
export async function getPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const page = await getPublicPageBySlug(req.params.slug);
    res.status(200).json({ page });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. The community/directory listing behind /public.
export async function getDirectory(_req: Request, res: Response, next: NextFunction) {
  try {
    const participants = await listPublicDirectory();
    res.status(200).json({ participants });
  } catch (err) {
    next(err);
  }
}
