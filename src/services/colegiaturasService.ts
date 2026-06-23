import { colegiaturasSchema, colegiaturasPaginadasSchema, type ColegiaturasFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";

type FiltrosColegiaturas = {
    search?: string;
    status?: 'paid' | 'pending' | 'overdue';
    period?: string; // "YYYY-MM"
    payment_method?: string;
    per_page?: number;
    order_by?: 'period' | 'amount' | 'status' | 'payment_date' | 'payment_method' | 'created_at' | 'updated_at';
    order_direction?: 'asc' | 'desc';
    include?: string; // "student,paidBy"
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getColegiaturas(params?: FiltrosColegiaturas) {
    try {
        const res = await api.get<unknown>('/v1/tuition-records', { params });
        return colegiaturasPaginadasSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function getColegiaturasPorAlumno(studentUuid: string, params?: FiltrosColegiaturas) {
    try {
        const res = await api.get<unknown>(`/v1/students/${studentUuid}/tuition-records`, { params });
        return colegiaturasPaginadasSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearColegiatura(studentUuid: string, data: ColegiaturasFormData) {
    try {
        const res = await api.post<unknown>(`/v1/students/${studentUuid}/tuition-records`, data);
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

export async function eliminarColegiatura(uuid: string) {
    try {
        await api.delete(`/v1/tuition-records/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function generarColegiaturasDelMes(period?: string) {
    try {
        const res = await api.post<unknown>('/v1/tuition-records/generate', period ? { period } : {});
        return res.data;
    } catch (error) {
        handleServiceError(error);
    }
}