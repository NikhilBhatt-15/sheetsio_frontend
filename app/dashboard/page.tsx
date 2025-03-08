"use client";
import { useRouter } from "next/navigation";
import TableDashboard from "../components/TableDashboard";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,{
      method:"GET",
      credentials:"include"
    }).then((res)=>res.json())
    .then((data)=>{
      if(!data.success){
        router.push("/auth/login");
      }
    }).catch((err)=>{
      console.log(err);
    }
  )});
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dynamic Table</h1>
      <p className="mb-6 text-muted-foreground">Create and edit tables or import data from Google Sheets.</p>
      <TableDashboard />
    </main>
    
  );
};

export default Dashboard;