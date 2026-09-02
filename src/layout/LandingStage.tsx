import { useId, type ReactNode } from "react";
import { useLocale } from "../i18n/useLocale";
import { HeroTitle } from "./HeroTitle";

const WAVE_VIEW_W = 1440;
const WAVE_VIEW_H = 900;

const waveY = (
  x: number,
  baseY: number,
  amplitude: number,
  phase: number,
  detail = 0.34,
) => {
  const t = x / WAVE_VIEW_W;
  const depth = baseY / WAVE_VIEW_H;
  return (
    baseY +
    Math.sin((t * 0.92 + phase) * Math.PI * 2) * amplitude +
    Math.sin((t * 1.78 + phase * 1.27 + depth * 0.35) * Math.PI * 2) *
      amplitude *
      detail +
    Math.sin((t * 0.41 + phase * 0.5) * Math.PI * 2) * amplitude * 0.22
  );
};

const strokePath = (
  baseY: number,
  amplitude: number,
  phase: number,
  detail?: number,
) => {
  const step = 20;
  const points: string[] = [];
  for (let x = -48; x <= WAVE_VIEW_W + 48; x += step) {
    points.push(
      `${x.toFixed(1)} ${waveY(x, baseY, amplitude, phase, detail).toFixed(1)}`,
    );
  }
  return `M${points.join("L")}`;
};

const fillPath = (
  baseY: number,
  amplitude: number,
  phase: number,
  detail?: number,
) =>
  `${strokePath(baseY, amplitude, phase, detail)}L${WAVE_VIEW_W + 48} ${WAVE_VIEW_H}L-48 ${WAVE_VIEW_H}Z`;

const waveBands = [
  { y: 236, amp: 62, phase: 0.14, fill: "#ffffff", opacity: 0.5 },
  { y: 352, amp: 72, phase: 0.2, fill: "#f3f1ea", opacity: 0.68 },
  { y: 468, amp: 78, phase: 0.27, fill: "#ebe7df", opacity: 0.8 },
  { y: 584, amp: 74, phase: 0.33, fill: "#e3dfd6", opacity: 0.9 },
  { y: 700, amp: 62, phase: 0.4, fill: "#dbd6cc", opacity: 0.96 },
  { y: 808, amp: 46, phase: 0.47, fill: "#d5d0c6", opacity: 1 },
].map((band) => ({
  ...band,
  d: fillPath(band.y, band.amp, band.phase),
  edge: strokePath(band.y, band.amp, band.phase),
}));

const waveContours = Array.from({ length: 9 }, (_, index) => {
  const t = (index + 0.5) / 9;
  return {
    d: strokePath(210 + t * 620, 48 + t * 26, 0.12 + t * 0.32),
    opacity: 0.045 + t * 0.05,
    width: 0.75,
  };
});

const waveRipples = Array.from({ length: 4 }, (_, index) => {
  const t = index / 3;
  return {
    d: strokePath(640 + t * 190, 11 + t * 6, 1.08 + t * 0.28, 0.78),
    opacity: 0.04 + t * 0.035,
  };
});

const LandingWaves = () => {
  const skyId = `landing-sky-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className="landing-waves"
      viewBox={`0 0 ${WAVE_VIEW_W} ${WAVE_VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.36" stopColor="#fbfaf8" />
          <stop offset="1" stopColor="#d8d4cb" />
        </linearGradient>
      </defs>
      <rect width={WAVE_VIEW_W} height={WAVE_VIEW_H} fill={`url(#${skyId})`} />
      {waveBands.map((band) => (
        <path
          key={band.y}
          d={band.d}
          fill={band.fill}
          fillOpacity={band.opacity}
        />
      ))}
      {waveBands.map((band, index) => (
        <path
          key={`edge-${band.y}`}
          d={band.edge}
          fill="none"
          stroke="#1a1916"
          strokeOpacity={0.07 + index * 0.016}
          strokeWidth={index % 2 === 0 ? 1.3 : 0.95}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {waveContours.map((contour, index) => (
        <path
          key={`contour-${index}`}
          d={contour.d}
          fill="none"
          stroke="#1a1916"
          strokeOpacity={contour.opacity}
          strokeWidth={contour.width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {waveRipples.map((ripple, index) => (
        <path
          key={`ripple-${index}`}
          d={ripple.d}
          fill="none"
          stroke="#1a1916"
          strokeOpacity={ripple.opacity}
          strokeWidth="0.65"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
};

type LandingStageProps = {
  children: ReactNode;
};

export const LandingStage = ({ children }: LandingStageProps) => {
  const { t } = useLocale();

  return (
    <div className="landing-stage">
      <div className="landing-wash" aria-hidden="true">
        <LandingWaves />
      </div>
      <header className="landing-hero">
        {/* <p className="landing-hero-privacy"></p> */}
        <HeroTitle text={t("title.home")} />
        <p className="landing-hero-lead">{t("landing.heroLead")}</p>
      </header>
      <div className="landing-stage-focus">{children}</div>
      <p className="landing-note">{t("landing.privacy")}</p>
    </div>
  );
};
