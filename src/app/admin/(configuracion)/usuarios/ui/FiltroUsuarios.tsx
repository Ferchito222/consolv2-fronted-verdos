import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'

import { useDebouncedCallback } from 'use-debounce'
import { RolType } from '../types/usuariosCRUDTypes'
import {
  FormInputDate,
  FormInputDropdownMultiple,
  FormInputText,
} from 'src/components/form'
import { FormInputAutocomplete } from '@/components/form/FormInputAutocomplete'

export interface FiltroType {
  nroIdentificacion: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  fechaNacimiento: string
  usuario: string
  roles: string[]
}

export interface FiltroModalUsuarioType {
  rolesDisponibles: RolType[]
  filtroRoles: string[]
  filtroUsuario: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroUsuarios = ({
  rolesDisponibles,
  filtroRoles,
  filtroUsuario,
  accionCorrecta,
}: FiltroModalUsuarioType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      nroIdentificacion: filtroUsuario,
      usuario: filtroUsuario,
      roles: filtroRoles,
    },
  })

  const filtroUsuarioWatch: string = watch('usuario')
  const filtroRolesWatch: string[] = watch('roles')

  const debounced = useDebouncedCallback(
    // function
    (filtros: FiltroType) => {
      accionCorrecta(filtros)
    },
    // delay in ms
    1000
  )

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  useEffect(() => {
    /* actualizacionFiltros({
      usuario: filtroUsuarioWatch,
      roles: filtroRolesWatch,
    })
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroUsuarioWatch, filtroRolesWatch])

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputAutocomplete
            id={'roles'}
            name="roles"
            control={control}
            label="Roles"
            bgcolor={'background.paper'}
            multiple
            filterOptions={(options) => options}
            options={rolesDisponibles.map((rol) => ({
              key: rol.id,
              value: rol.id,
              label: rol.nombre,
            }))}
            isOptionEqualToValue={(option, value) =>
              option.value == value.value
            }
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <>{option.label}</>}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputText
            id={'nroIdentificacion'}
            name={'nroIdentificacion'}
            control={control}
            label={'Nro. Identificación'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputText
            id={'primerApellido'}
            name={'primerApellido'}
            control={control}
            label={'Primer Apellido:'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputText
            id={'segundoApellido'}
            name={'segundoApellido'}
            control={control}
            label={'Segundo Apellido:'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputText
            id={'nombres'}
            name={'nombres'}
            control={control}
            label={'Nombres:'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <FormInputDate
            id={'fechaNacimiento'}
            name={'fechaNacimiento'}
            control={control}
            label={'Feca Nacimiento:'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  )
}
