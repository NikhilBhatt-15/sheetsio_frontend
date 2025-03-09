"use client";
import { useRouter } from "next/navigation";
import TableDashboard from "../components/TableDashboard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setIsVerified(true);
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.log(err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast("Logged out successfully");
        router.push("/auth/login");
      }
    } catch (err) {
      toast("Server not responding");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </main>
    );
  }

  if (!isVerified) {
    return null;
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between gap-2 w-full">
        <h1 className="text-2xl font-bold mb-6">Dynamic Table</h1>
        <Button variant="default" onClick={logout}>
          Logout
        </Button>
      </div>
      <p className="mb-6 text-muted-foreground">Create and edit tables or import data from Google Sheets.</p>
      <TableDashboard />
    </main>
  );
};

export default Dashboard;