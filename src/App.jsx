// src/App.jsx
import { useState } from 'react';
import { Box, Typography, Container, Stepper, Step, StepLabel } from '@mui/material';
import FileSelector from './components/FileSelector';
import MetadataViewer from './components/MetadataViewer';
import ResultViewer from './components/ResultViewer';
import LoadingOverlay from './components/LoadingOverlay';
import { useFFmpeg } from './hooks/useFFmpeg';

const steps = ['Seleccionar Archivo', 'Ver Metadatos', 'Video sin Metadatos'];

function App() {
  const { isReady, isLoading, error, extractMetadata, removeMetadata } = useFFmpeg();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [outputData, setOutputData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileSelected = async (f) => {
    setFile(f);
    setActiveStep(1);
    setErrorMsg(null);

    try {
      setProcessing(true);
      const meta = await extractMetadata(f);
      setMetadata(meta);
    } catch (err) {
      console.error('Error al extraer metadatos:', err);
      setErrorMsg("No se pudieron extraer los metadatos.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMetadata = async () => {
    setErrorMsg(null);
    try {
      setProcessing(true);
      const resultBlob = await removeMetadata();
      setOutputData(resultBlob);
      setActiveStep(2);
    } catch (err) {
      console.error('Error al eliminar metadatos:', err);
      setErrorMsg("Error al eliminar metadatos.");
    } finally {
      setProcessing(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      // Volver a selección de archivo
      setFile(null);
      setMetadata(null);
      setActiveStep(0);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile(null);
    setMetadata(null);
    setOutputData(null);
    setErrorMsg(null);
  };

  const currentScreen = () => {
    if (activeStep === 0) {
      return <FileSelector onFileSelected={handleFileSelected} />;
    } else if (activeStep === 1) {
      return (
        <MetadataViewer
          metadata={metadata}
          onNext={handleRemoveMetadata}
          onBack={handleBack}
          loading={processing}
        />
      );
    } else if (activeStep === 2) {
      return (
        <ResultViewer
          originalName={file ? file.name : 'video.mp4'}
          videoBlob={outputData}
          onReset={handleReset}
        />
      );
    }
    return null;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb:4 }}>
      <Typography variant="h4" gutterBottom>
        Eliminador de Metadatos de Video (Frontend)
      </Typography>
      <Box mb={4}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {!isReady && !error && (
        <Typography variant="body1" sx={{ mb:2 }}>
          Cargando entorno de FFmpeg, por favor espera...
        </Typography>
      )}

      {error && (
        <Typography variant="body1" color="error" sx={{ mb:2 }}>
          Ocurrió un error inicializando FFmpeg. Revisa la consola.
        </Typography>
      )}

      {errorMsg && (
        <Typography variant="body1" color="error" sx={{ mb:2 }}>
          {errorMsg}
        </Typography>
      )}

      {isReady && currentScreen()}

      <LoadingOverlay open={processing || isLoading} message={isLoading ? "Cargando FFmpeg..." : "Procesando..."} />
    </Container>
  );
}

export default App;
