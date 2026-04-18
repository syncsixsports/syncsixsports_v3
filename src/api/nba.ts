// -----------------------------
// FETCH NBA GAMES + TEAM STATS
// -----------------------------

export type GameWithStats = {
  id: string;
  date: string;

  homeTeam: {
    id: string;
    name: string;
    abbr: string;
    stats?: any;
  };

  awayTeam: {
    id: string;
    name: string;
    abbr: string;
    stats?: any;
  };
};

export async function getNBAGamesWithStats(date: string): Promise<GameWithStats[]> {
  try {
    // ESPN expects YYYYMMDD
    const formattedDate = date.replaceAll("-", "");

    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${formattedDate}`
    );

    const data = await res.json();

    const games: GameWithStats[] = (data?.events || [])
    
      .map((event: any) => {
        const competition = event.competitions?.[0];

        const home = competition?.competitors?.find(
          (c: any) => c.homeAway === "home"
        );

        const away = competition?.competitors?.find(
          (c: any) => c.homeAway === "away"
        );

        return {
          id: String(event.id),
          date: event.date,

          homeTeam: {
            id: String(home?.team?.id),
            name: home?.team?.displayName,
            abbr: home?.team?.abbreviation,
          },

          awayTeam: {
            id: String(away?.team?.id),
            name: away?.team?.displayName,
            abbr: away?.team?.abbreviation,
          },
        };
      });

    console.log("FILTERED GAMES:", games.length);

    return games;
  } catch (e) {
    console.error("Game fetch failed:", e);
    return [];
  }
}

// -----------------------------
// 🔥 ADD THIS (ROSTER FETCHER)
// -----------------------------

export async function fetchTeamRoster(teamId: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`
    );

    const data = await res.json();

    const players = data?.athletes || [];

    // 🔥 FETCH DETAILS FOR EACH PLAYER
    const enrichedPlayers = await Promise.all(
      players.map(async (player: any) => {
        const details = await fetchPlayerDetails(String(player.id));

        return {
          id: String(player.id),
          name: player.fullName,
          jersey: player.jersey || "",

          // 🔥 ENRICHED DATA
          age: details?.age,
          height: details?.displayHeight,
          weight: details?.displayWeight,
          college: details?.college?.name,

          position: {
            name: details?.position?.name || "",
            abbreviation: details?.position?.abbreviation || "",
          },

          headshot:
            details?.headshot?.href ||
            `https://a.espncdn.com/i/headshots/nba/players/full/${player.id}.png`,

          dob: details?.dateOfBirth || "",
        };
      })
    );

    return enrichedPlayers;
  } catch (e) {
    console.error("Roster fetch failed:", e);
    return [];
  }
}

export async function fetchPlayerDetails(playerId: string) {
  try {
    const res = await fetch(
      `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}`
    );

    const data = await res.json();

    return data?.athlete || null;
  } catch (e) {
    console.error("Player details fetch failed:", e);
    return null;
  }
}

// -----------------------------
// 🔥 PLAYER GAME LOG FETCHER
// -----------------------------

export async function fetchPlayerGameLog(playerId: string) {
  try {
    const res = await fetch(
      `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerId}/gamelog`
    );

    const data = await res.json();

    // 🔥 FIX: convert object → array
    const eventsObj = data?.events || {};
    const events = Object.values(eventsObj);

    return events.slice(0, 5).map((g: any) => ({
      points: Number(g?.stats?.points ?? 0),
      rebounds: Number(g?.stats?.rebounds ?? 0),
      assists: Number(g?.stats?.assists ?? 0),
    }));
  } catch (e) {
    console.error("Game log fetch failed:", e);
    return [];
  }
}