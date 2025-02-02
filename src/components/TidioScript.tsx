"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

export function TidioScript() {
  const pathname = usePathname()

  if (pathname === "/admin-dashboard") {
    return null
  }

  return <Script src="//code.tidio.co/d9l6imn8zglffuhnmc2wwwzbon9wijjb.js" async />
}

