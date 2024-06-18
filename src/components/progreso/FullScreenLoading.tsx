import { Box, CircularProgress, Typography } from '@mui/material'
import { FC } from 'react'

interface Props {
  mensaje?: string | undefined | null
}

export const FullScreenLoading: FC<Props> = ({ mensaje }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {mensaje ? (
        <Typography variant={'subtitle2'}>{mensaje}</Typography>
      ) : null}
      <Box width={'10px'} />
      <CircularProgress disableShrink />
    </Box>
  )
}
