export interface ShelterSummary {
  id: number;
  name: string;
  country: string;
  city: string;
  postcode: string;
  website: string;
  email: string;
  phone: string;
  is_verified: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  shelter: ShelterSummary | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface ShelterRegisterPayload {
  username: string;
  password: string;
  email: string;
  shelter_name: string;
  country: string;
  city: string;
  postcode?: string;
  website?: string;
  phone?: string;
}
