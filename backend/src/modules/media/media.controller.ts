import { NextFunction, Request, Response } from "express";
import { deleteMedia, listOwnMedia, saveUploadedMedia } from "./media.service";
import { MediaError } from "./media.service";

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new MediaError("فایلی ارسال نشده است.", 400);
    }
    const media = await saveUploadedMedia(req.user!.userId, req.file, req.body);
    res.status(201).json({ media });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ media: await listOwnMedia(req.user!.userId) });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteMedia(req.user!.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
