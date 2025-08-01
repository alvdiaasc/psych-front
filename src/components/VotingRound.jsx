import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function VotingRound() {
  const { gameState, socket } = useContext(GameContext);

  const vote = (answerId) => {
    if (!gameState.hasVoted) {
      socket.emit('vote', {
        roomCode: gameState.roomCode,
        answerId
      });
    }
  };

  // Función para obtener el nombre del jugador por ID
  const getPlayerName = (playerId) => {
    const player = gameState.players?.find(p => p.id === playerId);
    return player ? player.name : 'Jugador desconocido';
  };

  // Función para obtener el avatar del jugador por ID
  const getPlayerAvatar = (playerId) => {
    const player = gameState.players?.find(p => p.id === playerId);
    return player ? player.avatar : null;
  };

  // Función para renderizar el avatar del jugador
  const renderPlayerAvatar = (playerId, size = 'w-6 h-6') => {
    const player = gameState.players?.find(p => p.id === playerId);
    if (!player) return null;

    if (player.avatar && player.avatar.startsWith('data:image')) {
      // Si es una imagen base64, mostrarla como imagen
      return (
        <img 
          src={player.avatar} 
          alt={player.name}
          className={`${size} rounded-full object-cover shadow-sm`}
        />
      );
    } else if (player.avatar) {
      // Si es un emoji o texto, mostrarlo como texto
      return (
        <div className={`${size} rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {player.avatar}
        </div>
      );
    } else {
      // Si no hay avatar, mostrar inicial del nombre
      return (
        <div className={`${size} rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {player.name.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  // Verificar si todos los jugadores han votado
  const allPlayersVoted = gameState.votes && 
    Object.keys(gameState.votes).length === gameState.players?.length &&
    gameState.players?.length > 0;

  // Debug: mostrar información de votación
  console.log('Debug votación:', {
    votes: gameState.votes,
    votesCount: gameState.votes ? Object.keys(gameState.votes).length : 0,
    playersCount: gameState.players?.length || 0,
    allPlayersVoted,
    phase: gameState.phase
  });

  if (!gameState.answers || gameState.answers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
        <motion.div
          className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-display text-2xl mx-auto mb-4">V</div>
          <p className="text-xl text-neutral-700 font-game font-semibold">Cargando respuestas...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header de votación */}
        <motion.div
          className="text-center mb-8 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Timer de votación */}
          {gameState.timeLeft && gameState.timeLeft > 0 && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
                animate={{ scale: gameState.timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
                transition={{ 
                  duration: 0.5, 
                  repeat: gameState.timeLeft <= 10 ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                  >
                  </motion.div>
                  <span>{gameState.timeLeft} segundos</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.h2 
            className="text-3xl md:text-4xl font-display text-white mb-4 text-shadow-lg tracking-wide"
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

        {/* Pregunta */}
        <motion.div
          className="main-card mb-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-game font-bold text-neutral-800 mb-2">
            Pregunta:
          </h3>
          <p className="text-lg text-neutral-700 font-game leading-relaxed">
            {gameState.question?.text || 'Cargando pregunta...'}
          </p>
        </motion.div>

        {/* Respuestas */}
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
                className={`group relative p-6 rounded-2xl shadow-lg transition-all transform overflow-hidden text-left ${
                  gameState.hasVoted 
                    ? 'bg-neutral-100 cursor-not-allowed opacity-70'
                    : 'bg-white hover:shadow-xl hover:-translate-y-2 cursor-pointer'
                } ${!gameState.hasVoted ? 'hover:scale-105' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={!gameState.hasVoted ? { 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                } : {}}
                whileTap={!gameState.hasVoted ? { scale: 0.98 } : {}}
              >
                {/* Indicador de voto */}
                {gameState.hasVoted && (
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    V
                  </motion.div>
                )}

                {/* Respuesta anónima */}
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

                {/* Efecto de hover */}
                {!gameState.hasVoted && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Información de votación */}
        <motion.div
          className="text-center mt-8 p-6 bg-accent-50 border-2 border-accent-200 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {gameState.hasVoted ? (
            <div>
              <p className="font-game font-bold text-accent-700 text-lg mb-2">
                ¡Voto enviado!
              </p>
              <p className="text-accent-600 font-game">
                Esperando a que todos los jugadores voten...
              </p>
            </div>
          ) : (
            <div>
              <p className="font-game font-semibold text-accent-700 mb-2">
                Tu voto cuenta para determinar al ganador de esta ronda
              </p>
              <p className="text-sm text-accent-600 font-game">
                Elige sabiamente... ¡Solo tienes una oportunidad!
              </p>
            </div>
          )}
        </motion.div>

        {/* Resultados de votación - Solo mostrar cuando todos hayan votado */}
        {allPlayersVoted && gameState.votes && (
          <motion.div
            className="mt-8 bg-white rounded-3xl p-6 shadow-lg border-2 border-primary-200"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.h3 
              className="text-2xl font-display font-bold text-center text-primary-700 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              🎯 Resultados de la Votación
            </motion.h3>

            {/* Mostrar quién es el autor de cada respuesta y quién votó por ella */}
            <div className="space-y-4">
              {gameState.answers?.map((answer, index) => {
                // Encontrar quién votó por esta respuesta
                const votersForThisAnswer = Object.entries(gameState.votes)
                  .filter(([voterId, votedAnswerId]) => votedAnswerId === answer.id)
                  .map(([voterId]) => voterId);

                return (
                  <motion.div
                    key={answer.id}
                    className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-4 border-l-4 border-primary-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {/* Respuesta y autor */}
                    <div className="mb-3">
                      <div className="flex items-start gap-3 mb-2">
                        {answer.playerId && (
                          <div className="flex-shrink-0">
                            {renderPlayerAvatar(answer.playerId, 'w-8 h-8')}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-neutral-700 font-game text-lg leading-relaxed mb-2 bg-white p-3 rounded-lg shadow-sm">
                            "{answer.text}"
                          </p>
                          <div className="flex items-center gap-2">
                            {answer.playerId ? (
                              <>
                                <span className="text-2xl">✍️</span>
                                <p className="text-sm font-semibold text-primary-600">
                                  Escrita por: <span className="text-primary-700 bg-primary-100 px-2 py-1 rounded-full">{getPlayerName(answer.playerId)}</span>
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">🎲</span>
                                <p className="text-sm font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                  Respuesta oficial del juego
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Votantes */}
                    <div className="border-t border-neutral-200 pt-3">
                      {votersForThisAnswer.length > 0 ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🗳️</span>
                            <p className="text-sm font-semibold text-secondary-600">
                              Votaron por esta respuesta: 
                              <span className="ml-2 bg-secondary-200 text-secondary-800 px-2 py-1 rounded-full text-xs font-bold">
                                {votersForThisAnswer.length} {votersForThisAnswer.length === 1 ? 'voto' : 'votos'}
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {votersForThisAnswer.map((voterId) => (
                              <motion.div
                                key={voterId}
                                className="flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 px-3 py-2 rounded-full text-sm font-game shadow-sm border border-secondary-300"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 300 }}
                              >
                                <div className="flex-shrink-0">
                                  {renderPlayerAvatar(voterId, 'w-6 h-6')}
                                </div>
                                <span className="font-semibold">{getPlayerName(voterId)}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center py-2 text-neutral-500">
                          <span className="text-2xl">😔</span>
                          <p className="text-sm italic">
                            Nadie votó por esta respuesta
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Estadísticas adicionales */}
            <motion.div
              className="mt-6 pt-4 border-t border-neutral-200 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-sm text-neutral-600 font-game">
                📊 Total de votos: {Object.keys(gameState.votes).length} de {gameState.players?.length} jugadores
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default VotingRound;