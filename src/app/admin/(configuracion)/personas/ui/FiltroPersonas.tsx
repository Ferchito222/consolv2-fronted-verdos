import { Box, Grid } from '@mui/material'

import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect } from 'react'
import { FormInputText } from '@/components/form/FormInputText'
import { FormInputDate } from '@/components/form'

export interface FiltroType {
  nroDocumento: string
  primerApellido: string
  segundoApellido: string
  nombres: string
  fechaNacimiento: string
}

export interface FiltroPersonasType {
  filtroNroDocumento: string
  filtroPrimerApellido: string
  filtroSegundoApellido: string
  filtroNombres: string
  filtroFechaNacimiento: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroPersonas = ({
  filtroNroDocumento,
  filtroPrimerApellido,
  filtroSegundoApellido,
  filtroNombres,
  filtroFechaNacimiento,
  accionCorrecta,
}: FiltroPersonasType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      nroDocumento: filtroNroDocumento,
      primerApellido: filtroPrimerApellido,
      segundoApellido: filtroSegundoApellido,
      nombres: filtroNombres,
      fechaNacimiento: filtroFechaNacimiento,
    },
  })

  const nroDocumentoFiltro: string | undefined = watch('nroDocumento')
  const primerApellidoFiltro: string | undefined = watch('primerApellido')
  const segundoApellidoFiltro: string | undefined = watch('segundoApellido')
  const nombresFiltro: string | undefined = watch('nombres')
  const fechaNacimientoFiltro: string | undefined = watch('fechaNacimiento')

  useEffect(() => {
    actualizacionFiltros({
      nroDocumento: nroDocumentoFiltro,
      primerApellido: primerApellidoFiltro,
      segundoApellido: segundoApellidoFiltro,
      nombres: nombresFiltro,
      fechaNacimiento: fechaNacimientoFiltro,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nroDocumentoFiltro,
    primerApellidoFiltro,
    segundoApellidoFiltro,
    nombresFiltro,
    fechaNacimientoFiltro,
  ])

  const debounced = useDebouncedCallback((filtros: FiltroType) => {
    accionCorrecta(filtros)
  }, 1000)

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={6} md={2}>
          <FormInputText
            id={'nroDocumento'}
            name={'nroDocumento'}
            control={control}
            label={'Nro. CI'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormInputText
            id={'primerApellido'}
            name={'primerApellido'}
            control={control}
            label={'Primer Apellido'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormInputText
            id={'segundoApellido'}
            name={'segundoApellido'}
            control={control}
            label={'Segundo Apellido'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormInputText
            id={'nombres'}
            name={'nombres'}
            control={control}
            label={'Nombres'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormInputDate
            id={'fechaNacimiento'}
            name={'fechaNacimiento'}
            control={control}
            label={'Fecha Nacimiento'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  )
}
