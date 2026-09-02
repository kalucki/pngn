import { describe, expect, it } from 'vitest'
import { messages } from '../i18n/messages'
import { LOCALES } from '../i18n/locales'
import { FAQ_ITEMS } from './faqItems'
import { buildJsonLd } from './jsonLd'

describe('FAQ copy', () => {
  it('has a question and answer in every locale', () => {
    for (const locale of LOCALES) {
      for (const item of FAQ_ITEMS) {
        expect(messages[locale][item.q].length).toBeGreaterThan(8)
        expect(messages[locale][item.a].length).toBeGreaterThan(20)
      }
    }
  })
})

describe('buildJsonLd', () => {
  it('describes a free local web app and includes FAQ questions', () => {
    const data = buildJsonLd({
      origin: 'https://example.test',
      page: 'home',
      title: 'Change text on any image',
      description: 'Free in-browser text editor for images.',
      faqs: [{ question: 'Is it free?', answer: 'Yes, pngn is free.' }],
    })
    const json = JSON.stringify(data)
    expect(json).toContain('WebApplication')
    expect(json).toContain('"price":"0"')
    expect(json).toContain('HowTo')
    expect(json).toContain('FAQPage')
    expect(json).toContain('Is it free?')
    expect(json).toContain('https://example.test/faq')
  })
})
