import { HeroSection } from '@/components/hero';

export default function AboutPage() {
    return (
      <HeroSection
      title="About Us"
      description="Bitcoin District is a network of Bitcoiners who live and work around the greater DC, Maryland and Virginia (DMV) metro area.​"
      image="/images/hero/hero-compass.jpg"
      backgroundOverlay={true}
      variant="centered"
    >
    </HeroSection>
    );
  }
  