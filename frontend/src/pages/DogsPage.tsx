import { useDogs } from "../hooks/useDogs";
import { DataTable } from "../components/common/DataTable";
import type { Column } from "../components/common/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { StarRating } from "../components/StarRating";
import type { Dog } from "../types/dogs";
import { useState } from "react";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { useToast } from "../components/ToastContext";
import { ConfirmDialog } from "../components/ConfirmDialog";
import "./DogsPage.css"
import { SideBar } from "../components/SideBar";

function DogsPage() {
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [dogEdit, setDogEdit] = useState<Dog | null>(null);
  const [ordering, setOrdering] = useState<string>("");
  const { dogs, total , loading , deleteDog, bulkDeleteDogs, updateDog } = useDogs(page,pageSize,search,ordering);

  const {showToast} = useToast();

  if (loading) return <p>Loading...</p>;

  const handleSingleDelete = async () => {
    if(!dogToDelete) return;

    try {
      setDeleting(true);
      await deleteDog(dogToDelete.id);
      showToast("Dog was removed ", "success");
      setDogToDelete(null);
    } catch {
      showToast("Failed to remove dog", "error");
    } finally {
      setDeleting(false);
    }
  }

  const handleSort = (field: string) => {
    setPage(1);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else if (ordering === `-${field}`) {
      setOrdering("");
    } else {
      setOrdering(field);
    }
  };

  const columns: Column<Dog>[] = [
    {
      id: "select",
      header: (
        <input
          type="checkbox"
          className="form-check-input"
          checked={
            dogs.length > 0 && selectedIds.length === dogs.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(dogs.map((d) => d.id));
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      className: "text-center",
      accessor: (dog) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={selectedIds.includes(dog.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, dog.id]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((id) => id !== dog.id)
              );
            }
          }}
        />
      ),
    },
    {
      id: "adoption_status",
       header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("adoption_status")}
        >
          <span className="title">Adoption</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "adoption_status" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-adoption_status" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),      
      accessor: (dog) => <StatusBadge status={dog.adoption_status} />,
    },
    {
      id: "name",
      header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("name")}
        >
          <span className="title">Dog</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "name" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-name" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),
      accessor: (dog) => (
        <div>
          <div className="fw-semibold">{dog.name || "Unnamed dog"}</div>
          <div className="text-muted small">{dog.sex} · {dog.age_group} · {dog.size}</div>
        </div>
      ),
    },
    {
      id: "breed",
      header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("breed__name")}
        >
          <span className="title">Breed</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "breed__name" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-breed__name" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),
      accessor: "breed_name",
    },
    {
      id: "location",
      header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("country")}
        >
          <span className="title">Location</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "country" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-country" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),
      accessor: (dog) => (
        <div>
          <div>{[dog.city, dog.country].filter(Boolean).join(", ") || "Unknown"}</div>
          <div className="text-muted small">{dog.shelter_name || "No shelter linked"}</div>
        </div>
      ),
    },
    {
      id: "traits",
      header: "Traits",
      accessor: (dog) => (
        <div className="dog-traits">
          {dog.vaccinated === true && <span>Vaccinated</span>}
          {dog.neutered === true && <span>Neutered</span>}
          {dog.good_with_children === true && <span>Children</span>}
          {dog.good_with_dogs === true && <span>Dogs</span>}
          {dog.good_with_cats === true && <span>Cats</span>}
          {dog.vaccinated !== true &&
            dog.neutered !== true &&
            dog.good_with_children !== true &&
            dog.good_with_dogs !== true &&
            dog.good_with_cats !== true && <span className="text-muted">No traits set</span>}
        </div>
      ),
    },
    {
      id: "rating",
      header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("rating")}
        >
          <span className="title">Rating</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "rating" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-rating" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),      
      accessor: (dog) => <StarRating rating={dog.rating ?? 0} onChange={async (newRating) => {
        try {
          await updateDog({
            id: dog.id,
            rating: newRating,
          });
          showToast("Rating update", "success");
        } catch {
          showToast("Failed to update rating", "error")
        }
      }}  />,
    },
    {
      id: "note",
      header: "Note",
      accessor: "note",
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-center",
      accessor: (dog) => (
        <div className="d-flex justify-content-center gap-4">
        <button
          className="border-0 bg-transparent text-danger fw-semibold"
          onClick={(e) => {
            e.stopPropagation();
            setDogToDelete(dog);
          }}
        >
          Remove
        </button>
          <button 
          type="button" 
          className="border-0 bg-transparent text-primary fw-semibold"
          onClick={(e) => {
            e.stopPropagation();
            setDogEdit(dog);
          }}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

return (
  <div className="container py-4">
    <h2 className="mb-4">Dog Finder</h2>
    <div className="dogs-controls">
      <div className="dogs-search">
        <SearchBar
          placeholder="Search by name, breed, city, country, shelter..."
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      <button
        type="button"
        className={`btn btn-danger dogs-bulk-delete ${
          selectedIds.length === 0 ? "invisible" : ""
        }`}
        onClick={() => setConfirmBulk(true)}
      >
        Remove selected ({selectedIds.length})
      </button>

    </div>

  <DataTable data={dogs} columns={columns}
    footer={  
    <div className="mt-4">
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
    }
  />

    <SideBar
      open={!!dogEdit}
      dog={dogEdit}
      onClose={() => setDogEdit(null)}
      onSave={async (updated) => {
      if (!dogEdit) return; 
      await updateDog({ id: dogEdit.id, ...updated });
        showToast("Dog updated", "success");
        setDogEdit(null);
      }}
    />

    <ConfirmDialog
      open={!!dogToDelete}
      title="You are about to remove this dog."
      description="Once removed, this action is irreversible. Do you want to continue?"
      onCancel={() => setDogToDelete(null)}
      onConfirm={handleSingleDelete}
      loading={deleting}
    />
    <ConfirmDialog
      open={confirmBulk}
      title="You are about to remove selected dogs."
      description="Once removed, this action is irreversible. Do you want to continue?"
      onCancel={() => setConfirmBulk(false)}
      onConfirm={async () => {
        try {
          setDeleting(true);
          await bulkDeleteDogs(selectedIds);
          showToast("Selected dogs removed", "success");
          setSelectedIds([]);
          setConfirmBulk(false);
        } catch {
          showToast("Failed to remove dogs", "error");
        } finally {
          setDeleting(false);
        }
      }}
      loading={deleting}
    />
  </div>
);
}

export default DogsPage;
