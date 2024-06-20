/// CRUD de personas

export interface PersonaCRUDType {
  id: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  apellidoCasada: string
  nroDocumento: string
  tipoDocumento: string
  complemento: string
  complementoVisible: boolean
  expedido: string
  sexo: boolean
  fechaNacimiento: string
  estadoCivil: string
  correoElectronico: string
  telefonoDomicilio: string
  telefonoTrabajo: string
  direccionTrabajo: string
  celular: string
  domicilio: string
  embarazo: boolean
  configuracionApellidos: string
  estado: string
}

export interface CrearEditarPersonaCRUDType {
  id?: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  apellidoCasada: string
  nroDocumento: string
  tipoDocumento: string
  complemento: string
  complementoVisible: boolean
  expedido: string
  sexo: boolean
  fechaNacimiento: string
  estadoCivil: string
  correoElectronico: string
  telefonoDomicilio: string
  telefonoTrabajo: string
  direccionTrabajo: string
  celular: string
  domicilio: string
  embarazo: boolean
  configuracionApellidos: string
}
