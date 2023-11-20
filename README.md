# HTML Dialog Element React

In a previous article i have shown how to use the HTML dialog element with React. Since then I have found a better way to use the element with React. Let's dive into it.

## App example

Let's build a todo app with a list of todos and a button to generate a new todo. The todo will be generated in a dialog element.

```tsx
import { useState } from "react";
import Dialog, { DialogProps } from "./Dialog";

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
    </main>
  );
}
```

Nothing remarkable here. Let's add the dialog element.
We are going to create a `Dialog.tsx` with the bare minimum to make the element play nice with React.

Let's start with the props:

```tsx
export type DialogProps = Omit<
  ComponentPropsWithoutRef<"dialog">,
  "onClose"
> & {
  open: boolean; // required
  onClose: (returnValue?: string) => void; // override
};`
```

We want to extend the native dialog props with some modifications:
The `open` prop should be required, signaling that the dialog needs to be controlled by the parent component.
A similar thing needs to happen with the `onClose` method: Instead of passing the event, which is not very useful, we can pass the return value of the dialog.

Now let's create the component:

```tsx
export default function Dialog(props: DialogProps) {
  const { open, children, onClose, ...rest } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onClose(dialogRef.current?.returnValue);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} onClose={handleClose} {...rest}>
      {children}
    </dialog>
  );
}
```

Now we can use the dialog in our app.
Let's create a new component called `CreateTodo`:

```tsx
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
```

This component wraps the `Dialog` component we just created and adds the necessary markup and logic to create a new todo. Let's dissect it:

```html
<form method="dialog">
```
This form is essential to make the dialog work. It tells the browser that this form is part of the dialog and that the dialog should be closed when the form is submitted.

```tsx
<input
    id="todo-name"
    className="border rounded p-1 w-full"
    value={value}
    autoFocus
    onChange={(e) => {
       setValue(e.target.value);
    }}
/>
```
This input is necessary to register the return value of the dialog. The `autoFocus` attribute is there to make sure the input is focused when the dialog opens.

```tsx
<div className="flex gap-2">
  <button formMethod="dialog" className="flex-1 rounded border p-2">
    Cancel
  </button>
  <button
    value={value} // value from the input
    disabled={!value}
    className="flex-1 rounded border p-2 bg-black text-white disabled:opacity-50"
  >
    Add
  </button>
</div>;
```

This buttons are the ones that will close the dialog. The first one uses the `formmethod` attribute to tell the browser to close the dialog without returning a value. The second one uses the `value` attribute set its state the the value of the input. When the dialog closes, the browser will set the `returnValue` property of the dialog to the value of the button.

Since in out `Dialog` component we have overridden the `onClose` method, we can get the return value from the `App` component as follows:

```tsx
export default function App() {
  const [todos, setTodos] = useState<string[]>(initialTodos);
  const [open, setOpen] = useState(false);

  return (
    <main className="m-4">
      {/* ... */}
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
```