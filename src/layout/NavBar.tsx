import { useLocale } from '../i18n/useLocale'
import { HOW_IT_WORKS_PATH, usePath } from '../navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Link } from './Link'

export const NavBar = () => {
  const path = usePath()
  const { t } = useLocale()
  const onHowItWorks = path === HOW_IT_WORKS_PATH

  return (
    <nav className="site-nav" aria-label={t('nav.primary')}>
      <div className="site-nav-inner">
        <Link to="/" className="site-nav-brand">
          <img
            src="/logo.svg"
            alt=""
            width={22}
            height={32}
            className="site-nav-logo"
          />
          <span className="site-nav-name">pngn</span>
        </Link>
        <div className="site-nav-end">
          <Link
            to={HOW_IT_WORKS_PATH}
            className={`site-nav-link${onHowItWorks ? ' active' : ''}`}
            aria-current={onHowItWorks ? 'page' : undefined}
          >
            {t('nav.howItWorks')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
