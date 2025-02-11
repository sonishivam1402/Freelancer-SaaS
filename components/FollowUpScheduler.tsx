"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FollowUpScheduler() {
  const [schedules, setSchedules] = useState<{ client: string; date: string }[]>([])
  const [newSchedule, setNewSchedule] = useState({ client: "", date: "" })

  const handleAddSchedule = () => {
    if (newSchedule.client && newSchedule.date) {
      setSchedules([...schedules, newSchedule])
      setNewSchedule({ client: "", date: "" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-Up Scheduler</CardTitle>
        <CardDescription>Schedule automated follow-ups with clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Client Name"
            value={newSchedule.client}
            onChange={(e) => setNewSchedule({ ...newSchedule, client: e.target.value })}
          />
          <Input
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
          />
          <Button onClick={handleAddSchedule}>Schedule Follow-Up</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="font-semibold mb-2">Scheduled Follow-Ups:</h3>
          <ul className="list-disc list-inside">
            {schedules.map((schedule, index) => (
              <li key={index}>
                {schedule.client} - {schedule.date}
              </li>
            ))}
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

