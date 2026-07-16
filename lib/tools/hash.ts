import { md5Hex } from "@/lib/tools/md5";

/** Digest helpers over SubtleCrypto, plus a pure-TS MD5 for legacy checksums. */

export const HASH_ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "MD5") return md5Hex(input);
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash with every supported algorithm at once. */
export async function hashAll(input: string): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algo) => [algo, await hashText(input, algo)] as const),
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
