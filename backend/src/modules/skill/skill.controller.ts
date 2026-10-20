import { NextFunction, Request, Response } from "express";
import {
  addSkill,
  deleteSkill,
  endorseSkill,
  endorseSkillsByTagForParticipant,
  listAllSkillTags,
  listOwnSkills,
} from "./skill.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const skills = await listOwnSkills(req.user!.userId);
    res.status(200).json({ skills });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const skill = await addSkill(req.user!.userId, req.body);
    res.status(201).json({ skill });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteSkill(req.user!.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Public — no auth.
export async function endorse(req: Request, res: Response, next: NextFunction) {
  try {
    const endorsement = await endorseSkill(req.params.id, req.body);
    res.status(201).json({ endorsement });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. The tag pool for the feedback form's skill picker.
export async function listTags(_req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await listAllSkillTags();
    res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. Endorses one or more tags for a participant by
// slug, in bulk — used when someone submits feedback with tags picked.
export async function endorseByTags(req: Request, res: Response, next: NextFunction) {
  try {
    const applied = await endorseSkillsByTagForParticipant(
      req.params.slug,
      req.body.tagNames,
      req.body.endorserName
    );
    res.status(201).json({ applied });
  } catch (err) {
    next(err);
  }
}
