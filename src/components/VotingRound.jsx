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
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2">Ronda {gameState.round + 1} de {gameState.totalRounds}</h2>
      {gameState.targetPlayer && (
        <p className="mb-2 text-gray-700 font-semibold">Pregunta para: <span className="text-blue-600">{gameState.targetPlayer.name}</span></p>
      )}
      <h3 className="text-lg font-bold mb-4">Vota la respuesta que creas correcta</h3>
      <p className="mb-4">{gameState.question.text}</p>
      <div className="space-y-2">
        {gameState.answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => vote(answer.id)}
            className="w-full p-2 border rounded hover:bg-gray-100"
          >
            {answer.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default VotingRound;
