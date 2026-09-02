import { useLocale } from '../i18n/useLocale'
import { Link } from '../layout/Link'
import { FAQ_ITEMS } from '../seo/faqItems'

export const Faq = () => {
  const { t } = useLocale()

  return (
    <div className="docs-page faq-page">
      <article className="docs-body">
        <header className="docs-header">
          <h1>{t('faq.h1')}</h1>
          <p>{t('faq.lede')}</p>
        </header>

        <section>
          <h2>{t('faq.what.title')}</h2>
          <p>{t('faq.what.p1')}</p>
          <p>{t('faq.what.p2')}</p>
        </section>

        <section>
          <h2>{t('faq.when.title')}</h2>
          <p>{t('faq.when.p1')}</p>
          <p>{t('faq.when.p2')}</p>
        </section>

        <section>
          <h2>{t('faq.vs.title')}</h2>
          <p>{t('faq.vs.p1')}</p>
          <p>{t('faq.vs.p2')}</p>
        </section>

        <section>
          <h2>{t('faq.limits.title')}</h2>
          <p>{t('faq.limits.p1')}</p>
        </section>

        <section>
          <h2>{t('landing.seo.faq.title')}</h2>
          <dl className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="faq-item" id={item.q.replaceAll('.', '-')}>
                <dt>
                  <h3>{t(item.q)}</h3>
                </dt>
                <dd>{t(item.a)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="faq-cta">
          {t('faq.cta')}{' '}
          <Link to="/" className="button-with-icon faq-cta-link">
            {t('faq.cta.action')}
          </Link>
        </p>
      </article>
    </div>
  )
}
