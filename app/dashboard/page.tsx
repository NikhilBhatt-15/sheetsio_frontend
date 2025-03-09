"use client";
import { useRouter } from "next/navigation";
import TableDashboard from "../components/TableDashboard";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const logout = ()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,{
      method:"POST",
      credentials:"include"
    }).then((res)=>res.json())
    .then((data)=>{
      if(data.success){
        toast("Logged out successfully");
        router.push("/auth/login");
      }
    }
    ).catch((err)=>{
      toast("Server not responding");
      console.log(err);
    }
    )

  }
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between gap-2 w-full"><h1 className="text-2xl font-bold mb-6">Dynamic Table</h1>
      <Button variant="default"
      onClick={logout}
      >Logout</Button>
      </div>
      <p className="mb-6 text-muted-foreground">Create and edit tables or import data from Google Sheets.</p>
      <TableDashboard />
    </main>
    
  );
};

export default Dashboard;