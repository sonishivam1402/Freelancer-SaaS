"use client"

import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthPlaceholder from "./AuthPlaceholder"
import GmailIntegration from "./GmailIntegration"
import AutoReplySystem from "./AutoReplySystem"
import FollowUpScheduler from "./FollowUpScheduler"
import CRMDashboard from "./CRMDashboard"
import { Inbox } from "lucide-react"
import InboxIntegration from "./InboxIntegration"

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <AuthPlaceholder />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Freelancer Auto-Reply & Follow-Up</h1>
      <Tabs defaultValue="gmail" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gmail">Gmail Integration</TabsTrigger>
          <TabsTrigger value="inbox">Inbox Integration</TabsTrigger>
          <TabsTrigger value="auto-reply">Auto-Reply</TabsTrigger>
          <TabsTrigger value="follow-up">Follow-Up Scheduler</TabsTrigger>
          <TabsTrigger value="crm">CRM Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="gmail">
          <GmailIntegration />
        </TabsContent>
        <TabsContent value="inbox">
          <InboxIntegration/>
        </TabsContent>
        <TabsContent value="auto-reply">
          <AutoReplySystem />
        </TabsContent>
        <TabsContent value="follow-up">
          <FollowUpScheduler />
        </TabsContent>
        <TabsContent value="crm">
          <CRMDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

