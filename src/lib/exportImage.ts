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
