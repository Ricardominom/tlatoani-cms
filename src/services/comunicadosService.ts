import { comunicadoSchema, comunicadosPaginadosSchema, type ComunicadoFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";

type FiltrosComunicados = {
    search?: string;
    status?: 'draft' | 'published';
    type?: string;
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

export async function getComunicados(params?: FiltrosComunicados) {
    try {
        const res = await api.get<unknown>('/v1/notices', { params });
        return comunicadosPaginadosSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function getComunicado(uuid: string) {
    try {
        const res = await api.get<unknown>(`/v1/notices/${uuid}`);
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearComunicado(data: ComunicadoFormData) {
    try {
        const res = await api.post<unknown>('/v1/notices', data);
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarComunicado(uuid: string, data: Partial<ComunicadoFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/notices/${uuid}`, data);
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarComunicado(uuid: string) {
    try {
        await api.delete(`/v1/notices/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function publicarComunicado(uuid: string) {
    try {
        const res = await api.put<unknown>(`/v1/notices/${uuid}`, { status: 'published' });
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}