import { useState } from "react";
import Dialog, { DialogProps } from "./Dialog";

export function CreateTodo({
  open,
  onClose,
}: Pick<DialogProps, "open" | "onClose">) {
  const [value, setValue] = useState("");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="todo-title"
      aria-describedby="todo-description"
      className="rounded mt-10 p-4"
    >
      <h3 id="todo-title" className="font-bold text-lg mb-2">
        Create TODO
      </h3>
      <p id="todo-description" className="mb-2">
        Enter the name of the TODO
      </p>
      <form method="dialog">
        <div className="mb-4">
          <label htmlFor="todo-name" className="sr-only">
            TODO
          </label>
          <input
            id="todo-name"
            className="border rounded p-1 w-full"
            value={value}
            autoFocus
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <button formMethod="dialog" className="flex-1 rounded border p-2">
            Cancel
          </button>
          <button
            value={value}
            disabled={!value}
            className="flex-1 rounded border p-2 bg-black text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>
    </Dialog>
  );
}
