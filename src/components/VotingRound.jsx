import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function VotingRound() {
  const { gameState, socket } = useContext(GameContext);

  const vote = (answerId) => {
    socket.emit('vote', {
      roomCode: gameState.roomCode,
      answerId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 font-cabin-sketch">Vota por la mejor respuesta:</h2>
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <ul className="mb-4">
          {gameState.answers.map((answer) => (
            <li
              key={answer.id}
              className="flex items-center justify-between py-2 border-b border-gray-300"
            >
              <span className="text-lg font-medium">{answer.text}</span>
              <motion.button
                onClick={() => vote(answer.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Votar
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default VotingRound;
