import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { TargetAudience } from "@/components/sections/target-audience";
import { SocialProof } from "@/components/sections/social-proof";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Storytelling } from "@/components/sections/storytelling";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Storytelling />
      <Features />
      <SocialProof />
      <TargetAudience />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
