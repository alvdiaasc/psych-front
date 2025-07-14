import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Leaderboard() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  // Mostrar botón "Siguiente ronda" si no es la última ronda
  const isLastRound = gameState.round + 1 >= gameState.totalRounds;
  const handleReady = () => {
    socket.emit('playerReady', { roomCode: gameState.roomCode });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">Player</th>
            <th className="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gameState.scores)
            .sort(([, a], [, b]) => b - a)
            .map(([playerId, score]) => (
              <tr key={playerId} className={playerId === socket.id ? 'font-bold text-blue-600' : ''}>
                <td>{gameState.players.find(p => p.id === playerId)?.name}</td>
                <td className="text-right">{score}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Mostrar botón siguiente ronda si no es la última ronda */}
      {!isLastRound && (
        <button
          onClick={handleReady}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-2"
          disabled={gameState.ready && gameState.ready.includes(socket.id)}
        >
          Siguiente ronda
        </button>
      )}
      {/* Mostrar botón play again solo al host si es la última ronda */}
      {isLastRound && gameState.players[0]?.id === socket.id && (
        <button
          onClick={playAgain}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Play Again
        </button>
      )}
      {/* Mostrar cuántos están listos */}
      {gameState.ready && !isLastRound && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Listos: {gameState.ready.length || 0} / {gameState.players.length}
        </div>
      )}
      {/* Mostrar tabla de votos */}
      {gameState.votes && Object.keys(gameState.votes).length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Votos de la ronda</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Jugador</th>
                <th className="text-left">Votó por</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gameState.votes).map(([voterId, answerId]) => {
                const voter = gameState.players.find(p => p.id === voterId);
                const answer = gameState.answers.find(a => a.id === answerId);
                const votedPlayer = answer ? gameState.players.find(p => p.id === answer.playerId) : null;
                return (
                  <tr key={voterId}>
                    <td>{voter ? voter.name : voterId}</td>
                    <td>{votedPlayer ? votedPlayer.name : (answer ? answer.text : '—')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default Leaderboard;
