import React, { useContext } from 'react';
import { GameContext } from './context/GameContext';
import Home from './components/Home';
import Lobby from './components/Lobby';
import QuestionRound from './components/QuestionRound';
import VotingRound from './components/VotingRound';
import Leaderboard from './components/Leaderboard';

function App() {
  const { gameState } = useContext(GameContext);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {gameState.phase === 'home' && <Home />}
      {gameState.phase === 'lobby' && <Lobby />}
      {gameState.phase === 'question' && <QuestionRound />}
      {gameState.phase === 'voting' && <VotingRound />}
      {gameState.phase === 'leaderboard' && <Leaderboard />}
    </div>
  );
}

export default App;
