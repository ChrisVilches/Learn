import { CategoryList } from '../components/category-list'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from 'chart.js'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { type CalendarHeatDatamap, getRecentActivity, getUserProfile } from '../api-client/user'
import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { isUndefined, isNil } from 'lodash'
import { Spinner } from '../components/loaders/spinner'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
)

function calendarClassForValue (value?: { count: number }): string {
  if (isNil(value)) {
    return 'color-empty'
  }
  return `color-scale-${value.count}`
}

function getDayFrom (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function buildCalendarData (calendar: CalendarHeatDatamap): { startDate: Date, endDate: Date, values: Array<{ date: string, count: number }> } {
  const days = calendar.problemsSolved.length
  const endDate = getDayFrom(calendar.fromDay, days)

  return {
    startDate: calendar.fromDay,
    endDate,
    values: calendar.problemsSolved.map((count, idx) => ({
      date: getDayFrom(calendar.fromDay, idx).toString(),
      count
    }))
  }
}

export const HomePage = (): JSX.Element => {
  const { isLoading: isRecentActivityLoading, data: recentActivity } = useQuery(
    [getRecentActivity.name],
    async () => await getRecentActivity()
  )

  const calendarDataChart = useMemo(() => {
    if (isUndefined(recentActivity?.calendar)) {
      return undefined
    }
    return buildCalendarData(recentActivity.calendar)
  }, [recentActivity])

  // TODO: Maybe load the profile in the Route loader? Just for education.

  const { isLoading: isUserProfileLoading, data: userProfile } = useQuery(
    [getUserProfile.name],
    async () => await getUserProfile()
  )

  if (isUserProfileLoading) {
    return (
      <div className="flex justify-center">
        <Spinner/>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-8'>Welcome, <b>{userProfile?.username}</b>!</div>

      <div className="md:grid md:grid-cols-2 md:gap-8 mb-8">
        <div>
          {isRecentActivityLoading || (
            <CalendarHeatmap {...calendarDataChart} classForValue={calendarClassForValue}/>
          )}
        </div>
      </div>

      <CategoryList/>
    </div>
  )
}
