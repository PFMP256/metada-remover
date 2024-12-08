// src/hooks/useFFmpeg.js
import { useState, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFFmpeg = useCallback(async () => {
    try {
      // BaseURL para la versión esm (recomendado para Vite)
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      const ff = new FFmpeg();

      // Opcionalmente puedes setear logs:
      ff.on('log', ({ message }) => {
        console.log('[ffmpeg log]', message);
      });

      await ff.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        // Si necesitaras versión multithread, añadir workerURL también.
      });

      setFfmpeg(ff);
      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error cargando FFmpeg:', err);
      setError(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  const extractMetadata = useCallback(async (file) => {
    if (!ffmpeg) return null;
    try {
      await ffmpeg.writeFile('input_video', await fetchFile(file));
      await ffmpeg.exec(['-i', 'input_video', '-f', 'ffmetadata', 'metadata.txt']);
      const data = await ffmpeg.readFile('metadata.txt');
      return new TextDecoder().decode(data);
    } catch (err) {
      console.error('Error extrayendo metadatos:', err);
      throw err;
    }
  }, [ffmpeg]);

  const removeMetadata = useCallback(async () => {
    if (!ffmpeg) return null;
    try {
      await ffmpeg.exec([
        '-i', 'input_video',
        '-map_metadata', '-1',
        '-map_chapters', '-1',
        '-metadata', 'title=',
        '-metadata', 'artist=',
        '-metadata', 'album=',
        '-metadata', 'comment=',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast',
        '-c:a', 'aac', '-b:a', '128k',
        'output_video.mp4'
      ]);
  
      const output = await ffmpeg.readFile('output_video.mp4');
      return new Blob([output.buffer], { type: 'video/mp4' });
    } catch (err) {
      console.error('Error removiendo metadatos:', err);
      throw err;
    }
  }, [ffmpeg]);
  

  return { ffmpeg, isReady, isLoading, error, extractMetadata, removeMetadata };
}