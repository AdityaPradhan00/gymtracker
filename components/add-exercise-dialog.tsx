"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useExercises } from "@/lib/hooks/use-exercises"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { useToast } from "@/hooks/use-toast"
import type { Exercise } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AddExerciseDialogProps {
  workoutId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddExerciseDialog({ workoutId, open, onOpenChange }: AddExerciseDialogProps) {
  const { exercises } = useExercises()
  const { addExerciseToWorkout } = useWorkouts()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExercises(exercises)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredExercises(
        exercises.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(query) ||
            (exercise.description && exercise.description.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, exercises])

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(workoutId, exercise.id)
    toast({
      title: "Exercise added",
      description: `${exercise.name} added to workout`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>Select an exercise to add to your workout</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredExercises.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No exercises found. Try a different search or create a new exercise.
            </p>
          ) : (
            filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                onClick={() => handleAddExercise(exercise)}
              >
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  {exercise.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{exercise.description}</p>
                  )}
                </div>
                <Badge variant={exercise.trackingType === "reps" ? "default" : "secondary"}>
                  {exercise.trackingType === "reps" ? "Reps" : "Time"}
                </Badge>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild className="sm:w-auto w-full">
            <Link href="/exercises/new">Create New Exercise</Link>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import Link from "next/link"

