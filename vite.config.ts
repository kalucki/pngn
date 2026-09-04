import { createReadStream, existsSync, globSync, rmSync, statSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import {
  defineConfig,
  loadEnv,
  type Plugin,
  type PreviewServer,
  type ViteDevServer,
} from 'vite'
import { llmsTxt, robotsTxt, sitemapXml } from './src/seo/staticFiles.ts'

const publicDir = join(fileURLToPath(new URL('.', import.meta.url)), 'public')
const distDir = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')

const parseRange = (header: string | undefined, size: number) => {
  if (!header) return null
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim())
  if (!match) return null
  let start: number
  let end: number
  if (match[1] === '') {
    const suffix = Number(match[2])
    if (!Number.isFinite(suffix) || suffix <= 0) return null
    start = Math.max(0, size - suffix)
    end = size - 1
  } else {
    start = Number(match[1])
    end = match[2] === '' ? size - 1 : Number(match[2])
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    return null
  }
  return {
    start: Math.max(0, start),
    end: Math.min(size - 1, end),
  }
}

const sendModelFile = (
  req: IncomingMessage,
  res: ServerResponse,
  file: string,
  size: number,
) => {
  const range = parseRange(req.headers.range, size)
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  const start = range?.start ?? 0
  const end = range?.end ?? size - 1
  res.statusCode = range ? 206 : 200
  res.setHeader('Content-Length', String(end - start + 1))
  if (range) {
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
  }
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  const stream = createReadStream(file, { start, end })
  const fail = () => {
    stream.destroy()
    if (!res.writableEnded) res.destroy()
  }
  req.once('close', fail)
  stream.once('error', fail)
  stream.pipe(res)
}

// Gitignored ONNX weights live in public/models but Vite's SPA fallback
// serves index.html for missing (or newly added) files, which ONNX Runtime
// then tries to parse as protobuf. Serve these ourselves instead.
const serveModelFiles = (): Plugin => {
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? ''
      if (!url.startsWith('/models/') || !/\.(onnx|ort)$/.test(url)) {
        next()
        return
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        next()
        return
      }
      const file = join(publicDir, url.slice(1))
      if (!file.startsWith(publicDir)) {
        res.statusCode = 403
        res.end()
        return
      }
      try {
        const info = existsSync(file) ? statSync(file) : null
        if (!info?.isFile() || info.size < 1024) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Missing local model file. The app loads ONNX weights from Hugging Face.')
          return
        }
        sendModelFile(req, res, file, info.size)
      } catch {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Missing local model file. The app loads ONNX weights from Hugging Face.')
      }
    })
  }

  return {
    name: 'serve-model-files',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

const seoFiles = (origin: string): Plugin => {
  const bodyFor = (url: string) => {
    if (url === '/robots.txt') {
      return { type: 'text/plain; charset=utf-8', body: robotsTxt(origin) }
    }
    if (url === '/sitemap.xml') {
      return { type: 'application/xml; charset=utf-8', body: sitemapXml(origin) }
    }
    if (url === '/llms.txt') {
      return { type: 'text/plain; charset=utf-8', body: llmsTxt(origin) }
    }
    return null
  }

  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? ''
      const file = bodyFor(url)
      if (!file) {
        next()
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', file.type)
      res.end(file.body)
    })
  }

  return {
    name: 'seo-static-files',
    configureServer: attach,
    configurePreviewServer: attach,
    closeBundle() {
      writeFileSync(join(distDir, 'robots.txt'), robotsTxt(origin))
      writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml(origin))
      writeFileSync(join(distDir, 'llms.txt'), llmsTxt(origin))
    },
  }
}

const rootHrefFallback = (): Plugin => ({
  name: 'root-href-fallback',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      return html.replaceAll('href="/"', 'href="/index.html"')
    },
  },
})

const omitPublicOnnx = (): Plugin => ({
  name: 'omit-public-onnx',
  apply: 'build',
  closeBundle() {
    for (const file of globSync('**/*.onnx', { cwd: distDir })) {
      rmSync(join(distDir, file))
    }
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteOrigin = (env.VITE_SITE_ORIGIN ?? '').replace(/\/+$/, '')

  return {
    plugins: [
      rootHrefFallback(),
      react(),
      serveModelFiles(),
      seoFiles(siteOrigin),
      omitPublicOnnx(),
    ],
    worker: {
      format: 'es',
    },
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      watch: {
        ignored: [
          '**/public/models/inpaint/**/*.onnx',
          '**/public/models/font/**/*.onnx',
        ],
      },
    },
    preview: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
  }
})
