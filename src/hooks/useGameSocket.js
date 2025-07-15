import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://psych-back.onrender.com/';

export const useGameSocket = (setGameState) => {
  const [socket, setSocket] = useState(null);
  const setGameStateRef = useRef(setGameState);
  setGameStateRef.current = setGameState;

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on('gameState', (state) => {
      // Asegurar que todos los arrays estén inicializados
      const safeState = {
        ...state,
        players: state.players || [],
        answers: state.answers || [],
        scores: state.scores || {},
        punishments: state.punishments || [],
        availablePunishments: state.availablePunishments || []
      };
      setGameStateRef.current(safeState);
    });

    socketInstance.on('phaseChange', (data) => {
      setGameStateRef.current(prev => ({ ...prev, phase: data.phase }));
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
      alert(error.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
