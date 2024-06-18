/// Vista modal de usuario
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ComboType,
  CrearEditarUsuarioType,
  DepartamentoType,
  InstitucionType,
  NivelInformacionType,
  PersonaCRUDType,
  RedesType,
  RolType,
  UsuarioCRUDType,
} from '../types/usuariosCRUDTypes'

import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Constantes } from '@/config/Constantes'
import { useAlerts, useSession } from '@/hooks'
import { Servicios } from '@/services'
import { delay, InterpreteMensajes, titleCase } from '@/utils'
import { formatoFecha } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import { isValidEmail } from '@/utils/validations'
import {
  Box,
  Button,
  Card,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'
import {
  FormInputDropdown,
  FormInputRadioRow,
  FormInputText,
} from 'src/components/form'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { VistaModalBuscarPersona } from './ModalBuscarPersona'

export interface ModalUsuarioType {
  usuario?: UsuarioCRUDType | undefined | null
  roles: RolType[]
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalUsuario = ({
  usuario,
  accionCorrecta,
  accionCancelar,
}: ModalUsuarioType) => {
  // Flag que índica que hay un proceso en ventana modal cargando visualmente
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const [modalBuscarPersona, setModalBuscarPersona] = useState(false)
  const [personaSelected, setPersonaSelected] = useState<PersonaCRUDType>(
    usuario?.persona ?? ({} as PersonaCRUDType)
  )

  const [instituciones, setInstituciones] = useState<ComboType[]>([])
  const [departamentos, setDepartamentos] = useState<ComboType[]>([])
  const [municipios, setMunicipios] = useState<ComboType[]>([])
  const [redes, setRedes] = useState<ComboType[]>([])
  const [establecimientos, setEstablecimientos] = useState<ComboType[]>([])
  const [nivelInformacion, setNivelInformacion] = useState<ComboType[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [rolesList, setRolesList] = useState([])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control, watch, setValue } =
    useForm<CrearEditarUsuarioType>({
      defaultValues: {
        id: usuario?.id,
        usuario: usuario?.usuario,
        roles: usuario?.usuarioRol.map((rol) => rol.rol.id),
        estado: usuario?.estado,
        nivelId: usuario?.nivelId,
        correoElectronico: usuario?.correoElectronico,
        seguridadSocial: usuario?.institucionesId ? true : false,
        persona: {
          id: usuario?.persona.id,
          nroDocumento: usuario?.persona.nroDocumento,
          nombres: usuario?.persona.nombres,
          primerApellido: usuario?.persona.primerApellido,
          segundoApellido: usuario?.persona.segundoApellido,
          fechaNacimiento: usuario?.persona.fechaNacimiento,
        },
      },
    })

  const {
    seguridadSocial,
    nivelId,
    departamentoId,
    municipioId,
    usuario: usuarioGenerado,
  } = watch()

  /// Petición que obtiene lista de instituciones
  const obtenerGenerarUsuario = async (persona: PersonaCRUDType) => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/personas/busqueda/construye-usuario`,
        method: 'post',
        body: {
          nombres: persona.nombres.toLowerCase(),
          primerApellido: persona.primerApellido.toLowerCase(),
          segundoApellido: persona.segundoApellido.toLowerCase(),
        },
      })
      setValue('usuario', respuesta.datos.usuario)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  /// Petición que obtiene lista de instituciones
  const obtenerInstitucionesPeticion = async () => {
    try {
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/instituciones`,
      })
      const trasnformData = respuesta.datos.map((item: InstitucionType) => {
        return {
          key: String(item.id),
          value: String(item.id),
          label: item.institucion,
        }
      })
      setInstituciones(trasnformData)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  /// Petición que obtiene lista de niveles de acceso
  const obtenerNivelesAccesoPeticion = async () => {
    try {
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/nivel-informacion`,
      })
      const trasnformData = respuesta.datos.map(
        (item: NivelInformacionType) => {
          return {
            key: String(item.id),
            value: String(item.id),
            label: item.descripcion,
          }
        }
      )
      setNivelInformacion(trasnformData)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  /// Petición que obtiene lista de departamentos
  const obtenerDepartamentosPeticion = async () => {
    try {
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/departamentos`,
      })
      const trasnformData = respuesta.datos.map((item: DepartamentoType) => {
        return {
          key: String(item.id),
          value: String(item.id),
          label: item.departamento,
        }
      })
      setDepartamentos(trasnformData)
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    }
  }

  /// Petición que obtiene lista de redes por departamento
  const obtenerRedesPeticion = async (departamentoId: string) => {
    try {
      setLoadingModal(true)
      await delay(100)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/redes/${departamentoId}`,
      })
      const trasnformData = respuesta.datos.map((item: RedesType) => {
        return {
          key: String(item.id),
          value: String(item.id),
          label: item.red,
        }
      })
      setRedes(trasnformData)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  /// Petición que obtiene lista de emunicipios poor red
  const obtenerMunicipiosPeticion = async (redId: string) => {
    try {
      setLoadingModal(true)
      await delay(500)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/municipios/${redId}`,
      })
      setMunicipios(respuesta.datos)
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  /// Petición que obtiene lista de establecimientos por municipio
  const obtenerEstablecimientosPeticion = async (
    redId?: string,
    departamentoId?: string,
    municipioId?: string
  ) => {
    console.log(redId, departamentoId, municipioId)

    try {
      setLoadingModal(true)
      await delay(500)
      // const respuesta = await Servicios.get({
      //   url: `${Constantes.baseUrl00}/estructura/establecimientos/${municipioId}`,
      // })
      setEstablecimientos([])
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  /// Petición que obtiene lista de emunicipios poor red
  const obtenerRolesPorNivel = async (nivelId: string) => {
    try {
      setRolesList([])
      await delay(500)
      setLoadingModal(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/autorizacion/roles/nivel/${nivelId}`,
        method: 'get',
      })
      setRolesList(respuesta.datos)
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const handleSelectNiveleInformacion = async (nivelId: string) => {
    setValue('departamentoId', '')
    setValue('municipioId', '')
    setValue('redId', '')
    setValue('establecimientoId', '')
    setValue('roles', [])

    await obtenerRolesPorNivel(nivelId)
  }

  const handleSelectDepartameno = async (departamentoId: string) => {
    await obtenerRedesPeticion(departamentoId)
  }

  const handleSelectRedes = async (redId: string) => {
    await obtenerMunicipiosPeticion(redId)
  }

  const handleSelectMunicipios = async (redId: string) => {
    await obtenerEstablecimientosPeticion(redId, departamentoId, municipioId)
  }

  const handleSelectRoles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setRoles([...roles, event.target.value])
      setValue('roles', roles)
    }
    if (!event.target.checked) {
      setRoles(roles.filter((rol) => rol !== event.target.value))
      setValue('roles', roles)
    }
  }

  const obtenerCargaInicial = async () => {
    try {
      setLoadingModal(true)
      await delay(1000)
      await Promise.all([
        obtenerInstitucionesPeticion(),
        obtenerDepartamentosPeticion(),
        obtenerNivelesAccesoPeticion(),
      ])
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const guardarActualizarUsuario = async (data: CrearEditarUsuarioType) => {
    await guardarActualizarUsuariosPeticion(data)
  }

  const guardarActualizarUsuariosPeticion = async (
    usuario: CrearEditarUsuarioType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/usuarios/crear/usuario-gabo`,
        method: !!usuario.id ? 'patch' : 'post',
        body: {
          usuario: usuarioGenerado,
          contrasena: usuario.persona.nroDocumento,
          ciudadaniaDigital: false,
          correoElectronico: usuario.correoElectronico,
          intentos: 0,
          codigoDesbloqueo: null,
          codigoRecuperacion: null,
          codigoTransaccion: null,
          codigoActivacion: null,
          fechaBloqueo: null,
          idPersona: Number(usuario.persona.id),
          establecimientoId: Number(usuario.establecimientoId),
          establecimiento: '',
          nivelId: Number(usuario.nivelId),
          nivel: '',
          departamentoId: Number(usuario.departamentoId),
          departamento: '',
          municipioId: Number(usuario.municipioId),
          municipio: '',
          redId: Number(usuario.redId),
          red: '',
          sectorId: Number(usuario.sectorId),
          sector: '',
          tipoDestino: '',
          institucionesId: Number(usuario.institucionesId),
          instituciones: '',
          roles: usuario.roles,
          telefono: '',
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const onSelectPersona = async (persona: any) => {
    cerrarModalBuscarPersona()
    setPersonaSelected(persona)
    setValue('correoElectronico', persona.correoElectronico)
    setValue('persona', {
      id: persona.id,
      nroDocumento: persona.nroDocumento,
      nombres: persona.nombres,
      primerApellido: persona.primerApellido,
      segundoApellido: persona.segundoApellido,
      fechaNacimiento: persona.fechaNacimiento,
    })
    await obtenerGenerarUsuario(persona)
  }

  const abrirModalBuscarPersona = () => {
    setModalBuscarPersona(true)
  }

  const cerrarModalBuscarPersona = () => {
    setModalBuscarPersona(false)
  }

  useEffect(() => {
    obtenerCargaInicial()
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
        <DialogContent dividers>
          <Grid container direction={'column'} justifyContent="space-evenly">
            <Grid>
              <Box height={'10px'} />
              <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: '500',
                      }}
                    >
                      Datos del usuario
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={abrirModalBuscarPersona}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      Seleccionar persona
                    </Button>
                  </Box>

                  <Card
                    variant="elevation"
                    sx={{
                      borderRadius: 1,
                      mt: 1,
                      p: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Nombres: {personaSelected?.nombres}{' '}
                      {personaSelected?.primerApellido}{' '}
                      {personaSelected?.segundoApellido}
                    </Typography>
                    <Typography variant="body2">
                      Documento: {personaSelected?.nroDocumento}{' '}
                      {personaSelected?.complemento}
                    </Typography>
                    <Typography variant="body2">
                      Fecha Nacimiento: {personaSelected?.fechaNacimiento}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body2">Usuario: </Typography>
                  <Typography variant="h5">
                    {usuarioGenerado ?? 'Seleccione una persona'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormInputText
                    id={'correoElectronico'}
                    control={control}
                    name="correoElectronico"
                    label="Correo electrónico"
                    disabled={loadingModal}
                    rules={{
                      validate: (value) => {
                        if (!isValidEmail(value))
                          return 'No es un correo válido'
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <FormInputRadioRow
                    id="seguridadSocial"
                    name="seguridadSocial"
                    control={control}
                    label="Seguridad social:"
                    options={[
                      {
                        key: '1',
                        label: 'SI',
                        value: true,
                      },
                      {
                        key: '2',
                        label: 'NO',
                        value: false,
                      },
                    ]}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <FormInputDropdown
                    id={'institucionesId'}
                    name="institucionesId"
                    control={control}
                    label="Instituciones:"
                    disabled={!seguridadSocial}
                    bgcolor={!seguridadSocial ? '#f1f0f0' : ''}
                    options={instituciones}
                    labelVariant="subtitle2"
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <FormInputDropdown
                    id={'nivelId'}
                    name="nivelId"
                    control={control}
                    label={`Nivel de información:`}
                    isRequired
                    options={nivelInformacion}
                    onChange={(e) =>
                      handleSelectNiveleInformacion(e.target.value)
                    }
                    rules={{ required: 'Este campo es requerido' }}
                  />
                </Grid>

                {nivelId && nivelId != '1' && (
                  <>
                    {nivelId > '1' && (
                      <Grid item xs={12} sm={12} md={6}>
                        <FormInputDropdown
                          id={'departamentoId'}
                          name="departamentoId"
                          control={control}
                          label="Departamento:"
                          options={departamentos}
                          onChange={(e) =>
                            handleSelectDepartameno(e.target.value)
                          }
                          labelVariant="subtitle2"
                          rules={{ required: 'Este campo es requerido' }}
                        />
                      </Grid>
                    )}
                    {nivelId > '2' && (
                      <Grid item xs={12} sm={12} md={6}>
                        <FormInputDropdown
                          id={'redId'}
                          name="redId"
                          control={control}
                          label="Red:"
                          options={redes}
                          onChange={(e) => handleSelectRedes(e.target.value)}
                          labelVariant="subtitle2"
                          rules={{ required: 'Este campo es requerido' }}
                        />
                      </Grid>
                    )}

                    {nivelId > '3' && (
                      <Grid item xs={12} sm={12} md={6}>
                        <FormInputDropdown
                          id={'municipioId'}
                          name="municipioId"
                          control={control}
                          label="Municipio:"
                          options={municipios}
                          onChange={(e) =>
                            handleSelectMunicipios(e.target.value)
                          }
                          labelVariant="subtitle2"
                          rules={{ required: 'Este campo es requerido' }}
                        />
                      </Grid>
                    )}

                    {nivelId > '4' && (
                      <Grid item xs={12} sm={12} md={6}>
                        <FormInputDropdown
                          id={'establecimientoId'}
                          name="establecimientoId"
                          control={control}
                          label="Establecimineto:"
                          options={establecimientos}
                          labelVariant="subtitle2"
                          isRequired
                          rules={{ required: 'Este campo es requerido' }}
                        />
                      </Grid>
                    )}
                  </>
                )}

                {nivelId && rolesList.length > 0 && (
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="subtitle2">
                      Seleccionar roles:
                    </Typography>
                    <Grid container overflow={'auto'} maxHeight={350}>
                      {rolesList.map((rol: any) => (
                        <Grid item xs={12} sm={12} md={6} key={rol.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                id={'roles'}
                                size="medium"
                                onChange={handleSelectRoles}
                                name={rol.id}
                                value={rol.id}
                              />
                            }
                            label={titleCase(rol.nombre)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Box height={'20px'} />
            <ProgresoLineal mostrar={loadingModal} />
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            my: 1,
            mx: 2,
            justifyContent: {
              lg: 'flex-end',
              md: 'flex-end',
              xs: 'center',
              sm: 'center',
            },
          }}
        >
          <Button
            variant={'outlined'}
            disabled={loadingModal}
            onClick={accionCancelar}
          >
            Cancelar
          </Button>
          <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
            Guardar
          </Button>
        </DialogActions>
      </form>

      <CustomDialog
        isOpen={modalBuscarPersona}
        handleClose={cerrarModalBuscarPersona}
        maxWidth="sm"
        title={'Buscar persona'}
      >
        <VistaModalBuscarPersona seleccionarPersona={onSelectPersona} />
      </CustomDialog>
    </>
  )
}
