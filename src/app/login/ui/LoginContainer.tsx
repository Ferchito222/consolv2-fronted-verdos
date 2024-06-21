import { Box, Button, Card } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { LoginType } from '../types/loginTypes'
import { FormInputText } from 'src/components/form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { delay } from '@/utils'
import Image from 'next/image'
<<<<<<< HEAD
import imgpaipng from '/public/logo/rnve.png'
=======
import imgpaipng from '/public/logo/snis-login.png'
>>>>>>> newJob

const LoginContainer = () => {
  const router = useRouter()

  const { ingresar, progresoLogin } = useAuth()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const { handleSubmit, control } = useForm<LoginType>({
    defaultValues: {
      usuario: '',
      contrasena: '',
    },
  })

  const iniciarSesion = async ({ usuario, contrasena }: LoginType) => {
    await ingresar({ usuario, contrasena })
  }

  return (
    <Card
      sx={{
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        py: 5,
<<<<<<< HEAD

=======
>>>>>>> newJob
        px: 3,
      }}
      elevation={0}
    >
      <form onSubmit={handleSubmit(iniciarSesion)}>
        <Box
          display={'grid'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ borderRadius: 12 }}
        >
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ mb: 2 }}
          >
            <Image src={imgpaipng} alt="PAI" height={100} />
          </Box>

          <Typography align={'center'} sx={{ fontWeight: '600' }}>
            Ingresar al Sistema
          </Typography>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography
              fontSize={14}
              variant={'body1'}
              color={'text.secondary'}
            >
              Ingresa tus credenciales para iniciar sesión
            </Typography>
          </Box>
          <FormInputText
            id={'usuario'}
            control={control}
            name="usuario"
            label="Usuario"
            size={'small'}
            labelVariant={'body2'}
            disabled={progresoLogin}
            rules={{ required: 'Este campo es requerido' }}
          />
          <Box sx={{ mt: 1, mb: 1 }}></Box>
          <FormInputText
            id={'contrasena'}
            control={control}
            name="contrasena"
            label="Contraseña"
            size={'small'}
            labelVariant={'body2'}
            type={'password'}
            disabled={progresoLogin}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres',
              },
            }}
          />
          <Box sx={{ mt: 0.5, mb: 0.5 }}>
            <ProgresoLineal mostrar={progresoLogin} />
          </Box>
          <Box display="flex" flex="1" justifyContent="start">
            <Button
              onClick={async () => {
                mostrarFullScreen()
                await delay(500)
                router.push('/recuperacion')
                ocultarFullScreen()
              }}
              size={'large'}
              variant={'text'}
              disabled={progresoLogin}
              color={'primary'}
            >
              <Typography fontSize={'small'} sx={{ fontWeight: '600' }}>
                ¿Olvidaste tu contraseña?
              </Typography>
            </Button>
          </Box>
          <Box sx={{ height: 15 }}></Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size={'large'}
            disabled={progresoLogin}
          >
            <Typography sx={{ fontWeight: '500' }}>Iniciar sesión</Typography>
          </Button>
          <Box sx={{ height: 50 }}></Box>
        </Box>
      </form>
    </Card>
  )
}

export default LoginContainer
