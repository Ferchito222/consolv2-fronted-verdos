// src/graphics/DoughnutChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartData } from 'chart.js/auto';
import { Box, Grid, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
  const data: ChartData<'doughnut'> = {
    labels: ['Uno', 'Dos', 'Tres', 'Cuatro'],
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2} sx={{ width: '100%', height: '100%' }}>
      <Grid item>
      <Typography variant="h4" align={'center'} sx={{ fontWeight: '600' }}>
            Grafica de Donut
          </Typography>
      </Grid>
      <Grid item sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Doughnut data={data} options={options} />
        </Box>
      </Grid>
      <Grid item>
      <Typography variant="h6" align={'center'} sx={{ fontWeight: '600' }}>
            Fuente de Datos - Consolidador SNIS
          </Typography>
      </Grid>
    </Grid>
  );
};

export default DoughnutChart;
