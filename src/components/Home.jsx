import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import SessionManager from '../utils/sessionManager';
import { motion } from 'framer-motion';

function Home() {
  const { socket, gameState, createRoom, joinRoom } = useContext(GameContext);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  // Cargar nombre guardado al iniciar
  useEffect(() => {
    try {
      const savedName = SessionManager?.getSavedPlayerName?.() || '';
      if (savedName) {
        setPlayerName(savedName);
      }
    } catch (error) {
      console.error('Error loading saved player name:', error);
    }
  }, []);

  // Mostrar estado de reconexión
  if (gameState.isReconnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-200/50"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Reconectando...</h2>
            <p className="text-gray-600">Volviendo a tu partida en curso</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('¡Necesitas un nombre para jugar!');
      return;
    }
    setError('');
    createRoom(playerName);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('¡Necesitas un nombre y un código de sala!');
      return;
    }
    if (!socket) {
      setError('Conexión con el servidor no establecida. ¡Inténtalo de nuevo!');
      return;
    }
    setError('');
    joinRoom(roomCode, playerName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4 relative">
      {/* Contenido principal */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo / Título */}
        <motion.div
          className="text-center mb-12"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-display text-neutral-800 mb-4 tracking-wide"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            PSYCH!
          </motion.h1>
          <motion.p 
            className="text-xl font-game text-neutral-600 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
          </motion.p>
        </motion.div>

        {/* Tarjeta principal */}
        <motion.div
          className="main-card space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.3 
          }}
        >
          {/* Input nombre */}
          <motion.div
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-neutral-700 font-game text-lg font-semibold">
              Tu nombre
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-game"
              maxLength={20}
            />
          </motion.div>

          {/* Input código de sala */}
          <motion.div
            className="space-y-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-neutral-700 font-game text-lg font-semibold">
              Código de sala (opcional)
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="input-game uppercase"
              maxLength={6}
            />
          </motion.div>

          {/* Mensaje de error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-danger-50 border-2 border-danger-200 text-danger-700 p-4 rounded-2xl"
            >            <div className="flex items-center gap-2">
              <p className="font-game font-semibold">{error}</p>
            </div>
            </motion.div>
          )}

          {/* Botones de acción */}
          <motion.div
            className="space-y-4 pt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleCreateRoom}
              className="btn-primary w-full shine group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Crear Nueva Sala</span>
              </span>
            </motion.button>

            <motion.button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="btn-secondary w-full shine group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={roomCode.trim() ? { scale: 1.02, y: -2 } : {}}
              whileTap={roomCode.trim() ? { scale: 0.98, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Unirse con Código</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            className="text-center pt-4 border-t border-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm text-neutral-500 font-game">
              Crea una sala para empezar o únete con un código
            </p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer decorativo */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-neutral-500 font-game text-sm"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;