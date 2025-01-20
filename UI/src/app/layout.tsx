import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load fonts locally
const clashReg = localFont({
  src: "./fonts/ClashDisplay-Regular.otf",
  variable: "--font-clash-reg", // Updated variable name
  weight: "100 900",
});

const clashMed = localFont({
  src: "./fonts/ClashDisplay-Medium.otf",
  variable: "--font-clash-med", // Updated variable name
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Avion",
  description: "Luxury homeware for the modern generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${clashReg.variable} ${clashMed.variable} antialiased`} // Correctly use the font variable classes
      >
        {children}
      </body>
    </html>
  );
}
