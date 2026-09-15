import { NumberInput, Select, Slider, Textarea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import type { TextLayer } from "../document/types";
import { useLocale } from "../i18n/useLocale";
import type { MessageKey } from "../i18n/messages";
import { ColorSwatchInput } from "../ui/ColorSwatchInput";
import {
  ensureFont,
  FONT_GROUP_ORDER,
  fontByFamily,
  fontsInCategory,
  isFontFailed,
  isFontReady,
  nearestWeight,
  type FontCategory,
} from "./fonts";
import { fallbackFontChoice } from "../fonts/fontFallback";
import {
  applyLayerStylePatch,
  type LayerStylePatch,
} from "./applyLayerStyle";

const COMPACT_TOOLBAR_PX = 840;

type TextToolbarProps = {
  layer: TextLayer | null;
  disabled?: boolean;
  onChange: (layer: TextLayer) => void;
  onStyleChange?: (patch: LayerStylePatch) => void;
  textFocusKey?: number;
};

type FontStatus = "idle" | "loading";

const FONT_GROUP_KEYS: Record<FontCategory, MessageKey> = {
  system: "fontGroup.system",
  sans: "fontGroup.sans",
  serif: "fontGroup.serif",
  display: "fontGroup.display",
  mono: "fontGroup.mono",
};

const FONT_WEIGHT_KEYS: Record<number, MessageKey> = {
  100: "fontWeight.100",
  200: "fontWeight.200",
  300: "fontWeight.300",
  400: "fontWeight.400",
  500: "fontWeight.500",
  600: "fontWeight.600",
  700: "fontWeight.700",
  800: "fontWeight.800",
  900: "fontWeight.900",
};

const renderFontOption = ({
  option,
}: {
  option: { value: string; label: string };
}) => (
  <span style={{ fontFamily: `"${option.value}", sans-serif` }}>
    {option.label}
  </span>
);

export const TextToolbar = ({
  layer,
  disabled = false,
  onChange,
  onStyleChange,
  textFocusKey = 0,
}: TextToolbarProps) => {
  const { t } = useLocale();
  const [fontEpoch, setFontEpoch] = useState(0);
  const [compact, setCompact] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef(layer);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    layerRef.current = layer;
    onChangeRef.current = onChange;
  }, [layer, onChange]);

  const inactive = !layer;
  const locked = inactive || disabled;
  const selectedFont = layer
    ? fontByFamily(layer.typography.fontFamily)
    : undefined;
  const availableWeights = selectedFont?.weights ?? [400, 700];
  const fontFamily = layer?.typography.fontFamily ?? "";
  const fontWeight = layer
    ? availableWeights.includes(layer.typography.fontWeight)
      ? layer.typography.fontWeight
      : nearestWeight(availableWeights, layer.typography.fontWeight)
    : 400;

  useEffect(() => {
    if (!fontFamily || inactive) return;
    if (isFontReady(fontFamily, fontWeight)) return;
    let cancelled = false;
    void ensureFont(
      fontFamily,
      fontWeight,
      isFontFailed(fontFamily, fontWeight),
    ).then(() => {
      if (cancelled) return;
      setFontEpoch((epoch) => epoch + 1);
      const current = layerRef.current;
      if (
        !current ||
        current.typography.fontFamily !== fontFamily ||
        !isFontFailed(fontFamily, fontWeight)
      ) {
        return;
      }
      const next = fallbackFontChoice(current, fontFamily, fontWeight);
      if (next.family === fontFamily && next.weight === fontWeight) return;
      onChangeRef.current({
        ...current,
        typography: {
          ...current.typography,
          fontFamily: next.family,
          fontWeight: next.weight,
          italic: next.italic,
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [fontFamily, fontWeight, inactive]);

  useEffect(() => {
    if (textFocusKey <= 0 || locked) return;
    const frame = window.requestAnimationFrame(() => {
      textAreaRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locked, textFocusKey]);

  useEffect(() => {
    const node = groupRef.current;
    if (!node) return;
    const apply = (width: number) => setCompact(width < COMPACT_TOOLBAR_PX);
    apply(node.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (typeof width === "number") apply(width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const fontStatus: FontStatus =
    fontEpoch >= 0 &&
    layer &&
    !isFontReady(fontFamily, fontWeight) &&
    !isFontFailed(fontFamily, fontWeight)
      ? "loading"
      : "idle";
  const fontMatchPending = layer?.fontMatch?.status === "pending";

  const emitStyle = (patch: LayerStylePatch) => {
    if (!layer) return;
    if (onStyleChange) {
      onStyleChange(patch);
      return;
    }
    onChange(applyLayerStylePatch(layer, patch));
  };

  const updateTypography = (patch: Partial<TextLayer["typography"]>) => {
    emitStyle({ typography: patch });
  };

  const detectedFamilies = layer?.fontMatch
    ? [
        { family: layer.fontMatch.family, weight: layer.fontMatch.weight },
        ...layer.fontMatch.similar,
      ].filter(
        (font, index, fonts) =>
          font.family &&
          !isFontFailed(font.family, font.weight) &&
          fonts.findIndex((item) => item.family === font.family) === index,
      )
    : [];
  const applyFontFamily = (family: string, weight?: number) => {
    updateTypography(
      weight === undefined
        ? { fontFamily: family }
        : { fontFamily: family, fontWeight: weight },
    );
  };

  const fontSelectData = [
    ...(detectedFamilies.length > 0
      ? [
          {
            group: t("fontGroup.detected"),
            items: detectedFamilies.map((font) => ({
              value: font.family,
              label: font.family,
            })),
          },
        ]
      : []),
    ...FONT_GROUP_ORDER.map((category) => ({
      group: t(FONT_GROUP_KEYS[category]),
      items: fontsInCategory(category)
        .filter(
          (font) =>
            !detectedFamilies.some(
              (detected) => detected.family === font.family,
            ),
        )
        .map((font) => ({
          value: font.family,
          label: font.family,
        })),
    })),
  ];

  return (
    <div
      ref={groupRef}
      className={`toolbar-group${inactive || disabled ? " is-inactive" : ""}`}
      aria-disabled={locked}
    >
      <label className="toolbar-field field-text">
        <span>{t("toolbar.text")}</span>
        <Textarea
          ref={textAreaRef}
          size="xs"
          value={layer?.text ?? ""}
          disabled={locked}
          minRows={1}
          maxRows={compact ? 2 : 4}
          resize="none"
          placeholder={inactive ? t("toolbar.hint") : t("toolbar.placeholder")}
          aria-label={t("toolbar.text")}
          onChange={(event) => {
            if (!layer) return;
            onChange({ ...layer, text: event.currentTarget.value });
          }}
        />
      </label>

      <div className="toolbar-style-row">
        <label
          className="toolbar-field field-font"
          data-font-status={inactive ? "idle" : fontStatus}
        >
        <span>{t("toolbar.font")}</span>
        <div className="font-select-row">
          <Select
            size="xs"
            searchable
            aria-label={t("toolbar.font")}
            aria-busy={
              !inactive && (fontStatus === "loading" || fontMatchPending)
            }
            disabled={locked}
            placeholder={t("toolbar.font")}
            nothingFoundMessage={t("toolbar.fontEmpty")}
            value={fontFamily || null}
            data={fontSelectData}
            renderOption={renderFontOption}
            comboboxProps={{
              width: compact ? "target" : 260,
              shadow: "md",
              withinPortal: true,
            }}
            onChange={(value) => {
              if (!value) return;
              const match = detectedFamilies.find(
                (font) => font.family === value,
              );
              applyFontFamily(value, match?.weight);
            }}
          />
          <span className="font-match-slot" aria-hidden={!fontMatchPending}>
            {fontMatchPending ? (
              <span
                className="font-match-spinner"
                role="status"
                aria-live="polite"
                aria-label={t("toolbar.fontMatchPending")}
              />
            ) : null}
          </span>
        </div>
      </label>

      <label className="toolbar-field field-size">
        <span>{t("toolbar.size")}</span>
        <NumberInput
          size="xs"
          min={4}
          max={600}
          step={1}
          allowDecimal={false}
          allowNegative={false}
          clampBehavior="blur"
          disabled={locked}
          aria-label={t("toolbar.size")}
          value={layer ? Math.round(layer.typography.fontSize) : ""}
          onChange={(value) => {
            if (typeof value !== "number") return;
            updateTypography({ fontSize: value });
          }}
        />
      </label>

      <label className="toolbar-field field-weight">
        <span>{t("toolbar.weight")}</span>
        <Select
          size="xs"
          disabled={locked}
          aria-label={t("toolbar.weight")}
          value={String(fontWeight)}
          data={availableWeights.map((weight) => ({
            value: String(weight),
            label: FONT_WEIGHT_KEYS[weight]
              ? t(FONT_WEIGHT_KEYS[weight])
              : String(weight),
          }))}
          onChange={(value) => {
            if (!value) return;
            updateTypography({ fontWeight: Number(value) });
          }}
        />
      </label>

      <div className="toolbar-field field-color">
        <span>{t("toolbar.color")}</span>
        <ColorSwatchInput
          disabled={locked}
          aria-label={t("toolbar.color")}
          value={
            layer?.typography.color.startsWith("#")
              ? layer.typography.color
              : "#000000"
          }
          onChange={(color) => updateTypography({ color })}
        />
      </div>

      <div className="toolbar-field field-stroke">
        <span>{t("toolbar.stroke")}</span>
        <div className="stroke-controls">
          <ColorSwatchInput
            disabled={locked}
            aria-label={t("toolbar.stroke")}
            value={
              layer?.typography.strokeColor.startsWith("#")
                ? layer.typography.strokeColor
                : "#000000"
            }
            onChange={(strokeColor) => updateTypography({ strokeColor })}
          />
          <NumberInput
            size="xs"
            className="stroke-width-input"
            min={0}
            max={80}
            step={1}
            allowDecimal={false}
            allowNegative={false}
            disabled={locked}
            aria-label={t("toolbar.strokeWidth")}
            value={layer ? Math.round(layer.typography.strokeWidth) : ""}
            onChange={(value) => {
              if (typeof value !== "number") return;
              updateTypography({ strokeWidth: Math.max(0, value) });
            }}
          />
        </div>
      </div>

      <label className="toolbar-field field-opacity">
        <span>{t("toolbar.opacity")}</span>
        <Slider
          className="opacity-slider"
          min={0}
          max={1}
          step={0.05}
          disabled={locked}
          thumbLabel={t("toolbar.opacity")}
          label={(value) => `${Math.round(value * 100)}%`}
          value={layer?.effects.opacity ?? 1}
          onChange={(opacity) => emitStyle({ effects: { opacity } })}
        />
      </label>
      </div>
    </div>
  );
};
