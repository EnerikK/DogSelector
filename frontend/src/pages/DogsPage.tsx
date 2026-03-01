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

function DogsPage() {
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const { dogs, total , loading , deleteDog, bulkDeleteDogs } = useDogs(page,pageSize,search);

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
      header: "Status",
      accessor: (dog) => <StatusBadge status={dog.status} />,
    },
    {
      id: "breed",
      header: "Breed",
      accessor: "breed_name",
    },
    {
      id: "description",
      header: "Description",
      accessor: "description_text",
    },
    {
      id: "rating",
      header: "Rating",
      accessor: (dog) => <StarRating rating={dog.rating} />,
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
          <button className="border-0 bg-transparent text-primary fw-semibold">
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

    <DataTable data={dogs} columns={columns} />

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