export interface WindowCandidate {
  points: Array<{ x: number; y: number }>
  confidence: number
}

export interface WindowFrame {
  gray: Uint8Array
  width: number
  height: number
}

// Keep synchronous work in the XR render callback bounded on lower-end phones.
const MAX_WIDTH = 48
const MAX_HEIGHT = 64

/** XR-Frame exposes camera luminance as a Y plane, so avoid converting from RGBA there. */
export function decodeLumaFrame(data: ArrayBuffer, frameWidth: number, frameHeight: number): WindowFrame | null {
  if (!frameWidth || !frameHeight || data.byteLength < frameWidth * frameHeight) return null
  const scale = Math.min(MAX_WIDTH / frameWidth, MAX_HEIGHT / frameHeight, 1)
  const width = Math.max(8, Math.floor(frameWidth * scale))
  const height = Math.max(8, Math.floor(frameHeight * scale))
  const source = new Uint8Array(data)
  const gray = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    const sourceY = Math.min(frameHeight - 1, Math.floor(y * frameHeight / height))
    for (let x = 0; x < width; x++) {
      const sourceX = Math.min(frameWidth - 1, Math.floor(x * frameWidth / width))
      gray[y * width + x] = source[sourceY * frameWidth + sourceX]
    }
  }
  return { gray, width, height }
}

/** Finds a strong rectangle candidate; this is not a trained semantic window model. */
export function detectWindowCandidateInGray(gray: Uint8Array, width: number, height: number): WindowCandidate | null {
  const edge = new Uint8Array(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const gx = Math.abs(gray[i + 1] - gray[i - 1])
      const gy = Math.abs(gray[i + width] - gray[i - width])
      edge[i] = Math.min(255, gx + gy)
    }
  }

  // Integral image makes scoring candidate rectangle borders inexpensive.
  const integral = new Uint32Array((width + 1) * (height + 1))
  const stride = width + 1
  for (let y = 1; y <= height; y++) {
    let rowSum = 0
    for (let x = 1; x <= width; x++) {
      rowSum += edge[(y - 1) * width + (x - 1)]
      integral[y * stride + x] = integral[(y - 1) * stride + x] + rowSum
    }
  }
  const rectSum = (x1: number, y1: number, x2: number, y2: number): number =>
    integral[y2 * stride + x2] - integral[y1 * stride + x2] - integral[y2 * stride + x1] + integral[y1 * stride + x1]

  let bestScore = 0
  let best: [number, number, number, number] | null = null
  const step = 4
  for (let y1 = Math.floor(height * 0.06); y1 < height * 0.55; y1 += step) {
    for (let y2 = Math.max(y1 + Math.floor(height * 0.22), Math.floor(height * 0.45)); y2 < height * 0.96; y2 += step) {
      const boxHeight = y2 - y1
      for (let x1 = Math.floor(width * 0.04); x1 < width * 0.68; x1 += step) {
        for (let x2 = Math.max(x1 + Math.floor(width * 0.25), Math.floor(width * 0.34)); x2 < width * 0.97; x2 += step) {
          const boxWidth = x2 - x1
          const aspect = boxWidth / boxHeight
          const area = (boxWidth * boxHeight) / (width * height)
          if (aspect < 0.48 || aspect > 2.35 || area < 0.07 || area > 0.78) continue

          const top = rectSum(x1, y1, x2, y1 + 1) / boxWidth
          const bottom = rectSum(x1, y2 - 1, x2, y2) / boxWidth
          const left = rectSum(x1, y1, x1 + 1, y2) / boxHeight
          const right = rectSum(x2 - 1, y1, x2, y2) / boxHeight
          if (Math.min(top, bottom, left, right) < 10) continue
          const edgeScore = (top + bottom + left + right) / (4 * 255)
          const aspectPrior = aspect < 0.7 ? aspect / 0.7 : aspect > 1.8 ? 1.8 / aspect : 1
          const score = edgeScore * (0.72 + 0.28 * aspectPrior)
          if (score > bestScore) {
            bestScore = score
            best = [x1, y1, x2, y2]
          }
        }
      }
    }
  }

  // Reject weak or ambiguous edges. A real semantic model can replace this detector later.
  if (!best || bestScore < 0.115) return null
  const [x1, y1, x2, y2] = best
  return {
    confidence: Math.min(0.99, bestScore * 2.1),
    points: [
      { x: x1 / width * 100, y: y1 / height * 100 },
      { x: x2 / width * 100, y: y1 / height * 100 },
      { x: x2 / width * 100, y: y2 / height * 100 },
      { x: x1 / width * 100, y: y2 / height * 100 }
    ]
  }
}
