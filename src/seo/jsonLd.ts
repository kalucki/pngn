import { EXPORT_PATH, FAQ_PATH, HOW_IT_WORKS_PATH } from '../paths'
import { absoluteUrl } from './origin'

export type SeoPage = 'home' | 'faq' | 'howItWorks' | 'export'

export type JsonLdFaq = {
  question: string
  answer: string
}

type JsonLdInput = {
  origin: string
  page: SeoPage
  title: string
  description: string
  faqs: readonly JsonLdFaq[]
}

const SOFTWARE_FEATURES = [
  'Change text on an image in the browser',
  'Replace writing on screenshots, memes, posters, and photos',
  'No account required',
  'Images never leave the device',
  'PNG, JPEG, and WebP import and export',
  'On-device OCR and background inpainting',
]

export const buildJsonLd = ({
  origin,
  page,
  title,
  description,
  faqs,
}: JsonLdInput) => {
  const home = absoluteUrl('/', origin)
  const faqUrl = absoluteUrl(FAQ_PATH, origin)
  const creditsUrl = absoluteUrl(HOW_IT_WORKS_PATH, origin)
  const image = absoluteUrl('/og.png', origin)

  const app = {
    '@type': ['WebApplication', 'SoftwareApplication'],
    '@id': `${home}#app`,
    name: 'pngn',
    alternateName: ['penguin', 'pngn image text editor'],
    url: home,
    image,
    description,
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Image text editor',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and WebAssembly.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: SOFTWARE_FEATURES,
    screenshot: image,
    inLanguage: ['en', 'es', 'pl', 'zh-Hans', 'pcm', 'ar'],
    about: [
      'Change text on image',
      'Edit text in image online free',
      'Replace text in photo without uploading',
    ],
    audience: {
      '@type': 'Audience',
      audienceType:
        'People who need to change writing already painted into an image, without an account or upload.',
    },
  }

  const howTo = {
    '@type': 'HowTo',
    '@id': `${home}#howto`,
    name: 'How to change text on an image online for free',
    description:
      'Replace text that is already part of a PNG, JPEG, or WebP in the browser. pngn never uploads the file.',
    totalTime: 'PT2M',
    tool: { '@id': `${home}#app` },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Open the image',
        text: 'Drop a PNG, JPEG, or WebP onto pngn, or click to open one from your computer.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Select the text',
        text: 'Draw a box around the words you want to change. pngn reads the letters and paints them out of the background.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Rewrite and style',
        text: 'Type the new text. Adjust font, size, color, stroke, and position.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Export',
        text: 'Download a PNG, JPEG, or WebP at the original resolution. The file is built on your device.',
      },
    ],
  }

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${faqUrl}#faq`,
    url: faqUrl,
    name: title,
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(pagePath(page), origin)}#page`,
    url: absoluteUrl(pagePath(page), origin),
    name: title,
    description,
    isPartOf: { '@id': `${home}#website` },
    about: { '@id': `${home}#app` },
    primaryImageOfPage: image,
  }

  const graph: unknown[] = [
    {
      '@type': 'WebSite',
      '@id': `${home}#website`,
      name: 'pngn',
      url: home,
      description:
        'Free in-browser tool to change text on any image. No account, no upload.',
      inLanguage: ['en', 'es', 'pl', 'zh-Hans', 'pcm', 'ar'],
    },
    app,
    webpage,
  ]

  if (page === 'home' || page === 'faq') {
    graph.push(howTo, faqPage)
  }

  if (page === 'howItWorks') {
    graph.push({
      '@type': 'AboutPage',
      '@id': `${creditsUrl}#about`,
      url: creditsUrl,
      name: title,
      description,
      isPartOf: { '@id': `${home}#website` },
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

const pagePath = (page: SeoPage) => {
  if (page === 'faq') return FAQ_PATH
  if (page === 'howItWorks') return HOW_IT_WORKS_PATH
  if (page === 'export') return EXPORT_PATH
  return '/'
}
