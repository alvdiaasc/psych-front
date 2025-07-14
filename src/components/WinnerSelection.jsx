import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function WinnerSelection() {
  const { gameState, socket } = useContext(GameContext);
  const [selectedPunishments, setSelectedPunishments] = useState([]);

  const togglePunishment = (punishment) => {
    setSelectedPunishments((prev) => {
      if (prev.includes(punishment)) {
        return prev.filter((p) => p !== punishment);
      } else {
        return [...prev, punishment];
      }
    });
  };

  const submitPunishments = () => {
    if (selectedPunishments.length === 0) {
      // Si no hay castigos seleccionados, usar castigos por defecto
      const defaultPunishments = gameState.availablePunishments?.slice(0, 2) || [
        { text: "Hacer 10 flexiones", type: "physical" },
        { text: "Cantar una canción", type: "silly" }
      ];
      socket.emit('selectPunishments', {
        roomCode: gameState.roomCode,
        winnerId: gameState.winnerId,
        selectedPunishments: defaultPunishments,
      });
    } else {
      socket.emit('selectPunishments', {
        roomCode: gameState.roomCode,
        winnerId: gameState.winnerId,
        selectedPunishments,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-display text-neutral-800 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ¡Felicidades, Ganador!
          </motion.h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-lg font-game text-neutral-600">
              Elige los castigos para los demás jugadores
            </p>
          </div>
        </motion.div>

        <motion.div
          className="main-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-game font-bold text-neutral-800 text-center mb-6">
            Selecciona los castigos (máximo 3)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {gameState.availablePunishments?.map((punishment, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => togglePunishment(punishment)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedPunishments.includes(punishment)
                    ? 'bg-primary-100 border-primary-400 shadow-lg'
                    : 'bg-white border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-danger-400 to-warning-500 flex items-center justify-center text-white font-display text-sm shadow-md">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-game text-neutral-800 leading-relaxed">
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
                  <div className="flex-shrink-0">
                    {selectedPunishments.includes(punishment) && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-500 font-game mb-4">
              Seleccionados: {selectedPunishments.length}/3
            </p>
            
            <motion.button
              onClick={submitPunishments}
              className="btn-primary w-full max-w-md mx-auto shine"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-3">
                <span>
                  {selectedPunishments.length === 0 ? 'Continuar sin Castigos' : 'Confirmar Castigos'}
                </span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WinnerSelection;
