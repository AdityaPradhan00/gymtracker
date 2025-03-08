"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/lib/hooks/use-settings"
import { Play, Pause, RotateCcw } from "lucide-react"

interface RestTimerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RestTimer({ open, onOpenChange }: RestTimerProps) {
  const { settings } = useSettings()
  const [duration, setDuration] = useState(settings.restTimerDuration)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset timer when dialog opens
  useEffect(() => {
    if (open) {
      setTimeLeft(duration)
      setProgress(100)
      setIsRunning(false)
    }
  }, [open, duration])

  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // Update progress bar
  useEffect(() => {
    setProgress((timeLeft / duration) * 100)
  }, [timeLeft, duration])

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    setProgress(100)
  }

  const handleChangeDuration = (value: number[]) => {
    const newDuration = value[0]
    setDuration(newDuration)
    setTimeLeft(newDuration)
    setProgress(100)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rest Timer</DialogTitle>
          <DialogDescription>Take a break between sets</DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center">
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center border-8 mb-4"
            style={{
              borderColor: `hsl(var(--primary) / ${progress}%)`,
              background: `radial-gradient(circle, hsl(var(--primary) / 10%) ${progress}%, transparent ${progress}%)`,
            }}
          >
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant={isRunning ? "destructive" : "default"} size="lg" onClick={handleStartPause}>
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Duration</span>
              <span>{duration} seconds</span>
            </div>
            <Slider
              value={[duration]}
              min={10}
              max={300}
              step={5}
              onValueChange={handleChangeDuration}
              disabled={isRunning}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

