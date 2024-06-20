import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from '@mui/material'
import DashboardCard from '@/components/shared/DashboardCard'

const lotes = [
  {
    nombre: 'Pentavalente',
    tipo: 'Vacuna',
    fechaCaducidad: '30/06/2024',
    prioridad: 'Alta',
    lote: '22010522-A',
  },
]

const LotesProximosExpirar = () => (
  <DashboardCard title="Lotes Próximos a Expirar">
    <Box mt={-1} overflow="auto">
      <Table
        aria-label="simple table"
        sx={{
          whiteSpace: 'nowrap',
          pt: 5,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Nombre</Typography>
            </TableCell>
            <TableCell>
              <Typography align="center" variant="h6">
                Fecha de Caducidad
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h6">Prioridad</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="h6">Lote</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lotes.map((lote) => (
            <TableRow key={lote.nombre}>
              <TableCell>
                <Stack direction="row" gap={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {lote.nombre}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="400"
                    >
                      {lote.tipo}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Typography color="textSecondary" variant="h6">
                  {lote.fechaCaducidad}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  sx={{
                    backgroundColor:
                      lote.prioridad === 'Baja'
                        ? (theme) => theme.palette.primary.main
                        : lote.prioridad === 'Media'
                          ? (theme) => theme.palette.secondary.main
                          : lote.prioridad === 'Alta'
                            ? (theme) => theme.palette.warning.main
                            : lote.prioridad === 'Moderada'
                              ? (theme) => theme.palette.success.main
                              : lote.prioridad === 'Crítica'
                                ? (theme) => theme.palette.error.main
                                : (theme) => theme.palette.secondary.main,
                    color: '#fff',
                    borderRadius: '6px',
                  }}
                  size="small"
                  label={lote.prioridad}
                />
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">{lote.lote}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </DashboardCard>
)

export default LotesProximosExpirar
