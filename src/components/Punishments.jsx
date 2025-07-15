import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Punishments() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display text-neutral-800 mb-4">
            ¡Hora de los Castigos!
          </h1>
          <p className="text-xl font-game text-neutral-600">
            El ganador ha elegido los siguientes castigos para los perdedores
          </p>
        </motion.div>

        <motion.div
          className="main-card"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="space-y-6">
            {!gameState.punishments || gameState.punishments.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-xl font-game text-neutral-600">
                  No hay castigos disponibles o aún no se han seleccionado.
                </p>
              </div>
            ) : (
              gameState.punishments.map((punishment, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gradient-to-r from-danger-50 to-warning-50 border-2 border-danger-200 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-danger-400 to-warning-500 flex items-center justify-center text-white font-display text-lg shadow-md">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-game font-bold text-neutral-800 mb-2">
                      Castigo #{index + 1}
                    </h3>
                    <p className="text-neutral-700 font-game leading-relaxed">
                      {punishment.text}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-game font-semibold ${
                        punishment.type === 'physical' ? 'bg-blue-100 text-blue-700' :
                        punishment.type === 'silly' ? 'bg-purple-100 text-purple-700' :
                        punishment.type === 'creative' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {punishment.type === 'physical' ? 'Físico' :
                         punishment.type === 'silly' ? 'Divertido' :
                         punishment.type === 'creative' ? 'Creativo' : 'Gracioso'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 p-6 bg-primary-50 border-2 border-primary-200 rounded-2xl"
          >
            <p className="font-game font-bold text-primary-700 text-lg mb-2">
              ¡A cumplir los castigos!
            </p>
            <p className="text-primary-600 font-game mb-4">
              Tómense su tiempo para completar cada castigo. ¡Que sea divertido para todos!
            </p>
          </motion.div>

          {/* Botón para jugar de nuevo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={playAgain}
              className="btn-primary w-full max-w-md mx-auto shine"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-xl">🎮</span>
                <span>Jugar de Nuevo</span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Punishments;
