type Numbers = {
  dom: number;
  full: number;
  partial: number;
  collapse: number;
  simplified: number;
  root: number;
};

type Props = {
  numbers: Numbers;
};

export default function NumbersOfDayCard({ numbers }: Props) {
  if (!numbers) return null;

  const { dom, full, partial } = numbers;

  // ✅ Simple logic (clean for now)
  const key = full;
  const alt = partial;

  return (
    <div className="mt-6">

      {/* HEADER */}
      <div className="text-xs tracking-wide text-white/40 mb-2 px-1">
        NUMBERS OF THE DAY
      </div>

      {/* CARD */}
      <div className="
        rounded-xl
        border border-white/10
        bg-gradient-to-b from-[#0b0b12] to-[#050507]
        p-4
      ">

        {/* ===================== */}
        {/* TOP ROW (3 TILES) */}
        {/* ===================== */}
        <div className="grid grid-cols-3 gap-3">

          {/* DOM */}
          <div className="
            rounded-lg
            border border-orange-400/30
            bg-orange-500/5
            p-3 text-center
          ">
            <div className="text-xl font-semibold text-orange-400">
              {dom}
            </div>
            <div className="text-[10px] text-white/40 tracking-wide mt-1">
              DOM
            </div>
          </div>

          {/* KEY */}
          <div className="
            rounded-lg
            border border-cyan-400/30
            bg-cyan-500/5
            p-3 text-center
          ">
            <div className="text-xl font-semibold text-cyan-400">
              {key}
            </div>
            <div className="text-[10px] text-white/40 tracking-wide mt-1">
              KEY
            </div>
          </div>

          {/* ALT */}
          <div className="
            rounded-lg
            border border-purple-400/30
            bg-purple-500/5
            p-3 text-center
          ">
            <div className="text-xl font-semibold text-purple-400">
              {alt}
            </div>
            <div className="text-[10px] text-white/40 tracking-wide mt-1">
              ALT
            </div>
          </div>

        </div>

        {/* ===================== */}
        {/* GEMATRIA / SIGNAL ROW */}
        {/* ===================== */}
        <div className="mt-4 grid grid-cols-2 gap-3">

          {/* GEMATRIA */}
          <div className="
            rounded-lg
            border border-white/10
            bg-white/5
            px-3 py-2
          ">
            <div className="text-[10px] text-white/40 tracking-wide mb-1">
              GEMATRIA
            </div>
            <div className="text-sm text-white/80">
              Knicks = 73
            </div>
          </div>

          {/* SIGNAL */}
          <div className="
            rounded-lg
            border border-green-400/20
            bg-green-500/5
            px-3 py-2 text-center
          ">
            <div className="text-[10px] text-white/40 tracking-wide mb-1">
              SIGNAL
            </div>
            <div className="text-sm text-green-400 font-medium">
              Strong
            </div>
          </div>

        </div>

        {/* ===================== */}
        {/* ACTION */}
        {/* ===================== */}
        <button className="
          mt-4 w-full
          py-2
          rounded-lg
          border border-orange-400/30
          bg-orange-500/10
          text-sm
          tracking-wide
          text-orange-300
          hover:bg-orange-500/20
          transition
        ">
          OPEN CALCULATOR
        </button>

      </div>
    </div>
  );
}