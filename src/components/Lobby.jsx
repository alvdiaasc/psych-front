import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import PlayerAvatar from './PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';

function Lobby() {
  const { gameState, socket, leaveRoom, kickPlayer } = useContext(GameContext);
  const [gameSettings, setGameSettings] = useState({
    roundsMode: 'perPlayer', // 'perPlayer' o 'custom'
    customRounds: 3
  });

  const startGame = () => {
    console.log('Sending game settings:', gameSettings);
    socket.emit('startGame', { 
      roomCode: gameState.roomCode,
      settings: gameSettings
    });
  };

  const handleKickPlayer = (playerId, playerName) => {
    if (window.confirm(`¿Estás seguro de que quieres expulsar a ${playerName}?`)) {
      kickPlayer(playerId);
    }
  };

  const handleLeaveRoom = () => {
    if (window.confirm('¿Estás seguro de que quieres salir de la sala?')) {
      leaveRoom();
    }
  };

  const isHost = gameState.players && gameState.players[0]?.id === socket?.id;

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header de la sala */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-display text-neutral-800 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Sala de Juego
          </motion.h1>
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-lg font-semibold">
              Código: <span className="font-bold text-xl">{gameState.roomCode}</span>
            </p>
          </div>
        </motion.div>

        {/* Lista de jugadores */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-primary-200/50 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-game font-bold text-neutral-800 mb-2">
              Jugadores ({gameState.players?.length || 0}/8)
            </h2>
            <p className="text-neutral-600 font-game">
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
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50 rounded-2xl p-4 shadow-md hover:shadow-lg group hover:scale-105 transition-all duration-300"
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
                      <p className="font-game font-semibold text-neutral-800 text-lg">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-xs bg-gradient-to-r from-warning-400 to-warning-500 text-white px-2 py-1 rounded-full font-game font-semibold">
                            Host
                          </span>
                        )}
                        <span className="text-xs text-neutral-500 font-game">
                          Jugador #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Controles del host */}
                    <div className="flex items-center gap-2">
                      {/* Botón de expulsión (solo visible para el host y para jugadores que no sean el host) */}
                      {isHost && index !== 0 && (
                        <button
                          onClick={() => handleKickPlayer(player.id, player.name)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105"
                          title={`Expulsar a ${player.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Estado de conexión */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-success-400 rounded-full"
                        title="Conectado"
                      />
                    </div>
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
                  className="border-2 border-dashed border-primary-300 bg-primary-50/30 rounded-2xl p-4 flex items-center justify-center min-h-[80px]"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <div className="text-center text-primary-400">
                    <div className="text-2xl mb-1">...</div>
                    <p className="text-sm font-game">Esperando jugador...</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Configuración del juego (solo para el host) */}
        {isHost && (
          <motion.div
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-primary-200/50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-game font-bold text-neutral-800 mb-2">
                ⚙️ Configuración del Juego
              </h2>
              <p className="text-neutral-600 font-game">
                Personaliza la duración de la partida
              </p>
            </div>

            <div className="space-y-6">
              {/* Modo de rondas */}
              <div>
                <label className="block text-lg font-game font-semibold text-neutral-800 mb-4 text-center">
                  📊 Número de Rondas
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opción: Una ronda por jugador */}
                  <motion.button
                    type="button"
                    onClick={() => setGameSettings({...gameSettings, roundsMode: 'perPlayer'})}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      gameSettings.roundsMode === 'perPlayer'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300 bg-white hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <p className="font-game font-semibold mb-1">
                        Una por jugador
                      </p>
                      <p className="text-sm text-neutral-600">
                        {gameState.players?.length || 0} rondas
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Cada jugador será el objetivo una vez
                      </p>
                    </div>
                  </motion.button>

                  {/* Opción: Número personalizado */}
                  <motion.button
                    type="button"
                    onClick={() => setGameSettings({...gameSettings, roundsMode: 'custom'})}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      gameSettings.roundsMode === 'custom'
                        ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                        : 'border-neutral-300 bg-white hover:border-secondary-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <p className="font-game font-semibold mb-1">
                        Número personalizado
                      </p>
                      <p className="text-sm text-neutral-600">
                        {gameSettings.customRounds} rondas
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Elige exactamente cuántas rondas jugar
                      </p>
                    </div>
                  </motion.button>
                </div>

                {/* Control de número personalizado */}
                {gameSettings.roundsMode === 'custom' && (
                  <motion.div
                    className="mt-4 bg-secondary-50 rounded-2xl p-4 border border-secondary-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <label className="block text-secondary-700 font-game font-semibold mb-3">
                        Número de rondas:
                      </label>
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          type="button"
                          onClick={() => setGameSettings({
                            ...gameSettings, 
                            customRounds: Math.max(1, gameSettings.customRounds - 1)
                          })}
                          className="w-10 h-10 bg-secondary-500 hover:bg-secondary-600 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        
                        <div className="bg-white rounded-xl px-6 py-3 border-2 border-secondary-300 min-w-[80px]">
                          <span className="text-2xl font-bold text-secondary-700">
                            {gameSettings.customRounds}
                          </span>
                        </div>
                        
                        <motion.button
                          type="button"
                          onClick={() => setGameSettings({
                            ...gameSettings, 
                            customRounds: Math.min(10, gameSettings.customRounds + 1)
                          })}
                          className="w-10 h-10 bg-secondary-500 hover:bg-secondary-600 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <p className="text-xs text-secondary-600 mt-2">
                        Entre 1 y 10 rondas
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Resumen de configuración */}
              <div className="bg-accent-50 rounded-2xl p-4 border border-accent-200">
                <div className="text-center">
                  <p className="font-game font-semibold text-accent-700 mb-2">
                    📋 Resumen de la partida
                  </p>
                  <div className="flex justify-center items-center gap-4 text-sm text-accent-600">
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>{gameState.players?.length || 0} jugadores</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔄</span>
                      <span>
                        {gameSettings.roundsMode === 'perPlayer' 
                          ? `${gameState.players?.length || 0} rondas`
                          : `${gameSettings.customRounds} rondas`
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>~{
                        gameSettings.roundsMode === 'perPlayer' 
                          ? Math.ceil(((gameState.players?.length || 0) * 2) / 60) || 1
                          : Math.ceil((gameSettings.customRounds * 2) / 60) || 1
                        } min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botones de acción */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Botón volver */}
          <motion.button
            onClick={handleLeaveRoom}
            className="w-full max-w-md mx-auto py-3 px-6 bg-gradient-to-r from-neutral-400 to-neutral-500 hover:from-neutral-500 hover:to-neutral-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 mb-4"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Inicio
            </span>
          </motion.button>

          {/* Botón iniciar juego (solo para host) */}
          {isHost && (
            <motion.button
              onClick={startGame}
              disabled={!gameState.players || gameState.players.length < 2}
              className={`w-full max-w-md mx-auto py-4 px-8 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                (!gameState.players || gameState.players.length < 2) 
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl'
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
          {!isHost && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-2">⏳</div>
                <p className="font-game font-semibold text-primary-700 mb-1">
                  Esperando al host
                </p>
                <p className="text-sm text-primary-600 font-game">
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
            <p className="text-sm text-neutral-600 font-game mb-2">
              Comparte este código con tus amigos:
            </p>
            <motion.div
              className="bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl px-4 py-2 inline-block cursor-pointer border border-neutral-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(gameState.roomCode);
                // Aquí podrías mostrar un toast de "copiado"
              }}
            >
              <span className="font-mono text-lg font-bold text-neutral-700">
                {gameState.roomCode}
              </span>
              <span className="ml-2 text-xs text-neutral-500">Click para copiar</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Lobby;