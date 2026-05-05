import api from "./api";                                                                                                                    
  import type {                                                                                                                               
      ApiGroup,                                                                                                                               
      ApiLevel,
      GrupoForm,                                                                                                                              
      NivelForm,  
      PaginatedResponse,
  } from "../pages/Grupos/types";

  function toTimeApi(t: string): string {
      return t.length === 5 ? `${t}:00` : t;
  }

  // NIVELES

  export async function getNiveles(params?: {
      search?: string;
      order_by?: string;
      order_direction?: "asc" | "desc";
      per_page?: number;
  }) {
      const res = await api.get<PaginatedResponse<ApiLevel>>("/v1/levels", { params });
      return res.data;
  }

  export async function crearNivel(data: NivelForm) {
      const res = await api.post<{ data: ApiLevel }>("/v1/levels", data);
      return res.data.data;
  }

  export async function actualizarNivel(uuid: string, data: Partial<NivelForm>) {
      const res = await api.put<{ data: ApiLevel }>(`/v1/levels/${uuid}`, data);
      return res.data.data;
  }

  export async function eliminarNivel(uuid: string) {
      await api.delete(`/v1/levels/${uuid}`);
  }

  // GRUPOS

  export async function getGrupos(params?: {
      search?: string;
      active?: boolean;
      per_page?: number;
  }) {
      const res = await api.get<PaginatedResponse<ApiGroup>>("/v1/groups", { params });
      return res.data;
  }

  export async function crearGrupo(data: GrupoForm) {
      const payload = {
          ...data,
          entry_time: toTimeApi(data.entry_time),
          dismissal_time: toTimeApi(data.dismissal_time),
      };
      const res = await api.post<{ data: ApiGroup }>("/v1/groups", payload);
      return res.data.data;
  }

  export async function actualizarGrupo(uuid: string, data: Partial<GrupoForm>) {
      const payload = { ...data };
      if (payload.entry_time) payload.entry_time = toTimeApi(payload.entry_time);
      if (payload.dismissal_time) payload.dismissal_time = toTimeApi(payload.dismissal_time);
      const res = await api.put<{ data: ApiGroup }>(`/v1/groups/${uuid}`, payload);
      return res.data.data;
  }

  export async function eliminarGrupo(uuid: string) {
      await api.delete(`/v1/groups/${uuid}`);
  }