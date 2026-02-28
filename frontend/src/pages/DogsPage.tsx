import { useDogs } from "../hooks/useDogs";
import { DataTable } from "../components/common/DataTable";
import type { Column } from "../components/common/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { StarRating } from "../components/StarRating";
import type { Dog } from "../types/dogs";
import { useState } from "react";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";

function DogsPage() {
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { dogs, total , loading, error } = useDogs(page,pageSize,search);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const columns: Column<Dog>[] = [
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
          <button className="border-0 bg-transparent text-danger fw-semibold">
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
    <>
      <h2 className="mb-4">Dogs</h2>
      <SearchBar placeholder="Search..."
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <DataTable data={dogs} columns={columns} />
      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);}}/>
    </>
  );
}

export default DogsPage;