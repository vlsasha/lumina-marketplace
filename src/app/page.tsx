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
      {/* Global Full-Page Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMUUxRTFFIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-40" />
      </div>

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
