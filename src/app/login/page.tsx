'use client'

import LoginContainer from '@/app/login/ui/LoginContainer'
import { Constantes } from '@/config/Constantes'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useAlerts } from '@/hooks'
import { Servicios } from '@/services'
import { delay, InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useEffect } from 'react'
import imgminsaludsvg from '/public/min-salud.svg'
import DoughnutChart from './../../components/graphics/DoughnutChart' // componente para las gráficasno
export default function LoginPage() {
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const obtenerEstado = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl01}/estado`,
        body: {},
        headers: {
          accept: 'application/json',
        },
      })
      imprimir(`Se obtuvo el estado 🙌`, respuesta)
    } catch (e) {
      imprimir(`Error al obtener estado`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      ocultarFullScreen()
    }
  }

  useEffect(() => {
    obtenerEstado().then(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12} md={3.5}>
        <Box
          sx={{
            alignItems: 'center',
            minHeight: isXs || isSm ? '30vh' : '90vh',
            color: 'primary.main',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 5,
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Grid container sx={{ borderRadius: 5 }}>
            <Grid item xs={12}>
              <LoginContainer />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} md={8.5}>
        <Box
          sx={{
            alignItems: 'center',
            minHeight: isXs || isSm ? '30vh' : '90vh',
            color: 'primary.main',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 5,
            p: 2,
            bgcolor: 'background.paper',
          }}
        >
          <DoughnutChart />
        </Box>
      </Grid>
    </Grid>
  );
}
