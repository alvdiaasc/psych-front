import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Lobby() {
  const { gameState, socket } = useContext(GameContext);

  const startGame = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Room: {gameState.roomCode}</h2>
      <h3 className="text-xl mb-4">Players ({gameState.players.length}/8):</h3>
      <ul className="mb-4">
        {gameState.players.map((player) => (
          <li key={player.id} className="py-1">{player.name}</li>
        ))}
      </ul>
      {gameState.players[0]?.id === socket.id && (
        <button
          onClick={startGame}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Start Game
        </button>
      )}
    </motion.div>
  );
}

export default Lobby;
