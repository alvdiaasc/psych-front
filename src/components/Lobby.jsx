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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 font-cabin-sketch">Sala: {gameState.roomCode}</h2>
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Jugadores ({gameState.players.length}/8):</h3>
        <ul className="mb-4">
          {gameState.players.map((player) => (
            <li
              key={player.id}
              className="flex items-center gap-2 py-2 border-b border-gray-300"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <span className="text-lg font-medium">{player.name}</span>
            </li>
          ))}
        </ul>
        {gameState.players[0]?.id === socket.id && (
          <motion.button
            onClick={startGame}
            className="w-full bg-green-500 text-white py-3 rounded-lg shadow-lg hover:bg-green-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar Juego
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default Lobby;
