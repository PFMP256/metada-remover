import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const MetadataViewer = ({ metadata, onNext, onBack, loading }) => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb:4 }}>
        <Typography variant="h5" gutterBottom>
          Metadatos del video
        </Typography>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', maxHeight:'300px', overflow:'auto' }}>
          {metadata || 'No se encontraron metadatos o no se pudieron extraer.'}
        </Typography>
      </Paper>
      
      <Box sx={{ display:'flex', justifyContent:'space-between' }}>
        <Button variant="outlined" onClick={onBack} disabled={loading}>Regresar</Button>
        <Button variant="contained" color="primary" onClick={onNext} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar Metadatos'}
        </Button>
      </Box>
    </Box>
  );
};

export default MetadataViewer;
