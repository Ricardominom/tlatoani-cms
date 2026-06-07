import { z } from 'zod';
import { isAxiosError } from "axios";
import {
    familyMembersResponseSchema,
    familyMemberResponseSchema,
    alumnoSchema,
    type FamilyMember,
    type FamilyMemberAttachFormData,
    type FamilyMemberUpdateFormData,
    type Alumno,
} from "../types";
import api from "./api";

function handleServiceError(error: unknown): never {
    if (isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message ?? error.message;
        throw new Error(message, { cause: error });
    }
    throw error;
}

export async function getFamilyMembers(studentUuid: string): Promise<FamilyMember[]> {
    try {
        const res = await api.get<unknown>(`/v1/students/${studentUuid}/family-members`);
        return familyMembersResponseSchema.parse(res.data).data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function vincularFamilyMember(
    studentUuid: string,
    data: FamilyMemberAttachFormData
): Promise<FamilyMember> {
    try {
        const res = await api.post<unknown>(
            `/v1/students/${studentUuid}/family-members`,
            {
                user_uuid: data.user_uuid,
                relationship: data.relationship,
                primary_contact: data.primary_contact,
            }
        );
        return familyMemberResponseSchema.parse(res.data).data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function actualizarFamilyMember(
    studentUuid: string,
    userUuid: string,
    data: FamilyMemberUpdateFormData
): Promise<FamilyMember> {
    try {
        const res = await api.put<unknown>(
            `/v1/students/${studentUuid}/family-members/${userUuid}`,
            {
                relationship: data.relationship,
                primary_contact: data.primary_contact,
            }
        );
        return familyMemberResponseSchema.parse(res.data).data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function desvincularFamilyMember(
    studentUuid: string,
    userUuid: string
): Promise<void> {
    try {
        await api.delete(`/v1/students/${studentUuid}/family-members/${userUuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function getStudentsByUser(userUuid: string): Promise<Alumno[]> {
    try {
        const res = await api.get<unknown>(`/v1/users/${userUuid}/students`);
        return z.object({ data: z.array(alumnoSchema) }).parse(res.data).data;
    } catch (error) {
        handleServiceError(error);
    }
}