import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useGameSocket = (setGameState) => {
  const [socket, setSocket] = useState(null);
  const setGameStateRef = useRef(setGameState);
  setGameStateRef.current = setGameState;

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on('gameState', (state) => {
      setGameStateRef.current(state);
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
