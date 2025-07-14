import React, { createContext, useState, useEffect } from 'react';
import { useGameSocket } from '../hooks/useGameSocket';

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
    maxRounds: 5
  });

  const socket = useGameSocket(setGameState);

  useEffect(() => {
    if (socket) {
      socket.on('phaseChange', ({ phase }) => {
        setGameState((prevState) => ({ ...prevState, phase }));
      });

      return () => {
        socket.off('phaseChange');
      };
    }
  }, [socket]);

  return (
    <GameContext.Provider value={{ gameState, socket }}>
      {children}
    </GameContext.Provider>
  );
};
