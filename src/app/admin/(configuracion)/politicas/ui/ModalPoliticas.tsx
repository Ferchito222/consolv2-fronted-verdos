import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CrearEditarPoliticaCRUDType,
  guardarPoliticaCRUDType,
  PoliticaCRUDType,
} from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputDropdown, FormInputText } from 'src/components/form'
import Box from '@mui/material/Box'
import { FormInputAutocomplete } from '@/components/form/FormInputAutocomplete'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Servicios } from '@/services'

export interface ModalPoliticaType {
  politica?: PoliticaCRUDType
  roles: RolType[]
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalPolitica = ({
  politica,
  roles,
  accionCorrecta,
  accionCancelar,
}: ModalPoliticaType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const [nivelInformacion, setNivelInformacion] = useState([])
  const [rolesList, setRolesList] = useState([])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const politicaActual: PoliticaCRUDType | undefined = politica

  const opcionesApp: string[] = ['frontend', 'backend']

  const opcionesAccionesFrontend: string[] = [
    'create',
    'read',
    'update',
    'delete',
  ]

  const opcionesAccionesBackend: string[] = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
  ]

  const { handleSubmit, control, watch, setValue } = useForm<any>({
    defaultValues: {
      nivel: 1,
      app: politica?.app,
      accion: politica?.accion
        .split('|')
        .map((val) => ({ key: val, value: val, label: val })),
      objeto: politica?.objeto,
      sujeto: politica?.sujeto,
    },
  })

  const valorApp = watch('app')

  /// Petición que obtiene lista de niveles de acceso
  const obtenerNivelesAccesoPeticion = async () => {
    try {
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl00}/estructura/nivel-informacion`,
      })
      const trasnformData = respuesta.datos.map((item: any) => {
        return {
          key: String(item.id),
          value: String(item.id),
          label: item.descripcion,
        }
      })
      setNivelInformacion(trasnformData)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
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
      const trasnformData = respuesta.datos.map((item: any) => {
        return {
          key: String(item.rol),
          value: String(item.rol),
          label: item.rol,
        }
      })
      setRolesList(trasnformData)
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const guardarActualizarPolitica = async (
    data: CrearEditarPoliticaCRUDType
  ) => {
    await guardarActualizarPoliticaPeticion({
      ...data,
      ...{ accion: data.accion.map((value) => value.value).join('|') },
    })
  }

  const guardarActualizarPoliticaPeticion = async (
    politicaNueva: guardarPoliticaCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/autorizacion/politicas`,
        method: politicaActual ? 'patch' : 'post',
        body: politicaNueva,
        params: {
          sujeto: politicaActual?.sujeto,
          objeto: politicaActual?.objeto,
          accion: politicaActual?.accion,
          app: politicaActual?.app,
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar política`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const handleSelectNiveleInformacion = async (nivelId: string) => {
    await obtenerRolesPorNivel(nivelId)
  }

  useEffect(() => {
    obtenerNivelesAccesoPeticion()
    obtenerRolesPorNivel('1')
  }, [])

  return (
    <form onSubmit={handleSubmit(guardarActualizarPolitica)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                id={'nivel'}
                name="nivel"
                control={control}
                label={`Nivel de información:`}
                isRequired
                options={nivelInformacion}
                onChange={(e) => handleSelectNiveleInformacion(e.target.value)}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id={'sujeto'}
                name="sujeto"
                control={control}
                label="Roles por nivel"
                disabled={loadingModal}
                options={rolesList}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'objeto'}
                control={control}
                name="objeto"
                label="Ruta modulo"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'15px'} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id={'app'}
                name="app"
                control={control}
                label="App"
                disabled={loadingModal}
                options={opcionesApp.map((app) => ({
                  key: app,
                  value: app,
                  label: app,
                }))}
                onChange={(event) => {
                  imprimir(event.target.value)
                  setValue('accion', [])
                }}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                id={'accion'}
                name="accion"
                control={control}
                label="Acción"
                multiple
                forcePopupIcon
                freeSolo
                newValues
                disabled={loadingModal}
                options={(valorApp == 'frontend'
                  ? opcionesAccionesFrontend
                  : valorApp == 'backend'
                    ? opcionesAccionesBackend
                    : []
                ).map((opcionAccion) => ({
                  key: opcionAccion,
                  value: opcionAccion,
                  label: opcionAccion,
                }))}
                rules={{ required: 'Este campo es requerido' }}
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <>{option.label}</>}
                isOptionEqualToValue={(option, value) =>
                  option.value == value.value
                }
              />
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
        <Button
          name={'guardar_politica'}
          variant={'contained'}
          disabled={loadingModal}
          type={'submit'}
        >
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
