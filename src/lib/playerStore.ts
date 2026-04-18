let playerMap: Record<string, any> = {};

export function setPlayers(players: any[]) {
  playerMap = {};

  players.forEach((p) => {
    const id = p.playerId || p.id;
    if (id) {
      playerMap[String(id)] = p;
    }
  });
}

export function getPlayerById(id: string) {
  return playerMap[String(id)];
}