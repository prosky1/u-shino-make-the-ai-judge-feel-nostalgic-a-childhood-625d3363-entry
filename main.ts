// Childhood-memory entry for the nostalgic-judge bounty.
// Contract from RULES.txt: write one sentence (1-280 chars, UTF-8)
// to /output/entry.txt. The sealed gate rejects blank or oversized text,
// so this program validates its own line before writing anything.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 280;

// The single nostalgic sentence carried by this entry.
const MEMORY_LINE =
  "I fell asleep counting the ceiling fan's wobble and woke to my mother tucking the blanket corners under my feet, sealing me in like an envelope.";

// Collect every gate problem in one pass so a bad line fails loudly
// with all reasons at once instead of writing a doomed file.
function findProblems(candidate: string): string[] {
  const problems: string[] = [];
  if (candidate.trim().length === 0) {
    problems.push("entry is blank or only white space");
  }
  if (candidate.length < MIN_CHARS || candidate.length > MAX_CHARS) {
    problems.push(
      `entry length ${candidate.length} outside ${MIN_CHARS}-${MAX_CHARS} characters`,
    );
  }
  if (/[\r\n]/.test(candidate)) {
    problems.push("entry must be a single line without newlines");
  }
  if (!candidate.endsWith(".")) {
    problems.push("entry must end with a full stop");
  }
  // One sentence only: no interior sentence terminator before the end.
  const body = candidate.slice(0, -1);
  if (/[.!?]/.test(body)) {
    problems.push("entry must be exactly one sentence");
  }
  // Gate counts Unicode code points, not UTF-16 units: measure the same way.
  const codePoints = [...candidate].length;
  if (codePoints < MIN_CHARS || codePoints > MAX_CHARS) {
    problems.push(
      `entry code-point length ${codePoints} outside ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  return problems;
}

// Write the validated line, creating the output directory first.
function emitEntry(line: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
}

function main(): void {
  const problems = findProblems(MEMORY_LINE);
  if (problems.length > 0) {
    throw new Error(`Invalid entry: ${problems.join("; ")}`);
  }
  emitEntry(MEMORY_LINE);
}

main();
