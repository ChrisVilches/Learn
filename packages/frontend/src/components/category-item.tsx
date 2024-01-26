import { Link } from 'react-router-dom'

interface CategoryItemProps {
  slug: string
}

export const CategoryItem = ({ slug }: CategoryItemProps): JSX.Element => (
  <div>
    <Link to={`/category/${slug}/solve`}>{slug}</Link>
  </div>
)
