export interface Dog {
    id: number;
    name: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED"
    breed: number;
    breed_name: string;
    description: number;
    description_text: string;
    rating: number;
    note: string;
    shelter: number | null;
    shelter_name: string | null;
    adoption_status: "AVAILABLE" | "RESERVED" | "ADOPTED" | "UNAVAILABLE";
    sex: "UNKNOWN" | "FEMALE" | "MALE";
    age_group: "UNKNOWN" | "PUPPY" | "YOUNG" | "ADULT" | "SENIOR";
    size: "UNKNOWN" | "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
    country: string;
    city: string;
    postcode: string;
    photo_url: string;
    profile_url: string;
    source_platform: "MANUAL" | "RESCUE_GROUPS" | "ANIMAL_SHELTER_MANAGER" | "PARTNER_IMPORT";
    source_external_id: string;
    last_synced_at: string | null;
    vaccinated: boolean | null;
    neutered: boolean | null;
    good_with_children: boolean | null;
    good_with_dogs: boolean | null;
    good_with_cats: boolean | null;
    photos: DogPhoto[];
    created_at: string;
    updated_at: string;
}

export interface DogPhoto {
    id: number;
    image_url: string;
    caption: string;
    sort_order: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
