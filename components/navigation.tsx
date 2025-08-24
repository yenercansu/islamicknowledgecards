"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Settings } from "lucide-react"

interface NavigationProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export function Navigation({ title, showBackButton = false, backHref = "/" }: NavigationProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title || "Islamic Studies"}</h1>
              {!title && <p className="text-muted-foreground text-sm">Flashcard Quiz App</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            )}

            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
