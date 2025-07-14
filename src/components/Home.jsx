import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Home() {
  const { socket } = useContext(GameContext);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const createRoom = () => {
    if (!playerName.trim()) {
      setError('¡Necesitas un nombre para jugar!');
      return;
    }
    setError('');
    socket.emit('createRoom', { playerName });
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('¡Necesitas un nombre y un código de sala!');
      return;
    }
    if (!socket) {
      setError('Conexión con el servidor no establecida. ¡Inténtalo de nuevo!');
      return;
    }
    setError('');
    socket.emit('joinRoom', { roomCode, playerName });
  };

  return (
    <div className="animated-bg flex flex-col items-center justify-center p-4 relative">
      {/* Partículas flotantes decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Elementos de fondo adicionales */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute text-4xl opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: index * 0.8,
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
          >
            {index % 3 === 0 ? '⭐' : index % 3 === 1 ? '🎊' : '🎈'}
          </motion.div>
        ))}
      </div>

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
            className="text-display-lg font-display text-white mb-4 text-shadow-lg tracking-wide"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🧠 PSYCH!
          </motion.h1>
          <motion.p 
            className="text-xl font-game text-white/90 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ¡Engaña a tus amigos!
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
              placeholder="Ej: Jugador Genial"
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
              placeholder="Ej: ABC123"
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
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
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
              onClick={createRoom}
              className="btn-primary w-full shine group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎮
                </motion.span>
                <span>Crear Nueva Sala</span>
              </span>
            </motion.button>

            <motion.button
              onClick={joinRoom}
              disabled={!roomCode.trim()}
              className="btn-secondary w-full shine group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={roomCode.trim() ? { scale: 1.02, y: -2 } : {}}
              whileTap={roomCode.trim() ? { scale: 0.98, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ 
                    scale: roomCode.trim() ? [1, 1.1, 1] : 1,
                    rotate: roomCode.trim() ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎯
                </motion.span>
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
              <span className="text-xs text-neutral-400">2-8 jugadores</span>
              <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
              <span className="text-xs text-neutral-400">15-30 min</span>
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
            className="inline-flex items-center gap-2 text-white/80 font-game text-sm"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Hecho con</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>para diversión</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;