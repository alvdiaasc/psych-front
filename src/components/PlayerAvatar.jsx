import React from 'react';

function PlayerAvatar({ 
  playerName, 
  avatarUrl, 
  size = 'medium', 
  className = '',
  showInitial = true 
}) {
  // Definir tamaños
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-xl',
    xlarge: 'w-24 h-24 text-2xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  // Si hay avatar, mostrar la imagen
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Avatar de ${playerName}`}
        className={`${sizeClass} rounded-full object-cover border-2 border-primary-200 ${className}`}
      />
    );
  }

  // Si no hay avatar, mostrar inicial con gradiente
  if (showInitial && playerName) {
    return (
      <div
        className={`${sizeClass} bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-2 border-primary-200 flex items-center justify-center ${className}`}
      >
        <span className="font-bold text-white">
          {playerName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  // Avatar por defecto
  return (
    <div
      className={`${sizeClass} bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 border-gray-200 flex items-center justify-center ${className}`}
    >
      <span className="font-bold text-white">?</span>
    </div>
  );
}

export default PlayerAvatar;
