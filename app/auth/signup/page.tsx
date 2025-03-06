"use client";

import Signup from "@/app/components/SignupComponent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function SignupPage() {
    const router = useRouter();
  const handleSignup = (name: string, email: string, password: string) => {
    console.log("Signing up with", name, email, password);
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
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        toast(data.message);
      }
    });
  };

  return <div className="flex justify-center items-center h-screen bg-linear-to-r from-gray-300 via-gray-500 to-gray-700">
    <Signup onSubmit={handleSignup} />
  </div>;
}
