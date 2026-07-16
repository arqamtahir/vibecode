import type { ReactNode } from "react";

/**
 * Long-form, crawlable copy per tool, each targeting that tool's search query
 * from the registry. Server-rendered into the static HTML. ~120 words each.
 */
export const toolExplainers: Record<string, { heading: string; body: ReactNode }> = {
  "token-counter": {
    heading: "LLM token counter and cost estimator",
    body: (
      <>
        <p>
          Paste any prompt or text and this token counter shows the token count instantly,
          alongside character and word counts. Tokens - not words - are what large language
          models actually bill and limit, so counting them is the only reliable way to
          predict cost and stay under a model&apos;s context window.
        </p>
        <p>
          Pick from editable pricing presets (model name plus input/output price per
          million tokens) to estimate cost; the presets are just data you can change, and
          Vibecode never fetches live prices. Tokenization runs entirely in your browser
          via a client-side tokenizer, so nothing is uploaded. Counts are an approximation -
          exact tokenization varies by model and provider - but they&apos;re close enough to
          budget confidently and trim prompts before you send them.
        </p>
      </>
    ),
  },
  "prompt-template-builder": {
    heading: "Reusable AI prompt template builder",
    body: (
      <>
        <p>
          Build reusable AI prompts with <code>{"{{variable}}"}</code> placeholders. This
          prompt template builder auto-detects your variables, generates an input field for
          each, and live-renders the finished prompt as you fill them in - so you can craft
          a prompt once and reuse it with different inputs in seconds.
        </p>
        <p>
          Save templates directly on your device (via a cookie, not an account), and export
          or import them as JSON to share with teammates or back them up. Duplicate
          variables are merged and empty ones render cleanly, so the output is always
          predictable. Everything runs in your browser with no signup and no network calls,
          and it works offline once loaded. Copy the filled prompt straight into ChatGPT,
          Claude, or your own app.
        </p>
      </>
    ),
  },
  "env-example-generator": {
    heading: "Generate a safe .env.example",
    body: (
      <>
        <p>
          Paste your <code>.env</code> file and instantly get a sanitized{" "}
          <code>.env.example</code> that keeps every key, comment, and blank line in order
          but blanks out the values. It&apos;s the fastest way to produce the template file
          your repo should commit instead of real secrets, so teammates know exactly which
          variables to set.
        </p>
        <p>
          The tool also flags keys whose names look like secrets - tokens, passwords, API
          keys - as a reminder never to commit their real values. Crucially, because your
          input may contain live credentials, all processing happens entirely in your
          browser: nothing is uploaded, logged, or sent anywhere, and it works offline once
          loaded. Copy the result and drop it straight into your project.
        </p>
      </>
    ),
  },
  "regex-tester": {
    heading: "Test and understand regular expressions",
    body: (
      <>
        <p>
          Enter a regular expression, toggle flags, and type a test string to see every
          match and capture group highlighted live. This regex tester lists each match with
          its index and groups, and - uniquely - gives a plain-English, token-by-token
          explanation of what your pattern actually does, so you can learn regex while you
          debug it.
        </p>
        <p>
          Matching runs inside a sandboxed worker with a time limit, so even a pathological,
          catastrophic-backtracking pattern can never freeze the page - it&apos;s safely
          rejected with a clear message. Invalid expressions show a friendly error instead
          of crashing. Everything runs in your browser with no uploads and no signup, and it
          works offline once loaded. Build, test, and finally understand your regex in one
          place.
        </p>
      </>
    ),
  },
  "css-gradient-generator": {
    heading: "Free CSS gradient generator with live preview",
    body: (
      <>
        <p>
          This CSS gradient generator lets you design linear and radial gradients
          visually and copy production-ready CSS in one click. Add as many color stops as
          you need, drag each one&apos;s position, pick exact colors, and dial in the angle
          for linear gradients - all with a large live preview so you see the result
          instantly.
        </p>
        <p>
          It outputs a clean <code>background</code> declaration you can paste straight
          into your stylesheet, with stops sorted and percentages rounded. Everything runs
          in your browser, so there are no network calls, no signup, and it keeps working
          offline once loaded. Whether you want a subtle two-tone fade or a vivid
          multi-stop blend, the gradient generator makes it quick to experiment and ship.
        </p>
      </>
    ),
  },
  "box-shadow-generator": {
    heading: "Generate CSS box-shadows visually",
    body: (
      <>
        <p>
          Design CSS box-shadows with live feedback and copy the exact code. This
          box-shadow generator supports multiple stacked layers - add as many as you like
          and control the horizontal and vertical offset, blur, spread, color, opacity,
          and the inset flag for each one. A sample element shows precisely how the shadow
          will look as you adjust the sliders.
        </p>
        <p>
          Stacking layers lets you build realistic depth, soft ambient glows, or crisp
          borders that pure single shadows can&apos;t achieve. The tool produces a clean,
          comma-separated <code>box-shadow</code> declaration ready to paste into your CSS.
          It&apos;s entirely client-side - nothing is uploaded, there&apos;s no signup, and
          it works offline after the first load.
        </p>
      </>
    ),
  },
  "color-contrast-checker": {
    heading: "WCAG color contrast checker",
    body: (
      <>
        <p>
          Check whether your text colors meet accessibility standards with this WCAG color
          contrast checker. Pick a foreground and background color and instantly see the
          exact contrast ratio plus pass/fail results for WCAG AA and AAA, for both normal
          and large text. A live preview shows real sample text in your chosen colors.
        </p>
        <p>
          Meeting contrast thresholds (4.5:1 for normal AA text, 3:1 for large) keeps your
          interface readable for everyone, including users with low vision. The tool also
          suggests a tint-and-shade palette from your foreground color so you can find an
          accessible variant fast. It runs fully in your browser - no uploads, no signup -
          and works offline once the page has loaded.
        </p>
      </>
    ),
  },
  "svg-to-jsx": {
    heading: "Convert SVG to JSX for React",
    body: (
      <>
        <p>
          Paste raw SVG and this SVG to JSX converter produces React-ready markup
          instantly. It camelCases attributes like <code>stroke-width</code> →{" "}
          <code>strokeWidth</code>, turns <code>class</code> into <code>className</code>,
          converts inline <code>style</code> strings into JSX style objects, and rewrites
          comments - so the output drops straight into a component without manual cleanup.
        </p>
        <p>
          Optionally wrap the result in a typed React component that spreads props onto the
          root <code>&lt;svg&gt;</code>, making it easy to control size, color, and
          accessibility from the outside. Malformed input is handled gracefully with a
          clear message instead of a crash. Conversion happens entirely in your browser -
          nothing is uploaded - and it works offline after loading.
        </p>
      </>
    ),
  },
  "favicon-generator": {
    heading: "Free favicon generator",
    body: (
      <>
        <p>
          Turn any image into a complete favicon set with this free favicon generator.
          Upload a PNG, JPEG, GIF, WebP, or SVG and the tool renders every standard size -
          16×16, 32×32, 48×48, the 180×180 Apple touch icon, and 192/512 Android icons -
          previews them, and bundles them into a downloadable ZIP alongside ready-to-paste
          HTML <code>&lt;link&gt;</code> tags.
        </p>
        <p>
          Crucially, all image processing happens locally in your browser using the canvas
          API. Your image is never uploaded to any server, which keeps brand assets
          private and makes generation instant. Oversized or non-image files are rejected
          with a clear message. Add the generated tags to your <code>&lt;head&gt;</code>,
          drop the files in your site root, and your favicon works everywhere.
        </p>
      </>
    ),
  },
  "meta-tag-previewer": {
    heading: "Open Graph and meta tag previewer",
    body: (
      <>
        <p>
          Preview how your page will appear on Google, Twitter/X, and Facebook before you
          ship it. Enter a title, description, URL, image, and site name and this Open
          Graph meta tag previewer renders all three cards live, with the same truncation
          rules the real platforms use - so you catch titles that get cut off or missing
          images early.
        </p>
        <p>
          It also generates the complete set of meta tags - standard SEO, Open Graph, and
          Twitter card tags - ready to copy into your <code>&lt;head&gt;</code>. Empty
          fields are omitted so the output stays clean. Everything runs in your browser
          with no uploads and no signup, and it works offline once loaded. Get your social
          share cards and search snippets right the first time.
        </p>
      </>
    ),
  },
  "json-formatter": {
    heading: "Free online JSON formatter and validator",
    body: (
      <>
        <p>
          This JSON formatter and validator beautifies messy or minified JSON into clean,
          indented output you can actually read - and flags invalid JSON with the exact
          line and column of the problem, so you can fix syntax errors fast. Choose 2
          spaces, 4 spaces, or tabs, or minify JSON down to a single line for production.
        </p>
        <p>
          Everything runs in your browser. Your data is never uploaded to a server, which
          makes it safe for API responses, config files, and anything sensitive. Paste a
          payload, click Format or Minify, and copy the result. Because it&apos;s fully
          client-side, the JSON formatter also keeps working offline once the page has
          loaded.
        </p>
      </>
    ),
  },
  "json-to-typescript": {
    heading: "Generate TypeScript interfaces from JSON",
    body: (
      <>
        <p>
          Paste a JSON object or API response and this JSON to TypeScript interface
          generator produces clean, ready-to-use <code>interface</code> definitions. It
          walks nested objects, merges arrays of objects into a single interface, marks
          keys that aren&apos;t always present as optional, and unions mixed value types -
          so the output reflects your real data, not a guess.
        </p>
        <p>
          Stop hand-writing types for every endpoint. Generate them in a second, rename the
          root interface to match your model, and paste the result straight into your
          codebase. The converter runs entirely in your browser - no uploads, no signup,
          and it works offline once loaded - so even private payloads stay on your machine.
        </p>
      </>
    ),
  },
  "jwt-decoder": {
    heading: "Decode JSON Web Tokens online, privately",
    body: (
      <>
        <p>
          This JWT decoder reads the header and payload of any JSON Web Token and
          pretty-prints the claims so you can inspect them at a glance. Standard time
          claims like <code>exp</code>, <code>iat</code>, and <code>nbf</code> are shown as
          human-readable dates, and a badge tells you immediately whether the token is
          valid or expired.
        </p>
        <p>
          Decoding happens entirely in your browser - your token is never sent anywhere,
          which matters because JWTs often carry sensitive session data. Note that this
          tool decodes only; it does <strong>not</strong> verify the signature, since
          verification requires the signing secret or public key. Use it to debug auth
          flows, check expiry, and confirm exactly what a token contains.
        </p>
      </>
    ),
  },
  base64: {
    heading: "Encode and decode Base64 online",
    body: (
      <>
        <p>
          Encode text to Base64 or decode Base64 back to text in one click. This tool is
          fully UTF-8 aware, so emoji and non-Latin characters round-trip correctly, and it
          handles invalid Base64 gracefully with a clear error instead of crashing. You can
          also encode a local file&apos;s bytes to Base64 - useful for data URLs and inline
          assets.
        </p>
        <p>
          All encoding and decoding runs in your browser using the native Base64 routines,
          so nothing you paste or upload ever leaves your device. That makes it safe for
          tokens, credentials, and private files, and it keeps working offline after the
          page loads. Switch direction, paste your input, and copy the result instantly.
        </p>
      </>
    ),
  },
  "uuid-generator": {
    heading: "Generate v4 UUIDs online",
    body: (
      <>
        <p>
          Generate random version-4 UUIDs (also called GUIDs) one at a time or in bulk.
          Set a count and produce a whole batch at once, then copy a single UUID or copy
          them all to the clipboard in one click - ideal for seeding databases, creating
          test fixtures, or assigning unique identifiers.
        </p>
        <p>
          Each UUID is created with your browser&apos;s built-in cryptographic random
          generator, so the values are suitably unpredictable and conform to RFC 4122. The
          generator runs entirely client-side - nothing is requested from or sent to a
          server - which means it&apos;s fast, private, and works offline once the page has
          loaded. No signup, no limits beyond a sensible per-batch maximum.
        </p>
      </>
    ),
  },
  "case-converter": {
    heading: "Convert text between camelCase, snake_case, and more",
    body: (
      <>
        <p>
          Paste any text - a variable name, a sentence, a column header - and this case
          converter shows all eight common forms at once: camelCase, PascalCase,
          snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, and
          UPPERCASE/lowercase. Copy any variant in one click.
        </p>
        <p>
          The converter handles multi-word input, punctuation, numbers, and mixed
          notation - including camelCase input that it splits back into words correctly.
          It&apos;s useful for renaming variables across conventions, transforming
          spreadsheet headers to JSON keys, or converting database column names to
          TypeScript identifiers. Everything runs in your browser with no upload and no
          signup, and it works offline after loading.
        </p>
      </>
    ),
  },
  "markdown-to-html": {
    heading: "Markdown to HTML converter with live preview",
    body: (
      <>
        <p>
          Write or paste Markdown on the left and see the rendered HTML and a clean
          preview on the right, updating as you type. This Markdown to HTML converter
          supports GitHub Flavored Markdown - headings, bold, italic, code blocks,
          tables, ordered and unordered lists, and links - so the output is ready for
          any standard HTML context.
        </p>
        <p>
          The generated HTML is sanitized before rendering in the preview, so embedded
          scripts and unsafe attributes are stripped and can&apos;t run in your browser.
          Copy the HTML source or download it as a file. The editor and converter run
          entirely in your browser with no uploads and no signup. Use it to draft
          documentation, emails, or blog posts and export clean HTML in seconds.
        </p>
      </>
    ),
  },
  "csv-to-json": {
    heading: "CSV to JSON converter with header detection",
    body: (
      <>
        <p>
          Paste a CSV string or upload a file and this CSV to JSON converter produces a
          clean JSON array instantly. When the first row is a header, each row becomes
          an object keyed by column name; without a header, you get an array of arrays.
          Supports comma, tab, semicolon, and pipe delimiters with a single dropdown.
        </p>
        <p>
          Quoted fields - including those that contain the delimiter, embedded newlines,
          or escaped quotes - are handled correctly. Rows with the wrong column count
          are flagged with a clear error message instead of silently corrupting the
          output. Copy the result or download it as a <code>.json</code> file. All
          conversion happens in your browser - nothing is uploaded, no signup required.
        </p>
      </>
    ),
  },
  "timestamp-converter": {
    heading: "Unix timestamp converter - epoch to date and back",
    body: (
      <>
        <p>
          Enter a Unix epoch in seconds or milliseconds, an ISO 8601 string, or a
          human-readable date and this timestamp converter shows all representations at
          once: epoch in seconds, epoch in milliseconds, ISO 8601, UTC, your local
          timezone, and a relative &ldquo;3 hours ago&rdquo; label. Copy any format in
          one click.
        </p>
        <p>
          A live ticker at the top shows the current Unix epoch, updating every second,
          so you always have a reference point. The converter auto-detects whether your
          input is seconds or milliseconds (values above 9 999 999 999 are treated as
          ms). Invalid input shows a clear error instead of a wrong date. Everything
          runs in your browser, offline-capable after the first load.
        </p>
      </>
    ),
  },
  "image-compressor": {
    heading: "Compress and resize images privately in your browser",
    body: (
      <>
        <p>
          Upload a JPEG, PNG, or WebP image and this image compressor shrinks the file
          size using the browser&apos;s canvas API - no server, no upload, no account.
          A quality slider lets you trade file size for fidelity, and an optional
          max-dimension field resizes large images while keeping the aspect ratio.
          Before and after file sizes are shown side by side so you know exactly how
          much you saved.
        </p>
        <p>
          Because all processing happens locally via canvas and FileReader, your images
          never leave your device - important for private photos, client assets, or
          anything sensitive. The tool rejects non-image files and files over 20 MB with
          a clear message. Download the compressed file when you&apos;re happy with the
          result. It works offline once the page has loaded.
        </p>
      </>
    ),
  },
  "qr-code-generator": {
    heading: "Free QR code generator - download PNG and SVG",
    body: (
      <>
        <p>
          Enter any text or URL and this QR code generator produces a scannable code
          instantly, with controls for size (128–512 px) and error-correction level (L,
          M, Q, H). Download the result as a crisp PNG for print or a scalable SVG for
          the web - both generated entirely in your browser with no upload and no
          signup.
        </p>
        <p>
          Higher error-correction levels let the code remain scannable even when
          partially damaged or obscured, which matters when printing on fabric, stickers,
          or curved surfaces. Input up to 2 000 characters is supported; the tool shows
          a character counter and rejects oversized strings with a clear message. QR
          generation uses a client-side library loaded on demand so it doesn&apos;t
          slow down the rest of the page.
        </p>
      </>
    ),
  },
  "cron-builder": {
    heading: "Build and understand cron expressions",
    body: (
      <>
        <p>
          This cron expression builder lets you assemble a schedule visually - pick the
          minute, hour, day of month, month, and day of week using simple controls for
          &ldquo;every&rdquo;, &ldquo;every N&rdquo;, or specific values - and it writes the
          correct five-field cron expression for you. No more guessing at asterisks and
          slashes.
        </p>
        <p>
          As you build, the tool shows a plain-English description of exactly when the job
          will run, so you can confirm the schedule before pasting it into crontab, a CI
          pipeline, or a scheduler. Everything happens in your browser, with no uploads and
          no signup, and it works offline once loaded. Copy the finished expression with a
          single click.
        </p>
      </>
    ),
  },
  "password-generator": {
    heading: "Strong password generator, fully in your browser",
    body: (
      <>
        <p>
          This password generator creates strong random passwords using your browser&apos;s
          cryptographic random source (crypto.getRandomValues) with rejection sampling, so
          every character is drawn uniformly with no modulo bias. Choose the length and mix
          of lowercase, uppercase, digits, and symbols, and the tool shows the resulting
          entropy in bits - the honest measure of how hard a password is to brute-force.
        </p>
        <p>
          Because generation is 100% client-side, the password exists only on your machine:
          nothing is transmitted, logged, or stored. Aim for at least 70-80 bits of entropy
          for important accounts, and prefer a password manager over memorising anything.
          The tool works offline once the page has loaded.
        </p>
      </>
    ),
  },
  "diff-checker": {
    heading: "Compare two texts online, privately",
    body: (
      <>
        <p>
          Paste two versions of any text - code, config, prose, JSON - and this diff
          checker highlights exactly which lines were added and removed, using the same
          Myers algorithm that powers git diff. Line numbers for both versions make it easy
          to trace a change back to its source, and a one-click copy gives you a
          unified-diff-style summary for a commit message or code review.
        </p>
        <p>
          Diffing happens entirely in your browser, which matters when you&apos;re comparing
          things you shouldn&apos;t paste into random websites: contracts, .env files, API
          responses with tokens. Nothing is uploaded, nothing is stored, and the tool keeps
          working offline after the page loads.
        </p>
      </>
    ),
  },
  "hash-generator": {
    heading: "MD5, SHA-1, SHA-256, SHA-384 & SHA-512 hashes online",
    body: (
      <>
        <p>
          Type or paste any text and this hash generator computes MD5, SHA-1, SHA-256,
          SHA-384, and SHA-512 digests simultaneously, live as you type. The SHA family is
          computed with your browser&apos;s native Web Crypto API, so it&apos;s fast and
          exactly matches the output of tools like sha256sum. Each digest copies with one
          click as lowercase hex.
        </p>
        <p>
          Use SHA-256 or stronger for anything security-related - MD5 and SHA-1 are
          included only for legacy checksums and cache keys, as both are cryptographically
          broken for collision resistance. Hashing runs 100% client-side: your input never
          leaves the page, which makes this safe for hashing things you&apos;d never submit
          to an online service.
        </p>
      </>
    ),
  },
  "color-converter": {
    heading: "Convert colors between hex, RGB, HSL, and OKLCH",
    body: (
      <>
        <p>
          Paste a color in hex (#c2410c), rgb(), or hsl() - or pick one visually - and this
          color converter shows it in all four notations at once, with a live swatch so you
          can confirm it&apos;s the color you meant. OKLCH output is included because modern
          CSS supports it natively and its lightness channel is perceptually uniform,
          making it far better for building color scales than HSL.
        </p>
        <p>
          Conversions use the standard sRGB math (and the OKLab transform for OKLCH), run
          instantly, and work offline after load. Nothing is uploaded and nothing is
          tracked. When you&apos;ve picked a color, check it against your background with
          the color contrast checker to keep text WCAG-compliant.
        </p>
      </>
    ),
  },
  "url-encoder-decoder": {
    heading: "URL encoding and decoding, explained and instant",
    body: (
      <>
        <p>
          This URL encoder/decoder converts text to and from percent-encoding instantly.
          Component mode encodes every reserved character - what you want for a single
          query-string value - while full-URL mode leaves structural characters like
          <code>/</code>, <code>?</code>, and <code>&amp;</code> intact so a whole address
          stays valid. Decoding also treats <code>+</code> as a space, matching how forms
          submit data.
        </p>
        <p>
          Paste a full URL and the tool additionally breaks its query string into a table
          of decoded key/value pairs, which is the fastest way to read a long tracking or
          OAuth redirect URL. Everything runs in your browser with the standard
          encodeURIComponent APIs - no uploads, no logging, works offline.
        </p>
      </>
    ),
  },
  "word-counter": {
    heading: "Word and character counter with reading time",
    body: (
      <>
        <p>
          Paste or type text and this word counter updates live with words, characters
          (with and without spaces), sentences, and paragraphs, plus estimated reading time
          (~225 words per minute) and speaking time (~140). It&apos;s built for the everyday
          jobs: fitting a meta description, trimming an abstract to a limit, timing a talk,
          or checking an essay&apos;s length.
        </p>
        <p>
          Unlike most online counters, everything is computed in your browser - your text
          is never uploaded, which makes this safe for unpublished drafts, legal text, or
          anything confidential. There are no ads, no signup, and it keeps working offline
          once loaded.
        </p>
      </>
    ),
  },
  "lorem-ipsum-generator": {
    heading: "Lorem ipsum placeholder text, plain or HTML",
    body: (
      <>
        <p>
          Generate classic lorem ipsum placeholder text with precise control: choose the
          number of paragraphs and sentences per paragraph, optionally start with the
          traditional &ldquo;Lorem ipsum dolor sit amet&rdquo; opening, and switch on HTML
          mode to wrap each paragraph in <code>&lt;p&gt;</code> tags ready for a template
          or CMS.
        </p>
        <p>
          Designers and developers use lorem ipsum because its word-length distribution
          reads like natural language without the distraction of real content - layouts get
          judged on structure, not copy. This generator runs entirely in your browser: no
          uploads, no tracking, no signup, and it works offline after the first load. Copy
          the result with one click.
        </p>
      </>
    ),
  },
};
