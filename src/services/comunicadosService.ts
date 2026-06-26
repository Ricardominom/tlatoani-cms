import {
    comunicadoSchema,
    comunicadosPaginadosSchema,
    type ComunicadoFormData,
    type TIPOS_COMUNICADO,
    type ESTADOS_COMUNICADO,
} from "../types";
import api from "./api";
import { isAxiosError } from "axios";

type TipoComunicado = typeof TIPOS_COMUNICADO[number];
type EstadoComunicado = typeof ESTADOS_COMUNICADO[number];

type FiltrosComunicados = {
    search?: string;
    status?: EstadoComunicado;
    type?: TipoComunicado;
    is_global?: boolean;
    per_page?: number;
    page?: number;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
    include?: string;
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

function buildPayload(data: Partial<ComunicadoFormData>): FormData | Record<string, unknown> {
    if (!data.attachment) {
        const { attachment: _att, ...rest } = data;
        return rest as Record<string, unknown>;
    }
    const fd = new FormData();
    (Object.entries(data) as [string, unknown][]).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (key === 'group_uuids' || key === 'student_uuids') {
            (value as string[]).forEach((id) => fd.append(`${key}[]`, id));
        } else if (value instanceof File) {
            fd.append(key, value);
        } else if (typeof value === 'boolean') {
            fd.append(key, value ? '1' : '0');
        } else {
            fd.append(key, String(value));
        }
    });
    return fd;
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
        const res = await api.get<unknown>(`/v1/notices/${uuid}`, {
            params: { include: 'author,groups,students' },
        });
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearComunicado(data: ComunicadoFormData) {
    try {
        const payload = buildPayload(data);
        const res = await api.post<unknown>('/v1/notices', payload);
        const body = res.data as { data: unknown };
        return comunicadoSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarComunicado(uuid: string, data: Partial<ComunicadoFormData>) {
    try {
        const payload = buildPayload(data);
        let resData: unknown;
        if (payload instanceof FormData) {
            payload.append('_method', 'PUT');
            resData = (await api.post<unknown>(`/v1/notices/${uuid}`, payload)).data;
        } else {
            resData = (await api.put<unknown>(`/v1/notices/${uuid}`, payload)).data;
        }
        return comunicadoSchema.parse((resData as { data: unknown }).data);
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

export async function marcarComunicadoLeido(uuid: string) {
    try {
        await api.post(`/v1/notices/${uuid}/mark-as-read`);
    } catch (error) {
        handleServiceError(error);
    }
}