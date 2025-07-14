import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent to-primary p-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-display-sm font-display text-white mb-2">
          Sala: {gameState.roomCode}
        </h2>
        <p className="text-xl text-white/90 font-game">
          Esperando jugadores ({gameState.players.length}/8)
        </p>
      </div>

      <motion.div 
        className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-card"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ul className="space-y-4">
          {gameState.players.map((player, index) => (
            <motion.li
              key={player.id}
              variants={item}
              className="flex items-center gap-4 p-4 bg-background-light rounded-xl border-2 border-background hover:border-accent-light transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-2xl font-game text-white">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xl font-game text-gray-800">
                {player.name}
                {index === 0 && (
                  <span className="ml-2 text-sm text-primary-dark">(Anfitrión)</span>
                )}
              </span>
            </motion.li>
          ))}
        </ul>

        {gameState.players[0]?.id === socket.id && (
          <motion.button
            onClick={startGame}
            className="w-full mt-8 bg-success hover:bg-success-dark text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎲 ¡Iniciar Juego!
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Lobby;
