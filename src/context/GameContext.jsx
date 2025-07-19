import React, { createContext, useState, useEffect } from 'react';
import { useGameSocket } from '../hooks/useGameSocket';
import SessionManager from '../utils/sessionManager';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    phase: 'home',
    roomCode: null,
    players: [],
    question: null,
    answers: [],
    scores: {},
    punishments: [],
    availablePunishments: [],
    winnerId: null,
    currentRound: 0,
    maxRounds: 5,
    isReconnecting: false,
    connectionStatus: 'disconnected'
  });

  const socket = useGameSocket(setGameState);

  // Intentar reconectar automáticamente al cargar
  useEffect(() => {
    try {
      const session = SessionManager?.getSession?.();
      if (session && socket) {
        setGameState(prev => ({ ...prev, isReconnecting: true }));
        
        // Intentar reconectar a la sala
        socket.emit('rejoinRoom', {
          roomCode: session.roomCode,
          playerId: session.playerId,
          playerName: session.playerName,
          playerAvatar: session.playerAvatar
        });
    }
    } catch (error) {
      console.error('Error during reconnection attempt:', error);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('phaseChange', ({ phase }) => {
        setGameState((prevState) => ({ ...prevState, phase }));
      });

      socket.on('reconnected', (gameState) => {
        setGameState(prev => ({ 
          ...gameState, 
          isReconnecting: false,
          connectionStatus: 'connected'
        }));
      });

      socket.on('reconnectFailed', (error) => {
        try {
          SessionManager?.clearRoomSession?.();
        } catch (err) {
          console.error('Error clearing room session:', err);
        }
        setGameState(prev => ({ 
          ...prev, 
          isReconnecting: false,
          phase: 'home',
          connectionStatus: 'disconnected'
        }));
        console.warn('Reconexión fallida:', error);
      });

      socket.on('connect', () => {
        setGameState(prev => ({ ...prev, connectionStatus: 'connected' }));
      });

      socket.on('disconnect', () => {
        setGameState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
      });

      return () => {
        socket.off('phaseChange');
        socket.off('reconnected');
        socket.off('reconnectFailed');
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  // Funciones de utilidad para el contexto
  const joinRoom = (roomCode, playerName, playerAvatar = null) => {
    try {
      const playerId = SessionManager?.getOrCreatePlayerId?.() || `player_${Date.now()}`;
      SessionManager?.saveSession?.(playerId, playerName, roomCode, playerAvatar);
      SessionManager?.savePlayerName?.(playerName);
      if (playerAvatar) {
        SessionManager?.savePlayerAvatar?.(playerAvatar);
      }
    
      if (socket) {
        socket.emit('joinRoom', { roomCode, playerId, playerName, playerAvatar });
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (socket) {
        socket.emit('joinRoom', { roomCode, playerId: `player_${Date.now()}`, playerName, playerAvatar });
      }
    }
  };

  const createRoom = (playerName, playerAvatar = null) => {
    try {
      const playerId = SessionManager?.getOrCreatePlayerId?.() || `player_${Date.now()}`;
      SessionManager?.savePlayerName?.(playerName);
      if (playerAvatar) {
        SessionManager?.savePlayerAvatar?.(playerAvatar);
      }
      
      if (socket) {
        socket.emit('createRoom', { playerId, playerName, playerAvatar });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      if (socket) {
        socket.emit('createRoom', { playerId: `player_${Date.now()}`, playerName, playerAvatar });
      }
    }
  };

  const leaveRoom = () => {
    try {
      // Solo limpiar la sesión de sala, no el perfil del usuario
      SessionManager?.clearRoomSession?.();
    } catch (error) {
      console.error('Error clearing room session:', error);
    }
    
    // Primero actualizar el estado local para ir al home inmediatamente
    setGameState(prev => ({ 
      ...prev, 
      phase: 'home',
      roomCode: null,
      players: [],
      answers: [],
      scores: {},
      punishments: [],
      availablePunishments: []
    }));
    
    // Después notificar al servidor
    if (socket && gameState.roomCode) {
      socket.emit('leaveRoom', { roomCode: gameState.roomCode });
    }
  };

  const kickPlayer = (targetPlayerId) => {
    if (socket && gameState.roomCode) {
      socket.emit('kickPlayer', { 
        roomCode: gameState.roomCode, 
        targetPlayerId 
      });
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      socket,
      joinRoom,
      createRoom,
      leaveRoom,
      kickPlayer
    }}>
      {children}
    </GameContext.Provider>
  );
};
