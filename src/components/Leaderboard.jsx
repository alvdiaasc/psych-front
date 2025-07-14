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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 font-cabin-sketch">Tabla de Puntuación</h2>
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <ul className="space-y-4">
          {Object.entries(gameState.scores)
            .sort(([, a], [, b]) => b - a)
            .map(([playerId, score], index) => (
              <li
                key={playerId}
                className="flex items-center justify-between py-2 border-b border-gray-300"
              >
                <span className="text-lg font-medium">{index + 1}. {gameState.players.find(p => p.id === playerId)?.name}</span>
                <span className="text-lg font-bold text-green-500">{score} pts</span>
              </li>
            ))}
        </ul>
        {/* Botón animado de volver al inicio */}
        <motion.button
          onClick={playAgain}
          className="w-full bg-yellow-500 text-black py-3 rounded-lg shadow-lg hover:bg-yellow-400 mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver a Jugar
        </motion.button>
      </div>
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
