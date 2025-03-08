"use client"

import { useState } from "react"
import type { WorkoutExercise } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink, Plus, Timer } from "lucide-react"
import { useExercises } from "@/lib/hooks/use-exercises"
import { LogExerciseDialog } from "@/components/log-exercise-dialog"
import { ExerciseLogs } from "@/components/exercise-logs"
import { RestTimer } from "@/components/rest-timer"

interface ExerciseListProps {
  workoutId: string
  exercises: WorkoutExercise[]
}

export function ExerciseList({ workoutId, exercises }: ExerciseListProps) {
  const { getExerciseById } = useExercises()
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Exercises Added</CardTitle>
          <CardDescription>Add exercises to your workout to get started</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleLogExercise = (exercise: WorkoutExercise) => {
    setSelectedExercise(exercise)
    setIsLogDialogOpen(true)
  }

  const handleOpenTimer = () => {
    setIsTimerOpen(true)
  }

  return (
    <div className="space-y-4">
      {exercises.map((workoutExercise) => {
        const exerciseDetails = getExerciseById(workoutExercise.exerciseId)
        if (!exerciseDetails) return null

        return (
          <Card key={workoutExercise.id}>
            <CardHeader className="pb-2">
              <CardTitle>{exerciseDetails.name}</CardTitle>
              {exerciseDetails.description && <CardDescription>{exerciseDetails.description}</CardDescription>}
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <span className="flex items-center">
                  {exerciseDetails.trackingType === "time" ? (
                    <Clock className="h-4 w-4 mr-1" />
                  ) : (
                    <span className="font-medium mr-1">Sets:</span>
                  )}
                  {exerciseDetails.trackingType === "time" ? "Time-based" : "Reps & Sets"}
                </span>

                {exerciseDetails.videoUrl && (
                  <a
                    href={exerciseDetails.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center text-primary hover:underline"
                  >
                    Tutorial <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>

              <ExerciseLogs logs={workoutExercise.logs} trackingType={exerciseDetails.trackingType} />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => handleLogExercise(workoutExercise)}>
                <Plus className="h-4 w-4 mr-2" />
                Log Progress
              </Button>

              <Button variant="outline" size="icon" onClick={handleOpenTimer}>
                <Timer className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}

      {selectedExercise && (
        <LogExerciseDialog
          workoutId={workoutId}
          workoutExercise={selectedExercise}
          open={isLogDialogOpen}
          onOpenChange={setIsLogDialogOpen}
        />
      )}

      <RestTimer open={isTimerOpen} onOpenChange={setIsTimerOpen} />
    </div>
  )
}

