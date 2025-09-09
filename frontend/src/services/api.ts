import type { Task } from "../types";

const BASE = "http://localhost:4000";

export async function getTasks(): Promise<Task[]> {
  const r = await fetch(`${BASE}/api/tasks`);
  if (!r.ok) throw new Error("Failed to fetch tasks");
  return r.json();
}

export async function createTask(data: {
  title: string; description: string; priority: "low" | "medium" | "high";
}): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create task");
  return r.json();
}

export async function updateTask(id: number, patch: Partial<Task>): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update task");
  return r.json();
}

export async function toggleTask(id: number): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks/${id}/toggle`, { method: "PATCH" });
  if (!r.ok) throw new Error("Failed to toggle task");
  return r.json();
}

export async function deleteTask(id: number): Promise<void> {
  const r = await fetch(`${BASE}/api/tasks/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete task");
}
