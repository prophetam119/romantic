export function parseIsoDate(iso: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

export function isMatchingDate(
  day: number,
  month: number,
  year: number,
  sinceIso: string
): boolean {
  const expected = parseIsoDate(sinceIso);
  return (
    day === expected.day &&
    month === expected.month &&
    year === expected.year
  );
}
