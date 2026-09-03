import { useLocale } from '../i18n/useLocale'
import { FAQ_PATH, HOW_IT_WORKS_PATH, usePath } from '../navigation'
import { Link } from './Link'

export const Footer = () => {
  const path = usePath()
  const { t } = useLocale()
  const onHome = path === '/'
  const onFaq = path === FAQ_PATH
  const onHowItWorks = path === HOW_IT_WORKS_PATH

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link to="/" className="site-footer-brand">
          <img
            src="/logo.svg"
            alt=""
            width={22}
            height={32}
            className="site-footer-logo"
          />
          <span className="site-footer-name">pngn</span>
        </Link>
        <nav className="site-footer-nav" aria-label={t('footer.nav')}>
          <Link
            to="/"
            className={`site-footer-link${onHome ? ' active' : ''}`}
            aria-current={onHome ? 'page' : undefined}
          >
            {t('nav.home')}
          </Link>
          <Link
            to={FAQ_PATH}
            className={`site-footer-link${onFaq ? ' active' : ''}`}
            aria-current={onFaq ? 'page' : undefined}
          >
            {t('nav.faq')}
          </Link>
          <Link
            to={HOW_IT_WORKS_PATH}
            className={`site-footer-link${onHowItWorks ? ' active' : ''}`}
            aria-current={onHowItWorks ? 'page' : undefined}
          >
            {t('nav.howItWorks')}
          </Link>
        </nav>
        <p className="site-footer-copy">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
