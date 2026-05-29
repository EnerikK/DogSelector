import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import type {Dog, PaginatedResponse} from "../types/dogs"

export function useDogs(page: number, pageSize: number, search: string, ordering: string) {
    const [dogs,setDogs] = useState<Dog[]>([]);
    const [total,setTotal] = useState(0);
    const [loading,setIsLoading] = useState(true);

  const fetchDogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Dog>>("/dogs/", {
        params: { page, page_size: pageSize, search, ordering },
      });

      setDogs(res.data.results);
      setTotal(res.data.count);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, ordering]);

  const deleteDog = async (id: number) => {
    await api.delete(`/dogs/${id}/`);
    await fetchDogs();
  };

  const bulkDeleteDogs = async (ids: number[]) => {
    await api.post("/dogs/bulk-delete/", { ids });
    await fetchDogs();
  };

  const updateDog = async (updatedDog: Partial<Dog> & Pick<Dog, "id">) => {
    const res = await api.patch<Dog>(`/dogs/${updatedDog.id}/`, updatedDog);

    setDogs(prev =>
      prev.map(d =>
        d.id === updatedDog.id
          ? res.data
          : d
      )
    );
  };

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return {
    dogs,
    total,
    loading,
    refetch: fetchDogs,
    deleteDog,
    bulkDeleteDogs,
    updateDog
  };
}