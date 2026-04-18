// ======================================================
// SYNC6 — GEMATRIA ENGINE (v1 SIMPLE + BIRTHDAY SUPPORT)
// ======================================================

export type GematriaBreakdown = {
  char: string;
  value: number;
};

export type GematriaResult = {
  value: number;
  breakdown: GematriaBreakdown[];
  clean: string;
};

export type BirthdayCheck = {
  isToday: boolean;
  month: number | null;
  day: number | null;
};

// ======================================================
// PYTHAGOREAN TABLE (REDUCTION)
// ======================================================

const TABLE: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
};

// ======================================================
// GEMATRIA CORE
// ======================================================

export function computeGematria(input: string): GematriaResult {
  const clean = (input || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const breakdown = clean.split("").map((char) => ({
    char,
    value: TABLE[char] || 0,
  }));

  const value = breakdown.reduce((sum, c) => sum + c.value, 0);

  return {
    value,
    breakdown,
    clean,
  };
}

// ======================================================
// BIRTHDAY CHECK (PST SAFE)
// ======================================================

export function checkBirthday(
  dob: string | null | undefined,
  date: string
): BirthdayCheck {
  if (!dob) {
    return { isToday: false, month: null, day: null };
  }

  try {
    // Use selected date (NOT system date)
    const selected = new Date(date);

    const selectedPST = new Date(
      selected.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      })
    );

    const dobDate = new Date(dob);

    const isToday =
      dobDate.getMonth() === selectedPST.getMonth() &&
      dobDate.getDate() === selectedPST.getDate();

    return {
      isToday,
      month: dobDate.getMonth() + 1,
      day: dobDate.getDate(),
    };
  } catch {
    return { isToday: false, month: null, day: null };
  }
}