import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "CardForge - Create Professional ID Cards",
  description:
    "Design and export stunning digital and physical ID cards with our intuitive card builder.",

  icons: {
    icon: "icon.svg",
    shortcut: "icon.svg",
    apple: "icon.svg",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-slate-900">
      <body className="bg-slate-900 antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}