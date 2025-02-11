"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function GmailIntegration() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gmail", {
        method: "GET",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
    setLoading(false);
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Gmail Integration</CardTitle>
        <CardDescription className="text-gray-600">Fetch and manage your Gmail messages</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchEmails} disabled={loading} className="w-[300px] bg-primary hover:bg-primary/90">
          {loading ? "Fetching Emails..." : "Fetch Recent Emails"}
        </Button>

        {loading && (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-6 w-full bg-gray-300" />
            <Skeleton className="h-6 w-3/4 bg-gray-300" />
            <Skeleton className="h-6 w-2/3 bg-gray-300" />
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="mt-4 p-3 border border-gray-300 rounded-md bg-gray-50 max-h-[20rem] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Messages:</h3>
            <ul className="space-y-2">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedMessage(message)}
                >
                  <p className="text-gray-900  font-semibold font-medium">
                    {message.payload.headers.find(header => header.name === "Subject")?.value || "No Subject"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    From: {message.payload.headers.find(header => header.name === "From")?.value || "Unknown Sender"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Date: {message.payload.headers.find(header => header.name === "Date")?.value || "Unknown Date"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="mt-4 text-center text-gray-500">
            <p>No recent emails found.</p>
          </div>
        )}
      </CardContent>

      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent>
            <DialogTitle>
              {selectedMessage.payload.headers.find(header => header.name === "Subject")?.value || "No Subject"}
            </DialogTitle>
            <p className="text-gray-500 mt-2">
              {selectedMessage.snippet || "No preview available"}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
