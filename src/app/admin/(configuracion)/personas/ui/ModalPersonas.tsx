import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material'
import {
  CrearEditarPersonaCRUDType,
  PersonaCRUDType,
} from '@/app/admin/(configuracion)/personas/types/personasCRUDTypes'
import { useAlerts, useSession } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import {
  FormInputDate,
  FormInputDropdown,
  FormInputRadioRow,
  FormInputText,
} from 'src/components/form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { isValidEmail } from '@/utils/validations'

export interface ModalPersonaType {
  persona?: PersonaCRUDType | null
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalPersona = ({
  persona,
  accionCorrecta,
  accionCancelar,
}: ModalPersonaType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<CrearEditarPersonaCRUDType>({
    defaultValues: {
      id: persona?.id,
      nroDocumento: persona?.nroDocumento,
      primerApellido: persona?.primerApellido,
      segundoApellido: persona?.segundoApellido,
      nombres: persona?.nombres,
      fechaNacimiento: persona?.fechaNacimiento,
    },
  })

  const guardarActualizarPersona = async (data: CrearEditarPersonaCRUDType) => {
    await guardarActualizarPersonasPeticion(data)
  }

  const guardarActualizarPersonasPeticion = async (
    persona: CrearEditarPersonaCRUDType
  ) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl01}/parametros${
          persona.id ? `/${persona.id}` : ''
        }`,
        method: !!persona.id ? 'patch' : 'post',
        body: persona,
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar persona`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarPersona)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={6} md={6}>
              <FormInputDropdown
                id={'tipoDocumento'}
                name="tipoDocumento"
                control={control}
                label="Tipo documento"
                disabled={loadingModal}
                options={[
                  {
                    key: '1',
                    label: 'Cédula de Identidad',
                    value: 'CI',
                  },
                  {
                    key: '2',
                    label: 'Cédula de Identidad de Extranjero',
                    value: 'CIE',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={8} sm={3} md={3}>
              <FormInputText
                id={'nroDocumento'}
                control={control}
                name="nroDocumento"
                label="Nro. CI"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={4} sm={3} md={3}>
              <FormInputText
                id={'complemento'}
                control={control}
                name="complemento"
                label="Complemento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={6} sm={5} md={5}>
              <FormInputRadioRow
                id="complementoVisible"
                name="complementoVisible"
                control={control}
                label="Complemento visible"
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
            <Grid item xs={6} sm={7} md={7}>
              <FormInputDropdown
                id="expedido"
                name="expedido"
                control={control}
                label="Expedido"
                options={[
                  {
                    key: '1',
                    label: 'La Paz',
                    value: 'LP',
                  },
                  {
                    key: '2',
                    label: 'Pando',
                    value: 'PA',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'nombre'}
                control={control}
                name="nombres"
                label="Nombres"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'primerApellido'}
                control={control}
                name="primerApellido"
                label="Primer Apellido"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'segundoApellido'}
                control={control}
                name="segundoApellido"
                label="Segundo apellido"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'apellidoCasada'}
                control={control}
                name="apellidoCasada"
                label="Apellido casada"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputDate
                id={'fechaNacimiento'}
                control={control}
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputDropdown
                id={'estadoCivil'}
                name="estadoCivil"
                control={control}
                label="Estado Civil"
                disabled={loadingModal}
                options={[
                  {
                    key: '1',
                    label: 'SOLTERO',
                    value: 'LP',
                  },
                  {
                    key: '2',
                    label: 'CASADO',
                    value: 'PA',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'correoElectronico'}
                name="correoElectronico"
                control={control}
                label="Correo electrónico"
                disabled={loadingModal}
                rules={{
                  required: 'Este campo es requerido',
                  validate: (value) => {
                    if (!isValidEmail(value)) return 'No es un correo válido'
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'telefonoDomicilio'}
                name="telefonoDomicilio"
                control={control}
                label="Teléfono domicilio"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'telefonoTrabajo'}
                name="telefonoTrabajo"
                control={control}
                label="Teléfono trabajo"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'celular'}
                name="celular"
                control={control}
                label="Celular"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'direccionTrabajo'}
                name="direccionTrabajo"
                control={control}
                label="Dirección trabajo"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormInputText
                id={'domicilio'}
                name="domicilio"
                control={control}
                label="Domicilio"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormInputRadioRow
                id="embarazo"
                name="embarazo"
                control={control}
                label="Embarazo"
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
            <Grid item xs={12} sm={8} md={8}>
              <FormInputDropdown
                id="configuracionApellidos"
                name="configuracionApellidos"
                control={control}
                label="Configuración apellidos"
                options={[
                  {
                    key: '1',
                    label: 'Apellido Paterno y Apellido Materno',
                    value: 'AP+AM',
                  },
                  {
                    key: '2',
                    label: 'Apellido Paterno y de casada',
                    value: 'AP+AC',
                  },
                  {
                    key: '3',
                    label:
                      'Apellido Paterno, Apellido Materno y Apellido de Casada',
                    value: 'AP+AM+AC',
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Box height={'10px'} />
          <ProgresoLineal mostrar={loadingModal} />
          <Box height={'5px'} />
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
