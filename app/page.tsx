import Hero from '@/components/Hero';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CTASection } from '@/components/landing/CTASection';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <FeaturesSection />
      <TrustSection />
      <HowItWorksSection />
      <CTASection />
      <SiteFooter />
    </>
  );
}
