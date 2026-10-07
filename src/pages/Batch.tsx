import { useEffect, useRef, useState } from 'react'
import { downloadFromUrl, extensionFor, type ExportFormat } from '../editor/exportImage'
import { DownloadIcon } from '../layout/icons'

const formats: Array<{ value: ExportFormat; label: string }> = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/avif', label: 'AVIF' },
]

type BatchResult = {
  url: string
  name: string
  bytes: number
  width: number
  height: number
  format: string
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return { value: String(bytes), unit: 'B' }
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) {
    return {
      value: kilobytes < 10 ? kilobytes.toFixed(1) : String(Math.round(kilobytes)),
      unit: 'KB',
    }
  }
  return { value: (kilobytes / 1024).toFixed(1), unit: 'MB' }
}

const uniqueName = (name: string, used: Map<string, number>) => {
  const count = used.get(name) ?? 0
  used.set(name, count + 1)
  if (count === 0) return name
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const extension = dot > 0 ? name.slice(dot) : ''
  return `${base}-${count + 1}${extension}`
}

const convertFile = async (
  file: File,
  format: ExportFormat,
  maxWidth: number,
  usedNames: Map<string, number>,
) => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = maxWidth > 0 ? Math.min(1, maxWidth / bitmap.width) : 1
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Image export failed.')),
      format,
      format === 'image/png' ? undefined : 0.88,
    )
  })
  const name = uniqueName(
    `${file.name.replace(/\.[^.]+$/, '')}.${extensionFor(format)}`,
    usedNames,
  )
  const label = formats.find((item) => item.value === format)?.label ?? 'PNG'
  return {
    url: URL.createObjectURL(blob),
    name,
    bytes: blob.size,
    width,
    height,
    format: label,
  }
}

const downloadAll = async (results: BatchResult[]) => {
  for (let index = 0; index < results.length; index += 1) {
    downloadFromUrl(results[index].url, results[index].name)
    if (index < results.length - 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 150))
    }
  }
}

export const Batch = () => {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<ExportFormat>('image/webp')
  const [maxWidth, setMaxWidth] = useState(0)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<BatchResult[]>([])
  const resultsRef = useRef<BatchResult[]>([])

  const replaceResults = (next: BatchResult[]) => {
    const kept = new Set(next)
    for (const result of resultsRef.current) {
      if (!kept.has(result)) URL.revokeObjectURL(result.url)
    }
    resultsRef.current = next
    setResults(next)
  }

  useEffect(() => {
    return () => {
      for (const result of resultsRef.current) URL.revokeObjectURL(result.url)
    }
  }, [])

  const run = async () => {
    setBusy(true)
    replaceResults([])
    const next: BatchResult[] = []
    const usedNames = new Map<string, number>()
    try {
      for (let index = 0; index < files.length; index += 1) {
        setStatus(`Converting ${index + 1} of ${files.length}`)
        next.push(await convertFile(files[index], format, maxWidth, usedNames))
        replaceResults([...next])
      }
      setStatus('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Conversion failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="batch-page">
      <section className="batch-card">
        <h1>Convert</h1>
        <p>Pick many images. pngn resizes and converts them locally with no upload queue.</p>
        <label className="export-modal-field">
          Images
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>
        <label className="export-modal-field">
          Format
          <select
            className="plain-input"
            value={format}
            onChange={(event) => setFormat(event.target.value as ExportFormat)}
          >
            {formats.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="export-modal-field">
          Max width (optional)
          <input
            className="plain-input"
            type="number"
            min={0}
            value={maxWidth || ''}
            onChange={(event) => setMaxWidth(Number(event.target.value) || 0)}
          />
        </label>
        <button type="button" disabled={busy || files.length === 0} onClick={() => void run()}>
          {busy
            ? 'Converting…'
            : files.length === 0
              ? 'Convert images'
              : `Convert ${files.length} ${files.length === 1 ? 'image' : 'images'}`}
        </button>
        {status ? <p role="status">{status}</p> : null}
        {results.length > 0 ? (
          <section className="batch-results" aria-label="Converted images">
            <div className="batch-results-bar">
              <h2>
                {results.length} file{results.length === 1 ? '' : 's'}
              </h2>
              <button
                type="button"
                className="button-with-icon"
                onClick={() => void downloadAll(results)}
              >
                <DownloadIcon />
                Download all
              </button>
            </div>
            <ul className="batch-result-list">
              {results.map((result) => {
                const size = formatBytes(result.bytes)
                return (
                  <li key={result.url} className="batch-result">
                    <div className="batch-result-copy">
                      <p className="batch-result-name">{result.name}</p>
                      <p className="batch-result-meta">
                        <span className="batch-result-format">{result.format}</span>
                        <span className="batch-result-dims">
                          {result.width}
                          <span className="batch-result-times" aria-hidden="true">
                            ×
                          </span>
                          {result.height}
                        </span>
                        <span className="batch-result-size">
                          {size.value}
                          <span className="batch-result-unit">{size.unit}</span>
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="secondary-button button-with-icon"
                      onClick={() => downloadFromUrl(result.url, result.name)}
                    >
                      <DownloadIcon />
                      Download
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}
      </section>
    </main>
  )
}
