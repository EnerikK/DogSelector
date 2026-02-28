export interface Dog {
    id: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED"
    breed: number;
    breed_name: string;
    description: number;
    description_text: string;
    rating: number;
    note: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}