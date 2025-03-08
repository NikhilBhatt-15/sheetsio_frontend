"use client"

import { useState, useEffect } from "react"
import { Plus, FileSpreadsheet, Clock, TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Types for the table listings
type TableListing = {
  _id: string
  userId: string
  tableName: string
  createdAt: string
  updatedAt: string
}

export default function TableDashboard() {
  const [recentTables, setRecentTables] = useState<TableListing[]>([])
  const [loading, setLoading] = useState(true)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTableName, setNewTableName] = useState("")
  const [sheetsUrl, setSheetsUrl] = useState("")
  const [isCreatingTable, setIsCreatingTable] = useState(false)

  // Load recent tables
  const router = useRouter();
  useEffect(() => {
    fetchRecentTables()
  }, [])

  const fetchRecentTables = async () => {
    try {
      setLoading(true)

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tablesync/tables`,{
        method:"GET",
        credentials:"include"
      }).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            setRecentTables(data.tables)
        }).catch((err)=>{
            console.log(err);
        });
      
    } catch (error) {
      console.error("Error fetching recent tables:", error)
      toast("Error fetching recent tables")
    } finally {
      setLoading(false)
    }
  }

  // Handle create new table
  const handleCreateTable = async () => {
    if (!newTableName.trim()) return

    setIsCreatingTable(true)

    try {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tablesync/create`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
      },
      credentials:"include",
        body:JSON.stringify({
            tableName:newTableName,
            columns:[
                {
                    name:"Column 1",
                    type:"text"
                }   
            ]
        })
        }).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            setCreateDialogOpen(false)
            router.push("/dashboard/table?tableId="+data.table._id)
        }).catch((err)=>{
            console.log(err);
            toast("error"+"Error creating table")
        });
        
    } catch (error) {
      console.error("Error creating table:", error)
    } finally {
      setIsCreatingTable(false)
    }
  }

  // Back to dashboard

  // If a table is selected, show the dynamic table component


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Tables</h2>
        <div className="flex gap-3">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create New Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Table</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-name" className="text-right">
                    Table Name
                  </Label>
                  <Input
                    id="table-name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="My New Table"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTable} disabled={isCreatingTable || !newTableName.trim()}>
                  {isCreatingTable ? "Creating..." : "Create Table"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Import from Sheets
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import from Google Sheets</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheets-url" className="text-right">
                    Google Sheets URL
                  </Label>
                  <Input
                    id="sheets-url"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="col-span-3"
                  />
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  Make sure your Google Sheet is publicly accessible or shared with the service account.
                </div>
              </div>
              <DialogFooter>
                <Button onClick={()=>{
                    // i want to load dynamic table
                    const sheetId = sheetsUrl.split("/d/")[1].split("/")[0]
                    router.push("/dashboard/table?sheetId="+sheetId)
                    setImportDialogOpen(false)

                }} disabled={!sheetsUrl.trim()}>
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : recentTables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTables.map((table) => (
            <Card key={table._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TableIcon className="h-5 w-5" /> {table.tableName}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" /> Created {format(new Date(table.createdAt), "MMM d, yyyy")}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Last updated {format(new Date(table.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="default" className="w-full" onClick={() => router.push("/dashboard/table?tableId="+table._id)}>
                  Open Table
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <TableIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No tables found</h3>
          <p className="text-muted-foreground mb-6">Create your first table or import one from Google Sheets</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create New Table
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Import from Sheets
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

