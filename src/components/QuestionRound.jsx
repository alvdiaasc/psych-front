import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function QuestionRound() {
  const { gameState, socket } = useContext(GameContext);
  const [answer, setAnswer] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Escuchar actualizaciones del temporizador
    socket.on('timerUpdate', ({ remainingTime }) => {
      setRemainingTime(remainingTime);
    });

    // Limpiar el temporizador al desmontar
    return () => {
      socket.off('timerUpdate');
    };
  }, [socket]);

  useEffect(() => {
    // Limpiar el input si la fase cambia (por ejemplo, a voting)
    if (gameState.phase !== 'question') {
      setAnswer('');
    }
  }, [gameState.phase]);

  useEffect(() => {
    if (remainingTime <= 10) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 500);
    }
  }, [remainingTime]);

  const submitAnswer = () => {
    if (answer.trim()) {
      socket.emit('submitAnswer', {
        roomCode: gameState.roomCode,
        answer,
      });
      setAnswer('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-light via-primary-light to-accent-light p-4 relative overflow-hidden"
    >
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-28 h-28 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 60 - 30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="mb-4"
              >
                <div className={`text-2xl font-game inline-block px-6 py-2 rounded-full ${
                  remainingTime <= 10 ? 'bg-primary text-white' : 'bg-white/90 text-gray-800'
                } shadow-lg`}>
                  ⏱️ {remainingTime} segundos
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h2 
            className="text-display-sm font-display text-white mb-6 drop-shadow-lg tracking-wide"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ¡Inventa una respuesta!
          </motion.h2>
        </div>

        <motion.div
          className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-card mb-8 transform transition-all duration-300 hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-xl font-game text-gray-800 text-center tracking-wide leading-relaxed">
            {gameState.question.text}
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div className="w-full relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta más ingeniosa..."
              className="w-full p-4 rounded-xl border-2 border-primary-light bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary-light/50 transition-all text-lg font-sans placeholder-gray-400 resize-none"
              maxLength={100}
              rows={3}
            />
            <motion.p 
              className={`text-right mt-2 font-game tracking-wide ${
                answer.length > 80 ? 'text-primary' : 'text-white/80'
              }`}
              animate={{ scale: answer.length > 80 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {answer.length}/100
            </motion.p>
          </motion.div>

          <motion.button
            onClick={submitAnswer}
            disabled={!answer.trim()}
            className="group w-full bg-gradient-to-br from-accent to-accent-dark disabled:from-gray-400 disabled:to-gray-500 text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all relative overflow-hidden"
            whileHover={{ scale: answer.trim() ? 1.02 : 1 }}
            whileTap={{ scale: answer.trim() ? 0.98 : 1 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="tracking-wide">¡Enviar Respuesta!</span>
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuestionRound;
