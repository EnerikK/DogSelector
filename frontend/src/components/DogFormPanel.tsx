import { useEffect, useState } from "react";
import type { Dog } from "../types/dogs";

interface BreedOption {
  id: number;
  name: string;
}

interface DescriptionOption {
  id: number;
  text: string;
}

export interface DogFormValues {
  name: string;
  breed: number;
  description: number;
  adoption_status: Dog["adoption_status"];
  sex: Dog["sex"];
  age_group: Dog["age_group"];
  size: Dog["size"];
  country: string;
  city: string;
  postcode: string;
  photo_url: string;
  note: string;
}

interface Props {
  open: boolean;
  dog: Dog | null;
  breeds: BreedOption[];
  descriptions: DescriptionOption[];
  onClose: () => void;
  onSave: (values: DogFormValues) => Promise<void>;
}

const defaultValues: DogFormValues = {
  name: "",
  breed: 0,
  description: 0,
  adoption_status: "AVAILABLE",
  sex: "UNKNOWN",
  age_group: "UNKNOWN",
  size: "UNKNOWN",
  country: "",
  city: "",
  postcode: "",
  photo_url: "",
  note: "",
};

export function DogFormPanel({ open, dog, breeds, descriptions, onClose, onSave }: Props) {
  const [form, setForm] = useState<DogFormValues>(defaultValues);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dog) {
      setForm({
        ...defaultValues,
        breed: breeds[0]?.id ?? 0,
        description: descriptions[0]?.id ?? 0,
      });
      return;
    }

    setForm({
      name: dog.name,
      breed: dog.breed,
      description: dog.description,
      adoption_status: dog.adoption_status,
      sex: dog.sex,
      age_group: dog.age_group,
      size: dog.size,
      country: dog.country,
      city: dog.city,
      postcode: dog.postcode,
      photo_url: dog.photo_url,
      note: dog.note,
    });
  }, [breeds, descriptions, dog]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "breed" || name === "description" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        postcode: form.postcode.trim(),
        photo_url: form.photo_url.trim(),
        note: form.note.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="offcanvas-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }} />
      <div className="offcanvas offcanvas-end show shelter-panel" style={{ visibility: "visible", zIndex: 1050 }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">{dog ? "Edit dog" : "Add dog"}</h5>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form className="offcanvas-body" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Breed</label>
              <select className="form-select" name="breed" value={form.breed} onChange={handleChange} required>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>{breed.name}</option>
                ))}
              </select>
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Description</label>
              <select className="form-select" name="description" value={form.description} onChange={handleChange} required>
                {descriptions.map((description) => (
                  <option key={description.id} value={description.id}>{description.text}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="adoption_status" value={form.adoption_status} onChange={handleChange}>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="ADOPTED">Adopted</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Sex</label>
              <select className="form-select" name="sex" value={form.sex} onChange={handleChange}>
                <option value="UNKNOWN">Unknown</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Age</label>
              <select className="form-select" name="age_group" value={form.age_group} onChange={handleChange}>
                <option value="UNKNOWN">Unknown</option>
                <option value="PUPPY">Puppy</option>
                <option value="YOUNG">Young</option>
                <option value="ADULT">Adult</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Size</label>
              <select className="form-select" name="size" value={form.size} onChange={handleChange}>
                <option value="UNKNOWN">Unknown</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
                <option value="EXTRA_LARGE">Extra large</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Country</label>
              <input className="form-control" name="country" value={form.country} onChange={handleChange} required />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">City</label>
              <input className="form-control" name="city" value={form.city} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Postcode</label>
            <input className="form-control" name="postcode" value={form.postcode} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Photo URL</label>
            <input className="form-control" name="photo_url" value={form.photo_url} onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="form-label">Notes</label>
            <textarea className="form-control" name="note" rows={4} value={form.note} onChange={handleChange} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : dog ? "Save changes" : "Create dog"}
          </button>
        </form>
      </div>
    </>
  );
}
