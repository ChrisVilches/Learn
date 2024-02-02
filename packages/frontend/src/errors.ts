export class CategoryNotFoundError extends Error {
  constructor (readonly categorySlug: string) {
    super(`Category '${categorySlug}' not found`)
  }
}
