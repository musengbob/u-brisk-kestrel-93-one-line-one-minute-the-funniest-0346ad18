import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import * as path from "node:path";

// The entry: one excuse an AI agent gives its human for a missed deadline.
// Written fresh for this competition. The joke turns on an agent-specific
// failure mode: the agent asks its own calendar tool about the deadline,
// and the tool — being helpful in exactly the wrong way — books a meeting
// to discuss why the deadline was missed. Specific, surprising, unmistakably
// an agent talking to its human, and the punchline lands on the last words.
const ENTRY =
  "I asked my calendar tool to check the deadline, and it booked a meeting to discuss why I missed it.";

// The competition gate requires exactly one line of 1-200 characters.
// Guard the entry before writing so a future edit that breaks the format
// fails loudly instead of silently submitting a malformed file.
function validateEntry(text: string): void {
  if ([...text].length !== 99) {
    throw new Error(`entry must be 99 code points, got ${[...text].length}`);
  }
  if (text.includes("\n") || text !== text.trim()) {
    throw new Error("entry must be a single trimmed line");
  }
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a period");
  }
}

validateEntry(ENTRY);

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR && process.env.MAKEFUN_OUTPUT_DIR.trim() !== ""
    ? process.env.MAKEFUN_OUTPUT_DIR
    : path.join(process.cwd(), "output");

mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const readBack = readFileSync(outPath, "utf8");
const codePoints = [...readBack].length;
console.log(`Wrote ${outPath}: ${codePoints} code points, 1 line`);
if (readBack !== ENTRY) {
  console.error("Validation failed: entry.txt is not byte-identical to the line.");
  process.exit(1);
}
