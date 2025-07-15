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
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-200"
                />
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full border-4 border-primary-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
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
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {avatarPreview ? 'Cambiar Foto' : 'Subir Foto'}
          </button>
          <p className="text-xs text-gray-500 mt-1">Máximo 2MB</p>
        </div>

        {/* Name Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            {playerName.length}/20 caracteres
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!playerName.trim()}
            className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserProfile;
