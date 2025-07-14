import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Home() {
  const { socket } = useContext(GameContext);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createRoom = () => {
    if (playerName.trim()) {
      socket.emit('createRoom', { playerName });
    }
  };

  const joinRoom = () => {
    if (playerName.trim() && roomCode.trim()) {
      if (!socket) {
        alert('Conexión con el servidor no establecida. Espera unos segundos e inténtalo de nuevo.');
        return;
      }
      console.log('Intentando unirse a la sala:', roomCode, 'como', playerName);
      socket.emit('joinRoom', { roomCode, playerName });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-primary to-vibrantBlue text-white"
    >
      <h1 className="text-5xl font-bold mb-8 font-cabinSketch">¡Bienvenido a Psych!</h1>
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <motion.input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Tu nombre..."
          className="w-full p-4 rounded-xl border border-neutral text-black focus:ring-2 focus:ring-primary"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Código de sala..."
          className="w-full p-4 rounded-xl border border-neutral text-black focus:ring-2 focus:ring-accent"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button
          onClick={createRoom}
          className="w-full bg-secondary text-black py-4 rounded-xl shadow-vibrant hover:bg-yellow-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Crear Sala
        </motion.button>
        <motion.button
          onClick={joinRoom}
          className="w-full bg-accent text-white py-4 rounded-xl shadow-vibrant hover:bg-pink-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Unirse con Código
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Home;
