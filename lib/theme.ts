/**
 * Theme handling - cookie-persisted, SSR-safe, no flash of the wrong theme.
 *
 * Strategy: the cookie is the source of truth for persistence. A small blocking
 * inline script (see `themeInitScript`) runs during HTML parse - before first
 * paint - and applies `data-theme` from the cookie. This keeps every page fully
 * static (no `cookies()` call that would force dynamic rendering) while avoiding
 * any flash. The <ThemeToggle> writes the cookie and flips the attribute live.
 */

export type Theme = "dark" | "light";

export const THEME_COOKIE = "theme";
export const DEFAULT_THEME: Theme = "light";
/** One year, in seconds. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Runs synchronously in <head> before paint. Reads the theme cookie and sets
 * `data-theme` on <html>, falling back to the default. Kept tiny and dependency-free.
 */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(dark|light)/);document.documentElement.setAttribute('data-theme',m?m[1]:'${DEFAULT_THEME}');}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;
