import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function WinnerSelection() {
  const { gameState, socket } = useContext(GameContext);
  const [selectedPunishments, setSelectedPunishments] = useState([]);

  const togglePunishment = (punishment) => {
    setSelectedPunishments((prev) => {
      if (prev.includes(punishment)) {
        return prev.filter((p) => p !== punishment);
      } else {
        return [...prev, punishment];
      }
    });
  };

  const submitPunishments = () => {
    socket.emit('selectPunishments', {
      roomCode: gameState.roomCode,
      winnerId: gameState.winnerId,
      selectedPunishments,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">Selecciona los castigos</h2>
      <ul className="list-disc pl-5">
        {gameState.availablePunishments.map((punishment, index) => (
          <li key={index} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedPunishments.includes(punishment)}
                onChange={() => togglePunishment(punishment)}
                className="mr-2"
              />
              {punishment.text}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={submitPunishments}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
      >
        Enviar castigos
      </button>
    </motion.div>
  );
}

export default WinnerSelection;
