export type PendingExport = {
  blob: Blob
  filename: string
  url: string
}

let pendingExport: PendingExport | null = null

export const stashExport = (blob: Blob, filename: string) => {
  if (pendingExport) URL.revokeObjectURL(pendingExport.url)
  pendingExport = { blob, filename, url: URL.createObjectURL(blob) }
  return pendingExport
}

export const readPendingExport = () => pendingExport
