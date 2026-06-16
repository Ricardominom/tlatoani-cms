import { studentLogSchema, type StudentLogFormData } from "../types";
import api from "./api";
import { isAxiosError } from "axios";
import { z } from "zod";

type FiltrosBitacora = {
    student_uuid?: string;
    achievement_level?: 'started' | 'progressing' | 'advanced' | 'achieved';
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

const bitacoraResponseSchema = z.object({ data: z.array(studentLogSchema) });

export async function getStudentLogs(studentUuid: string, params?: FiltrosBitacora) {
    try {
        const res = await api.get<unknown>(`/v1/students/${studentUuid}/logs`, { params });
        return bitacoraResponseSchema.parse(res.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function crearStudentLog(studentUuid: string, data: StudentLogFormData) {
    try {
        const res = await api.post<unknown>(`/v1/students/${studentUuid}/logs`, data);
        const body = res.data as { data: unknown };
        return studentLogSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarStudentLog(studentUuid: string, uuid: string, data: Partial<StudentLogFormData>) {
    try {
        const res = await api.put<unknown>(`/v1/students/${studentUuid}/logs/${uuid}`, data);
        const body = res.data as { data: unknown };
        return studentLogSchema.parse(body.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function eliminarStudentLog(studentUuid: string, uuid: string) {
    try {
        await api.delete(`/v1/students/${studentUuid}/logs/${uuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}