"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Shield } from "lucide-react"

export function UserNav() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/auth/login`}>{locale === "bn" ? "লগইন" : "Login"}</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/${locale}/auth/register`}>{locale === "bn" ? "রেজিস্টার" : "Register"}</Link>
        </Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push(`/${locale}`)
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "editor"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.avatar || "/placeholder.svg"} alt={session.user.name} />
            <AvatarFallback>
              {session.user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{session.user.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`}>
            <User className="mr-2 h-4 w-4" />
            {locale === "bn" ? "প্রোফাইল" : "Profile"}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/${locale}/settings`}>
            <Settings className="mr-2 h-4 w-4" />
            {locale === "bn" ? "সেটিংস" : "Settings"}
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/admin`}>
              <Shield className="mr-2 h-4 w-4" />
              {locale === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {locale === "bn" ? "লগআউট" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
