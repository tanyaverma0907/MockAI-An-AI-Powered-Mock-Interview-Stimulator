import { AdvancedFeatures } from "../components/home/AdvancedFeatures";
import { AnalyticsPreview } from "../components/home/AnalyticsPreview";
import { BenefitsSection } from "../components/home/BenefitsSection";
import { CTASection } from "../components/home/CTASection";
import { DemoSection } from "../components/home/DemoSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import { HowItWorks } from "../components/home/HowItWorks";
import { Testimonials } from "../components/home/Testimonials";

const HomePage = () => {
  return (
    <div>
      <HeroSection /> 
      <HowItWorks />
      <FeaturesSection />
      <AnalyticsPreview />
      <DemoSection />
      <AdvancedFeatures />
      <BenefitsSection />
      <Testimonials />
      <CTASection />
    </div>
  )
}

export default HomePage;