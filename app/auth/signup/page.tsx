"use client";

import Signup from "@/app/components/SignupComponent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,{
      method:"GET",
      credentials:"include"
    }).then((res)=>res.json())
    .then((data)=>{
      if(data.success){
        setLoading(false);
        router.push("/dashboard");
      }else{
        setLoading(false);
      }
    }).catch((err)=>{
      console.log(err);
  })});

  const handleSignup = (name: string, email: string, password: string) => { 
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then((res) => res.json())  
    .then((data) => {
      if (data.success) {
        router.push("/dashboard");
      } else {
        toast(data.message);
      }
    });
  };



  return <div className="flex justify-center items-center h-screen bg-linear-to-r from-gray-300 via-gray-500 to-gray-700">
    {loading ? (
      <h1 className="text-4xl font-bold text-white">Loading...</h1>
    ) : (
      <Signup onSubmit={handleSignup} />
    )}
  </div>;
}
