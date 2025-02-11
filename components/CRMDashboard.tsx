import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { id: 1, client: "John Doe", lastContact: "2023-05-01", status: "Replied" },
  { id: 2, client: "Jane Smith", lastContact: "2023-05-03", status: "Pending" },
  { id: 3, client: "Bob Johnson", lastContact: "2023-05-02", status: "Follow-up" },
]

export default function CRMDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM Dashboard</CardTitle>
        <CardDescription>Track your client interactions and inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.lastContact}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

