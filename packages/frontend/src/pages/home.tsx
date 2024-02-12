import { CategoryList } from '../components/category-list'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { getRecentActivity, getUserProfile } from '../api-client/user'
import { useQuery } from 'react-query'
import { isNil } from 'lodash'
import { Spinner } from '../components/loaders/spinner'
import { Helmet } from 'react-helmet'
import { getFullTitle } from '../util/dom'

function calendarClassForValue (value: unknown): string {
  let color = 0

  if (!isNil(value)) {
    const { count } = value as { count: number }
    if (count === 0) {
      color = 0
    } else if (count < 5) {
      color = 1
    } else if (count < 10) {
      color = 2
    } else if (count < 20) {
      color = 3
    } else {
      color = 4
    }
  }
  return `color-scale-${color}`
}

export const HomePage = (): JSX.Element => {
  const { isLoading: isRecentActivityLoading, data: recentActivity } = useQuery(
    [getRecentActivity.name],
    async () => await getRecentActivity()
  )

  const { isLoading: isUserProfileLoading, data: userProfile } = useQuery(
    [getUserProfile.name],
    async () => await getUserProfile()
  )

  return (
    <div>
      <Helmet>
        <title>{getFullTitle()}</title>
      </Helmet>

      {isUserProfileLoading
        ? <Spinner/>
        : (
          <div className='mb-8'>Welcome, <b>{userProfile?.username}</b>!</div>
          )}

      <div className="md:grid md:grid-cols-2 md:gap-8 mb-8">
        <div>
          {isRecentActivityLoading || (
            <CalendarHeatmap values={recentActivity?.calendar ?? []} classForValue={calendarClassForValue}/>
          )}
        </div>
      </div>

      <CategoryList/>
    </div>
  )
}
