"use client"

import { useExercises } from "@/lib/hooks/use-exercises"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function ExerciseLibrary() {
  const { exercises } = useExercises()

  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Exercises Yet</CardTitle>
          <CardDescription>Create your first exercise to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/exercises/new">Create First Exercise</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{exercise.name}</CardTitle>
              <Badge variant={exercise.trackingType === "reps" ? "default" : "secondary"}>
                {exercise.trackingType === "reps" ? "Reps" : "Time"}
              </Badge>
            </div>
            {exercise.description && <CardDescription>{exercise.description}</CardDescription>}
          </CardHeader>
          <CardContent className="pb-2">
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center text-primary hover:underline"
              >
                Watch tutorial <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

