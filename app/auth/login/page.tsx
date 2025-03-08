"use client";
import Login from '@/app/components/LoginComponent';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(data => {
           if(data.success){
               router.push('/dashboard');
              }else{
                    setLoading(false);
                }
        }).catch(err => {
            router.push('/auth/login');
            console.log(err);
        });

    }, [router]);

    const onSubmit = (email: string, password: string) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            "credentials": "include"
        }).then(res => res.json()).then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                toast(data.message);
            }
        });
    };

    return (
        <>
        
            <div className='relative h-screen'>
                <div className='flex justify-center items-center h-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700'>
                    {loading ? (<h1 className='text-4xl font-bold text-white'> 
                    Loading...
                    </h1>):(<Login onSubmit={onSubmit} />)}
                </div>
                <Toaster />
            </div>
        </>
    );
};

export default Page;