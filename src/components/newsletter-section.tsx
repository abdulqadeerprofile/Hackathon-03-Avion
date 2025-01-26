import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <section className="relative text-white py-16 px-6 md:px-24 overflow-hidden mt-12 md:mt-20" style={{ fontFamily: 'var(--font-clash-reg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/gallery.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {/* Reduced the opacity for more visibility */}
      <div className="absolute inset-0 bg-[#A65A2A] opacity-50 z-10"></div>
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <h2 className="text-3xl md:text-4xl font-medium mb-4">
          Join the club and get the benefits
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Sign up for our newsletter and receive exclusive offers on
          new ranges, sales, pop-up stores, and more
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-4 text-sm mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Exclusive offers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Free events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Large discounts</span>
            </div>
          </div>
        </div>
        <form className="flex flex-col md:flex-row gap-4 mt-8 max-w-xl mx-auto">
          <Input
            type="email"
            placeholder="your@email.com"
            className="bg-white text-black flex-grow"
          />
          <Button type="submit" className="bg-[#2A254B] hover:bg-[#2A254B]/90 text-white">
            Sign up
          </Button>
        </form>
      </div>
    </section>
  );
}
