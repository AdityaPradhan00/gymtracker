import { Suspense } from "react"
import WorkoutDashboard from "@/components/workout-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Fitness Tracker</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <WorkoutDashboard />
      </Suspense>
    </div>
  )
}

