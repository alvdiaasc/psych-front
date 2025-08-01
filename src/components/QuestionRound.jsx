import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function QuestionRound() {
  const { gameState, socket } = useContext(GameContext);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gameState.phase === 'question' && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, submitted, gameState.phase]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitted || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitted(true);
    socket.emit('submitAnswer', { 
      answer: answer.trim(),
      roomCode: gameState.roomCode 
    });
    
    // Simular delay de envío para mejor UX
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 30) return 'text-success-600';
    if (timeLeft > 15) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getTimeProgress = () => {
    return (timeLeft / 60) * 100;
  };

  if (!gameState.question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 flex items-center justify-center p-4">
        <motion.div 
          className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-game-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-6xl mb-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-display text-2xl">?</div>
          <p className="text-xl text-neutral-700 font-game font-semibold">Cargando pregunta...</p>
          <div className="mt-4 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 p-4 relative">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-32 h-32 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full blur-xl"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + index * 20}%`,
              top: `${10 + index * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header con timer */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-game-lg"
            animate={{ scale: timeLeft <= 10 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
          >
            <div className="text-3xl">⏰</div>
            <div className="text-center">
              <div className={`text-3xl font-display font-bold ${getTimeColor()}`}>
                {timeLeft}s
              </div>
              <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden mt-1">
                <motion.div
                  className={`h-full transition-colors duration-300 ${
                    timeLeft > 30 
                      ? 'bg-success-500' 
                      : timeLeft > 15 
                        ? 'bg-warning-500' 
                        : 'bg-danger-500'
                  }`}
                  style={{ width: `${getTimeProgress()}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pregunta */}
        <motion.div
          className="main-card mb-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-game font-bold text-neutral-800 leading-relaxed">
            {gameState.question?.text || 'Cargando pregunta...'}
          </h2>
        </motion.div>

        {/* Área de respuesta */}
        <motion.div
          className="main-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-game font-semibold text-neutral-700 mb-3">
                    Tu respuesta creativa:
                  </label>
                  <motion.textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Piensa que haría Ramón..."
                    className="input-game min-h-[120px] resize-none"
                    maxLength={200}
                    disabled={submitted || timeLeft === 0}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-neutral-500 font-game">
                      {answer.length}/200 caracteres
                    </span>
                    <span className="text-sm text-neutral-500 font-game">
                      Presiona Enter para enviar
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || submitted || timeLeft === 0 || isSubmitting}
                  className={`btn-primary w-full shine relative overflow-hidden ${
                    (!answer.trim() || timeLeft === 0) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                  whileHover={answer.trim() && timeLeft > 0 ? { scale: 1.02, y: -2 } : {}}
                  whileTap={answer.trim() && timeLeft > 0 ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Enviando...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">🚀</span>
                        <span>Enviar Respuesta</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  ✅
                </motion.div>
                <h3 className="text-2xl font-game font-bold text-success-600 mb-2">
                  ¡Respuesta Enviada!
                </h3>
                <p className="text-neutral-600 font-game">
                  Esperando a que los demás terminen...
                </p>
                
                {/* Tu respuesta */}
                <motion.div
                  className="mt-6 p-4 bg-success-50 border-2 border-success-200 rounded-2xl"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-game font-semibold text-success-700 mb-1">
                    Tu respuesta:
                  </p>
                  <p className="text-neutral-700 font-game italic">
                    "{answer}"
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Información de jugadores */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3">
            <span className="text-xl">👥</span>
            <span className="font-game text-neutral-600">
              {gameState.players?.filter(p => p.hasAnswered).length || 0} / {gameState.players?.length || 0} han respondido
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuestionRound;