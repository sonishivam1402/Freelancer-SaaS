"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InboxIntegration() {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])
  const [newAccount, setNewAccount] = useState("")

  const handleConnect = () => {
    if (newAccount && !connectedAccounts.includes(newAccount)) {
      setConnectedAccounts([...connectedAccounts, newAccount])
      setNewAccount("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbox Integration</CardTitle>
        <CardDescription>Connect your email and messaging accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email or account"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
            />
            <Button onClick={handleConnect}>Connect</Button>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Connected Accounts:</h3>
            <ul className="list-disc list-inside">
              {connectedAccounts.map((account, index) => (
                <li key={index}>{account}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

