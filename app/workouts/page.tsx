import { Suspense } from "react"
import WorkoutList from "@/components/workout-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function WorkoutsPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <Button asChild size="sm">
          <Link href="/workouts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <WorkoutList />
      </Suspense>
    </div>
  )
}

