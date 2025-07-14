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
      <h2 className="text-4xl font-bold mb-8 font-cabin-sketch text-center">Elige un castigo:</h2>
      <div className="w-full max-w-lg bg-white text-black p-8 rounded-lg shadow-xl">
        <ul className="space-y-6">
          {gameState.punishments.map((punishment) => (
            <motion.li
              key={punishment.id}
              className="flex items-center justify-between py-4 px-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-lg font-semibold text-purple-700">
                {gameState.players.find(player => player.id === punishment.playerId)?.name || 'Jugador desconocido'}:
              </span>
              <motion.button
                onClick={() => selectPunishment(punishment.id)}
                className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default Punishments;
