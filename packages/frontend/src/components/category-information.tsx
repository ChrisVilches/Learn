interface CategoryInformationProps {
  name: string
  description: string
  slug: string
  className?: string
}

export function CategoryInformation ({ name, description, slug, className }: CategoryInformationProps): JSX.Element {
  return (
    <div className={className}>
      <h1 className='mb-4 text-2xl font-bold'>{name}</h1>
      <p>{description}</p>
      <p>code: {slug}</p>
    </div>
  )
}
