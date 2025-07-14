import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function QuestionRound() {
  const { gameState, socket } = useContext(GameContext);
  const [answer, setAnswer] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-light via-primary-light to-accent-light p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: remainingTime <= 10 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: remainingTime <= 10 ? Infinity : 0, duration: 0.5 }}
            className="text-2xl font-game text-white mb-4"
          >
            ⏱️ {remainingTime} segundos
          </motion.div>
          <h2 className="text-display-sm font-display text-white mb-6">
            ¡Inventa una respuesta!
          </h2>
        </div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-card mb-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-xl font-game text-gray-800 text-center">
            {gameState.question.text}
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="w-full"
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta más ingeniosa..."
              className="w-full p-4 rounded-xl border-2 border-primary-light focus:border-primary focus:ring-2 focus:ring-primary-light transition-all text-lg font-game"
              maxLength={100}
            />
            <p className="text-right mt-2 text-white/80 font-game">
              {answer.length}/100
            </p>
          </motion.div>

          <motion.button
            onClick={submitAnswer}
            disabled={!answer.trim()}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all"
            whileHover={{ scale: answer.trim() ? 1.02 : 1 }}
            whileTap={{ scale: answer.trim() ? 0.98 : 1 }}
          >
            🚀 ¡Enviar Respuesta!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuestionRound;
