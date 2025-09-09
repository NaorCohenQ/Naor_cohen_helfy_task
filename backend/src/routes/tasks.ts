import { Router } from "express";
import { listTasks, getTask, createTask, updateTask, toggleTask, deleteTask } from "../data.js"; // ⬅ .js


const router = Router();

// GET /api/tasks
router.get("/", (_req, res) => {
  res.status(200).json(listTasks());
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const t = getTask(id);
  if (!t) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(t);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const { title, description, priority } = req.body || {};

  if (!title || !description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }

  const created = createTask({ title, description, priority });
  res.status(201).json(created);
});

// PUT /api/tasks/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const updated = updateTask(id, req.body || {});
  if (!updated) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(updated); 
});

router.patch("/:id/toggle", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const toggled = toggleTask(id);
  if (!toggled) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(toggled);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const ok = deleteTask(id);
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});

export default router;
