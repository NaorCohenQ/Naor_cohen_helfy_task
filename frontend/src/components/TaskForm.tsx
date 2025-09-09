import { useState } from "react";
import type { Priority } from "../types";

export default function TaskForm({ onCreate }: {
  onCreate: (data: { title: string; description: string; priority: Priority }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await onCreate({ title: title.trim(), description: description.trim(), priority });
    setTitle(""); setDescription(""); setPriority("medium");
  }

  return (
    <form onSubmit={submit} className="panel">
      <div className="row">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <select className="select" value={priority} onChange={e=>setPriority(e.target.value as Priority)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>
      <textarea className="textarea" placeholder="Description"
        value={description} onChange={e=>setDescription(e.target.value)} />
      <button className="btn" style={{ marginTop: 8 }}>Add Task</button>
    </form>
  );
}
