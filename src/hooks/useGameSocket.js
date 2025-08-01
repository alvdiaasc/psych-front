import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SessionManager from '../utils/sessionManager.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://psych-back.onrender.com/';

export const useGameSocket = (setGameState) => {
  const [socket, setSocket] = useState(null);
  const setGameStateRef = useRef(setGameState);
  setGameStateRef.current = setGameState;

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.on('gameState', (state) => {
      // Asegurar que todos los arrays y objetos estén inicializados
      const safeState = {
        ...state,
        players: state.players || [],
        answers: state.answers || [],
        scores: state.scores || {},
        votes: state.votes || {},
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

    // Manejar expulsión de la sala
    socketInstance.on('kicked', (data) => {
      alert(data.message);
      // Limpiar solo la sala, no el perfil del usuario
      try {
        SessionManager?.clearRoomSession?.();
      } catch (error) {
        console.error('Error clearing room session:', error);
      }
      // Limpiar estado y volver al home
      setGameStateRef.current(prev => ({
        ...prev,
        phase: 'home',
        roomCode: null,
        players: [],
        answers: [],
        scores: {},
        punishments: [],
        availablePunishments: []
      }));
    });

    // Manejar confirmación de expulsión (para el host)
    socketInstance.on('playerKicked', (data) => {
      alert(data.message);
    });

    // Manejar salida exitosa de sala
    socketInstance.on('leftRoom', (data) => {
      console.log(data.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
