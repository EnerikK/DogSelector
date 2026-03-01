import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  count: number;
  onConfirm: () => Promise<void>;
}

export function BulkDelete({ count, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setOpen(true)}
        >
          Remove Selected ({count})
        </button>
      </div>

      <ConfirmDialog
        open={open}
        title="You are about to remove selected dogs."
        description="Once removed, this action is irreversible. Do you want to continue?"
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
}