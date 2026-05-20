import { isAxiosError } from "axios";
import {
    usuarioSchema,
    paginatedResponseSchema,
    type Usuario,
    type UsuarioFormData,
    type UsuariosPaginados,
    type RolUsuario,
} from "../types";
import api from "./api";

type FiltrosUsuario = {
    search?: string;
    role?: RolUsuario;
    active?: boolean;
    order_by?: "name" | "last_name" | "email" | "role" | "last_access";
    order_direction?: "asc" | "desc";
    per_page?: number;
}

const usuariosPaginadosSchema = paginatedResponseSchema(usuarioSchema);

function toPayload(form: UsuarioFormData): Record<string, unknown> {
    return {
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        password: form.password || undefined,
        password_confirmation: form.password ? form.password_confirmation : undefined,
        phone_number: form.phone_number || null,
        role: form.role,
        active: form.active,
    };
}

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getUsuarios(params?: FiltrosUsuario): Promise<UsuariosPaginados> {
    try {
        const res = await api.get("/v1/users", { params });
        return usuariosPaginadosSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearUsuario(data: UsuarioFormData): Promise<Usuario> {
    try {
        const res = await api.post<{ data: unknown }>("/v1/users", toPayload(data));
        return usuarioSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarUsuario(uuid: string, data: UsuarioFormData): Promise<Usuario> {
    try {
        const res = await api.put<{ data: unknown }>(`/v1/users/${uuid}`, toPayload(data));
        return usuarioSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarUsuario(uuid: string): Promise<void> {
    try {
        await api.delete(`/v1/users/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}