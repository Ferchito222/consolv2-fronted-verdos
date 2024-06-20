import { FormInputText } from '@/components/form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Constantes } from '@/config/Constantes'
import { useAlerts } from '@/hooks'
import { Servicios } from '@/services'
import { delay, imprimir, InterpreteMensajes } from '@/utils'
import {
  Box,
  Button,
  DialogContent,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  seleccionarPersona: (p: any) => any
}

interface BuscarPersona {
  documento: string
  complemento: string
}

export const VistaModalBuscarPersona = ({ seleccionarPersona }: Props) => {
  const onSelectPerson = (persona: any) => {
    seleccionarPersona(persona)
    setListaPersonas([])
  }
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const [listaPersonas, setListaPersonas] = useState<any>([])

  const { Alerta } = useAlerts()

  const obtenerBuscarPersona = async (buscar: BuscarPersona) => {
    try {
      setListaPersonas([])
      await delay(1000)
      setLoadingModal(true)
      const { documento, complemento } = buscar
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl01}/personas/busqueda/carnet-identidad?nroDocumento=${documento}&complemento=${complemento}`,
      })
      setListaPersonas(respuesta.datos)
    } catch (e) {
      imprimir(`Error al obtener niveles de acceso: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      reset()
      setLoadingModal(false)
    }
  }

  const { handleSubmit, control, reset } = useForm<BuscarPersona>({
    defaultValues: {
      documento: '',
      complemento: '',
    },
  })

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(obtenerBuscarPersona)}>
        <Grid container direction={'row'} spacing={1}>
          <Grid item md={9} xs={8} sm={8}>
            <FormInputText
              id={'documento'}
              control={control}
              name="documento"
              label="Documento de Identidad"
              rules={{
                required: 'Este campo es requerido',
              }}
            />
          </Grid>
          <Grid item md={3} xs={4} sm={4}>
            <FormInputText
              id={'complemento'}
              control={control}
              name="complemento"
              label="complemento"
            />
          </Grid>
          <Grid item md={12} xs={12} sm={12}>
            <Button type={'submit'} variant={'outlined'} fullWidth>
              Buscar
            </Button>
          </Grid>
        </Grid>
        <Box height={'20px'} />
        <ProgresoLineal mostrar={loadingModal} />
      </form>
      <Grid item md={12}>
        <List dense>
          {listaPersonas.map((persona: any) => (
            <ListItem
              key={persona.id}
              button
              onClick={() => onSelectPerson(persona)}
            >
              <ListItemText
                primary={`Nombres: ${persona.nombres} ${persona.primerApellido} ${persona.segundoApellido}`}
                secondary={`Documento: ${persona.nroDocumento} ${persona.complemento}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
    </DialogContent>
  )
}
