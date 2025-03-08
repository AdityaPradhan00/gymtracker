"use client"

import { useEffect, useState } from "react"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"

export function WorkoutSummary() {
  const { workoutDays } = useWorkouts()
  const [weeklyActivity, setWeeklyActivity] = useState<
    {
      day: string
      count: number
      date: Date
    }[]
  >([])

  useEffect(() => {
    const today = new Date()
    const days = []

    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      days.push({
        day: format(date, "EEE"),
        date,
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
                start: startOfDay(day.date),
                end: endOfDay(day.date),
              })
            ) {
              day.count++
            }
          })
        })
      })
    })

    setWeeklyActivity(days)
  }, [workoutDays])

  const maxCount = Math.max(...weeklyActivity.map((day) => day.count), 1)

  return (
    <div className="flex items-end justify-between h-32">
      {weeklyActivity.map((day, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="w-8 bg-primary/80 rounded-t-sm"
            style={{
              height: day.count ? `${(day.count / maxCount) * 100}%` : "4px",
              minHeight: day.count ? "20%" : "4px",
              opacity: day.count ? 1 : 0.3,
            }}
          />
          <div className="mt-2 text-xs font-medium">{day.day}</div>
        </div>
      ))}
    </div>
  )
}

