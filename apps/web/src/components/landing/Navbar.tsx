"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
            pointer-events-auto
            flex items-center justify-between 
            px-6 py-3 
            rounded-full 
            backdrop-blur-md 
            border border-white/10 
            shadow-2xl 
            transition-all duration-500 ease-in-out
            ${isScrolled ? "bg-black/70 w-full max-w-4xl py-2" : "bg-black/40 w-full max-w-6xl py-4"}
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4 md:mr-8">
            <div className="w-8 h-8 bg-primary-teal rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-teal/20">
            Rx
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">
            PharmaOS
            </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
            <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
            >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-teal transition-all group-hover:w-full" />
            </Link>
            ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4 ml-4 md:ml-8">
            <Link
              href="/login"
              className="text-sm font-semibold text-white hover:text-primary-teal-light transition-colors"
            >
              Login
            </Link>
            <Link
              href="/onboarding"
              className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
            >
              Get Started
            </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-primary-teal-light transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto absolute top-full mt-4 w-[90%] max-w-md bg-black/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col space-y-4">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-white/80 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              href="/login"
              className="text-lg font-semibold text-white hover:text-primary-teal-light"
            >
              Login
            </Link>
            <Link
              href="/onboarding"
              className="w-full py-3 text-center font-bold bg-white text-black rounded-xl hover:bg-neutral-200"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
