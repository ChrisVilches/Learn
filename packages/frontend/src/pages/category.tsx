import { useParams } from 'react-router-dom'
import { ProblemGeneratorsConfiguration } from '../components/problem-generators-configuration'
import { ProblemSolve } from '../components/problem-solve'

export const CategoryPage = (): JSX.Element => {
  const { slug } = useParams()

  // TODO: Here I should check that the category with slug 'slug' exists, by fetching from the DB.
  //       Right now I don't have an API endpoint for that, since the Category model is very basic right now,
  //       it only has 'slug' and nothing else, so I didn't create an endpoint just for fetching that.
  //       Try adding the category name, that way I have more data to display (and that'll justify creating
  //       the endpoint and verifying it exists here).

  if (slug === undefined) {
    throw new Error('Something happened!')
  }

  return (
    <>
      <div>
        <ProblemGeneratorsConfiguration slug={slug ?? ''}/>
      </div>

      <ProblemSolve slug={slug}/>
    </>
  )
}
