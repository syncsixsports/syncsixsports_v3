// ======================================================
// SYNC6 — DATE ENGINE (v2 HYBRID)
// Single Source of Truth for ALL date logic
// ======================================================

export type DateBreakdown = {
  month: number;
  day: number;
  year: number;

  yearSplit: [number, number]; // [20, 26]
  yearDigits: number[];        // [2,0,2,6]
  shortYear: number;           // 26
  shortYearDigits: number[];   // [2,6]
  dayDigits: number[];         // [1,4]
};

export type DateNumerology = {
  // Core
  dom: number;

  // UI ROWS (exact match to your system)
  row1_fullSum: number;
  row2_mixedYearDigits: number;
  row3_fullDigits: number;
  row4_shortYear: number;
  row5_shortDigits: number;

  // Date Metrics
  dayOfYear: number;
  daysRemaining: number;

  // ENGINE SYSTEM (critical)
  allComponents: number[];
  uniqueComponents: number[];
  coreNumbers: number[];

  // Hybrid extensions
  primeComponents: number[];
  masterCandidates: number[];

  breakdown: DateBreakdown;
};

// ======================================================
// HELPERS
// ======================================================

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDateParts(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);

  const yearSplit: [number, number] = [
    Math.floor(year / 100),
    year % 100,
  ];

  const yearDigits = year.toString().split("").map(Number);
  const shortYear = year % 100;
  const shortYearDigits = shortYear.toString().split("").map(Number);
  const dayDigits = day.toString().split("").map(Number);

  return {
    month,
    day,
    year,
    yearSplit,
    yearDigits,
    shortYear,
    shortYearDigits,
    dayDigits,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDaysRemaining(date: Date): number {
  const end = new Date(date.getFullYear(), 11, 31);
  const diff = end.getTime() - date.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// ======================================================
// MAIN ENGINE
// ======================================================

export function computeDateNumerology(dateStr: string): DateNumerology {
  const date = parseDate(dateStr);

  const {
    month,
    day,
    year,
    yearSplit,
    yearDigits,
    shortYear,
    shortYearDigits,
    dayDigits,
  } = getDateParts(dateStr);

  const dom = day;

  // --------------------------------------------------
  // UI ROWS (EXACT MATCH TO YOUR SCREENSHOT)
  // --------------------------------------------------

  const row1_fullSum =
    month + day + yearSplit[0] + yearSplit[1];

  const row2_mixedYearDigits =
    month + day + yearDigits.reduce((a, b) => a + b, 0);

  const row3_fullDigits =
    month +
    dayDigits.reduce((a, b) => a + b, 0) +
    yearDigits.reduce((a, b) => a + b, 0);

  const row4_shortYear =
    month + day + shortYear;

  const row5_shortDigits =
    month +
    dayDigits.reduce((a, b) => a + b, 0) +
    shortYearDigits.reduce((a, b) => a + b, 0);

  // --------------------------------------------------
  // DATE METRICS
  // --------------------------------------------------

  const dayOfYear = getDayOfYear(date);
  const daysRemaining = getDaysRemaining(date);

  // --------------------------------------------------
  // ENGINE COMPONENT SYSTEM (CRITICAL)
  // --------------------------------------------------

  const allComponents = [
    month,
    day,
    ...yearSplit,
    ...yearDigits,
    ...dayDigits,
    ...shortYearDigits,
  ];

  const uniqueComponents = Array.from(new Set(allComponents));

  const coreNumbers = [
    dom,
    row1_fullSum,
    row2_mixedYearDigits,
    row3_fullDigits,
    row4_shortYear,
    row5_shortDigits,
    dayOfYear,
    daysRemaining,
  ];

  // --------------------------------------------------
  // HYBRID SIGNAL SUPPORT
  // --------------------------------------------------

  const primeComponents = uniqueComponents.filter(isPrime);

  const masterCandidates = uniqueComponents.filter(
    (n) => n === 11 || n === 22 || n === 33
  );

  // --------------------------------------------------

  return {
    dom,

    row1_fullSum,
    row2_mixedYearDigits,
    row3_fullDigits,
    row4_shortYear,
    row5_shortDigits,

    dayOfYear,
    daysRemaining,

    allComponents,
    uniqueComponents,
    coreNumbers,

    primeComponents,
    masterCandidates,

    breakdown: {
      month,
      day,
      year,
      yearSplit,
      yearDigits,
      shortYear,
      shortYearDigits,
      dayDigits,
    },
  };
}

// ======================================================
// GLOBAL DATE UTILITIES (USED ACROSS APP)
// ======================================================

export function daysBetween(dateA: string, dateB: string): number {
  const d1 = parseDate(dateA);
  const d2 = parseDate(dateB);

  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

export function isSameDay(dateA: string, dateB: string): boolean {
  return dateA === dateB;
}