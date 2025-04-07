"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Layers, FileText, Award, LayoutDashboard, Users, Settings, LogOut, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      title: "Dashboard",
      color: "bg-pink-100 text-pink-600",
      hoverColor: "hover:bg-pink-100 hover:text-pink-600",
    },
    {
      href: "/admin/courses",
      icon: BookOpen,
      title: "Courses",
      color: "bg-blue-100 text-blue-600",
      hoverColor: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      href: "/admin/units",
      icon: Layers,
      title: "Units",
      color: "bg-purple-100 text-purple-600",
      hoverColor: "hover:bg-purple-100 hover:text-purple-600",
    },
    {
      href: "/admin/lessons",
      icon: FileText,
      title: "Lessons",
      color: "bg-green-100 text-green-600",
      hoverColor: "hover:bg-green-100 hover:text-green-600",
    },
    {
      href: "/admin/challenges",
      icon: Award,
      title: "Challenges",
      color: "bg-yellow-100 text-yellow-600",
      hoverColor: "hover:bg-yellow-100 hover:text-yellow-600",
    },
    {
      href: "/admin/users",
      icon: Users,
      title: "Students",
      color: "bg-orange-100 text-orange-600",
      hoverColor: "hover:bg-orange-100 hover:text-orange-600",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      title: "Settings",
      color: "bg-gray-100 text-gray-600",
      hoverColor: "hover:bg-gray-100 hover:text-gray-600",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white border-r rounded-r-3xl shadow-lg md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              KidLearn Admin
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="grid items-start gap-2 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${route.hoverColor} ${
                  pathname === route.href ? route.color : "text-gray-500"
                }`}
              >
                <route.icon className="h-5 w-5" />
                <span className="font-semibold">{route.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 rounded-xl">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Teacher" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    TE
                  </AvatarFallback>
                </Avatar>
                <span>Teacher</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
          <div className="flex flex-1 items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Teacher" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      TE
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

