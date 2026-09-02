import { useLocale } from '../i18n/useLocale'
import { Link } from './Link'
import { FAQ_PATH } from '../navigation'
import { LANDING_FAQ_ITEMS } from '../seo/faqItems'

export const LandingSeo = () => {
  const { t } = useLocale()

  return (
    <section className="landing-seo" aria-label={t('landing.seo.how.title')}>
      <article className="landing-seo-block">
        <h2>{t('landing.seo.how.title')}</h2>
        <p>{t('landing.seo.how.intro')}</p>
        <ol className="landing-seo-steps">
          <li>{t('landing.seo.how.s1')}</li>
          <li>{t('landing.seo.how.s2')}</li>
          <li>{t('landing.seo.how.s3')}</li>
          <li>{t('landing.seo.how.s4')}</li>
        </ol>
      </article>

      <article className="landing-seo-block">
        <h2>{t('landing.seo.why.title')}</h2>
        <p>{t('landing.seo.why.p1')}</p>
        <p>{t('landing.seo.why.p2')}</p>
      </article>

      <article className="landing-seo-block">
        <h2>{t('landing.seo.uses.title')}</h2>
        <p>{t('landing.seo.uses.intro')}</p>
        <ul className="landing-seo-uses">
          <li>{t('landing.seo.uses.screenshots')}</li>
          <li>{t('landing.seo.uses.memes')}</li>
          <li>{t('landing.seo.uses.graphics')}</li>
          <li>{t('landing.seo.uses.photos')}</li>
        </ul>
      </article>

      <article className="landing-seo-block" id="faq">
        <h2>{t('landing.seo.faq.title')}</h2>
        <dl className="landing-seo-faq">
          {LANDING_FAQ_ITEMS.map((item) => (
            <div key={item.q} className="landing-seo-faq-item">
              <dt>{t(item.q)}</dt>
              <dd>{t(item.a)}</dd>
            </div>
          ))}
        </dl>
        <p className="landing-seo-more">
          <Link to={FAQ_PATH}>{t('landing.seo.faq.more')}</Link>
        </p>
      </article>
    </section>
  )
}
