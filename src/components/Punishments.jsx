import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Punishments() {
  const { gameState } = useContext(GameContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 font-cabin-sketch">Elige un castigo:</h2>
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <ul className="mb-4">
          {gameState.punishments.map((punishment) => (
            <li
              key={punishment.id}
              className="flex items-center justify-between py-2 border-b border-gray-300"
            >
              <span className="text-lg font-medium">
                {gameState.players.find(player => player.id === punishment.playerId)?.name || 'Jugador desconocido'}:
              </span>
              <motion.button
                onClick={() => selectPunishment(punishment.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default Punishments;
