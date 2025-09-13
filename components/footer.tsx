"use client"

import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { Facebook, Youtube, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Youtube", icon: Youtube, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Site Info */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary" />
              <span className="font-bold text-xl">{t("site.title")}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("site.description")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("navigation.categories")}</h3>
            <div className="space-y-2 text-sm">
              <Link href={`/${locale}/category/politics`} className="block hover:text-primary">
                {locale === "bn" ? "রাজনীতি" : "Politics"}
              </Link>
              <Link href={`/${locale}/category/sports`} className="block hover:text-primary">
                {locale === "bn" ? "খেলাধুলা" : "Sports"}
              </Link>
              <Link href={`/${locale}/category/technology`} className="block hover:text-primary">
                {locale === "bn" ? "প্রযুক্তি" : "Technology"}
              </Link>
              <Link href={`/${locale}/category/entertainment`} className="block hover:text-primary">
                {locale === "bn" ? "বিনোদন" : "Entertainment"}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("navigation.contact")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: contact@newsportal.com</p>
              <p>Phone: +880 1234 567890</p>
              <p>{locale === "bn" ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh"}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.followUs")}</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2024 {t("site.title")}. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
