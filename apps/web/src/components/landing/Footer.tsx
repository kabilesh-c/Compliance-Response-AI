import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-teal to-primary-aqua rounded-lg flex items-center justify-center text-white font-bold text-lg">
                Rx
              </div>
              <span className="text-xl font-bold text-white">PharmaOS</span>
            </Link>
            <p className="mb-6 max-w-sm">
              The most advanced AI-powered operating system for retail pharmacies and hospitals. Built for scale, security, and simplicity.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-teal hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              {["Features", "Pricing", "Retail Mode", "Hospital Mode", "API"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary-teal transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary-teal transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              {["Help Center", "Documentation", "Status", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary-teal transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 PharmaOS. All rights reserved.</p>
          
          {/* Made by section */}
          <div className="flex flex-col items-center gap-3">
            <p className="flex items-center gap-2 text-neutral-300">
              Made with <Heart size={16} className="text-red-500 fill-red-500" /> by <span className="text-white font-semibold">Kabilesh C</span>
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/kabilesh-c20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com/kabilesh-c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a 
                href="mailto:kabileshc.dev@gmail.com"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-teal hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a href="mailto:kabileshc.dev@gmail.com" className="hover:text-white transition-colors">
              kabileshc.dev@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
