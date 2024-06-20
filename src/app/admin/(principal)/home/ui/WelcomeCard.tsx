import Image from 'next/image'
import { Card, CardContent, Button, Typography, Box } from '@mui/material'
import imgsvg from '/public/images/backgrounds/welcome-bg2-2x-svg.svg'
import { titleCase } from '@/utils'
import { useAuth } from '@/context/AuthProvider'

const WelcomeCard = () => {
  const { usuario } = useAuth()

  return (
    <Card
      elevation={1}
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: '-10px',
          width: '198px',
          height: '252px',
          top: '-8px',
        }}
      >
        <Image
          src={imgsvg}
          alt="welcome-img"
          style={{
            width: '100%',
            height: '250px',
            transform: 'unset',
          }}
        />
      </Box>

      <CardContent>
        <Typography
          sx={{
            marginTop: '8px',
            marginBottom: '0px',
            lineHeight: '35px',
            position: 'relative',
            zIndex: 9,
          }}
          variant="h5"
          gutterBottom
        >
          Hola {titleCase(usuario?.persona?.nombres ?? '')}, <br /> descarga el
          último reporte
        </Typography>
        <Button
          sx={{
            marginTop: '15px',
          }}
          variant="contained"
          color="primary"
        >
          Descargar
        </Button>
      </CardContent>
    </Card>
  )
}

export default WelcomeCard
