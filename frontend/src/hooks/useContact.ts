import api from "../api/axios"
import type { ContactSubmission } from "../types/contact";

export function useContact() {
    const sendContact = async (data: ContactSubmission) => {
        await api.post("/contact-submission/",data);
    }

    return {sendContact};
}