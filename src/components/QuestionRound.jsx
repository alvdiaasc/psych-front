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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-vibrantGreen text-white"
    >
      <h2 className="text-4xl font-bold mb-8 font-cabinSketch">Pregunta:</h2>
      <p className="text-xl mb-8 bg-neutral text-black p-6 rounded-xl shadow-intense">{gameState.question.text}</p>
      <div className="w-full max-w-lg">
        {/* Mostrar el temporizador */}
        {remainingTime !== null && (
          <p className="text-red-500 font-bold mb-4">Tiempo restante: {remainingTime} segundos</p>
        )}

        <motion.input
          type="text"
          placeholder="Tu respuesta..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-4 rounded-xl border border-neutral text-black focus:ring-2 focus:ring-primary mb-4"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button
          onClick={submitAnswer}
          className="w-full bg-primary text-white py-4 rounded-xl shadow-vibrant hover:bg-red-400 transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Enviar respuesta
        </motion.button>
      </div>
    </motion.div>
  );
}

export default QuestionRound;
