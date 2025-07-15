// Gestor de sesión simple con localStorage
export class SessionManager {
  static KEYS = {
    PLAYER_ID: 'psych_player_id',
    PLAYER_NAME: 'psych_player_name',
    ROOM_CODE: 'psych_room_code',
    SESSION_TIMESTAMP: 'psych_session_timestamp'
  };

  // Generar ID único para el jugador
  static generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Guardar sesión activa
  static saveSession(playerId, playerName, roomCode) {
    localStorage.setItem(this.KEYS.PLAYER_ID, playerId);
    localStorage.setItem(this.KEYS.PLAYER_NAME, playerName);
    localStorage.setItem(this.KEYS.ROOM_CODE, roomCode);
    localStorage.setItem(this.KEYS.SESSION_TIMESTAMP, Date.now().toString());
  }

  // Recuperar sesión existente
  static getSession() {
    const playerId = localStorage.getItem(this.KEYS.PLAYER_ID);
    const playerName = localStorage.getItem(this.KEYS.PLAYER_NAME);
    const roomCode = localStorage.getItem(this.KEYS.ROOM_CODE);
    const timestamp = localStorage.getItem(this.KEYS.SESSION_TIMESTAMP);

    // Verificar que la sesión no sea muy antigua (ej: 24 horas)
    const isSessionValid = timestamp && (Date.now() - parseInt(timestamp)) < 24 * 60 * 60 * 1000;

    if (playerId && playerName && roomCode && isSessionValid) {
      return { playerId, playerName, roomCode };
    }

    return null;
  }

  // Limpiar sesión
  static clearSession() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Obtener o crear ID de jugador
  static getOrCreatePlayerId() {
    let playerId = localStorage.getItem(this.KEYS.PLAYER_ID);
    if (!playerId) {
      playerId = this.generatePlayerId();
      localStorage.setItem(this.KEYS.PLAYER_ID, playerId);
    }
    return playerId;
  }

  // Guardar nombre de jugador
  static savePlayerName(name) {
    localStorage.setItem(this.KEYS.PLAYER_NAME, name);
  }

  // Obtener nombre guardado
  static getSavedPlayerName() {
    return localStorage.getItem(this.KEYS.PLAYER_NAME) || '';
  }
}
