"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Exercise } from "@/lib/types"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

// Default exercises
const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    name: "Bench Press",
    description: "Lie on a flat bench and push the barbell up",
    trackingType: "reps",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  },
  {
    id: "ex-2",
    name: "Squat",
    description: "Lower your body by bending your knees as if sitting back into a chair",
    trackingType: "reps",
    videoUrl: "https://www.youtube.com/watch?v=bEv6CCg2BC8",
  },
  {
    id: "ex-3",
    name: "Plank",
    description: "Hold a push-up position with your body in a straight line",
    trackingType: "time",
    videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
  },
  {
    id: "ex-4",
    name: "Pull-up",
    description: "Hang from a bar and pull your body up until your chin is over the bar",
    trackingType: "reps",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
  },
]

interface ExercisesContextType {
  exercises: Exercise[]
  getExerciseById: (id: string) => Exercise | undefined
  addExercise: (exercise: Exercise) => void
  updateExercise: (id: string, data: Partial<Exercise>) => void
  deleteExercise: (id: string) => void
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined)

export function ExercisesProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>("exercises", DEFAULT_EXERCISES)

  const getExerciseById = (id: string) => {
    return exercises.find((exercise) => exercise.id === id)
  }

  const addExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise])
  }

  const updateExercise = (id: string, data: Partial<Exercise>) => {
    setExercises(exercises.map((exercise) => (exercise.id === id ? { ...exercise, ...data } : exercise)))
  }

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  return (
    <ExercisesContext.Provider
      value={{
        exercises,
        getExerciseById,
        addExercise,
        updateExercise,
        deleteExercise,
      }}
    >
      {children}
    </ExercisesContext.Provider>
  )
}

export function useExercises() {
  const context = useContext(ExercisesContext)
  if (context === undefined) {
    throw new Error("useExercises must be used within an ExercisesProvider")
  }
  return context
}

