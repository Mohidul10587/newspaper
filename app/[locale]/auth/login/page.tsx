"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(locale === "bn" ? "ইমেইল বা পাসওয়ার্ড ভুল" : "Invalid email or password")
      } else {
        // Get updated session to check user role
        const session = await getSession()

        toast({
          title: locale === "bn" ? "সফলভাবে লগইন হয়েছে" : "Login successful",
          description: locale === "bn" ? "আপনি সফলভাবে লগইন হয়েছেন" : "You have been logged in successfully",
        })

        // Redirect based on user role
        if (session?.user?.role === "admin" || session?.user?.role === "editor") {
          router.push(`/${locale}/admin`)
        } else {
          router.push(`/${locale}`)
        }
      }
    } catch (error) {
      setError(locale === "bn" ? "লগইন করতে সমস্যা হয়েছে" : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{locale === "bn" ? "লগইন" : "Login"}</CardTitle>
          <CardDescription className="text-center">
            {locale === "bn" ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{locale === "bn" ? "ইমেইল" : "Email"}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={locale === "bn" ? "আপনার ইমেইল লিখুন" : "Enter your email"}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{locale === "bn" ? "পাসওয়ার্ড" : "Password"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === "bn" ? "আপনার পাসওয়ার্ড লিখুন" : "Enter your password"}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === "bn" ? "লগইন করুন" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{locale === "bn" ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}</span>{" "}
            <Link href={`/${locale}/auth/register`} className="font-medium text-primary hover:underline">
              {locale === "bn" ? "রেজিস্টার করুন" : "Register"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
