import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function Punishments() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  // Buscar el castigo asignado al jugador actual
  const myPunishment = gameState.punishments?.find(p => p.assignedTo === socket?.id);
  const isWinner = gameState.winnerId === socket?.id;
  const isHost = gameState.players && gameState.players[0]?.id === socket?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display text-neutral-800 mb-4">
            ¡Hora de los Castigos!
          </h1>
          {isWinner ? (
            <p className="text-xl font-game text-neutral-600">
              Como ganador, puedes disfrutar viendo a los demás cumplir sus castigos 😈
            </p>
          ) : (
            <p className="text-xl font-game text-neutral-600">
              El ganador ha elegido tu castigo. ¡Es hora de cumplirlo!
            </p>
          )}
        </motion.div>

        <motion.div
          className="main-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isWinner ? (
            /* Vista del ganador - mensaje especial */
            <div className="text-center p-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                👑
              </motion.div>
              <h2 className="text-2xl font-game font-bold text-neutral-800 mb-4">
                ¡Felicidades, Ganador!
              </h2>
              <p className="text-lg font-game text-neutral-600 mb-6">
                Has elegido los castigos para todos los perdedores. 
                Ahora puedes relajarte y disfrutar del espectáculo.
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <p className="font-game font-semibold text-yellow-700">
                  🎉 ¡Disfruta de tu victoria! 🎉
                </p>
              </div>
            </div>
          ) : myPunishment ? (
            /* Vista del perdedor - su castigo específico */
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-danger-50 to-warning-50 border-2 border-danger-200 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-danger-400 to-warning-500 flex items-center justify-center text-white font-display text-lg shadow-md">
                    💀
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-game font-bold text-neutral-800 mb-3">
                      Tu Castigo
                    </h3>
                    <p className="text-neutral-700 font-game leading-relaxed text-lg">
                      {myPunishment.text}
                    </p>
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-game font-semibold ${
                        myPunishment.type === 'drink' ? 'bg-orange-100 text-orange-700' :
                        myPunishment.type === 'prank' ? 'bg-purple-100 text-purple-700' :
                        myPunishment.type === 'physical' ? 'bg-blue-100 text-blue-700' :
                        myPunishment.type === 'silly' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {myPunishment.type === 'drink' ? 'Bebida' :
                         myPunishment.type === 'prank' ? 'Travesura' :
                         myPunishment.type === 'physical' ? 'Físico' :
                         myPunishment.type === 'silly' ? 'Divertido' : 
                         myPunishment.type || 'Otro'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center p-6 bg-accent-50 border-2 border-accent-200 rounded-2xl"
              >
                <p className="font-game font-bold text-accent-700 text-lg mb-2">
                  ¡A cumplir el castigo!
                </p>
                <p className="text-accent-600 font-game">
                  Tómate tu tiempo y hazlo divertido para todos. ¡Que sea épico! 🎭
                </p>
              </motion.div>
            </div>
          ) : (
            /* Error o estado sin castigo */
            <div className="text-center p-8">
              <p className="text-xl font-game text-neutral-600">
                No se encontró tu castigo. Es posible que hubo un error.
              </p>
            </div>
          )}

          {/* Botón para jugar de nuevo - solo para host */}
          {isHost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
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
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Punishments;
