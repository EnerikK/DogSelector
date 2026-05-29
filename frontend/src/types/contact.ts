export type PreferredContactMethod = "email" | "phone" | "whatsapp";

export interface ContactSubmission {
    dog?: number | null;
    email: string;
    name: string;
    phone?: string;
    country?: string;
    city?: string;
    message: string;
    household?: string;
    dog_experience?: string;
    preferred_contact_method?: PreferredContactMethod;
}