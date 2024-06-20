import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'
import { Card, CardContent, Typography, Box, Fab, Stack } from '@mui/material'
import { Icono } from '@/components/Icono'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const VacunasMensual = () => {
  const theme = useTheme()
  const primary = theme.palette.primary.main

  const optionsmonthlychart: any = {
    grid: {
      show: true,
      borderColor: 'transparent',
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    colors: [primary],
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: '#adb0bb',
      fontFamily: 'inherit',
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: 'smooth',
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  }
  const seriesmonthlychart: any = [
    {
      name: 'Vacunas Mensual',
      data: [35, 60, 30, 55, 40],
    },
  ]
  return (
    <Card
      sx={{
        pb: 0,
        pl: 0,
        pr: 0,
      }}
      elevation={1}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary">
              Vac. Mensual
            </Typography>
            <Typography variant="h4">5.246</Typography>
          </Box>
          <Fab size="medium" aria-label="add" color="primary">
            <Icono sx={{ color: '#fff' }}>emergency</Icono>
          </Fab>
        </Stack>
      </CardContent>
      <Chart
        options={optionsmonthlychart}
        series={seriesmonthlychart}
        type="area"
        height={90}
        width={'100%'}
      />
    </Card>
  )
}

export default VacunasMensual
