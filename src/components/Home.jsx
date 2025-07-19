import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import SessionManager from '../utils/sessionManager';
import UserProfile from './UserProfile';
import PlayerAvatar from './PlayerAvatar';
import { motion } from 'framer-motion';

function Home() {
  const { socket, gameState, createRoom, joinRoom, leaveRoom } = useContext(GameContext);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  // Cargar datos del perfil al iniciar
  useEffect(() => {
    try {
      const profile = SessionManager?.getPlayerProfile?.() || {};
      if (profile.playerName) {
        setPlayerName(profile.playerName);
      }
      if (profile.playerAvatar) {
        setPlayerAvatar(profile.playerAvatar);
      }
    } catch (error) {
      console.error('Error loading player profile:', error);
    }
  }, []);

  // Si estamos en una sala pero queremos volver al home
  if (gameState.phase !== 'home' && gameState.phase !== 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-200/50 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">¿Quieres salir del juego?</h2>
          <p className="text-neutral-600 mb-6">Si sales ahora, perderás tu progreso en la partida actual.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={leaveRoom}
              className="bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Salir del Juego
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-neutral-400 to-neutral-500 hover:from-neutral-500 hover:to-neutral-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Mostrar estado de reconexión
  if (gameState.isReconnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-200/50"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">Reconectando...</h2>
            <p className="text-neutral-600">Volviendo a tu partida en curso</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('¡Necesitas un nombre para jugar!');
      return;
    }
    setError('');
    createRoom(playerName, playerAvatar);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('¡Necesitas un nombre y un código de sala!');
      return;
    }
    if (!socket) {
      setError('Conexión con el servidor no establecida. ¡Inténtalo de nuevo!');
      return;
    }
    setError('');
    joinRoom(roomCode, playerName, playerAvatar);
  };

  const handleProfileSave = (profileData) => {
    setPlayerName(profileData.playerName);
    setPlayerAvatar(profileData.playerAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col items-center justify-center p-4 relative">
      {/* Contenido principal */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo / Título */}
        <motion.div
          className="text-center mb-12"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-display text-neutral-800 mb-4 tracking-wide"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            PSYCH!
          </motion.h1>
          <motion.p 
            className="text-xl font-game text-neutral-600 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
          </motion.p>
        </motion.div>

        {/* Tarjeta principal */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50 space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.3 
          }}
        >
          {/* Sección de Perfil */}
          <motion.div
            className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-5 text-white shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <PlayerAvatar 
                  playerName={playerName} 
                  avatarUrl={playerAvatar} 
                  size="large"
                  borderColor="border-white"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {playerName || 'Tu Perfil'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {playerName ? 'Toca para editar' : 'Configura tu perfil'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="bg-white/20 hover:bg-white/35 p-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Input código de sala */}
          <motion.div
            className="space-y-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-neutral-700 font-semibold text-lg">
              Código de sala (opcional)
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl text-center text-lg font-bold tracking-wider uppercase text-neutral-700 placeholder-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none"
              placeholder="ABCD"
              maxLength={6}
            />
          </motion.div>

          {/* Mensaje de error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Botones de acción */}
          <motion.div
            className="space-y-4 pt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="flex items-center justify-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Nueva Sala
              </span>
            </motion.button>

            <motion.button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="w-full bg-gradient-to-r from-accent-500 to-success-500 hover:from-accent-600 hover:to-success-600 disabled:from-neutral-300 disabled:to-neutral-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              whileHover={roomCode.trim() ? { y: -2 } : {}}
              whileTap={roomCode.trim() ? { y: 0 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="flex items-center justify-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Unirse con Código
              </span>
            </motion.button>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            className="text-center pt-4 border-t border-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm text-neutral-500 font-game">
              Crea una sala para empezar o únete con un código
            </p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer decorativo */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-neutral-500 font-game text-sm"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modal de perfil */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onSave={handleProfileSave}
      />
    </div>
  );
}

export default Home;