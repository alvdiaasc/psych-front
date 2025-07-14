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
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2">Ronda {gameState.round + 1} de {gameState.totalRounds}</h2>
      {gameState.targetPlayer && (
        <p className="mb-2 text-gray-700 font-semibold">Pregunta para: <span className="text-blue-600">{gameState.targetPlayer.name}</span></p>
      )}
      <h3 className="text-lg font-bold mb-4">Pregunta</h3>
      <p className="mb-4">{gameState.question.text}</p>

      {/* Mostrar el temporizador */}
      {remainingTime !== null && (
        <p className="text-red-500 font-bold mb-4">Tiempo restante: {remainingTime} segundos</p>
      )}

      <input
        type="text"
        placeholder="Tu respuesta..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={submitAnswer}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Enviar respuesta
      </button>
    </motion.div>
  );
}

export default QuestionRound;
