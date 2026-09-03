import { useEffect, useState } from "react";
import type { MessageKey } from "../i18n/messages";
import { useLocale } from "../i18n/useLocale";

const LOADING_LINES = [
  "loading.peckingPixels",
  "loading.pickingTypeface",
  "loading.brushingIceberg",
  "loading.sortingFeathers",
  "loading.rufflingLetters",
  "loading.polishingBeak",
  "loading.waddlingGlyphs",
  "loading.slidingSerifs",
  "loading.huddlingLetters",
  "loading.fishingFonts",
] as const satisfies readonly MessageKey[];

const CYCLE_MS = 2200;

const shuffleLines = () => {
  const next = [...LOADING_LINES];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) continue;
    next[i] = swap;
    next[j] = current;
  }
  return next;
};

type LoadingToastProps = {
  progress: number;
};

export const LoadingToast = ({ progress }: LoadingToastProps) => {
  const { t } = useLocale();
  const [lines] = useState(shuffleLines);
  const [index, setIndex] = useState(0);
  const pct = Math.round(progress * 100);
  const line = lines[index] ?? LOADING_LINES[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % lines.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [lines.length]);

  return (
    <section className="status-card is-loading" aria-busy="true">
      <div className="status-card-row" aria-hidden="true">
        <span className="status-card-spin">
          <img src="/logo.svg" alt="" width={22} height={32} />
        </span>
        <strong className="status-card-line" key={line}>
          {t(line)}
        </strong>
        <span className="status-card-pct">{pct}%</span>
      </div>
      <div className="status-card-bar" aria-hidden="true">
        <span
          className="status-card-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="visually-hidden" role="status">
        {t("app.processing")} {pct}%
      </span>
    </section>
  );
};
