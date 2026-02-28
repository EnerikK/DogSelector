import { useEffect, useState } from "react";
import api from "../api/axios";
import type {Dog,PaginatedResponse} from "../types/dogs"

export function useDogs(page:number,pageSize:number,search:string) {
    const [dogs,setDogs] = useState<Dog[]>([]);
    const [total,setTotal] = useState(0);
    const [loading,setIsLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const res = await api.get<PaginatedResponse<Dog>>(`/dogs/?page=${page}&page_size=${pageSize}&search=${search}`)
                setDogs(res.data.results);
                setTotal(res.data.count);
            } catch (err) {
                setError("Failed to fetch dogs");
            } finally {
                setIsLoading(false);
            }
        }
        fetchDogs();
    },[page,pageSize,search]);

    return {dogs,total,loading,error};
}