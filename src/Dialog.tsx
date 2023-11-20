import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type DialogProps = ComponentPropsWithoutRef<"dialog"> & {
  open: boolean; // required
  onClose: (returnValue?: string) => void; // override
};

export default function Dialog(props: DialogProps) {
  const { open, children, onClose, ...rest } = props;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    const dialog = ref.current!;
    onClose(dialog.returnValue);
  }, [onClose]);

  return (
    <dialog ref={ref} {...rest} onClose={handleClose}>
      {children}
    </dialog>
  );
}
