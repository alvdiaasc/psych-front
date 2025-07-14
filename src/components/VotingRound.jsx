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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-accent to-vibrantPurple text-white"
    >
      <h2 className="text-4xl font-bold mb-8 font-cabinSketch">Vota por la mejor respuesta:</h2>
      <div className="w-full max-w-lg bg-neutral text-black p-8 rounded-xl shadow-intense">
        <ul className="space-y-6">
          {gameState.answers.map((answer) => (
            <li
              key={answer.id}
              className="flex items-center justify-between py-4 px-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
            >
              <span className="text-lg font-medium text-dark">{answer.text}</span>
              <motion.button
                onClick={() => vote(answer.id)}
                className="bg-primary text-white py-2 px-6 rounded-lg shadow-vibrant hover:bg-red-400"
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
