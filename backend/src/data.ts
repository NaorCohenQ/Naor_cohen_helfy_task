import type { Task, TaskInput, Priority } from "./types.ts";

let nextId = 1;

// In-memory store
const tasks: Task[] = [
  {
    id: nextId++,
    title: "Plan API",
    description: "Sketch routes and data structure",
    completed: false,
    createdAt: new Date(),
    priority: "high",
  },
  {
    id: nextId++,
    title: "Write backend",
    description: "Implement Express routes and middleware",
    completed: false,
    createdAt: new Date(),
    priority: "medium",
  },

    {
    id: nextId++,
    title: "Write backendX",
    description: "Implement Express routes and middleware",
    completed: false,
    createdAt: new Date(),
    priority: "medium",
  },

      {
    id: nextId++,
    title: "Write XY",
    description: "Implement Express",
    completed: false,
    createdAt: new Date(),
    priority: "low",
  },
];

// Helpers
const isPriority = (p: any): p is Priority =>
  p === "low" || p === "medium" || p === "high";

const cleanStr = (s: unknown) => (typeof s === "string" ? s.trim() : "");

export const listTasks = (): Task[] => [...tasks];

export const getTask = (id: number) =>
  tasks.find(t => t.id === id);

export const createTask = (input: TaskInput): Task => {
  const t: Task = {
    id: nextId++,
    title: cleanStr(input.title),
    description: cleanStr(input.description),
    completed: false,
    createdAt: new Date(),
    priority: isPriority(input.priority) ? input.priority : "medium",
  };
  tasks.push(t);
  return t;
};

export const updateTask = (
  id: number,
  patch: Partial<TaskInput & { completed: boolean }>
): Task | null => {
  const t = getTask(id);
  if (!t) return null;

  if (patch.title !== undefined) t.title = cleanStr(patch.title);
  if (patch.description !== undefined) t.description = cleanStr(patch.description);
  if (patch.priority !== undefined && isPriority(patch.priority)) t.priority = patch.priority;
  if (patch.completed !== undefined) t.completed = !!patch.completed;

  return t;
};

export const toggleTask = (id: number): Task | null => {
  const t = getTask(id);
  if (!t) return null;
  t.completed = !t.completed;
  return t;
};

export const deleteTask = (id: number): boolean => {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
};

