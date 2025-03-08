"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useWorkouts } from "@/lib/hooks/use-workouts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewWorkoutPage() {
  const [name, setName] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { addWorkoutDay } = useWorkouts()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive",
      })
      return
    }

    // Add the workout and get its ID
    const workoutId = addWorkoutDay(name)

    toast({
      title: "Success",
      description: "Workout day created successfully",
    })

    // Navigate to the workouts list instead of the specific workout
    // This avoids the "workout not found" error
    router.push("/workouts")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/workouts">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Workout Day</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Workout Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Leg Day, Upper Body, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Create Workout</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

