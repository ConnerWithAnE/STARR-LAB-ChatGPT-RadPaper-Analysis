import { distance } from "fastest-levenshtein";
import { Severity } from "./types";

export function compareStringPasses(
  a: string,
  b: string,
  c: string
): { pass?: string; severity?: Severity } {
  const distance1 = distance(a, b);
  const distance2 = distance(b, c);
  const distance3 = distance(a, c);

  // all passes are similar enough
  if (distance1 < 5 && distance2 < 5 && distance3 < 5) {
    return { pass: a };
  }
  // if two passes are similar enough
  if ((distance1 < 5 && distance3 < 5) || (distance1 < 5 && distance2 < 5)) {
    return { pass: a, severity: 1 };
  }
  if (distance2 < 5 && distance3 < 5) {
    return { pass: b, severity: 1 };
  }
  return { severity: 2 };
}
