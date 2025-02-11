import { google } from "googleapis"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions) // ✅ Pass authOptions
  console.log("Session Data:", session) // Debugging

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { client, date } = await req.json()
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: session.accessToken })

  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  try {
    const event = {
      summary: `Follow-up with ${client}`,
      description: `Scheduled follow-up meeting with ${client}`,
      start: {
        dateTime: new Date(date).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(new Date(date).getTime() + 30 * 60 * 1000).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: { requestId: "meeting-" + Date.now() },
      },
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Enables Google Meet
    })

    return NextResponse.json({ event: response.data }, { status: 200 })
  } catch (error) {
    console.error("Google Calendar API Error:", error)
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 })
  }
}
