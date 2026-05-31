import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../components/auth";
import { DogFormPanel, type DogFormValues } from "../components/DogFormPanel";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { StatusBadge } from "../components/StatusBadge";
import { useToast } from "../components/toast";
import type { Dog, PaginatedResponse } from "../types/dogs";
import "./DogsPage.css";

interface BreedOption {
  id: number;
  name: string;
}

interface DescriptionOption {
  id: number;
  text: string;
}

const getResults = <T,>(payload: T[] | PaginatedResponse<T>) =>
  Array.isArray(payload) ? payload : payload.results;

function ShelterDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<BreedOption[]>([]);
  const [descriptions, setDescriptions] = useState<DescriptionOption[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [creating, setCreating] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<Dog | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<BreedOption> | BreedOption[]>("/breeds/").then((response) => {
      setBreeds(getResults(response.data));
    });
    api.get<PaginatedResponse<DescriptionOption> | DescriptionOption[]>("/description/").then((response) => {
      setDescriptions(getResults(response.data));
    });
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = await api.get<PaginatedResponse<Dog>>("/dashboard/dogs/", {
          params: { page, page_size: pageSize, search },
        });
        setDogs(response.data.results);
        setTotal(response.data.count);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [page, pageSize, search]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Dog>>("/dashboard/dogs/", {
        params: { page, page_size: pageSize, search },
      });
      setDogs(response.data.results);
      setTotal(response.data.count);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: DogFormValues) => {
    if (editingDog) {
      await api.patch(`/dashboard/dogs/${editingDog.id}/`, values);
      showToast("Dog updated", "success");
    } else {
      await api.post("/dashboard/dogs/", values);
      showToast("Dog created", "success");
    }
    setEditingDog(null);
    setCreating(false);
    await refetch();
  };

  const handleDelete = async () => {
    if (!dogToDelete) return;
    await api.delete(`/dashboard/dogs/${dogToDelete.id}/`);
    showToast("Dog removed", "success");
    setDogToDelete(null);
    await refetch();
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Shelter Dashboard</h1>
          <p className="text-muted mb-0">
            {user?.shelter?.name} manages the dogs shown in the public catalog.
          </p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setCreating(true)}>
          Add dog
        </button>
      </div>

      <div className="mb-3">
        <SearchBar placeholder="Search your dogs..." onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dog-card-grid">
            {dogs.map((dog) => (
              <article className="dog-profile-card" key={dog.id}>
                <div className="dog-card-media">
                  <img src={dog.photo_url || dog.photos[0]?.image_url || "/dogImage.jpg"} alt={dog.name || dog.breed_name} />
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
                  </div>

                  <div className="dog-card-location">
                    <i className="bi bi-geo-alt" />
                    <div>
                      <strong>{[dog.city, dog.country].filter(Boolean).join(", ") || "Unknown location"}</strong>
                      <span>{dog.note || "No internal notes yet."}</span>
                    </div>
                  </div>
                </div>

                <div className="dog-card-actions">
                  <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setEditingDog(dog)}>
                    Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => setDogToDelete(dog)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

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
        </>
      )}

      <DogFormPanel
        open={creating || !!editingDog}
        dog={editingDog}
        breeds={breeds}
        descriptions={descriptions}
        onClose={() => {
          setCreating(false);
          setEditingDog(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!dogToDelete}
        title="Delete dog listing"
        description="This removes the dog from your shelter dashboard."
        onCancel={() => setDogToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default ShelterDashboardPage;
