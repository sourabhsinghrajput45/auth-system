const sessions = new Map();

/*
sessionId => {
  accessToken,
  refreshToken,
  accessTokenExpiresAt
}
*/

export function createSession(sessionId, tokens) {
  sessions.set(sessionId, tokens);
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
