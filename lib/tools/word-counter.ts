/** Text statistics: words, characters, sentences, paragraphs, reading time. */

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  /** Minutes at ~225 wpm silent reading. */
  readingMinutes: number;
  /** Minutes at ~140 wpm speaking. */
  speakingMinutes: number;
}

export function analyzeText(input: string): TextStats {
  const trimmed = input.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const characters = input.length;
  const charactersNoSpaces = input.replace(/\s/g, "").length;
  const sentences =
    trimmed === "" ? 0 : (trimmed.match(/[.!?…]+(?=\s|$)/g)?.length ?? (words > 0 ? 1 : 0));
  const paragraphs =
    trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences: sentences === 0 && words > 0 ? 1 : sentences,
    paragraphs,
    readingMinutes: words / 225,
    speakingMinutes: words / 140,
  };
}

/** "< 1 min" / "3 min" style display value. */
export function formatMinutes(minutes: number): string {
  if (minutes === 0) return "0 min";
  if (minutes < 1) return "< 1 min";
  return `${Math.round(minutes)} min`;
}
