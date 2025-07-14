import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Punishments() {
  const { gameState } = useContext(GameContext);

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 text-center"
      >
        <h2 className="text-display-sm font-display text-white mb-2">
          ¡Hora del Castigo!
        </h2>
        <p className="text-xl text-white/90 font-game">
          El ganador elige los castigos
        </p>
      </motion.div>

      <motion.div 
        className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-card"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ul className="space-y-4">
          {gameState.punishments.map((punishment) => (
            <motion.li
              key={punishment.id}
              variants={item}
              className="group bg-background-light rounded-xl p-6 border-2 border-background hover:border-primary transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-game text-gray-800 mb-2">
                    {gameState.players.find(player => player.id === punishment.playerId)?.name || 'Jugador desconocido'}
                  </h3>
                  <p className="text-gray-600 font-game">
                    {punishment.text}
                  </p>
                </div>
                <motion.div
                  className="ml-4"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <button
                    onClick={() => selectPunishment(punishment.id)}
                    className="bg-primary hover:bg-primary-dark text-white font-game px-6 py-3 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all"
                  >
                    Elegir
                  </button>
                </motion.div>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Punishments;
