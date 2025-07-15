import React from 'react';

function PlayerAvatar({ 
  playerName, 
  avatarUrl, 
  size = 'medium', 
  className = '',
  borderColor = 'border-blue-500',
  showInitial = true 
}) {
  // Definir tamaños con medidas exactas
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-xl',
    xlarge: 'w-24 h-24 text-2xl'
  };

  // Obtener medidas numéricas para styles inline
  const sizePixels = {
    small: { width: '32px', height: '32px' },
    medium: { width: '48px', height: '48px' },
    large: { width: '64px', height: '64px' },
    xlarge: { width: '96px', height: '96px' }
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const sizeStyle = sizePixels[size] || sizePixels.medium;

  // Si hay avatar, mostrar la imagen
  if (avatarUrl) {
    return (
      <div 
        className={`rounded-full border-2 ${borderColor} overflow-hidden bg-white flex-shrink-0 ${className}`}
        style={{
          ...sizeStyle,
          borderRadius: '50%'
        }}
      >
        <img
          src={avatarUrl}
          alt={`Avatar de ${playerName}`}
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
    );
  }

  // Si no hay avatar, mostrar inicial con gradiente
  if (showInitial && playerName) {
    return (
      <div
        className={`${sizeClass} bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-2 ${borderColor} flex items-center justify-center flex-shrink-0 ${className}`}
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
      className={`${sizeClass} bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 ${borderColor} flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <span className="font-bold text-white">?</span>
    </div>
  );
}

export default PlayerAvatar;
