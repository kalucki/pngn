import { chromium } from 'playwright-core'

const executablePath =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173'

const browser = await chromium.launch({
  executablePath,
  headless: true,
})

try {
  const page = await browser.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(message.text())
  })
  await page.goto(baseUrl)
  await page.locator('input[type="file"]').evaluate(async (input) => {
    const canvas = document.createElement('canvas')
    canvas.width = 900
    canvas.height = 480
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#152a5b')
    gradient.addColorStop(1, '#e26286')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'rgba(0, 0, 0, 0.35)'
    context.font = '900 96px Arial'
    context.fillText('SUMMER SALE', 92, 274)
    context.fillStyle = '#ffffff'
    context.fillText('SUMMER SALE', 86, 266)
    context.fillStyle = 'rgba(0, 0, 0, 0.3)'
    context.font = '800 64px Arial'
    context.fillText('LIMITED TIME', 224, 406)
    context.fillStyle = '#ffe66d'
    context.fillText('LIMITED TIME', 220, 401)
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('PNG failed'))),
        'image/png',
      ),
    )
    const transfer = new DataTransfer()
    transfer.items.add(new File([blob], 'smoke.png', { type: 'image/png' }))
    input.files = transfer.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
  const selector = page.locator('.region-selector')
  await selector.waitFor()
  const selectorBounds = await selector.boundingBox()
  if (!selectorBounds) throw new Error('Region selector has no layout bounds')
  await page.mouse.move(
    selectorBounds.x + selectorBounds.width * (70 / 900),
    selectorBounds.y + selectorBounds.height * (145 / 480),
  )
  await page.mouse.down()
  await page.mouse.move(
    selectorBounds.x + selectorBounds.width * (790 / 900),
    selectorBounds.y + selectorBounds.height * (315 / 480),
    { steps: 8 },
  )
  await page.mouse.up()
  await page.getByRole('button', { name: 'Edit selected text' }).click()

  try {
    await page.locator('.workspace').waitFor({ timeout: 120_000 })
  } catch {
    const error = await page.locator('.status-card.error').textContent()
    throw new Error(error ?? 'Editor did not become ready')
  }
  await page.getByRole('button', { name: 'Add another text area' }).click()
  await page.locator('.editor-canvas.selecting-region').waitFor()
  await page.getByRole('combobox', { name: 'Reconstruction' }).click()
  await page.getByRole('option', { name: /MI-GAN/ }).click()
  const editorCanvas = page.locator('.editor-canvas')
  await editorCanvas.scrollIntoViewIfNeeded()
  const editorBounds = await editorCanvas.boundingBox()
  if (!editorBounds) throw new Error('Editor canvas has no layout bounds')
  await page.mouse.move(
    editorBounds.x + editorBounds.width * (180 / 900),
    editorBounds.y + editorBounds.height * (325 / 480),
  )
  await page.mouse.down()
  await page.mouse.move(
    editorBounds.x + editorBounds.width * (720 / 900),
    editorBounds.y + editorBounds.height * (445 / 480),
    { steps: 8 },
  )
  await page.mouse.up()
  await page.getByRole('button', { name: 'Process new area' }).click()
  const textLayer = page.locator(
    '.layers-list .layer-item:not(.is-background):not(.is-export-preview)',
  )
  await textLayer.nth(1).waitFor({ timeout: 120_000 })

  const layers = await textLayer.count()
  const removalMethod = await page.locator('.reconstruction-method').inputValue()

  if (layers < 2) throw new Error('Multiple OCR regions were not preserved')
  if (removalMethod !== 'migan') {
    throw new Error(`Expected MI-GAN, received ${removalMethod}`)
  }
  console.log(`Smoke passed: ${layers} layer(s)`)
} finally {
  await browser.close()
}
