type Insight = {
  text: string;
  type: "player" | "game" | "trend";
  priority: number;
  confidence: "high" | "medium" | "low";
};

type Input = {
  topPlays: any[];
  mostActiveGame: any;
  games: any[];
  numbers: any;
};

export function generateInsights({
  topPlays,
  mostActiveGame,
  games,
  numbers,
}: Input): Insight[] {
  const insights: Insight[] = [];

  const top = topPlays?.[0];
  const game = mostActiveGame;
  const bestGame = games?.[0];

  // 🔥 HERO SIGNAL
  if (top?.score) {
    insights.push({
      text: `${top.name} is today’s strongest alignment play`,
      type: "player",
      priority: 1,
      confidence: top.score > 70 ? "high" : "medium",
    });
  }

  // GAME CLUSTER
  if (game?.awayTeam && game?.homeTeam) {
    insights.push({
      text: `${game.awayTeam} vs ${game.homeTeam} showing highest signal density`,
      type: "game",
      priority: 2,
      confidence: "high",
    });
  }

  // HIGH SYNC
  if (bestGame?.syncScore > 50) {
    insights.push({
      text: `${bestGame.awayTeam} vs ${bestGame.homeTeam} showing elite alignment`,
      type: "game",
      priority: 3,
      confidence: "medium",
    });
  }

  // DOM TREND
  if (numbers?.dom) {
    insights.push({
      text: `DOM ${numbers.dom} is active across today’s slate`,
      type: "trend",
      priority: 4,
      confidence: "medium",
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}