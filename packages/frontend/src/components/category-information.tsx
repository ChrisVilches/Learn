interface CategoryInformationProps {
  name: string
  description: string
  slug: string
  className?: string
}

export function CategoryInformation ({ name, description, className }: CategoryInformationProps): JSX.Element {
  return (
    <div className={className}>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>{name}</h1>
      </div>
      <p>{description}</p>
    </div>
  )
}
