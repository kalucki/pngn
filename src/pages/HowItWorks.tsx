import { useLocale } from "../i18n/useLocale";
import type { MessageKey } from "../i18n/messages";

const MIGAN_GITHUB = "https://github.com/Picsart-AI-Research/MI-GAN";
const MIGAN_PAPER = "https://arxiv.org/abs/2309.05019";
const LAMA_GITHUB = "https://github.com/advimman/lama";
const LAMA_PAPER = "https://arxiv.org/abs/2109.07161";

const CreditLink = ({
  href,
  labelKey,
}: {
  href: string;
  labelKey: MessageKey;
}) => {
  const { t } = useLocale();
  const label = t(labelKey);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (${t("docs.linkExternal")})`}
    >
      {label}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
};

export const HowItWorks = () => {
  const { t } = useLocale();

  return (
    <div className="docs-page">
      <article className="docs-body">
        <header className="docs-header">
          <h1>{t("docs.title")}</h1>
          <p>{t("docs.intro")}</p>
        </header>

        <section className="docs-privacy" id="privacy">
          <h2>{t("docs.privacy")}</h2>
          <p>{t("docs.privacy.p1")}</p>
          <p>{t("docs.privacy.p2")}</p>
        </section>

        <section id="models">
          <h2>{t("docs.models")}</h2>
          <p>{t("docs.models.p1")}</p>

          <article className="docs-credit">
            <h3>{t("docs.migan")}</h3>
            <p className="docs-credit-authors">{t("docs.migan.authors")}</p>
            <p>{t("docs.migan.p1")}</p>
            <p className="docs-credit-links">
              <CreditLink href={MIGAN_GITHUB} labelKey="docs.migan.github" />
              <CreditLink href={MIGAN_PAPER} labelKey="docs.migan.paper" />
            </p>
          </article>

          <article className="docs-credit">
            <h3>{t("docs.lama")}</h3>
            <p className="docs-credit-authors">{t("docs.lama.authors")}</p>
            <p>{t("docs.lama.p1")}</p>
            <p className="docs-credit-links">
              <CreditLink href={LAMA_GITHUB} labelKey="docs.lama.github" />
              <CreditLink href={LAMA_PAPER} labelKey="docs.lama.paper" />
            </p>
          </article>
        </section>
      </article>
    </div>
  );
};
