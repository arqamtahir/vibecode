/** Deterministic-shape lorem ipsum generation from the classical word bank. */

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
  "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud " +
  "exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute " +
  "irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
  "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt " +
  "mollit anim id est laborum"
).split(" ");

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function sentence(startWithLorem: boolean): string {
  const length = randomInt(8, 16);
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(
      startWithLorem && i < 2 ? WORDS[i] : WORDS[randomInt(0, WORDS.length - 1)],
    );
  }
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export interface LoremOptions {
  paragraphs: number;
  sentencesPerParagraph: number;
  /** Always open with the classic "Lorem ipsum dolor sit amet…". */
  startWithLorem: boolean;
  /** Wrap each paragraph in <p>…</p>. */
  html: boolean;
}

export const defaultLoremOptions: LoremOptions = {
  paragraphs: 3,
  sentencesPerParagraph: 5,
  startWithLorem: true,
  html: false,
};

export function generateLorem(options: LoremOptions): string {
  const paragraphs: string[] = [];
  for (let p = 0; p < options.paragraphs; p++) {
    const sentences: string[] = [];
    for (let s = 0; s < options.sentencesPerParagraph; s++) {
      sentences.push(sentence(options.startWithLorem && p === 0 && s === 0));
    }
    const body = sentences.join(" ");
    paragraphs.push(options.html ? `<p>${body}</p>` : body);
  }
  return paragraphs.join("\n\n");
}
