import { Modal, Select } from "@mantine/core";
import { useLocale } from "../i18n/useLocale";
import type { ExportFormat } from "./exportImage";

const exportFormats: { value: ExportFormat; label: string }[] = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
];

type ExportModalProps = {
  opened: boolean;
  format: ExportFormat;
  isExporting: boolean;
  onClose: () => void;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
};

export const ExportModal = ({
  opened,
  format,
  isExporting,
  onClose,
  onFormatChange,
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
