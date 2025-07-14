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
      // Asegurar que los arrays siempre existan
      const safeState = {
        ...state,
        players: state.players || [],
        answers: state.answers || [],
        scores: state.scores || {}
      };
      setGameStateRef.current(safeState);
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
