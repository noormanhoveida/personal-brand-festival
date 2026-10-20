import { NextFunction, Request, Response } from "express";
import {
  createProfile,
  getOwnProfile,
  updateProfile,
} from "./profile.service";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await getOwnProfile(req.user!.userId);
    if (!profile) {
      return res
        .status(200)
        .json({ profile: null, onboardingComplete: false });
    }
    res.status(200).json({ profile, onboardingComplete: true });
  } catch (err) {
    next(err);
  }
}

export async function completeOnboarding(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const profile = await createProfile(req.user!.userId, req.body);
    res.status(201).json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function editProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await updateProfile(req.user!.userId, req.body);
    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
}
