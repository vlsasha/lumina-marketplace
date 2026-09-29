import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { MonetizeInfoSection } from '@/components/MonetizeInfoSection';
import { StatsSection } from '@/components/StatsSection';
import { HowItWorks } from '@/components/HowItWorks';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <MonetizeInfoSection />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
