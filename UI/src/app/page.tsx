import { Navbar } from "@/components/Navbar";
import Hero from "@/components/hero-banner"
import Features from "@/components/features-section"
import News from "@/components/newsletter-section"
import Hero2 from "@/components/hero-section"
import Footer from "@/components/footer"
export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero />
    <Features/>
    <Hero2/>
    <News/>
    <Footer/>
    </>
  )
}
