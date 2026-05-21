import { isAxiosError } from "axios";
import {
    familyMemberSchema,
    familyMembersResponseSchema,
    type FamilyMember,
    type FamilyMemberAttachFormData,
    type FamilyMemberUpdateFormData,
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
        const parse = familyMembersResponseSchema.parse(res.data);
        return parse.data;
    } catch (error) {
        handleServiceError(error);
    }
}

export async function attachFamilyMember(
    studentUuid: string,
    data: FamilyMemberAttachFormData
): Promise<FamilyMember> {
    try {
        const res = await api.post<{ data: unknown }>(
            `/v1/students/${studentUuid}/family-members`,
            { user_uuid: data.user_uuid, relationship: data.relationship, primary_contact: data.primary_contact }
        );
        return familyMemberSchema.parse(res.data.data);
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
        const res = await api.put<{ data: unknown }>(
            `/v1/students/${studentUuid}/family-members/${userUuid}`,
            { relationship: data.relationship, primary_contact: data.primary_contact }
        );
        return familyMemberSchema.parse(res.data.data);
    } catch (error) {
        handleServiceError(error);
    }
}

export async function detachFamilyMember(
    studentUuid: string,
    userUuid: string
): Promise<void> {
    try {
        await api.delete(`/v1/students/${studentUuid}/family-members/${userUuid}`);
    } catch (error) {
        handleServiceError(error);
    }
}