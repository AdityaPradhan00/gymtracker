import type { ExerciseLog } from "@/lib/types"
import { format } from "date-fns"

interface ExerciseLogsProps {
  logs: ExerciseLog[]
  trackingType: "reps" | "time"
}

export function ExerciseLogs({ logs, trackingType }: ExerciseLogsProps) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">No logs yet</p>
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => (
        <div key={log.id} className="text-sm border rounded-md p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Set {index + 1}</span>
            <span className="text-xs text-muted-foreground">{format(new Date(log.date), "MMM d, h:mm a")}</span>
          </div>

          {trackingType === "reps" ? (
            <div>
              <span>{log.reps} reps</span>
              {log.weight && (
                <span>
                  {" "}
                  × {log.weight} {log.weightUnit || "lbs"}
                </span>
              )}
            </div>
          ) : (
            <div>
              <span>{log.duration} seconds</span>
            </div>
          )}

          {log.notes && <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>}
        </div>
      ))}
    </div>
  )
}

