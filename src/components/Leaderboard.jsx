import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Leaderboard() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  // Mostrar botón "Siguiente ronda" si no es la última ronda
  const isLastRound = gameState.round + 1 >= gameState.totalRounds;
  const handleReady = () => {
    socket.emit('playerReady', { roomCode: gameState.roomCode });
  };

  // Ordenar los scores de mayor a menor
  const sortedScores = [...Object.entries(gameState.scores)].sort((a, b) => b[1] - a[1]);
  
  // Determinar las posiciones (considerando empates)
  const rankedScores = sortedScores.map((score, idx) => {
    if (idx === 0) return { id: score[0], score: score[1], position: 1 };
    const prevScore = sortedScores[idx - 1];
    const position = prevScore[1] === score[1] 
      ? rankedScores[idx - 1].position 
      : idx + 1;
    return { id: score[0], score: score[1], position };
  });

  // Emojis para los primeros lugares
  const positionEmojis = {
    1: '👑',
    2: '🥈',
    3: '🥉'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-light via-primary-light to-accent-light p-4 relative overflow-hidden"
    >
      {/* Confeti animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-4 h-4"
            animate={{
              y: [-20, window.innerHeight + 20],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth + (Math.random() * 200 - 100)
              ],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "linear",
            }}
          >
            <div 
              className="w-full h-full transform rotate-45"
              style={{
                backgroundColor: ['#FFD700', '#FF69B4', '#7FFF00', '#00BFFF'][index % 4],
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-2xl space-y-8 relative z-10"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.h2
          className="text-display font-display text-white text-center drop-shadow-lg tracking-wide mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ¡Tabla de Posiciones!
        </motion.h2>

        <div className="space-y-4">
          {rankedScores.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-card transform transition-all ${
                player.position <= 3 ? 'scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full font-game text-2xl ${
                    player.position === 1 
                      ? 'bg-yellow-400 text-white' 
                      : player.position === 2
                      ? 'bg-gray-300 text-gray-800'
                      : player.position === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {positionEmojis[player.position] || player.position}
                  </div>
                  <div>
                    <h3 className="font-game text-xl text-gray-800">
                      {gameState.players.find(p => p.id === player.id)?.name}
                    </h3>
                    <p className="text-gray-500 font-sans">
                      Ronda {player.round}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="font-game text-2xl text-primary"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {player.score}
                  </motion.div>
                  <span className="text-gray-400 font-game">pts</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botón animado de volver al inicio */}
        <motion.button
          onClick={playAgain}
          className="group w-full bg-gradient-to-br from-accent to-accent-dark text-white font-game text-xl py-4 rounded-xl shadow-game hover:shadow-game-hover transform hover:-translate-y-1 transition-all relative overflow-hidden mt-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="tracking-wide">¡Siguiente Ronda!</span>
          </span>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Leaderboard;
