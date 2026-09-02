import { FAQ_ITEMS } from './faqItems'
import { buildJsonLd, type SeoPage } from './jsonLd'
import { absoluteUrl, getSiteOrigin } from './origin'
import { EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH } from '../paths'
import type { Translate } from '../i18n/messages'

const JSON_LD_ID = 'pngn-jsonld'
const OG_IMAGE_PATH = '/og.png'

const PAGE_PATH: Record<SeoPage, string> = {
  home: '/',
  faq: FAQ_PATH,
  howItWorks: HOW_IT_WORKS_PATH,
  export: EXPORT_PATH,
}

const TITLE_KEY = {
  home: 'title.homePage',
  faq: 'title.faq',
  howItWorks: 'title.howItWorks',
  export: 'title.export',
} as const

const DESCRIPTION_KEY = {
  home: 'meta.home',
  faq: 'meta.faq',
  howItWorks: 'meta.howItWorks',
  export: 'meta.export',
} as const

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const upsertJsonLd = (data: unknown) => {
  let element = document.getElementById(JSON_LD_ID)
  if (!element) {
    element = document.createElement('script')
    element.id = JSON_LD_ID
    element.setAttribute('type', 'application/ld+json')
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export const applyDocumentSeo = (page: SeoPage, t: Translate) => {
  const origin = getSiteOrigin()
  const path = PAGE_PATH[page]
  const url = absoluteUrl(path, origin)
  const title = t(TITLE_KEY[page])
  const description = t(DESCRIPTION_KEY[page])
  const image = absoluteUrl(OG_IMAGE_PATH, origin)
  const indexable = page !== 'export'

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow')
  upsertMeta('name', 'theme-color', '#f7f6f3')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', 'pngn')
  upsertMeta('property', 'og:image', image)
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image)
  upsertLink('canonical', url)

  upsertJsonLd(
    buildJsonLd({
      origin,
      page,
      title,
      description,
      faqs: FAQ_ITEMS.map((item) => ({
        question: t(item.q),
        answer: t(item.a),
      })),
    }),
  )
}
