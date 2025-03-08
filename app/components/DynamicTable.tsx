/* eslint-disable */
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, Trash2, Save, Calendar, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format, set} from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getSheetId } from "../utils/webSocketClient"
import { toast } from "sonner"

// Types based on the Mongoose schema
type ColumnType = {
  name: string
  type: "text" | "date"
  _id?: string
}

type TableStructure = {
  _id?: string
  tableName: string
  columns: ColumnType[]
}

type RowData = {
  _id?: string
  data: Record<string, any>
}

type TableData = {
  _id?: string
  tableId: string
  rows: RowData[]
}

type GoogleSheetsData = {
  range: string
  values: string[][]
}

export default function DynamicTable({
  tableId,
  sheetId
}: { tableId?: string; sheetId?: string}) {
  const [tableStructure, setTableStructure] = useState<TableStructure | null>(null)
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCell, setActiveCell] = useState<{ rowIndex: number; columnName: string } | null>(null)
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<"text" | "date">("text")
  const [addColumnDialogOpen, setAddColumnDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [sheetsUrl, setSheetsUrl] = useState("")
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch table structure and data
  useEffect(() => {
    if (tableId) {
      fetchTableData(tableId)
    }else {
      // Create a new empty table if no tableId is provided
      setTableStructure({
        _id:'new', // This would be replaced with actual user ID
        tableName: "New Table",
        columns: [{ name: "Column 1", type: "text" }],
      })

      setTableData({
        _id: "new",
        tableId: "new",
        rows: [{ data: { "Column 1": "" } }],
      })

      setLoading(false)
    }
  }, [tableId])
  
  // Mock function to fetch table data - would be replaced with actual API call
  const fetchTableData = async (id: string) => {
    try {
      setLoading(true)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tablesync/read/${id}`,{
        method:"GET",
        credentials:"include"
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data);
        setTableStructure({
          _id:data.table._id,
          tableName: data.table.tableName,
          columns: data.table.columns,
        });
        setTableData({
          tableId: data.table._id,
          rows: data.rows.map((row: any)=>{
            return {
              data: row.data
            }
          }),
        });
      }).catch((err)=>{
        console.log(err);
      })
      
    } catch (error) {
      console.error("Error fetching table data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Save table data - would be replaced with actual API call
  const saveTableData = async () => {
    if (!tableStructure || !tableData) return;
  
    try {
      if (tableStructure._id === "new") {
        // Create a new table
        const createResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tablesync/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableName: tableStructure.tableName,
            columns: tableStructure.columns,
          }),
        });
  
        const createData = await createResponse.json();
        console.log("Table created successfully:", createData);
        setTableStructure({
          _id: createData.table._id,
          tableName: createData.table.tableName,
          columns: createData.table.columns,
        });
        console.log("Table created successfully:", tableStructure);
        setTableData({
          tableId: createData.table._id,
          rows: tableData.rows,
        });
  
        console.log("Table created successfully:", createData);
      }
  
      // Update the table data
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tablesync/update/${tableStructure._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: tableData.rows,
        }),
      });
  
      const updateData = await updateResponse.json();
  
      setTableData({
        tableId: updateData.table._id,
        rows: updateData.rows.map((row: any) => ({
          data: row.data,
        })),
      });
  
      toast("Table saved successfully");
      console.log("Table updated successfully:", updateData);
    } catch (error) {
      toast("Error saving table data");
      console.error("Error saving table data:", error);
    }
  };

  // Add a new column
  const addColumn = () => {
    if (!tableStructure || !tableData || !newColumnName.trim()) return

    // Check if column name already exists
    if (tableStructure.columns.some((col) => col.name === newColumnName)) {
      alert("Column name already exists")
      return
    }

    // Add column to structure
    const updatedStructure = {
      ...tableStructure,
      columns: [...tableStructure.columns, { name: newColumnName, type: newColumnType }],
    }

    // Add empty values for the new column to all existing rows
    const updatedRows = tableData.rows.map((row) => ({
      ...row,
      data: {
        ...row.data,
        [newColumnName]: newColumnType === "date" ? "" : "",
      },
    }))

    setTableStructure(updatedStructure)
    setTableData({
      ...tableData,
      rows: updatedRows,
    })

    setNewColumnName("")
    setAddColumnDialogOpen(false)
  }

  // Delete a column
  const deleteColumn = (columnName: string) => {
    if (!tableStructure || !tableData) return

    // Remove column from structure
    const updatedColumns = tableStructure.columns.filter((col) => col.name !== columnName)

    if (updatedColumns.length === 0) {
      alert("Cannot delete the last column")
      return
    }

    // Remove column data from all rows
    const updatedRows = tableData.rows.map((row) => {
      const { [columnName]: removed, ...restData } = row.data
      return {
        ...row,
        data: restData,
      }
    })

    setTableStructure({
      ...tableStructure,
      columns: updatedColumns,
    })

    setTableData({
      ...tableData,
      rows: updatedRows,
    })
  }

  // Add a new row
  const addRow = () => {
    if (!tableStructure || !tableData) return

    // Create empty row with all columns
    const emptyRowData: Record<string, any> = {}
    tableStructure.columns.forEach((column) => {
      emptyRowData[column.name] = ""
    })

    setTableData({
      ...tableData,
      rows: [...tableData.rows, { data: emptyRowData }],
    })
  }

  // Delete a row
  const deleteRow = (rowIndex: number) => {
    if (!tableData) return

    if (tableData.rows.length === 1) {
      alert("Cannot delete the last row")
      return
    }

    const updatedRows = [...tableData.rows]
    updatedRows.splice(rowIndex, 1)

    setTableData({
      ...tableData,
      rows: updatedRows,
    })
  }

  // Handle cell click to activate editing
  const handleCellClick = (rowIndex: number, columnName: string, columnType: string) => {
    setActiveCell({ rowIndex, columnName })

    if (columnType === "date" && tableData?.rows[rowIndex].data[columnName]) {
      try {
        const dateValue = tableData.rows[rowIndex].data[columnName]
        if (dateValue) {
          setSelectedDate(new Date(dateValue))
        }
      } catch (e) {
        setSelectedDate(undefined)
      }
    }
  }

  // Handle cell value change
  const handleCellChange = (value: string) => {
    if (!activeCell || !tableData) return

    const { rowIndex, columnName } = activeCell
    const updatedRows = [...tableData.rows]
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      data: {
        ...updatedRows[rowIndex].data,
        [columnName]: value,
      },
    }

    setTableData({
      ...tableData,
      rows: updatedRows,
    })
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!activeCell || !tableData || !date) return

    const { rowIndex, columnName } = activeCell
    const updatedRows = [...tableData.rows]
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      data: {
        ...updatedRows[rowIndex].data,
        [columnName]: date.toISOString().split("T")[0],
      },
    }

    setTableData({
      ...tableData,
      rows: updatedRows,
    })
    setSelectedDate(date)
  }

  // Focus the input when activeCell changes
  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeCell])

  // Handle click outside to deactivate cell
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setActiveCell(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND_URL}`) // Replace with your actual WebSocket URL
    wsRef.current = ws
    ws.onopen = () => {
      console.log("WebSocket Connected")
      setSocketConnected(true)
      setSocket(ws)
    }

    ws.onclose = () => {
      console.log("WebSocket Disconnected")
      setSocketConnected(false)
      setSocket(null)
    }

    ws.onerror = (error) => {
      toast("Error connecting to WebSocket")
      console.error("WebSocket Error:", error)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "google_sheets_data") {
          handleGoogleSheetsData(data.payload)
        }
      } catch (error) {
        console.log("Error parsing WebSocket message:", error)
      }
    }

    return () => {
      if(wsRef.current){
        wsRef.current.close()
      }
      setSocketConnected(false)
      setSocket(null)
    }
  },[])

  const importFromGoogleSheets = useCallback(() => {
    if (!wsRef.current || !socketConnected || !sheetsUrl){
      return
    } 

    setIsImporting(true)

    // Send the Google Sheets URL to the server
    wsRef.current.send(
      JSON.stringify({
        type: "connect",
        sheetId: getSheetId(sheetsUrl),
      }),
    )

    setImportDialogOpen(false)
  }, [socket, socketConnected, sheetsUrl])

  const handleGoogleSheetsData = useCallback(
    (data: GoogleSheetsData) => {
      if (!data || !data.values || data.values.length === 0) {
        setIsImporting(false)
        return
      }

      try {
        // Extract headers (first row)
        const headers = data.values[0]

        // Create columns
        const columns: ColumnType[] = headers.map((header) => ({
          name: header,
          type: "text", // Default to text type
        }))

        // Create rows
        const rows: RowData[] = []

        // Start from index 1 to skip the header row
        for (let i = 1; i < data.values.length; i++) {
          const rowData: Record<string, any> = {}

          // Map each cell to its corresponding header
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = data.values[i][j] || ""
          }
          
          rows.push({ data: rowData })
        }

        // Update table structure and data
        setTableStructure({
          _id: "new",
          tableName: "Google Sheets Import",
          columns,
        })
        console.log("Table Structure:", tableStructure)
        setTableData({
          tableId: tableId || "new",
          rows,
        })
      } catch (error) {
        console.error("Error processing Google Sheets data:", error)
      } finally {
        setIsImporting(false)
      }
    },
    [tableId],
  )
 
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading table data...</div>
  }

  if (!tableStructure || !tableData) {
    return <div className="flex justify-center items-center h-64">Table not found</div>
  }

  return (
    <div className="w-full overflow-auto border rounded-md">
      <div className="p-4 flex justify-between items-center bg-muted/40 border-b">
        <h2 className="text-lg font-semibold">{tableStructure?.tableName}</h2>
        <div className="flex gap-2">
          <Dialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Column
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Column</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={newColumnType} onValueChange={(value) => setNewColumnType(value as "text" | "date")}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select column type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addColumn}>Add Column</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={addRow} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Row
          </Button>

          <Button onClick={saveTableData} size="sm" variant="default" className="flex items-center gap-1">
            <Save className="h-4 w-4" /> Save Table
          </Button>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
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
                <Button onClick={importFromGoogleSheets} disabled={!socketConnected || !sheetsUrl || isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isImporting ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Importing data from Google Sheets...</p>
        </div>
      ) : (
        <div className="relative overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 bg-muted/40">#</TableHead>
                {tableStructure?.columns.map((column, colIndex) => (
                  <TableHead key={colIndex} className="min-w-[150px] bg-muted/40 border-2">
                    <div className="flex justify-between items-center">
                      <span>{column.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">{column.type}</span>
                        <Button
                          variant="default"
                          size="icon"
                          className="h-6 w-6 opacity-20 group-hover:opacity-100 hover:opacity-100"
                          onClick={() => deleteColumn(column.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData?.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="group">
                  <TableCell className="font-medium bg-muted/40 border-2">
                    <div className="flex justify-between items-center">
                      <span>{rowIndex + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        onClick={() => deleteRow(rowIndex)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  {tableStructure?.columns.map((column) => {
                    const isActiveCell = activeCell?.rowIndex === rowIndex && activeCell?.columnName === column.name
                    const cellValue = row.data[column.name] || ""

                    return (
                      <TableCell
                        key={column.name}
                        className="p-0 h-10 min-w-[150px] cursor-text border-2"
                        onClick={() => handleCellClick(rowIndex, column.name, column.type)}
                      >
                        {isActiveCell ? (
                          column.type === "text" ? (
                            <Input
                              ref={inputRef}
                              value={cellValue}
                              onChange={(e) => handleCellChange(e.target.value)}
                              className="h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setActiveCell(null)
                                }
                              }}
                            />
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal h-full border-0"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    handleDateSelect(date)
                                    setActiveCell(null)
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )
                        ) : (
                          <div className="px-4 py-2 h-full flex items-center">
                            {column.type === "date" && cellValue ? format(new Date(cellValue), "PPP") : cellValue}
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

