import { isAxiosError } from "axios";
import {
    emergencyContactSchema,
    emergencyContactsResponseSchema,
    type EmergencyContact,
    type EmergencyContactFormData,
} from "../types";
import api from "./api";

function toPayload(form: EmergencyContactFormData): Record<string, unknown> {
    return {
        name: form.name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        relationship: form.relationship,
    };
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getEmergencyContacts(studentUuid: string): Promise<EmergencyContact[]> {
    try {
        const res = await api.get<unknown>(`/v1/students/${studentUuid}/emergency-contacts`);
        const parse = emergencyContactsResponseSchema.parse(res.data);
        return parse.data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearEmergencyContact(
    studentUuid: string,
    data: EmergencyContactFormData
): Promise<EmergencyContact> {
    try {
        const res = await api.post<{ data: unknown }>(
            `/v1/students/${studentUuid}/emergency-contacts`,
            toPayload(data)
        );
        return emergencyContactSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarEmergencyContact(
    studentUuid: string,
    contactUuid: string,
    data: EmergencyContactFormData
): Promise<EmergencyContact> {
    try {
        const res = await api.put<{ data: unknown }>(
            `/v1/students/${studentUuid}/emergency-contacts/${contactUuid}`,
            toPayload(data)
        );
        return emergencyContactSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarEmergencyContact(
    studentUuid: string,
    contactUuid: string
): Promise<void> {
    try {
        await api.delete(`/v1/students/${studentUuid}/emergency-contacts/${contactUuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}