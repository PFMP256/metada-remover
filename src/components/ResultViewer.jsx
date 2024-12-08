import { useMemo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const ResultViewer = ({ originalName, videoBlob, onReset }) => {
  const videoURL = useMemo(() => videoBlob ? URL.createObjectURL(videoBlob) : null, [videoBlob]);
  const cleanName = useMemo(() => `without_metadata_${originalName}`, [originalName]);

  return (
    <Box>
      <Paper elevation={3} sx={{ p:4, mb:4, textAlign:'center' }}>
        <Typography variant="h5" gutterBottom>
          Video sin metadatos
        </Typography>
        { videoURL && (
          <video src={videoURL} controls style={{ width:'100%', maxHeight:'400px' }} />
        )}
        
        { videoURL && (
          <Box mt={2}>
            <Button variant="contained" color="primary" href={videoURL} download={cleanName}>
              Descargar {cleanName}
            </Button>
          </Box>
        )}
      </Paper>
      <Box textAlign="right">
        <Button variant="outlined" onClick={onReset}>Procesar otro video</Button>
      </Box>
    </Box>
  );
};

export default ResultViewer;