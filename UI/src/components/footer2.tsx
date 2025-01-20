import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterest,
  FaSkype,
} from "react-icons/fa";
import { FiInstagram } from "react-icons/fi"; // Outline Instagram icon

const Footer2 = () => {
  return (
    <footer
      className="bg-[#2A254B] text-white px-6 py-16 md:px-12"
      style={{ fontFamily: "var(--font-clash-reg)" }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h3 className="text-base font-normal">Avion</h3>
            <address className="not-italic text-sm leading-relaxed">
              21 New York Street <br />
              New York City <br />
              United States of America <br />
              432 34
            </address>
            <p className="text-sm">&copy; 2022 Avion LTD</p>
          </div>

          {/* Column 2: Social Links */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Follow us</h3>
            <div className="flex items-center space-x-6">
              {[
                { icon: FaLinkedinIn, label: "LinkedIn" },
                { icon: FaFacebookF, label: "Facebook" },
                { icon: FiInstagram, label: "Instagram" },
                { icon: FaSkype, label: "Skype" },
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaPinterest, label: "Pinterest" },
              ].map((social, index) => (
                <Link
                  href="#"
                  key={index}
                  className="hover:text-gray-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Menu */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Menu</h3>
            <nav className="flex flex-col space-y-4">
              {["New arrivals", "Best sellers", "Recently viewed", "Popular this week", "All products"].map(
                (item, index) => (
                  <Link key={index} href="#" className="text-sm hover:underline">
                    {item}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Column 4: Categories */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Categories</h3>
            <nav className="flex flex-col space-y-4">
              {["Crockery", "Furniture", "Homeware", "Plant pots", "Chairs", "Crockery"].map(
                (item, index) => (
                  <Link key={index} href="#" className="text-sm hover:underline">
                    {item}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Column 5: Our Company */}
          <div className="space-y-6">
            <h3 className="text-base font-normal">Our company</h3>
            <nav className="flex flex-col space-y-4">
              {[
                { name: "About us", path: "/about" },
                { name: "Vacancies", path: "/products" },
                { name: "Contact us", path: "/cart" },
                { name: "Privacy", path: "/product-listing" },
                { name: "Returns policy", path: "/" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="text-sm hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
