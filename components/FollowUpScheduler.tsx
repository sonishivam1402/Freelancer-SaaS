"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Client {
  id: string;
  Name: string;
  Email: string;
}

interface Schedule {
  id?: string;
  client: string;
  clientEmail: string;
  date: Timestamp;
  meetLink?: string;
}

export default function FollowUpScheduler() {
  const [clients, setClients] = useState<Client[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({ client: "", clientEmail: "", date: "" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          Name: doc.data().Name,
          Email: doc.data().Email,
        }));
        setClients(clientData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Listen to scheduled meetings in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "scheduled_meetings"), (snapshot) => {
      const scheduleData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          client: data.client,
          clientEmail: data.clientEmail,
          date: data.date instanceof Timestamp ? data.date : Timestamp.fromDate(new Date(data.date)), // Ensure Timestamp format
          meetLink: data.meetLink,
        };
      }) as Schedule[];
      setSchedules(scheduleData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddSchedule = async () => {
    if (!newSchedule.client || !newSchedule.date) return;

    setLoading(true);

    try {
      // Schedule Meeting via API
      const response = await fetch("/api/scheduleMeet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) throw new Error("Failed to schedule meet");

      const data = await response.json();
      const scheduledMeeting = {
        client: newSchedule.client,
        clientEmail: newSchedule.clientEmail,
        date: Timestamp.fromDate(new Date(newSchedule.date)), // Convert date to Firestore Timestamp
        meetLink: data.event.hangoutLink,
      };

      // Save to Firestore
      await addDoc(collection(db, "scheduled_meetings"), scheduledMeeting);

      // Send email notification
      await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: newSchedule.clientEmail,
          client: newSchedule.client,
          date: newSchedule.date,
          meetLink: data.event.hangoutLink,
        }),
      });

      setNewSchedule({ client: "", clientEmail: "", date: "" });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meet");
    }

    setLoading(false);
  };

  // Highlighting logic
  const tileClassName = ({ date }: { date: Date }) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const hasMeeting = schedules.some((schedule) => schedule.date.toDate().toDateString() === date.toDateString());
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
  
    if (isToday) return "calendar-today"; // Yellow
    if (hasMeeting) return "calendar-meeting"; // Red
    if (isSelected) return "calendar-selected"; // Blue
  
    return "";
  };
  

  // Filter meetings for the selected date
  const filteredMeetings = selectedDate
    ? schedules.filter((schedule) => schedule.date.toDate().toDateString() === selectedDate.toDateString())
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-Up Scheduler</CardTitle>
        <CardDescription>Schedule automated follow-ups with Google Meet</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Layout: Flex row with Calendar & Scheduling Form */}
        <div className="flex gap-6">
          {/* Left: Calendar */}
          <div className="w-1/2 p-4 border rounded-lg">
            <Calendar onClickDay={(date) => setSelectedDate(date)} tileClassName={tileClassName} />
          </div>

          {/* Right: Client Selection & Scheduling */}
          <div className="w-1/2 space-y-4">
            {/* Client Name Dropdown */}
            <Select
              onValueChange={(value) => {
                const selectedClient = clients.find((c) => c.Name === value);
                if (selectedClient) {
                  setNewSchedule({ ...newSchedule, client: selectedClient.Name, clientEmail: selectedClient.Email });
                }
              }}
              value={newSchedule.client}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.Name}>
                    {client.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Input */}
            <Input
              type="datetime-local"
              value={newSchedule.date}
              onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
            />

            {/* Schedule Button */}
            <Button onClick={handleAddSchedule} disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Google Meet"}
            </Button>
          </div>
        </div>

        {/* Display Meetings for Selected Date */}
        {selectedDate && (
          <div className="p-4 mt-6 border rounded-lg">
            <h3 className="font-semibold">Meetings on {selectedDate.toDateString()}:</h3>
            {filteredMeetings.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {filteredMeetings.map((schedule) => (
                  <li key={schedule.id}>
                    <strong>{schedule.client}</strong> - {schedule.date.toDate().toLocaleString()}{" "}
                    {schedule.meetLink && (
                      <a href={schedule.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Join Meet
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No meetings scheduled for this day.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
