// CRUD de usuarios

export interface RolCRUDType {
  id: string
  rol: string
}

export interface UsuarioRolCRUDType {
  fechaCreacion: Date
  usuarioCreacion: string
  fechaActualizacion: Date
  usuarioActualizacion?: string
  id: string
  estado: string
  rol: RolCRUDType
}

export interface PersonaCRUDType {
  id?: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  tipoDocumento: string
  nroDocumento: string
  fechaNacimiento: string
  complemento?: string
}

export interface UsuarioCRUDType {
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico?: string
  estado: string
  seguridadSocial?: boolean
  usuarioRol: UsuarioRolCRUDType[]
  persona: PersonaCRUDType
  institucionesId?: string
  establecimientoId?: string
  nivelId?: string
  departamentoId?: string
  municipioId?: string
  redId?: string
  sectorId?: string
  tipoDestino?: string
  instituciones?: string
  establecimiento?: string
  nivel?: string
  departamento?: string
  municipio?: string
  red?: string
  sector?: string
}

// Crear usuario

export interface CrearPersonaType {
  id?: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  nroDocumento: string
  fechaNacimiento: string
}

export interface CrearEditarUsuarioType {
  id?: string
  usuario?: string
  persona: CrearPersonaType
  ciudadaniaDigital: boolean
  roles: string[]
  estado: string
  seguridadSocial?: boolean
  correoElectronico: string
  institucionesId?: string
  establecimientoId?: string
  nivelId?: string
  departamentoId?: string
  municipioId?: string
  redId?: string
  sectorId?: string
  tipoDestino?: string
  instituciones?: string
  establecimiento?: string
  nivel?: string
  departamento?: string
  municipio?: string
  red?: string
  sector?: string
}

/// Tipo rol transversal

export interface RolType {
  id: string
  rol: string
  nombre: string
}

export interface DepartamentoType {
  id: number
  departamento: string
  sigladepto: string
}

export interface RedesType {
  id: number
  departamentoId: number
  red: string
}

export interface NivelInformacionType {
  id: string
  descripcion: string
  precedente: string
}

export interface MunicipioType {
  id: number
  departamentoId: number
  municipio: string
}

export interface ComboType {
  key: string
  value: string
  label: string
}

export interface InstitucionType {
  id: number
  subsectorId: number
  institucion: number
  codinstitucion: number
}
