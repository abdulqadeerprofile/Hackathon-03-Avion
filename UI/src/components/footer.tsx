import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterest,
  FaSkype,
} from "react-icons/fa";
import { FiInstagram } from "react-icons/fi"; // Outline Instagram icon

export default function Footer() {
  return (
    <footer
      className="bg-[#2A254B] text-white px-6 py-16 md:px-12"
      style={{ fontFamily: "var(--font-clash-reg)" }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Menu Column */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Menu</h3>
            <nav className="flex flex-col space-y-4">
              <Link href="#" className="text-sm hover:underline">
                New arrivals
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Best sellers
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Recently viewed
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Popular this week
              </Link>
              <Link href="#" className="text-sm hover:underline">
                All products
              </Link>
            </nav>
          </div>

          {/* Categories Column */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Categories</h3>
            <nav className="flex flex-col space-y-4">
              <Link href="#" className="text-sm hover:underline">
                Crockery
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Furniture
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Homeware
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Plant pots
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Chairs
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Crockery
              </Link>
            </nav>
          </div>

          {/* Our Company Column */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Our company</h3>
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-sm hover:underline">
                About us
              </Link>
              <Link href="/products" className="text-sm hover:underline">
                Vacancies
              </Link>
              <Link href="/cart" className="text-sm hover:underline">
                Contact us
              </Link>
              <Link href="/product-listing" className="text-sm hover:underline">
                Privacy
              </Link>
              <Link href="/" className="text-sm hover:underline">
                Returns policy
              </Link>
            </nav>
          </div>

          {/* Join Mailing List */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Join our mailing list</h3>
            <div className="flex gap-2 w-full">
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-[#393653] border-none text-white placeholder:text-gray-400 h-12 w-full"
              />
              <Button className="bg-white text-black hover:bg-gray-100 h-12 px-6">
                Sign up
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-[#4E4D93]">
          <p className="text-sm mb-6 md:mb-0">Copyright 2022 Avion LTD</p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="hover:text-gray-300">
              <FaLinkedinIn className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <FaFacebookF className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <FiInstagram className="w-5 h-5" /> {/* Outline Instagram */}
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <FaSkype className="w-5 h-5" />
              <span className="sr-only">Skype</span>
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <FaTwitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-gray-300">
              <FaPinterest className="w-5 h-5" />
              <span className="sr-only">Pinterest</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
