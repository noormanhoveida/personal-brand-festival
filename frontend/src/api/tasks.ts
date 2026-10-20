import { apiClient } from "./client";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
}

export interface TaskSubmission {
  id: string;
  content: string;
  createdAt: string;
}

export async function listBootcampTasks(bootcampId: string) {
  const { data } = await apiClient.get<{ tasks: Task[] }>(
    `/bootcamps/${bootcampId}/tasks`
  );
  return data.tasks;
}

export async function createTask(
  bootcampId: string,
  input: { title: string; description?: string }
) {
  const { data } = await apiClient.post<{ task: Task }>(
    `/bootcamps/${bootcampId}/tasks`,
    input
  );
  return data.task;
}

export async function submitTask(taskId: string, content: string) {
  const { data } = await apiClient.post<{ submission: TaskSubmission }>(
    `/tasks/${taskId}/submissions`,
    { content }
  );
  return data.submission;
}

export async function listMySubmissions(taskId: string) {
  const { data } = await apiClient.get<{ submissions: TaskSubmission[] }>(
    `/tasks/${taskId}/submissions`
  );
  return data.submissions;
}
