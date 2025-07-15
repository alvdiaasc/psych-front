import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SessionManager from '../utils/sessionManager';

function UserProfile({ isOpen, onClose, onSave }) {
  const [playerName, setPlayerName] = useState(SessionManager.getSavedPlayerName() || '');
  const [avatarPreview, setAvatarPreview] = useState(SessionManager.getSavedPlayerAvatar());
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Verificar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    // Guardar nombre y avatar
    SessionManager.savePlayerName(playerName.trim());
    if (avatarPreview) {
      SessionManager.savePlayerAvatar(avatarPreview);
    }

    // Llamar callback con los datos actualizados
    onSave({
      playerName: playerName.trim(),
      playerAvatar: avatarPreview
    });

    onClose();
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    localStorage.removeItem(SessionManager.KEYS.PLAYER_AVATAR);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu Perfil</h2>
          <p className="text-gray-600">Personaliza tu avatar y nombre</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {avatarPreview ? (
              <div className="relative">
                <div 
                  className="rounded-full border-4 border-blue-500 overflow-hidden bg-white flex-shrink-0"
                  style={{ 
                    width: '96px', 
                    height: '96px',
                    borderRadius: '50%'
                  }}
                >
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="block"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-200 hover:scale-110"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {playerName.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            {avatarPreview ? 'Cambiar Foto' : 'Subir Foto'}
          </button>
          <p className="text-xs text-slate-500 mt-2">Máximo 2MB</p>
        </div>

        {/* Name Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Nombre de Usuario
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
            maxLength={20}
          />
          <p className="text-xs text-slate-500 mt-2">
            {playerName.length}/20 caracteres
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 font-semibold transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!playerName.trim()}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
          >
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserProfile;
