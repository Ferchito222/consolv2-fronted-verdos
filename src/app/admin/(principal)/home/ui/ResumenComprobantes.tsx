import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { useTheme } from '@mui/material/styles'
import { Stack, Typography, Box } from '@mui/material'
import DashboardCard from '@/components/shared/DashboardCard'
import { Icono } from '@/components/Icono'

const ResumenComprobantes = () => {
  // chart color
  const theme = useTheme()
  const primary = theme.palette.primary.main
  const secondary = theme.palette.secondary.main
  const primarylight = theme.palette.primary.light
  const textColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547'

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",

      toolbar: {
        show: false,
      },
      height: 275,
    },
    labels: ['Realizadas', 'Recibidas', 'Pendientes'],
    colors: [primary, primarylight, secondary],
    plotOptions: {
      pie: {
        donut: {
          size: '89%',
          background: 'transparent',

          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 7,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: textColor,
              fontSize: '20px',
              fontWeight: '600',
              label: '500.458',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  }
  const seriescolumnchart = [55, 55, 55]

  return (
    <>
      <DashboardCard title="Resumen Comprobantes" subtitle="Cada Mes">
        <>
          <Box mt={3} height="255px">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="donut"
              height="200px"
              width={'100%'}
            />
          </Box>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            mt={7}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="primary.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icono sx={{ color: 'white' }}>check_circle</Icono>
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  23.450
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Realizadas
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icono sx={{ color: 'white' }}>download</Icono>
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  23.450
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Recibidas
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="secondary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="secondary.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icono sx={{ color: 'white' }}>pending</Icono>
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  23.450
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Pendientes
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </>
      </DashboardCard>
    </>
  )
}

export default ResumenComprobantes
