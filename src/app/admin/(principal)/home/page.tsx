'use client'
import Box from '@mui/material/Box'
import { Grid } from '@mui/material'
import WelcomeCard from './ui/WelcomeCard'
import VacunasSemana from './ui/VacunasSemana'
import ResumenComprobantes from './ui/ResumenComprobantes'
import VacunasMensual from './ui/VacunasMensual'
import LotesProximosExpirar from './ui/LotesProximosExpirar'

export default function HomePage() {
  return (
    <>
      <Box mt={0}>
        <Grid container spacing={3}>
          {/* ------------------------- row 1 ------------------------- */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <WelcomeCard />
              </Grid>
              <Grid item xs={12} lg={6} sm={6}>
                <VacunasSemana />
              </Grid>
              <Grid item xs={12} lg={6} sm={6}>
                <VacunasMensual />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <ResumenComprobantes />
          </Grid>
          {/* ------------------------- row 2 ------------------------- 
          <Grid item xs={12} lg={12}>
            <LotesProximosExpirar />
          </Grid>*/}
        </Grid>
      </Box>
    </>
  )
}
