"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTaskAd() {
  const router = useRouter();
  const [taskAd, setTaskAd] = useState({ name: "", detail: "", schedule: "" });
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, { name: "", wage: "", detail: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, [field]: value } : task));
    setTasks(updatedTasks);
  };

  const saveTaskAd = async () => {
    await fetch("/api/taskAds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...taskAd, tasks }),
    });
    router.push("/");
  };

  return (
    <div>
      <input placeholder="Task Ad Name" onChange={(e) => setTaskAd({ ...taskAd, name: e.target.value })} />
      <input placeholder="Detail" onChange={(e) => setTaskAd({ ...taskAd, detail: e.target.value })} />
      <input type="date" onChange={(e) => setTaskAd({ ...taskAd, schedule: e.target.value })} />
      
      {tasks.map((task, index) => (
        <div key={index}>
          <input placeholder="Task Name" onChange={(e) => handleChange(index, "name", e.target.value)} />
          <input placeholder="Wage" type="number" onChange={(e) => handleChange(index, "wage", parseFloat(e.target.value))} />
          <input placeholder="Detail" onChange={(e) => handleChange(index, "detail", e.target.value)} />
        </div>
      ))}
      
      <button onClick={addTask}>Add Task</button>
      <button onClick={saveTaskAd}>Save</button>
    </div>
  );
}
