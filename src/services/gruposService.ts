import { grupoSchema, nivelSchema, paginatedResponseSchema, type GrupoFormData, type NivelFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";

type FiltrosNivel = {
    search?: string;
    order_by?: string;
    order_direction?: "asc" | "desc";
    per_page?: number;
}

type FiltrosGrupos = {
    search?: string;
    active?: boolean;
    per_page?: number;
}

function toTimeApi(t: string): string {
    return t.length === 5 ? `${t}:00` : t;
}

function handleServiceError(error: unknown): never {
    if(isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

// NIVELES
export async function getNiveles(params? : FiltrosNivel) {
    try {
        const res = await api.get<unknown>("/v1/levels", { params });
        const parsed = paginatedResponseSchema(nivelSchema).parse(res.data);
        return parsed;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearNivel(data: NivelFormData) {
    try {
        const res = await api.post<unknown>("/v1/levels", data);
        const body = res.data as { data: unknown };
        return nivelSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarNivel(uuid: string, data: Partial<NivelFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/levels/${uuid}`, data);
        const body = res.data as { data: unknown}
        return nivelSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarNivel(uuid: string) {
    try {
        await api.delete(`/v1/levels/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}

// GRUPOS

export async function getGrupos(params? : FiltrosGrupos) {
    try {
        const res = await api.get<unknown>("/v1/groups", { params });
        const parsed = paginatedResponseSchema(grupoSchema).parse(res.data);
        return parsed;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearGrupo(data: GrupoFormData) {
    try {
        const payload = { ...data };
        if (payload.entry_time) payload.entry_time = toTimeApi(payload.entry_time);
        if (payload.dismissal_time) payload.dismissal_time = toTimeApi(payload.dismissal_time);
        const res = await api.post<unknown>("/v1/groups", payload);
        const body = res.data as { data: unknown }
        return grupoSchema.parse(body.data);
        
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarGrupo(uuid: string, data: Partial<GrupoFormData>) {
    try {
        const payload = { ...data };
        if (payload.entry_time) payload.entry_time = toTimeApi(payload.entry_time);
        if (payload.dismissal_time) payload.dismissal_time = toTimeApi(payload.dismissal_time);
        const res = await api.put<unknown>(`/v1/groups/${uuid}`, payload);
        const body = res.data as { data: unknown };
        return grupoSchema.parse(body.data);
        
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarGrupo(uuid: string) {
    try {
        await api.delete(`/v1/groups/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}