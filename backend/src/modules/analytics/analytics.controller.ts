import { NextFunction, Request, Response } from "express";
import {
  getBootcampEffectiveness,
  getCriteriaBreakdown,
  getIdentityGap,
  getOverview,
  getRegionalBreakdown,
} from "./analytics.service";

export async function overview(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await getOverview());
  } catch (err) {
    next(err);
  }
}

export async function bootcampEffectiveness(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ bootcamps: await getBootcampEffectiveness() });
  } catch (err) {
    next(err);
  }
}

export async function criteriaBreakdown(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ criteria: await getCriteriaBreakdown() });
  } catch (err) {
    next(err);
  }
}

export async function regionalBreakdown(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ regions: await getRegionalBreakdown() });
  } catch (err) {
    next(err);
  }
}

export async function identityGap(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await getIdentityGap());
  } catch (err) {
    next(err);
  }
}
