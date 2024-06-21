import React from 'react';
import { Grid, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartData } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

const data: ChartData<'doughnut'> = {
  labels: ['Red', 'Blue', 'Yellow', 'Green'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
};

const MyComponent: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid container direction="column" alignItems="center" spacing={2} sx={{ width: '100%', height: '100%' }}>
      <Grid item>
        <Typography variant="h4" align="center" sx={{ fontWeight: 600 }}>
          Gráfica de Recepciones
        </Typography>
      </Grid>
      <Grid item sx={{ width: { xs: '90%', sm: '70%', md: '40%' }, height: { xs: '50%', sm: '60%', md: '50%' } }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Doughnut data={data} options={options} />
        </Box>
      </Grid>
      <Grid item>
        <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
          Sistema de Consolidación WEB
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MyComponent;