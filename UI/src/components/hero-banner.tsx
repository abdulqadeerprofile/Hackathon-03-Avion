import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="relative min-h-[700px] md:min-h-[600px] lg:min-h-[700px] flex flex-col md:block">
      {/* White Box - On top for mobile, overlaid for larger screens */}
      <div className="bg-white p-8 md:p-12 md:max-w-lg lg:max-w-xl xl:max-w-2xl md:absolute md:top-1/2 md:right-20 md:transform md:-translate-y-1/2 z-10">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-clash-reg)' }} // Apply custom font to the header
        >
          Luxury homeware for people who love timeless design quality
        </h1>
        <p
          className="text-gray-600 mb-6"
          style={{ fontFamily: 'var(--font-clash-reg)' }} // Apply custom font to the paragraph
        >
          Shop the new Spring 2022 collection today
        </p>
        <Link href="/product-listing">
          <Button
            variant="outline"
            className="text-[#2A254B] hover:bg-gray-100 bg-gray-300 lg:mt-32"
            style={{ fontFamily: 'var(--font-clash-reg)' }} // Apply custom font to button text
          >
            View collection
          </Button>
        </Link>
      </div>

      {/* Background Image - Below div on mobile, full-size background on larger screens */}
      <div className="relative flex-grow md:absolute md:inset-0">
        <Image
          src="/banner.png"
          alt="Luxury homeware showcase"
          layout="fill"
          objectFit="cover"
          priority
          className="z-0"
        />
      </div>
    </div>
  );
}
