import React, { useContext } from 'react';            {['V', '★', '✨', '�'][index % 4]}import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function VotingRound() {
  const { gameState, socket } = useContext(GameContext);

  const vote = (answerId) => {
    if (!gameState.hasVoted) {
      socket.emit('vote', {
        roomCode: gameState.roomCode,
        answerId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4 relative">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 8}px`,
            }}
          >
            {['🗳️', '⭐', '�', '💭'][index % 4]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header con temporizador */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Temporizador mejorado */}
          {gameState.phase === 'voting' && gameState.timeLeft && (
            <motion.div 
              className="flex justify-center mb-6"
              animate={{ scale: gameState.timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: gameState.timeLeft <= 10 ? Infinity : 0 }}
            >
              <motion.div 
                className={`px-8 py-4 rounded-full font-game text-2xl font-bold shadow-lg ${
                  gameState.timeLeft <= 10 
                    ? 'bg-danger-500 text-white animate-pulse' 
                    : gameState.timeLeft <= 20
                    ? 'bg-warning-400 text-white'
                    : 'bg-white/90 text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                  >
                  </motion.span>
                  <span>{gameState.timeLeft} segundos</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.h2 
            className="text-display font-display text-white mb-4 text-shadow-lg tracking-wide"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            ¡Hora de Votar!
          </motion.h2>
          <motion.p 
            className="text-xl font-game text-white/90 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Elige la respuesta más convincente
          </motion.p>
        </motion.div>

        {/* Tarjeta de la pregunta */}
        <motion.div
          className="main-card mb-8 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ❓
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-game text-neutral-600 mb-2 font-semibold">
                Pregunta a responder:
              </h3>
              <p className="text-2xl font-game text-neutral-800 leading-relaxed">
                {gameState.question.text}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Opciones de votación */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {gameState.answers && gameState.answers.map((answer, index) => (
              <motion.button
                key={answer.id}
                onClick={() => vote(answer.id)}
                disabled={gameState.hasVoted}
                className={`group relative p-6 rounded-2xl shadow-card transition-all transform overflow-hidden text-left ${
                  gameState.hasVoted 
                    ? 'bg-neutral-100 cursor-not-allowed opacity-70'
                    : 'bg-white hover:shadow-card-hover hover:-translate-y-2 cursor-pointer'
                } ${!gameState.hasVoted ? 'shine' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={!gameState.hasVoted ? { scale: 1.02, y: -4 } : {}}
                whileTap={!gameState.hasVoted ? { scale: 0.98, y: 0 } : {}}
              >
                {/* Número de opción */}
                <motion.div 
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-game font-bold text-lg shadow-lg ${
                    !gameState.hasVoted 
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                      : 'bg-neutral-400'
                  }`}
                  whileHover={!gameState.hasVoted ? { scale: 1.1, rotate: 5 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {String.fromCharCode(65 + index)}
                </motion.div>

                {/* Contenido de la respuesta */}
                <div className="relative z-10 pr-12">                  {/* Respuesta anónima */}
                  <motion.div
                    className="bg-neutral-50 p-4 rounded-xl border-l-4 border-primary-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <p className="text-neutral-700 font-game text-lg leading-relaxed">
                      "{answer.text}"
                    </p>
                  </motion.div>
                </div>

                {/* Indicador de voto disponible */}
                {!gameState.hasVoted && (
                  <motion.div
                    className="absolute bottom-4 right-4 flex items-center gap-2 text-primary-500 font-game text-sm font-medium"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>👆</span>
                    <span>¡Votar!</span>
                  </motion.div>
                )}

                {/* Efecto de brillo al hover */}
                {!gameState.hasVoted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Estado post-votación */}
        {gameState.hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              ✅
            </motion.div>
            <h3 className="text-2xl font-display text-white mb-3 text-shadow-lg">
              ¡Voto Registrado!
            </h3>
            <p className="text-lg font-game text-white/90 mb-6">
              Esperando que terminen los demás jugadores...
            </p>
            
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-white/80 font-game mb-4">
                Tu voto cuenta para determinar al ganador de esta ronda
              </p>
              <motion.div 
                className="flex justify-center gap-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Instrucciones */}
        {!gameState.hasVoted && (
          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-game text-white font-semibold mb-2">
                  Consejos para votar:
                </h4>
                <ul className="text-white/80 font-game text-sm space-y-1">
                  <li>• Elige la respuesta que te parezca más convincente</li>
                  <li>• Piensa en cuál podría ser la respuesta "real"</li>
                  <li>• ¡No puedes votar por tu propia respuesta!</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VotingRound;
