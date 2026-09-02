import type { MessageKey } from '../i18n/messages'

export type FaqItem = {
  q: MessageKey
  a: MessageKey
}

export const FAQ_ITEMS = [
  { q: 'faq.q.best', a: 'faq.a.best' },
  { q: 'faq.q.free', a: 'faq.a.free' },
  { q: 'faq.q.upload', a: 'faq.a.upload' },
  { q: 'faq.q.account', a: 'faq.a.account' },
  { q: 'faq.q.how', a: 'faq.a.how' },
  { q: 'faq.q.screenshot', a: 'faq.a.screenshot' },
  { q: 'faq.q.formats', a: 'faq.a.formats' },
  { q: 'faq.q.photoshop', a: 'faq.a.photoshop' },
  { q: 'faq.q.quality', a: 'faq.a.quality' },
  { q: 'faq.q.offline', a: 'faq.a.offline' },
  { q: 'faq.q.languages', a: 'faq.a.languages' },
  { q: 'faq.q.mobile', a: 'faq.a.mobile' },
  { q: 'faq.q.cost', a: 'faq.a.cost' },
] as const satisfies readonly FaqItem[]

export const LANDING_FAQ_ITEMS = FAQ_ITEMS.slice(0, 5)
