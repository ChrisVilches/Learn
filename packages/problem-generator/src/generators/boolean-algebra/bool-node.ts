export interface BoolNode {
  compute: (values: Record<string, boolean>) => boolean
  toTex: () => string
  formatGroupParenthesis: () => boolean
}
