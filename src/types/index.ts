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
});

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
            from: z.number().nullable(),
            last_page: z.number(),
            per_page: z.number(),
            to: z.number().nullable(),
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

// Emergency Contact
export const emergencyContactSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    relationship: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const emergencyContactFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'Los apellidos son requeridos'),
    phone_number: z.string().min(1, 'El teléfono es requerido').max(13, 'Máximo 13 caracteres'),
    relationship: z.string().min(1, 'La relación es requerida'),
})

export const emergencyContactsResponseSchema = z.object({
    data: z.array(emergencyContactSchema),
})

// Doctor Information
export const doctorInformationSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    clinic_name: z.string().nullable(),
    clinic_address: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const doctorInformationFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'Los apellidos son requeridos'),
    phone_number: z.string().min(1, 'El teléfono es requerido').max(13, 'Máximo 13 caracteres'),
    clinic_name: z.string(),
    clinic_address: z.string(),
})

export const doctorInformationResponseSchema = z.object({
    data: z.array(doctorInformationSchema),
})

// Family Member
export const familyMemberSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone_number: z.string().nullable(),
    relationship: z.string(),
    primary_contact: z.boolean(),
})

export const familyMemberAttachFormSchema = z.object({
    user_uuid: z.string().min(1, 'Selecciona un usuario'),
    relationship: z.string().min(1, 'La relación es requerida'),
    primary_contact: z.boolean(),
})

export const familyMemberUpdateFormSchema = z.object({
    relationship: z.string().min(1, 'La relación es requerida'),
    primary_contact: z.boolean(),
})

export const familyMembersResponseSchema = z.object({
    data: z.array(familyMemberSchema),
})

export const familyMemberResponseSchema = z.object({
    data: familyMemberSchema,
})

