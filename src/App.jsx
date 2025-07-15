import React, { useContext } from 'react';
import { GameContext } from './context/GameContext';
import Home from './components/Home';
import Lobby from './components/Lobby';
import QuestionRound from './components/QuestionRound';
import VotingRound from './components/VotingRound';
import Leaderboard from './components/Leaderboard';
import Punishments from './components/Punishments';
import WinnerSelection from './components/WinnerSelection';

function App() {
  const { gameState } = useContext(GameContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {gameState.phase === 'home' && <Home />}
      {gameState.phase === 'lobby' && <Lobby />}
      {gameState.phase === 'question' && <QuestionRound />}
      {gameState.phase === 'voting' && <VotingRound />}
      {gameState.phase === 'leaderboard' && <Leaderboard />}
      {gameState.phase === 'winnerSelection' && <WinnerSelection />}
      {gameState.phase === 'punishments' && <Punishments />}
    </div>
  );
}

export default App;
