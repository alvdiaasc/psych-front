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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent via-primary to-secondary p-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-display-sm font-display text-white mb-4">
          ¡Hora de votar!
        </h2>
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-card inline-block"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xl font-game text-gray-800">
            {gameState.question.text}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-card"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ul className="space-y-4">
          {gameState.answers.map((answer) => (
            <motion.li key={answer.id} variants={item} className="group">
              <motion.button
                onClick={() => vote(answer.id)}
                className="w-full p-6 bg-background-light rounded-xl border-2 border-background hover:border-accent transition-all text-left flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl font-game text-gray-800 flex-1">
                  {answer.text}
                </span>
                <span className="ml-4 bg-accent text-white px-4 py-2 rounded-lg font-game opacity-0 group-hover:opacity-100 transition-opacity">
                  ¡Votar!
                </span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default VotingRound;
