import { z } from 'zod'
import { httpClientAuth } from './http-client-auth'

const userProfileSchema = z.object({ username: z.string() })

type UserProfile = z.infer<typeof userProfileSchema>

const calendarHeatmapDataSchema = z.array(z.object({ date: z.string(), count: z.number() }))

type CalendarHeatmapData = z.infer<typeof calendarHeatmapDataSchema>

export async function getUserProfile (): Promise<UserProfile> {
  const result = await httpClientAuth.get('/me')

  return userProfileSchema.parse(result.data)
}

export async function getRecentActivity (): Promise<{ calendar: CalendarHeatmapData }> {
  const result = await httpClientAuth.get('/recent_activity')

  const { daysStats } = z.object({
    daysStats: calendarHeatmapDataSchema
  }).parse(result.data)

  return {
    calendar: daysStats
  }
}
