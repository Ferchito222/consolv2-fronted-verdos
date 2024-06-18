'use client'
import Box from '@mui/material/Box'
import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { SideBarProvider, useSidebar } from '@/context/SideBarProvider'
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import { NavbarUser } from '@/components/navbars/NavbarUser'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { imprimir } from '@/utils/imprimir'

const Contenido = ({ children }: { children: ReactNode }) => {
  const { sideMenuOpen } = useSidebar()

  const { inicializarUsuario, estaAutenticado, progresoLogin } = useAuth()

  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const md = useMediaQuery(theme.breakpoints.only('md'))

  useEffect(
    () => {
      if (progresoLogin) return

      if (!estaAutenticado)
        inicializarUsuario()
          .then(() => {})
          .catch(imprimir)
          .finally(() => {
            imprimir('Verificación de login finalizada 👨‍💻')
          })
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [progresoLogin]
  )

  return (
    <>
      {estaAutenticado && <Sidebar />}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        justifyItems={'center'}
      >
        <Box sx={{ display: 'flex' }}>
          <NavbarUser />
        </Box>
        <Box
          component="main"
          sx={{
            width: sm || xs || md ? '100%' : sideMenuOpen ? '85%' : '100%',
            // backgroundColor: 'primary.main',
            display: 'flex',
            flexDirection: 'column',
            ml: sm || xs || md ? '0%' : sideMenuOpen ? '250px' : '0%',
            mt: '65px',
            pt: '25px',
            transition: 'all 0.2s ease-out !important',
          }}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="initial"
            justifyItems={'center'}
            style={{ minHeight: '80vh' }}
          >
            <div
              style={{
                height: '75vh',
                width: xs || sm ? '90%' : '95%',
              }}
            >
              {estaAutenticado && children}
            </div>
          </Grid>
        </Box>
      </Grid>
    </>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SideBarProvider>
      <Contenido>{children}</Contenido>
    </SideBarProvider>
  )
}
