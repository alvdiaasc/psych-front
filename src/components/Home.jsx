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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent-light via-primary-light to-secondary-light p-4 relative overflow-hidden"
    >
      {/* Burbujas decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: index * 0.8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-12 relative z-10"
      >
        <h1 className="text-display font-display text-white text-center drop-shadow-lg tracking-wide">
          ¡Bienvenido a Psych!
        </h1>
        <p className="text-center text-white/90 text-xl mt-4 font-game tracking-wide">
          El juego donde engañar es ganar
        </p>
      </motion.div>

      <motion.div 
        className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-card relative z-10"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="space-y-6">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-gray-600 font-game text-lg tracking-wide">Tu nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              className="w-full p-4 rounded-xl border-2 border-primary-light bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary-light/50 transition-all text-lg font-sans placeholder-gray-400"
            />
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-gray-600 font-game text-lg tracking-wide">Código de sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              className="w-full p-4 rounded-xl border-2 border-accent-light bg-white/50 focus:border-accent focus:ring-2 focus:ring-accent-light/50 transition-all text-lg font-sans uppercase placeholder-gray-400"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-center font-game tracking-wide"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-4 pt-4">
            <motion.button
              onClick={createRoom}
              className="group w-full bg-gradient-to-br from-secondary to-secondary-dark text-gray-900 font-game text-xl py-4 px-6 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-2xl">🎮</span>
                <span className="tracking-wide">Crear Sala</span>
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            <motion.button
              onClick={joinRoom}
              className="group w-full bg-gradient-to-br from-accent to-accent-dark text-white font-game text-xl py-4 px-6 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="tracking-wide">Unirse con Código</span>
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Home;
