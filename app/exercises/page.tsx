import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ExerciseLibrary } from "@/components/exercise-library"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ExercisesPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <Button asChild size="sm">
          <Link href="/exercises/new">
            <Plus className="h-4 w-4 mr-2" />
            New Exercise
          </Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <ExerciseLibrary />
      </Suspense>
    </div>
  )
}

