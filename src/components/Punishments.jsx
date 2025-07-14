import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Punishments() {
  const { gameState } = useContext(GameContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">Castigos Finales</h2>
      <ul className="list-disc pl-5">
        {gameState.punishments.map((punishment, index) => (
          <li key={index} className="mb-2">
            <span className="text-blue-600 font-semibold">
              {gameState.players.find(player => player.id === punishment.playerId)?.name || 'Jugador desconocido'}:
            </span>{' '}
            {punishment.text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default Punishments;
