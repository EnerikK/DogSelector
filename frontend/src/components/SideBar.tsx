import {useEffect,useState} from "react";
import { createPortal } from "react-dom";
import type {Dog} from "../types/dogs"

interface Props {
    open: boolean
    dog: Dog | null;
    onClose: () => void
    onSave: (updated: Partial<Dog>) => Promise<void>;
}

export function SideBar({open,dog,onClose,onSave}: Props) {
    const [status,setStatus] = useState<Dog["status"]>("PENDING");
    const [note, setNote] = useState("")
    const [loading, setLoading] = useState(false);
    const [noteError, setNoteError] = useState<string | null>(null);

    const statusOptions = [
      { value: "PENDING", label: "Pending" },
      { value: "ACCEPTED", label: "Accepted" },
      { value: "REJECTED", label: "Rejected" },
    ];
    
    useEffect(() => {
        if(dog){
            setStatus(dog.status);
            setNote(dog.note ?? "");
        }
    },[dog]);

    useEffect(() => {
        if(open){
            document.body.style.overflow = "hidden";
        }else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        }
    },[open])

    if(!open || !dog) return null;

    const handleSave = async () => {
        if (!note.trim()) {
         setNoteError("Mendatory field cannot stay empty.");
        return;
       }
        try {
            setLoading(true);
            await onSave({status,note});
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
    <>
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      <div
        className="offcanvas offcanvas-end show"
        style={{ visibility: "visible", zIndex: 1050, width: "420px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Edit</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          />
        </div>

        <div className="offcanvas-body">

          <div className="bg-light p-3 rounded mb-4">
            <div className="mb-2">
              <strong>Breed</strong>
              <div>{dog.breed_name}</div>
            </div>

            <div>
              <strong>Description</strong>
              <div>{dog.description_text}</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Change status
            </label>

        {statusOptions.map((option) => (
          <div className="form-check" key={option.value}>
            <input
              type="radio"
              className="form-check-input"
              name="status"
              value={option.value}
              checked={status === option.value}
              onChange={() =>
                setStatus(option.value as Dog["status"])
              }
            />
            <label className="form-check-label">
              {option.label}
            </label>
          </div>
        ))}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Note – Why did you change status?*
            </label>

            <textarea
              className={`form-control ${noteError ? "is-invalid" : ""}`}
              rows={4}
              required={true}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type here"
            />
            {noteError && (
              <div className="invalid-feedback d-block">
                {noteError}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>
    </>,
    document.body
    );
}