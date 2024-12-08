import { useState } from 'react';
import { Button, Typography, Paper } from '@mui/material';

const FileSelector = ({ onFileSelected }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video')) {
      onFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video')) {
      onFileSelected(file);
    }
  };

  return (
    <Paper 
      elevation={3}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p:4,
        textAlign:'center',
        border: dragging ? '2px dashed #90caf9' : '2px dashed grey',
        transition:'border 0.3s ease-in-out'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Arrastra y suelta tu video aquí
      </Typography>
      <Typography variant="body2" gutterBottom>
        o
      </Typography>
      <Button variant="contained" component="label">
        Seleccionar Archivo
        <input 
          type="file" 
          hidden 
          onChange={handleFileChange} 
          accept="video/*" 
        />
      </Button>
      <Typography variant="caption" display="block" sx={{mt:1}}>
        Solo se permiten archivos de video
      </Typography>
    </Paper>
  );
};

export default FileSelector;
