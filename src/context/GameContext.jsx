import React, { createContext, useState, useEffect } from 'react';
import { useGameSocket } from '../hooks/useGameSocket';
import { SessionManager } from '../utils/sessionManager';

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
    const session = SessionManager.getSession();
    if (session && socket) {
      setGameState(prev => ({ ...prev, isReconnecting: true }));
      
      // Intentar reconectar a la sala
      socket.emit('rejoinRoom', {
        roomCode: session.roomCode,
        playerId: session.playerId,
        playerName: session.playerName
      });
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
        SessionManager.clearSession();
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
  const joinRoom = (roomCode, playerName) => {
    const playerId = SessionManager.getOrCreatePlayerId();
    SessionManager.saveSession(playerId, playerName, roomCode);
    SessionManager.savePlayerName(playerName);
    
    if (socket) {
      socket.emit('joinRoom', { roomCode, playerId, playerName });
    }
  };

  const createRoom = (playerName) => {
    const playerId = SessionManager.getOrCreatePlayerId();
    SessionManager.savePlayerName(playerName);
    
    if (socket) {
      socket.emit('createRoom', { playerId, playerName });
    }
  };

  const leaveRoom = () => {
    SessionManager.clearSession();
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
    
    if (socket) {
      socket.emit('leaveRoom');
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      socket,
      joinRoom,
      createRoom,
      leaveRoom,
      getSavedPlayerName: SessionManager.getSavedPlayerName
    }}>
      {children}
    </GameContext.Provider>
  );
};
