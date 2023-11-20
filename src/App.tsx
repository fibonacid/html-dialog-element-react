import { useState } from "react";
import { CreateTodo } from "./CreateTodo";

const initialTodos = [
  "Write a blog post",
  "Share the article",
  "Find mistakes",
  "Write new article",
];

export default function App() {
  const [todos, setTodos] = useState<string[]>(initialTodos);
  const [open, setOpen] = useState(false);

  return (
    <main className="m-4">
      <h1 id="title" className="text-lg font-bold mb-2">
        TODOs
      </h1>
      <ul aria-labelledby="title" className="list-disc list-inside mb-4">
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white p-2 rounded"
      >
        Add todo
      </button>
      <CreateTodo
        open={open}
        onClose={(value) => {
          setOpen(false);
          if (value) setTodos([...todos, value]);
        }}
      />
    </main>
  );
}
