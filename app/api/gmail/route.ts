import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session:", session); // Log the session

    if (!session || !session.accessToken) {
      console.error("Not authenticated or accessToken missing");
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    // Fetch the full message details including the snippet
    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return msg.data;
      })
    );

    console.log("Gmail response:", messageDetails); // Log the Gmail response

    return new Response(JSON.stringify({ messages: messageDetails }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/gmail:", error); // Log the error
    return new Response(JSON.stringify({ error: "Failed to fetch emails" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
