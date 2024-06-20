import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RolCRUDType } from '../types/rolCRUDType'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText, FormInputDropdown } from 'src/components/form'
import Box from '@mui/material/Box'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { toSlug } from '../utils'

export interface ModalRolType {
  rol?: RolCRUDType
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalRol = ({
  rol,
  accionCorrecta,
  accionCancelar,
}: ModalRolType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  const [nivelInformacion, setNivelInformacion] = useState([
    {
      id: 1,
      descripcion: 'Nacional',
      precedente: 0,
    },
    {
      id: 2,
      descripcion: 'Departamental',
      precedente: 1,
      estado_id: 1,
    },
    {
      id: 3,
      descripcion: 'Red',
      precedente: 2,
      estado_id: 1,
    },
    {
      id: 4,
      descripcion: 'Municipio',
      precedente: 3,
      estado_id: 1,
    },
    {
      id: 5,
      descripcion: 'Establecimiento',
      precedente: 3,
      estado_id: 1,
    },
  ])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<RolCRUDType>({
    defaultValues: {
      id: rol?.id,
      nivelId: rol?.nivelId,
      nombre: rol?.nombre,
      descripcion: rol?.descripcion,
    },
  })

  const guardarActualizarRol = async (data: RolCRUDType) => {
    await guardarActualizarRolesPeticion(data)
  }

  const guardarActualizarRolesPeticion = async (Rol: RolCRUDType) => {
    try {
      const RolSend = {
        ...Rol,
        nombre: Rol.nombre.toUpperCase(),
        rol: toSlug(Rol.nombre, '-').toUpperCase(),
      }
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/autorizacion/roles${
          Rol.id ? `/${Rol.id}` : ''
        }`,
        method: !!Rol.id ? 'patch' : 'post',
        body: RolSend,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar rol`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarRol)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'nombre'}
                control={control}
                name="nombre"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdown
                id={'nivelId'}
                control={control}
                options={
                  nivelInformacion.map((nivel) => ({
                    key: `${nivel.id}`,
                    value: `${nivel.id}`,
                    label: `${nivel.descripcion}`,
                  })) || []
                }
                name="nivelId"
                label="Nivel de Información"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={'descripcion'}
                control={control}
                name="descripcion"
                label="Descripción"
                multiline
                disabled={loadingModal}
                rows={3}
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
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}
