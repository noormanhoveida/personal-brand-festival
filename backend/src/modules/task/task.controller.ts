import { NextFunction, Request, Response } from "express";
import {
  createTask,
  listBootcampTasks,
  listOwnSubmissions,
  submitTask,
} from "./task.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await createTask(req.params.bootcampId, req.body);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await listBootcampTasks(req.params.bootcampId);
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await submitTask(req.user!.userId, req.params.taskId, req.body);
    res.status(201).json({ submission });
  } catch (err) {
    next(err);
  }
}

export async function mySubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const submissions = await listOwnSubmissions(req.user!.userId, req.params.taskId);
    res.status(200).json({ submissions });
  } catch (err) {
    next(err);
  }
}
