import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FileSpreadsheet } from "lucide-react"

const Navbar  = ()=>{
    const router = useRouter();
    return (
    <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                TableSync
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                onClick={() => router.push("/auth/login")}
              >
                Log in
              </Button>
              <Button 
                variant="default"
                onClick={() => router.push("/auth/signup")}
                className="bg-primary hover:bg-primary/90"
              >
                Sign up free
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;