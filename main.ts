import { mkdir, writeFile } from "node:fs/promises";

const OUTPUT_FILE = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 280;

function childhoodMemory(): string {
  const memory = "We raced paper boats in the gutter after rain, and dinner was ready when the streetlights flickered on.";
  return memory;
}

function findProblems(candidate: string): string[] {
  const problems: string[] = [];
  const codePoints = Array.from(candidate);
  if (codePoints.length < MIN_CHARS) problems.push("too short");
  if (codePoints.length > MAX_CHARS) problems.push("too long");
  if (!/\S/.test(candidate)) problems.push("whitespace only");
  if (/[\r\n]/.test(candidate)) problems.push("contains newline");
  if (candidate !== candidate.trim()) problems.push("has leading or trailing space");
  if (/[\u0000-\u001f\u007f]/.test(candidate)) problems.push("contains control character");
  if (!candidate.endsWith(".")) problems.push("must end with a full stop");
  return problems;
}

function assertUtf8RoundTrip(text: string): void {
  const bytes = Buffer.from(text, "utf8");
  const decoded = bytes.toString("utf8");
  if (decoded !== text) {
    throw new Error("utf8 round-trip mismatch");
  }
  if (bytes.length === 0) {
    throw new Error("entry encodes to zero bytes");
  }
}

async function persistEntry(text: string): Promise<void> {
  const slash = OUTPUT_FILE.lastIndexOf("/");
  const parentDir = OUTPUT_FILE.slice(0, slash);
  await mkdir(parentDir, { recursive: true });
  await writeFile(OUTPUT_FILE, text, { encoding: "utf8" });
}

async function run(): Promise<void> {
  const text = childhoodMemory();
  assertUtf8RoundTrip(text);
  const problems = findProblems(text);
  if (problems.length > 0) {
    throw new Error("invalid entry: " + problems.join(", "));
  }
  await persistEntry(text);
}

await run();
