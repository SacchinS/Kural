import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import TechSection from '@/components/TechSection';
import CaregiverSection from '@/components/CaregiverSection';
import MissionSection from '@/components/MissionSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ background: '#1C1C1E', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <TechSection />
      <CaregiverSection />
      <MissionSection />
      <Footer />
    </main>
  );
}
