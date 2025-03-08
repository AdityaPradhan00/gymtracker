"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { ExerciseList } from "@/components/exercise-list"
import { AddExerciseDialog } from "@/components/add-exercise-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { WorkoutDay } from "@/lib/types"

export default function WorkoutDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const { getWorkoutDay, deleteWorkoutDay } = useWorkouts()
  const [workout, setWorkout] = useState<WorkoutDay | null>(null)
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)

  useEffect(() => {
    const workoutData = getWorkoutDay(id)
    if (workoutData) {
      setWorkout(workoutData)
    } else {
      toast({
        title: "Error",
        description: "Workout not found",
        variant: "destructive",
      })
      router.push("/workouts")
    }
  }, [id, getWorkoutDay, router, toast])

  const handleDeleteWorkout = () => {
    deleteWorkoutDay(id)
    toast({
      title: "Success",
      description: "Workout deleted successfully",
    })
    router.push("/workouts")
  }

  if (!workout) {
    return null
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/workouts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this workout day and all its exercises.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteWorkout}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <h1 className="text-2xl font-bold mb-4">{workout.name}</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Exercises</h2>
        <Button size="sm" onClick={() => setIsAddExerciseOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      <ExerciseList workoutId={id} exercises={workout.exercises} />

      <AddExerciseDialog workoutId={id} open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen} />
    </div>
  )
}

