import { useDogs } from "../hooks/useDogs";
import { DataTable } from "../components/common/DataTable";
import type { Column } from "../components/common/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { StarRating } from "../components/StarRating";
import type { Dog } from "../types/dogs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { useToast } from "../components/toast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import "./DogsPage.css"
import { SideBar } from "../components/SideBar";

const formatChoice = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getDogImage = (dog: Dog) =>
  dog.photo_url || dog.photos[0]?.image_url || "/dogImage.jpg";

const getDogTraits = (dog: Dog) => {
  const traits = [
    dog.vaccinated === true ? "Vaccinated" : null,
    dog.neutered === true ? "Neutered" : null,
    dog.good_with_children === true ? "Children" : null,
    dog.good_with_dogs === true ? "Dogs" : null,
    dog.good_with_cats === true ? "Cats" : null,
  ].filter((trait): trait is string => Boolean(trait));

  return traits.length > 0 ? traits : ["No traits set"];
};

const canApplyForDog = (dog: Dog) => dog.adoption_status === "AVAILABLE";

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
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
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

  const handleRatingChange = async (dog: Dog, rating: number) => {
    try {
      await updateDog({
        id: dog.id,
        rating,
      });
      showToast("Rating updated", "success");
    } catch {
      showToast("Failed to update rating", "error");
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
          <div className="text-muted small">
            {[dog.sex, dog.age_group, dog.size].map(formatChoice).join(" / ")}
          </div>
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
          {getDogTraits(dog).map((trait) => (
            <span key={trait} className={trait === "No traits set" ? "text-muted" : ""}>
              {trait}
            </span>
          ))}
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
      accessor: (dog) => (
        <StarRating
          rating={dog.rating ?? 0}
          onChange={(newRating) => handleRatingChange(dog, newRating)}
        />
      ),
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
        <div className="dog-actions">
        <button
          className="dog-action dog-action-danger"
          onClick={(e) => {
            e.stopPropagation();
            setDogToDelete(dog);
          }}
        >
          Remove
        </button>
          <button 
          type="button" 
          className="dog-action"
          onClick={(e) => {
            e.stopPropagation();
            setDogEdit(dog);
          }}
          >
            Edit
          </button>
          {canApplyForDog(dog) ? (
            <Link
              className="dog-action dog-action-primary"
              to={`/contact?dog=${dog.id}&name=${encodeURIComponent(dog.name || dog.breed_name)}`}
            >
              Apply
            </Link>
          ) : (
            <span className="dog-action dog-action-disabled" aria-disabled="true">
              Apply
            </span>
          )}
        </div>
      ),
    },
  ];

return (
  <div className="container py-4">
    <div className="dogs-page-header">
      <div>
        <h2 className="mb-1">Dog Finder</h2>
        <p className="text-muted mb-0">
          Browse available dogs and start an adoption application.
        </p>
      </div>

      <div className="dogs-view-toggle" aria-label="Choose dog finder view">
        <button
          type="button"
          className={viewMode === "cards" ? "active" : ""}
          onClick={() => setViewMode("cards")}
        >
          Cards
        </button>
        <button
          type="button"
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
      </div>
    </div>
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
          selectedIds.length === 0 || viewMode !== "table" ? "invisible" : ""
        }`}
        onClick={() => setConfirmBulk(true)}
      >
        Remove selected ({selectedIds.length})
      </button>

    </div>

    {viewMode === "cards" ? (
      <div className="dog-card-grid">
        {dogs.map((dog) => (
          <article className="dog-profile-card" key={dog.id}>
            <div className="dog-card-media">
              <img src={getDogImage(dog)} alt={dog.name || dog.breed_name} />
              <div className="dog-card-status">
                <StatusBadge status={dog.adoption_status} />
              </div>
            </div>

            <div className="dog-card-body">
              <div className="dog-card-heading">
                <div>
                  <h3>{dog.name || "Unnamed dog"}</h3>
                  <p>{dog.breed_name}</p>
                </div>
                <StarRating
                  rating={dog.rating ?? 0}
                  onChange={(newRating) => handleRatingChange(dog, newRating)}
                />
              </div>

              <div className="dog-card-meta">
                <span>{formatChoice(dog.sex)}</span>
                <span>{formatChoice(dog.age_group)}</span>
                <span>{formatChoice(dog.size)}</span>
              </div>

              <div className="dog-card-location">
                <i className="bi bi-geo-alt" />
                <div>
                  <strong>{[dog.city, dog.country].filter(Boolean).join(", ") || "Unknown location"}</strong>
                  <span>{dog.shelter_name || "No shelter linked"}</span>
                </div>
              </div>

              <div className="dog-traits">
                {getDogTraits(dog).map((trait) => (
                  <span key={trait} className={trait === "No traits set" ? "text-muted" : ""}>
                    {trait}
                  </span>
                ))}
              </div>

              {dog.note && <p className="dog-card-note">{dog.note}</p>}
            </div>

            <div className="dog-card-actions">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setDogEdit(dog)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => setDogToDelete(dog)}
              >
                Remove
              </button>
              {canApplyForDog(dog) ? (
                <Link
                  className="btn btn-success btn-sm"
                  to={`/contact?dog=${dog.id}&name=${encodeURIComponent(dog.name || dog.breed_name)}`}
                >
                  Apply
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled
                >
                  {formatChoice(dog.adoption_status)}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : (
      <DataTable data={dogs} columns={columns} />
    )}

    <div className="dogs-pagination">
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
