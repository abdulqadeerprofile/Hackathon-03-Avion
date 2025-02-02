import localFont from "next/font/local"
import "./globals.css"
import { metadata } from "./metadata"
import { TidioScript } from "../components/TidioScript"
import type React from "react" // Import React

// Load fonts locally
const clashReg = localFont({
  src: "./fonts/ClashDisplay-Regular.otf",
  variable: "--font-clash-reg",
  weight: "100 900",
})

const clashMed = localFont({
  src: "./fonts/ClashDisplay-Medium.otf",
  variable: "--font-clash-med",
  weight: "100 900",
})

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${clashReg.variable} ${clashMed.variable} antialiased`}>
        {children}
        <TidioScript />
      </body>
    </html>
  )
}

