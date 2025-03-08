import { NextRequest, NextResponse } from 'next/server'


export default async function middleware(req: NextRequest){
    const url = req.nextUrl.clone()
    
  
    if(req.url.includes("/dashboard")){
        if(!req.cookies.get("user-token")){
            url.pathname = '/auth/login'

            return NextResponse.redirect(url)
        }
    }
    return NextResponse.next()
}