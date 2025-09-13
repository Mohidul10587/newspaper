"use client"

import type React from "react"

import { useState } from "react"
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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

    if (password !== confirmPassword) {
      setError(locale === "bn" ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError(locale === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || (locale === "bn" ? "রেজিস্ট্রেশন করতে সমস্যা হয়েছে" : "Registration failed"))
      } else {
        toast({
          title: locale === "bn" ? "সফলভাবে রেজিস্টার হয়েছে" : "Registration successful",
          description: locale === "bn" ? "এখন লগইন করুন" : "You can now login with your credentials",
        })
        router.push(`/${locale}/auth/login`)
      }
    } catch (error) {
      setError(locale === "bn" ? "রেজিস্ট্রেশন করতে সমস্যা হয়েছে" : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{locale === "bn" ? "রেজিস্টার" : "Register"}</CardTitle>
          <CardDescription className="text-center">
            {locale === "bn" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create a new account to get started"}
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
              <Label htmlFor="name">{locale === "bn" ? "নাম" : "Full Name"}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "bn" ? "আপনার নাম লিখুন" : "Enter your full name"}
                required
                disabled={isLoading}
              />
            </div>

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
                  placeholder={locale === "bn" ? "পাসওয়ার্ড লিখুন" : "Enter password"}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{locale === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={locale === "bn" ? "পাসওয়ার্ড আবার লিখুন" : "Confirm your password"}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === "bn" ? "রেজিস্টার করুন" : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {locale === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}
            </span>{" "}
            <Link href={`/${locale}/auth/login`} className="font-medium text-primary hover:underline">
              {locale === "bn" ? "লগইন করুন" : "Login"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
