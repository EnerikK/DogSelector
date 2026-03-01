import { useEffect, useState } from "react";
import api from "../api/axios";
import type {Dog} from "../types/dogs"

export function useDogs(page:number,pageSize:number,search:string) {
    const [dogs,setDogs] = useState<Dog[]>([]);
    const [total,setTotal] = useState(0);
    const [loading,setIsLoading] = useState(true);

  const fetchDogs = async () => {
    setIsLoading(true);

    const res = await api.get("/dogs/", {
      params: { page, page_size: pageSize, search },
    });

    setDogs(res.data.results);
    setTotal(res.data.count);
    setIsLoading(false);
  };

  const deleteDog = async (id: number) => {
    await api.delete(`/dogs/${id}/`);
    await fetchDogs();
  };

  const bulkDeleteDogs = async (ids: number[]) => {
    await api.post("/dogs/bulk-delete/", { ids });
    await fetchDogs();
  };

  const updateDog = async (updatedDog: Partial<Dog>) => {
    await api.patch(`/dogs/${updatedDog.id}/`, updatedDog);
    await fetchDogs();
};

  useEffect(() => {
    fetchDogs();
  }, [page, pageSize, search]);

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