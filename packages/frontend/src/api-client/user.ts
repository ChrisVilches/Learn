import { z } from 'zod'
import { httpClientAuth } from './http-client-auth'

const userProfileSchema = z.object({ username: z.string() })

type UserProfile = z.infer<typeof userProfileSchema>

const skillScoreSchema = z.array(z.object({ category: z.string(), score: z.number() }))
const calendarHeatmapDataSchema = z.array(z.object({ date: z.string(), count: z.number() }))

type SkillScore = z.infer<typeof skillScoreSchema>
type CalendarHeatmapData = z.infer<typeof calendarHeatmapDataSchema>

export async function getUserProfile (): Promise<UserProfile> {
  const result = await httpClientAuth.get('/me')

  return userProfileSchema.parse(result.data)
}

export async function getRecentActivity (): Promise<{ skillScore: SkillScore, calendar: CalendarHeatmapData }> {
  const result = await httpClientAuth.get('/recent_activity')

  return z.object({
    skillScore: skillScoreSchema,
    calendar: calendarHeatmapDataSchema
  }).parse(result.data)
}
