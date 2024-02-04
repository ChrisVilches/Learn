import { z } from 'zod'
import { httpClientAuth } from './http-client-auth'

const userProfileSchema = z.object({ username: z.string() })

type UserProfile = z.infer<typeof userProfileSchema>

const skillScoreSchema = z.array(z.object({ category: z.string(), score: z.number() }))
const calendarHeatmapSchema = z.object({ fromDay: z.coerce.date(), problemsSolved: z.array(z.number()) })

export type SkillScore = z.infer<typeof skillScoreSchema>
export type CalendarHeatDatamap = z.infer<typeof calendarHeatmapSchema>

export async function getUserProfile (): Promise<UserProfile> {
  const result = await httpClientAuth.get('/me')

  return userProfileSchema.parse(result.data)
}

export async function getRecentActivity (): Promise<{ skillScore: SkillScore, calendar: CalendarHeatDatamap }> {
  const result = await httpClientAuth.get('/recent_activity')

  return z.object({
    skillScore: skillScoreSchema,
    calendar: calendarHeatmapSchema
  }).parse(result.data)
}
