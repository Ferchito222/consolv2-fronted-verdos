'use client'
import { PersonaCRUDType } from '@/app/admin/(configuracion)/personas/types/personasCRUDTypes'
import { VistaModalPersona } from '@/app/admin/(configuracion)/personas/ui'
import { FiltroPersonas } from '@/app/admin/(configuracion)/personas/ui/FiltroPersonas'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { CustomSwitch } from '@/components/botones/CustomSwitch'
import { CustomToggleButton } from '@/components/botones/CustomToogleButton'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { Paginacion } from '@/components/datatable/Paginacion'
import { ordenFiltrado } from '@/components/datatable/utils'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { Constantes } from '@/config/Constantes'
import { useAuth } from '@/context/AuthProvider'
import { useAlerts, useSession } from '@/hooks'
import { CasbinTypes } from '@/types'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils'
import { formatoFecha } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function PersonasPage() {
  const [personasData, setPersonasData] = useState<PersonaCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const [errorPersonasData, setErrorPersonasData] = useState<any>()

  const [modalPersona, setModalPersona] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoPersona, setMostrarAlertaEstadoPersona] =
    useState(false)

  const [personaEdicion, setPersonaEdicion] = useState<
    PersonaCRUDType | undefined | null
  >()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const { sesionPeticion } = useSession()
  const { permisoUsuario } = useAuth()

  const [filtroNroDocumento, setFiltroNroDocumento] = useState<string>('')
  const [filtroPrimerApellido, setFiltroPrimerApellido] = useState<string>('')
  const [filtroSegundoApellido, setFiltroSegundoApellido] = useState<string>('')
  const [filtroNombres, setFiltroNombres] = useState<string>('')
  const [filtroFechaNacimiento, setFiltroFechaNacimiento] = useState<string>('')
  const [mostrarFiltroPersonas, setMostrarFiltroPersonas] = useState(false)
  // Permisos para acciones
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: false,
    create: false,
    update: false,
    delete: false,
  })

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  /// Método que muestra alerta de cambio de estado

  const editarEstadoPersonaModal = (persona: PersonaCRUDType) => {
    setPersonaEdicion(persona) // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoPersona(true) // para mostrar alerta de persona
  }

  const cancelarAlertaEstadoPersona = async () => {
    setMostrarAlertaEstadoPersona(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setPersonaEdicion(null)
  }

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoPersona = async () => {
    setMostrarAlertaEstadoPersona(false)
    if (personaEdicion) {
      await cambiarEstadoPersonaPeticion(personaEdicion)
    }
    setPersonaEdicion(null)
  }

  /// Petición que cambia el estado de un persona
  const cambiarEstadoPersonaPeticion = async (persona: PersonaCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/parametros/${persona.id}/${
          persona.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado persona: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      await obtenerPersonasPeticion()
    } catch (e) {
      imprimir(`Error estado persona`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // router para conocer la ruta actual
  const pathname = usePathname()

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'nombres', nombre: 'Nombres', ordenar: true },
    { campo: 'primerApellido', nombre: 'Primer Apellido', ordenar: true },
    { campo: 'segundoApellido', nombre: 'Segundo Apellido', ordenar: true },
    { campo: 'nroDocumento', nombre: 'Nro. CI', ordenar: true },
    { campo: 'fechaNacimiento', nombre: 'Fecha Nacimiento', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = personasData.map(
    (personaData, indexPersona) => [
      <Typography
        key={`${personaData.id}-${indexPersona}-nombres`}
        variant={'body2'}
      >
        {personaData.nombres}
      </Typography>,
      <Typography
        key={`${personaData.id}-${indexPersona}-primerApellido`}
        variant={'body2'}
      >
        {personaData.primerApellido}
      </Typography>,
      <Typography
        key={`${personaData.id}-${indexPersona}-segundoApellido`}
        variant={'body2'}
      >
        {personaData.segundoApellido}
      </Typography>,
      <Typography
        key={`${personaData.id}-${indexPersona}-nroDocumento`}
        variant={'body2'}
      >
        {personaData.nroDocumento}
      </Typography>,
      <Typography
        key={`${personaData.id}-${indexPersona}-fechaNacimiento`}
        variant={'body2'}
      >
        {formatoFecha(personaData.fechaNacimiento, 'DD/MM/YYYY')}
      </Typography>,

      // <CustomMensajeEstado
      //   key={`${personaData.id}-${indexPersona}-estado`}
      //   titulo={personaData.estado}
      //   descripcion={personaData.estado}
      //   color={
      //     personaData.estado == 'ACTIVO'
      //       ? 'success'
      //       : personaData.estado == 'INACTIVO'
      //         ? 'error'
      //         : 'info'
      //   }
      // />,
      <Stack
        key={`${personaData.id}-${indexPersona}-acciones`}
        direction={'row'}
        alignItems={'center'}
      >
        {permisos.update && (
          <CustomSwitch
            id={`cambiarEstadoPersona-${personaData.id}`}
            titulo={personaData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            accion={async () => {
              await editarEstadoPersonaModal(personaData)
            }}
            name={
              personaData.estado == 'ACTIVO'
                ? 'Inactivar Persona'
                : 'Activar Persona'
            }
            color={personaData.estado == 'ACTIVO' ? 'success' : 'error'}
            marcado={personaData.estado == 'ACTIVO'}
            desactivado={personaData.estado == 'PENDIENTE'}
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarPersonas-${personaData.id}`}
            name={'Personas'}
            titulo={'Editar'}
            color={'primary'}
            icono={'edit'}
            accion={async () => {
              await editarPersonaModal(personaData)
            }}
          />
        )}
      </Stack>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <CustomToggleButton
      id={'accionFiltrarPersonasToggle'}
      key={'accionFiltrarPersonasToggle'}
      icono="search"
      seleccionado={mostrarFiltroPersonas}
      cambiar={setMostrarFiltroPersonas}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarPersonas'}
        key={`ordenarPersonas`}
        label={'Ordenar personas'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarPersona'}
      titulo={'Actualizar'}
      key={`accionActualizarPersona`}
      accion={async () => {
        await obtenerPersonasPeticion()
      }}
      icono={'refresh'}
      name={'Actualizar lista de personas'}
    />,
    permisos.create && (
      <IconoBoton
        id={'agregarPersona'}
        key={'agregarPersona'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar persona'}
        accion={() => {
          agregarPersonaModal()
        }}
      />
    ),
  ]

  const obtenerPersonasPeticion = async () => {
    try {
      setLoading(true)
      console.log(filtroFechaNacimiento, 'fechaNacimiento')
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/personas/filtro/avanzado`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroNroDocumento.length == 0
            ? {}
            : { nroDocumento: filtroNroDocumento }),
          ...(filtroPrimerApellido.length == 0
            ? {}
            : { primerApellido: filtroPrimerApellido }),
          ...(filtroSegundoApellido.length == 0
            ? {}
            : { segundoApellido: filtroSegundoApellido }),
          ...(filtroNombres.length == 0 ? {} : { nombres: filtroNombres }),
          ...(filtroFechaNacimiento == null || filtroFechaNacimiento.length == 0
            ? {}
            : {
                fechaNacimiento: formatoFecha(
                  filtroFechaNacimiento,
                  'YYYY-MM-DD'
                ),
              }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setPersonasData(respuesta.datos?.filas)
      //setPersonasData(respuesta.datos[0])
      setTotal(respuesta.datos?.total)
      //setTotal(respuesta.datos[1])
      setErrorPersonasData(null)
    } catch (e) {
      imprimir(`Error al obtener personas`, e)
      setErrorPersonasData(e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const agregarPersonaModal = () => {
    setPersonaEdicion(undefined)
    setModalPersona(true)
  }
  const editarPersonaModal = (persona: PersonaCRUDType) => {
    setPersonaEdicion(persona)
    setModalPersona(true)
  }

  const cerrarModalPersona = async () => {
    setModalPersona(false)
    await delay(500)
    setPersonaEdicion(undefined)
  }

  async function definirPermisos() {
    setPermisos(await permisoUsuario(pathname))
  }

  useEffect(() => {
    definirPermisos().finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    obtenerPersonasPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroNroDocumento,
    filtroPrimerApellido,
    filtroSegundoApellido,
    filtroNombres,
    filtroFechaNacimiento,
  ])

  useEffect(() => {
    if (!mostrarFiltroPersonas) {
      setFiltroNroDocumento('')
      setFiltroPrimerApellido('')
      setFiltroSegundoApellido('')
      setFiltroNombres('')
      setFiltroFechaNacimiento('')
    }
  }, [mostrarFiltroPersonas])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  return (
    <>
      <title>{`Personas - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoPersona}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          personaEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
        } el persona: ${titleCase(personaEdicion?.nombres ?? '')} ?`}
      >
        <Button variant={'outlined'} onClick={cancelarAlertaEstadoPersona}>
          Cancelar
        </Button>
        <Button variant={'contained'} onClick={aceptarAlertaEstadoPersona}>
          Aceptar
        </Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalPersona}
        handleClose={cerrarModalPersona}
        maxWidth="sm"
        title={personaEdicion ? 'Editar persona' : 'Nueva persona'}
      >
        <VistaModalPersona
          persona={personaEdicion}
          accionCorrecta={() => {
            cerrarModalPersona().finally()
            obtenerPersonasPeticion().finally()
          }}
          accionCancelar={cerrarModalPersona}
        />
      </CustomDialog>
      <CustomDataTable
        titulo={'Personas'}
        error={!!errorPersonasData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroPersonas && (
            <FiltroPersonas
              filtroNroDocumento={filtroNroDocumento}
              filtroPrimerApellido={filtroPrimerApellido}
              filtroSegundoApellido={filtroSegundoApellido}
              filtroNombres={filtroNombres}
              filtroFechaNacimiento={filtroFechaNacimiento}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroNroDocumento(filtros.nroDocumento)
                setFiltroPrimerApellido(filtros.primerApellido)
                setFiltroSegundoApellido(filtros.segundoApellido)
                setFiltroNombres(filtros.nombres)
                setFiltroFechaNacimiento(filtros.fechaNacimiento)
              }}
              accionCerrar={() => {
                imprimir(`👀 cerrar`)
              }}
            />
          )
        }
      />
    </>
  )
}
