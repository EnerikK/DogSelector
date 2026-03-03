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
      id: "status",
       header: (
        <div
          className="table-sort-header"
          onClick={() => handleSort("status")}
        >
          <span className="title">Status</span>

          <span className="sort-icons">
            <i
              className={`bi bi-caret-up-fill ${
                ordering === "status" ? "active" : ""
              }`}
            />
            <i
              className={`bi bi-caret-down-fill ${
                ordering === "-status" ? "active" : ""
              }`}
            />
          </span>
        </div>
      ),      
      accessor: (dog) => <StatusBadge status={dog.status} />,
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
      id: "description",
      header: "Description",
      accessor: "description_text",
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
    <h2 className="mb-4">Dogs</h2>
    <div className="dogs-controls">
      <div className="dogs-search">
        <SearchBar
          placeholder="Search..."
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