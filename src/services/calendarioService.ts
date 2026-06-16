import { eventSchema, type EventFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";
import { paginatedResponseSchema } from "../types";

type FiltrosEventos = {
    search?: string;
    type?: string;
    published?: boolean;
    global?: boolean;
    include?: string;
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

export async function getEvents(params?: FiltrosEventos) {
    try {
        const normalized = params
            ? { ...params, ...(params.published !== undefined && { published: params.published ? 1 : 0 }) }
            : undefined;
        const res = await api.get<unknown>('/v1/events', { params: normalized });
        return paginatedResponseSchema(eventSchema).parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function getEvent(uuid: string) {
    try {
        const res = await api.get<unknown>(`/v1/events/${uuid}?include=attachments`);
        const body = res.data as { data: unknown };
        return eventSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearEvent(data: EventFormData) {
    try {
        const res = await api.post<unknown>('/v1/events', data);
        const body = res.data as { data: unknown };
        return eventSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarEvent(uuid: string, data: Partial<EventFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/events/${uuid}`, data);
        const body = res.data as { data: unknown };
        return eventSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarEvent(uuid: string) {
    try {
        await api.delete(`/v1/events/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}