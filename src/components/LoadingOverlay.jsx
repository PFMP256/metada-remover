import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const LoadingOverlay = ({ open = false, message = "Procesando..." }) => {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>{message}</Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;