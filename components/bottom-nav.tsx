"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Dumbbell, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/workouts",
      icon: Dumbbell,
      label: "Workouts",
      active: pathname.startsWith("/workouts"),
    },
    {
      href: "/progress",
      icon: BarChart2,
      label: "Progress",
      active: pathname === "/progress",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <nav className="flex justify-around">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center py-2 px-3",
              link.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <link.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

