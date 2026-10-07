import { Modal, Select } from "@mantine/core";
import { useLocale } from "../i18n/useLocale";
import type { ExportFormat } from "./exportImage";

const exportFormats: { value: ExportFormat; label: string }[] = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/avif", label: "AVIF" },
];

type ExportModalProps = {
  opened: boolean;
  format: ExportFormat;
  isExporting: boolean;
  onClose: () => void;
  onFormatChange: (format: ExportFormat) => void;
  outputWidth?: number;
  outputHeight?: number;
  targetKb?: number;
  onOutputWidthChange?: (width: number) => void;
  onOutputHeightChange?: (height: number) => void;
  onTargetKbChange?: (targetKb: number) => void;
  onExport: () => void;
};

export const ExportModal = ({
  opened,
  format,
  isExporting,
  onClose,
  onFormatChange,
  outputWidth,
  outputHeight,
  targetKb,
  onOutputWidthChange,
  onOutputHeightChange,
  onTargetKbChange,
  onExport,
}: ExportModalProps) => {
  const { t } = useLocale();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("app.exportModalTitle")}
      centered
      classNames={{
        content: "export-modal-content",
        header: "export-modal-header",
        title: "export-modal-title",
        body: "export-modal-body",
      }}
    >
      <label className="export-modal-field">
        <span>{t("app.exportFormat")}</span>
        <Select
          className="control-input"
          aria-label={t("app.exportFormat")}
          allowDeselect={false}
          checkIconPosition="left"
          disabled={isExporting}
          comboboxProps={{ width: "target", shadow: "md", withinPortal: true }}
          value={format}
          data={exportFormats}
          onChange={(value) => {
            if (value) onFormatChange(value as ExportFormat);
          }}
        />
      </label>
      <div className="export-modal-grid">
        <label className="export-modal-field">
          <span>Width</span>
          <input
            className="plain-input"
            type="number"
            min={1}
            disabled={isExporting}
            value={outputWidth ?? ""}
            onChange={(event) =>
              onOutputWidthChange?.(Math.max(1, Number(event.target.value) || 1))
            }
          />
        </label>
        <label className="export-modal-field">
          <span>Height</span>
          <input
            className="plain-input"
            type="number"
            min={1}
            disabled={isExporting}
            value={outputHeight ?? ""}
            onChange={(event) =>
              onOutputHeightChange?.(Math.max(1, Number(event.target.value) || 1))
            }
          />
        </label>
      </div>
      <label className="export-modal-field">
        <span>Target size (KB, optional)</span>
        <input
          className="plain-input"
          type="number"
          min={0}
          disabled={isExporting || format === "image/png"}
          value={targetKb ?? ""}
          placeholder="auto"
          onChange={(event) => onTargetKbChange?.(Number(event.target.value) || 0)}
        />
      </label>
      <div className="export-modal-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={isExporting}
          onClick={onClose}
        >
          {t("app.cancel")}
        </button>
        <button type="button" disabled={isExporting} onClick={onExport}>
          {isExporting ? t("app.exporting") : t("app.export")}
        </button>
      </div>
    </Modal>
  );
};
