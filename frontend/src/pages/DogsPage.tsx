import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../components/common/DataTable";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { StarRating } from "../components/StarRating";
import { StatusBadge } from "../components/StatusBadge";
import { useDogs } from "../hooks/useDogs";
import type { Dog } from "../types/dogs";
import "./DogsPage.css";

const formatChoice = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getDogImage = (dog: Dog) => dog.photo_url || dog.photos[0]?.image_url || "/dogImage.jpg";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const { dogs, total, loading } = useDogs(page, pageSize, search, "");

  const columns = [
    {
      id: "adoption",
      header: "Adoption",
      accessor: (dog: Dog) => <StatusBadge status={dog.adoption_status} />,
    },
    {
      id: "dog",
      header: "Dog",
      accessor: (dog: Dog) => (
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
      header: "Breed",
      accessor: "breed_name" as const,
    },
    {
      id: "location",
      header: "Location",
      accessor: (dog: Dog) => (
        <div>
          <div>{[dog.city, dog.country].filter(Boolean).join(", ") || "Unknown location"}</div>
          <div className="text-muted small">{dog.shelter_name || "No shelter linked"}</div>
        </div>
      ),
    },
    {
      id: "traits",
      header: "Traits",
      accessor: (dog: Dog) => (
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
      header: "Rating",
      accessor: (dog: Dog) => <StarRating rating={dog.rating ?? 0} />,
    },
    {
      id: "apply",
      header: "Apply",
      accessor: (dog: Dog) =>
        canApplyForDog(dog) ? (
          <Link
            className="btn btn-success btn-sm"
            to={`/contact?dog=${dog.id}&name=${encodeURIComponent(dog.name || dog.breed_name)}`}
          >
            Apply
          </Link>
        ) : (
          <button type="button" className="btn btn-secondary btn-sm" disabled>
            {formatChoice(dog.adoption_status)}
          </button>
        ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="dogs-page-header">
        <div>
          <h1 className="mb-1">Find a Dog</h1>
          <p className="text-muted mb-0">Public catalog for adopters. Shelter management lives in the shelter dashboard.</p>
        </div>

        <div className="dogs-view-toggle" aria-label="Choose dog finder view">
          <button type="button" className={viewMode === "cards" ? "active" : ""} onClick={() => setViewMode("cards")}>
            Cards
          </button>
          <button type="button" className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")}>
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
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : viewMode === "cards" ? (
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
                  <StarRating rating={dog.rating ?? 0} />
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
                {canApplyForDog(dog) ? (
                  <Link
                    className="btn btn-success btn-sm"
                    to={`/contact?dog=${dog.id}&name=${encodeURIComponent(dog.name || dog.breed_name)}`}
                  >
                    Apply now
                  </Link>
                ) : (
                  <button type="button" className="btn btn-secondary btn-sm" disabled>
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
    </div>
  );
}

export default DogsPage;
