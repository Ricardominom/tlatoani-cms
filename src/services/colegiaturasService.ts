import { colegiaturasSchema, type ColegiaturasFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";
import { z } from "zod";

type FiltrosColegiaturas = {
    student_uuid?: string;
    status?: 'paid' | 'pending' | 'overdue';
    period?: string;
    per_page?: number;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

const colegiaturasResponseSchema = z.object({
    data: z.array(colegiaturasSchema),
})

export async function getColegiaturas(params?: FiltrosColegiaturas) {
    try {
        const res = await api.get<unknown>('/v1/tuition-records', { params });
        return colegiaturasResponseSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearColegiatura(data: ColegiaturasFormData) {
    try {
        const res = await api.post<unknown>('/v1/tuition-records', data);
        const body = res.data as { data: unknown };
        return colegiaturasSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarColegiatura(uuid: string, data: Partial<ColegiaturasFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/tuition-records/${uuid}`, data);
        const body = res.data as { data: unknown };
        return colegiaturasSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}