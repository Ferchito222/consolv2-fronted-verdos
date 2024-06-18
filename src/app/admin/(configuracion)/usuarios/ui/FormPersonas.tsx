import { FormInputDate, FormInputText } from '@/components/form'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

export const FormPersonas = () => {
  return (
    <div>
      <Box height={'5px'} />
      <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
        Datos personales
      </Typography>
      <Box height={'20px'} />
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={'nroDocumento'}
            control={control}
            name="persona.nroDocumento"
            label="Nro. Documento"
            disabled={loadingModal}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={'nombre'}
            control={control}
            name="persona.nombres"
            label="Nombre"
            disabled={loadingModal}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={'primerApellido'}
            control={control}
            name="persona.primerApellido"
            label="Primer Apellido"
            disabled={loadingModal}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={'segundoApellido'}
            control={control}
            name="persona.segundoApellido"
            label="Segundo apellido"
            disabled={loadingModal}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputDate
            id={'fechaNacimiento'}
            control={control}
            name="persona.fechaNacimiento"
            label="Fecha de nacimiento"
            disabled={loadingModal}
            rules={{ required: 'Este campo es requerido' }}
          />
        </Grid>
      </Grid>
    </div>
  )
}
