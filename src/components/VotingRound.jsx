import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light via-accent-light to-secondary-light p-4 relative overflow-hidden"
    >
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-24 h-24 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 80 - 40, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: index * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-3xl space-y-8 relative z-10"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Temporizador */}
        <motion.div 
          className="flex justify-center mb-4"
          animate={{ scale: gameState.timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: gameState.timeLeft <= 10 ? Infinity : 0 }}
        >
          <div className={`px-6 py-2 rounded-full font-game text-2xl ${
            gameState.timeLeft <= 10 ? 'bg-primary text-white' : 'bg-white/90 text-gray-800'
          } shadow-lg`}>
            ⏱️ {gameState.timeLeft}s
          </div>
        </motion.div>

        {/* Pregunta */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-card">
          <motion.h2 
            className="text-display-sm font-display text-gray-800 text-center mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ¡Hora de votar!
          </motion.h2>
          <p className="text-xl font-game text-gray-600 text-center">
            {gameState.question.text}
          </p>
        </div>

        {/* Grid de respuestas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {gameState.answers.map((answer, i) => (
              <motion.button
                key={answer.id}
                onClick={() => vote(answer.id)}
                className={`group p-6 rounded-xl shadow-game transition-all transform ${
                  gameState.hasVoted 
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-white hover:shadow-game-hover hover:-translate-y-1'
                } relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.1 }}
                whileHover={!gameState.hasVoted ? { scale: 1.02 } : {}}
                whileTap={!gameState.hasVoted ? { scale: 0.98 } : {}}
              >
                <div className="relative z-10">
                  <p className="font-game text-lg text-gray-800 mb-2">
                    {answer.playerName}
                  </p>
                  <p className="text-gray-600">
                    {answer.text}
                  </p>
                </div>
                {!gameState.hasVoted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-light/20 to-primary-light/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {gameState.hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-white text-xl font-game tracking-wide">
              ¡Voto registrado! Esperando al resto de jugadores...
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default VotingRound;
