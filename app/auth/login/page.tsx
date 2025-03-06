"use client"
import Login from '@/app/components/LoginComponent'
import { FileSpreadsheet } from 'lucide-react'
import { useRouter } from "next/navigation";
import Router from 'next/router'
import React, { use, useEffect } from 'react'
import { toast, Toaster } from 'sonner';


const page = () => {
    const router = useRouter()
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            console.log('token',token)
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`,{
                method:'GET',
                headers:{
                    "Content-type":'application/json',
                    "Authorization": `Bearer ${token}`,
                }
            }).then(res=>res.json())
            .then(data=>{
                if(data.success){
                    router.push('/dashboard')
                }
            })
        }
    },[])
    
const onSubmit = (email:string,password:string)=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email,password})
    }).then(res=>res.json()).then(data=>{
        if(data.success){
            localStorage.setItem('token',data.token)
            router.push('/dashboard')
        }else{
            // i want to show Toaster here
            toast( data.message)
        }
    })
}
  return (
    <>
    
    <div className='flex justify-center items-center h-screen bg-linear-to-r from-gray-300 via-gray-500 to-gray-700 '>
        
        <Login onSubmit={onSubmit} />
    </div>
    
    </>
  )
}

export default page