import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import {
  createRegion,
  getOverview,
  listParticipants,
  listRegions,
  listUsers,
  updateUserRole,
  setUserBlocked,
  deleteUser,
} from "./admin.service";

export async function overview(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await getOverview());
  } catch (err) {
    next(err);
  }
}

export async function users(req: Request, res: Response, next: NextFunction) {
  try {
    const role = req.query.role as Role | undefined;
    res.status(200).json({ users: await listUsers(role) });
  } catch (err) {
    next(err);
  }
}

export async function changeUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await updateUserRole(req.params.id, req.body);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function regions(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ regions: await listRegions() });
  } catch (err) {
    next(err);
  }
}

export async function addRegion(req: Request, res: Response, next: NextFunction) {
  try {
    const region = await createRegion(req.body);
    res.status(201).json({ region });
  } catch (err) {
    next(err);
  }
}

export async function participants(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listParticipants({
      regionId: req.query.regionId as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.status(200).json({ participants: result });
  } catch (err) {
    next(err);
  }
}

export async function blockUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { blocked } = req.body;
    const user = await setUserBlocked(req.params.id, Boolean(blocked));
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "کاربر با موفقیت حذف شد" });
  } catch (err) {
    next(err);
  }
}
