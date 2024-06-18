import { Icono } from '@/components/Icono'
import { Card, CardContent, Typography, Avatar, Stack } from '@mui/material'

const VacunasSemana = () => (
  <Card
    sx={{
      backgroundColor: (theme) => theme.palette.secondary.main,
      color: 'white',
    }}
    elevation={1}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          Vacunas
        </Typography>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'white',
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <Icono color={'action'}>vaccines</Icono>
        </Avatar>
      </Stack>
      <Typography variant="h4" fontWeight="500" mt={5}>
        1.438,78
      </Typography>
      <Typography
        variant="h6"
        fontWeight="400"
        sx={{
          opacity: '0.6',
        }}
      >
        Vacunas Semana
      </Typography>
    </CardContent>
  </Card>
)

export default VacunasSemana
