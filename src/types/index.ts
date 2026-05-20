import { z } from 'zod';

// Nivel
export const nivelSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    order: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});
export const nivelFormSchema = z.object({
    name: z.string().min(1, 'El nombre del nivel es requerido'),
    description: z.string().nullable(),
    order: z.number().min(1, 'El orden debe ser mayor a 0')
});

// Grupos
export const grupoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    teacher_id: z.number().optional(),
    color: z.string(),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level: nivelSchema.optional(),
    created_at: z.string(),
    updated_at: z.string(),
})
export const grupoFormSchema = z.object({
    name: z.string().min(1, 'El nombre del grupo es requerido'),
    color: z.string().min(1, 'El color es requerido'),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level_uuid: z.string().min(1, 'El nivel es requerido'),
})

//Respues de pagina
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        links: z.object({
            first: z.string().nullable(),
            last: z.string().nullable(),
            prev: z.string().nullable(),
            next: z.string().nullable(),
        }),
        meta: z.object({
            current_page: z.number(),
            from: z.number(),
            last_page: z.number(),
            per_page: z.number(),
            to: z.number(),
            total: z.number(),
            path: z.string(),
            links: z.array(z.object({
                url: z.string().nullable(),
                label: z.string(),
                page: z.number().nullable(),
                active: z.boolean(),
            })),
        }),
    })

//Alumno
export const alumnoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    last_name: z.string(),
    birth_date: z.string(),
    curp: z.string(),
    photo_path: z.string().nullable(),
    blood_type: z.string().nullable(),
    allergies: z.string().nullable(),
    medicines: z.string().nullable(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    group: grupoSchema.optional().nullable(),
})

export const alumnoFormSchema = z.object({
    group_uuid: z.string(),
    name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'Los apellidos son requeridos'),
    birth_date: z.string().min(1, 'La fecha de nacimiento es requerida'),
    curp: z.string().length(18, 'El CURP debe tener 18 caracteres'),
    blood_type: z.string(),
    allergies: z.string(),
    medicines: z.string(),
    active: z.boolean(),
})

 // Usuario
  export const ROLES_USUARIO = ['superadmin', 'admin', 'teacher', 'family'] as const;
  export const rolUsuarioSchema = z.enum(ROLES_USUARIO);

  export const usuarioSchema = z.object({
      id: z.string().uuid(),
      name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
      phone_number: z.string().nullable(),
      role: rolUsuarioSchema,
      active: z.boolean(),
      last_access: z.string().nullable(),
      profile_picture_url: z.string().nullable(),
      created_at: z.string(),
      updated_at: z.string(),
  })

  const usuarioBaseFormSchema = z.object({
      name: z.string().min(1, 'El nombre es requerido'),
      last_name: z.string().min(1, 'Los apellidos son requeridos'),
      email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
      phone_number: z.string().max(13, 'Máximo 13 caracteres'),
      role: rolUsuarioSchema,
      active: z.boolean(),
      password: z.string(),
      password_confirmation: z.string(),
  })

  export const usuarioCreateFormSchema = usuarioBaseFormSchema
      .refine((d) => d.password.length >= 8, {
          message: 'Mínimo 8 caracteres',
          path: ['password'],
      })
      .refine((d) => d.password === d.password_confirmation, {
          message: 'Los passwords no coinciden',
          path: ['password_confirmation'],
      })

  export const usuarioUpdateFormSchema = usuarioBaseFormSchema
      .refine((d) => !d.password || d.password.length >= 8, {
          message: 'Mínimo 8 caracteres',
          path: ['password'],
      })
      .refine((d) => !d.password || d.password === d.password_confirmation, {
          message: 'Los passwords no coinciden',
          path: ['password_confirmation'],
      })


export type Nivel = z.infer<typeof nivelSchema>
export type Grupo = z.infer<typeof grupoSchema>
export type Alumno = z.infer<typeof alumnoSchema>
export type Usuario = z.infer<typeof usuarioSchema>
export type RolUsuario = z.infer<typeof rolUsuarioSchema>

export type PaginatedResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>

export type NivelFormData = z.infer<typeof nivelFormSchema>
export type GrupoFormData = z.infer<typeof grupoFormSchema>
export type AlumnoFormData = z.infer<typeof alumnoFormSchema>
export type UsuarioFormData = z.infer<typeof usuarioBaseFormSchema>

export type NivelesPaginados = PaginatedResponse<typeof nivelSchema>
export type GruposPaginados = PaginatedResponse<typeof grupoSchema>
export type AlumnosPaginados = PaginatedResponse<typeof alumnoSchema>
export type UsuariosPaginados = PaginatedResponse<typeof usuarioSchema>