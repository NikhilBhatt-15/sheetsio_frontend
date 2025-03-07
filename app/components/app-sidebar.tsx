"use client";
import { Calendar, Home, Inbox, Search, Settings,LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { log } from "console";

// Menu items.
const items = [
  {
    title: "Create Table",
    url: "#",
    icon: Home,
  },
  {
    title: "All Tables",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Load Google Sheet",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]




export function AppSidebar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const logout = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
            method: 'POST',
            credentials: 'include'
            }).then(res => res.json()).then(data => {
            if(data.success){
                router.push('/auth/login');
            }else{
                toast(data.message);
            }
            }).catch(err => {
            console.log(err);
            return null;
            });
    }

    const getUser = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`, {
            method: 'GET',
            credentials: 'include'
            }).then(res => res.json()).then(data => {
            if(data.success){
                setUser(data.user);
            }else{
                toast(data.message);
                router.push('/auth/login');
            }
            }).catch(err => {
            console.log(err);
            return null;
            }); 
    }
  return (
    <Sidebar >
      <SidebarContent className="bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700" >
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={logout}>
                        <a>
                        <LogOut />
                        <span>Logout</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
