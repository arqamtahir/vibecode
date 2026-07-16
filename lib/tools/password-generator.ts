/** Cryptographically secure password generation via rejection sampling. */

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
};

const POOLS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
} as const;

export function buildPool(options: PasswordOptions): string {
  let pool = "";
  if (options.lowercase) pool += POOLS.lowercase;
  if (options.uppercase) pool += POOLS.uppercase;
  if (options.digits) pool += POOLS.digits;
  if (options.symbols) pool += POOLS.symbols;
  return pool;
}

/**
 * Uniformly sample characters from the pool using rejection sampling so no
 * character is favoured by modulo bias. Requires a pool of 1-256 characters.
 */
export function generatePassword(options: PasswordOptions): string {
  const pool = buildPool(options);
  if (!pool || options.length < 1) return "";

  const limit = 256 - (256 % pool.length);
  const out: string[] = [];
  const buf = new Uint8Array(options.length * 2);

  while (out.length < options.length) {
    crypto.getRandomValues(buf);
    for (const byte of buf) {
      if (byte < limit) {
        out.push(pool[byte % pool.length]);
        if (out.length === options.length) break;
      }
    }
  }
  return out.join("");
}

/** Shannon entropy of a uniformly sampled password, in bits. */
export function entropyBits(options: PasswordOptions): number {
  const poolSize = buildPool(options).length;
  if (poolSize === 0 || options.length < 1) return 0;
  return Math.round(options.length * Math.log2(poolSize));
}

/** Rough qualitative strength banding for the UI. */
export function strengthLabel(bits: number): "weak" | "fair" | "strong" | "excellent" {
  if (bits < 45) return "weak";
  if (bits < 70) return "fair";
  if (bits < 100) return "strong";
  return "excellent";
}
