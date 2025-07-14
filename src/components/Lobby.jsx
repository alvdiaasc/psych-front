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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-vibrantPurple to-accent text-white"
    >
      <h2 className="text-4xl font-bold mb-8 font-cabinSketch">Sala: {gameState.roomCode}</h2>
      <div className="w-full max-w-lg bg-neutral text-black p-8 rounded-xl shadow-intense">
        <h3 className="text-2xl font-bold mb-6">Jugadores ({gameState.players.length}/8):</h3>
        <ul className="space-y-4">
          {gameState.players.map((player) => (
            <li
              key={player.id}
              className="flex items-center gap-4 py-4 px-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <span className="text-lg font-medium text-dark">{player.name}</span>
            </li>
          ))}
        </ul>
        {gameState.players[0]?.id === socket.id && (
          <motion.button
            onClick={startGame}
            className="w-full bg-vibrantGreen text-white py-4 rounded-xl shadow-vibrant hover:bg-green-400"
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
