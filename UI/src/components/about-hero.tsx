import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutHero() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mx-auto max-w-3xl text-center  font-serif text-4xl font-normal leading-tight tracking-tight text-gray-900 sm:text-5xl">
        {"A brand built on the love of craftmanship, quality and outstanding customer service"}
      </h1>

      <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:mr-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-normal text-gray-900 mt-28">
            From a studio in London to a global brand with over 400 outlets
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              {"When we started Avion, the idea was simple. Make high quality furniture affordable and available for the mass market."}
            </p>
            <p>
              {"Handmade, and lovingly crafted furniture and homeware is what we live, breathe and design so our Chelsea boutique become the hotbed for the London interior design community."}
            </p>
          </div>
          <Button variant="outline" className="rounded-none px-8 mt-24">
            Get in touch
          </Button>
        </div>
        <div className="relative aspect-square w-full overflow-hidden bg-[#DCE5E5] mt-10">
          <Image
            src="/corner.png"
            alt="Modern living room setup"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
<div className=" grid gap-8 lg:grid-cols-2 lg:gap-12 lg:ml-12">
  {/* Image Section - Now Appears First */}
  <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5] lg:order-1">
    <Image
      src="/corner2.png"
      alt="Minimal room interior"
      fill
      className="object-cover"
    />
  </div>

  {/* Text Section - Now Appears Second */}
  <div className="order-1 space-y-6 lg:order-2">
    <h2 className="text-2xl font-normal text-gray-900 mt-28">
      {"Our service isn't just personal, it's actually hyper personally exquisite"}
    </h2>
    <div className="space-y-4 text-gray-600">
      <p>
        {"When we started Avion, the idea was simple. Make high quality furniture affordable and available for the mass market."}
      </p>
      <p>
       {" Handmade, and lovingly crafted furniture and homeware is what we live, breathe and design so our Chelsea boutique become the hotbed for the London interior design community."}
      </p>
    </div>
    <Button variant="outline" className="rounded-none px-8">
      Get in touch
    </Button>
  </div>
      </div>

    
        </div>
  )
}
