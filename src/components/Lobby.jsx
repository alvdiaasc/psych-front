import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function Lobby() {
  const { gameState, socket } = useContext(GameContext);

  const startGame = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const playerAvatarColors = [
    'from-primary-400 to-primary-600',
    'from-secondary-400 to-secondary-600',
    'from-accent-400 to-accent-600',
    'from-warning-400 to-warning-600',
    'from-danger-400 to-danger-600',
    'from-success-400 to-success-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
  ];

  return (
    <div className="animated-bg flex flex-col items-center justify-center p-4 relative">
      {/* Partículas flotantes mejoradas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 120 - 60, 0],
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={`emoji-${index}`}
            className="absolute text-6xl opacity-10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: index * 1.2,
            }}
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
          >
            {['🎮', '🎯', '🎲', '🎊', '⭐', '🎈', '🎉', '🏆'][index]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header de la sala */}
        <motion.div
          className="text-center mb-10"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4"
          >
            <h2 className="text-display font-display text-white mb-3 text-shadow-lg tracking-wide">
              🎯 Sala de Espera
            </h2>
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="text-2xl font-game text-white font-bold tracking-wider">
                  {gameState.roomCode}
                </span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <span className="text-lg font-game text-white/90">
                  {gameState.players.length}/8 jugadores
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-lg font-game text-white/80 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {gameState.players.length < 2 ? 
              '¡Esperando más jugadores para comenzar!' : 
              '¡Listos para la diversión! 🎉'
            }
          </motion.p>
        </motion.div>

        {/* Lista de jugadores mejorada */}
        <motion.div 
          className="main-card p-8 space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h3 
            className="text-2xl font-display text-neutral-800 text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🎪 Jugadores en la Sala
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {gameState.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  variants={item}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: index * 0.1 
                  }}
                  className="player-card group"
                >
                  <div className="relative">
                    {/* Avatar del jugador */}
                    <motion.div 
                      className={`player-avatar bg-gradient-to-br ${playerAvatarColors[index % playerAvatarColors.length]} relative`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-2xl font-display">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                      
                      {/* Indicador de anfitrión */}
                      {index === 0 && (
                        <motion.div 
                          className="absolute -top-2 -right-2 w-8 h-8 bg-warning-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-sm">👑</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-game text-neutral-800 font-semibold truncate">
                        {player.name}
                      </span>
                      {index === 0 && (
                        <motion.span 
                          className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded-full font-game font-medium"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Anfitrión
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <motion.div 
                        className="w-2 h-2 bg-success-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-xs text-neutral-500 font-game">
                        Conectado
                      </span>
                    </div>
                  </div>

                  {/* Número del jugador */}
                  <motion.div 
                    className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 font-game font-bold text-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    #{index + 1}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Slots vacíos */}
          {gameState.players.length < 8 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[...Array(Math.min(3, 8 - gameState.players.length))].map((_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  className="flex items-center gap-4 p-4 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl opacity-60"
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-neutral-400 font-game">
                      Esperando jugador...
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Botón de inicio (solo para anfitrión) */}
          {gameState.players[0]?.id === socket.id && (
            <motion.div
              className="pt-6 border-t border-neutral-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={startGame}
                disabled={gameState.players.length < 2}
                className={`btn-success w-full relative overflow-hidden shine ${
                  gameState.players.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={gameState.players.length >= 2 ? { scale: 1.02, y: -2 } : {}}
                whileTap={gameState.players.length >= 2 ? { scale: 0.98, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: gameState.players.length >= 2 ? [0, 15, -15, 0] : 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎲
                  </motion.span>
                  <span className="text-xl">
                    {gameState.players.length < 2 ? 
                      'Necesitas al menos 2 jugadores' : 
                      '¡Iniciar Juego!'
                    }
                  </span>
                </span>
              </motion.button>
              
              {gameState.players.length < 2 && (
                <motion.p 
                  className="text-center text-sm text-neutral-500 font-game mt-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Comparte el código <strong>{gameState.roomCode}</strong> con tus amigos
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Información para jugadores no anfitriones */}
          {gameState.players[0]?.id !== socket.id && (
            <motion.div
              className="text-center pt-6 border-t border-neutral-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-neutral-600 font-game text-lg mb-2">
                  🎮 Esperando que el anfitrión inicie el juego...
                </p>
                <p className="text-sm text-neutral-500">
                  ¡Ponte cómodo mientras llegan más jugadores!
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer con información del juego */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex items-center gap-4 text-white/70 font-game text-sm">
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>15-30 min</span>
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>🎯</span>
              <span>Casual</span>
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="flex items-center gap-1">
              <span>🧠</span>
              <span>Psicología</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Lobby;
