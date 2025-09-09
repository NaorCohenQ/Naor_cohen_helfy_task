import { useState } from "react";
import type { Priority, Task } from "../types";

export default function TaskCard({ task, onUpdate, onToggle, onDelete }: {
  task: Task;
  onUpdate: (id: number, patch: Partial<Task>) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);

  async function save() {
    await onUpdate(task.id, { title, description: desc, priority });
    setEdit(false);
  }

  return (
    <div className={`panel card ${task.priority}`}>
      {edit ? (
        <>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)} />
          <select className="select" value={priority} onChange={e=>setPriority(e.target.value as Task["priority"])}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <div className="row" style={{marginTop:8}}>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn" onClick={()=>setEdit(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="row" style={{justifyContent:"space-between"}}>
            <h3 style={{margin:0}}>{task.title}</h3>
            <span className="priority-text">{task.priority}</span>
          </div>
          <p>{task.description}</p>
          <p>Status: {task.completed ? "Completed" : "InCompleted"}</p>
          <div className="row">
            <button className="btn" onClick={()=>setEdit(true)}>Edit</button>
            <button className="btn" onClick={()=>onToggle(task.id)}>
              {task.completed ? "Mark Pending" : "Mark Done"}
            </button>
            <button className="btn btn-danger" onClick={()=>{ if(confirm("Delete?")) onDelete(task.id) }}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
