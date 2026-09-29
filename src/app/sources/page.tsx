import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SourcesGrid } from '@/components/SourcesGrid';

export default function SourcesPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <SourcesGrid />
      </main>
      <Footer />
    </>
  );
}
