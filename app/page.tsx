"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from './components/Navbar'
import { ArrowRight, Table, Database, FileSpreadsheet, Share2, Workflow, LineChart } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
  
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-8">
              <span className="text-primary font-medium">New</span>
              <span className="text-gray-600">Real-time Google Sheets sync now available</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              Your data, 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                {" "}seamlessly synced
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your Google Sheets into powerful, interactive tables. Create, manage, and 
              collaborate on your data with enterprise-grade tools and real-time synchronization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                onClick={() => router.push("/dashboard")}
              >
                Try Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => router.push("/auth/signup")}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to sync your sheets?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of teams who have already transformed their 
              Google Sheets workflow with TableSync.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              onClick={() => router.push("/dashboard")}
            >
              Start Syncing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">TableSync</span>
          </div>
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} TableSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    
  );
}

const features = [
  {
    title: "Google Sheets Integration",
    description:
      "Seamlessly connect and sync your Google Sheets data with real-time updates and automatic backups.",
    icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
  },
  {
    title: "Custom Tables",
    description:
      "Create and manage custom tables with advanced filtering, sorting, and visualization capabilities.",
    icon: <Table className="h-6 w-6 text-primary" />,
  },
  {
    title: "Data Management",
    description:
      "Powerful tools for data organization, validation, and transformation with version history.",
    icon: <Database className="h-6 w-6 text-primary" />,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time with built-in commenting and sharing features.",
    icon: <Share2 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Automated Workflows",
    description:
      "Create custom automation rules to keep your data synchronized across different sheets and tables.",
    icon: <Workflow className="h-6 w-6 text-primary" />,
  },
  {
    title: "Analytics & Insights",
    description:
      "Generate powerful insights with built-in analytics tools and customizable dashboards.",
    icon: <LineChart className="h-6 w-6 text-primary" />,
  },
];