export default function AISystemBar({
  games,
  insights,
}: {
  games: any[];
  insights: any[];
}) {
  return (
    <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-white/40 text-center tracking-wide">

      SYNC ENGINE ACTIVE • {games.length} GAMES SCANNED • {insights.length} SIGNALS GENERATED

    </div>
  );
}