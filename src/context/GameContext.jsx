import React, { createContext, useState } from 'react';
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
  });

  const socket = useGameSocket(setGameState);

  return (
    <GameContext.Provider value={{ gameState, socket }}>
      {children}
    </GameContext.Provider>
  );
};
