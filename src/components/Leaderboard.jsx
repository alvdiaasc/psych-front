import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function Leaderboard() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  const isLastRound = gameState.round + 1 >= gameState.totalRounds;
  
  const handleReady = () => {
    socket.emit('playerReady', { roomCode: gameState.roomCode });
  };

  // Ordenar los scores de mayor a menor
  const sortedScores = [...Object.entries(gameState.scores)].sort((a, b) => b[1] - a[1]);
  
  // Determinar las posiciones (considerando empates)
  const rankedScores = sortedScores.map((score, idx) => {
    if (idx === 0) return { id: score[0], score: score[1], position: 1 };
    const prevScore = sortedScores[idx - 1];
    const position = prevScore[1] === score[1] 
      ? rankedScores[idx - 1].position 
      : idx + 1;
    return { id: score[0], score: score[1], position };
  });

  // Obtener datos del jugador para cada puntuación
  const playersWithScores = rankedScores.map(scoreData => {
    const player = gameState.players.find(p => p.id === scoreData.id);
    return {
      ...scoreData,
      name: player?.name || 'Jugador Desconocido'
    };
  });

  // Emojis y colores para posiciones
  const getPositionData = (position) => {
    switch(position) {
      case 1: return { emoji: '👑', color: 'from-warning-400 to-warning-600', textColor: 'text-warning-700', bgColor: 'bg-warning-50' };
      case 2: return { emoji: '🥈', color: 'from-neutral-300 to-neutral-500', textColor: 'text-neutral-700', bgColor: 'bg-neutral-50' };
      case 3: return { emoji: '🥉', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-700', bgColor: 'bg-orange-50' };
      default: return { emoji: '🎯', color: 'from-primary-400 to-primary-600', textColor: 'text-primary-700', bgColor: 'bg-primary-50' };
    }
  };

  return (
    <div className="animated-bg flex flex-col items-center justify-center p-4 relative">
      {/* Confeti y partículas de celebración */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 200 - 100, 0],
              rotate: [0, 360 * 2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${16 + Math.random() * 20}px`,
            }}
          >
            {['🎉', '🎊', '⭐', '✨', '🏆', '🎈', '🎁', '💎'][index % 8]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header dinámico */}
        <motion.div
          className="text-center mb-10"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          {isLastRound ? (
            <>
              <motion.h1 
                className="text-display font-display text-white mb-4 text-shadow-lg tracking-wide"
                animate={{ 
                  y: [0, -10, 0],
                  textShadow: [
                    "4px 4px 8px rgba(0, 0, 0, 0.3)",
                    "6px 6px 12px rgba(0, 0, 0, 0.4)",
                    "4px 4px 8px rgba(0, 0, 0, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🏆 ¡Juego Terminado!
              </motion.h1>
              <motion.p 
                className="text-2xl font-game text-white/90 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Resultados Finales
              </motion.p>
            </>
          ) : (
            <>
              <motion.h1 
                className="text-display font-display text-white mb-4 text-shadow-lg tracking-wide"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                📊 Tabla de Posiciones
              </motion.h1>
              <motion.p 
                className="text-xl font-game text-white/90 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Ronda {gameState.round || 1} de {gameState.totalRounds || 5}
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Podio para los 3 primeros (solo en juego terminado) */}
        {isLastRound && playersWithScores.length >= 3 && (
          <motion.div
            className="flex justify-center items-end gap-4 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Segundo lugar */}
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="w-24 h-32 bg-gradient-to-t from-neutral-400 to-neutral-300 rounded-t-2xl flex flex-col items-center justify-end p-4 shadow-lg"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <span className="text-white font-display text-lg font-bold">2°</span>
              </motion.div>
              <div className="mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-full flex items-center justify-center text-2xl text-white font-display mx-auto mb-2 shadow-lg">
                  {playersWithScores[1]?.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-game text-white font-semibold">{playersWithScores[1]?.name}</p>
                <p className="text-white/80 font-game">{playersWithScores[1]?.score} pts</p>
              </div>
            </motion.div>

            {/* Primer lugar */}
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="w-28 h-40 bg-gradient-to-t from-warning-500 to-warning-400 rounded-t-2xl flex flex-col items-center justify-end p-4 shadow-xl relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-display text-xl font-bold">1°</span>
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-3xl">👑</span>
                </motion.div>
              </motion.div>
              <div className="mt-4">
                <div className="w-20 h-20 bg-gradient-to-br from-warning-400 to-warning-600 rounded-full flex items-center justify-center text-3xl text-white font-display mx-auto mb-2 shadow-xl">
                  {playersWithScores[0]?.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-game text-white font-bold text-lg">{playersWithScores[0]?.name}</p>
                <p className="text-white/90 font-game text-lg">{playersWithScores[0]?.score} pts</p>
              </div>
            </motion.div>

            {/* Tercer lugar */}
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="w-20 h-24 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-2xl flex flex-col items-center justify-end p-3 shadow-lg"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                <span className="text-white font-display font-bold">3°</span>
              </motion.div>
              <div className="mt-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xl text-white font-display mx-auto mb-2 shadow-lg">
                  {playersWithScores[2]?.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-game text-white font-semibold">{playersWithScores[2]?.name}</p>
                <p className="text-white/80 font-game">{playersWithScores[2]?.score} pts</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tabla de puntuaciones */}
        <motion.div
          className="main-card space-y-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        >
          <motion.h3 
            className="text-2xl font-display text-neutral-800 text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            🏆 Clasificación General
          </motion.h3>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {playersWithScores.map((player, index) => {
                const positionData = getPositionData(player.position);
                
                return (
                  <motion.div
                    key={player.id}
                    className={`player-card ${positionData.bgColor} group relative overflow-hidden`}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {/* Posición */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${positionData.color} flex items-center justify-center shadow-lg relative`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <span className="text-2xl font-display text-white font-bold">
                        {player.position}
                      </span>
                      {player.position <= 3 && (
                        <motion.div
                          className="absolute -top-2 -right-2"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        >
                          <span className="text-lg">{positionData.emoji}</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Información del jugador */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`text-xl font-game font-bold ${positionData.textColor}`}>
                          {player.name}
                        </h4>
                        {player.position === 1 && (
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-xl"
                          >
                            🏆
                          </motion.span>
                        )}
                      </div>
                      <p className="text-neutral-600 font-game">
                        Jugador #{index + 1}
                      </p>
                    </div>

                    {/* Puntuación */}
                    <motion.div 
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.05, type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <motion.div 
                        className={`text-3xl font-display font-bold ${positionData.textColor} mb-1`}
                        animate={{ scale: player.position === 1 ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {player.score}
                      </motion.div>
                      <p className="text-sm text-neutral-500 font-game">
                        puntos
                      </p>
                    </motion.div>

                    {/* Efecto de brillo para el ganador */}
                    {player.position === 1 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-warning-200/30 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Acciones */}
        <motion.div
          className="text-center mt-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {isLastRound ? (
            /* Botones para juego terminado */
            <div className="space-y-4">
              <motion.button
                onClick={playAgain}
                className="btn-primary w-full max-w-md shine"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🎮
                  </motion.span>
                  <span className="text-xl">¡Jugar de Nuevo!</span>
                </span>
              </motion.button>
              
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 max-w-md mx-auto"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-white/80 font-game text-sm">
                  🎉 ¡Gracias por jugar! Código de sala: <strong>{gameState.roomCode}</strong>
                </p>
              </motion.div>
            </div>
          ) : (
            /* Botón para siguiente ronda */
            <motion.button
              onClick={handleReady}
              className="btn-success w-full max-w-md shine"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
                <span className="text-xl">¡Siguiente Ronda!</span>
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Footer con estadísticas */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex justify-center items-center gap-6 text-white/70 font-game text-sm">
            <span className="flex items-center gap-1">
              <span>🎯</span>
              <span>Rondas: {gameState.round || 1}/{gameState.totalRounds || 5}</span>
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>👥</span>
              <span>{playersWithScores.length} jugadores</span>
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>🏆</span>
              <span>Máx: {Math.max(...playersWithScores.map(p => p.score))} pts</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
