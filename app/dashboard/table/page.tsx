"use client"
import DynamicTable from "@/app/components/DynamicTable"
import { useSearchParams } from "next/navigation"
const Page = ()=>{
    const searchParams= useSearchParams();
    const tableId = searchParams.get("tableId");
    if(tableId){
        return(
            <DynamicTable tableId={tableId} />
        )
    }
    const sheetId = searchParams.get("sheetId");
    if(sheetId){
        return(
            <DynamicTable sheetId={sheetId} />
        )
    }
    return(
        <DynamicTable/>
    )
}

export default Page;