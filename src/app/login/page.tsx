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
<<<<<<< HEAD

export default function LoginPage() {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
=======
import DoughnutChart from './../../components/graphics/DoughnutChart' // componente para las gráficasno
export default function LoginPage() {
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
>>>>>>> newJob

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
<<<<<<< HEAD

  return (
    <Grid container justifyContent="space-evenly" alignItems={'center'}>
      <Grid item xs={12} md={6}>
        <Box
          alignItems={'center'}
          minHeight={sm || xs ? '30vh' : '90dvh'}
          color={'primary'}
          display="flex"
          justifyContent="center"
        >
          <Grid
            container
            sx={{
              borderRadius: 4,
            }}
          >
            <Grid item xs={12} md={6}>
              <LoginContainer />
            </Grid>
            <Grid
              item
              xs={0}
              md={6}
              sx={{
                bgcolor: 'primary.main',
                p: 4,
                px: 6,
              }}
              display={{ xs: 'none', lg: 'block' }}
            >
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{ mb: 2, mt: 5 }}
              >
                <Image src={imgminsaludsvg} alt="PAI" height={100} />
              </Box>
              <Typography
                align={'center'}
                variant="h4"
                sx={{ fontWeight: '600', color: 'white', mt: 1 }}
              >
                RNVE v2.0
              </Typography>
              <Typography
                align={'left'}
                variant="h6"
                sx={{ fontWeight: '500', color: 'white', my: 4 }}
                display={'block'}
              >
                Registro Nominal de Vacunación Electrónica
              </Typography>

              <Typography
                align={'justify'}
                variant="body1"
                sx={{ color: 'white', mt: 1 }}
              >
                Este sistema ha sido diseñado para optimizar y simplificar el
                proceso de administración de vacunas en centros de salud,
                asegurando un seguimiento preciso y eficiente.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
=======
  
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
>>>>>>> newJob
}
