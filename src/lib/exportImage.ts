import { toPng } from 'html-to-image'

export async function exportNodeToPng(node: HTMLElement): Promise<string> {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    width: 1080,
    height: 1920,
    style: {
      width: '1080px',
      height: '1920px',
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  })
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function createPngFilename(date = new Date()): string {
  const stamp = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '')
  return `bottle-rating-${stamp}.png`
}
