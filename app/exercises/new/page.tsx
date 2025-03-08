"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useExercises } from "@/lib/hooks/use-exercises"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NewExercisePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [trackingType, setTrackingType] = useState<"reps" | "time">("reps")

  const router = useRouter()
  const { toast } = useToast()
  const { addExercise } = useExercises()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exercise name",
        variant: "destructive",
      })
      return
    }

    // Validate YouTube URL if provided
    if (videoUrl && !videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      toast({
        title: "Warning",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      })
      return
    }

    addExercise({
      id: crypto.randomUUID(),
      name,
      description,
      videoUrl,
      trackingType,
    })

    toast({
      title: "Success",
      description: "Exercise created successfully",
    })
    router.push("/exercises")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/exercises">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Exercise</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Exercise Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Bench Press, Squats, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the exercise"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="videoUrl">YouTube Link (Optional)</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Tracking Type</Label>
                <RadioGroup value={trackingType} onValueChange={(value) => setTrackingType(value as "reps" | "time")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reps" id="reps" />
                    <Label htmlFor="reps">Reps & Sets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time">Time-based</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Create Exercise</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

