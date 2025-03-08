"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { Button } from "@/components/ui/button"
import { Dumbbell, Plus } from "lucide-react"
import Link from "next/link"
import { WorkoutSummary } from "@/components/workout-summary"

export default function WorkoutDashboard() {
  const { workoutDays } = useWorkouts()
  const [recentWorkouts, setRecentWorkouts] = useState<string[]>([])

  useEffect(() => {
    // Get the 3 most recent workout days
    const recent = workoutDays
      .slice()
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 3)
      .map((workout) => workout.id)

    setRecentWorkouts(recent)
  }, [workoutDays])

  return (
    <div className="space-y-6">
      {workoutDays.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Fitness Tracker!</CardTitle>
            <CardDescription>Start by creating your first workout day</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/workouts/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Workout
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Continue with your recent workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map((id) => {
                    const workout = workoutDays.find((w) => w.id === id)
                    if (!workout) return null

                    return (
                      <Button key={id} variant="outline" asChild className="w-full justify-start">
                        <Link href={`/workouts/${id}`}>
                          <Dumbbell className="h-4 w-4 mr-2" />
                          {workout.name}
                        </Link>
                      </Button>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No recent workouts</p>
                )}

                <Button asChild className="w-full mt-4">
                  <Link href="/workouts">View All Workouts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
              <CardDescription>Your workout activity for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutSummary />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

