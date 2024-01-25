export function arraySample<T> (arr: readonly T[]): T {
  const idx = randInt(0, arr.length - 1)
  return arr[idx]
}

export function randInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
