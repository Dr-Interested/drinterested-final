"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Check, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/**
 * Site translation through Google Translate. English is the default and loads nothing extra;
 * choosing another language stores Google's `googtrans` cookie and reloads, and only then is
 * Google's script loaded to translate the page. English and French come first (Canada's
 * official languages), then the other languages our members speak most.
 */
const PRIMARY = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
]

const MORE = [
  { code: "es", name: "Español" },
  { code: "ar", name: "العربية" },
  { code: "zh-CN", name: "中文 (简体)" },
  { code: "zh-TW", name: "中文 (繁體)" },
  { code: "hi", name: "हिन्दी" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "اردو" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ml", name: "മലയാളം" },
  { code: "si", name: "සිංහල" },
  { code: "ne", name: "नेपाली" },
  { code: "tl", name: "Filipino" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "pl", name: "Polski" },
  { code: "tr", name: "Türkçe" },
  { code: "fa", name: "فارسی" },
  { code: "ps", name: "پښتو" },
  { code: "so", name: "Soomaali" },
  { code: "sw", name: "Kiswahili" },
  { code: "am", name: "አማርኛ" },
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yorùbá" },
  { code: "ig", name: "Igbo" },
]

const COOKIE = "googtrans"

export function readLang(): string {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  const code = m ? decodeURIComponent(m[1]).split("/").pop() : ""
  return code || "en"
}

function writeLang(code: string) {
  const host = window.location.hostname
  // Google reads the cookie on the exact host and on the parent domain; set or clear both.
  const domains = ["", host.includes(".") ? `; domain=.${host.split(".").slice(-2).join(".")}` : ""]
  for (const d of domains) {
    if (code === "en") document.cookie = `${COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`
    else document.cookie = `${COOKIE}=/en/${code}; path=/; max-age=31536000; SameSite=Lax${d}`
  }
}

/** The language the visitor picked ("en" until the page has mounted). */
export function useSiteLang(): string {
  const [lang, setLang] = useState("en")
  useEffect(() => setLang(readLang()), [])
  return lang
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

export function LanguagePicker({ className }: { className?: string }) {
  const [lang, setLang] = useState("en")
  useEffect(() => setLang(readLang()), [])

  const choose = (code: string) => {
    if (code === lang) return
    writeLang(code)
    window.location.reload()
  }

  const current = [...PRIMARY, ...MORE].find((l) => l.code === lang)

  return (
    <>
      {lang !== "en" && (
        <>
          <div id="google_translate_element" className="hidden" aria-hidden="true" />
          <Script id="google-translate-init" strategy="afterInteractive">
            {`window.googleTranslateElementInit = function () {
              new google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "google_translate_element");
            };`}
          </Script>
          <Script
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Language: ${current?.name ?? "English"}. Change language`}
          className={cn(
            "notranslate inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 text-xs font-semibold uppercase text-ink transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-deep",
            className,
          )}
          translate="no"
        >
          <Globe className="h-[18px] w-[18px]" />
          <span>{lang === "en" ? "EN" : lang.split("-")[0]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="notranslate max-h-[70vh] w-56 overflow-y-auto" translate="no">
          {PRIMARY.map((l) => (
            <DropdownMenuItem key={l.code} onSelect={() => choose(l.code)} className="justify-between font-medium">
              {l.name}
              {lang === l.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">More languages (Google Translate)</DropdownMenuLabel>
          {MORE.map((l) => (
            <DropdownMenuItem key={l.code} onSelect={() => choose(l.code)} className="justify-between">
              <span lang={l.code}>{l.name}</span>
              {lang === l.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
