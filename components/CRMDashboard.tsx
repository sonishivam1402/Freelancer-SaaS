import { useEffect, useState } from "react"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Client {
  id: string
  Name: string
  Email: string
  last_contact: Timestamp
  Status: string
}

export default function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"))
        const clientData = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            Name: data.Name,
            Email: data.Email,
            last_contact: data.last_contact?.toDate().toLocaleString() || "N/A", // Convert Timestamp to string
            Status: data.Status,
          }
        }) as Client[]

        setClients(clientData)
      } catch (error) {
        console.error("Error fetching clients:", error)
      }
    }

    fetchClients()
  }, [])

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
              <TableHead>Email</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.Name}</TableCell>
                <TableCell>{row.Email}</TableCell>
                <TableCell>{row.last_contact}</TableCell>
                <TableCell>{row.Status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
