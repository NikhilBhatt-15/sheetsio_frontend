"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DynamicTable from "../components/DynamicTable";
import { Input } from "@/components/ui/input";
import {getSheetId} from "../utils/webSocketClient";
const Dashboard= ()=>{
  const [sheetId, setSheetId] = useState("");
  const [submittedSheetId, setSubmittedSheetId] = useState("");
  const router = useRouter();
  
  const logout = ()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,{
      method:"POST",
      credentials:"include"
    }).then((res)=>res.json())
    .then((data)=>{
      if(data.success){
        router.push("/auth/login");
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  // useEffect(()=>{
  //    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,{
  //     method:"GET",
  //     credentials:"include"
  //   }).then((res)=>res.json())
  //   .then((data)=>{
  //     if(!data.success){
  //       router.push("/auth/login");
  //     }
  //   }).catch((err)=>{
  //     router.push("/auth/login");
  //     console.log(err);
  //   })
  // },[router])
  
  return (
    <>
    {/* viewport height should be 100 */}
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dynamic Table</h1>
      <p className="mb-6 text-muted-foreground">Create and edit tables or import data from Google Sheets.</p>
      <DynamicTable />
    </main>
    </>
  )

}

export default Dashboard;