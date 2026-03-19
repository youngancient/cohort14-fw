import { useState } from "react";
import TodoList, { initialTasks } from "./components/Todo";
import type { Task } from "./components/Todo";

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <>
      <TodoList tasks={tasks} setTasks={setTasks} />
    </>
  );
}

export default App;
