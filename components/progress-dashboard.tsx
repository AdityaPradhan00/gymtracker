"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { useExercises } from "@/lib/hooks/use-exercises"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

export function ProgressDashboard() {
  const { workoutDays } = useWorkouts()
  const { exercises } = useExercises()
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercisesLogged: 0,
    daysActive: 0,
    mostFrequentExercise: "",
    heaviestWeight: 0,
    longestDuration: 0,
  })
  const [weeklyActivity, setWeeklyActivity] = useState<{ name: string; count: number }[]>([])
  const [exerciseProgress, setExerciseProgress] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    // Calculate basic stats
    let totalLogs = 0
    const exerciseCounts: Record<string, number> = {}
    const exerciseWeights: Record<string, number> = {}
    const exerciseDurations: Record<string, number> = {}
    const activeDays = new Set<string>()

    // Process all workout data
    workoutDays.forEach((workout) => {
      workout.exercises.forEach((workoutExercise) => {
        const exercise = exercises.find((e) => e.id === workoutExercise.exerciseId)
        if (!exercise) return

        // Count exercise frequency
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1

        workoutExercise.logs.forEach((log) => {
          totalLogs++

          // Track active days
          const logDate = format(new Date(log.date), "yyyy-MM-dd")
          activeDays.add(logDate)

          // Track max weight
          if (log.weight) {
            exerciseWeights[exercise.name] = Math.max(exerciseWeights[exercise.name] || 0, log.weight)
          }

          // Track max duration
          if (log.duration) {
            exerciseDurations[exercise.name] = Math.max(exerciseDurations[exercise.name] || 0, log.duration)
          }
        })
      })
    })

    // Find most frequent exercise
    let mostFrequentExercise = ""
    let maxCount = 0
    Object.entries(exerciseCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostFrequentExercise = name
      }
    })

    // Find heaviest weight
    const heaviestWeight = Math.max(0, ...Object.values(exerciseWeights))

    // Find longest duration
    const longestDuration = Math.max(0, ...Object.values(exerciseDurations))

    setStats({
      totalWorkouts: workoutDays.length,
      totalExercisesLogged: totalLogs,
      daysActive: activeDays.size,
      mostFrequentExercise,
      heaviestWeight,
      longestDuration,
    })

    // Generate weekly activity data
    const today = new Date()
    const days = []

    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      days.push({
        name: format(date, "EEE"),
        count: 0,
      })
    }

    // Count workouts for each day
    workoutDays.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.logs.forEach((log) => {
          const logDate = new Date(log.date)

          days.forEach((day) => {
            if (
              isWithinInterval(logDate, {
                start: startOfDay(
                  subDays(
                    today,
                    days.findIndex((d) => d.name === day.name),
                  ),
                ),
                end: endOfDay(
                  subDays(
                    today,
                    days.findIndex((d) => d.name === day.name),
                  ),
                ),
              })
            ) {
              day.count++
            }
          })
        })
      })
    })

    setWeeklyActivity(days)

    // Generate exercise progress data
    const progressData = Object.entries(exerciseCounts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    setExerciseProgress(progressData)
  }, [workoutDays, exercises])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Exercises Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalExercisesLogged}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Days Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.daysActive}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Max Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.heaviestWeight > 0 ? `${stats.heaviestWeight} lbs` : "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your workout frequency over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {weeklyActivity.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {stats.mostFrequentExercise && (
        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Exercise</CardTitle>
            <CardDescription>Your favorite exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium">{stats.mostFrequentExercise}</p>
          </CardContent>
        </Card>
      )}

      {exerciseProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Exercises</CardTitle>
            <CardDescription>Your most logged exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseProgress} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

