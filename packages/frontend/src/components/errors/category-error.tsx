interface CategoryErrorProps {
  slug: string
}

export function CategoryError ({ slug }: CategoryErrorProps): JSX.Element {
  return (
    <div>
      Category with slug {slug} not found!
    </div>
  )
}
