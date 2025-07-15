import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import PlayerAvatar from './PlayerAvatar';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header de la sala */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Sala de Juego
          </motion.h1>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-lg font-semibold">
              Código: <span className="font-bold text-xl">{gameState.roomCode}</span>
            </p>
          </div>
        </motion.div>

        {/* Lista de jugadores */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/50 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Jugadores ({gameState.players?.length || 0}/8)
            </h2>
            <p className="text-gray-600">
              Esperando a que se unan más jugadores...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {gameState.players?.map((player, index) => (
                <motion.div
                  key={player.id}
                  variants={item}
                  layout
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl p-4 shadow-md hover:shadow-lg group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <PlayerAvatar 
                      playerName={player.name}
                      avatarUrl={player.avatar}
                      size="medium"
                      className="shadow-md"
                    />
                    
                    {/* Info del jugador */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-semibold">
                            Host
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Jugador #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Estado de conexión */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-green-500 rounded-full"
                      title="Conectado"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Slots vacíos */}
          {gameState.players && gameState.players.length < 8 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {[...Array(Math.min(3, 8 - (gameState.players?.length || 0)))].map((_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  className="border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-2xl p-4 flex items-center justify-center min-h-[80px]"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <div className="text-center text-blue-400">
                    <div className="text-2xl mb-1">👥</div>
                    <p className="text-sm">Esperando jugador...</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Botón iniciar juego (solo para host) */}
          {gameState.players && gameState.players[0]?.id === socket?.id && (
            <motion.button
              onClick={startGame}
              disabled={!gameState.players || gameState.players.length < 2}
              className={`w-full max-w-md mx-auto py-4 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                (!gameState.players || gameState.players.length < 2) 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
              }`}
              whileHover={
                gameState.players && gameState.players.length >= 2 
                  ? { scale: 1.02, y: -2 } 
                  : {}
              }
              whileTap={
                gameState.players && gameState.players.length >= 2 
                  ? { scale: 0.98 } 
                  : {}
              }
            >
              <span className="flex items-center justify-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ 
                    rotate: gameState.players && gameState.players.length >= 2 ? [0, 10, -10, 0] : 0 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
                <span>
                  {(!gameState.players || gameState.players.length < 2) 
                    ? 'Necesitas al menos 2 jugadores' 
                    : 'Iniciar Juego'
                  }
                </span>
              </span>
            </motion.button>
          )}

          {/* Información para jugadores no-host */}
          {gameState.players && gameState.players[0]?.id !== socket?.id && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-2">⏳</div>
                <p className="font-semibold text-blue-700 mb-1">
                  Esperando al host
                </p>
                <p className="text-sm text-blue-600">
                  {gameState.players[0]?.name} iniciará el juego cuando esté listo
                </p>
              </div>
            </div>
          )}

          {/* Enlace para compartir */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-600 mb-2">
              Comparte este código con tus amigos:
            </p>
            <motion.div
              className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-4 py-2 inline-block cursor-pointer border border-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(gameState.roomCode);
                // Aquí podrías mostrar un toast de "copiado"
              }}
            >
              <span className="font-mono text-lg font-bold text-gray-700">
                {gameState.roomCode}
              </span>
              <span className="ml-2 text-xs text-gray-500">📋 Click para copiar</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Lobby;