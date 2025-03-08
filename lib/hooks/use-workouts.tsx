"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { WorkoutDay, ExerciseLog } from "@/lib/types"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

interface WorkoutsContextType {
  workoutDays: WorkoutDay[]
  getWorkoutDay: (id: string) => WorkoutDay | undefined
  addWorkoutDay: (name: string) => string // Return the ID of the new workout
  updateWorkoutDay: (id: string, data: Partial<WorkoutDay>) => void
  deleteWorkoutDay: (id: string) => void
  addExerciseToWorkout: (workoutId: string, exerciseId: string) => void
  removeExerciseFromWorkout: (workoutId: string, workoutExerciseId: string) => void
  logExercise: (workoutId: string, workoutExerciseId: string, log: ExerciseLog) => void
  deleteExerciseLog: (workoutId: string, workoutExerciseId: string, logId: string) => void
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined)

export function WorkoutsProvider({ children }: { children: ReactNode }) {
  const [workoutDays, setWorkoutDays] = useLocalStorage<WorkoutDay[]>("workout-days", [])

  const getWorkoutDay = (id: string) => {
    return workoutDays.find((day) => day.id === id)
  }

  const addWorkoutDay = (name: string) => {
    const id = crypto.randomUUID()
    const newWorkoutDay: WorkoutDay = {
      id,
      name,
      exercises: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    setWorkoutDays([...workoutDays, newWorkoutDay])
    return id // Return the ID so we can navigate to it
  }

  const updateWorkoutDay = (id: string, data: Partial<WorkoutDay>) => {
    setWorkoutDays(
      workoutDays.map((day) =>
        day.id === id
          ? {
              ...day,
              ...data,
              lastUpdated: new Date().toISOString(),
            }
          : day,
      ),
    )
  }

  const deleteWorkoutDay = (id: string) => {
    setWorkoutDays(workoutDays.filter((day) => day.id !== id))
  }

  const addExerciseToWorkout = (workoutId: string, exerciseId: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === workoutId) {
          // Check if exercise already exists in workout
          const exerciseExists = day.exercises.some((ex) => ex.exerciseId === exerciseId)

          if (exerciseExists) {
            return day
          }

          return {
            ...day,
            exercises: [
              ...day.exercises,
              {
                id: crypto.randomUUID(),
                exerciseId,
                logs: [],
              },
            ],
            lastUpdated: new Date().toISOString(),
          }
        }
        return day
      }),
    )
  }

  const removeExerciseFromWorkout = (workoutId: string, workoutExerciseId: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === workoutId) {
          return {
            ...day,
            exercises: day.exercises.filter((ex) => ex.id !== workoutExerciseId),
            lastUpdated: new Date().toISOString(),
          }
        }
        return day
      }),
    )
  }

  const logExercise = (workoutId: string, workoutExerciseId: string, log: ExerciseLog) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === workoutId) {
          return {
            ...day,
            exercises: day.exercises.map((ex) => {
              if (ex.id === workoutExerciseId) {
                return {
                  ...ex,
                  logs: [...ex.logs, log],
                }
              }
              return ex
            }),
            lastUpdated: new Date().toISOString(),
          }
        }
        return day
      }),
    )
  }

  const deleteExerciseLog = (workoutId: string, workoutExerciseId: string, logId: string) => {
    setWorkoutDays(
      workoutDays.map((day) => {
        if (day.id === workoutId) {
          return {
            ...day,
            exercises: day.exercises.map((ex) => {
              if (ex.id === workoutExerciseId) {
                return {
                  ...ex,
                  logs: ex.logs.filter((log) => log.id !== logId),
                }
              }
              return ex
            }),
            lastUpdated: new Date().toISOString(),
          }
        }
        return day
      }),
    )
  }

  return (
    <WorkoutsContext.Provider
      value={{
        workoutDays,
        getWorkoutDay,
        addWorkoutDay,
        updateWorkoutDay,
        deleteWorkoutDay,
        addExerciseToWorkout,
        removeExerciseFromWorkout,
        logExercise,
        deleteExerciseLog,
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  )
}

export function useWorkouts() {
  const context = useContext(WorkoutsContext)
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider")
  }
  return context
}

