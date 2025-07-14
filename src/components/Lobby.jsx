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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent via-primary to-secondary p-4 relative overflow-hidden"
    >
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-8 relative z-10">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2 className="text-display-sm font-display text-white mb-2 drop-shadow-lg tracking-wide">
            Sala: {gameState.roomCode}
          </h2>
          <p className="text-xl text-white/90 font-game tracking-wide mt-2">
            Esperando jugadores ({gameState.players.length}/8)
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="w-full max-w-lg bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-card relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ul className="space-y-4">
          {gameState.players.map((player, index) => (
            <motion.li
              key={player.id}
              variants={item}
              className="group flex items-center gap-4 p-4 bg-background-light/50 rounded-xl border-2 border-background hover:border-accent-light transition-all relative overflow-hidden"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-game text-white shadow-lg">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    👑
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="text-xl font-game text-gray-800 tracking-wide">
                  {player.name}
                </span>
                {index === 0 && (
                  <span className="ml-2 text-sm text-primary-dark font-game">
                    (Anfitrión)
                  </span>
                )}
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              
              {/* Efecto hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-light/0 via-accent-light/5 to-accent-light/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.li>
          ))}
        </ul>

        {gameState.players[0]?.id === socket.id && (
          <motion.button
            onClick={startGame}
            className="w-full mt-8 bg-gradient-to-br from-success to-success-dark text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="tracking-wide">¡Iniciar Juego!</span>
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Lobby;
