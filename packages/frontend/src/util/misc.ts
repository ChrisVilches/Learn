interface Rectangle {
  left: number
  top: number
  width: number
  height: number
}

export function insideRectangle (x: number, y: number, { left, top, height, width }: Rectangle): boolean {
  if (y < top) return false
  if (y > top + height) return false
  if (x < left) return false
  return x <= left + width
}
