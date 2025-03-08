"use client"
import TableDashboard from "../components/TableDashboard";
const Dashboard= ()=>{  
  return (
    <>
    {/* viewport height should be 100 */}
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dynamic Table</h1>
      <p className="mb-6 text-muted-foreground">Create and edit tables or import data from Google Sheets.</p>
      <TableDashboard/>
    </main>
    </>
  )

}

export default Dashboard;