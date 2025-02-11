"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const demoTemplate = {
  name: "Project Inquiry Response",
  content: `Dear [Client Name],

Thank you for reaching out about your project. I appreciate your interest in working with me.

I'd be happy to discuss your project in more detail. Could you please provide me with the following information:

1. A brief overview of your project
2. Your estimated timeline
3. Your budget range

Once I have this information, I'll be able to give you a more accurate estimate and determine if I'm the right fit for your project.

I look forward to hearing back from you.

Best regards,
[Your Name]`,
}

export default function AutoReplySystem() {
  const [templates, setTemplates] = useState<{ name: string; content: string }[]>([demoTemplate])
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "" })

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      setTemplates([...templates, newTemplate])
      setNewTemplate({ name: "", content: "" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Reply System</CardTitle>
        <CardDescription>Create and manage your auto-reply templates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <Textarea
            placeholder="Template Content"
            value={newTemplate.content}
            onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
          />
          <Button onClick={handleAddTemplate}>Add Template</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="font-semibold mb-2">Existing Templates:</h3>
          <ul className="list-disc list-inside">
            {templates.map((template, index) => (
              <li key={index}>{template.name}</li>
            ))}
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

