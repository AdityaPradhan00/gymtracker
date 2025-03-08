"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { useExercises } from "@/lib/hooks/use-exercises"
import { useToast } from "@/hooks/use-toast"
import type { WorkoutExercise } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LogExerciseDialogProps {
  workoutId: string
  workoutExercise: WorkoutExercise
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogExerciseDialog({ workoutId, workoutExercise, open, onOpenChange }: LogExerciseDialogProps) {
  const { getExerciseById } = useExercises()
  const { logExercise } = useWorkouts()
  const { toast } = useToast()

  const exerciseDetails = getExerciseById(workoutExercise.exerciseId)
  const isTimeBasedExercise = exerciseDetails?.trackingType === "time"

  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState("lbs")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isTimeBasedExercise && !duration) {
      toast({
        title: "Error",
        description: "Please enter a duration",
        variant: "destructive",
      })
      return
    }

    if (!isTimeBasedExercise && !reps) {
      toast({
        title: "Error",
        description: "Please enter the number of reps",
        variant: "destructive",
      })
      return
    }

    logExercise(workoutId, workoutExercise.id, {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      reps: reps ? Number.parseInt(reps) : undefined,
      weight: weight ? Number.parseFloat(weight) : undefined,
      weightUnit: weight ? weightUnit : undefined,
      duration: duration ? Number.parseInt(duration) : undefined,
      notes: notes || undefined,
    })

    toast({
      title: "Progress logged",
      description: "Your progress has been saved",
    })

    // Reset form
    setReps("")
    setWeight("")
    setDuration("")
    setNotes("")
    onOpenChange(false)
  }

  if (!exerciseDetails) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log {exerciseDetails.name}</DialogTitle>
          <DialogDescription>Record your progress for this exercise</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {isTimeBasedExercise ? (
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="e.g., 12"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Label htmlFor="weight">Weight (optional)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 50"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weightUnit">Unit</Label>
                    <Select value={weightUnit} onValueChange={setWeightUnit}>
                      <SelectTrigger id="weightUnit">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save Progress</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

