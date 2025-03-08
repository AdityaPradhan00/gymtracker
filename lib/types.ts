export interface Exercise {
  id: string
  name: string
  description?: string
  videoUrl?: string
  trackingType: "reps" | "time"
}

export interface ExerciseLog {
  id: string
  date: string
  reps?: number
  weight?: number
  weightUnit?: string
  duration?: number
  notes?: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  logs: ExerciseLog[]
}

export interface WorkoutDay {
  id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt: string
  lastUpdated: string
}

export interface Settings {
  restTimerDuration: number
}

