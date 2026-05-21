import { isAxiosError } from "axios";
import {
    doctorInformationSchema,
    doctorInformationResponseSchema,
    type DoctorInformation,
    type DoctorInformationFormData,
} from "../types";
import api from "./api";

function toPayload(form: DoctorInformationFormData): Record<string, unknown> {
    return {
        name: form.name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        clinic_name: form.clinic_name || null,
        clinic_address: form.clinic_address || null,
    };
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getDoctors(studentUuid: string): Promise<DoctorInformation[]> {
    try {
        const res = await api.get<unknown>(`/v1/students/${studentUuid}/doctor-informations`);
        const parse = doctorInformationResponseSchema.parse(res.data);
        return parse.data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearDoctor(
    studentUuid: string,
    data: DoctorInformationFormData
): Promise<DoctorInformation> {
    try {
        const res = await api.post<{ data: unknown }>(
            `/v1/students/${studentUuid}/doctor-informations`,
            toPayload(data)
        );
        return doctorInformationSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarDoctor(
    studentUuid: string,
    doctorUuid: string,
    data: DoctorInformationFormData
): Promise<DoctorInformation> {
    try {
        const res = await api.put<{ data: unknown }>(
            `/v1/students/${studentUuid}/doctor-informations/${doctorUuid}`,
            toPayload(data)
        );
        return doctorInformationSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarDoctor(
    studentUuid: string,
    doctorUuid: string
): Promise<void> {
    try {
        await api.delete(`/v1/students/${studentUuid}/doctor-informations/${doctorUuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}