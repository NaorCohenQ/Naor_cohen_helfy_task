import { useEffect, useMemo, useState } from "react";
import "./styles/global.css";
import type { Priority, Task } from "./types";
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from "./services/api";
import Carousel from "./components/Carousel";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";


type Filter = "all" | "completed" | "pending";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { setTasks(await getTasks()); setErr(null); }
    catch (e: any) { setErr(e?.message || "Failed to load tasks"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (filter==="completed") return tasks.filter(t=>t.completed);
    if (filter==="pending") return tasks.filter(t=>!t.completed);
    return tasks;
  }, [tasks, filter]);

  async function onCreate(d:{title:string;description:string;priority:Priority}) {
    const created = await createTask(d);
    setTasks(p=>[...p, created]);
  }
  async function onUpdate(id:number, patch:Partial<Task>) {
    const updated = await updateTask(id, patch);
    setTasks(p=>p.map(t=>t.id===id?updated:t));
  }
  async function onToggle(id:number) {
    const updated = await toggleTask(id);
    setTasks(p=>p.map(t=>t.id===id?updated:t));
  }
  async function onDelete(id:number) {
    await deleteTask(id);
    setTasks(p=>p.filter(t=>t.id!==id));
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Task Manager</h2>
        <div className="row">
          <button className="btn" onClick={()=>setFilter("all")}>All</button>
          <button className="btn" onClick={()=>setFilter("completed")}>Completed</button>
          <button className="btn" onClick={()=>setFilter("pending")}>Pending</button>
          <button className="btn" onClick={load}>Reload</button>
        </div>
      </div>

      <TaskForm onCreate={onCreate} />

      {loading && <div className="panel">Loading…</div>}
      {err && <div className="panel" style={{color:"salmon"}}>{err}</div>}
      {!loading && tasks.length===0 && <div className="panel">No tasks yet.</div>}

      {!loading && filtered.length>0 && (
        <Carousel
        items={filtered}
        render={(t)=>(
            <TaskCard task={t} onUpdate={onUpdate} onToggle={onToggle} onDelete={onDelete}/>
        )}
        />

      )}
    </div>
  );
}
