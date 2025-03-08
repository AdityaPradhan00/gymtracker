"use client"

import { useWorkouts } from "@/lib/hooks/use-workouts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function WorkoutList() {
  const { workoutDays } = useWorkouts()

  if (workoutDays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Workouts Yet</CardTitle>
          <CardDescription>Create your first workout to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/workouts/new">Create First Workout</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workoutDays.map((workout) => (
        <Card key={workout.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2" />
              {workout.name}
            </CardTitle>
            <CardDescription className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {workout.lastUpdated
                ? `Last updated ${formatDistanceToNow(new Date(workout.lastUpdated))} ago`
                : "Not started yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm">
              {workout.exercises.length} {workout.exercises.length === 1 ? "exercise" : "exercises"}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/workouts/${workout.id}`}>View Workout</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

