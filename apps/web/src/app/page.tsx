import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustStats from "@/components/landing/TrustStats";
import ExperienceTabs from "@/components/landing/ExperienceTabs";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import AIHighlights from "@/components/landing/AIHighlights";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-primary-teal selection:text-white">
      <Navbar />
      <HeroSection />
      <TrustStats />
      <ExperienceTabs />
      <FeaturesGrid />
      <AIHighlights />
      <ComparisonSection />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
