import { describe, expect, it } from 'vitest'
import { exportFileName, extensionFor } from './exportImage'

describe('exportFileName', () => {
  it('keeps the original basename and swaps the extension', () => {
    expect(exportFileName('summer-sale.jpeg', 'image/png')).toBe('summer-sale.png')
    expect(exportFileName('poster', 'image/webp')).toBe('poster.webp')
    expect(exportFileName('photo.backup.jpg', 'image/jpeg')).toBe('photo.backup.jpg')
  })

  it('falls back when the source has no name', () => {
    expect(exportFileName(undefined, 'image/png')).toBe('edited-image.png')
    expect(exportFileName('', 'image/jpeg')).toBe('edited-image.jpg')
  })
})

describe('extensionFor', () => {
  it('maps mime types to file extensions', () => {
    expect(extensionFor('image/png')).toBe('png')
    expect(extensionFor('image/jpeg')).toBe('jpg')
    expect(extensionFor('image/webp')).toBe('webp')
  })
})
