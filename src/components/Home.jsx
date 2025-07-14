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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent-light via-primary-light to-secondary-light p-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-12"
      >
        <h1 className="text-display font-display text-white text-center drop-shadow-lg">
          ¡Bienvenido a Psych!
        </h1>
        <p className="text-center text-white text-xl mt-2 font-game">
          El juego donde engañar es ganar
        </p>
      </motion.div>

      <motion.div 
        className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="space-y-6">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-gray-700 font-game text-lg">Tu nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              className="w-full p-4 rounded-xl border-2 border-primary-light focus:border-primary focus:ring-2 focus:ring-primary-light transition-all text-lg"
            />
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-gray-700 font-game text-lg">Código de sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              className="w-full p-4 rounded-xl border-2 border-accent-light focus:border-accent focus:ring-2 focus:ring-accent-light transition-all text-lg uppercase"
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary text-center font-game"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-4 pt-4">
            <motion.button
              onClick={createRoom}
              className="w-full bg-secondary hover:bg-secondary-dark text-gray-900 font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎮 Crear Sala
            </motion.button>

            <motion.button
              onClick={joinRoom}
              className="w-full bg-accent hover:bg-accent-dark text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎯 Unirse con Código
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Home;
