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
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Psych! Clone</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={createRoom}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={joinRoom}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={!socket}
          >
            Join
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
