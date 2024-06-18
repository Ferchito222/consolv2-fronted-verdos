import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 3, display: value === index ? 'block' : 'none' }}>
        {children}
      </Box>
    </div>
  )
}
