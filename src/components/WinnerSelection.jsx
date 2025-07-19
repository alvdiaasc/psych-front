import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { motion } from 'framer-motion';

function WinnerSelection() {
  const { gameState, socket } = useContext(GameContext);
  const [selectedPunishments, setSelectedPunishments] = useState([]);

  // Verificar que el usuario actual es el ganador o un ganador empatado
  const isWinner = gameState.winnerId === socket?.id;
  const isTiedWinner = gameState.tiedWinners && gameState.tiedWinners.includes(socket?.id);
  const canSelectPunishments = isWinner || isTiedWinner;
  
  // Si no puede seleccionar castigos, mostrar mensaje de error
  if (!canSelectPunishments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Acceso denegado</h2>
            <p className="text-neutral-600 mb-6">
              {gameState.tiedWinners && gameState.tiedWinners.length > 1 
                ? 'Solo los ganadores empatados pueden seleccionar los castigos.'
                : 'Solo el ganador puede seleccionar los castigos.'
              }
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-game text-sm">
                Espera a que el ganador termine de elegir los castigos.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calcular cuántos perdedores hay
  const losersCount = gameState.players ? gameState.players.length - 1 : 0;

  // Función para procesar los placeholders en el texto de preview
  const processPlaceholders = (text) => {
    if (!text) return text;
    
    // Reemplazar {player} con "un jugador"
    let processedText = text.replace(/\{player\}/g, 'un jugador');
    
    // Reemplazar {other} con "otro jugador"
    processedText = processedText.replace(/\{other\}/g, 'otro jugador');
    
    return processedText;
  };

  const togglePunishment = (punishment) => {
    setSelectedPunishments((prev) => {
      if (prev.includes(punishment)) {
        return prev.filter((p) => p !== punishment);
      } else if (prev.length < losersCount) {
        return [...prev, punishment];
      }
      return prev; // No agregar más si ya alcanzó el límite
    });
  };

  const submitPunishments = () => {
    if (selectedPunishments.length !== losersCount) {
      alert(`Debes seleccionar exactamente ${losersCount} castigos para los ${losersCount} perdedores.`);
      return;
    }
    
    socket.emit('selectPunishments', {
      roomCode: gameState.roomCode,
      winnerId: gameState.winnerId,
      selectedPunishments,
    });
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
            {gameState.tiedWinners && gameState.tiedWinners.length > 1 
              ? '¡Felicidades, Ganadores Empatados!' 
              : '¡Felicidades, Ganador!'
            }
          </motion.h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-lg font-game text-neutral-600">
              {gameState.tiedWinners && gameState.tiedWinners.length > 1 
                ? 'El primer ganador empatado en actuar elige los castigos'
                : 'Elige los castigos para los demás jugadores'
              }
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
            Selecciona {losersCount} castigos (uno para cada perdedor)
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
                    : selectedPunishments.length >= losersCount
                    ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-danger-400 to-warning-500 flex items-center justify-center text-white font-display text-sm shadow-md">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-game text-neutral-800 leading-relaxed">
                      {processPlaceholders(punishment.text)}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-game font-semibold ${
                        punishment.type === 'drink' ? 'bg-orange-100 text-orange-700' :
                        punishment.type === 'prank' ? 'bg-purple-100 text-purple-700' :
                        punishment.type === 'physical' ? 'bg-blue-100 text-blue-700' :
                        punishment.type === 'silly' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {punishment.type === 'drink' ? 'Bebida' :
                         punishment.type === 'prank' ? 'Travesura' :
                         punishment.type === 'physical' ? 'Físico' :
                         punishment.type === 'silly' ? 'Divertido' : 
                         punishment.type || 'Otro'}
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
              Seleccionados: {selectedPunishments.length}/{losersCount}
            </p>
            
            <motion.button
              onClick={submitPunishments}
              disabled={selectedPunishments.length !== losersCount}
              className={`w-full max-w-md mx-auto shine ${
                selectedPunishments.length === losersCount
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={
                selectedPunishments.length === losersCount 
                  ? { scale: 1.02, y: -2 } 
                  : {}
              }
              whileTap={
                selectedPunishments.length === losersCount 
                  ? { scale: 0.98 } 
                  : {}
              }
            >
              <span className="flex items-center justify-center gap-3">
                <span>
                  {selectedPunishments.length === losersCount 
                    ? 'Confirmar Castigos' 
                    : `Selecciona ${losersCount - selectedPunishments.length} castigos más`
                  }
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
