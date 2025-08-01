import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

function Leaderboard() {
  const { gameState, socket } = useContext(GameContext);

  const playAgain = () => {
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  const startPunishmentRound = () => {
    socket.emit('startPunishmentRound', { roomCode: gameState.roomCode });
  };

  // Función para obtener el nombre del jugador por ID
  const getPlayerName = (playerId) => {
    const player = gameState.players?.find(p => p.id === playerId);
    return player ? player.name : 'Jugador desconocido';
  };

  // Función para obtener el avatar del jugador por ID
  const getPlayerAvatar = (playerId) => {
    const player = gameState.players?.find(p => p.id === playerId);
    return player ? player.avatar : null;
  };

  // Función para renderizar el avatar del jugador
  const renderPlayerAvatar = (playerId, size = 'w-6 h-6') => {
    const player = gameState.players?.find(p => p.id === playerId);
    if (!player) return null;

    if (player.avatar && player.avatar.startsWith('data:image')) {
      // Si es una imagen base64, mostrarla como imagen
      return (
        <img 
          src={player.avatar} 
          alt={player.name}
          className={`${size} rounded-full object-cover shadow-sm`}
        />
      );
    } else if (player.avatar) {
      // Si es un emoji o texto, mostrarlo como texto
      return (
        <div className={`${size} rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {player.avatar}
        </div>
      );
    } else {
      // Si no hay avatar, mostrar inicial del nombre
      return (
        <div className={`${size} rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {player.name.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  const isLastRound = gameState.round >= gameState.totalRounds;
  const isGameFinished = gameState.isGameFinished;
  const isHost = gameState.players && gameState.players[0]?.id === socket?.id;
  
  const handleReady = () => {
    socket.emit('playerReady', { roomCode: gameState.roomCode });
  };

  // Ordenar los scores de mayor a menor
  const sortedScores = gameState.scores ? [...Object.entries(gameState.scores)].sort((a, b) => b[1] - a[1]) : [];
  
  // Calcular quién es el ganador o si hay empate
  const isWinner = sortedScores.length > 0 && sortedScores[0][0] === socket?.id;
  const isTiedWinner = gameState.tiedWinners && gameState.tiedWinners.includes(socket?.id);
  const hasTie = gameState.tiedWinners && gameState.tiedWinners.length > 1;
  
  // Determinar las posiciones (considerando empates)
  const rankedScores = sortedScores.length > 0 ? sortedScores.map((score, idx) => {
    if (idx === 0) return { id: score[0], score: score[1], position: 1 };
    const prevScore = sortedScores[idx - 1];
    // Calcular posición basada en scores anteriores
    let position = idx + 1;
    for (let i = idx - 1; i >= 0; i--) {
      if (sortedScores[i][1] === score[1]) {
        position = i + 1;
      } else {
        break;
      }
    }
    return { id: score[0], score: score[1], position };
  }) : [];

  // Obtener datos del jugador para cada puntuación
  const playersWithScores = rankedScores.length > 0 ? rankedScores.map(scoreData => {
    const player = gameState.players?.find(p => p.id === scoreData.id);
    return {
      ...scoreData,
      name: player?.name || 'Jugador Desconocido'
    };
  }) : [];

  // Configuración para posiciones (sin emojis)
  const positionConfig = {
    1: { color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    2: { color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
    3: { color: 'from-amber-600 to-amber-800', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-20 h-20 bg-white/10 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + index * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        {/* Header */}
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
            {isLastRound ? 'Resultados Finales' : 'Puntuaciones'}
          </motion.h1>
          
          {/* Indicador de empate */}
          {isLastRound && hasTie && (
            <motion.div
              className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl px-6 py-3 inline-block shadow-lg mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg font-game text-yellow-800 font-bold">
                ¡Empate en el primer lugar! 
                <span className="block text-sm mt-1">
                  {gameState.tiedWinners.length} jugadores empatados
                </span>
              </p>
            </motion.div>
          )}
          
          {!isLastRound && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 inline-block shadow-lg">
              <p className="text-lg font-game text-neutral-600">
                Ronda {gameState.round + 1} de {gameState.totalRounds}
              </p>
            </div>
          )}
        </motion.div>

        {/* Resultados de votación de la ronda anterior */}
        {gameState.votes && gameState.answers && Object.keys(gameState.votes).length > 0 && (
          <motion.div
            className="main-card mb-8"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.h3 
              className="text-2xl font-display font-bold text-center text-primary-700 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎯 Resultados de la Votación
            </motion.h3>

            {/* Mostrar quién es el autor de cada respuesta y quién votó por ella */}
            <div className="space-y-4">
              {gameState.answers?.map((answer, index) => {
                // Encontrar quién votó por esta respuesta
                const votersForThisAnswer = Object.entries(gameState.votes)
                  .filter(([voterId, votedAnswerId]) => votedAnswerId === answer.id)
                  .map(([voterId]) => voterId);

                return (
                  <motion.div
                    key={answer.id}
                    className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-4 border-l-4 border-primary-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {/* Respuesta (sin mostrar autor) */}
                    <div className="mb-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-neutral-700 font-game text-lg leading-relaxed mb-2 bg-white p-3 rounded-lg shadow-sm">
                            "{answer.text}"
                          </p>
                          <div className="flex items-center gap-2">
                            {answer.playerId ? (
                              <>
                                <span className="text-2xl">✍️</span>
                                <p className="text-sm font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                                  Respuesta de jugador
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">🎲</span>
                                <p className="text-sm font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                  Respuesta oficial del juego
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Votantes */}
                    <div className="border-t border-neutral-200 pt-3">
                      {votersForThisAnswer.length > 0 ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🗳️</span>
                            <p className="text-sm font-semibold text-secondary-600">
                              Votaron por esta respuesta: 
                              <span className="ml-2 bg-secondary-200 text-secondary-800 px-2 py-1 rounded-full text-xs font-bold">
                                {votersForThisAnswer.length} {votersForThisAnswer.length === 1 ? 'voto' : 'votos'}
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {votersForThisAnswer.map((voterId) => (
                              <motion.div
                                key={voterId}
                                className="flex items-center gap-2 bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 px-3 py-2 rounded-full text-sm font-game shadow-sm border border-secondary-300"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 300 }}
                              >
                                <div className="flex-shrink-0">
                                  {renderPlayerAvatar(voterId, 'w-6 h-6')}
                                </div>
                                <span className="font-semibold">{getPlayerName(voterId)}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center py-2 text-neutral-500">
                          <span className="text-2xl">😔</span>
                          <p className="text-sm italic">
                            Nadie votó por esta respuesta
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Estadísticas adicionales */}
            <motion.div
              className="mt-6 pt-4 border-t border-neutral-200 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-neutral-600 font-game">
                📊 Total de votos: {Object.keys(gameState.votes).length} de {gameState.players?.length} jugadores
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Podio para los top 3 */}
        {playersWithScores.length >= 3 && (
          <motion.div
            className="main-card mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-game font-bold text-neutral-800 text-center mb-6">
              Podio de Ganadores
            </h2>
            
            <div className="flex justify-center items-end gap-4 mb-6">
              {/* Segundo lugar */}
              {playersWithScores[1] && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold">2º</span>
                  </div>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${positionConfig[2].color} flex items-center justify-center text-white font-display text-xl shadow-lg mb-2`}>
                    {playersWithScores[1].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-game font-semibold text-neutral-800 text-sm">
                    {playersWithScores[1].name}
                  </p>
                  <p className="text-xl font-bold text-gray-600">
                    {playersWithScores[1].score} pts
                  </p>
                </motion.div>
              )}

              {/* Primer lugar */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >                  <div className="w-24 h-20 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center mb-2 relative">
                    <span className="text-white font-bold text-lg">1º</span>
                  </div>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${positionConfig[1].color} flex items-center justify-center text-white font-display text-2xl shadow-xl mb-2`}>
                  {playersWithScores[0].name.charAt(0).toUpperCase()}
                </div>
                <p className="font-game font-semibold text-neutral-800">
                  {playersWithScores[0].name}
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {playersWithScores[0].score} pts
                </p>
              </motion.div>

              {/* Tercer lugar */}
              {playersWithScores[2] && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-16 h-12 bg-gradient-to-t from-amber-600 to-amber-700 rounded-t-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">3º</span>
                  </div>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${positionConfig[3].color} flex items-center justify-center text-white font-display text-lg shadow-lg mb-2`}>
                    {playersWithScores[2].name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-game font-semibold text-neutral-800 text-sm">
                    {playersWithScores[2].name}
                  </p>
                  <p className="text-lg font-bold text-amber-700">
                    {playersWithScores[2].score} pts
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Lista completa de jugadores */}
        <motion.div
          className="main-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-game font-bold text-neutral-800 text-center mb-4">
            Clasificación Completa
          </h3>
          
          <div className="space-y-3">
            <AnimatePresence>
              {playersWithScores.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${
                    player.position <= 3 
                      ? `${positionConfig[player.position]?.bgColor} ${positionConfig[player.position]?.textColor} border-current` 
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  } hover:scale-105 transition-all duration-300`}
                >
                  {/* Posición */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-2xl font-bold">
                      #{player.position}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-display text-lg shadow-md ${
                    player.position <= 3 
                      ? `bg-gradient-to-br ${positionConfig[player.position]?.color}` 
                      : 'bg-gradient-to-br from-neutral-400 to-neutral-600'
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Información del jugador */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-game font-semibold text-lg">
                        {player.name}
                      </p>
                      {/* Indicador de empate */}
                      {gameState.tiedWinners && gameState.tiedWinners.includes(player.id) && gameState.tiedWinners.length > 1 && (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                          EMPATE
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-75">
                      Posición: {player.position}°
                    </p>
                  </div>

                  {/* Puntuación */}
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {player.score}
                    </p>
                    <p className="text-sm opacity-75">
                      puntos
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {isGameFinished ? (
            <>
              {/* Juego terminado - mostrar opciones finales */}
              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 max-w-md mx-auto mb-6">
                <div className="text-center">
                  <p className="font-game font-bold text-primary-700 text-xl mb-2">
                    ¡Juego Terminado!
                  </p>
                  <p className="text-primary-600 font-game">
                    ¿Qué quieres hacer ahora?
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                {/* Botón de Ronda de Castigos (para ganador o ganadores empatados) */}
                {(isWinner || isTiedWinner) && (
                  <motion.button
                    onClick={startPunishmentRound}
                    className="btn-secondary w-full shine"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span>🎭</span>
                      <span>
                        {hasTie ? 'Iniciar Castigos (Ganador Empatado)' : 'Ronda de Castigos'}
                      </span>
                    </span>
                  </motion.button>
                )}

                {/* Botón de Jugar de Nuevo (solo para host) */}
                {isHost && (
                  <motion.button
                    onClick={playAgain}
                    className="btn-primary w-full shine"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span>🔄</span>
                      <span>Jugar de Nuevo</span>
                    </span>
                  </motion.button>
                )}

                {/* Mensaje para jugadores que no son ganador ni host */}
                {!isWinner && !isHost && (
                  <div className="bg-accent-50 border-2 border-accent-200 rounded-2xl p-6">
                    <div className="text-center">
                      <p className="font-game font-semibold text-accent-700 mb-1">
                        Esperando decisiones
                      </p>
                      <p className="text-sm text-accent-600 font-game">
                        El ganador puede elegir castigos o el host puede iniciar una nueva partida
                      </p>
                    </div>
                  </div>
                )}

                {/* Mensaje especial para el ganador */}
                {isWinner && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                    <div className="text-center">
                      <p className="font-game font-semibold text-yellow-700 mb-1">
                        ¡Eres el ganador! 🏆
                      </p>
                      <p className="text-sm text-yellow-600 font-game">
                        Puedes elegir castigos para los {gameState.players.length - 1} perdedores
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Continuar siguiente ronda */}
              <div className="bg-accent-50 border-2 border-accent-200 rounded-2xl p-6 max-w-md mx-auto mb-6">
                <div className="text-center">
                  <p className="font-game font-semibold text-accent-700 mb-1">
                    Preparándose para la siguiente ronda...
                  </p>
                  <p className="text-sm text-accent-600 font-game">
                    Esperando a todos los jugadores
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleReady}
                disabled={gameState.ready?.includes(socket?.id)}
                className={`btn-secondary w-full max-w-md mx-auto shine ${
                  gameState.ready?.includes(socket?.id) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                whileHover={
                  !gameState.ready?.includes(socket?.id) 
                    ? { scale: 1.02, y: -2 } 
                    : {}
                }
                whileTap={
                  !gameState.ready?.includes(socket?.id) 
                    ? { scale: 0.98 } 
                    : {}
                }
              >
                <span className="flex items-center justify-center gap-3">
                  <span>
                    {gameState.ready?.includes(socket?.id) ? 'Listo!' : 'Estoy Listo'}
                  </span>
                </span>
              </motion.button>

              {/* Contador de jugadores listos */}
              <div className="text-center mt-4">
                <p className="text-sm text-neutral-500 font-game">
                  {gameState.ready?.length || 0} de {gameState.players?.length || 0} jugadores listos
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Leaderboard;