// Grupos
export const grupoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    teacher: usuarioSchema.optional().nullable(),
    color: z.string(),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level: nivelSchema.optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
})
export const grupoFormSchema = z.object({
    name: z.string().min(1, 'El nombre del grupo es requerido'),
    teacher_uuid: z.string().nullable(),
    color: z.string().min(1, 'El color es requerido'),
    icon_path: z.string().nullable(),
    entry_time: z.string().nullable(),
    dismissal_time: z.string().nullable(),
    monthly_fee: z.string(),
    capacity: z.number(),
    active: z.boolean(),
    level_uuid: z.string().min(1, 'El nivel es requerido'),
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


export type Nivel = z.infer<typeof nivelSchema>
export type Grupo = z.infer<typeof grupoSchema>
export type Alumno = z.infer<typeof alumnoSchema>
export type Usuario = z.infer<typeof usuarioSchema>
export type RolUsuario = z.infer<typeof rolUsuarioSchema>
export type EmergencyContact = z.infer<typeof emergencyContactSchema>
export type DoctorInformation = z.infer<typeof doctorInformationSchema>
export type FamilyMember = z.infer<typeof familyMemberSchema>

export type EmergencyContactsResponse = z.infer<typeof emergencyContactsResponseSchema>
export type DoctorInformationResponse = z.infer<typeof doctorInformationResponseSchema>

export type PaginatedResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>

export type NivelFormData = z.infer<typeof nivelFormSchema>
export type GrupoFormData = z.infer<typeof grupoFormSchema>
export type AlumnoFormData = z.infer<typeof alumnoFormSchema>
export type UsuarioFormData = z.infer<typeof usuarioBaseFormSchema>
export type EmergencyContactFormData = z.infer<typeof emergencyContactFormSchema>
export type DoctorInformationFormData = z.infer<typeof doctorInformationFormSchema>
export type FamilyMemberAttachFormData = z.infer<typeof familyMemberAttachFormSchema>
export type FamilyMemberUpdateFormData = z.infer<typeof familyMemberUpdateFormSchema>

export type NivelesPaginados = PaginatedResponse<typeof nivelSchema>
export type GruposPaginados = PaginatedResponse<typeof grupoSchema>
export type AlumnosPaginados = PaginatedResponse<typeof alumnoSchema>
export type UsuariosPaginados = PaginatedResponse<typeof usuarioSchema>

// Comunicados
export const TIPOS_COMUNICADO = ['general', 'urgent', 'announcement', 'festival', 'meeting', 'food', 'reminder'] as const;
export const ESTADOS_COMUNICADO = ['draft', 'published'] as const;

export const comunicadoSchema = z.object({
    id: z.string().uuid(),
    author_id: z.string().uuid().nullable(),
    title: z.string(),
    content: z.string(),
    status: z.enum(ESTADOS_COMUNICADO),
    type: z.enum(TIPOS_COMUNICADO),
    is_global: z.boolean(),
    attachment: z.string().nullable(),
    published_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const comunicadoFormSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    content: z.string().min(1, 'El contenido es requerido'),
    type: z.enum(TIPOS_COMUNICADO),
    is_global: z.boolean(),
    group_uuids: z.array(z.string()),
    student_uuids: z.array(z.string()),
    status: z.enum(ESTADOS_COMUNICADO),
    attachment: z.string().nullable(),
})

export const comunicadosPaginadosSchema = paginatedResponseSchema(comunicadoSchema)

export type Comunicado = z.infer<typeof comunicadoSchema>
export type ComunicadoFormData = z.infer<typeof comunicadoFormSchema>
export type ComunicadosPaginados = z.infer<typeof comunicadosPaginadosSchema>

// Colegiaturas
export const ESTADOS_COLEGIATURA = ['paid', 'pending', 'overdue'] as const;

export const colegiaturasSchema = z.object({
    id: z.string().uuid(),
    student_id: z.string().uuid(),
    paid_by: z.string().uuid().nullable(),
    period: z.string(),
    amount: z.string(),
    status: z.enum(ESTADOS_COLEGIATURA),
    payment_date: z.string().nullable(),
    payment_method: z.string().nullable(),
    reference: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const colegiaturasFormSchema = z.object({
    student_uuid: z.string().min(1, 'El alumno es requerido'),
    period: z.string().min(1, 'El periodo es requerido'),
    amount: z.string().min(1, 'El monto es requerido'),
    status: z.enum(ESTADOS_COLEGIATURA),
    payment_date: z.string().nullable(),
    payment_method: z.string().nullable(),
    reference: z.string().nullable(),
})

export type Colegiatura = z.infer<typeof colegiaturasSchema>
export type ColegiaturasFormData = z.infer<typeof colegiaturasFormSchema>

// Comida
export const ESTADOS_TURNO = ['pending', 'confirmed', 'served', 'cancelled'] as const;

export const mealSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    recipe: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const mealShiftSchema = z.object({
    id: z.string().uuid(),
    meal_id: z.string().uuid(),
    student_id: z.string().uuid(),
    date: z.string(),
    status: z.enum(ESTADOS_TURNO),
    created_at: z.string(),
    updated_at: z.string(),
})

export const mealFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().nullable(),
    recipe: z.string().min(1, 'La receta es requerida'),
})

export const mealShiftFormSchema = z.object({
    meal_uuid: z.string().min(1),
    student_uuid: z.string().min(1),
    date: z.string().min(1),
    status: z.enum(ESTADOS_TURNO),
})

export type Meal = z.infer<typeof mealSchema>
export type MealShift = z.infer<typeof mealShiftSchema>
export type MealFormData = z.infer<typeof mealFormSchema>
export type MealShiftFormData = z.infer<typeof mealShiftFormSchema>

// Calendario
export const TIPOS_EVENTO = ['general', 'festival', 'activity', 'start_of_school_year', 'end_of_school_year', 'excursion', 'other'] as
    const;
export const TIPOS_ADJUNTO = ['image', 'document', 'other'] as const;

export const eventAttachmentSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    file_path: z.string(),
    file_type: z.enum(TIPOS_ADJUNTO),
    tag: z.string().nullable(),
    published: z.boolean(),
    order: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const eventSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    start_time: z.string(),
    end_time: z.string().nullable(),
    type: z.enum(TIPOS_EVENTO),
    published: z.boolean(),
    global: z.boolean(),
    attachments: z.array(eventAttachmentSchema).optional(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const eventFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().nullable(),
    start_time: z.string().min(1, 'La fecha de inicio es requerida'),
    end_time: z.string().nullable(),
    type: z.enum(TIPOS_EVENTO),
    published: z.boolean(),
    global: z.boolean(),
    group_uuids: z.array(z.string()),
})

export type Event = z.infer<typeof eventSchema>
export type EventAttachment = z.infer<typeof eventAttachmentSchema>
export type EventFormData = z.infer<typeof eventFormSchema>

// Asistencias
export const ESTADOS_ASISTENCIA = ['present', 'absent', 'late', 'excused'] as const;

export const attendanceSchema = z.object({
    id: z.string().uuid(),
    student_id: z.string().uuid(),
    group_id: z.string().uuid(),
    teacher_id: z.string().uuid().nullable(),
    date: z.string(),
    status: z.enum(ESTADOS_ASISTENCIA),
    created_at: z.string(),
    updated_at: z.string(),
})

export const attendanceFormSchema = z.object({
    student_uuid: z.string().min(1),
    group_uuid: z.string().min(1),
    date: z.string().min(1),
    status: z.enum(ESTADOS_ASISTENCIA),
})

export type Attendance = z.infer<typeof attendanceSchema>
export type AttendanceFormData = z.infer<typeof attendanceFormSchema>

// Bitácora del alumno
export const NIVELES_LOGRO = ['started', 'progressing', 'advanced', 'achieved'] as const;

export const studentLogSchema = z.object({
    id: z.string().uuid(),
    student_id: z.string().uuid(),
    teacher_id: z.string().uuid().nullable(),
    material: z.string(),
    observations: z.string().nullable(),
    achievement_level: z.enum(NIVELES_LOGRO),
    created_at: z.string(),
    updated_at: z.string(),
})

export const studentLogFormSchema = z.object({
    material: z.string().min(1, 'El material es requerido'),
    observations: z.string().nullable(),
    achievement_level: z.enum(NIVELES_LOGRO),
})

export type StudentLog = z.infer<typeof studentLogSchema>
export type StudentLogFormData = z.infer<typeof studentLogFormSchema>

// Padre Pendiente — estado local del modal antes de guardar el alumno
export const padreNuevoFormSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'Los apellidos son requeridos'),
    email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
    phone_number: z.string().max(13, 'Máximo 13 caracteres'),
    password: z.string(),
    password_confirmation: z.string(),
    relationship: z.string().min(1, 'La relación es requerida'),
    primary_contact: z.boolean(),
})
    .refine((d) => d.password.length >= 8, {
        message: 'Mínimo 8 caracteres',
        path: ['password'],
    })
    .refine((d) => d.password === d.password_confirmation, {
        message: 'Los passwords no coinciden',
        path: ['password_confirmation'],
    })

export type PadreNuevoFormData = z.infer<typeof padreNuevoFormSchema>

export type PadrePendiente =
    | { tipo: "existente"; usuario: Usuario; relationship: string; primary_contact: boolean }
    | { tipo: "nuevo"; formData: PadreNuevoFormData }