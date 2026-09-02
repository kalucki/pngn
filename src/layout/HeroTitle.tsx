import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HERO_FONTS,
  ensureHeroFontsLoaded,
  heroFontStack,
} from "./heroFonts";

/** How long each typeface stays on screen before the next shuffle. */
const CYCLE_MS = 2900;
/** Stagger between characters resolving, in ms. */
const CHAR_STAGGER_MS = 7;
/** How long each character stays scrambled before locking in, in ms. */
const CHAR_SCRAMBLE_MS = 90;

const SCRAMBLE_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*<>/\\{}[]0123456789";

const randomGlyph = () =>
  SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

type HeroTitleProps = {
  text: string;
};

export const HeroTitle = ({ text }: HeroTitleProps) => {
  const [fontIndex, setFontIndex] = useState(0);
  const [display, setDisplay] = useState(text);
  const [shuffleKey, setShuffleKey] = useState(0);
  const frameRef = useRef<number | null>(null);

  const activeFont = HERO_FONTS[fontIndex] ?? HERO_FONTS[0];
  const characters = useMemo(() => [...text], [text]);

  // Group the (scrambled) string into words so lines can only break at
  // spaces, never mid-word. Each character keeps its global index so the
  // stagger stays continuous across word boundaries.
  const words = useMemo(() => {
    const result: { key: number; chars: { char: string; index: number }[] }[] =
      [];
    let current: { char: string; index: number }[] = [];
    let wordKey = 0;
    [...display].forEach((char, index) => {
      if (char === " ") {
        if (current.length > 0) {
          result.push({ key: wordKey++, chars: current });
          current = [];
        }
      } else {
        current.push({ char, index });
      }
    });
    if (current.length > 0) result.push({ key: wordKey, chars: current });
    return result;
  }, [display]);

  useEffect(() => {
    ensureHeroFontsLoaded();
  }, []);

  const runScramble = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      let settled = true;
      let out = "";

      for (let i = 0; i < characters.length; i += 1) {
        const char = characters[i];
        if (char === " ") {
          out += " ";
          continue;
        }
        const lockAt = i * CHAR_STAGGER_MS + CHAR_SCRAMBLE_MS;
        if (elapsed >= lockAt) {
          out += char;
        } else {
          settled = false;
          out += randomGlyph();
        }
      }

      setDisplay(out);
      if (settled) {
        setDisplay(text);
        frameRef.current = null;
      } else {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [characters, text]);

  // Trigger a shuffle whenever the typeface (or the source text) changes.
  useEffect(() => {
    setShuffleKey((key) => key + 1);
    runScramble();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [fontIndex, runScramble]);

  // Advance through the typefaces on a loop.
  useEffect(() => {
    if (HERO_FONTS.length <= 1) return;
    const id = window.setInterval(() => {
      setFontIndex((index) => (index + 1) % HERO_FONTS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-title">
      <span className="hero-title-tag" aria-hidden="true" key={`tag-${fontIndex}`}>
        {activeFont.family}
      </span>
      <h1
        className="hero-title-heading"
        style={{
          fontFamily: heroFontStack(activeFont),
          fontWeight: activeFont.weight,
          letterSpacing: activeFont.letterSpacing,
        }}
      >
        <span className="hero-title-line" aria-hidden="true">
          <span className="hero-title-words">
            {words.map((word, wordIndex) => (
              <Fragment key={`${shuffleKey}-${word.key}`}>
                {wordIndex > 0 ? " " : null}
                <span className="hero-word">
                  {word.chars.map(({ char, index }) => (
                    <span
                      className="hero-char"
                      key={index}
                      style={{ ["--i" as string]: index }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        </span>
        <span className="visually-hidden">{text}</span>
      </h1>
    </div>
  );
};
